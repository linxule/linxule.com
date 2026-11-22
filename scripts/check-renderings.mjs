/**
 * check-renderings.mjs — build-failing lint: every content shape has its full
 * rendering fabric, derived from `eleventy/shapes.mjs`.
 *
 * For every page belonging to a twinned shape this checks, against `_site/`:
 *   - a markdown twin exists (`_site/<path>.md`, root -> `_site/index.md`)
 *   - the HTML `<head>` carries `<link rel="alternate" type="text/markdown">`
 *     pointing at exactly that twin
 *   - `middleware.ts` imports `MD_PATHS` from `./eleventy/shapes.mjs`, keeps a
 *     static literal `config.matcher` in parity with `MIDDLEWARE_MATCHERS`, and
 *     BOTH `MD_PATHS` and `config.matcher` (via `path-to-regexp`) match every
 *     shape's representative URL
 *   - every Pagefind-indexed shape carries `data-pagefind-body`
 *   - `_site/feed.xml` has an `<entry>` for at least one URL from each dated shape
 *   - every spread of a scroll book has an id equal to its `data-book-target`,
 *     and no id repeats on any site page (`scripts/lib/spread-ids.mjs`)
 *   - zero `[object Object]`, raw `<script>`, or `&amp;` leaks in `.md` twins
 *   - `_site/tsm/` is excluded (independently developed sub-app)
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { match } from "path-to-regexp";
import {
  COLLECTION_TWINS,
  MD_PATHS,
  MIDDLEWARE_MATCHERS,
  STATIC_TWINS,
} from "../eleventy/shapes.mjs";
import { checkSpreadIds, checkUniqueIds, isBookPage, isSitePage } from "./lib/spread-ids.mjs";

const SITE = "_site";
const FENCE = /^[ \t]*(`{3,}|~{3,})[^\n]*\n[\s\S]*?^[ \t]*\1[ \t]*$/gm;
const CODE_SPAN = /(`+)(?!`)[^\n]*?(?<!`)\1(?!`)/g;

const SHAPES = [
  ...COLLECTION_TWINS.map((c) => ({
    name: c.id,
    kind: "multi",
    dir: c.dir,
    layout: c.layout,
    pagefind: true,
    dated: c.inFeed,
  })),
  ...STATIC_TWINS.map((s) => ({
    name: s.id,
    kind: "single",
    path: s.url === "/" ? "" : s.url.replace(/^\//, ""),
    layout: s.layout || null,
    sourceFile: s.sourceFile || null,
    pagefind: Boolean(s.pagefind),
    dated: false,
  })),
];

const problems = [];
let pagesChecked = 0;

// ── discovery ────────────────────────────────────────────────────────────
function findMultiPages(dir) {
  const base = path.join(SITE, dir);
  if (!existsSync(base)) return [];
  return readdirSync(base, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => path.join(dir, e.name, "index.html"))
    .filter((rel) => existsSync(path.join(SITE, rel)))
    .sort();
}

function htmlPagesFor(shape) {
  if (shape.kind === "multi") return findMultiPages(shape.dir);
  const rel = shape.path ? path.join(shape.path, "index.html") : "index.html";
  return existsSync(path.join(SITE, rel)) ? [rel] : [];
}

function contentPathOf(relHtmlPath) {
  return relHtmlPath === "index.html" ? "" : relHtmlPath.replace(/\/index\.html$/, "");
}

function twinFor(relHtmlPath) {
  const cp = contentPathOf(relHtmlPath);
  return cp === "" ? "index.md" : `${cp}.md`;
}

// ── middleware.ts parity (imports MD_PATHS + static literal config.matcher) ─
const middlewareSrc = readFileSync("middleware.ts", "utf8");

if (!/import\s*\{[^}]*\bMD_PATHS\b[^}]*\}\s*from\s*['"]\.\/eleventy\/shapes\.mjs['"]/.test(middlewareSrc)) {
  problems.push("[middleware] middleware.ts must import MD_PATHS from './eleventy/shapes.mjs'");
}

const hasRootBranch = /pathname === ['"]\/['"][\s\S]{0,300}\/index\.md/.test(middlewareSrc);
if (!hasRootBranch) {
  problems.push("[root] middleware.ts has no pathname === '/' -> /index.md rewrite branch — fix: middleware.ts");
}

const matcherBlock = middlewareSrc.match(
  /export\s+const\s+config\s*=\s*\{\s*matcher\s*:\s*\[([\s\S]*?)\]\s*,?\s*\}\s*;/,
);
const extractedMatchers = [];
if (!matcherBlock) {
  problems.push("[middleware] could not parse static literal `export const config = { matcher: [...] };` in middleware.ts");
} else {
  const strippedBlock = matcherBlock[1].replace(/\/\/[^\n]*/g, "").replace(/\/\*[\s\S]*?\*\//g, "");
  for (const m of strippedBlock.matchAll(/['"]([^'"]+)['"]/g)) {
    extractedMatchers.push(m[1]);
  }
  const expectedSet = new Set(MIDDLEWARE_MATCHERS);
  const actualSet = new Set(extractedMatchers);
  for (const expected of MIDDLEWARE_MATCHERS) {
    if (!actualSet.has(expected)) {
      problems.push(`[middleware] config.matcher is missing "${expected}" from MIDDLEWARE_MATCHERS — fix: middleware.ts`);
    }
  }
  for (const actual of extractedMatchers) {
    if (!expectedSet.has(actual)) {
      problems.push(`[middleware] config.matcher has unexpected "${actual}" absent from MIDDLEWARE_MATCHERS — fix: eleventy/shapes.mjs or middleware.ts`);
    }
  }
}

