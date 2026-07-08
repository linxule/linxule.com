/**
 * check-renderings.mjs — build-failing lint: every content shape has its full
 * rendering fabric. Generalizes the og-lint pattern (scripts/check-og-images.mjs)
 * to the whole "one source, many renderings" fabric described in
 * .claude/docs/design-system.md § Renderings.
 *
 * SHAPES below is the registry — the source of truth for what shapes exist and
 * where their built HTML lives. For every page belonging to a twinned shape this
 * checks, against _site/:
 *   - a markdown twin exists (e.g. _site/papers/<slug>.md beside
 *     _site/papers/<slug>/index.html; root -> _site/index.md)
 *   - the HTML <head> carries a <link rel="alternate" type="text/markdown">
 *     pointing at exactly that twin
 *   - middleware.ts's MD_PATHS regex matches one representative URL per shape
 *     (root is checked separately — it negotiates via a dedicated branch, not
 *     MD_PATHS; tags/series/prompter are excluded by design, not checked here)
 *   - each Law-layout in LAYOUTS carries data-pagefind-body (source grep)
 *   - _site/feed.xml has an <entry> for at least one URL from each dated shape
 *
 * Runs post-eleventy in `bun run build` (see package.json). Node/Bun-runnable,
 * no headless browser.
 */
import { existsSync, readFileSync, readdirSync } from "fs";
import path from "path";

const SITE = "_site";

