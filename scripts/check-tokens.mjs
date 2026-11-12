/**
 * check-tokens.mjs — build-failing lint for the type/ink design tokens and the
 * "one accident per work" rule. Reads source files only (never _site).
 *
 * Token rules (CSS in main.css, <style> blocks, style="" attributes, JS strings):
 *   T1 size     font-size with a rem literal below 1 (also inside clamp()/calc()).
 *               em, px, %, 0 and ≥1rem pass; sub-1rem sizes are var(--size-*).
 *   T2 tracking letter-spacing must be var(--tracking-*), 0, normal, a negative
 *               value, or a CSS-wide keyword.
 *   T3 defined  var(--size-*|--tracking-*|--ink*|--paper*|--bloom*|--accident*|--measure*)
 *               must be defined in main.css :root, or as a custom property in the
 *               same file (a template's own local token).
 *   T4 ghost    `color: var(--ink-ghost)` (the color property itself) needs
 *               `/* ornament *\/` on the same line. Ghost never carries a word.
 *   T5 earned   filter: grayscale(<non-zero>) only inside @media (hover: hover);
 *               on touch screens a specimen is full colour at rest.
 *   T6 typeface no declaration names a face ('EB Garamond' (also 'EB Garamond 08'),
 *               'Cormorant Garamond', 'IBM Plex Mono', 'Noto Serif SC', 'LXGW WenKai', or the
 *               system CJK sans faces the mono voice names) in font-family, the font
 *               shorthand, a custom property or a JS fontFamily: use var(--font-serif),
 *               var(--font-display), var(--font-small) or var(--font-mono). The faces are
 *               named only in main.css's --font-* tokens (any --font-* declared there, so a
 *               new voice needs no change here) and inside @font-face rules. Strings that
 *               are not declarations, such as document.fonts.load('400 1em "Cormorant
 *               Garamond"'), are not checked.
 *   T7 display  no rule block sets var(--font-display) together with font-style: italic
 *               (or the font shorthand with italic): the display face ships roman only,
 *               and font-synthesis: none would set the "italic" upright.
 * Content rule:
 *   A1 accident a work's source file authors at most one DISTINCT accident. Marks are
 *               truthy `accident:` keys anywhere in its front matter and
 *               class="accident" elements in body or front-matter strings. Marks
 *               whose normalised text matches (case, whitespace, quotes, trailing
 *               punctuation, entities) are one accident quoted twice — an echo,
 *               allowed. A mark with no recoverable text (title-level
 *               `accident: true`) is its own accident, keyed by location.
 *
 * Deliberate limits: values built by Nunjucks ({{ }}) are not evaluated; JS that
 * sets `style.color`/`style.filter` is not checked (T4/T5 read CSS only); one
 * ornament comment covers every ghost declaration on its line.
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import matter from "gray-matter";

// ── scope — the registry ────────────────────────────────────────────────────
// Explicit directories only: src/assets/images holds iCloud placeholders whose
// reads can hang, and src/tsm / src/md-outputs are other renderings' sources.
const MAIN_CSS = "src/assets/css/main.css";
const TEMPLATE_DIRS_RECURSIVE = ["src/_includes"];
const TEMPLATE_DIRS_ROOT_ONLY = ["src"];
const SECTION_DIRS = [
  "making", "writing", "talks", "papers", "concepts", "thinking",
  "teaching", "cv", "cv-zh", "builds",
].map((d) => `src/${d}`);
const SECTION_DEPTH = 2; // the section dir itself plus two levels of subdirectories

// Works whose source files author accidents (A1).
const WORK_DIRS = SECTION_DIRS;

const TOKEN_PREFIX = /^(size-|tracking-|ink|paper|bloom|accident|measure)/;
const WEB_FACE = /(["']?)(EB Garamond|Cormorant Garamond|IBM Plex Mono|Noto Serif SC|LXGW WenKai|PingFang SC|Microsoft YaHei|Noto Sans CJK SC)\1/i;
const tokenFor = (face) => /Plex|PingFang|YaHei|Sans CJK/i.test(face) ? "var(--font-mono)" : /Cormorant/i.test(face) ? "var(--font-display)" : "var(--font-serif)";
const FONT_TOKEN = /^--font-[\w-]+$/i;
const CSS_WIDE = new Set(["inherit", "initial", "unset", "revert", "revert-layer"]);

// ── text helpers ────────────────────────────────────────────────────────────
const blank = (s) => s.replace(/[^\n]/g, " ");

function lineAt(text, index) {
  let line = 1;
  for (let i = 0; i < index; i++) if (text.charCodeAt(i) === 10) line++;
  return line;
}

/** Blank comments (CSS, HTML, Nunjucks) keeping offsets and newlines; strings stay. */
export function stripComments(text) {
  return text.replace(/\/\*[\s\S]*?\*\/|<!--[\s\S]*?-->|\{#[\s\S]*?#\}/g, blank);
}

/**
 * Blank CSS comments, strings and Nunjucks {{ }} / {% %} / {# #} so that only
 * structural braces remain. Offsets and newlines are preserved.
 */
export function neutraliseCss(css) {
  let out = "";
  let i = 0;
  const n = css.length;
  const closeOf = { "{{": "}}", "{%": "%}", "{#": "#}" };
  while (i < n) {
    const two = css.slice(i, i + 2);
    let end = -1;
    if (two === "/*") {
      end = css.indexOf("*/", i + 2);
      end = end === -1 ? n : end + 2;
    } else if (closeOf[two]) {
      end = css.indexOf(closeOf[two], i + 2);
      end = end === -1 ? n : end + 2;
    } else if (css[i] === '"' || css[i] === "'") {
      const q = css[i];
      let j = i + 1;
      while (j < n && css[j] !== q && css[j] !== "\n") j += css[j] === "\\" ? 2 : 1;
      end = Math.min(j + 1, n);
    }
    if (end === -1) {
      out += css[i++];
    } else {
      out += blank(css.slice(i, end));
      i = end;
    }
  }
  return out;
}

/** [{start, end}] offsets of each <style> element's content in an HTML/Nunjucks file. */
function styleRanges(text) {
  const ranges = [];
  for (const m of text.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style\s*>/gi)) {
    const start = m.index + m[0].indexOf(">") + 1;
    ranges.push({ start, end: start + m[1].length });
  }
  return ranges;
}

// ── value predicates ────────────────────────────────────────────────────────
function subRemLiterals(value) {
  const hits = [];
  for (const m of value.matchAll(/(?<![\w.-])(\d*\.?\d+)rem\b/g)) {
    const v = Number(m[1]);
    if (v > 0 && v < 1) hits.push(m[0]);
  }
  return hits;
}

function trackingOk(raw) {
  const value = raw.replace(/!important/i, "").trim().toLowerCase();
  if (value === "" || value === "normal" || CSS_WIDE.has(value)) return true;
  if (/^-?0(\.0+)?([a-z%]+)?$/.test(value)) return true; // any zero
  if (/^-\s*\d*\.?\d+[a-z%]*$/.test(value)) return true; // negative
  if (/^-?calc\(\s*-/.test(value)) return true;
  return /^var\(\s*--tracking-[\w-]+\s*(,[^)]*)?\)$/.test(value);
}

function grayscaleNonZero(value) {
  for (const m of value.matchAll(/grayscale\(\s*([^)]*)\)/gi)) {
    const arg = m[1].trim();
    if (!/^0*(\.0+)?%?$/.test(arg) || arg === "") return true; // "" = grayscale() = 100%
  }
  return false;
}