const compiledMatchers = extractedMatchers.map((pattern) => ({
  pattern,
  test: match(pattern, { sensitive: true, end: true, decode: decodeURIComponent }),
}));

// ── feed.xml ─────────────────────────────────────────────────────────────
const feedPath = path.join(SITE, "feed.xml");
const feedXml = existsSync(feedPath) ? readFileSync(feedPath, "utf8") : "";
if (!feedXml) problems.push("[feed] _site/feed.xml not found — fix: src/feed.njk");

// ── per-shape checks ─────────────────────────────────────────────────────
for (const shape of SHAPES) {
  const pages = htmlPagesFor(shape);
  if (pages.length === 0) {
    problems.push(`[${shape.name}] no built HTML page(s) found under _site/${shape.dir || shape.path || "(root)"} — fix: eleventy build for this shape`);
    continue;
  }

  for (const rel of pages) {
    pagesChecked++;
    const twinRel = twinFor(rel);
    const twinAbs = path.join(SITE, twinRel);
    if (!existsSync(twinAbs)) {
      problems.push(`[${shape.name}] missing markdown twin: _site/${twinRel} (surface: Markdown twin, for _site/${rel}) — fix: src/md-outputs/ template for this shape`);
      continue;
    }

    const html = readFileSync(path.join(SITE, rel), "utf8");
    const altMatch = html.match(/<link rel="alternate" type="text\/markdown" href="([^"]+)">/);
    const expectedHref = "/" + twinRel;
    if (!altMatch) {
      problems.push(`[${shape.name}] missing <link rel="alternate" type="text/markdown"> in <head> (surface: Alternate link, page: /${rel}) — fix: src/_includes/layouts/base.njk`);
    } else if (altMatch[1] !== expectedHref) {
      problems.push(`[${shape.name}] alternate link href mismatch on /${rel}: got "${altMatch[1]}", expected "${expectedHref}" — fix: src/_includes/layouts/base.njk`);
    }
  }

  // Content negotiation — BOTH MD_PATHS AND middleware config.matcher must match representative URL
  const repUrl = shape.name === "root" ? "/" : "/" + contentPathOf(pages[0]);
  if (shape.name !== "root" && !MD_PATHS.test(repUrl)) {
    problems.push(`[${shape.name}] MD_PATHS does not match representative URL ${repUrl} (surface: Content negotiation) — fix: eleventy/shapes.mjs MD_PATHS`);
  }
  if (compiledMatchers.length && !compiledMatchers.some(({ test }) => test(repUrl) !== false)) {
    problems.push(`[${shape.name}] middleware.ts config.matcher does not match representative URL ${repUrl} — fix: middleware.ts config.matcher`);
  }

  // Pagefind — data-pagefind-body on the shape's layout or source template
  if (shape.layout) {
    const layoutFile = `src/_includes/layouts/${shape.layout}`;
    if (!existsSync(layoutFile)) {
      problems.push(`[${shape.name}] layout file not found: ${layoutFile}`);
    } else if (!readFileSync(layoutFile, "utf8").includes("data-pagefind-body")) {
      problems.push(`[${shape.name}] layout missing data-pagefind-body (surface: Pagefind) — fix: ${layoutFile}`);
    }
  } else if (shape.pagefind && shape.sourceFile) {
    if (!existsSync(shape.sourceFile)) {
      problems.push(`[${shape.name}] source template not found: ${shape.sourceFile}`);
    } else if (!readFileSync(shape.sourceFile, "utf8").includes("data-pagefind-body")) {
      problems.push(`[${shape.name}] template missing data-pagefind-body (surface: Pagefind) — fix: ${shape.sourceFile}`);
    }
  }

  // Feed — at least one of this shape's URLs represented in feed.xml
  if (shape.dated) {
    const inFeed = feedXml && pages.some((rel) => feedXml.includes("/" + contentPathOf(rel)));
    if (!inFeed) {
      problems.push(`[${shape.name}] no _site/feed.xml <entry> links to any ${shape.name} URL (surface: Feed) — fix: src/feed.njk combineByDate(...)`);
    }
  }
}

