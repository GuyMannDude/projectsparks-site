#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════
# The Project Sparks Stack Installer
# https://projectsparks.ai/stack
#
# Install Rocky's Switch + FrankenClaw + Mnemo Cortex
# All MCP. All open source. All local.
#
# Usage: curl -fsSL https://projectsparks.ai/install.sh | bash
# ═══════════════════════════════════════════════════════════════
set -euo pipefail

# ─── Colors ───
RED='\033[0;31m'
GREEN='\033[0;32m'
GOLD='\033[0;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
DIM='\033[2m'
RESET='\033[0m'

# ─── Defaults ───
INSTALL_BASE="${SPARKS_DIR:-$HOME/sparks-stack}"
SWITCH_PORT=50060
MNEMO_PORT=50001
OPENCLAW_DETECTED=false
OPENCLAW_CONFIG=""
OS_TYPE=""

# ─── Helpers ───
info()    { echo -e "${CYAN}[info]${RESET} $1"; }
success() { echo -e "${GREEN}[done]${RESET} $1"; }
warn()    { echo -e "${GOLD}[warn]${RESET} $1"; }
fail()    { echo -e "${RED}[fail]${RESET} $1"; exit 1; }
ask()     { echo -en "${BOLD}$1${RESET} "; read -r REPLY; }
divider() { echo -e "${DIM}────────────────────────────────────────────${RESET}"; }

# ─── OS Detection ───
detect_os() {
  case "$(uname -s)" in
    Linux*)  OS_TYPE="linux" ;;
    Darwin*) OS_TYPE="mac" ;;
    *)       fail "Unsupported OS: $(uname -s). This installer supports Ubuntu and macOS." ;;
  esac
}

