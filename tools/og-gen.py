#!/usr/bin/env python3
"""Generate social-preview cards (Open Graph / GitHub) for projectsparks.ai.

One template, the site's own fonts and palette, so every link we share renders
the same way. Site cards are 1200x630 at <page>/og.png; GitHub cards are
1280x640 under tools/out/github/<repo>.png (uploaded by hand or by browser:
repo Settings -> General -> Social preview).

    python3 tools/og-gen.py            # all cards
    python3 tools/og-gen.py omnemo-os  # one card (site + github if defined)
"""
import os, subprocess, sys, tempfile
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FONTS = os.path.join(ROOT, "tools", "fonts")
OUT_GH = os.path.join(ROOT, "tools", "out", "github")

# Palette from assets/sparks.css, flipped to the dark card used by og-image.png
BG = (11, 14, 20)
INK = (255, 255, 255)
INK_SOFT = (185, 198, 214)      # --line-strong
INK_FAINT = (113, 129, 154)     # --ink-faint
GOLD = (232, 162, 0)            # --gold
AZURE = (11, 107, 221)          # --azure
LINE = (36, 44, 58)


def font(name, size, weight=None):
    f = ImageFont.truetype(os.path.join(FONTS, name), size)
    if weight is not None:
        try:
            f.set_variation_by_axes([weight])
        except Exception:
            pass
    return f


def display(size): return font("Michroma-Regular.ttf", size)
def label(size): return font("ChakraPetch-SemiBold.ttf", size)
def body(size, w=500): return font("HankenGrotesk.ttf", size, w)
def mono(size, w=500): return font("JetBrainsMono.ttf", size, w)


def text_w(draw, s, f, spacing=0):
    if not s:
        return 0
    w = draw.textlength(s, font=f)
    return w + spacing * (len(s) - 1)


def draw_spaced(draw, xy, s, f, fill, spacing):
    x, y = xy
    for ch in s:
        draw.text((x, y), ch, font=f, fill=fill)
        x += draw.textlength(ch, font=f) + spacing


def wrap(draw, s, f, max_w):
    words, lines, cur = s.split(), [], ""
    for w in words:
        t = (cur + " " + w).strip()
        if draw.textlength(t, font=f) <= max_w:
            cur = t
        else:
            lines.append(cur); cur = w
    if cur:
        lines.append(cur)
    return lines


def mark_png(px):
    """Render assets/sparks-mark.svg to a PNG of height px (rsvg-convert)."""
    svg = os.path.join(ROOT, "assets", "sparks-mark.svg")
    fd, tmp = tempfile.mkstemp(suffix=".png"); os.close(fd)
    subprocess.run(["rsvg-convert", "-h", str(px), "-o", tmp, svg], check=True)
    im = Image.open(tmp).convert("RGBA"); os.unlink(tmp)
    return im


