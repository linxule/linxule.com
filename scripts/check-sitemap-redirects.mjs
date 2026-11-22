/**
 * Sitemap, URL-canonicalization, heading-hierarchy, and source-hygiene verification gate.
 *
 * Checks:
 *   1. No sitemap URL or built HTML route (including `/tag/*`) collides with a Vercel redirect rule.
 *   2. Every internal `vercel.json` redirect `#fragment` target exists in the destination HTML page.
 *   3. Sitemap contains 0 `/assets/` URLs and all 9 `/writing/series/<slug>` URLs.
 *   4. Zero internal trailing-slash links in HTML, `feed.xml`, JSON-LD, and `.md` twins
 *      (excluding `/`, `/play/`, `/tsm/`, `/assets/slides/<slug>/`, and `/assets/<path>`).
 *   5. Every `/assets/images/optimized/*` reference in built `.html` and `.md` files exists on disk.
 *   6. Exactly one `<h1>` per built site HTML page (excluding `_site/tsm/` & `_site/assets/`).
 *   7. Source hygiene:
 *      - Every slide deck `src/assets/slides/<slug>/index.html` declares `<base href="/assets/slides/<slug>/">`.
 *      - Zero remote image URLs in `src/writing/*.md` (images must be self-hosted).
 *      - Every interactive HTML artifact in `src/making/artifacts/*.md` declares a valid `thumbnail:`.
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { match } from "path-to-regexp";
import seriesCatalog from "../src/_data/seriesCatalog.js";

const FENCE = /^[ \t]*(`{3,}|~{3,})[^\n]*\n[\s\S]*?^[ \t]*\1[ \t]*$/gm;
const CODE_SPAN = /(`+)(?!`)[^\n]*?(?<!`)\1(?!`)/g;
const JSON_LD_URL_KEYS = new Set(["url", "@id", "inDefinedTermSet", "mainEntityOfPage"]);

export function isAllowedTrailingSlashPath(pathname) {
  if (!pathname || pathname === "/") return true;
  if (pathname === "/play/") return true;
  if (pathname === "/tsm/" || pathname.startsWith("/tsm/")) return true;
  if (/^\/assets\/slides\/[^/]+\/$/.test(pathname)) return true;
  if (pathname.startsWith("/assets/")) return true;
  return false;
}

function internalTrailingSlashOf(rawUrl) {
  if (!rawUrl || typeof rawUrl !== "string") return null;
  const trimmed = rawUrl.trim();
  if (!trimmed || trimmed.startsWith("#") || trimmed.startsWith("mailto:") || trimmed.startsWith("javascript:")) {
    return null;
  }

  let pathname = null;
  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) {
    pathname = trimmed.split(/[?#]/, 1)[0];
  } else if (/^https?:\/\/linxule\.com(?:\/|$)/i.test(trimmed)) {
    try {
      const parsed = new URL(trimmed);
      if (parsed.hostname.toLowerCase() !== "linxule.com") return null;
      pathname = parsed.pathname;
    } catch {
      return null;
    }
  } else {
    return null;
  }

  if (!pathname || !pathname.endsWith("/")) return null;
  if (isAllowedTrailingSlashPath(pathname)) return null;
  return trimmed;
}

export function findRedirectCollisions(sitemapXml, redirects) {
  const sitemapPaths = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
    ([, location]) => decodeURI(new URL(location).pathname),
  );
  const redirectMatchers = redirects.map(({ source }) => ({
    source,
    matches: match(source, {
      sensitive: true,
      end: true,
      decode: decodeURIComponent,
    }),
  }));

  const collisions = sitemapPaths.flatMap((pathname) =>
    redirectMatchers
      .filter(({ matches }) => matches(pathname) !== false)
      .map(({ source }) => ({ path: pathname, source })),
  );

  return { collisions, redirectCount: redirectMatchers.length, sitemapCount: sitemapPaths.length };
}

export function checkSitemapInvariants(
  sitemapXml,
  expectedSeriesSlugs = seriesCatalog.list.map((s) => s.slug),
) {
  const problems = [];
  const locs = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, loc]) => loc.trim());
  const paths = new Set();

  for (const loc of locs) {
    let pathname;
    try {
      pathname = decodeURI(new URL(loc).pathname);
    } catch {
      problems.push(`sitemap.xml contains invalid URL: ${loc}`);
      continue;
    }
    paths.add(pathname);
    if (pathname.startsWith("/assets/")) {
      problems.push(`sitemap.xml must not contain /assets/ URL: ${loc}`);
    }
  }

  for (const slug of expectedSeriesSlugs) {
    const expected = `/writing/series/${slug}`;
    if (!paths.has(expected)) {
      problems.push(`sitemap.xml is missing series page ${expected}`);
    }
  }

  return problems;
}

function walkSiteFiles(siteDir, ext, { excludeAssets = true, excludeWellKnown = false } = {}) {
  const root = path.resolve(siteDir);
  if (!existsSync(root)) return [];

  function recurse(dir) {
    const out = [];
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name);
      const rel = path.relative(root, fullPath).split(path.sep).join("/");
      if (entry.isDirectory()) {
        if (rel === "tsm" || rel.startsWith("tsm/")) continue;
        if (rel === "pagefind" || rel.startsWith("pagefind/")) continue;
        if (excludeAssets && (rel === "assets" || rel.startsWith("assets/"))) continue;
        if (excludeWellKnown && (rel === ".well-known" || rel.startsWith(".well-known/"))) continue;
        out.push(...recurse(fullPath));
      } else if (entry.name.endsWith(ext)) {
        out.push({ fullPath, rel });
      }
    }
    return out;
  }

  return recurse(root);
}

export function findBuiltHtmlRedirectCollisions(siteDir = "_site", redirects = []) {
  const redirectMatchers = redirects.map(({ source, destination }) => ({
    source,
    destination,
    matches: match(source, {
      sensitive: true,
      end: true,
      decode: decodeURIComponent,
    }),
  }));

  const htmlFiles = walkSiteFiles(siteDir, ".html", { excludeAssets: true });
  const collisions = [];
  for (const { rel } of htmlFiles) {
    const route = rel === "index.html" ? "/" : `/${rel.replace(/\/index\.html$/, "")}`;
    for (const { source, destination, matches } of redirectMatchers) {
      if (matches(route) !== false) {
        collisions.push({ path: route, source, destination });
      }
    }
  }
  return { collisions, htmlCount: htmlFiles.length };
}

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function checkRedirectFragmentTargets(siteDir = "_site", redirects = []) {
  const problems = [];
  const htmlCache = new Map();

  for (const { source, destination } of redirects) {
    if (typeof destination !== "string" || !destination.startsWith("/") || !destination.includes("#")) {
      continue;
    }
    const hashIdx = destination.indexOf("#");
    const rawPath = destination.slice(0, hashIdx);
    const rawFragment = destination.slice(hashIdx + 1);
    if (!rawFragment) continue;

    let fragment = rawFragment;
    try {
      fragment = decodeURIComponent(rawFragment);
    } catch {
      // Keep raw fragment if percent-decoding fails.
    }

    const cleanPath = rawPath.replace(/^\/+/, "").replace(/\/+$/, "");
    const targetFile = !cleanPath
      ? path.join(siteDir, "index.html")
      : cleanPath.endsWith(".html")
        ? path.join(siteDir, cleanPath)
        : path.join(siteDir, cleanPath, "index.html");

    if (!existsSync(targetFile)) {
      problems.push(`[redirect-fragment] ${source} -> ${destination}: destination page missing (${targetFile})`);
      continue;
    }

    let stripped = htmlCache.get(targetFile);
    if (stripped === undefined) {
      stripped = readFileSync(targetFile, "utf8")
        .replace(/<!--[\s\S]*?-->/g, "")
        .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, "");
      htmlCache.set(targetFile, stripped);
    }

    const idRe = new RegExp(`\\bid\\s*=\\s*(?:"${escapeRegExp(fragment)}"|'${escapeRegExp(fragment)}')`, "i");
    if (!idRe.test(stripped)) {
      problems.push(
        `[redirect-fragment] ${source} -> ${destination}: anchor #${fragment} not found in ${path.relative(siteDir, targetFile)}`,
      );
    }
  }

  return [...new Set(problems)];
}

export function checkOptimizedImageReferences(siteDir = "_site") {
  const problems = [];
  const checkedRefs = new Set();
  const refPattern = /\/assets\/images\/optimized\/[^"'\s,)<>\\`?#]+/g;

  const inspectFile = (fullPath, rel, isMarkdown) => {
    let text = readFileSync(fullPath, "utf8");
    if (isMarkdown) {
      text = text.replace(FENCE, "").replace(CODE_SPAN, "");
    }
    for (const m of text.matchAll(refPattern)) {
      const urlPath = m[0];
      checkedRefs.add(urlPath);
      let decoded = urlPath;
      try {
        decoded = decodeURIComponent(urlPath);
      } catch {
        // Keep raw path if percent-decoding fails.
      }
      const diskPath = path.join(siteDir, decoded.replace(/^\/+/, ""));
      if (!existsSync(diskPath)) {
        problems.push(`[optimized-image] ${rel} references missing optimized asset: ${urlPath}`);
      }
    }
  };

  for (const { fullPath, rel } of walkSiteFiles(siteDir, ".html", { excludeAssets: true })) {
    inspectFile(fullPath, rel, false);
  }
  for (const { fullPath, rel } of walkSiteFiles(siteDir, ".md", { excludeAssets: true, excludeWellKnown: true })) {
    inspectFile(fullPath, rel, true);
  }

  return { problems: [...new Set(problems)], refsChecked: checkedRefs.size };
}

function inspectJsonLdTrailingSlashes(node, rel, problems) {
  if (!node || typeof node !== "object") return;
  if (Array.isArray(node)) {
    for (const item of node) inspectJsonLdTrailingSlashes(item, rel, problems);
    return;
  }
  for (const [key, value] of Object.entries(node)) {
    if (JSON_LD_URL_KEYS.has(key) && typeof value === "string") {
      const bad = internalTrailingSlashOf(value);
      if (bad) problems.push(`[trailing-slash] ${rel} JSON-LD "${key}": ${bad}`);
    } else if (value && typeof value === "object") {
      inspectJsonLdTrailingSlashes(value, rel, problems);
    }
  }
}

export function checkTrailingSlashLinks(siteDir = "_site") {
  const problems = [];

  // 1. Built site HTML (<a href> and JSON-LD blocks), excluding _site/tsm/ & _site/assets/
  for (const { fullPath, rel } of walkSiteFiles(siteDir, ".html", { excludeAssets: true })) {
    const html = readFileSync(fullPath, "utf8");

    for (const m of html.matchAll(/<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
      try {
        inspectJsonLdTrailingSlashes(JSON.parse(m[1]), rel, problems);
      } catch {
        // Invalid JSON-LD is caught by check-built-json.mjs.
      }
    }

    const bodyHtml = html
      .replace(/<!--[\s\S]*?-->/g, "")
      .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, "");
    for (const m of bodyHtml.matchAll(/<a\b[^>]*\bhref\s*=\s*(?:"([^"]*)"|'([^']*)')/gi)) {
      const href = m[1] ?? m[2] ?? "";
      const bad = internalTrailingSlashOf(href);
      if (bad) problems.push(`[trailing-slash] ${rel} <a href="${bad}">`);
    }
  }

  // 2. Built feed.xml (<link href> and <id>)
  const feedPath = path.join(siteDir, "feed.xml");
  if (existsSync(feedPath)) {
    const feed = readFileSync(feedPath, "utf8");
    for (const m of feed.matchAll(/<link\b[^>]*\bhref\s*=\s*["']([^"']+)["']/gi)) {
      const bad = internalTrailingSlashOf(m[1]);
      if (bad) problems.push(`[trailing-slash] feed.xml <link href="${bad}">`);
    }
    for (const m of feed.matchAll(/<id>([^<]+)<\/id>/gi)) {
      const bad = internalTrailingSlashOf(m[1]);
      if (bad) problems.push(`[trailing-slash] feed.xml <id>${bad}</id>`);
    }
  }

  // 3. Built Markdown twins (links & colophons), excluding _site/tsm/, _site/assets/, _site/.well-known/
  for (const { fullPath, rel } of walkSiteFiles(siteDir, ".md", { excludeAssets: true, excludeWellKnown: true })) {
    const stripped = readFileSync(fullPath, "utf8").replace(FENCE, "").replace(CODE_SPAN, "");
    for (const m of stripped.matchAll(/!?\[[^\]]*\]\(\s*([^\s)"']+)/g)) {
      const bad = internalTrailingSlashOf(m[1]);
      if (bad) problems.push(`[trailing-slash] ${rel} link (${bad})`);
    }
    for (const m of stripped.matchAll(/https:\/\/linxule\.com\/[^\s)"'<>\]]+/gi)) {
      const candidate = m[0].replace(/[.,;:!?]+$/, "");
      const bad = internalTrailingSlashOf(candidate);
      if (bad) problems.push(`[trailing-slash] ${rel} URL (${bad})`);
    }
  }

  return [...new Set(problems)];
}

export function checkSingleH1(siteDir = "_site") {
  const problems = [];
  let pagesChecked = 0;

  for (const { fullPath, rel } of walkSiteFiles(siteDir, ".html", { excludeAssets: true })) {
    pagesChecked++;
    const html = readFileSync(fullPath, "utf8")
      .replace(/<!--[\s\S]*?-->/g, "")
      .replace(/<(script|style|template)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, "");
    const h1Count = (html.match(/<h1(?:\s[^>]*)?>/gi) || []).length;
    if (h1Count !== 1) {
      problems.push(`[h1] ${rel} has ${h1Count} <h1> element(s) (expected exactly 1)`);
    }
  }

  return { problems, pagesChecked };
}

export function checkSourceHygiene(srcDir = "src") {
  const problems = [];

  // 1. Slide decks under src/assets/slides/<slug>/index.html must declare <base href="/assets/slides/<slug>/">
  const slidesRoot = path.join(srcDir, "assets/slides");
  if (existsSync(slidesRoot)) {
    for (const entry of readdirSync(slidesRoot, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const deckHtml = path.join(slidesRoot, entry.name, "index.html");
      if (!existsSync(deckHtml)) continue;
      const expectedBase = `/assets/slides/${entry.name}/`;
      const html = readFileSync(deckHtml, "utf8");
      const baseMatch = html.match(/<base\b[^>]*\bhref\s*=\s*["']([^"']+)["']/i);
      if (!baseMatch) {
        problems.push(`[slides] ${path.relative(".", deckHtml)} is missing <base href="${expectedBase}">`);
      } else if (baseMatch[1] !== expectedBase) {
        problems.push(`[slides] ${path.relative(".", deckHtml)} has <base href="${baseMatch[1]}">, expected "${expectedBase}"`);
      }
    }
  }

  // 2. Writing essays must not hotlink remote images
  const writingRoot = path.join(srcDir, "writing");
  if (existsSync(writingRoot)) {
    for (const file of readdirSync(writingRoot).filter((f) => f.endsWith(".md")).sort()) {
      const fullPath = path.join(writingRoot, file);
      const { content } = matter(readFileSync(fullPath, "utf8"), { cache: false });
      const stripped = content.replace(FENCE, "").replace(CODE_SPAN, "");
      for (const m of stripped.matchAll(/!\[[^\]]*\]\(\s*(https?:\/\/[^\s)"']+)/gi)) {
        problems.push(`[remote-image] ${path.relative(".", fullPath)} uses remote Markdown image: ${m[1]}`);
      }
      for (const m of stripped.matchAll(/<img\b[^>]*\bsrc\s*=\s*["'](https?:\/\/[^"']+)["']/gi)) {
        problems.push(`[remote-image] ${path.relative(".", fullPath)} uses remote <img>: ${m[1]}`);
      }
    }
  }

  // 3. Interactive HTML artifacts must declare a valid local thumbnail
  const artifactsRoot = path.join(srcDir, "making/artifacts");
  if (existsSync(artifactsRoot)) {
    for (const file of readdirSync(artifactsRoot).filter((f) => f.endsWith(".md")).sort()) {
      const fullPath = path.join(artifactsRoot, file);
      const { data } = matter(readFileSync(fullPath, "utf8"), { cache: false });
      if (typeof data.src !== "string" || !/\.html?$/i.test(data.src)) continue;
      if (typeof data.thumbnail !== "string" || !data.thumbnail.trim()) {
        problems.push(`[artifact-thumbnail] ${path.relative(".", fullPath)} has HTML src (${data.src}) without a thumbnail:`);
      } else if (data.thumbnail.startsWith("/")) {
        const thumbPath = path.join(srcDir, data.thumbnail.replace(/^\//, ""));
        if (!existsSync(thumbPath)) {
          problems.push(`[artifact-thumbnail] ${path.relative(".", fullPath)} thumbnail does not exist: ${data.thumbnail}`);
        }
      }
    }
  }

  return problems;
}

if (import.meta.main) {
  const config = JSON.parse(readFileSync("vercel.json", "utf8"));
  const redirects = config.redirects ?? [];
  const sitemap = readFileSync("_site/sitemap.xml", "utf8");
  const { collisions, redirectCount, sitemapCount } = findRedirectCollisions(sitemap, redirects);
  const { collisions: htmlCollisions, htmlCount } = findBuiltHtmlRedirectCollisions("_site", redirects);

  const problems = [];
  const seenCollisions = new Set();
  for (const { path: collisionPath, source } of [...collisions, ...htmlCollisions]) {
    const key = `${collisionPath}|${source}`;
    if (seenCollisions.has(key)) continue;
    seenCollisions.add(key);
    problems.push(`[redirect-collision] ${collisionPath} matches redirect ${source}`);
  }
  problems.push(...checkRedirectFragmentTargets("_site", redirects));
  problems.push(...checkSitemapInvariants(sitemap));
  problems.push(...checkTrailingSlashLinks("_site"));
  const { problems: imageProblems, refsChecked } = checkOptimizedImageReferences("_site");
  problems.push(...imageProblems);
  const { problems: h1Problems, pagesChecked } = checkSingleH1("_site");
  problems.push(...h1Problems);
  problems.push(...checkSourceHygiene("src"));

  console.log(
    `[sitemap-redirects] checked ${sitemapCount} sitemap URL(s) and ${htmlCount} built HTML route(s) against ${redirectCount} redirect rule(s), ${refsChecked} optimized image ref(s), and ${pagesChecked} site HTML page(s).`,
  );

  if (problems.length > 0) {
    console.error(`[sitemap-redirects] FAILED — ${problems.length} problem(s):`);
    for (const problem of problems) {
      console.error(`  - ${problem}`);
    }
    process.exit(1);
  }

  console.log(
    "[sitemap-redirects] OK — no redirect collisions (sitemap or built HTML), all redirect fragments valid, all optimized image refs present on disk, 0 /assets/ sitemap URLs, all 9 series in sitemap, 0 internal trailing-slash links, exactly 1 <h1> per site page, and source hygiene clean.",
  );
}
