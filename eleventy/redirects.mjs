/**
 * Canonical redirect table, agent discovery Link header, and Markdown Accept
 * negotiation helper for linxule.com.
 *
 * Pure ESM with ZERO Node.js or external runtime dependencies so the
 * Cloudflare Worker (`worker.ts`) and build/verification scripts
 * (`scripts/check-sitemap-redirects.mjs`, `scripts/worker.test.mjs`) all share
 * a single source of truth.
 */

export const DISCOVERY_LINK_HEADER =
  '</llms.txt>; rel="service-doc"; type="text/plain", </connect.md>; rel="service-doc"; type="text/markdown", </.well-known/api-catalog>; rel="api-catalog"; type="application/linkset+json", </site-index.json>; rel="describedby"; type="application/json", </sitemap.xml>; rel="sitemap"; type="application/xml", </llms.txt>; rel="llms-txt"; type="text/plain", </.well-known/agent-skills/index.json>; rel="agent-skills"; type="application/json", </.well-known/ai-catalog.json>; rel="ai-catalog"; type="application/json", </.well-known/mcp/server-card.json>; rel="service-desc"; type="application/json"';

export const REDIRECTS = Object.freeze([
  Object.freeze({
    source: "/favicon.ico",
    destination: "/assets/favicon.svg",
    statusCode: 301,
  }),
  Object.freeze({
    source: "/favicon.png",
    destination: "/assets/favicon-32.png",
    statusCode: 301,
  }),
  Object.freeze({
    source: "/curation-dao/:path*",
    destination: "/writing/dao-governance-resources",
    statusCode: 301,
  }),
  Object.freeze({
    source: "/curation-dao",
    destination: "/writing/dao-governance-resources",
    statusCode: 301,
  }),
  Object.freeze({
    source: "/curation-mgmt",
    destination: "/cv",
    statusCode: 301,
  }),
  Object.freeze({
    source: "/daogov/:path*",
    destination: "/writing/dao-governance-resources",
    statusCode: 301,
  }),
  Object.freeze({
    source: "/daogov",
    destination: "/writing/dao-governance-resources",
    statusCode: 301,
  }),
  Object.freeze({
    source: "/markdown",
    destination: "/",
    statusCode: 301,
  }),
  Object.freeze({
    source: "/about",
    destination: "/",
    statusCode: 301,
  }),
  Object.freeze({
    source: "/terms",
    destination: "/license.xml",
    statusCode: 301,
  }),
  Object.freeze({
    source: "/publications/:path*",
    destination: "/cv#publications",
    statusCode: 301,
  }),
  Object.freeze({
    source: "/publications",
    destination: "/cv#publications",
    statusCode: 301,
  }),
  Object.freeze({
    source: "/publication/:path*",
    destination: "/cv#publications",
    statusCode: 301,
  }),
  Object.freeze({
    source: "/posts/2024/06/openai-discord",
    destination: "https://github.com/linxule/openai-assistants-discord-bot",
    statusCode: 301,
  }),
  Object.freeze({
    source: "/posts/2023/10/macaw",
    destination: "/writing/macaw-markdown-academic-writing",
    statusCode: 301,
  }),
  Object.freeze({
    source: "/posts/2020/06/resources-for-dao-research/:path*",
    destination: "/writing/dao-governance-resources",
    statusCode: 301,
  }),
  Object.freeze({
    source: "/posts/:path*",
    destination: "/writing",
    statusCode: 301,
  }),
  Object.freeze({
    source: "/sitemap",
    destination: "/sitemap.xml",
    statusCode: 301,
  }),
  Object.freeze({
    source: "/cV",
    destination: "/cv",
    statusCode: 301,
  }),
  Object.freeze({
    source: "/CV",
    destination: "/cv",
    statusCode: 301,
  }),
  Object.freeze({
    source: "/CV-zh",
    destination: "/cv-zh",
    statusCode: 301,
  }),
  Object.freeze({
    source: "/CV-ZH",
    destination: "/cv-zh",
    statusCode: 301,
  }),
  Object.freeze({
    source: "/简历",
    destination: "/cv-zh",
    statusCode: 301,
  }),
  Object.freeze({
    source: "/履历",
    destination: "/cv-zh",
    statusCode: 301,
  }),
  Object.freeze({
    source: "/Writing",
    destination: "/writing",
    statusCode: 301,
  }),
  Object.freeze({
    source: "/Making",
    destination: "/making",
    statusCode: 301,
  }),
  Object.freeze({
    source: "/llm.txt",
    destination: "/llms.txt",
    statusCode: 301,
  }),
  Object.freeze({
    source: "/llm",
    destination: "/llms.txt",
    statusCode: 301,
  }),
  Object.freeze({
    source: "/llms",
    destination: "/llms.txt",
    statusCode: 301,
  }),
  Object.freeze({
    source: "/llms-full.txt",
    destination: "/llms.txt",
    statusCode: 301,
  }),
  Object.freeze({
    source: "/ai",
    destination: "/llms.txt",
    statusCode: 301,
  }),
  Object.freeze({
    source: "/for-ai",
    destination: "/llms.txt",
    statusCode: 301,
  }),
  Object.freeze({
    source: "/collection-archive",
    destination: "/writing",
    statusCode: 301,
  }),
  Object.freeze({
    source: "/year-archive",
    destination: "/writing",
    statusCode: 301,
  }),
  Object.freeze({
    source: "/page-archive",
    destination: "/writing",
    statusCode: 301,
  }),
  Object.freeze({
    source: "/projects",
    destination: "/builds",
    statusCode: 301,
  }),
  Object.freeze({
    source: "/projects.md",
    destination: "/builds.md",
    statusCode: 301,
  }),
  Object.freeze({
    source: "/projects/md_academic",
    destination: "/writing/macaw-markdown-academic-writing",
    statusCode: 301,
  }),
  Object.freeze({
    source: "/projects/:path+",
    destination: "/writing",
    statusCode: 301,
  }),
  Object.freeze({
    source: "/resume",
    destination: "/cv",
    statusCode: 301,
  }),
  Object.freeze({
    source: "/talkmap.html",
    destination: "/talks",
    statusCode: 301,
  }),
  Object.freeze({
    source: "/talkmap",
    destination: "/talks",
    statusCode: 301,
  }),
  Object.freeze({
    source: "/archive-layout-with-content",
    destination: "/writing",
    statusCode: 301,
  }),
  Object.freeze({
    source: "/talks/2023-08/aom",
    destination: "/talks",
    statusCode: 301,
  }),
  Object.freeze({
    source: "/talks/2023-04/ukfan",
    destination: "/cv",
    statusCode: 301,
  }),
  Object.freeze({
    source: "/talks/2023-08-01/aom",
    destination: "/talks",
    statusCode: 301,
  }),
  Object.freeze({
    source: "/talks/2023-12/methods-reading",
    destination: "/talks",
    statusCode: 301,
  }),
  Object.freeze({
    source: "/talks/2023-12/sei",
    destination: "/talks",
    statusCode: 301,
  }),
  Object.freeze({
    source: "/talks/2024-05/ccc",
    destination: "/talks",
    statusCode: 301,
  }),
  Object.freeze({
    source: "/talks/2024-08/aom",
    destination: "/talks",
    statusCode: 301,
  }),
  Object.freeze({
    source: "/teaching/2014-spring-teaching-1",
    destination: "/teaching",
    statusCode: 301,
  }),
  Object.freeze({
    source: "/tag/academic-writing",
    destination: "/writing",
    statusCode: 301,
  }),
  Object.freeze({
    source: "/tag/ai-workflows",
    destination: "/tag/ai-research-workflow",
    statusCode: 301,
  }),
  Object.freeze({
    source: "/tag/organizational-principles",
    destination: "/tag/organizational-design",
    statusCode: 301,
  }),
  Object.freeze({
    source: "/tag/qualitative-methods",
    destination: "/tag/qualitative-research",
    statusCode: 301,
  }),
  Object.freeze({
    source: "/tag/research-methods",
    destination: "/tag/research-methodology",
    statusCode: 301,
  }),
  Object.freeze({
    source: "/.well-known/mcp.json",
    destination: "/.well-known/mcp/server-card.json",
    statusCode: 308,
  }),
]);

