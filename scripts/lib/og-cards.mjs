/**
 * og-cards.mjs — render on-brand 1200×630 social cards in pure Node.
 *
 * Honors the design system (.claude/docs/design.md / design-system.md):
 *   - Two voices in counterpoint: IBM Plex Mono (machine — kicker/locator) +
 *     Cormorant Garamond (human — the title/tagline).
 *   - One accident in cyan (#4ee1d4): a DOT on section cards, a key PHRASE on
 *     title/brand cards.
 *   - Paper ground, page-opening left margin, a ghost-ink rule.
 *
 * Renderer: @resvg/resvg-js + static font instances vendored in scripts/og-fonts/
 * (Cormorant is a variable font; we ship fixed SemiBold/Medium/Italic instances so
 * weight selection is deterministic and Chrome-free — the build runs on Vercel).
 */
import { Resvg } from "@resvg/resvg-js";
import { fileURLToPath } from "url";
import path from "path";

const FONTDIR = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "og-fonts");
const FONTS = [
  "CG-SemiBold.ttf",
  "CG-Medium.ttf",
  "CG-Italic.ttf",
  "IBMPlexMono-Regular.ttf",
  "IBMPlexMono-Medium.ttf",
].map((f) => path.join(FONTDIR, f));

const SERIF_SB = "Cormorant Garamond SemiBold";
const SERIF_IT = "Cormorant Garamond Italic";
const MONO = "IBM Plex Mono";

const PAPER = "#f4f1eb";
const INK = "#1a1a1a";
const INK2 = "#6b6b6b";
const FAINT = "#888888";
const GHOST = "#c8c8c8";
const CYAN = "#4ee1d4";

const X = 96; // page-opening left margin
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Rough advance width (em fraction): Cormorant SemiBold ~0.47, mono ~0.6.
function approxWidth(text, size, mono = false) {
  return [...text].length * size * (mono ? 0.6 : 0.47);
}

// Greedy word-wrap; breaks over-long tokens on / or - so a single word can't overflow.
function wrap(text, size, maxW) {
  const tokens = text.split(" ").flatMap((w) => {
    if (approxWidth(w, size) <= maxW) return [w];
    return w.split(/(?<=[/\-])/); // keep the delimiter on the left chunk
  });
  const lines = [];
  let cur = "";
  for (const t of tokens) {
    const join = cur && !/[/\-]$/.test(cur) ? cur + " " + t : cur + t;
    if (cur && approxWidth(join, size) > maxW) { lines.push(cur); cur = t; }
    else cur = join;
  }
  if (cur) lines.push(cur.trim());
  return lines;
}

function svgWrap(inner) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="${PAPER}"/>${inner}</svg>`;
}

function render(svg) {
  const r = new Resvg(svg, {
    font: { fontFiles: FONTS, loadSystemFonts: false, defaultFontFamily: SERIF_SB },
    fitTo: { mode: "width", value: 1200 },
  });
  return r.render().asPng();
}

const dot = (cy) => `<circle cx="${X + 9}" cy="${cy}" r="9" fill="${CYAN}"/>`;
const rule = (y, w) => `<line x1="${X}" y1="${y}" x2="${X + w}" y2="${y}" stroke="${GHOST}" stroke-width="1"/>`;
const kickerEl = (text, y, size = 23, ls = 7) =>
  `<text x="${X}" y="${y}" font-family="${MONO}" font-size="${size}" letter-spacing="${ls}" fill="${FAINT}">${esc(text)}</text>`;

/** Section card: mono kicker · cyan DOT · big lowercase section title · italic tagline. */
export function sectionCard({ kicker, title, taglineLines }) {
  let size = 138;
  while (approxWidth(title, size) > 1200 - X * 2 && size > 90) size -= 4;
  const tl = taglineLines
    .map((ln, i) => `<text x="${X + (i % 2 ? 34 : 0)}" y="${452 + i * 46}" font-family="${SERIF_IT}" font-size="34" fill="${INK2}">${esc(ln)}</text>`)
    .join("");
  return render(svgWrap(
    kickerEl(kicker, 150) +
    dot(208) +
    `<text x="${X}" y="350" font-family="${SERIF_SB}" font-size="${size}" fill="${INK}">${esc(title)}</text>` +
    tl + rule(556, 268)
  ));
}

/** Title card: mono locator kicker · big auto-fit title (last word cyan) · brand footer. */
export function titleCard({ kicker, title, brand = "XULE LIN · LINXULE.COM" }) {
  const maxW = 1200 - X * 2;
  let size = 120;
  let lines = wrap(title, size, maxW);
  const fits = (ls, s) => ls.length <= 3 && ls.every((l) => approxWidth(l, s) <= maxW) && ls.length * s * 1.04 <= 312;
  while (!fits(lines, size) && size > 56) { size -= 4; lines = wrap(title, size, maxW); }
  const lh = size * 1.04;
  const startY = 315 - (lines.length * lh) / 2 + size * 0.34;
  const words = title.trim().split(/\s+/);
  const accentLast = words.length >= 2;
  const body = lines.map((ln, i) => {
    const y = startY + i * lh;
    if (i === lines.length - 1 && accentLast) {
      const li = ln.lastIndexOf(" ");
      const head = li > 0 ? ln.slice(0, li + 1) : "";
      const tail = li > 0 ? ln.slice(li + 1) : ln;
      return `<text x="${X}" y="${y}" font-family="${SERIF_SB}" font-size="${size}" fill="${INK}">${esc(head)}<tspan fill="${CYAN}">${esc(tail)}</tspan></text>`;
    }
    return `<text x="${X}" y="${y}" font-family="${SERIF_SB}" font-size="${size}" fill="${INK}">${esc(ln)}</text>`;
  }).join("");
  const accentDot = accentLast ? "" : dot(158);
  return render(svgWrap(
    kickerEl(kicker, 120, 22, 6) + accentDot + body +
    rule(520, 220) +
    kickerEl(brand, 556, 20, 4)
  ));
}

/** Brand/default card: big name · italic thesis tagline with one cyan phrase. */
export function brandCard({ name = "Xule Lin", kicker = "LINXULE.COM", taglineLines }) {
  const tl = taglineLines
    .map((ln, i) => {
      const text = typeof ln === "string" ? ln : ln.text;
      const fill = (typeof ln === "object" && ln.accent) ? CYAN : INK2;
      return `<text x="${X + (i % 2 ? 30 : 0)}" y="${410 + i * 48}" font-family="${SERIF_IT}" font-size="35" fill="${fill}">${esc(text)}</text>`;
    })
    .join("");
  return render(svgWrap(
    kickerEl(kicker, 150) +
    `<text x="${X - 2}" y="300" font-family="${SERIF_SB}" font-size="116" letter-spacing="2" fill="${INK}">${esc(name)}</text>` +
    tl + rule(556, 268)
  ));
}