// ── SHAPES — the registry ───────────────────────────────────────────────────
// kind "multi": scan _site/<dir>/*/index.html (one page per collection item).
// kind "single": exactly one page at _site/<path>/index.html ("" = site root).
// layout: source file in src/_includes/layouts/ that must carry data-pagefind-body
//   (only set for the 9 Law-layouts named in the spec — indexes and root have none).
// dated: must have at least one URL represented in _site/feed.xml.
const SHAPES = [
  // Collections — one HTML page per content item
  { name: "writing",   kind: "multi",  dir: "writing",          layout: "writing.njk",  dated: true },
  { name: "portraits", kind: "multi",  dir: "making/portraits", layout: "portrait.njk", dated: true },
  { name: "artifacts", kind: "multi",  dir: "making/artifacts", layout: "artifact.njk", dated: true },
  { name: "talks",     kind: "multi",  dir: "talks",            layout: "talk.njk",     dated: true },
  { name: "papers",    kind: "multi",  dir: "papers",           layout: "paper.njk",    dated: true },
  // Single content pages
  { name: "thinking",  kind: "single", path: "thinking",  layout: "thinking.njk" },
  { name: "concepts",  kind: "single", path: "concepts",  layout: "concepts.njk" },
  { name: "teaching",  kind: "single", path: "teaching",  layout: "teaching.njk" },
  { name: "cv",        kind: "single", path: "cv",        layout: "cv.njk" },
  { name: "cv-zh",     kind: "single", path: "cv-zh",     layout: "cv.njk" },
  // Hand-maintained indexes — no layout/pagefind or feed requirement
  { name: "writing-index", kind: "single", path: "writing" },
  { name: "making-index",  kind: "single", path: "making" },
  { name: "talks-index",   kind: "single", path: "talks" },
  { name: "papers-index",  kind: "single", path: "papers" },
  // Site root
  { name: "root", kind: "single", path: "" },
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

// _site-relative html path -> its content path with no leading/trailing slash
// ("" for root). "writing/foo/index.html" -> "writing/foo"; "index.html" -> "".
function contentPathOf(relHtmlPath) {
  return relHtmlPath === "index.html" ? "" : relHtmlPath.replace(/\/index\.html$/, "");
}

// _site-relative twin path for a given html page. "" (root) -> "index.md".
function twinFor(relHtmlPath) {
  const cp = contentPathOf(relHtmlPath);
  return cp === "" ? "index.md" : `${cp}.md`;
}

// ── middleware.ts MD_PATHS extraction ───────────────────────────────────────
const middlewareSrc = readFileSync("middleware.ts", "utf8");
// Anchored to line start AND line end (`;\s*$`): a trailing comment or a
// multiline rewrite makes this FAIL LOUDLY (null match -> problem pushed)
// instead of silently extracting a wrong regex. Guard comment in middleware.ts.
const mdPathsMatch = middlewareSrc.match(/^const MD_PATHS = \/(.+)\/([a-z]*);\s*$/m);
if (!mdPathsMatch) {
  problems.push("[middleware] could not find `const MD_PATHS = /.../;` in middleware.ts — fix: middleware.ts");
}
const mdPathsRegex = mdPathsMatch ? new RegExp(mdPathsMatch[1], mdPathsMatch[2]) : null;

// Root negotiates via a dedicated branch (pathname === '/' -> /index.md), not MD_PATHS.
const hasRootBranch = /pathname === ['"]\/['"][\s\S]{0,300}\/index\.md/.test(middlewareSrc);
if (!hasRootBranch) {
  problems.push("[root] middleware.ts has no pathname === '/' -> /index.md rewrite branch — fix: middleware.ts");
}

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
      continue; // no twin to point at — skip the alternate-link href check for this page
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

  // Content negotiation — MD_PATHS regex, one representative URL (root excluded, checked above)
  if (shape.name !== "root" && mdPathsRegex) {
    const repUrl = "/" + contentPathOf(pages[0]);
    if (!mdPathsRegex.test(repUrl)) {
      problems.push(`[${shape.name}] MD_PATHS does not match representative URL ${repUrl} (surface: Content negotiation) — fix: middleware.ts MD_PATHS`);
    }
  }

  // Pagefind — data-pagefind-body on the shape's Law-layout source
  if (shape.layout) {
    const layoutFile = `src/_includes/layouts/${shape.layout}`;
    if (!existsSync(layoutFile)) {
      problems.push(`[${shape.name}] layout file not found: ${layoutFile}`);
    } else if (!readFileSync(layoutFile, "utf8").includes("data-pagefind-body")) {
      problems.push(`[${shape.name}] layout missing data-pagefind-body (surface: Pagefind) — fix: ${layoutFile}`);
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

// ── phantom alternates — every advertised twin must exist ───────────────────
// SHAPES checks the pages that SHOULD have twins; this walks ALL built HTML and
// checks that no page — including ones the registry deliberately excludes
// (tags, series, prompter/creator) — advertises a twin that 404s. Added from the
// 2026-07-08 adversarial review (series pages had shipped phantom alternates).
function walkHtml(dir) {
  const out = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walkHtml(p));
    else if (e.name.endsWith(".html")) out.push(p);
  }
  return out;
}
let alternatesChecked = 0;
for (const abs of walkHtml(SITE)) {
  const html = readFileSync(abs, "utf8");
  for (const m of html.matchAll(/<link rel="alternate" type="text\/markdown" href="([^"]+)"/g)) {
    const href = m[1];
    if (!href.startsWith("/")) continue; // external alternates out of scope
    alternatesChecked++;
    if (!existsSync(path.join(SITE, href.replace(/^\//, "")))) {
      const page = path.relative(SITE, abs);
      problems.push(`[phantom] ${page} advertises a markdown twin that does not exist: ${href} — fix: src/_includes/layouts/base.njk mdAlternate logic`);
    }
  }
}

// ── report ───────────────────────────────────────────────────────────────
if (problems.length) {
  console.error(
    `[renderings-lint] FAILED — ${problems.length} problem(s) across ${SHAPES.length} shape(s):\n` +
      problems.map((p) => "  - " + p).join("\n") +
      `\nFix: see .claude/docs/design-system.md § Renderings and .claude/rules/papers.md`
  );
  process.exit(1);
}

console.log(`[renderings-lint] OK — ${SHAPES.length} shapes, ${pagesChecked} page(s) checked, ${alternatesChecked} alternate link(s) verified, all twinned/negotiated/indexed/fed.`);