const COMPILED_REDIRECTS = Object.freeze(
  REDIRECTS.map((rule) => {
    const { source } = rule;
    if (source.endsWith("/:path*")) {
      const prefix = source.slice(0, -"/:path*".length);
      const prefixWithSlash = `${prefix}/`;
      return Object.freeze({
        rule,
        matches: (pathname) => pathname === prefix || pathname.startsWith(prefixWithSlash),
      });
    }
    if (source.endsWith("/:path+")) {
      const prefix = source.slice(0, -"/:path+".length);
      const prefixWithSlash = `${prefix}/`;
      const minLength = prefix.length + 1;
      return Object.freeze({
        rule,
        matches: (pathname) => pathname.startsWith(prefixWithSlash) && pathname.length > minLength,
      });
    }
    return Object.freeze({
      rule,
      matches: (pathname) => pathname === source,
    });
  }),
);

function decodePathSegments(pathname) {
  if (!pathname.includes("%")) return null;
  try {
    const decoded = pathname
      .split("/")
      .map((segment) => {
        if (!segment.includes("%")) return segment;
        const candidate = decodeURIComponent(segment);
        return candidate.includes("/") ? segment : candidate;
      })
      .join("/");
    return decoded !== pathname ? decoded : null;
  } catch {
    return null;
  }
}

