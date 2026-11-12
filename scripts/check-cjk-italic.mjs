#!/usr/bin/env bun
// Fails when a built page sets a CJK character in italic that the shipped Kai subset (the italic of the Chinese
// family) does not contain. Browser-free, so it runs in `verify`.
//
// "Italic" is decided statically and errs wide: an element is italic when it is em/i/cite/dfn/var/address, or when
// it matches any selector whose rule block declares `font-style: italic` in main.css or in the page's own <style>,
// or when its own style="" attribute does.
// A later `font-style: normal` is ignored, so a character may be counted that renders upright: that only adds a
// glyph to the subset, never lets one go missing. Selector parts the matcher does not model (pseudo-classes,
// attribute selectors) are dropped, which also widens the match. Pseudo-element selectors (::before) are skipped.
// Scripts are stripped, so text a script writes after load is not seen. Checked by hand on 2026-11-12 in Chromium
// (Making and portrait lightboxes, Pagefind results, the essay lightbox, artifact fullscreen): none sets hanzi in
// italic; the gallery JSON's `interpretation` reaches the page only as a title="" tooltip. Re-check if a script
// starts writing poem or caption text into the page.
//
// Usage: bun scripts/check-cjk-italic.mjs [--collect]   (from the repo root, after a build)
//   default    compare against src/assets/fonts/kai-italic.chars.txt, exit 1 naming page + characters; and every page
//              outside /making/ must find its italic CJK in the `shared` slice (the unicode-range of that face in
//              src/assets/css/main.css), or it would fetch the 177 kB making slice for one name
//   --collect  print {"<page>": "<italic CJK characters>"} as JSON (the regeneration script slices and subsets from it)
import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