# ─── Dependency Checks ───
check_deps() {
  local missing=()

  if ! command -v git &>/dev/null; then missing+=("git"); fi
  if ! command -v python3 &>/dev/null; then missing+=("python3"); fi
  if ! command -v node &>/dev/null; then missing+=("node/npm"); fi
  if ! command -v npm &>/dev/null && ! command -v node &>/dev/null; then missing+=("npm"); fi

  if [ ${#missing[@]} -gt 0 ]; then
    echo ""
    warn "Missing dependencies: ${missing[*]}"
    echo ""
    if [ "$OS_TYPE" = "linux" ]; then
      echo "  Install them with:"
      echo "    sudo apt update && sudo apt install -y git python3 python3-pip python3-venv nodejs npm"
    else
      echo "  Install them with:"
      echo "    brew install git python3 node"
    fi
    echo ""
    ask "Try to install now? [y/N]"
    if [[ "$REPLY" =~ ^[Yy]$ ]]; then
      if [ "$OS_TYPE" = "linux" ]; then
        sudo apt update && sudo apt install -y git python3 python3-pip python3-venv nodejs npm
      else
        if ! command -v brew &>/dev/null; then
          fail "Homebrew not found. Install it first: https://brew.sh"
        fi
        brew install git python3 node
      fi
    else
      fail "Cannot continue without: ${missing[*]}"
    fi
  fi

  # Verify versions
  local node_ver
  node_ver=$(node --version 2>/dev/null | sed 's/v//' | cut -d. -f1)
  if [ -n "$node_ver" ] && [ "$node_ver" -lt 18 ]; then
    warn "Node.js v${node_ver} detected. v18+ recommended."
  fi

  local py_ver
  py_ver=$(python3 -c "import sys; print(f'{sys.version_info.major}.{sys.version_info.minor}')" 2>/dev/null)
  info "Python: ${py_ver:-unknown} | Node: $(node --version 2>/dev/null || echo 'unknown')"
}

# ─── OpenClaw Detection ───
detect_openclaw() {
  if command -v openclaw &>/dev/null; then
    OPENCLAW_DETECTED=true
    # Try to find config
    for path in "$HOME/.openclaw/workspace/openclaw.json" "$HOME/.openclaw/openclaw.json"; do
      if [ -f "$path" ]; then
        OPENCLAW_CONFIG="$path"
        break
      fi
    done
    success "OpenClaw detected$([ -n "$OPENCLAW_CONFIG" ] && echo " (config: $OPENCLAW_CONFIG)")"
  fi
}

# ─── Clone or Update Repo ───
clone_or_update() {
  local name="$1" repo="$2" dir="$3"

  if [ -d "$dir" ]; then
    info "Updating ${name}..."
    cd "$dir" && git pull --quiet 2>/dev/null || warn "Git pull failed for ${name} — using existing files"
    cd - >/dev/null
  else
    info "Cloning ${name}..."
    git clone --quiet "$repo" "$dir"
  fi
}

# ═══════════════════════════════════════════════
# INSTALLERS
# ═══════════════════════════════════════════════

install_switch() {
  divider
  echo -e "${BOLD}${GOLD}Rocky's Switch${RESET} — Model Switcher"
  divider

  local dir="$INSTALL_BASE/rockys-switch"
  clone_or_update "Rocky's Switch" "https://github.com/GuyMannDude/rockys-switch.git" "$dir"

  cd "$dir"
  info "Installing npm dependencies..."
  npm install --quiet 2>/dev/null

  # Config setup
  local config_dir="$HOME/.rockys-switch"
  mkdir -p "$config_dir"

  if [ ! -f "$config_dir/keys.json" ]; then
    info "Setting up API keys..."
    echo ""
    echo "  Rocky's Switch needs at least one API key to route requests."
    echo "  You can add more later in the web UI at http://localhost:${SWITCH_PORT}"
    echo ""

    local keys_json='{'
    local has_key=false

    ask "  OpenRouter API key (or press Enter to skip):"
    if [ -n "$REPLY" ]; then
      keys_json+="\"openrouter\":\"$REPLY\""
      has_key=true
    fi

    ask "  Anthropic API key (or press Enter to skip):"
    if [ -n "$REPLY" ]; then
      [ "$has_key" = true ] && keys_json+=","
      keys_json+="\"anthropic\":\"$REPLY\""
      has_key=true
    fi

    ask "  OpenAI API key (or press Enter to skip):"
    if [ -n "$REPLY" ]; then
      [ "$has_key" = true ] && keys_json+=","
      keys_json+="\"openai\":\"$REPLY\""
      has_key=true
    fi

    ask "  Google API key (or press Enter to skip):"
    if [ -n "$REPLY" ]; then
      [ "$has_key" = true ] && keys_json+=","
      keys_json+="\"google\":\"$REPLY\""
      has_key=true
    fi

    keys_json+='}'
    echo "$keys_json" > "$config_dir/keys.json"
    chmod 600 "$config_dir/keys.json"
    success "Keys saved to $config_dir/keys.json (permissions: 600)"
  else
    success "Keys file already exists at $config_dir/keys.json"
  fi

  # Config file
  if [ ! -f "$config_dir/config.json" ]; then
    cat > "$config_dir/config.json" <<'CONF'
{
  "port": 50060,
  "switchState": false,
  "freeModel": "nvidia/nemotron-3-super-120b-a12b:free",
  "selectedProvider": "openrouter",
  "selectedModel": ""
}
CONF
    success "Default config created"
  fi

  # OpenClaw integration
  if [ "$OPENCLAW_DETECTED" = true ]; then
    echo ""
    ask "  Point OpenClaw at Rocky's Switch (localhost:${SWITCH_PORT})? [Y/n]"
    if [[ ! "$REPLY" =~ ^[Nn]$ ]]; then
      if [ -n "$OPENCLAW_CONFIG" ]; then
        info "Update your openclaw.json openrouter baseUrl to:"
        echo "    \"baseUrl\": \"http://127.0.0.1:${SWITCH_PORT}/v1\""
        echo ""
        warn "Auto-editing openclaw.json is risky — please update manually."
      else
        info "Add this to your openclaw.json openrouter config:"
        echo "    \"baseUrl\": \"http://127.0.0.1:${SWITCH_PORT}/v1\""
      fi
    fi
  fi

  success "Rocky's Switch installed at $dir"
  echo "  Start: cd $dir && node server.js"
  echo "  UI: http://localhost:${SWITCH_PORT}"
  echo ""
}

install_frankenclaw() {
  divider
  echo -e "${BOLD}${GOLD}FrankenClaw${RESET} — MCP Tool Server"
  divider

  local dir="$INSTALL_BASE/frankenclaw"
  clone_or_update "FrankenClaw" "https://github.com/GuyMannDude/frankenclaw.git" "$dir"

  cd "$dir"
  info "Installing Python dependencies..."

  # Use venv
  if [ ! -d "venv" ]; then
    python3 -m venv venv
  fi
  source venv/bin/activate
  pip install --quiet --upgrade pip
  pip install --quiet -r requirements.txt
  deactivate

  # Config
  local config_dir="$HOME/.frankenclaw"
  mkdir -p "$config_dir"

  if [ ! -f "$config_dir/config.json" ]; then
    cat > "$config_dir/config.json" <<'CONF'
{
  "searxng_url": "http://localhost:8888",
  "vision_model": "google/gemini-2.5-flash",
  "firecrawl_api_key": ""
}
CONF
    success "Default config created at $config_dir/config.json"
    info "Edit config to add your SearXNG URL, vision model, and Firecrawl key."
  else
    success "Config already exists at $config_dir/config.json"
  fi

  # OpenClaw integration
  if [ "$OPENCLAW_DETECTED" = true ]; then
    echo ""
    ask "  Register FrankenClaw with OpenClaw? [Y/n]"
    if [[ ! "$REPLY" =~ ^[Nn]$ ]]; then
      local server_path="$dir/venv/bin/python $dir/server.py"
      info "Register with:"
      echo "    openclaw mcp set frankenclaw \"$server_path\""
      echo "    openclaw gateway restart"
      echo ""
      warn "Run these commands after the installer finishes."
    fi
  fi

  success "FrankenClaw installed at $dir"
  echo "  Start: cd $dir && venv/bin/python server.py"
  echo ""
}

install_mnemo() {
  divider
  echo -e "${BOLD}${GOLD}Mnemo Cortex${RESET} — Persistent Agent Memory"
  divider

  local dir="$INSTALL_BASE/mnemo-cortex"
  clone_or_update "Mnemo Cortex" "https://github.com/GuyMannDude/mnemo-cortex.git" "$dir"

  cd "$dir"
  info "Installing Python dependencies..."

  # Use venv
  if [ ! -d "venv" ]; then
    python3 -m venv venv
  fi
  source venv/bin/activate
  pip install --quiet --upgrade pip
  pip install --quiet -e ".[all]" 2>/dev/null || pip install --quiet -r requirements.txt
  deactivate

  # Data directory
  local data_dir="$HOME/.agentb"
  mkdir -p "$data_dir"/{memory,cache/l1,cache/l2,logs}

  # Config
  local config_dir="$HOME/.config/agentb"
  mkdir -p "$config_dir"

  if [ ! -f "$config_dir/agentb.yaml" ]; then
    ask "  Mnemo Cortex port [${MNEMO_PORT}]:"
    local port="${REPLY:-$MNEMO_PORT}"

    cat > "$config_dir/agentb.yaml" <<CONF
server:
  host: 127.0.0.1
  port: ${port}

storage:
  data_dir: ${data_dir}

llm:
  provider: ollama
  model: qwen2.5:32b-instruct
  embedding_model: nomic-embed-text
  ollama_url: http://localhost:11434
CONF
    success "Config created at $config_dir/agentb.yaml"
    echo ""
    info "Default LLM: Ollama (local, free). Edit agentb.yaml to use OpenRouter or other providers."

    if ! command -v ollama &>/dev/null; then
      warn "Ollama not found. Install it for free local LLM: https://ollama.ai"
      echo "  Or edit $config_dir/agentb.yaml to use a different provider."
    fi
  else
    success "Config already exists at $config_dir/agentb.yaml"
  fi

  # Init database
  info "Initializing database..."
  source venv/bin/activate
  python3 -c "
import sqlite3, os
db_path = os.path.expanduser('~/.agentb/memory/mnemo.db')
if not os.path.exists(db_path):
    conn = sqlite3.connect(db_path)
    conn.execute('CREATE TABLE IF NOT EXISTS chunks (id INTEGER PRIMARY KEY, agent_id TEXT, content TEXT, embedding BLOB, created_at TEXT, metadata TEXT)')
    conn.execute('CREATE VIRTUAL TABLE IF NOT EXISTS chunks_fts USING fts5(content, agent_id)')
    conn.commit()
    conn.close()
    print('  Database initialized.')
else:
    print('  Database already exists.')
" 2>/dev/null || warn "Database init skipped — will be created on first run."
  deactivate

  success "Mnemo Cortex installed at $dir"
  echo "  Start: cd $dir && venv/bin/python -m agentb.server"
  echo "  Health: curl http://localhost:${MNEMO_PORT}/health"
  echo ""
}

# ═══════════════════════════════════════════════
# WIRING (Full Stack only)
# ═══════════════════════════════════════════════

wire_stack() {
  divider
  echo -e "${BOLD}${GOLD}Wiring the Stack${RESET}"
  divider

  info "FrankenClaw reads API keys from Rocky's Switch (~/.rockys-switch/keys.json)"
  info "Mnemo Cortex provides memory to any agent via port ${MNEMO_PORT}"
  info "Rocky's Switch proxies all model calls via port ${SWITCH_PORT}"

  echo ""
  echo -e "${BOLD}Quick start:${RESET}"
  echo ""
  echo "  # Terminal 1 — Rocky's Switch"
  echo "  cd $INSTALL_BASE/rockys-switch && node server.js"
  echo ""
  echo "  # Terminal 2 — Mnemo Cortex"
  echo "  cd $INSTALL_BASE/mnemo-cortex && venv/bin/python -m agentb.server"
  echo ""
  echo "  # Terminal 3 — FrankenClaw (if using standalone)"
  echo "  cd $INSTALL_BASE/frankenclaw && venv/bin/python server.py"
  echo ""

  if [ "$OPENCLAW_DETECTED" = true ]; then
    echo -e "${BOLD}OpenClaw integration:${RESET}"
    echo ""
    echo "  1. Point OpenClaw at Rocky's Switch:"
    echo "     Edit openclaw.json: \"baseUrl\": \"http://127.0.0.1:${SWITCH_PORT}/v1\""
    echo ""
    echo "  2. Register FrankenClaw as MCP server:"
    echo "     openclaw mcp set frankenclaw \"$INSTALL_BASE/frankenclaw/venv/bin/python $INSTALL_BASE/frankenclaw/server.py\""
    echo "     openclaw gateway restart"
    echo ""
    echo "  3. Add Mnemo Cortex hooks to your agent workspace."
    echo "     See: https://github.com/GuyMannDude/mnemo-cortex/tree/master/integrations"
    echo ""
  fi
}

# ═══════════════════════════════════════════════
# MENU
# ═══════════════════════════════════════════════

show_banner() {
  echo ""
  echo -e "${GOLD}═══════════════════════════════════════════════════${RESET}"
  echo -e "${BOLD}     The Project Sparks Stack Installer${RESET}"
  echo -e "${DIM}     projectsparks.ai/stack${RESET}"
  echo -e "${GOLD}═══════════════════════════════════════════════════${RESET}"
  echo ""
}

show_menu() {
  echo "  What would you like to install?"
  echo ""
  echo -e "    ${BOLD}[1]${RESET} Full Stack ${DIM}(Rocky's Switch + FrankenClaw + Mnemo Cortex)${RESET}"
  echo -e "    ${BOLD}[2]${RESET} Rocky's Switch only"
  echo -e "    ${BOLD}[3]${RESET} FrankenClaw only"
  echo -e "    ${BOLD}[4]${RESET} Mnemo Cortex only"
  echo -e "    ${BOLD}[5]${RESET} Pick and choose"
  echo ""
  ask "  Choice [1-5]:"
}

pick_and_choose() {
  local do_switch=false do_franken=false do_mnemo=false

  ask "  Install Rocky's Switch? [Y/n]"
  [[ ! "$REPLY" =~ ^[Nn]$ ]] && do_switch=true

  ask "  Install FrankenClaw? [Y/n]"
  [[ ! "$REPLY" =~ ^[Nn]$ ]] && do_franken=true

  ask "  Install Mnemo Cortex? [Y/n]"
  [[ ! "$REPLY" =~ ^[Nn]$ ]] && do_mnemo=true

  [ "$do_switch" = true ] && install_switch
  [ "$do_franken" = true ] && install_frankenclaw
  [ "$do_mnemo" = true ] && install_mnemo

  # Wire if all three selected
  if [ "$do_switch" = true ] && [ "$do_franken" = true ] && [ "$do_mnemo" = true ]; then
    wire_stack
  fi
}

# ═══════════════════════════════════════════════
# MAIN
# ═══════════════════════════════════════════════

main() {
  show_banner
  detect_os
  check_deps
  detect_openclaw

  echo ""
  ask "Install directory [$INSTALL_BASE]:"
  [ -n "$REPLY" ] && INSTALL_BASE="$REPLY"
  mkdir -p "$INSTALL_BASE"

  echo ""
  show_menu

  case "$REPLY" in
    1)
      install_switch
      install_frankenclaw
      install_mnemo
      wire_stack
      ;;
    2) install_switch ;;
    3) install_frankenclaw ;;
    4) install_mnemo ;;
    5) pick_and_choose ;;
    *)
      warn "Invalid choice. Running full stack install."
      install_switch
      install_frankenclaw
      install_mnemo
      wire_stack
      ;;
  esac

  divider
  echo ""
  echo -e "${GREEN}${BOLD}Installation complete.${RESET}"
  echo ""
  echo -e "  ${DIM}Installed to: $INSTALL_BASE${RESET}"
  echo -e "  ${DIM}Docs: https://projectsparks.ai/stack${RESET}"
  echo -e "  ${DIM}GitHub: https://github.com/GuyMannDude${RESET}"
  echo ""
  echo -e "${GOLD}Not touched by human minds.${RESET}"
  echo ""
}

main "$@"