export function matchRedirect(rawPathname) {
  if (!rawPathname || typeof rawPathname !== "string") return null;
  const stripped = rawPathname === "/" ? "/" : rawPathname.replace(/\/+$/, "") || "/";
  const decoded = decodePathSegments(stripped);

  for (const entry of COMPILED_REDIRECTS) {
    if (entry.matches(stripped) || (decoded !== null && entry.matches(decoded))) {
      return entry.rule;
    }
  }
  return null;
}

function parseQuality(parameters) {
  for (const parameter of parameters) {
    const match = parameter.match(/^q\s*=\s*(?:"([^"]*)"|(\S+))$/i);
    if (!match) continue;
    const raw = (match[1] ?? match[2]).trim();
    if (!/^(?:0(?:\.\d+)?|1(?:\.0*)?)$/.test(raw)) return 0;
    return Number(raw);
  }
  return 1;
}

export function prefersMarkdown(accept) {
  if (!accept || typeof accept !== "string") return false;
  let markdownQ = -1;
  let explicitHtmlQ = -1;
  let textWildcardQ = -1;
  let anyWildcardQ = -1;

  for (const part of accept.split(",")) {
    const [rawMediaType, ...parameters] = part.split(";").map((value) => value.trim());
    const mediaType = rawMediaType.toLowerCase();
    if (!mediaType) continue;

    const q = parseQuality(parameters);
    if (mediaType === "text/markdown") {
      markdownQ = Math.max(markdownQ, q);
    } else if (mediaType === "text/html") {
      explicitHtmlQ = Math.max(explicitHtmlQ, q);
    } else if (mediaType === "text/*") {
      textWildcardQ = Math.max(textWildcardQ, q);
    } else if (mediaType === "*/*") {
      anyWildcardQ = Math.max(anyWildcardQ, q);
    }
  }

  if (markdownQ <= 0) return false;

  const htmlQ =
    explicitHtmlQ >= 0
      ? explicitHtmlQ
      : textWildcardQ >= 0
        ? textWildcardQ
        : anyWildcardQ >= 0
          ? anyWildcardQ
          : 0;

  // Explicit text/markdown wins ties against HTML; strictly higher HTML q serves HTML.
  return markdownQ >= htmlQ;
}
