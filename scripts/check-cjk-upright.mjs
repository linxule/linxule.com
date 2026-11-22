#!/usr/bin/env bun
// Fails when a built page sets an upright CJK character in a serif face ('Noto Serif SC') that the shipped
// self-hosted Noto Serif SC subset does not contain. Browser-free, so it runs in `verify`.
//
// Scope:
//   - Only upright (non-italic) CJK text rendered in serif stacks (--font-serif, --font-display, --font-small).
//   - Elements in --font-mono (and <code>/<pre>/<kbd>/<samp>) are excluded: Chinese in the mono voice intentionally
//     uses the reader's system sans (PingFang / YaHei) per design-system.md.
//   - Tracks static CSS specificity and cascade order (including font-style: normal overrides inside italic parents,
//     and font-weight: 300 / 400 / 500) so each weight slice carries only the characters rendered at that weight.
//
// Usage: bun scripts/check-cjk-upright.mjs [--collect]   (from the repo root, after a build)
//   default    compare against src/assets/fonts/noto-upright.chars.txt and the unicode-range of each weight's
//              shared/cv-zh @font-face in src/assets/css/main.css; exit 1 naming weight, page + characters.
//   --collect  print {"<page>": {"300": "...", "400": "...", "500": "..."}} as JSON for scripts/gen-noto-sc.mjs.
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { expandUnicodeRange } from "./check-cjk-italic.mjs";