/** [{start, end}] offsets of every @font-face block body, from neutralised text. */
function fontFaceRanges(clean) {
  const out = [];
  for (const m of clean.matchAll(/@font-face\s*\{/gi)) {
    let depth = 1;
    let i = m.index + m[0].length;
    while (i < clean.length && depth > 0) {
      if (clean[i] === "{") depth++;
      else if (clean[i] === "}") depth--;
      i++;
    }
    out.push({ start: m.index, end: i });
  }
  return out;
}

const hoverHoverQuery = (prelude) =>
  /^@media\b/i.test(prelude) && /(?<![\w-])hover\s*:\s*hover\b/i.test(prelude) && !/\bnot\b/i.test(prelude);

// ── per-file token lint ─────────────────────────────────────────────────────

/**
 * Collect custom properties defined in every `:root { }` block of a stylesheet.
 * @param {string} css
 * @returns {Set<string>} names without the leading `--`
 */
export function rootTokens(css) {
  const clean = neutraliseCss(css);
  const names = new Set();
  for (const m of clean.matchAll(/:root\s*\{/g)) {
    let depth = 1;
    let i = m.index + m[0].length;
    const start = i;
    while (i < clean.length && depth > 0) {
      if (clean[i] === "{") depth++;
      else if (clean[i] === "}") depth--;
      i++;
    }
    for (const d of clean.slice(start, i).matchAll(/(?<![\w-])--([\w-]+)\s*:/g)) names.add(d[1]);
  }
  return names;
}

/**
 * T5 scanner: walk one CSS region with at-rule nesting and report grayscale
 * filters that are not under @media (hover: hover).
 * @param {string} clean neutralised text of the whole file
 * @param {number} start
 * @param {number} end
 * @returns {{index: number, value: string}[]}
 */
function ungatedGrayscale(clean, start, end) {
  const region = clean.slice(start, end);
  const decls = [...region.matchAll(/(?<![\w-])(?:-webkit-)?filter\s*:\s*([^;{}]*)/gi)]
    .filter((m) => grayscaleNonZero(m[1]));
  if (decls.length === 0) return [];
  const out = [];
  const stack = [];
  let preludeStart = 0;
  let next = 0;
  for (let i = 0; i <= region.length && next < decls.length; i++) {
    while (next < decls.length && decls[next].index === i) {
      if (!stack.some((b) => b.hover)) out.push({ index: start + i, value: decls[next][1].trim() });
      next++;
    }
    const c = region[i];
    if (c === "{") {
      const prelude = region.slice(preludeStart, i).trim();
      stack.push({ hover: hoverHoverQuery(prelude) });
      preludeStart = i + 1;
    } else if (c === "}") {
      stack.pop();
      preludeStart = i + 1;
    } else if (c === ";") {
      preludeStart = i + 1;
    }
  }
  return out;
}

/**
 * Lint one source file's text against T1–T7.
 * @param {string} text file contents
 * @param {string} file path used in messages; `.css` files are pure CSS
 * @param {{defined?: Set<string>}} [options] tokens from main.css :root (T3 skipped if absent)
 * @returns {{problems: {file: string, line: number, rule: string, message: string}[], checked: number}}
 */
export function lintSource(text, file, { defined } = {}) {
  const problems = [];
  let checked = 0;
  const isCss = file.endsWith(".css");
  const raw = text;
  const lines = raw.split("\n");
  const noComments = stripComments(raw);
  const push = (index, rule, message) => problems.push({ file, line: lineAt(raw, index), rule, message });

  // T1 / T2 — CSS declarations anywhere (style blocks, style="", JS cssText strings)
  for (const m of noComments.matchAll(/(?<![\w-])(font-size|letter-spacing)\s*:\s*([^;"'`}<>\n]*)/gi)) {
    checked++;
    const [, prop, value] = m;
    if (value.includes("{{")) continue;
    if (prop.toLowerCase() === "font-size") {
      const hits = subRemLiterals(value);
      if (hits.length) push(m.index, "T1", `font-size: ${value.trim()} — sub-1rem literal ${hits.join(", ")}; use var(--size-whisper|label|note|quiet)`);
    } else if (!trackingOk(value)) {
      push(m.index, "T2", `letter-spacing: ${value.trim()} — use var(--tracking-whisper|quiet|label|marker|spine), 0, normal or a negative value`);
    }
  }
  // T1 / T2 — JS property assignments: el.style.fontSize = "0.8rem", { letterSpacing: "0.1em" }
  if (!isCss) {
    for (const m of noComments.matchAll(/\b(fontSize|letterSpacing)\s*[:=]\s*(["'`])([^"'`\n]*)\2/g)) {
      checked++;
      const [, prop, , value] = m;
      if (value.includes("${") || value.includes("{{")) continue;
      if (prop === "fontSize") {
        const hits = subRemLiterals(value);
        if (hits.length) push(m.index, "T1", `${prop} = "${value}" — sub-1rem literal; use var(--size-*)`);
      } else if (!trackingOk(value)) {
        push(m.index, "T2", `${prop} = "${value}" — use var(--tracking-*)`);
      }
    }
  }

  // T3 — every governed token reference is defined
  if (defined) {
    const local = new Set();
    for (const m of noComments.matchAll(/(?<![\w-])--([\w-]+)\s*:/g)) local.add(m[1]);
    for (const m of noComments.matchAll(/setProperty\(\s*["'`]--([\w-]+)/g)) local.add(m[1]);
    for (const m of noComments.matchAll(/var\(\s*--([\w-]+)/g)) {
      const name = m[1];
      if (!TOKEN_PREFIX.test(name)) continue;
      if (defined.has(name) || local.has(name)) continue;
      push(m.index, "T3", `var(--${name}) is not defined in ${MAIN_CSS} :root${/^size-(glyph|meta|aside)$/.test(name) ? " (removed token)" : ""}`);
    }
  }

  // T4 — ghost ink as text colour must be marked ornament
  for (const m of noComments.matchAll(/(?<![\w-])color\s*:\s*var\(\s*--ink-ghost\b/gi)) {
    checked++;
    const lineNo = lineAt(raw, m.index);
    if (!/\/\*\s*ornament\s*\*\//.test(lines[lineNo - 1])) {
      problems.push({ file, line: lineNo, rule: "T4", message: "color: var(--ink-ghost) carries no /* ornament */ comment — readable text uses var(--ink-faint)" });
    }
  }

  // T5 — grayscale is earned by hover only where hover exists
  const regions = isCss ? [{ start: 0, end: raw.length }] : styleRanges(raw);
  const cssText = neutraliseCss(raw);
  for (const { start, end } of regions) {
    for (const hit of ungatedGrayscale(cssText, start, end)) {
      checked++;
      push(hit.index, "T5", `filter: ${hit.value} outside @media (hover: hover) — touch screens can never earn the colour back`);
    }
  }
  if (!isCss) {
    for (const m of noComments.matchAll(/\bstyle\s*=\s*(["'])([^"']*)\1/gi)) {
      for (const f of m[2].matchAll(/(?<![\w-])(?:-webkit-)?filter\s*:\s*([^;]*)/gi)) {
        if (grayscaleNonZero(f[1])) push(m.index, "T5", `inline style filter: ${f[1].trim()} cannot be gated by @media (hover: hover)`);
      }
    }
  }

  // T6 — no declaration names a web face; templates use var(--font-serif|--font-mono)
  const faces = fontFaceRanges(cssText);
  const inFontFace = (i) => faces.some((r) => i >= r.start && i < r.end);
  const isMainCss = file.replace(/\\/g, "/").endsWith(MAIN_CSS);
  for (const m of noComments.matchAll(/(?<![\w-])(font-family|font|--[\w-]+)\s*:([^;{}<>\n]*)/gi)) {
    const [, prop, value] = m;
    const face = value.match(WEB_FACE);
    if (!face) continue;
    checked++;
    if (inFontFace(m.index)) continue;
    if (isMainCss && FONT_TOKEN.test(prop)) continue;
    push(m.index, "T6", `${prop}: names '${face[2]}' — use ${tokenFor(face[2])}; faces are named only in main.css's --font-* tokens and @font-face`);
  }
  if (!isCss) {
    for (const m of noComments.matchAll(/\bfontFamily\s*[:=]\s*(?:"([^"\n]*)"|'([^'\n]*)'|`([^`\n]*)`)/g)) {
      const value = m[1] ?? m[2] ?? m[3];
      const face = value.match(WEB_FACE);
      if (!face) continue;
      checked++;
      push(m.index, "T6", `fontFamily = ${value} — use ${tokenFor(face[2])}`);
    }
  }

  // T7 — the display face is roman only
  for (const m of noComments.matchAll(/\{([^{}]*)\}/g)) {
    const body = m[1];
    const display = /(?<![\w-])font(?:-family)?\s*:[^;{}]*var\(\s*--font-display\b/i.test(body);
    const italic = /(?<![\w-])font-style\s*:\s*(italic|oblique)/i.test(body) || /(?<![\w-])font\s*:[^;{}]*\b(italic|oblique)\b/i.test(body);
    if (!display || !italic) continue;
    checked++;
    push(m.index, "T7", "var(--font-display) with italic — the display face is roman only (font-synthesis: none sets it upright); italic belongs to var(--font-serif)");
  }

  problems.sort((a, b) => a.line - b.line || a.rule.localeCompare(b.rule));
  return { problems, checked };
}

// ── A1 — one accident per work ───────────────────────────────────────────────
const ENTITIES = {
  amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", rsquo: "'", lsquo: "'",
  ldquo: '"', rdquo: '"', mdash: "—", ndash: "–", hellip: "…",
};
const decodeEntities = (s) =>
  s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) => {
    if (e[0] === "#") return String.fromCodePoint(e[1].toLowerCase() === "x" ? parseInt(e.slice(2), 16) : Number(e.slice(1)));
    return ENTITIES[e.toLowerCase()] ?? m;
  });

/** Normalise an accident's text so the same phrase quoted twice compares equal. */
export function accidentKey(text) {
  let s = decodeEntities(String(text).replace(/<[^>]*>/g, ""))
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
  let prev;
  do {
    prev = s;
    s = s.replace(/^["'\s]+|["'\s]+$/g, "").replace(/[.,;:!?…—–-]+$/, "");
  } while (s !== prev);
  return s;
}

// <tag … class="… accident …">inner</tag>, inner may hold nested inline markup.
const ACCIDENT_SPAN = /<(\w+)\b[^>]*?\bclass\s*=\s*["'][^"']*\baccident\b[^"']*["'][^>]*>([\s\S]*?)<\/\1\s*>/g;

/**
 * The accidents a work's source authors. Marks are truthy `accident` keys anywhere
 * in its front matter (text = sibling `text`, or the value when it is a string) and
 * class="accident" elements in the body or inside front-matter strings (text = the
 * element's inner text). Marks with the same normalised text are one accident
 * quoted in several places (an echo); a mark with no recoverable text (title-level
 * `accident: true`) is its own accident, keyed by its location.
 * @param {string} text markdown source with front matter
 * @returns {{count: number, where: string[], accidents: {text: string|null, where: string[]}[], echoed: boolean}}
 */
export function accidentsIn(text) {
  const { data, content } = matter(text, { cache: false });
  const marks = [];
  const walk = (node, at) => {
    if (typeof node === "string") {
      for (const m of node.matchAll(ACCIDENT_SPAN)) marks.push({ text: m[2], where: `front matter ${at} (span)` });
    } else if (Array.isArray(node)) {
      node.forEach((v, i) => walk(v, `${at}[${i}]`));
    } else if (node && typeof node === "object" && !(node instanceof Date)) {
      for (const [k, v] of Object.entries(node)) {
        const p = at ? `${at}.${k}` : k;
        if (k === "accident" && v) {
          const t = typeof node.text === "string" ? node.text : typeof v === "string" ? v : null;
          marks.push({ text: t, where: `front matter ${p}` });
        } else walk(v, p);
      }
    }
  };
  walk(data, "");
  const bodyOffset = text.length - content.length;
  for (const m of content.matchAll(ACCIDENT_SPAN)) {
    marks.push({ text: m[2], where: `body line ${lineAt(text, bodyOffset + m.index)}` });
  }

  const byKey = new Map();
  for (const mark of marks) {
    const norm = mark.text == null ? "" : accidentKey(mark.text);
    const key = norm || `@${mark.where}`;
    if (!byKey.has(key)) byKey.set(key, { text: norm ? mark.text.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim() : null, where: [] });
    byKey.get(key).where.push(mark.where);
  }
  const accidents = [...byKey.values()];
  return {
    count: accidents.length,
    where: marks.map((m) => (m.text == null ? m.where : `${m.where} "${m.text.trim()}"`)),
    accidents,
    echoed: accidents.some((a) => a.where.length > 1),
  };
}

// ── file discovery (CLI) ────────────────────────────────────────────────────
function listFiles(dir, ext, depth) {
  if (!existsSync(dir)) return [];
  const out = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (depth > 0) out.push(...listFiles(p, ext, depth - 1));
    } else if (e.name.endsWith(ext)) out.push(p);
  }
  return out;
}

export function tokenScope(root = ".") {
  const r = (p) => path.join(root, p);
  const files = [r(MAIN_CSS)];
  for (const d of TEMPLATE_DIRS_RECURSIVE) files.push(...listFiles(r(d), ".njk", Infinity));
  for (const d of TEMPLATE_DIRS_ROOT_ONLY) files.push(...listFiles(r(d), ".njk", 0));
  for (const d of SECTION_DIRS) files.push(...listFiles(r(d), ".njk", SECTION_DEPTH));
  return [...new Set(files)].sort();
}

export function workScope(root = ".") {
  return WORK_DIRS.flatMap((d) => listFiles(path.join(root, d), ".md", SECTION_DEPTH)).sort();
}

function main() {
  const defined = rootTokens(readFileSync(MAIN_CSS, "utf8"));
  const problems = [];
  let checked = 0;
  const files = tokenScope();
  for (const file of files) {
    const res = lintSource(readFileSync(file, "utf8"), file, { defined });
    problems.push(...res.problems);
    checked += res.checked;
  }

  const works = workScope();
  let echoes = 0;
  for (const file of works) {
    let res;
    try {
      res = accidentsIn(readFileSync(file, "utf8"));
    } catch (err) {
      problems.push({ file, line: 1, rule: "A1", message: `front matter did not parse: ${err.message}` });
      continue;
    }
    if (res.echoed) echoes++;
    if (res.count > 1) {
      const list = res.accidents
        .map((a) => `${a.text == null ? "(untexted)" : `"${a.text}"`} at ${a.where.join(", ")}`)
        .join("; ");
      problems.push({ file, line: 1, rule: "A1", message: `${res.count} distinct accidents in one work (one is the rule): ${list}` });
    }
  }

  if (problems.length) {
    for (const p of problems) console.error(`✗ ${p.file}:${p.line} [${p.rule}] ${p.message}`);
    const byRule = {};
    for (const p of problems) byRule[p.rule] = (byRule[p.rule] || 0) + 1;
    const summary = Object.entries(byRule).sort().map(([r, n]) => `${r}×${n}`).join(" ");
    const fileCount = new Set(problems.map((p) => p.file)).size;
    console.error(
      `[tokens-lint] FAILED — ${problems.length} problem(s) in ${fileCount} file(s) (${summary}).\n` +
      `Fix: sizes/tracking/ghost/hover/typeface rules in main.css :root comments; one accident per work.`,
    );
    process.exit(1);
  }
  console.log(
    `[tokens-lint] OK — ${files.length} file(s) scanned, ${checked} declaration(s) checked against ${defined.size} :root tokens; ` +
    `${works.length} work(s) hold at most one accident, ${echoes} with an echoed accident.`,
  );
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) main();
