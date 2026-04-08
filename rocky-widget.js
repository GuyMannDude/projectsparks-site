(function () {
  "use strict";

  // --- Config ---
  const API_BASE = window.ROCKY_WIDGET_API || "";
  const ICON_URL = API_BASE + "/rocky-icon.svg";

  // --- Visitor ID (persistent across sessions) ---
  function getVisitorId() {
    let id = localStorage.getItem("rocky_visitor_id");
    if (!id) {
      id = "v_" + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
      localStorage.setItem("rocky_visitor_id", id);
    }
    return id;
  }

  // --- State (persisted to sessionStorage for page navigation) ---
  const STATE_KEY = "rocky_widget_state";
  function loadState() {
    try {
      const s = sessionStorage.getItem(STATE_KEY);
      return s ? JSON.parse(s) : { messages: [], phase: "idle", open: false, name: null, location: null };
    } catch { return { messages: [], phase: "idle", open: false, name: null, location: null }; }
  }
  function saveState(state) {
    try { sessionStorage.setItem(STATE_KEY, JSON.stringify(state)); } catch {}
  }

  let state = loadState();
  const visitorId = getVisitorId();

  // --- Styles ---
  const style = document.createElement("style");
  style.textContent = `
    #rocky-widget-bubble {
      position: fixed; bottom: 24px; right: 24px; z-index: 99999;
      width: 64px; height: 64px; border-radius: 50%;
      background: linear-gradient(135deg, #e85040, #c0302a);
      box-shadow: 0 4px 20px rgba(212,168,42,0.4), 0 0 0 3px rgba(212,168,42,0.3);
      cursor: pointer; display: flex; align-items: center; justify-content: center;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    #rocky-widget-bubble:hover {
      transform: scale(1.1);
      box-shadow: 0 4px 28px rgba(212,168,42,0.6), 0 0 0 4px rgba(212,168,42,0.4);
    }
    #rocky-widget-bubble img { width: 48px; height: 48px; pointer-events: none; }

    #rocky-widget-window {
      position: fixed; bottom: 100px; right: 24px; z-index: 99998;
      width: 380px; max-width: calc(100vw - 32px); height: 520px; max-height: calc(100vh - 140px);
      background: #0c0c18; border: 1px solid rgba(212,168,42,0.3);
      border-radius: 16px; display: none; flex-direction: column;
      box-shadow: 0 8px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(212,168,42,0.15);
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      overflow: hidden;
    }
    #rocky-widget-window.open { display: flex; }

    .rw-header {
      display: flex; align-items: center; gap: 10px;
      padding: 14px 16px; background: #101020;
      border-bottom: 1px solid rgba(212,168,42,0.2);
    }
    .rw-header img { width: 32px; height: 32px; }
    .rw-header-text { flex: 1; }
    .rw-header-name { color: #d4a82a; font-size: 14px; font-weight: 600; }
    .rw-header-status { color: #9090a0; font-size: 11px; }
    .rw-close {
      background: none; border: none; color: #9090a0; font-size: 20px;
      cursor: pointer; padding: 0 4px; line-height: 1;
    }
    .rw-close:hover { color: #e8e8f0; }

    .rw-messages {
      flex: 1; overflow-y: auto; padding: 16px;
      display: flex; flex-direction: column; gap: 10px;
    }
    .rw-messages::-webkit-scrollbar { width: 4px; }
    .rw-messages::-webkit-scrollbar-track { background: transparent; }
    .rw-messages::-webkit-scrollbar-thumb { background: rgba(212,168,42,0.3); border-radius: 2px; }

    .rw-msg {
      max-width: 85%; padding: 10px 14px; border-radius: 14px;
      font-size: 13px; line-height: 1.5; color: #e8e8f0; word-wrap: break-word;
    }
    .rw-msg.rocky {
      align-self: flex-start; background: #1a1a2e;
      border-bottom-left-radius: 4px;
    }
    .rw-msg.visitor {
      align-self: flex-end; background: #d4a82a; color: #0c0c18;
      border-bottom-right-radius: 4px;
    }
    .rw-msg.typing {
      align-self: flex-start; background: #1a1a2e;
      border-bottom-left-radius: 4px; color: #9090a0; font-style: italic;
    }

    .rw-input-row {
      display: flex; gap: 8px; padding: 12px 16px;
      border-top: 1px solid rgba(212,168,42,0.2); background: #101020;
    }
    .rw-input {
      flex: 1; background: #1a1a2e; border: 1px solid rgba(212,168,42,0.2);
      border-radius: 10px; padding: 10px 14px; color: #e8e8f0; font-size: 13px;
      outline: none; font-family: inherit;
    }
    .rw-input::placeholder { color: #606070; }
    .rw-input:focus { border-color: rgba(212,168,42,0.5); }
    .rw-send {
      background: #d4a82a; border: none; border-radius: 10px;
      padding: 0 16px; color: #0c0c18; font-weight: 600; font-size: 13px;
      cursor: pointer; transition: background 0.2s; white-space: nowrap;
    }
    .rw-send:hover { background: #f0c848; }
    .rw-send:disabled { opacity: 0.5; cursor: not-allowed; }

    .rw-footer {
      display: flex; justify-content: center; padding: 6px 16px 10px;
      background: #101020;
    }
    .rw-wipe {
      background: none; border: none; color: #606070; font-size: 11px;
      cursor: pointer; font-family: inherit; padding: 2px 8px;
      transition: color 0.2s;
    }
    .rw-wipe:hover { color: #e85040; }

    @media (max-width: 480px) {
      #rocky-widget-window {
        bottom: 0; right: 0; left: 0; width: 100%; max-width: 100%;
        height: calc(100vh - 80px); max-height: calc(100vh - 80px);
        border-radius: 16px 16px 0 0;
      }
      #rocky-widget-bubble { bottom: 16px; right: 16px; width: 56px; height: 56px; }
      #rocky-widget-bubble img { width: 40px; height: 40px; }
    }
  `;
  document.head.appendChild(style);

  // --- DOM ---
  const bubble = document.createElement("div");
  bubble.id = "rocky-widget-bubble";
  bubble.innerHTML = `<img src="${ICON_URL}" alt="Peter">`;

  const win = document.createElement("div");
  win.id = "rocky-widget-window";
  win.innerHTML = `
    <div class="rw-header">
      <img src="${ICON_URL}" alt="Peter">
      <div class="rw-header-text">
        <div class="rw-header-name">Peter</div>
        <div class="rw-header-status">Project Sparks assistant</div>
      </div>
      <button class="rw-close" aria-label="Close">&times;</button>
    </div>
    <div class="rw-messages"></div>
    <div class="rw-input-row">
      <input class="rw-input" type="text" placeholder="Type a message..." autocomplete="off">
      <button class="rw-send">Send</button>
    </div>
    <div class="rw-footer">
      <button class="rw-wipe" title="Clear my data">Clear my data</button>
    </div>
  `;

  document.body.appendChild(bubble);
  document.body.appendChild(win);

  const msgBox = win.querySelector(".rw-messages");
  const input = win.querySelector(".rw-input");
  const sendBtn = win.querySelector(".rw-send");
  const closeBtn = win.querySelector(".rw-close");

  // --- Render ---
  function renderMessages() {
    msgBox.innerHTML = "";
    for (const m of state.messages) {
      const div = document.createElement("div");
      div.className = "rw-msg " + (m.role === "assistant" ? "rocky" : "visitor");
      div.textContent = m.content;
      msgBox.appendChild(div);
    }
    msgBox.scrollTop = msgBox.scrollHeight;
  }

  function addMessage(role, content) {
    state.messages.push({ role, content });
    saveState(state);
    renderMessages();
  }

  function showTyping() {
    const div = document.createElement("div");
    div.className = "rw-msg typing";
    div.id = "rw-typing";
    div.textContent = "Peter is thinking...";
    msgBox.appendChild(div);
    msgBox.scrollTop = msgBox.scrollHeight;
  }
  function hideTyping() {
    const el = document.getElementById("rw-typing");
    if (el) el.remove();
  }

  // --- API calls ---
  async function sendChat(userMsg) {
    const apiMessages = state.messages.map((m) => ({
      role: m.role === "visitor" ? "user" : "assistant",
      content: m.content,
    }));

    try {
      const res = await fetch(API_BASE + "/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages, visitor_id: visitorId }),
      });
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      return data.reply;
    } catch {
      return "Oops — my connection hiccupped. Try again in a sec!";
    }
  }

  async function saveVisitor(firstName, location) {
    try {
      await fetch(API_BASE + "/api/save-visitor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visitor_id: visitorId, first_name: firstName, location }),
      });
    } catch {}
  }

  async function checkReturning() {
    try {
      const res = await fetch(API_BASE + "/api/recall/" + visitorId);
      const data = await res.json();
      return data.memory;
    } catch { return null; }
  }


  // --- Onboarding flow ---
  let startingConversation = false;
  async function startConversation() {
    if (state.messages.length > 0 || startingConversation) return;
    startingConversation = true;

    const memory = await checkReturning();
    // Only treat as returning if Mnemo has widget-specific data (contains "first name:")
    if (memory && memory.toLowerCase().includes("first name:")) {
      // Returning visitor — confirmed widget-originated data
      state.phase = "chat";
      saveState(state);
      showTyping();
      try {
        const res = await fetch(API_BASE + "/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [{ role: "user", content: "(Returning visitor opened the chat. Greet them warmly using what you remember. One sentence only.)" }],
            visitor_id: visitorId,
          }),
        });
        hideTyping();
        if (res.ok) {
          const data = await res.json();
          // Only Peter's greeting goes into state — the synthetic prompt does NOT
          addMessage("assistant", data.reply);
        }
      } catch {
        hideTyping();
        addMessage("assistant", "Welcome back! What can I help you with today?");
      }
    } else {
      // New visitor — start onboarding
      state.phase = "ask_name";
      saveState(state);
      addMessage("assistant", "Hey! I\u2019m Peter, your personal guide at Project Sparks. If you want me to remember our conversation for later, I\u2019ll need your first name and a location. Nothing sensitive please. \ud83e\udd9e");
    }
    startingConversation = false;
  }

  // --- Send handler ---
  let sending = false;
  async function handleSend() {
    const text = input.value.trim();
    if (!text || sending) return;
    sending = true;
    sendBtn.disabled = true;
    input.value = "";

    addMessage("visitor", text);

    if (state.phase === "ask_name") {
      // Parse name: extract first real name from freeform input
      let parsed = text.replace(/^(i'm|im|i am|my name is|my name's|they call me|call me|it's|its|hey|hi|hello|yo|sup)\s+/i, "").trim();
      parsed = parsed.split(/[\s,]+/)[0].replace(/[^a-zA-Z'-]/g, "");
      parsed = parsed.charAt(0).toUpperCase() + parsed.slice(1).toLowerCase();
      state.name = parsed || text;
      state.phase = "ask_location";
      saveState(state);
      addMessage("assistant", `Nice to meet you, ${state.name}! Where are you from?`);
      sending = false;
      sendBtn.disabled = false;
      input.focus();
      return;
    }

    if (state.phase === "ask_location") {
      state.location = text;
      state.phase = "chat";
      saveState(state);
      saveVisitor(state.name, state.location);
      addMessage("assistant", `${text} \u2014 cool! So what can I help you with? I know all about Project Sparks products: FrankenClaw, Mnemo Cortex, Rocky\u2019s Switch, and more.`);
      sending = false;
      sendBtn.disabled = false;
      input.focus();
      return;
    }

    // Normal chat
    showTyping();
    const reply = await sendChat(text);
    hideTyping();
    addMessage("assistant", reply);

    // Save conversation to Mnemo periodically (every 3 visitor messages)
    const visitorMsgCount = state.messages.filter((m) => m.role === "visitor").length;
    if (visitorMsgCount % 3 === 0) {
      const recentMsgs = state.messages.slice(-6).map((m) => `${m.role}: ${m.content}`).join("\n");
      saveVisitor(state.name, state.location);
      try {
        await fetch(API_BASE + "/api/save-visitor", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            visitor_id: visitorId,
            first_name: state.name,
            location: state.location,
            conversation_snippet: recentMsgs,
          }),
        });
      } catch {}
    }

    sending = false;
    sendBtn.disabled = false;
    input.focus();
  }

  // --- Events ---
  bubble.addEventListener("click", () => {
    state.open = !state.open;
    saveState(state);
    win.classList.toggle("open", state.open);
    if (state.open) {
      startConversation();
      input.focus();
    }
  });

  closeBtn.addEventListener("click", () => {
    state.open = false;
    saveState(state);
    win.classList.remove("open");
  });

  sendBtn.addEventListener("click", handleSend);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  });

  // --- Wipe handler ---
  const wipeBtn = win.querySelector(".rw-wipe");
  wipeBtn.addEventListener("click", async () => {
    if (!confirm("This will delete your chat history and any data Peter saved about you. Continue?")) return;
    try {
      await fetch(API_BASE + "/api/wipe-visitor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visitor_id: visitorId }),
      });
    } catch {}
    // Clear local state
    state.messages = [];
    state.phase = "idle";
    state.name = null;
    state.location = null;
    state.open = true;
    startingConversation = false;
    saveState(state);
    renderMessages();
    addMessage("assistant", "Your data has been cleared. Fresh start! What can I help you with?");
    state.phase = "ask_name";
    saveState(state);
  });

  // --- Init ---
  if (state.open) {
    win.classList.add("open");
  }
  renderMessages();
})();
