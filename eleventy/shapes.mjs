/**
 * Shared content-shape & Markdown-twin registry for linxule.com.
 *
 * Pure ESM with ZERO Node.js or Eleventy imports so Vercel Edge Middleware
 * (`middleware.ts`), the Cloudflare Worker (`mcp/metadata.mjs`), Eleventy
 * (`eleventy/filters.js`), and post-build verification (`scripts/check-renderings.mjs`)
 * all derive from a single source of truth.
 */

export const COLLECTION_TWINS = Object.freeze([
  Object.freeze({
    id: "writing",
    collection: "writing",
    urlPrefix: "/writing/",
    dir: "writing",
    layout: "writing.njk",
    mdTemplate: "src/md-outputs/writing.md.njk",
    pagefindType: "writing",
    inFeed: true,
  }),
  Object.freeze({
    id: "portraits",
    collection: "portraits",
    urlPrefix: "/making/portraits/",
    dir: "making/portraits",
    layout: "portrait.njk",
    mdTemplate: "src/md-outputs/portraits.md.njk",
    pagefindType: "portrait",
    inFeed: true,
  }),
  Object.freeze({
    id: "artifacts",
    collection: "artifacts",
    urlPrefix: "/making/artifacts/",
    dir: "making/artifacts",
    layout: "artifact.njk",
    mdTemplate: "src/md-outputs/artifacts.md.njk",
    pagefindType: "artifact",
    inFeed: true,
  }),
  Object.freeze({
    id: "talks",
    collection: "talks",
    urlPrefix: "/talks/",
    dir: "talks",
    layout: "talk.njk",
    mdTemplate: "src/md-outputs/talks.md.njk",
    pagefindType: "talk",
    inFeed: true,
  }),
  Object.freeze({
    id: "papers",
    collection: "papers",
    urlPrefix: "/papers/",
    dir: "papers",
    layout: "paper.njk",
    mdTemplate: "src/md-outputs/papers.md.njk",
    pagefindType: "paper",
    inFeed: true,
  }),
]);

export const STATIC_TWINS = Object.freeze([
  Object.freeze({
    id: "root",
    url: "/",
    mdUrl: "/index.md",
    mdTemplate: "src/md-outputs/index.md.njk",
    title: "Xule Lin — Homepage Overview",
    section: "root",
    pagefind: false,
    layout: null,
  }),
  Object.freeze({
    id: "writing-index",
    url: "/writing",
    mdUrl: "/writing.md",
    mdTemplate: "src/md-outputs/writing-index.md.njk",
    title: "Writing Index",
    section: "writing",
    pagefind: false,
    layout: null,
  }),
  Object.freeze({
    id: "making-index",
    url: "/making",
    mdUrl: "/making.md",
    mdTemplate: "src/md-outputs/making-index.md.njk",
    title: "Making Index",
    section: "making",
    pagefind: false,
    layout: null,
  }),
  Object.freeze({
    id: "talks-index",
    url: "/talks",
    mdUrl: "/talks.md",
    mdTemplate: "src/md-outputs/talks-index.md.njk",
    title: "Talks Index",
    section: "talks",
    pagefind: false,
    layout: null,
  }),
  Object.freeze({
    id: "papers-index",
    url: "/papers",
    mdUrl: "/papers.md",
    mdTemplate: "src/md-outputs/papers-index.md.njk",
    title: "Papers Index",
    section: "papers",
    pagefind: false,
    layout: null,
  }),
  Object.freeze({
    id: "thinking",
    url: "/thinking",
    mdUrl: "/thinking.md",
    mdTemplate: "src/md-outputs/thinking.md.njk",
    title: "Thinking — Research Framework",
    section: "thinking",
    pagefind: true,
    layout: "thinking.njk",
  }),
  Object.freeze({
    id: "concepts",
    url: "/concepts",
    mdUrl: "/concepts.md",
    mdTemplate: "src/md-outputs/concepts.md.njk",
    title: "Concepts — Signature Concepts by Territory",
    section: "concepts",
    pagefind: true,
    layout: "concepts.njk",
  }),
  Object.freeze({
    id: "teaching",
    url: "/teaching",
    mdUrl: "/teaching.md",
    mdTemplate: "src/md-outputs/teaching.md.njk",
    title: "Teaching",
    section: "teaching",
    pagefind: true,
    layout: "teaching.njk",
  }),
  Object.freeze({
    id: "builds",
    url: "/builds",
    mdUrl: "/builds.md",
    mdTemplate: "src/md-outputs/builds.md.njk",
    title: "Builds — Open-Source Tools and Public Infrastructure",
    section: "builds",
    pagefind: true,
    layout: "builds.njk",
  }),
  Object.freeze({
    id: "vellum",
    url: "/builds/vellum",
    mdUrl: "/builds/vellum.md",
    mdTemplate: "src/md-outputs/vellum.md.njk",
    title: "Vellum",
    section: "builds",
    pagefind: true,
    layout: "vellum.njk",
  }),
  Object.freeze({
    id: "cv",
    url: "/cv",
    mdUrl: "/cv.md",
    mdTemplate: "src/md-outputs/cv.md.njk",
    title: "CV (English)",
    section: "cv",
    pagefind: true,
    layout: "cv.njk",
  }),
  Object.freeze({
    id: "cv-zh",
    url: "/cv-zh",
    mdUrl: "/cv-zh.md",
    mdTemplate: "src/md-outputs/cv-zh.md.njk",
    title: "CV (中文)",
    section: "cv",
    pagefind: true,
    layout: "cv.njk",
  }),
  Object.freeze({
    id: "connect",
    url: "/connect",
    mdUrl: "/connect.md",
    mdTemplate: "src/md-outputs/connect.md.njk",
    title: "Connect — MCP & Agent Surfaces",
    section: "builds",
    pagefind: true,
    layout: null,
    sourceFile: "src/connect.njk",
  }),
]);