// ── walk built HTML & Markdown twins (excluding _site/tsm/) ──────────────────
function walkBuilt(dir, ext) {
  const out = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    const rel = path.relative(SITE, p).split(path.sep).join("/");
    if (e.isDirectory()) {
      if (rel === "tsm" || rel.startsWith("tsm/")) continue;
      if (ext === ".md" && (rel === "assets" || rel.startsWith("assets/"))) continue;
      out.push(...walkBuilt(p, ext));
    } else if (e.name.endsWith(ext)) {
      out.push(p);
    }
  }
  return out;
}

let alternatesChecked = 0;
let bookPages = 0;
let idPages = 0;
for (const abs of walkBuilt(SITE, ".html")) {
  const html = readFileSync(abs, "utf8");
  const rel = path.relative(SITE, abs);
  if (isBookPage(html)) {
    bookPages++;
    for (const p of checkSpreadIds(html, rel)) problems.push(`${p} — fix: src/making/index.njk or src/_includes/components/writing-book.njk`);
    idPages++;
  } else if (isSitePage(html)) {
    for (const p of checkUniqueIds(html, rel)) problems.push(`${p} — fix: the template or transform that writes the id (definition callouts: addDefinitionIds in eleventy/transforms.js)`);
    idPages++;
  }
  for (const m of html.matchAll(/<link rel="alternate" type="text\/markdown" href="([^"]+)"/g)) {
    const href = m[1];
    if (!href.startsWith("/")) continue;
    alternatesChecked++;
    if (!existsSync(path.join(SITE, href.replace(/^\//, "")))) {
      problems.push(`[phantom] ${rel} advertises a markdown twin that does not exist: ${href} — fix: eleventy/shapes.mjs mdAlternateForUrl`);
    }
  }
}
if (!idPages) {
  problems.push(`[unique-ids] no built page loads /assets/css/main.css, so none was checked for repeated ids — fix: isSitePage in scripts/lib/spread-ids.mjs`);
}

// ── Markdown twin hygiene: zero [object Object], raw <script>, or &amp; ─────
let mdTwinsChecked = 0;
for (const abs of walkBuilt(SITE, ".md")) {
  const rel = path.relative(SITE, abs).split(path.sep).join("/");
  if (rel.startsWith(".well-known/")) continue;
  mdTwinsChecked++;
  const raw = readFileSync(abs, "utf8");
  if (raw.includes("[object Object]")) {
    problems.push(`[md-hygiene] ${rel} contains literal "[object Object]" — check YAML shaped arrays (Gotcha #55)`);
  }
  const stripped = raw.replace(FENCE, "").replace(CODE_SPAN, "");
  if (/<script\b/i.test(stripped)) {
    problems.push(`[md-hygiene] ${rel} contains raw <script> tag outside code blocks — fix: eleventy/filters.js markdownBody or source .md`);
  }
  if (/&amp;/i.test(stripped)) {
    problems.push(`[md-hygiene] ${rel} contains HTML-escaped "&amp;" outside code blocks — fix: add | safe or decode in src/md-outputs/`);
  }
}

// ── report ───────────────────────────────────────────────────────────────
if (problems.length) {
  console.error(
    `[renderings-lint] FAILED — ${problems.length} problem(s) across ${SHAPES.length} shape(s):\n` +
      problems.map((p) => "  - " + p).join("\n") +
      `\nFix: see .claude/docs/design-system.md § Renderings and eleventy/shapes.mjs`,
  );
  process.exit(1);
}

console.log(
  `[renderings-lint] OK — ${SHAPES.length} shapes, ${pagesChecked} page(s) checked, ${alternatesChecked} alternate link(s) verified, ${mdTwinsChecked} markdown twin(s) clean, ${bookPages} book page(s) with addressable spreads, ${idPages} page(s) with unique ids, middleware matcher parity verified.`,
);