const SITE = process.env.SITE_DIR || "_site";
const CHARS = process.env.NOTO_CHARS || "src/assets/fonts/noto-upright.chars.txt";
const FONTS_CSS = process.env.FONTS_CSS || "src/assets/css/main.css";
const SKIP = [/^assets\//, /^tsm\//, /^pagefind\//, /^play\//];
const CJK = /[⺀-⿿　-〿㐀-鿿豈-﫿＀-￯]|[\uD840-\uD87F][\uDC00-\uDFFF]/gu;
const UA_ITALIC = new Set(["em", "i", "cite", "dfn", "var", "address"]);
const UA_MONO = new Set(["code", "pre", "kbd", "samp", "tt"]);
const UA_BOLD = new Set(["strong", "b", "th"]);
const VOID = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr"]);
const WEIGHTS = ["300", "400", "500"];

function normalizeWeight(raw) {
  const v = raw.trim().toLowerCase();
  if (v === "300" || v === "200" || v === "100" || v === "lighter") return "300";
  if (v === "400" || v === "normal") return "400";
  if (v === "500" || v === "600" || v === "700" || v === "800" || v === "900" || v === "bold" || v === "bolder") return "500";
  const n = parseInt(v, 10);
  if (!Number.isNaN(n)) return n <= 350 ? "300" : n >= 450 ? "500" : "400";
  return null;
}

function parseDeclarations(declText) {
  const d = {};
  const clean = declText.replace(/!important/gi, "");
  for (const part of clean.split(";")) {
    const idx = part.indexOf(":");
    if (idx < 0) continue;
    const prop = part.slice(0, idx).trim().toLowerCase();
    const val = part.slice(idx + 1).trim();
    if (!val) continue;
    if (prop === "font-family") {
      if (/var\(\s*--font-mono\b/i.test(val)) d.family = "mono";
      else if (/var\(\s*--font-(?:serif|display|small)\b/i.test(val)) d.family = "serif";
    } else if (prop === "font-style") {
      if (/\b(?:italic|oblique)\b/i.test(val)) d.style = "italic";
      else if (/\bnormal\b/i.test(val)) d.style = "normal";
    } else if (prop === "font-weight") {
      const w = normalizeWeight(val);
      if (w) d.weight = w;
    } else if (prop === "font") {
      if (/var\(\s*--font-mono\b/i.test(val)) d.family = "mono";
      else if (/var\(\s*--font-(?:serif|display|small)\b/i.test(val)) d.family = "serif";
      if (/\b(?:italic|oblique)\b/i.test(val)) d.style = "italic";
      else d.style = "normal";
      const wm = val.match(/\b(100|200|300|400|500|600|700|800|900|bold)\b/i);
      d.weight = wm ? normalizeWeight(wm[1]) : "400";
    }
  }
  return Object.keys(d).length ? d : null;
}

function parseSelector(s) {
  const tokens = s.replace(/\s*([>+~])\s*/g, " $1 ").trim().split(/\s+/);
  const parts = [];
  let comb = " ";
  let ids = 0, classes = 0, tags = 0;
  for (const t of tokens) {
    if (t === ">" || t === "+" || t === "~") { comb = t === ">" ? ">" : " "; continue; }
    const attrCount = (t.match(/\[[^\]]*\]/g) || []).length;
    const pseudoCount = (t.match(/:(?!not\b)[\w-]+(\([^)]*\))?/g) || []).length;
    const c = t.replace(/\[[^\]]*\]/g, "").replace(/:{1,2}[\w-]+(\([^)]*\))?/g, "");
    const tag = (c.match(/^[a-zA-Z][\w-]*/) || [""])[0].toLowerCase();
    const id = (c.match(/#([\w-]+)/) || [])[1] || "";
    const cls = [...c.matchAll(/\.([\w-]+)/g)].map((x) => x[1]);
    if (id) ids++;
    classes += cls.length + attrCount + pseudoCount;
    if (tag) tags++;
    parts.push({ tag, id, classes: cls, combToLeft: parts.length ? comb : null });
    comb = " ";
  }
  if (!parts.length) return null;
  return { parts: parts.reverse(), spec: ids * 1e6 + classes * 1e3 + tags };
}

export function fontRules(css, orderStart = 0) {
  const out = [];
  const text = css.replace(/\/\*[\s\S]*?\*\//g, "");
  let order = orderStart;
  for (const m of text.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const decl = parseDeclarations(m[2]);
    if (!decl) continue;
    for (const sel of m[1].split(",")) {
      const s = sel.trim();
      if (!s || s.startsWith("@") || /::|:(before|after|marker|placeholder|hover|focus|focus-visible|active|target)/.test(s)) continue;
      const parsed = parseSelector(s);
      if (parsed) out.push({ ...parsed, decl, order: order++ });
    }
  }
  return out;
}

const hit = (p, n) => (!p.tag || p.tag === n.tag) && (!p.id || p.id === n.id) && p.classes.every((c) => n.classes.has(c));

function matches(parts, stack, idx) {
  if (!hit(parts[0], stack[idx])) return false;
  let j = idx;
  for (let k = 1; k < parts.length; k++) {
    const childOnly = parts[k - 1].combToLeft === ">";
    if (childOnly) {
      j -= 1;
      if (j < 0 || !hit(parts[k], stack[j])) return false;
      continue;
    }
    let found = false;
    for (j = j - 1; j >= 0; j--) if (hit(parts[k], stack[j])) { found = true; break; }
    if (!found) return false;
  }
  return true;
}

export function uprightCjkByWeight(html, baseRules) {
  const own = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map((m) => m[1]).join("\n");
  const rules = baseRules.concat(fontRules(own, baseRules.length + 10000));
  const bodyMatch = html.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i);
  const rawBody = bodyMatch ? bodyMatch[1] : html;
  const body = rawBody
    .replace(/<(script|style|template|noscript|svg)\b[\s\S]*?<\/\1>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "");

  const stack = [];
  const state = [];
  const byWeight = { "300": new Set(), "400": new Set(), "500": new Set() };

  for (const m of body.matchAll(/<\/?([a-zA-Z][\w-]*)([^>]*)>|([^<]+)/g)) {
    if (m[3] !== undefined) {
      const cur = state.length ? state[state.length - 1] : { family: "serif", style: "normal", weight: "400" };
      if (cur.family === "serif" && cur.style === "normal") {
        const chars = m[3].match(CJK);
        if (chars) for (const c of chars) byWeight[cur.weight].add(c);
      }
      continue;
    }
    const tag = m[1].toLowerCase();
    if (m[0][1] === "/") {
      const i = stack.map((s) => s.tag).lastIndexOf(tag);
      if (i >= 0) { stack.length = i; state.length = i; }
      continue;
    }
    const attrs = m[2];
    const node = {
      tag,
      id: (attrs.match(/\sid=["']?([^"'\s>]+)/) || [])[1] || "",
      classes: new Set(((attrs.match(/\sclass=["']([^"']*)["']/) || [])[1] || "").split(/\s+/).filter(Boolean)),
    };
    stack.push(node);

    const parent = state.length ? state[state.length - 1] : { family: "serif", style: "normal", weight: "400" };
    let family = UA_MONO.has(tag) ? "mono" : parent.family;
    let style = UA_ITALIC.has(tag) ? "italic" : parent.style;
    let weight = UA_BOLD.has(tag) ? "500" : parent.weight;

    // Resolve matching CSS rules by specificity then source order
    let famWin = null, styleWin = null, weightWin = null;
    const better = (a, b) => !b || a.spec > b.spec || (a.spec === b.spec && a.order >= b.order);
    for (const r of rules) {
      if (!matches(r.parts, stack, stack.length - 1)) continue;
      if (r.decl.family && better(r, famWin)) famWin = r;
      if (r.decl.style && better(r, styleWin)) styleWin = r;
      if (r.decl.weight && better(r, weightWin)) weightWin = r;
    }
    if (famWin) family = famWin.decl.family;
    if (styleWin) style = styleWin.decl.style;
    if (weightWin) weight = weightWin.decl.weight;

    const inlineAttr = (attrs.match(/\sstyle=(?:"([^"]*)"|'([^']*)')/) || []);
    const inlineDecl = parseDeclarations(inlineAttr[1] ?? inlineAttr[2] ?? "");
    if (inlineDecl) {
      if (inlineDecl.family) family = inlineDecl.family;
      if (inlineDecl.style) style = inlineDecl.style;
      if (inlineDecl.weight) weight = inlineDecl.weight;
    }

    state.push({ family, style, weight });
    if (VOID.has(tag) || /\/\s*$/.test(attrs)) { stack.pop(); state.pop(); }
  }

  return byWeight;
}

function* pages(dir, rel = "") {
  for (const e of readdirSync(path.join(dir, rel))) {
    const r = rel ? `${rel}/${e}` : e;
    if (SKIP.some((x) => x.test(r + "/"))) continue;
    const st = statSync(path.join(dir, r));
    if (st.isDirectory()) yield* pages(dir, r);
    else if (e.endsWith(".html")) yield r;
  }
}

export function readCharsFile(filePath) {
  const byWeight = { "300": new Set(), "400": new Set(), "500": new Set() };
  for (const line of readFileSync(filePath, "utf8").split("\n")) {
    if (!line || line.startsWith("#")) continue;
    const tab = line.indexOf("\t");
    if (tab < 0) continue;
    const w = line.slice(0, tab).trim();
    if (!byWeight[w]) continue;
    for (const c of line.slice(tab + 1)) if (c.trim() || c === "\u3000") byWeight[w].add(c);
  }
  return byWeight;
}

function faceRange(css, stem) {
  const re = new RegExp(`@font-face\\s*\\{[^}]*${stem}\\.[0-9a-f]{8}\\.woff2[^}]*\\}`);
  const block = (css.match(re) || [""])[0];
  if (!block) return null;
  const range = (block.match(/unicode-range:\s*([^;]+);/) || [])[1];
  return range ? expandUnicodeRange(range) : null;
}

if (import.meta.main) {
  const builtCss = path.join(SITE, "assets/css/main.css");
  const mainCss = readFileSync(existsSync(builtCss) ? builtCss : FONTS_CSS, "utf8");
  const base = fontRules(mainCss);

  // need[weight] = Map<char, Set<pageUrl>>
  const need = { "300": new Map(), "400": new Map(), "500": new Map() };
  const byPageOut = {};

  for (const p of pages(SITE)) {
    const url = "/" + p.replace(/index\.html$/, "");
    const found = uprightCjkByWeight(readFileSync(path.join(SITE, p), "utf8"), base);
    for (const w of WEIGHTS) {
      if (!found[w].size) continue;
      const chars = [...found[w]].sort((a, b) => a.codePointAt(0) - b.codePointAt(0)).join("");
      if (!byPageOut[url]) byPageOut[url] = {};
      byPageOut[url][w] = chars;
      for (const c of found[w]) {
        if (!need[w].has(c)) need[w].set(c, new Set());
        need[w].get(c).add(url);
      }
    }
  }

  if (process.argv.includes("--collect")) {
    process.stdout.write(JSON.stringify(byPageOut) + "\n");
    process.exit(0);
  }

  if (!existsSync(CHARS)) {
    console.error(`[cjk-upright] missing ${CHARS}; run \`bun run fonts:noto\` after a build`);
    process.exit(1);
  }
  const have = readCharsFile(CHARS);
  const fontsCss = readFileSync(FONTS_CSS, "utf8");
  const missing = [];
  const outsideShared = [];
  const missingRange = [];

  for (const w of WEIGHTS) {
    const shared = faceRange(fontsCss, `noto-serif-sc-roman-${w}-shared`);
    const cvZh = faceRange(fontsCss, `noto-serif-sc-roman-${w}-cv-zh`) || new Set();
    if (!shared) {
      console.error(`[cjk-upright] ${FONTS_CSS}: no noto-serif-sc-roman-${w}-shared @font-face with a unicode-range`);
      process.exit(1);
    }
    const perPageMissing = new Map();
    const perPageOutside = new Map();
    const perPageRange = new Map();
    for (const [c, ps] of need[w]) {
      if (!have[w].has(c)) {
        for (const p of ps) perPageMissing.set(p, (perPageMissing.get(p) || "") + c);
      }
      if (!shared.has(c)) {
        for (const p of ps) {
          if (p !== "/cv-zh/" && !p.startsWith("/cv-zh/")) {
            perPageOutside.set(p, (perPageOutside.get(p) || "") + c);
          } else if (!cvZh.has(c)) {
            perPageRange.set(p, (perPageRange.get(p) || "") + c);
          }
        }
      }
    }
    for (const [p, cs] of perPageMissing) missing.push(`  w${w} ${p}  ${cs}`);
    for (const [p, cs] of perPageOutside) outsideShared.push(`  w${w} ${p}  ${cs}`);
    for (const [p, cs] of perPageRange) missingRange.push(`  w${w} ${p}  ${cs}`);
  }

  if (missing.length || outsideShared.length || missingRange.length) {
    if (missing.length) console.error(`[cjk-upright] upright serif CJK characters missing from Noto Serif SC subset:\n${missing.join("\n")}`);
    if (outsideShared.length) console.error(`[cjk-upright] upright serif CJK outside /cv-zh/ missing from shared slice (would fetch cv-zh slice):\n${outsideShared.join("\n")}`);
    if (missingRange.length) console.error(`[cjk-upright] upright serif CJK on /cv-zh/ missing from cv-zh unicode-range:\n${missingRange.join("\n")}`);
    console.error("  run `bun run fonts:noto` after the build and commit the new .woff2 files, noto-upright.chars.txt, main.css and MANIFEST.tsv");
    process.exit(1);
  }

  const counts = WEIGHTS.map((w) => `w${w}:${need[w].size}`).join(", ");
  console.log(`[cjk-upright] OK: upright serif CJK (${counts}) all in Noto Serif SC subset and properly sliced`);
}