/**
 * Matches every negotiable unsuffixed content path (excluding direct `.md` URLs,
 * `/writing/attachments/*`, `/writing/series/*`, filter books, `/search`, and `/404.html`).
 * Root (`/`) negotiates via a dedicated branch in `middleware.ts` and `/index` matches here too.
 */
export const MD_PATHS =
  /^\/(?!.*\.md\/?$)(index|writing|making|talks|papers|thinking|concepts|teaching|builds|cv|cv-zh|connect|builds\/[^/]+|writing\/(?!attachments(?:\/|$)|series(?:\/|$))[^/]+|making\/(?:portraits|artifacts)\/[^/]+|talks\/[^/]+|papers\/[^/]+)\/?$/;

/**
 * Exact Vercel Edge Middleware matcher list (kept in sync with the static literal
 * `export const config = { matcher: [...] }` in `middleware.ts`, verified by
 * `scripts/check-renderings.mjs` and `scripts/middleware.test.mjs`).
 */
export const MIDDLEWARE_MATCHERS = Object.freeze([
  "/",
  "/writing/:path",
  "/writing",
  "/making/portraits/:path",
  "/making/artifacts/:path",
  "/making",
  "/talks/:path",
  "/talks",
  "/papers/:path",
  "/papers",
  "/cv",
  "/cv-zh",
  "/thinking",
  "/teaching",
  "/concepts",
  "/builds",
  "/builds/:path",
  "/connect",
]);

/**
 * Compute the Markdown twin URL for any site URL, or `null` when the page has no twin.
 * Used by `base.njk` (`mdAlternate` filter) so `<link rel="alternate">` and the footer
 * rendering marker can never disagree or advertise phantom twins.
 */
export function mdAlternateForUrl(url) {
  if (!url || typeof url !== "string") return null;
  const pathname = url.split(/[?#]/, 1)[0];
  if (!pathname.startsWith("/")) return null;
  if (pathname === "/") return "/index.md";
  if (pathname.endsWith(".md") || pathname.endsWith(".html")) return null;
  const normalized = pathname.replace(/\/+$/, "");
  if (!normalized) return "/index.md";
  if (!MD_PATHS.test(normalized)) return null;
  return `${normalized}.md`;
}