def glow(im, center, radius, color, alpha):
    layer = Image.new("RGBA", im.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    x, y = center
    d.ellipse([x - radius, y - radius, x + radius, y + radius], fill=color + (alpha,))
    layer = layer.filter(ImageFilter.GaussianBlur(radius * 0.6))
    im.alpha_composite(layer)


def pentagon(im, cx, cy, r, alpha=28):
    """The faint constellation from og-image.png."""
    import math
    pts = [(cx + r * math.cos(math.radians(-90 + i * 72)),
            cy + r * math.sin(math.radians(-90 + i * 72))) for i in range(5)]
    layer = Image.new("RGBA", im.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    d.polygon(pts, outline=GOLD + (alpha,), width=1)
    for p in pts:
        d.ellipse([p[0] - 4, p[1] - 4, p[0] + 4, p[1] + 4], fill=GOLD + (alpha + 20,))
    im.alpha_composite(layer)


def card(spec, size):
    W, H = size
    im = Image.new("RGBA", size, BG + (255,))
    glow(im, (int(W * 0.12), int(H * 0.1)), int(H * 0.55), AZURE, 34)
    glow(im, (int(W * 0.9), int(H * 0.95)), int(H * 0.5), GOLD, 26)
    pentagon(im, int(W * 0.5), int(H * 0.52), int(H * 0.62))
    d = ImageDraw.Draw(im)

    pad = int(W * 0.065)
    # ---- header: mark + PROJECT SPARKS, badge on the right
    mk = mark_png(52)
    im.alpha_composite(mk, (pad, pad - 6))
    draw_spaced(d, (pad + 66, pad + 10), "PROJECT SPARKS", label(22), INK_FAINT, 3)
    if spec.get("badge"):
        bf = label(19)
        bw = text_w(d, spec["badge"], bf, 2) + 36
        x1, y1 = W - pad - bw, pad - 2
        d.rounded_rectangle([x1, y1, x1 + bw, y1 + 40], radius=20, outline=GOLD, width=1)
        draw_spaced(d, (x1 + 18, y1 + 9), spec["badge"], bf, GOLD, 2)

    # ---- body block, vertically centred in the free band
    inset = spec.get("inset")
    strip = None
    if inset:
        strip = Image.open(os.path.join(ROOT, inset)).convert("RGBA")
        sw = W - 2 * pad
        sh = int(strip.height * sw / strip.width)
        strip = strip.resize((sw, sh), Image.Resampling.LANCZOS)
        sy = H - 100 - sh
    band_top = pad + 86
    band_bot = (sy - 22) if inset else (H - 120)

    title_f = display(spec.get("title_size", 74))
    while text_w(d, spec["title"], title_f) > W - 2 * pad and title_f.size > 40:
        title_f = display(title_f.size - 2)
    kicker_f = label(26)
    tag_f = body(30, 450)
    tag_lines = wrap(d, spec.get("tagline", ""), tag_f, W - 2 * pad)

    block_h = title_f.size + 24 + 30 + (18 + len(tag_lines) * 40 if tag_lines else 0)
    y = band_top + max(0, (band_bot - band_top - block_h) // 2)

    d.text((pad - 4, y), spec["title"], font=title_f, fill=INK)
    y += title_f.size + 24
    draw_spaced(d, (pad, y), spec["kicker"].upper(), kicker_f, GOLD, 3)
    y += 30 + 18
    for ln in tag_lines:
        d.text((pad, y), ln, font=tag_f, fill=INK_SOFT)
        y += 40

    # ---- optional inset strip (e.g. the Omnemo OS bar) above the footer
    if strip is not None:
        mask = Image.new("L", strip.size, 0)
        ImageDraw.Draw(mask).rounded_rectangle([0, 0, sw, sh], radius=12, fill=255)
        shadow = Image.new("RGBA", im.size, (0, 0, 0, 0))
        ImageDraw.Draw(shadow).rounded_rectangle([pad, sy + 6, pad + sw, sy + sh + 6], radius=12, fill=(0, 0, 0, 140))
        im.alpha_composite(shadow.filter(ImageFilter.GaussianBlur(10)))
        im.paste(strip, (pad, sy), mask)
        d.rounded_rectangle([pad, sy, pad + sw, sy + sh], radius=12, outline=LINE, width=1)

    # ---- footer: url + chrome rail with gold tick
    d.text((pad, H - 72), spec["url"], font=mono(22, 500), fill=INK_FAINT)
    rail_y = H - 28
    for x in range(pad, W - pad):
        t = (x - pad) / (W - 2 * pad)
        c = (int(60 + 120 * (1 - abs(t - 0.5) * 2)),) * 3
        d.line([(x, rail_y), (x, rail_y + 1)], fill=c)
    d.line([(pad, rail_y), (pad + 90, rail_y)], fill=GOLD, width=2)
    return im.convert("RGB")


# ---------------------------------------------------------------------------
SITE = {
    "omnemo-os": dict(title="Omnemo OS", kicker="Omarchy, made easy, made for memory",
                      tagline="A friendlier Omarchy desktop with Omnemo memory built in.",
                      badge="v0.9 PUBLIC PREVIEW · FREE", inset="omnemo-os/images/bar.png", title_size=78),
    "omnemo": dict(title="Omnemo", kicker="Memory for Omarchy",
                   tagline="One shared memory for every AI agent on the box. Save in one, recall in any.",
                   badge="FREE · OPEN SOURCE", title_size=92),
    "products": dict(title="Products", kicker="The Project Sparks line",
                     tagline="Mnemo Cortex · Omnemo · Omnemo OS · Disco-Bus · Cortex Stick. All open source."),
    "about": dict(title="About", kicker="Project Sparks",
                  tagline="One maker and his AI agents, building open-source memory and tools from Half Moon Bay, California."),
    "stack": dict(title="The Stack", kicker="AI agent infrastructure",
                  tagline="Brains, tools and cost control for AI agents. All MCP, all open source, all local."),
    "cortex-harness": dict(title="Cortex Harness", kicker="A forkable AI-agent framework",
                           tagline="Pick a vertical, edit one file, build, run. Memory-backed by Mnemo Cortex.", badge="OPEN SOURCE"),
    "cortex-stick": dict(title="Cortex Stick", kicker="Sneakernet for AI memory",
                         tagline="A USB stick that couriers your AI's memory between two machines. No cloud, no VPN, no account.", badge="OPEN SOURCE"),
    "gallery": dict(title="Rocky's Gallery", kicker="Art and 3D prints, run by an AI",
                    tagline="Fine-art photography and free 3D models, curated and operated by Rocky.", badge="FREE · DONATE"),
    "disco-bus": dict(title="Disco-Bus", kicker="Delivery-confirmed agent messaging",
                      tagline="A push-based message bus for AI agents. Discord is the doorbell, the bus is the mailbox, the tracking ID is the receipt.", badge="OPEN SOURCE"),
    "frankenclaw": dict(title="FrankenClaw", kicker="Withdrawn from public distribution",
                        tagline="The MCP tool chassis from Project Sparks continues privately."),
    "sparks-brain": dict(title="Sparks Brain", kicker="Now mnemo-plan",
                         tagline="Renamed and folded into Mnemo Cortex."),
}

GITHUB = {
    "omnemo-os": dict(SITE["omnemo-os"], url="github.com/GuyMannDude/omnemo-os"),
    "omnemo": dict(SITE["omnemo"], url="github.com/GuyMannDude/omnemo"),
    "disco-bus": dict(SITE["disco-bus"], url="github.com/GuyMannDude/disco-bus"),
    "cortex-harness": dict(SITE["cortex-harness"], url="github.com/GuyMannDude/cortex-harness"),
    "projectsparks-site": dict(title="projectsparks.ai", kicker="The Project Sparks website",
                               tagline="Source for projectsparks.ai: product pages, the gallery and the llms.txt manifest.",
                               url="github.com/GuyMannDude/projectsparks-site"),
    "cronalarm": dict(title="CronAlarm", kicker="The cron wrapper that screams",
                      tagline="Discord, SMS and Telegram alerts the moment a cron job fails.", badge="OPEN SOURCE",
                      url="github.com/GuyMannDude/cronalarm"),
    "mnemo-cortex-mcp": dict(title="Mnemo Cortex MCP", kicker="Persistent memory for Claude Desktop",
                             tagline="The MCP server bridge that gives Claude Desktop semantic memory from Mnemo Cortex.", badge="OPEN SOURCE",
                             url="github.com/GuyMannDude/mnemo-cortex-mcp"),
    "sparks-bus-mcp": dict(title="Sparks Bus MCP", kicker="Inter-agent message broker",
                           tagline="SQLite-backed MCP bus: real-time listen, threaded replies, broadcast, wake. Pairs with Mnemo Cortex.", badge="OPEN SOURCE",
                           url="github.com/GuyMannDude/sparks-bus-mcp"),
    "sparc-thesis": dict(title="SPARC", kicker="Sparks Protocol for Adaptive Reasoning and Communication",
                         tagline="An AI way of life. The thesis behind Project Sparks.",
                         url="github.com/GuyMannDude/sparc-thesis"),
}


def main(only=None):
    os.makedirs(OUT_GH, exist_ok=True)
    for name, spec in SITE.items():
        if only and name != only:
            continue
        spec = dict(spec, url=f"projectsparks.ai/{name}")
        out = os.path.join(ROOT, name, "og.png")
        card(spec, (1200, 630)).save(out, optimize=True)
        print("site  ", out)
    for name, spec in GITHUB.items():
        if only and name != only:
            continue
        out = os.path.join(OUT_GH, f"{name}.png")
        card(spec, (1280, 640)).save(out, optimize=True)
        print("github", out)


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else None)