const SITE = process.env.SITE_DIR || "_site";
const CHARS = process.env.KAI_CHARS || "src/assets/fonts/kai-italic.chars.txt";
const FONTS_CSS = process.env.FONTS_CSS || "src/assets/css/main.css";
const SKIP = [/^assets\//, /^tsm\//, /^pagefind\//];
const CJK = /[⺀-⿿　-〿㐀-鿿豈-﫿＀-￯]|[\uD840-\uD87F][\uDC00-\uDFFF]/gu;
const UA_ITALIC = new Set(["em", "i", "cite", "dfn", "var", "address"]);
const VOID = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr"]);

export function italicSelectors(css) {
  const out = [];
  const text = css.replace(/\/\*[\s\S]*?\*\//g, "");
  // innermost blocks only: "selectors { declarations }" with no nested braces (media queries contribute their inner rules)
  for (const m of text.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    if (!/font-style\s*:\s*italic/i.test(m[2])) continue;
    for (const sel of m[1].split(",")) {
      const s = sel.trim();
      if (!s || s.startsWith("@") || /::|:(before|after|marker|placeholder)/.test(s)) continue;
      const parsed = parseSelector(s);
      if (parsed) out.push(parsed);
    }
  }
  return out;
}

// "a .b > c.d" -> compounds right to left; combToLeft is the combinator joining a compound to the one on its left.
// Sibling combinators are not modelled and count as descendant (wider).
function parseSelector(s) {
  const tokens = s.replace(/\s*([>+~])\s*/g, " $1 ").trim().split(/\s+/);
  const parts = []; let comb = " ";
  for (const t of tokens) {
    if (t === ">" || t === "+" || t === "~") { comb = t === ">" ? ">" : " "; continue; }
    const c = t.replace(/\[[^\]]*\]/g, "").replace(/:{1,2}[\w-]+(\([^)]*\))?/g, "");
    const tag = (c.match(/^[a-zA-Z][\w-]*/) || [""])[0].toLowerCase();
    const id = (c.match(/#([\w-]+)/) || [])[1] || "";
    const classes = [...c.matchAll(/\.([\w-]+)/g)].map((x) => x[1]);
    parts.push({ tag, id, classes, combToLeft: parts.length ? comb : null });
    comb = " ";
  }
  return parts.length ? parts.reverse() : null;
}

const hit = (p, n) => (!p.tag || p.tag === n.tag) && (!p.id || p.id === n.id) && p.classes.every((c) => n.classes.has(c));
function matches(sel, stack, idx) {
  // sel[0] is the rightmost compound; stack[idx] the element under test
  if (!hit(sel[0], stack[idx])) return false;
  let j = idx;
  for (let k = 1; k < sel.length; k++) {
    const childOnly = sel[k - 1].combToLeft === ">";
    if (childOnly) { j -= 1; if (j < 0 || !hit(sel[k], stack[j])) return false; continue; }
    let found = false;
    for (j = j - 1; j >= 0; j--) if (hit(sel[k], stack[j])) { found = true; break; }
    if (!found) return false;
  }
  return true;
}

export function italicCjk(html, selectors) {
  const own = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map((m) => m[1]).join("\n");
  const sels = selectors.concat(italicSelectors(own));
  const body = html.replace(/<(script|style|template|noscript|svg)\b[\s\S]*?<\/\1>/gi, "").replace(/<!--[\s\S]*?-->/g, "");
  const stack = []; const italicDepth = []; let found = "";
  for (const m of body.matchAll(/<\/?([a-zA-Z][\w-]*)([^>]*)>|([^<]+)/g)) {
    if (m[3] !== undefined) { if (italicDepth.length && italicDepth[italicDepth.length - 1]) { const c = m[3].match(CJK); if (c) found += c.join(""); } continue; }
    const tag = m[1].toLowerCase();
    if (m[0][1] === "/") { const i = stack.map((s) => s.tag).lastIndexOf(tag); if (i >= 0) { stack.length = i; italicDepth.length = i; } continue; }
    const attrs = m[2];
    const node = { tag, id: (attrs.match(/\sid=["']?([^"'\s>]+)/) || [])[1] || "", classes: new Set(((attrs.match(/\sclass=["']([^"']*)["']/) || [])[1] || "").split(/\s+/).filter(Boolean)) };
    stack.push(node);
    const inherited = italicDepth.length ? italicDepth[italicDepth.length - 1] : false;
    italicDepth.push(inherited || UA_ITALIC.has(tag) || /font-style\s*:\s*italic/i.test((attrs.match(/\sstyle=("[^"]*"|'[^']*')/) || [""])[0]) || sels.some((s) => matches(s, stack, stack.length - 1)));
    if (VOID.has(tag) || /\/\s*$/.test(attrs)) { stack.pop(); italicDepth.pop(); }
  }
  return found;
}

function* pages(dir, rel = "") {
  for (const e of readdirSync(path.join(dir, rel))) {
    const r = rel ? `${rel}/${e}` : e;
    if (SKIP.some((x) => x.test(r + "/"))) continue;
    const st = statSync(path.join(dir, r));
    if (st.isDirectory()) yield* pages(dir, r); else if (e.endsWith(".html")) yield r;
  }
}

if (import.meta.main) {
  const mainCss = readFileSync(path.join(SITE, "assets/css/main.css"), "utf8");
  const base = italicSelectors(mainCss);
  const need = new Map();
  for (const p of pages(SITE)) {
    const chars = italicCjk(readFileSync(path.join(SITE, p), "utf8"), base);
    for (const c of new Set([...chars])) { if (!need.has(c)) need.set(c, new Set()); need.get(c).add("/" + p.replace(/index\.html$/, "")); }
  }
  if (process.argv.includes("--collect")) {
    const byPage = {}; for (const [c, ps] of need) for (const p of ps) byPage[p] = (byPage[p] || "") + c;
    process.stdout.write(JSON.stringify(byPage) + "\n"); process.exit(0);
  }
  const have = new Set([...readFileSync(CHARS, "utf8").replace(/^#.*\n/gm, "").replace(/\s/g, "")]);
  const byPage = new Map();
  for (const [c, ps] of need) if (!have.has(c)) for (const p of ps) { if (!byPage.has(p)) byPage.set(p, ""); byPage.set(p, byPage.get(p) + c); }
  const block = (readFileSync(FONTS_CSS, "utf8").match(/@font-face\s*\{[^}]*lxgw-wenkai-italic-shared\.[^}]*\}/) || [""])[0];
  const range = (block.match(/unicode-range:\s*([^;]+);/) || [])[1];
  if (!range) { console.error(`[cjk-italic] ${FONTS_CSS}: no lxgw-wenkai-italic-shared @font-face with a unicode-range`); process.exit(1); }
  const shared = new Set(range.split(",").map((u) => String.fromCodePoint(parseInt(u.trim().replace(/^U\+/i, ""), 16))));
  const outside = new Map();
  for (const [c, ps] of need) if (!shared.has(c)) for (const p of ps) if (!p.startsWith("/making/")) outside.set(p, (outside.get(p) || "") + c);
  if (byPage.size || outside.size) {
    if (byPage.size) console.error(`[cjk-italic] ${byPage.size} page(s) set italic CJK characters the Kai subset lacks:`);
    for (const [p, cs] of byPage) console.error(`  ${p}  ${cs}`);
    if (outside.size) console.error(`[cjk-italic] ${outside.size} page(s) outside /making/ set italic CJK characters that are not in the shared slice (they would fetch the making slice):`);
    for (const [p, cs] of outside) console.error(`  ${p}  ${cs}`);
    console.error("  run `bun run fonts:kai` after the build and commit the new .woff2 files, kai-italic.chars.txt, main.css and MANIFEST.tsv");
    process.exit(1);
  }
  console.log(`[cjk-italic] OK: ${need.size} italic CJK character(s) on the site, all in the Kai subset, and every one used outside /making/ in its shared slice`);
}
