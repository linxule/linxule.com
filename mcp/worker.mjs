/**
 * Stateless, zero-dependency Cloudflare Worker serving `https://linxule.com/mcp`
 * (Streamable HTTP JSON-RPC 2.0) and `https://linxule.com/mcp/server-card` (SEP-2127).
 *
 * Backed solely by `linxule.com`'s curated public machine surfaces
 * (`/site-index.json`, `/llms.txt`, `/.well-known/agent-skills/...`, and `.md` twins)
 * with an explicit path allowlist so arbitrary URLs can never be fetched.
 */
import {
  LIST_KINDS,
  MCP_CAPABILITIES,
  MCP_ENDPOINT_PATH,
  MCP_INSTRUCTIONS,
  MCP_PROMPTS,
  MCP_RESOURCE_TEMPLATES,
  MCP_SERVER_CARD_PATH,
  MCP_SERVER_INFO,
  MCP_STATIC_RESOURCES,
  MCP_SUPPORTED_PROTOCOLS,
  MCP_TOOLS,
  PAGE_SECTIONS,
  SEARCH_KINDS,
  STATIC_MARKDOWN_TWINS,
  buildMcpServerCard,
} from "./metadata.mjs";

const BODY_LIMIT_BYTES = 16 * 1024;
const PAGE_LIMIT_BYTES = 256 * 1024;
const READ_TIMEOUT_MS = 5_000;
const UPSTREAM_TIMEOUT_MS = 10_000;
const DEFAULT_PROTOCOL = "2025-11-25";
const SHA256_RE = /^[0-9a-f]{64}$/;

const BASE_CORS_HEADERS = Object.freeze({
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Accept, MCP-Protocol-Version, Mcp-Session-Id, Last-Event-ID, If-None-Match",
  "Access-Control-Expose-Headers": "MCP-Protocol-Version, X-Linxule-Mcp-Version",
  "Access-Control-Max-Age": "86400",
  "X-Linxule-Mcp-Version": MCP_SERVER_INFO.version,
});

class JsonRpcError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
  }
}

function isPlainObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function splitCsv(raw) {
  return String(raw || "")
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

export function allowedHost(request, env = {}) {
  const url = new URL(request.url);
  const hostHeader = request.headers.get("host");
  const allowed = splitCsv(env.ALLOWED_HOSTS ?? "linxule.com,127.0.0.1:8788");
  const isLoopback = ["127.0.0.1", "localhost", "[::1]"].includes(url.hostname);
  return (
    allowed.includes(url.host) &&
    (hostHeader === null || hostHeader === url.host) &&
    (isLoopback || url.protocol === "https:")
  );
}

export async function boundedBody(request, timeoutMs = READ_TIMEOUT_MS) {
  const reader = request.body?.getReader();
  if (!reader) return new Uint8Array();
  const chunks = [];
  let total = 0;
  let timer;
  let onAbort = () => {};
  const stop = new Promise((_, reject) => {
    onAbort = () => {
      reject(new Error("ABORTED"));
      void reader.cancel().catch(() => {});
    };
    request.signal?.addEventListener("abort", onAbort, { once: true });
    if (request.signal?.aborted) onAbort();
    timer = setTimeout(() => {
      reject(new Error("TIMEOUT"));
      void reader.cancel().catch(() => {});
    }, timeoutMs);
  });

  try {
    while (true) {
      const { done, value } = await Promise.race([reader.read(), stop]);
      if (done) break;
      total += value.byteLength;
      if (total > BODY_LIMIT_BYTES) {
        void reader.cancel().catch(() => {});
        throw new Error("TOO_LARGE");
      }
      chunks.push(value);
    }
    const merged = new Uint8Array(total);
    let offset = 0;
    for (const chunk of chunks) {
      merged.set(chunk, offset);
      offset += chunk.byteLength;
    }
    return merged;
  } finally {
    clearTimeout(timer);
    request.signal?.removeEventListener("abort", onAbort);
    reader.releaseLock();
  }
}

async function sha256Hex(bytes) {
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}

function attributionForSection(section, canonicalUrl) {
  if (section === "portraits" || section === "artifacts" || section === "making") {
    return `Accompanying prose is CC BY 4.0 (Xule Lin, ${canonicalUrl}); AI-generated visuals/artifacts carry per-page provenance — check the page before reusing media.`;
  }
  if (section === "papers") {
    return `Paper landing metadata is CC BY 4.0 (${canonicalUrl}); prefer the formal DOI or arXiv citation in the page header.`;
  }
  return `CC BY 4.0 — credit Xule Lin (林徐乐) and link ${canonicalUrl}.`;
}

function tokenizeQuery(rawQuery) {
  const normalized = rawQuery.trim().toLowerCase();
  const terms = normalized
    .split(/[^\p{L}\p{N}#+-]+/u)
    .map((t) => t.trim())
    .filter((t) => t.length >= 2 || /\p{Script=Han}/u.test(t));
  return { normalized, terms: terms.length ? terms : [normalized] };
}

function asStringArray(value) {
  if (Array.isArray(value)) return value.filter(Boolean).map((entry) => String(entry));
  if (typeof value === "string" && value.trim()) return [value.trim()];
  return [];
}

function scoreFields(queryInfo, primaryText, keywordList, secondaryText) {
  const { normalized, terms } = queryInfo;
  const primary = String(primaryText || "").toLowerCase();
  const keywords = asStringArray(keywordList).map((k) => k.toLowerCase());
  const secondary = String(secondaryText || "").toLowerCase();

  let score = 0;
  let matchedTerms = 0;

  if (primary === normalized) score += 120;
  else if (primary.includes(normalized)) score += 70;

  if (keywords.some((kw) => kw === normalized)) score += 80;
  else if (keywords.some((kw) => kw.includes(normalized))) score += 45;

  if (secondary.includes(normalized)) score += 30;

  for (const term of terms) {
    let hit = false;
    if (primary.includes(term)) {
      score += 24;
      hit = true;
    }
    if (keywords.some((kw) => kw.includes(term))) {
      score += 16;
      hit = true;
    }
    if (secondary.includes(term)) {
      score += 8;
      hit = true;
    }
    if (hit) matchedTerms += 1;
  }

  if (matchedTerms === 0) return 0;
  if (matchedTerms === terms.length && terms.length > 1) score += 25;
  return score;
}

function assertAllowedKeys(args, allowedKeys, contextLabel) {
  if (!isPlainObject(args)) {
    throw new JsonRpcError(-32602, `${contextLabel}: arguments must be an object`);
  }
  for (const key of Object.keys(args)) {
    if (!allowedKeys.has(key)) {
      throw new JsonRpcError(-32602, `${contextLabel}: unexpected argument "${key}"`);
    }
  }
}

/**
 * Normalize a caller-supplied path or `https://linxule.com/...` URL into a clean
 * origin-relative pathname without query, hash, or path traversal. Returns `null`
 * if the input points at another origin or contains traversal/control characters.
 */
export function normalizeCandidatePath(rawInput, siteOrigin) {
  if (typeof rawInput !== "string") return null;
  const trimmed = rawInput.trim();
  if (!trimmed || trimmed.length > 200) return null;
  if (/[\0\\\s?#]/.test(trimmed)) return null;

  let pathname = trimmed;
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(trimmed)) {
    let parsed;
    try {
      parsed = new URL(trimmed);
    } catch {
      return null;
    }
    if (parsed.origin !== siteOrigin || parsed.search || parsed.hash) return null;
    pathname = parsed.pathname;
  }

  if (!pathname.startsWith("/")) pathname = `/${pathname}`;

  let decoded;
  try {
    decoded = decodeURIComponent(pathname);
  } catch {
    return null;
  }
  if (
    decoded.includes("..") ||
    decoded.includes("//") ||
    decoded.includes("\\") ||
    decoded === "/mcp" ||
    decoded.startsWith("/mcp/")
  ) {
    return null;
  }

  if (pathname.length > 1 && pathname.endsWith("/")) {
    pathname = pathname.slice(0, -1);
  }
  return pathname;
}

export function createWorker({
  fetchImpl = globalThis.fetch,
  cacheTtlMs = 5 * 60 * 1000,
} = {}) {
  const indexCache = new Map(); // siteOrigin -> { expiresAt, data }

  async function fetchOriginBytes(siteOrigin, relativePath, acceptHeader) {
    const targetUrl = `${siteOrigin}${relativePath}`;
    const response = await fetchImpl(targetUrl, {
      method: "GET",
      redirect: "manual",
      headers: {
        Accept: acceptHeader,
        "User-Agent": "linxule-mcp/1.0",
      },
      cf: { cacheTtl: 300, cacheEverything: true },
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    });

    if (response.status >= 300 && response.status < 400) {
      throw new Error(`UPSTREAM_REDIRECT:${response.status}`);
    }
    if (response.status === 404) {
      return { status: 404, bytes: new Uint8Array() };
    }
    if (response.status !== 200) {
      throw new Error(`UPSTREAM_HTTP:${response.status}`);
    }

    const buffer = await response.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    if (bytes.byteLength > PAGE_LIMIT_BYTES) {
      return { status: 413, bytes };
    }
    return { status: 200, bytes };
  }

  async function loadSiteIndex(siteOrigin) {
    const now = Date.now();
    const cached = indexCache.get(siteOrigin);
    if (cached && cached.expiresAt > now) {
      return cached.data;
    }

    const result = await fetchOriginBytes(siteOrigin, "/site-index.json", "application/json");
    if (result.status !== 200) {
      throw new Error("SITE_INDEX_UNAVAILABLE");
    }
    const parsed = JSON.parse(new TextDecoder().decode(result.bytes));
    if (!isPlainObject(parsed) || !Array.isArray(parsed.pages)) {
      throw new Error("SITE_INDEX_INVALID");
    }

    const byCanonical = new Map();
    const byMd = new Map();
    for (const page of parsed.pages) {
      if (!isPlainObject(page) || typeof page.url !== "string" || typeof page.url_md !== "string") {
        continue;
      }
      const cleanUrl = page.url.replace(/\/$/, "") || "/";
      byCanonical.set(cleanUrl, page);
      byMd.set(page.url_md, page);
    }

    const record = {
      rawBytes: result.bytes,
      rawText: new TextDecoder().decode(result.bytes),
      index: parsed,
      byCanonical,
      byMd,
    };
    indexCache.set(siteOrigin, { expiresAt: now + cacheTtlMs, data: record });
    return record;
  }

  async function resolveAllowlistedTarget(rawInput, siteOrigin) {
    const normalized = normalizeCandidatePath(rawInput, siteOrigin);
    if (!normalized) return null;

    // 1. Check fixed static twins first (including `/index.md` -> `/` entry).
    if (Object.prototype.hasOwnProperty.call(STATIC_MARKDOWN_TWINS, normalized)) {
      return STATIC_MARKDOWN_TWINS[normalized];
    }
    for (const entry of Object.values(STATIC_MARKDOWN_TWINS)) {
      if (entry.mdPath === normalized) return entry;
    }

    // 2. Check dynamic `site-index.json` pages allowlist.
    const { byCanonical, byMd } = await loadSiteIndex(siteOrigin);
    const page = byCanonical.get(normalized) ?? byMd.get(normalized);
    if (!page) return null;

    return {
      canonicalPath: page.url.replace(/\/$/, "") || "/",
      mdPath: page.url_md,
      title: page.title,
      section: page.section || "pages",
      date: page.date,
      authors: page.authors,
      mimeType: "text/markdown",
    };
  }

  async function runSearchSite(args, siteOrigin) {
    assertAllowedKeys(args, new Set(["query", "kind", "section", "limit"]), "search_site");
    if (typeof args.query !== "string" || args.query.trim().length < 1 || args.query.length > 200) {
      throw new JsonRpcError(-32602, "search_site: `query` must be a non-empty string up to 200 chars");
    }
    const kind = args.kind ?? "all";
    if (!SEARCH_KINDS.includes(kind)) {
      throw new JsonRpcError(-32602, `search_site: invalid kind "${String(kind)}"`);
    }
    const section = args.section;
    if (section !== undefined && !PAGE_SECTIONS.includes(section)) {
      throw new JsonRpcError(-32602, `search_site: invalid section "${String(section)}"`);
    }
    const limit = args.limit ?? 10;
    if (!Number.isInteger(limit) || limit < 1 || limit > 25) {
      throw new JsonRpcError(-32602, "search_site: `limit` must be an integer between 1 and 25");
    }

    const { index } = await loadSiteIndex(siteOrigin);
    const queryInfo = tokenizeQuery(args.query);
    const scored = [];

    if (kind === "all" || kind === "pages") {
      for (const page of index.pages || []) {
        if (section && page.section !== section) continue;
        const secondary = [
          page.summary,
          page.section,
          page.venue,
          page.event,
          page.medium,
          page.prompter,
          page.generator,
          page.creator,
          ...asStringArray(page.authors),
          ...asStringArray(page.speakers),
        ]
          .filter(Boolean)
          .join(" ");
        const score = scoreFields(queryInfo, page.title, page.keywords, secondary);
        if (score > 0) {
          scored.push({
            score,
            item: {
              kind: "page",
              section: page.section,
              title: page.title,
              path: page.url,
              url: `${siteOrigin}${page.url}`,
              markdown_url: `${siteOrigin}${page.url_md}`,
              ...(page.date ? { date: page.date } : {}),
              ...(asStringArray(page.authors).length ? { authors: asStringArray(page.authors) } : {}),
              ...(page.summary ? { summary: page.summary } : {}),
            },
          });
        }
      }
    }

    if (!section && (kind === "all" || kind === "concepts")) {
      for (const concept of index.concepts || []) {
        const secondary = [concept.definition, concept.canonicalEssay, ...asStringArray(concept.authors)]
          .filter(Boolean)
          .join(" ");
        const score = scoreFields(queryInfo, concept.term, [concept.canonicalEssay], secondary);
        if (score > 0) {
          const essayPath = String(concept.url || "").split("#")[0];
          scored.push({
            score,
            item: {
              kind: "concept",
              term: concept.term,
              definition: concept.definition,
              canonical_essay: concept.canonicalEssay,
              ...(essayPath ? { read_path: essayPath } : {}),
              url: `${siteOrigin}${concept.url}`,
              ...(concept.date ? { date: concept.date } : {}),
            },
          });
        }
      }
    }

    if (!section && (kind === "all" || kind === "publications")) {
      for (const pub of index.publications || []) {
        const secondary = [
          pub.venue,
          pub.type,
          pub.doi,
          pub.arxiv,
          ...asStringArray(pub.authors),
          ...asStringArray(pub.coins),
        ]
          .filter(Boolean)
          .join(" ");
        const score = scoreFields(queryInfo, pub.title, pub.coins, secondary);
        if (score > 0) {
          scored.push({
            score,
            item: {
              kind: "publication",
              title: pub.title,
              authors: pub.authors,
              year: pub.year,
              venue: pub.venue,
              url: pub.url,
              ...(pub.doi ? { doi: pub.doi } : {}),
              ...(pub.arxiv ? { arxiv: pub.arxiv } : {}),
              ...(pub.onSite ? { read_path: pub.onSite } : {}),
            },
          });
        }
      }
    }

    if (!section && (kind === "all" || kind === "projects")) {
      for (const proj of index.projects || []) {
        const secondary = [proj.description, proj.note, proj.group, proj.license]
          .filter(Boolean)
          .join(" ");
        const score = scoreFields(queryInfo, proj.name, [proj.group], secondary);
        if (score > 0) {
          scored.push({
            score,
            item: {
              kind: "project",
              name: proj.name,
              group: proj.group,
              description: proj.description,
              url: proj.url,
              ...(proj.license ? { license: proj.license } : {}),
              read_path: "/builds",
            },
          });
        }
      }
    }

    scored.sort((a, b) => b.score - a.score);
    return {
      ok: true,
      index_version: index.version ?? "unknown",
      query: args.query.trim(),
      kind,
      ...(section ? { section } : {}),
      matches: scored.slice(0, limit).map((entry) => entry.item),
    };
  }

  async function runListSite(args, siteOrigin) {
    assertAllowedKeys(args, new Set(["kind", "section", "limit"]), "list_site");
    const kind = args.kind ?? "overview";
    if (!LIST_KINDS.includes(kind)) {
      throw new JsonRpcError(-32602, `list_site: invalid kind "${String(kind)}"`);
    }
    const section = args.section;
    if (section !== undefined && !PAGE_SECTIONS.includes(section)) {
      throw new JsonRpcError(-32602, `list_site: invalid section "${String(section)}"`);
    }
    const limit = args.limit ?? 50;
    if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
      throw new JsonRpcError(-32602, "list_site: `limit` must be an integer between 1 and 100");
    }

    const { index } = await loadSiteIndex(siteOrigin);
    const pages = Array.isArray(index.pages) ? index.pages : [];
    const concepts = Array.isArray(index.concepts) ? index.concepts : [];
    const publications = Array.isArray(index.publications) ? index.publications : [];
    const projects = Array.isArray(index.projects) ? index.projects : [];

    if (kind === "overview") {
      const countsBySection = {};
      for (const page of pages) {
        const key = page.section || "other";
        countsBySection[key] = (countsBySection[key] || 0) + 1;
      }
      return {
        ok: true,
        index_version: index.version ?? "unknown",
        site: index.site ?? { title: "Xule Lin", url: siteOrigin },
        counts: {
          pages_total: pages.length,
          by_section: countsBySection,
          concepts: concepts.length,
          publications: publications.length,
          projects: projects.length,
        },
        static_markdown_pages: Object.values(STATIC_MARKDOWN_TWINS).map((entry) => ({
          path: entry.canonicalPath,
          markdown_url: `${siteOrigin}${entry.mdPath}`,
          title: entry.title,
        })),
        ...(section
          ? {
              pages: pages
                .filter((p) => p.section === section)
                .slice(0, limit)
                .map((p) => ({
                  path: p.url,
                  title: p.title,
                  section: p.section,
                  date: p.date,
                  markdown_url: `${siteOrigin}${p.url_md}`,
                })),
            }
          : {}),
      };
    }

    if (kind === "pages") {
      const filtered = section ? pages.filter((p) => p.section === section) : pages;
      return {
        ok: true,
        index_version: index.version ?? "unknown",
        kind,
        ...(section ? { section } : {}),
        total: filtered.length,
        items: filtered.slice(0, limit).map((p) => ({
          path: p.url,
          url: `${siteOrigin}${p.url}`,
          markdown_url: `${siteOrigin}${p.url_md}`,
          title: p.title,
          section: p.section,
          ...(p.date ? { date: p.date } : {}),
          ...(p.summary ? { summary: p.summary } : {}),
        })),
      };
    }

    if (kind === "concepts") {
      return {
        ok: true,
        index_version: index.version ?? "unknown",
        kind,
        total: concepts.length,
        items: concepts.slice(0, limit),
      };
    }

    if (kind === "publications") {
      return {
        ok: true,
        index_version: index.version ?? "unknown",
        kind,
        total: publications.length,
        items: publications.slice(0, limit),
      };
    }

    return {
      ok: true,
      index_version: index.version ?? "unknown",
      kind: "projects",
      total: projects.length,
      items: projects.slice(0, limit),
    };
  }

  async function runReadPage(args, siteOrigin) {
    assertAllowedKeys(args, new Set(["path", "expected_sha256"]), "read_page");
    if (typeof args.path !== "string" || args.path.trim().length < 1 || args.path.length > 200) {
      throw new JsonRpcError(-32602, "read_page: `path` must be a non-empty string up to 200 chars");
    }
    if (args.expected_sha256 !== undefined) {
      if (typeof args.expected_sha256 !== "string" || !SHA256_RE.test(args.expected_sha256)) {
        throw new JsonRpcError(-32602, "read_page: `expected_sha256` must be 64 lowercase hex chars");
      }
    }

    const resolved = await resolveAllowlistedTarget(args.path, siteOrigin);
    if (!resolved) {
      return {
        ok: false,
        code: "NOT_FOUND",
        message: "No public Markdown twin exists at that path on linxule.com. Use `search_site` or `list_site` to find valid page paths.",
      };
    }

    const upstream = await fetchOriginBytes(
      siteOrigin,
      resolved.mdPath,
      `${resolved.mimeType}, text/plain;q=0.9`,
    );
    if (upstream.status === 404) {
      return {
        ok: false,
        code: "NOT_FOUND",
        message: `Markdown twin ${resolved.mdPath} was not found upstream.`,
      };
    }
    if (upstream.status === 413) {
      return {
        ok: false,
        code: "PAGE_TOO_LARGE",
        markdown_url: `${siteOrigin}${resolved.mdPath}`,
      };
    }

    const sha256 = await sha256Hex(upstream.bytes);
    const canonicalUrl = `${siteOrigin}${resolved.canonicalPath}`;
    const markdownUrl = `${siteOrigin}${resolved.mdPath}`;

    if (args.expected_sha256 && args.expected_sha256 !== sha256) {
      return {
        ok: false,
        code: "CONTENT_CHANGED",
        canonical_url: canonicalUrl,
        markdown_url: markdownUrl,
        sha256,
      };
    }

    const markdown = new TextDecoder().decode(upstream.bytes);
    return {
      ok: true,
      title: resolved.title,
      section: resolved.section,
      canonical_url: canonicalUrl,
      markdown_url: markdownUrl,
      ...(resolved.date ? { date: resolved.date } : {}),
      ...(resolved.authors?.length ? { authors: resolved.authors } : {}),
      sha256,
      utf8_bytes: upstream.bytes.byteLength,
      attribution: attributionForSection(resolved.section, canonicalUrl),
      markdown,
    };
  }

  async function runReadResource(uri, siteOrigin) {
    if (typeof uri !== "string" || !uri.startsWith("linxule://") || uri.length > 240) {
      throw new JsonRpcError(-32602, "Invalid resource URI");
    }

    if (uri === "linxule://site-index") {
      const { rawText } = await loadSiteIndex(siteOrigin);
      return {
        contents: [
          {
            uri,
            mimeType: "application/json",
            text: rawText,
          },
        ],
      };
    }

    if (uri === "linxule://llms.txt") {
      const page = await runReadPage({ path: "/llms.txt" }, siteOrigin);
      if (!page.ok) throw new JsonRpcError(-32002, page.message || "Resource not found");
      return {
        contents: [
          {
            uri,
            mimeType: "text/plain",
            text: page.markdown,
          },
        ],
      };
    }

    if (uri.startsWith("linxule://pages/")) {
      const slug = uri.slice("linxule://pages/".length);
      if (!slug || !/^[a-zA-Z0-9/_-]+$/.test(slug) || slug.includes("..") || slug.includes("//")) {
        throw new JsonRpcError(-32602, "Invalid page resource URI");
      }
      const lookupPath = slug === "index" ? "/" : `/${slug}`;
      const page = await runReadPage({ path: lookupPath }, siteOrigin);
      if (!page.ok) throw new JsonRpcError(-32002, page.message || "Resource not found");
      return {
        contents: [
          {
            uri,
            mimeType: "text/markdown",
            text: page.markdown,
          },
        ],
        _meta: { sha256: page.sha256, canonical_url: page.canonical_url },
      };
    }

    throw new JsonRpcError(-32602, `Unknown resource URI "${uri}"`);
  }

  async function runGetPrompt(params, siteOrigin) {
    if (!isPlainObject(params) || typeof params.name !== "string") {
      throw new JsonRpcError(-32602, "prompts/get requires a prompt `name`");
    }
    if (params.arguments && (!isPlainObject(params.arguments) || Object.keys(params.arguments).length > 0)) {
      throw new JsonRpcError(-32602, "This prompt takes no arguments");
    }
    const promptMeta = MCP_PROMPTS.find((entry) => entry.name === params.name);
    if (!promptMeta) {
      throw new JsonRpcError(-32602, `Unknown prompt "${params.name}"`);
    }

    const skillPage = await runReadPage(
      { path: "/.well-known/agent-skills/xule-research-navigation/SKILL.md" },
      siteOrigin,
    );
    if (!skillPage.ok) {
      throw new Error("SKILL_UNAVAILABLE");
    }
    return {
      description: promptMeta.description,
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: skillPage.markdown,
          },
        },
      ],
      _meta: { sha256: skillPage.sha256 },
    };
  }

  async function dispatchRpcMessage(msg, siteOrigin) {
    if (!isPlainObject(msg) || msg.jsonrpc !== "2.0") {
      return {
        jsonrpc: "2.0",
        id: isPlainObject(msg) && ("id" in msg) ? msg.id : null,
        error: { code: -32600, message: "Invalid Request" },
      };
    }

    const hasId = Object.prototype.hasOwnProperty.call(msg, "id");
    // JSON-RPC notifications or client responses carry no request execution obligation.
    if (!hasId) {
      if (typeof msg.method !== "string") {
        return {
          jsonrpc: "2.0",
          id: null,
          error: { code: -32600, message: "Invalid Request" },
        };
      }
      return null;
    }

    if (typeof msg.method !== "string") {
      return {
        jsonrpc: "2.0",
        id: msg.id ?? null,
        error: { code: -32600, message: "Invalid Request: missing method" },
      };
    }

    const id = msg.id;
    const params = msg.params ?? {};

    try {
      switch (msg.method) {
        case "initialize": {
          const requestedVersion = isPlainObject(params) ? params.protocolVersion : undefined;
          const negotiated = MCP_SUPPORTED_PROTOCOLS.includes(requestedVersion)
            ? requestedVersion
            : DEFAULT_PROTOCOL;
          return {
            jsonrpc: "2.0",
            id,
            result: {
              protocolVersion: negotiated,
              capabilities: {
                tools: { ...MCP_CAPABILITIES.tools },
                prompts: { ...MCP_CAPABILITIES.prompts },
                resources: { ...MCP_CAPABILITIES.resources },
              },
              serverInfo: {
                name: MCP_SERVER_INFO.name,
                title: MCP_SERVER_INFO.title,
                version: MCP_SERVER_INFO.version,
              },
              instructions: MCP_INSTRUCTIONS,
            },
          };
        }

        case "ping":
          return { jsonrpc: "2.0", id, result: {} };

        case "tools/list":
          return {
            jsonrpc: "2.0",
            id,
            result: {
              tools: MCP_TOOLS.map((tool) => ({
                name: tool.name,
                title: tool.title,
                description: tool.description,
                inputSchema: tool.inputSchema,
                annotations: { ...tool.annotations },
              })),
            },
          };

        case "tools/call": {
          if (!isPlainObject(params) || typeof params.name !== "string") {
            throw new JsonRpcError(-32602, "tools/call requires `name`");
          }
          const toolArgs = params.arguments ?? {};
          let payload;
          if (params.name === "search_site") {
            payload = await runSearchSite(toolArgs, siteOrigin);
          } else if (params.name === "list_site") {
            payload = await runListSite(toolArgs, siteOrigin);
          } else if (params.name === "read_page") {
            payload = await runReadPage(toolArgs, siteOrigin);
          } else {
            throw new JsonRpcError(-32602, `Unknown tool "${params.name}"`);
          }
          return {
            jsonrpc: "2.0",
            id,
            result: {
              content: [{ type: "text", text: JSON.stringify(payload, null, 2) }],
              structuredContent: payload,
              ...(payload.ok ? {} : { isError: true }),
            },
          };
        }

        case "resources/list":
          return {
            jsonrpc: "2.0",
            id,
            result: {
              resources: [...MCP_STATIC_RESOURCES],
            },
          };

        case "resources/templates/list":
          return {
            jsonrpc: "2.0",
            id,
            result: {
              resourceTemplates: [...MCP_RESOURCE_TEMPLATES],
            },
          };

        case "resources/read": {
          if (!isPlainObject(params) || typeof params.uri !== "string") {
            throw new JsonRpcError(-32602, "resources/read requires `uri`");
          }
          const result = await runReadResource(params.uri, siteOrigin);
          return { jsonrpc: "2.0", id, result };
        }

        case "prompts/list":
          return {
            jsonrpc: "2.0",
            id,
            result: {
              prompts: [...MCP_PROMPTS],
            },
          };

        case "prompts/get": {
          const result = await runGetPrompt(params, siteOrigin);
          return { jsonrpc: "2.0", id, result };
        }

        default:
          return {
            jsonrpc: "2.0",
            id,
            error: { code: -32601, message: `Method not found: ${msg.method}` },
          };
      }
    } catch (error) {
      if (error instanceof JsonRpcError) {
        return {
          jsonrpc: "2.0",
          id,
          error: { code: error.code, message: error.message },
        };
      }
      return {
        jsonrpc: "2.0",
        id,
        error: { code: -32603, message: "Internal error while reading upstream content" },
      };
    }
  }

  return {
    async fetch(request, env = {}) {
      const url = new URL(request.url);
      const siteOrigin = String(env.SITE_ORIGIN || "https://linxule.com").replace(/\/$/, "");
      const mcpEnabled = (env.MCP_ENABLED ?? "1") === "1";

      const plainError = (status, text, extraHeaders = {}) =>
        new Response(text, {
          status,
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "no-store",
            ...BASE_CORS_HEADERS,
            ...extraHeaders,
          },
        });

      // 1. SEP-2127 Server Card at `/mcp/server-card`
      if (url.pathname === MCP_SERVER_CARD_PATH && !url.search && !url.hash) {
        if (!allowedHost(request, env)) return plainError(403, "Forbidden");
        if (!mcpEnabled) return plainError(503, "MCP unavailable; use /llms.txt");
        if (request.method === "OPTIONS") {
          return new Response(null, { status: 204, headers: BASE_CORS_HEADERS });
        }
        if (request.method === "GET") {
          return new Response(JSON.stringify(buildMcpServerCard(siteOrigin)), {
            status: 200,
            headers: {
              "Content-Type": "application/mcp-server-card+json; charset=utf-8",
              "Cache-Control": "public, max-age=3600",
              ...BASE_CORS_HEADERS,
            },
          });
        }
        return plainError(405, "Method not allowed", { Allow: "GET, OPTIONS" });
      }

      // 2. Streamable HTTP MCP endpoint at `/mcp` and `/mcp/`
      if (![MCP_ENDPOINT_PATH, `${MCP_ENDPOINT_PATH}/`].includes(url.pathname) || url.search || url.hash) {
        return plainError(404, "Not found");
      }
      if (!allowedHost(request, env)) return plainError(403, "Forbidden");
      if (!mcpEnabled) return plainError(503, "MCP unavailable; use /llms.txt");

      if (request.method === "OPTIONS") {
        return new Response(null, { status: 204, headers: BASE_CORS_HEADERS });
      }
      if (request.method !== "POST") {
        return plainError(405, "Method not allowed", { Allow: "POST, OPTIONS" });
      }

      const contentType = request.headers.get("content-type") || "";
      if (!/^application\/json\b/i.test(contentType)) {
        return plainError(415, "Unsupported Media Type: expected application/json");
      }

      let rawBytes;
      try {
        rawBytes = await boundedBody(request);
      } catch (cause) {
        const reason = cause instanceof Error ? cause.message : "";
        const status =
          reason === "TOO_LARGE" ? 413 : reason === "TIMEOUT" ? 408 : reason === "ABORTED" ? 499 : 400;
        return plainError(status, "Request refused");
      }

      let parsed;
      try {
        parsed = JSON.parse(new TextDecoder().decode(rawBytes));
      } catch {
        return new Response(
          JSON.stringify({
            jsonrpc: "2.0",
            id: null,
            error: { code: -32700, message: "Parse error" },
          }),
          {
            status: 400,
            headers: {
              "Content-Type": "application/json; charset=utf-8",
              "Cache-Control": "no-store",
              ...BASE_CORS_HEADERS,
            },
          },
        );
      }

      const headerVersion = request.headers.get("mcp-protocol-version");
      const activeProtocol = MCP_SUPPORTED_PROTOCOLS.includes(headerVersion)
        ? headerVersion
        : DEFAULT_PROTOCOL;

      if (Array.isArray(parsed)) {
        if (parsed.length === 0 || parsed.length > 20) {
          return new Response(
            JSON.stringify({
              jsonrpc: "2.0",
              id: null,
              error: { code: -32600, message: "Invalid Request: batch size must be 1..20" },
            }),
            {
              status: 400,
              headers: {
                "Content-Type": "application/json; charset=utf-8",
                "Cache-Control": "no-store",
                ...BASE_CORS_HEADERS,
              },
            },
          );
        }
        const results = (
          await Promise.all(parsed.map((item) => dispatchRpcMessage(item, siteOrigin)))
        ).filter((item) => item !== null);

        if (results.length === 0) {
          return new Response(null, {
            status: 202,
            headers: {
              "Cache-Control": "no-store",
              "MCP-Protocol-Version": activeProtocol,
              ...BASE_CORS_HEADERS,
            },
          });
        }
        return new Response(JSON.stringify(results), {
          status: 200,
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Cache-Control": "no-store",
            "MCP-Protocol-Version": activeProtocol,
            ...BASE_CORS_HEADERS,
          },
        });
      }

      const single = await dispatchRpcMessage(parsed, siteOrigin);
      if (single === null) {
        return new Response(null, {
          status: 202,
          headers: {
            "Cache-Control": "no-store",
            "MCP-Protocol-Version": activeProtocol,
            ...BASE_CORS_HEADERS,
          },
        });
      }

      const negotiatedVersion = single?.result?.protocolVersion ?? activeProtocol;
      return new Response(JSON.stringify(single), {
        status: 200,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Cache-Control": "no-store",
          "MCP-Protocol-Version": negotiatedVersion,
          ...BASE_CORS_HEADERS,
        },
      });
    },
  };
}

export default createWorker();
