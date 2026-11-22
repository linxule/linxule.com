/**
 * Stateless, zero-dependency Cloudflare Worker serving `https://linxule.com/mcp`
 * (Streamable HTTP JSON-RPC 2.0) and `https://linxule.com/mcp/server-card` (SEP-2127).
 *
 * Backed solely by `linxule.com`'s curated public machine surfaces
 * (`/site-index.json`, `/llms.txt`, `/.well-known/agent-skills/...`,
 * `/.build-manifest.json`, and `.md` twins) with an explicit path allowlist
 * so arbitrary URLs can never be fetched.
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
const HOT_CACHE_MAX_ENTRIES = 16;
const READ_TIMEOUT_MS = 5_000;
const UPSTREAM_TIMEOUT_MS = 10_000;
const DEFAULT_PROTOCOL = "2025-11-25";
const SHA256_RE = /^[0-9a-f]{64}$/;
const SKILL_PATH = "/.well-known/agent-skills/xule-research-navigation/SKILL.md";
const BUILD_MANIFEST_PATH = "/.build-manifest.json";
const HOT_STATIC_PATHS = new Set(["/llms.txt", SKILL_PATH, BUILD_MANIFEST_PATH]);

const TEXT_DECODER = new TextDecoder();
const TEXT_ENCODER = new TextEncoder();

const COMMON_CORS_HEADERS = Object.freeze({
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "Content-Type, Accept, MCP-Protocol-Version, Mcp-Session-Id, Mcp-Method, Mcp-Name, Last-Event-ID, If-None-Match",
  "Access-Control-Expose-Headers":
    "MCP-Protocol-Version, X-Linxule-Mcp-Version, X-Linxule-Build",
  "Access-Control-Max-Age": "86400",
  "X-Linxule-Mcp-Version": MCP_SERVER_INFO.version,
});

function corsHeadersFor(allowMethods) {
  return {
    ...COMMON_CORS_HEADERS,
    "Access-Control-Allow-Methods": allowMethods,
  };
}

function isValidRpcId(id) {
  return (
    id === null ||
    typeof id === "string" ||
    (typeof id === "number" && Number.isFinite(id))
  );
}

function requireObjectParams(rawParams) {
  if (rawParams !== undefined && !isPlainObject(rawParams)) {
    throw new JsonRpcError(-32602, "Invalid params: params must be an object");
  }
  return rawParams ?? {};
}

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

// ── Lexical + Stem + CJK Tokenization & Scoring ──────────────────────────────

const HAN_RUN_RE = /\p{Script=Han}+/u;
const TOKEN_EXTRACT_RE = /\p{Script=Han}+|[\p{L}\p{N}]+(?:\*)?/gu;
const LATIN_SUFFIX_RE =
  /(?:ations|ation|istic|ists|isms|izing|ized|izer|ment|ness|ities|ity|ies|ing|ist|ism|ers|ed|es|er|al|ly|s)$/;
const ACRONYM_PLURAL_RE = /^[A-Z]{2,}s$/;
const KNOWN_SINGULAR_ACRONYMS = new Set([
  "dao",
  "llm",
  "mcp",
  "api",
  "pdf",
  "svg",
  "cv",
  "ai",
  "phd",
]);
const KNOWN_PLURAL_ACRONYMS = new Set([
  "daos",
  "llms",
  "mcps",
  "apis",
  "pdfs",
  "svgs",
  "cvs",
  "ais",
  "phds",
]);
const ENGLISH_STOP_WORDS = new Set([
  "the",
  "what",
  "and",
  "of",
  "in",
  "to",
  "for",
  "is",
  "on",
  "with",
  "how",
  "from",
  "as",
  "by",
  "at",
  "an",
  "be",
  "or",
  "are",
  "that",
  "this",
  "a",
  "it",
  "into",
  "about",
]);

const BILINGUAL_CONCEPT_ALIASES = Object.freeze([
  Object.freeze({ en: "Polanyi Inversion", zh: Object.freeze(["波兰尼反转"]) }),
  Object.freeze({ en: "Cognitive Signatures", zh: Object.freeze(["认知签名"]) }),
  Object.freeze({ en: "Interpretive Orchestration", zh: Object.freeze(["诠释性编排", "诠释编排"]) }),
  Object.freeze({ en: "Calculator Fallacy", zh: Object.freeze(["计算器谬误"]) }),
  Object.freeze({ en: "Completion Authority", zh: Object.freeze(["完成裁定权"]) }),
  Object.freeze({ en: "Whispered Agency", zh: Object.freeze(["耳语能动性"]) }),
  Object.freeze({ en: "Vulnerability as Method", zh: Object.freeze(["脆弱性作为方法"]) }),
  Object.freeze({ en: "Token Duality", zh: Object.freeze(["代币二元性"]) }),
  Object.freeze({ en: "Selective Centralization", zh: Object.freeze(["选择性中心化"]) }),
  Object.freeze({ en: "Structured Transparency", zh: Object.freeze(["结构化透明度"]) }),
  Object.freeze({ en: "Artificial Organizing", zh: Object.freeze(["人工组织"]) }),
  Object.freeze({ en: "SIGNA Framework", zh: Object.freeze(["SIGNA框架"]) }),
]);

const ALL_ZH_CONCEPT_ALIASES = Object.freeze(
  BILINGUAL_CONCEPT_ALIASES.flatMap((entry) => entry.zh.map((zh) => zh.toLowerCase())),
);

function expandBilingualAliases(primaryText, keywordList, secondaryText) {
  const primaryLower = String(primaryText || "").toLowerCase();
  const baseKeywords = asStringArray(keywordList);
  const keywordsLower = baseKeywords.map((kw) => kw.toLowerCase());
  const secondaryLower = String(secondaryText || "").toLowerCase();

  const extraPrimary = [];
  const extraKeywords = [];
  const extraSecondary = [];

  for (const entry of BILINGUAL_CONCEPT_ALIASES) {
    const enLower = entry.en.toLowerCase();
    const inPrimaryEn = primaryLower.includes(enLower);
    const inKeywordsEn = keywordsLower.some((kw) => kw.includes(enLower));
    const inSecondaryEn = secondaryLower.includes(enLower);

    const inPrimaryZh = entry.zh.some((zh) => primaryLower.includes(zh.toLowerCase()));
    const inKeywordsZh = entry.zh.some((zh) =>
      keywordsLower.some((kw) => kw.includes(zh.toLowerCase())),
    );
    const inSecondaryZh = entry.zh.some((zh) => secondaryLower.includes(zh.toLowerCase()));

    if (inPrimaryEn) {
      if (primaryLower === enLower || primaryLower === `the ${enLower}`) {
        extraPrimary.push(...entry.zh);
      }
      extraKeywords.push(...entry.zh);
    } else if (inKeywordsEn) {
      extraKeywords.push(...entry.zh);
    } else if (inSecondaryEn) {
      extraSecondary.push(...entry.zh);
    }

    if (inPrimaryZh || inKeywordsZh) {
      extraKeywords.push(entry.en);
    } else if (inSecondaryZh) {
      extraSecondary.push(entry.en);
    }
  }

  return {
    extraPrimary,
    keywords: extraKeywords.length ? [...baseKeywords, ...extraKeywords] : baseKeywords,
    secondary: extraSecondary.length
      ? [secondaryText, ...extraSecondary].filter(Boolean).join(" ")
      : secondaryText,
  };
}

function stemLatinToken(token) {
  if (token.length < 5) return token;
  const stripped = token.replace(LATIN_SUFFIX_RE, "");
  return stripped.length >= 4 ? stripped : token;
}

function extractHanBigrams(run) {
  if (run.length <= 1) return [run];
  const out = [];
  for (let i = 0; i < run.length - 1; i++) {
    out.push(run.slice(i, i + 2));
  }
  return out;
}

function tokenizeFieldText(text) {
  const lower = String(text || "").toLowerCase();
  const latinTokens = [];
  const latinTokenSet = new Set();
  const latinStemSet = new Set();

  for (const match of lower.matchAll(/\p{Script=Han}+|[\p{L}\p{N}]+/gu)) {
    const raw = match[0];
    if (HAN_RUN_RE.test(raw)) continue;
    latinTokens.push(raw);
    latinTokenSet.add(raw);
    const stem = stemLatinToken(raw);
    if (stem !== raw) latinStemSet.add(stem);
  }
  return { lower, latinTokens, latinTokenSet, latinStemSet };
}

function containsTokenPhrase(fieldTokens, queryPhraseTokens) {
  if (!queryPhraseTokens.length || fieldTokens.length < queryPhraseTokens.length) return false;
  outer: for (let i = 0; i <= fieldTokens.length - queryPhraseTokens.length; i++) {
    for (let j = 0; j < queryPhraseTokens.length; j++) {
      const q = queryPhraseTokens[j];
      const f = fieldTokens[i + j];
      const qTok = typeof q === "string" ? q : q.lower;
      const isAcronym = typeof q === "object" && q.isAcronym;
      if (f !== qTok && !(isAcronym && f === `${qTok}s`)) continue outer;
    }
    return true;
  }
  return false;
}

function matchesLatinTerm(termInfo, fieldData) {
  const { lower, stem, isWildcard, prefix, isAcronym } = termInfo;
  if (isWildcard) {
    for (const tok of fieldData.latinTokens) {
      if (tok.startsWith(prefix)) return true;
    }
    return false;
  }
  if (fieldData.latinTokenSet.has(lower)) return true;
  if (isAcronym) {
    // Acronyms like SIGNA, DAO/DAOs, LLM/LLMs, CV/CVs match exact singular or plural only — never arbitrary substrings.
    return fieldData.latinTokenSet.has(`${lower}s`);
  }
  if (stem.length >= 4) {
    if (fieldData.latinStemSet.has(stem) || fieldData.latinTokenSet.has(stem)) {
      return true;
    }
  }
  return false;
}

function matchesCjkTerm(termInfo, fieldLower) {
  const runLower = termInfo.run.toLowerCase();
  if (fieldLower.includes(runLower)) return 2;
  for (const alias of ALL_ZH_CONCEPT_ALIASES) {
    if (runLower.includes(alias) && fieldLower.includes(alias)) return 1.8;
  }
  if (termInfo.bigrams.length > 1) {
    let bigramHits = 0;
    for (const bg of termInfo.bigrams) {
      if (fieldLower.includes(bg.toLowerCase())) bigramHits++;
    }
    if (bigramHits === termInfo.bigrams.length) return 1.5;
    if (bigramHits > 0) return 0.75 * (bigramHits / termInfo.bigrams.length);
  }
  return 0;
}

export function tokenizeQuery(rawQuery) {
  const trimmed = String(rawQuery || "").trim();
  const normalized = trimmed.toLowerCase();
  const rawTerms = [];
  const rawLatinPhraseTokens = [];
  const cjkRuns = [];

  for (const match of trimmed.matchAll(TOKEN_EXTRACT_RE)) {
    const raw = match[0];
    if (HAN_RUN_RE.test(raw)) {
      cjkRuns.push(raw);
      rawTerms.push({
        type: "cjk",
        run: raw,
        bigrams: extractHanBigrams(raw),
      });
      continue;
    }

    const isWildcard = raw.endsWith("*");
    const coreRaw = isWildcard ? raw.slice(0, -1) : raw;
    let lower = coreRaw.toLowerCase();
    if (!lower) continue;
    if (!isWildcard && lower.length < 2) continue;
    if (isWildcard && lower.length < 3) continue;

    let isAcronym = false;
    if (!isWildcard && ACRONYM_PLURAL_RE.test(coreRaw)) {
      lower = coreRaw.slice(0, -1).toLowerCase();
      isAcronym = true;
    } else if (!isWildcard && KNOWN_PLURAL_ACRONYMS.has(lower)) {
      lower = lower.slice(0, -1);
      isAcronym = true;
    } else if (
      !isWildcard &&
      ((coreRaw.length >= 2 && coreRaw === coreRaw.toUpperCase() && /[A-Z]/.test(coreRaw)) ||
        KNOWN_SINGULAR_ACRONYMS.has(lower))
    ) {
      isAcronym = true;
    }

    const stem = isAcronym || isWildcard ? lower : stemLatinToken(lower);
    const termObj = {
      type: "latin",
      lower,
      stem,
      isWildcard,
      prefix: lower,
      isAcronym,
    };

    if (!isWildcard) rawLatinPhraseTokens.push(termObj);
    rawTerms.push(termObj);
  }

  // Drop English stop words unless every extracted term is a stop word.
  const nonStopTerms = rawTerms.filter(
    (term) => term.type !== "latin" || term.isWildcard || !ENGLISH_STOP_WORDS.has(term.lower),
  );
  const terms = nonStopTerms.length > 0 ? nonStopTerms : rawTerms;

  // Fallback for single-char queries so queries like "X" or "a" don't crash or silently empty out.
  if (terms.length === 0 && normalized) {
    terms.push({
      type: HAN_RUN_RE.test(normalized) ? "cjk" : "latin",
      run: normalized,
      bigrams: extractHanBigrams(normalized),
      lower: normalized,
      stem: normalized,
      isWildcard: false,
      prefix: normalized,
      isAcronym: trimmed === trimmed.toUpperCase() && /[A-Z]/.test(trimmed),
    });
  }

  const latinPhraseTokens = terms.filter((term) => term.type === "latin" && !term.isWildcard);
  const contentNormalized =
    cjkRuns.length === 0 && latinPhraseTokens.length > 0
      ? latinPhraseTokens.map((t) => t.lower).join(" ")
      : normalized;

  return {
    normalized,
    contentNormalized,
    terms,
    latinPhraseTokens,
    rawLatinPhraseTokens,
    cjkRuns,
  };
}

function asStringArray(value) {
  if (Array.isArray(value)) return value.filter(Boolean).map((entry) => String(entry));
  if (typeof value === "string" && value.trim()) return [value.trim()];
  return [];
}

function scoreFieldPhrase(queryInfo, fieldData) {
  const cjkOk = queryInfo.cjkRuns.every((run) => fieldData.lower.includes(run.toLowerCase()));
  if (queryInfo.cjkRuns.length > 0 && queryInfo.latinPhraseTokens.length === 0) {
    return cjkOk;
  }
  if (queryInfo.latinPhraseTokens.length > 0) {
    const latinOk =
      containsTokenPhrase(fieldData.latinTokens, queryInfo.latinPhraseTokens) ||
      (queryInfo.rawLatinPhraseTokens?.length > queryInfo.latinPhraseTokens.length &&
        containsTokenPhrase(fieldData.latinTokens, queryInfo.rawLatinPhraseTokens));
    return latinOk && cjkOk;
  }
  return false;
}

function scoreFields(queryInfo, primaryText, keywordList, secondaryText, primaryAliases = []) {
  const { normalized, contentNormalized, terms } = queryInfo;
  const primary = tokenizeFieldText(primaryText);
  const primaryAliasList = asStringArray(primaryAliases).map((alias) => tokenizeFieldText(alias));
  const keywords = asStringArray(keywordList).map((kw) => tokenizeFieldText(kw));
  const secondary = tokenizeFieldText(secondaryText);

  let score = 0;
  let matchedTerms = 0;

  const isExactPrimary = (field) =>
    field.lower === normalized || (Boolean(contentNormalized) && field.lower === contentNormalized);

  if (isExactPrimary(primary) || primaryAliasList.some(isExactPrimary)) score += 120;
  else if (
    scoreFieldPhrase(queryInfo, primary) ||
    primaryAliasList.some((alias) => scoreFieldPhrase(queryInfo, alias))
  ) {
    score += 70;
  }

  if (keywords.some(isExactPrimary)) score += 80;
  else if (keywords.some((kw) => scoreFieldPhrase(queryInfo, kw))) score += 45;

  if (scoreFieldPhrase(queryInfo, secondary)) score += 30;

  for (const term of terms) {
    let hit = false;
    if (term.type === "cjk") {
      const pWeight = Math.max(
        matchesCjkTerm(term, primary.lower),
        ...primaryAliasList.map((alias) => matchesCjkTerm(term, alias.lower)),
      );
      if (pWeight > 0) {
        score += Math.round(24 * pWeight);
        hit = true;
      }
      const kWeight = keywords.reduce((best, kw) => Math.max(best, matchesCjkTerm(term, kw.lower)), 0);
      if (kWeight > 0) {
        score += Math.round(16 * kWeight);
        hit = true;
      }
      const sWeight = matchesCjkTerm(term, secondary.lower);
      if (sWeight > 0) {
        score += Math.round(8 * sWeight);
        hit = true;
      }
    } else {
      if (
        matchesLatinTerm(term, primary) ||
        primaryAliasList.some((alias) => matchesLatinTerm(term, alias))
      ) {
        score += 24;
        hit = true;
      }
      if (keywords.some((kw) => matchesLatinTerm(term, kw))) {
        score += 16;
        hit = true;
      }
      if (matchesLatinTerm(term, secondary)) {
        score += 8;
        hit = true;
      }
    }
    if (hit) matchedTerms += 1;
  }

  if (matchedTerms === 0) return 0;
  if (matchedTerms === terms.length && terms.length > 1) score += 25;
  return score;
}

function matchesCollaboratorFilter(filterQuery, candidates) {
  if (!filterQuery) return true;
  const haystacks = candidates
    .flatMap((entry) => asStringArray(entry))
    .filter(Boolean);
  if (haystacks.length === 0) return false;
  const queryInfo = tokenizeQuery(filterQuery);
  return scoreFields(queryInfo, haystacks.join(" "), haystacks, "") > 0;
}

function collaboratorStrings(entry) {
  if (!isPlainObject(entry)) return [];
  const names = [
    entry.name,
    entry.family,
    entry.slug,
    entry.role,
    ...asStringArray(entry.roles),
  ];
  if (Array.isArray(entry.models)) {
    for (const m of entry.models) {
      if (typeof m === "string") names.push(m);
      else if (isPlainObject(m)) names.push(m.name, m.slug, m.model);
    }
  }
  if (Array.isArray(entry.works)) {
    for (const w of entry.works) {
      if (typeof w === "string") names.push(w);
      else if (isPlainObject(w)) names.push(w.title, w.section, w.role);
    }
  }
  return names.filter(Boolean).map(String);
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
 * origin-relative pathname, stripping `#fragment` and `?query`. Returns `null`
 * if the input points at another origin or contains traversal/control characters.
 */
export function normalizeCandidatePath(rawInput, siteOrigin) {
  if (typeof rawInput !== "string") return null;
  const trimmed = rawInput.trim();
  if (!trimmed || trimmed.length > 200) return null;
  if (/[\0\\\s]/.test(trimmed)) return null;

  let pathname = trimmed;
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(trimmed)) {
    let parsed;
    try {
      parsed = new URL(trimmed);
    } catch {
      return null;
    }
    if (parsed.origin !== siteOrigin) return null;
    pathname = parsed.pathname;
  } else {
    pathname = trimmed.split(/[?#]/, 1)[0];
  }

  if (!pathname) return null;
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

function normalizeInternalPath(rawPath, siteOrigin) {
  if (!rawPath || typeof rawPath !== "string") return undefined;
  let cleaned = rawPath.trim();
  if (cleaned.startsWith(siteOrigin)) {
    cleaned = cleaned.slice(siteOrigin.length) || "/";
  }
  cleaned = cleaned.split(/[?#]/, 1)[0];
  if (!cleaned.startsWith("/")) return undefined;
  return cleaned.length > 1 && cleaned.endsWith("/") ? cleaned.slice(0, -1) : cleaned;
}

const DEFAULT_HUMAN_COAUTHORS = Object.freeze([
  "Kevin Corley",
  "Carliss Y. Baldwin",
  "Erkko Autio",
  "Ying-Ying Hsieh",
]);

function pluralize(count, singular, plural = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural}`;
}

function matchesPageSection(page, requestedSection) {
  if (!requestedSection) return true;
  if (requestedSection === "making") {
    return (
      page.section === "making" ||
      page.section === "portraits" ||
      page.section === "artifacts"
    );
  }
  if (requestedSection === "connect") {
    return page.section === "connect" || page.url === "/connect";
  }
  if (requestedSection === "builds") {
    return page.section === "builds" || page.url === "/connect";
  }
  return page.section === requestedSection;
}

function buildEnterTheWorkPrompt(index, siteOrigin) {
  const concepts = Array.isArray(index.concepts) ? index.concepts : [];
  const anchored = concepts.filter((c) => c.status === "anchored" || !c.status);
  const grounded = concepts.filter((c) => c.status === "grounded" || c.status === "established");
  const forming = concepts.filter((c) => c.status === "forming");
  const publications = Array.isArray(index.publications) ? index.publications : [];
  const projects = Array.isArray(index.projects) ? index.projects : [];
  const collaborators = Array.isArray(index.collaborators) ? index.collaborators : [];

  const formatConcept = (c) => {
    const line = c.oneliner || c.definition || "";
    const locs = [];
    if (c.paperUrl) locs.push(`\`${c.paperUrl}\``);
    if (c.essayUrl && c.essayUrl !== c.paperUrl) locs.push(`\`${c.essayUrl}\``);
    if (locs.length === 0) {
      const fallback = c.url ? String(c.url).split("#")[0] : "/concepts";
      if (fallback) locs.push(`\`${fallback}\``);
    }
    return `- **${c.term}** (${c.territory || "working vocabulary"}) — ${line}${locs.length ? ` [${locs.join(", ")}]` : ""}`;
  };

  const aiCollabList = collaborators
    .filter((c) => c.kind === "ai")
    .map((c) => c.name || c.family || c.slug)
    .filter(Boolean)
    .slice(0, 12)
    .join(", ");

  const humanNames = collaborators
    .filter((c) => c.kind === "human")
    .map((c) => c.name || c.slug)
    .filter(Boolean);
  const humanCollabList = (humanNames.length ? humanNames : DEFAULT_HUMAN_COAUTHORS).join(", ");

  const lines = [
    "# Entering Xule Lin's Work (linxule.com)",
    "",
    "You are entering a research archive and living collaboration — not a finished textbook. Hold multiple readings open and leave the seams visible rather than smoothing them into a three-point summary.",
    "",
    "## The Core Question",
    "",
    "> What becomes impossible to see when algorithms enter organizational life — not as tools?",
    "",
    "AI systems carry implicit theories about collective organizing. Those theories are invisible from inside, and the pressure to converge — in models, institutions, and everyday workflows — prunes possibilities without leaving a trace.",
    "",
    "## Active Tensions (Keep Open)",
    "",
    "1. **Polanyi Inversion vs. Interpretive Orchestration** — We can now articulate more than we understand; the craft is keeping human interpretive judgment at the center without refusing computational scale.",
    "2. **Automation Frontier vs. Completion Authority** — Checkable, deductive work automates first because it has an external whistle; open-ended interpretive inquiry has no whistle, so deciding when the work has seen enough stays human.",
    "3. **Recursive Governance (Token Duality)** — In algorithmic and decentralized organizations, economic instruments and governance mechanisms continually rewrite each other.",
    "4. **From Coordinating Actors to Composing Them** — Organizations increasingly compose, bound, and rewrite what can act (agents, workflows, hybrids) while the work continues underneath.",
    "",
    `## Anchored Concepts (${anchored.length})`,
    "",
    ...(anchored.length
      ? anchored.map(formatConcept)
      : ["- See `/concepts` for the anchored concept definitions and source essays."]),
    "",
    `## Scholarship-Grounded Concepts (${grounded.length})`,
    "",
    "Developed in dissertation and working-paper scholarship (DAO governance & SIGNA; see `/cv#working-papers`):",
    "",
    ...(grounded.length
      ? grounded.map(formatConcept)
      : ["- See `/concepts` and `/cv#working-papers` for dissertation and working-paper concepts (DAO governance and SIGNA)."]),
    "",
    `## Forming Vocabulary (${forming.length} — Still in Motion)`,
    "",
    "These terms are named early on purpose; treat them as open handles with live questions rather than settled doctrine:",
    "",
    ...(forming.length
      ? forming.map(formatConcept)
      : ["- See `/concepts` for concepts currently forming across artificial organizing."]),
    "",
    "## Human–AI Collaborator Practice",
    "",
    `Human co-authors (${humanCollabList}) and named AI collaborators` +
      (aiCollabList ? ` (${aiCollabList})` : "") +
      " are credited directly across essays, papers, portraits, artifacts, and open-source builds like Vellum (`/builds/vellum`). Remember that successive model instances do not share continuous memory: what persists is the artifact, not an unbroken authorial self. Use `list_site(kind=\"collaborators\")` or `search_site(collaborator=\"...\")` to trace who shaped what.",
    "",
    "## Cross-Surface Reading Trails",
    "",
    "- **Epistemology & qualitative methods**: `/thinking` → `/writing/loom-xvii-the-polanyi-inversion` → `/writing/loom-xviii-the-end-of-positivism` → `/papers/interpretive-orchestration` → `/writing/research-memex`",
    "- **Governance, DAOs & modularity**: `/concepts` → `/builds` (`daogov`, `SIGNA`, `TSM Demo`) → `/writing/seam-01-the-seventy-percent` → `/papers/cognitio-emergens`",
    "- **Making, multi-model voices & infrastructure**: `/making` → `/builds/vellum` → `/connect`",
    `- **Full academic record & bilingual index**: \`/cv\` (English) and \`/cv-zh\` (中文) · ${pluralize(publications.length, "formal paper landing")} · ${pluralize(projects.length, "catalogued build")}.`,
    "",
    `Source origin: ${siteOrigin}. Read exact authored Markdown twins with \`read_page\` before quoting.`,
  ];

  return lines.join("\n");
}

async function readBoundedResponse(response, limitBytes) {
  const contentLength = response.headers.get("content-length");
  if (contentLength !== null) {
    const declared = Number(contentLength);
    if (Number.isFinite(declared) && declared > limitBytes) {
      void response.body?.cancel?.().catch(() => {});
      return { status: 413, bytes: new Uint8Array() };
    }
  }

  const reader = response.body?.getReader?.();
  if (!reader) {
    const buffer = await response.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    if (bytes.byteLength > limitBytes) {
      return { status: 413, bytes: new Uint8Array() };
    }
    return { status: 200, bytes };
  }

  const chunks = [];
  let total = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > limitBytes) {
        void reader.cancel().catch(() => {});
        return { status: 413, bytes: new Uint8Array() };
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  const merged = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    merged.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return { status: 200, bytes: merged };
}

export function createWorker({
  fetchImpl = globalThis.fetch,
  cacheTtlMs = 5 * 60 * 1000,
} = {}) {
  const indexCache = new Map(); // siteOrigin -> { expiresAt, data }
  const indexInFlight = new Map(); // siteOrigin -> Promise
  const hotFileCache = new Map(); // `${siteOrigin}${path}` -> { expiresAt, value }
  const hotFileInFlight = new Map(); // `${siteOrigin}${path}` -> Promise

  function setHotCache(key, value, expiresAt) {
    if (hotFileCache.has(key)) hotFileCache.delete(key);
    hotFileCache.set(key, { expiresAt, value });
    while (hotFileCache.size > HOT_CACHE_MAX_ENTRIES) {
      const oldestKey = hotFileCache.keys().next().value;
      hotFileCache.delete(oldestKey);
    }
  }

  async function fetchOriginBytes(siteOrigin, relativePath, acceptHeader) {
    const targetUrl = `${siteOrigin}${relativePath}`;
    const response = await fetchImpl(targetUrl, {
      method: "GET",
      redirect: "manual",
      headers: {
        Accept: acceptHeader,
        "User-Agent": `linxule-mcp/${MCP_SERVER_INFO.version}`,
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

    return readBoundedResponse(response, PAGE_LIMIT_BYTES);
  }

  async function fetchCachedOriginText(siteOrigin, relativePath, acceptHeader) {
    const key = `${siteOrigin}${relativePath}`;
    const now = Date.now();
    const cached = hotFileCache.get(key);
    if (cached && cached.expiresAt > now) {
      return cached.value;
    }

    if (hotFileInFlight.has(key)) {
      return hotFileInFlight.get(key);
    }

    const promise = (async () => {
      const upstream = await fetchOriginBytes(siteOrigin, relativePath, acceptHeader);
      if (upstream.status !== 200) {
        return { status: upstream.status };
      }
      const sha256 = await sha256Hex(upstream.bytes);
      const text = TEXT_DECODER.decode(upstream.bytes);
      const value = {
        status: 200,
        bytes: upstream.bytes,
        utf8Bytes: upstream.bytes.byteLength,
        sha256,
        text,
      };
      setHotCache(key, value, Date.now() + cacheTtlMs);
      return value;
    })();

    hotFileInFlight.set(key, promise);
    try {
      return await promise;
    } finally {
      hotFileInFlight.delete(key);
    }
  }

  async function loadManifestBuildHead(siteOrigin) {
    const key = `${siteOrigin}${BUILD_MANIFEST_PATH}`;
    const now = Date.now();
    const cached = hotFileCache.get(key);
    if (cached && cached.expiresAt > now) {
      return cached.value;
    }
    if (hotFileInFlight.has(key)) {
      return hotFileInFlight.get(key);
    }

    const promise = (async () => {
      try {
        const res = await fetchOriginBytes(siteOrigin, BUILD_MANIFEST_PATH, "application/json");
        if (res.status !== 200) {
          setHotCache(key, null, Date.now() + cacheTtlMs);
          return null;
        }
        const parsed = JSON.parse(TEXT_DECODER.decode(res.bytes));
        const head = typeof parsed?.head === "string" && parsed.head.trim() ? parsed.head.trim() : null;
        setHotCache(key, head, Date.now() + cacheTtlMs);
        return head;
      } catch {
        setHotCache(key, null, Date.now() + Math.min(cacheTtlMs, 30_000));
        return null;
      }
    })();

    hotFileInFlight.set(key, promise);
    try {
      return await promise;
    } finally {
      hotFileInFlight.delete(key);
    }
  }

  async function loadSiteIndex(siteOrigin) {
    const now = Date.now();
    const cached = indexCache.get(siteOrigin);
    if (cached && cached.expiresAt > now) {
      return cached.data;
    }

    if (indexInFlight.has(siteOrigin)) {
      return indexInFlight.get(siteOrigin);
    }

    const promise = (async () => {
      const result = await fetchOriginBytes(siteOrigin, "/site-index.json", "application/json");
      if (result.status !== 200) {
        throw new Error("SITE_INDEX_UNAVAILABLE");
      }
      const rawText = TEXT_DECODER.decode(result.bytes);
      const parsed = JSON.parse(rawText);
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

      const sha256 = await sha256Hex(result.bytes);
      let buildHead =
        typeof parsed.build_head === "string" && parsed.build_head.trim()
          ? parsed.build_head.trim()
          : null;
      if (!buildHead) {
        buildHead = await loadManifestBuildHead(siteOrigin);
      }
      if (!buildHead) {
        buildHead =
          typeof parsed.version === "string" && parsed.version.trim()
            ? parsed.version.trim()
            : "unknown";
      }

      const record = {
        rawBytes: result.bytes,
        rawText,
        sha256,
        buildHead,
        index: parsed,
        byCanonical,
        byMd,
      };
      indexCache.set(siteOrigin, { expiresAt: Date.now() + cacheTtlMs, data: record });
      return record;
    })();

    indexInFlight.set(siteOrigin, promise);
    try {
      return await promise;
    } finally {
      indexInFlight.delete(siteOrigin);
    }
  }

  async function resolveBuildHead(siteOrigin, env = {}) {
    if (typeof env.BUILD_HEAD === "string" && env.BUILD_HEAD.trim()) {
      return env.BUILD_HEAD.trim();
    }
    const cached = indexCache.get(siteOrigin);
    if (cached && cached.expiresAt > Date.now() && cached.data.buildHead) {
      return cached.data.buildHead;
    }
    return loadManifestBuildHead(siteOrigin);
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
    assertAllowedKeys(
      args,
      new Set(["query", "kind", "section", "collaborator", "limit"]),
      "search_site",
    );
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
    const collaborator = args.collaborator;
    if (
      collaborator !== undefined &&
      (typeof collaborator !== "string" || collaborator.trim().length < 1 || collaborator.length > 100)
    ) {
      throw new JsonRpcError(-32602, "search_site: `collaborator` must be a non-empty string up to 100 chars");
    }
    const limit = args.limit ?? 10;
    if (!Number.isInteger(limit) || limit < 1 || limit > 25) {
      throw new JsonRpcError(-32602, "search_site: `limit` must be an integer between 1 and 25");
    }

    const { index, buildHead } = await loadSiteIndex(siteOrigin);
    const queryInfo = tokenizeQuery(args.query);
    const scored = [];

    if (kind === "all" || kind === "pages") {
      for (const page of index.pages || []) {
        if (section && !matchesPageSection(page, section)) continue;
        if (
          collaborator &&
          !matchesCollaboratorFilter(collaborator, [
            page.authors,
            page.prompter,
            page.generator,
            page.creator,
            page.speakers,
          ])
        ) {
          continue;
        }
        const pathTokens = String(page.url || "").replace(/[/.-]+/g, " ").trim();
        const secondary = [
          page.summary,
          page.section,
          page.series,
          page.venue,
          page.event,
          page.medium,
          page.prompter,
          page.generator,
          page.creator,
          pathTokens,
          ...asStringArray(page.authors),
          ...asStringArray(page.speakers),
        ]
          .filter(Boolean)
          .join(" ");
        const expanded = expandBilingualAliases(page.title, page.keywords, secondary);
        const score = scoreFields(
          queryInfo,
          page.title,
          expanded.keywords,
          expanded.secondary,
          expanded.extraPrimary,
        );
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

    if (kind === "concepts" || (kind === "all" && !section)) {
      for (const concept of index.concepts || []) {
        if (collaborator && !matchesCollaboratorFilter(collaborator, [concept.authors])) {
          continue;
        }
        const secondary = [
          concept.oneliner,
          concept.definition,
          concept.territory,
          concept.status,
          concept.canonicalEssay,
          ...asStringArray(concept.open_questions),
          ...asStringArray(concept.authors),
        ]
          .filter(Boolean)
          .join(" ");
        const expanded = expandBilingualAliases(
          concept.term,
          [concept.territory, concept.canonicalEssay],
          secondary,
        );
        const score = scoreFields(
          queryInfo,
          concept.term,
          expanded.keywords,
          expanded.secondary,
          expanded.extraPrimary,
        );
        if (score > 0) {
          const readPath =
            normalizeInternalPath(concept.paperUrl, siteOrigin) ||
            normalizeInternalPath(concept.essayUrl, siteOrigin) ||
            normalizeInternalPath(concept.url, siteOrigin) ||
            "/concepts";
          const conceptUrl = String(concept.url || "/concepts");
          scored.push({
            score,
            item: {
              kind: "concept",
              term: concept.term,
              ...(concept.status ? { status: concept.status } : {}),
              ...(concept.territory ? { territory: concept.territory } : {}),
              ...(concept.oneliner ? { oneliner: concept.oneliner } : {}),
              definition: concept.definition || concept.oneliner || "",
              ...(concept.canonicalEssay ? { canonical_essay: concept.canonicalEssay } : {}),
              ...(Array.isArray(concept.open_questions) && concept.open_questions.length
                ? { open_questions: concept.open_questions }
                : {}),
              read_path: readPath,
              url: conceptUrl.startsWith("http") ? conceptUrl : `${siteOrigin}${conceptUrl}`,
              ...(concept.date ? { date: concept.date } : {}),
              ...(concept.year ? { year: concept.year } : {}),
            },
          });
        }
      }
    }

    if (kind === "publications" || (kind === "all" && !section)) {
      for (const pub of index.publications || []) {
        if (collaborator && !matchesCollaboratorFilter(collaborator, [pub.authors])) {
          continue;
        }
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
        const expanded = expandBilingualAliases(pub.title, pub.coins, secondary);
        const score = scoreFields(
          queryInfo,
          pub.title,
          expanded.keywords,
          expanded.secondary,
          expanded.extraPrimary,
        );
        if (score > 0) {
          const readPath =
            normalizeInternalPath(pub.read_path, siteOrigin) ||
            normalizeInternalPath(pub.onSite, siteOrigin);
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
              ...(pub.license ? { license: pub.license } : {}),
              ...(readPath ? { read_path: readPath } : {}),
            },
          });
        }
      }
    }

    if (kind === "projects" || (kind === "all" && !section && !collaborator)) {
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
              url: proj.url ?? null,
              ...(proj.license ? { license: proj.license } : {}),
              read_path: "/builds",
            },
          });
        }
      }
    }

    if (kind === "collaborators" || (kind === "all" && !section)) {
      for (const collab of index.collaborators || []) {
        const strings = collaboratorStrings(collab);
        if (collaborator && !matchesCollaboratorFilter(collaborator, [strings])) {
          continue;
        }
        const primary = collab.name || collab.family || collab.slug || "";
        const score = scoreFields(queryInfo, primary, strings, strings.join(" "));
        if (score > 0) {
          const { kind: rawCollabKind, ...restCollab } = collab;
          scored.push({
            score,
            item: {
              kind: "collaborator",
              ...(rawCollabKind ? { collaboratorKind: rawCollabKind } : {}),
              ...restCollab,
            },
          });
        }
      }
    }

    scored.sort((a, b) => b.score - a.score);
    const appliedSection = section && (kind === "all" || kind === "pages") ? section : undefined;
    return {
      payload: {
        ok: true,
        index_version: index.version ?? "unknown",
        build_head: buildHead,
        query: args.query.trim(),
        kind,
        ...(appliedSection ? { section: appliedSection } : {}),
        ...(collaborator ? { collaborator: collaborator.trim() } : {}),
        matches: scored.slice(0, limit).map((entry) => entry.item),
      },
      buildHead,
    };
  }

  async function runListSite(args, siteOrigin) {
    assertAllowedKeys(
      args,
      new Set(["kind", "section", "collaborator", "limit", "offset"]),
      "list_site",
    );
    const kind = args.kind ?? "overview";
    if (!LIST_KINDS.includes(kind)) {
      throw new JsonRpcError(-32602, `list_site: invalid kind "${String(kind)}"`);
    }
    const section = args.section;
    if (section !== undefined && !PAGE_SECTIONS.includes(section)) {
      throw new JsonRpcError(-32602, `list_site: invalid section "${String(section)}"`);
    }
    const collaborator = args.collaborator;
    if (
      collaborator !== undefined &&
      (typeof collaborator !== "string" || collaborator.trim().length < 1 || collaborator.length > 100)
    ) {
      throw new JsonRpcError(-32602, "list_site: `collaborator` must be a non-empty string up to 100 chars");
    }
    const limit = args.limit ?? 50;
    if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
      throw new JsonRpcError(-32602, "list_site: `limit` must be an integer between 1 and 100");
    }
    const offset = args.offset ?? 0;
    if (!Number.isInteger(offset) || offset < 0) {
      throw new JsonRpcError(-32602, "list_site: `offset` must be an integer >= 0");
    }

    const { index, buildHead } = await loadSiteIndex(siteOrigin);
    const pages = Array.isArray(index.pages) ? index.pages : [];
    const concepts = Array.isArray(index.concepts) ? index.concepts : [];
    const publications = Array.isArray(index.publications) ? index.publications : [];
    const projects = Array.isArray(index.projects) ? index.projects : [];
    const collaborators = Array.isArray(index.collaborators) ? index.collaborators : [];

    if (kind === "overview") {
      const countsBySection = {};
      for (const page of pages) {
        const key = page.section || "other";
        countsBySection[key] = (countsBySection[key] || 0) + 1;
      }
      const matchedSectionPages = section
        ? pages.filter((p) => matchesPageSection(p, section))
        : [];
      const pagedSectionPages = section
        ? matchedSectionPages.slice(offset, offset + limit).map((p) => ({
            path: p.url,
            title: p.title,
            section: p.section,
            ...(p.date ? { date: p.date } : {}),
            markdown_url: `${siteOrigin}${p.url_md}`,
          }))
        : [];
      return {
        payload: {
          ok: true,
          index_version: index.version ?? "unknown",
          build_head: buildHead,
          site: index.site ?? { title: "Xule Lin", url: siteOrigin },
          counts: {
            pages_total: pages.length,
            by_section: countsBySection,
            concepts: concepts.length,
            publications: publications.length,
            projects: projects.length,
            collaborators: collaborators.length,
          },
          static_markdown_pages: Object.values(STATIC_MARKDOWN_TWINS).map((entry) => ({
            path: entry.canonicalPath,
            markdown_url: `${siteOrigin}${entry.mdPath}`,
            title: entry.title,
          })),
          ...(section
            ? {
                section,
                total: matchedSectionPages.length,
                offset,
                count: pagedSectionPages.length,
                pages: pagedSectionPages,
              }
            : {}),
        },
        buildHead,
      };
    }

    if (kind === "pages") {
      let filtered = section ? pages.filter((p) => matchesPageSection(p, section)) : pages;
      if (collaborator) {
        filtered = filtered.filter((p) =>
          matchesCollaboratorFilter(collaborator, [
            p.authors,
            p.prompter,
            p.generator,
            p.creator,
            p.speakers,
          ]),
        );
      }
      const items = filtered.slice(offset, offset + limit).map((p) => ({
        path: p.url,
        url: `${siteOrigin}${p.url}`,
        markdown_url: `${siteOrigin}${p.url_md}`,
        title: p.title,
        section: p.section,
        ...(p.date ? { date: p.date } : {}),
        ...(p.summary ? { summary: p.summary } : {}),
      }));
      return {
        payload: {
          ok: true,
          index_version: index.version ?? "unknown",
          build_head: buildHead,
          kind,
          ...(section ? { section } : {}),
          ...(collaborator ? { collaborator: collaborator.trim() } : {}),
          total: filtered.length,
          offset,
          count: items.length,
          items,
        },
        buildHead,
      };
    }

    if (kind === "concepts") {
      const items = concepts.slice(offset, offset + limit);
      return {
        payload: {
          ok: true,
          index_version: index.version ?? "unknown",
          build_head: buildHead,
          kind,
          total: concepts.length,
          offset,
          count: items.length,
          items,
        },
        buildHead,
      };
    }

    if (kind === "publications") {
      const items = publications.slice(offset, offset + limit);
      return {
        payload: {
          ok: true,
          index_version: index.version ?? "unknown",
          build_head: buildHead,
          kind,
          total: publications.length,
          offset,
          count: items.length,
          items,
        },
        buildHead,
      };
    }

    if (kind === "collaborators") {
      const filtered = collaborator
        ? collaborators.filter((c) => matchesCollaboratorFilter(collaborator, [collaboratorStrings(c)]))
        : collaborators;
      const items = filtered.slice(offset, offset + limit);
      return {
        payload: {
          ok: true,
          index_version: index.version ?? "unknown",
          build_head: buildHead,
          kind,
          ...(collaborator ? { collaborator: collaborator.trim() } : {}),
          total: filtered.length,
          offset,
          count: items.length,
          items,
        },
        buildHead,
      };
    }

    const items = projects.slice(offset, offset + limit);
    return {
      payload: {
        ok: true,
        index_version: index.version ?? "unknown",
        build_head: buildHead,
        kind: "projects",
        total: projects.length,
        offset,
        count: items.length,
        items,
      },
      buildHead,
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
    const cachedIndex = indexCache.get(siteOrigin);
    let buildHead =
      cachedIndex && cachedIndex.expiresAt > Date.now()
        ? cachedIndex.data.buildHead
        : null;

    if (!resolved) {
      return {
        payload: {
          ok: false,
          code: "NOT_FOUND",
          ...(buildHead ? { build_head: buildHead } : {}),
          message:
            "No public Markdown twin exists at that path on linxule.com. Use `search_site` or `list_site` to find valid page paths.",
        },
        buildHead,
      };
    }

    if (!buildHead) {
      const indexRecord = await loadSiteIndex(siteOrigin).catch(() => null);
      buildHead = indexRecord?.buildHead ?? (await loadManifestBuildHead(siteOrigin)) ?? "unknown";
    }

    const acceptHeader =
      resolved.mimeType === "text/plain"
        ? "text/plain"
        : `${resolved.mimeType}, text/plain;q=0.9`;

    let fetched;
    if (HOT_STATIC_PATHS.has(resolved.mdPath)) {
      fetched = await fetchCachedOriginText(siteOrigin, resolved.mdPath, acceptHeader);
    } else {
      const upstream = await fetchOriginBytes(siteOrigin, resolved.mdPath, acceptHeader);
      if (upstream.status !== 200) {
        fetched = { status: upstream.status };
      } else {
        fetched = {
          status: 200,
          utf8Bytes: upstream.bytes.byteLength,
          sha256: await sha256Hex(upstream.bytes),
          text: TEXT_DECODER.decode(upstream.bytes),
        };
      }
    }

    if (fetched.status === 404) {
      return {
        payload: {
          ok: false,
          code: "NOT_FOUND",
          build_head: buildHead,
          message: `Markdown twin ${resolved.mdPath} was not found upstream.`,
        },
        buildHead,
      };
    }
    if (fetched.status === 413) {
      return {
        payload: {
          ok: false,
          code: "PAGE_TOO_LARGE",
          build_head: buildHead,
          markdown_url: `${siteOrigin}${resolved.mdPath}`,
        },
        buildHead,
      };
    }

    const canonicalUrl = `${siteOrigin}${resolved.canonicalPath}`;
    const markdownUrl = `${siteOrigin}${resolved.mdPath}`;

    if (args.expected_sha256 && args.expected_sha256 !== fetched.sha256) {
      return {
        payload: {
          ok: false,
          code: "CONTENT_CHANGED",
          build_head: buildHead,
          canonical_url: canonicalUrl,
          markdown_url: markdownUrl,
          sha256: fetched.sha256,
        },
        buildHead,
      };
    }

    return {
      payload: {
        ok: true,
        title: resolved.title,
        section: resolved.section,
        canonical_url: canonicalUrl,
        markdown_url: markdownUrl,
        ...(resolved.date ? { date: resolved.date } : {}),
        ...(resolved.authors?.length ? { authors: resolved.authors } : {}),
        sha256: fetched.sha256,
        build_head: buildHead,
        utf8_bytes: fetched.utf8Bytes,
        attribution: attributionForSection(resolved.section, canonicalUrl),
        markdown: fetched.text,
      },
      buildHead,
    };
  }

  async function runReadResource(uri, siteOrigin) {
    if (typeof uri !== "string" || !uri.startsWith("linxule://") || uri.length > 240) {
      throw new JsonRpcError(-32602, "Invalid resource URI");
    }

    if (uri === "linxule://site-index") {
      const { rawText, sha256, buildHead } = await loadSiteIndex(siteOrigin);
      return {
        result: {
          contents: [
            {
              uri,
              mimeType: "application/json",
              text: rawText,
            },
          ],
          _meta: {
            sha256,
            canonical_url: `${siteOrigin}/site-index.json`,
            build_head: buildHead,
          },
        },
        buildHead,
      };
    }

    if (uri === "linxule://llms.txt") {
      const { payload: page, buildHead } = await runReadPage({ path: "/llms.txt" }, siteOrigin);
      if (!page.ok) throw new JsonRpcError(-32002, page.message || "Resource not found");
      return {
        result: {
          contents: [
            {
              uri,
              mimeType: "text/plain",
              text: page.markdown,
            },
          ],
          _meta: {
            sha256: page.sha256,
            canonical_url: page.canonical_url,
            build_head: buildHead || page.build_head,
          },
        },
        buildHead: buildHead || page.build_head,
      };
    }

    if (uri.startsWith("linxule://pages/")) {
      let slug = uri.slice("linxule://pages/".length);
      if (slug.endsWith(".md")) {
        slug = slug.slice(0, -3);
      }
      if (!slug || !/^[a-zA-Z0-9/_-]+$/.test(slug) || slug.includes("..") || slug.includes("//")) {
        throw new JsonRpcError(-32602, "Invalid page resource URI");
      }
      const lookupPath = slug === "index" ? "/" : `/${slug}`;
      const { payload: page, buildHead } = await runReadPage({ path: lookupPath }, siteOrigin);
      if (!page.ok) throw new JsonRpcError(-32002, page.message || "Resource not found");
      return {
        result: {
          contents: [
            {
              uri,
              mimeType: "text/markdown",
              text: page.markdown,
            },
          ],
          _meta: {
            sha256: page.sha256,
            canonical_url: page.canonical_url,
            build_head: buildHead || page.build_head,
          },
        },
        buildHead: buildHead || page.build_head,
      };
    }

    throw new JsonRpcError(-32602, `Unknown resource URI "${uri}"`);
  }

  async function runGetPrompt(params, siteOrigin) {
    if (!isPlainObject(params) || typeof params.name !== "string") {
      throw new JsonRpcError(-32602, "prompts/get requires a prompt `name`");
    }
    if (
      params.arguments !== undefined &&
      (!isPlainObject(params.arguments) || Object.keys(params.arguments).length > 0)
    ) {
      throw new JsonRpcError(-32602, "This prompt takes no arguments");
    }
    const promptMeta = MCP_PROMPTS.find((entry) => entry.name === params.name);
    if (!promptMeta) {
      throw new JsonRpcError(-32602, `Unknown prompt "${params.name}"`);
    }

    if (params.name === "enter-the-work") {
      const { index, buildHead } = await loadSiteIndex(siteOrigin);
      const text = buildEnterTheWorkPrompt(index, siteOrigin);
      const sha256 = await sha256Hex(TEXT_ENCODER.encode(text));
      return {
        result: {
          description: promptMeta.description,
          messages: [
            {
              role: "user",
              content: {
                type: "text",
                text,
              },
            },
          ],
          _meta: {
            sha256,
            canonical_url: `${siteOrigin}/thinking`,
            build_head: buildHead,
          },
        },
        buildHead,
      };
    }

    const { payload: skillPage, buildHead } = await runReadPage({ path: SKILL_PATH }, siteOrigin);
    if (!skillPage.ok) {
      throw new Error("SKILL_UNAVAILABLE");
    }
    return {
      result: {
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
        _meta: {
          sha256: skillPage.sha256,
          canonical_url: skillPage.canonical_url,
          build_head: buildHead || skillPage.build_head,
        },
      },
      buildHead: buildHead || skillPage.build_head,
    };
  }

  async function dispatchRpcMessage(msg, siteOrigin) {
    if (!isPlainObject(msg) || msg.jsonrpc !== "2.0") {
      return {
        response: {
          jsonrpc: "2.0",
          id:
            isPlainObject(msg) &&
            Object.prototype.hasOwnProperty.call(msg, "id") &&
            isValidRpcId(msg.id)
              ? msg.id
              : null,
          error: { code: -32600, message: "Invalid Request" },
        },
      };
    }

    const hasId = Object.prototype.hasOwnProperty.call(msg, "id");
    if (hasId && !isValidRpcId(msg.id)) {
      return {
        response: {
          jsonrpc: "2.0",
          id: null,
          error: { code: -32600, message: "Invalid Request: id must be string, number, or null" },
        },
      };
    }

    // JSON-RPC notifications or client responses carry no request execution obligation.
    if (!hasId) {
      if (typeof msg.method !== "string") {
        return {
          response: {
            jsonrpc: "2.0",
            id: null,
            error: { code: -32600, message: "Invalid Request" },
          },
        };
      }
      return { response: null };
    }

    if (typeof msg.method !== "string") {
      return {
        response: {
          jsonrpc: "2.0",
          id: msg.id,
          error: { code: -32600, message: "Invalid Request: missing method" },
        },
      };
    }

    const id = msg.id;

    try {
      switch (msg.method) {
        case "initialize": {
          const params = requireObjectParams(msg.params);
          const requestedVersion = params.protocolVersion;
          const negotiated = MCP_SUPPORTED_PROTOCOLS.includes(requestedVersion)
            ? requestedVersion
            : DEFAULT_PROTOCOL;
          return {
            response: {
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
            },
          };
        }

        case "ping":
          requireObjectParams(msg.params);
          return { response: { jsonrpc: "2.0", id, result: {} } };

        case "tools/list":
          requireObjectParams(msg.params);
          return {
            response: {
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
            },
          };

        case "tools/call": {
          const params = requireObjectParams(msg.params);
          if (typeof params.name !== "string") {
            throw new JsonRpcError(-32602, "tools/call requires `name`");
          }
          const toolArgs = params.arguments === undefined ? {} : params.arguments;
          let outcome;
          if (params.name === "search_site") {
            outcome = await runSearchSite(toolArgs, siteOrigin);
          } else if (params.name === "list_site") {
            outcome = await runListSite(toolArgs, siteOrigin);
          } else if (params.name === "read_page") {
            outcome = await runReadPage(toolArgs, siteOrigin);
          } else {
            throw new JsonRpcError(-32602, `Unknown tool "${params.name}"`);
          }
          const { payload, buildHead } = outcome;
          const meta = {
            ...(buildHead ? { build_head: buildHead } : {}),
            ...(payload.sha256 ? { sha256: payload.sha256 } : {}),
            ...(payload.canonical_url ? { canonical_url: payload.canonical_url } : {}),
          };
          return {
            buildHead,
            response: {
              jsonrpc: "2.0",
              id,
              result: {
                content: [{ type: "text", text: JSON.stringify(payload, null, 2) }],
                structuredContent: payload,
                ...(Object.keys(meta).length ? { _meta: meta } : {}),
                ...(payload.ok ? {} : { isError: true }),
              },
            },
          };
        }

        case "resources/list":
          requireObjectParams(msg.params);
          return {
            response: {
              jsonrpc: "2.0",
              id,
              result: {
                resources: [...MCP_STATIC_RESOURCES],
              },
            },
          };

        case "resources/templates/list":
          requireObjectParams(msg.params);
          return {
            response: {
              jsonrpc: "2.0",
              id,
              result: {
                resourceTemplates: [...MCP_RESOURCE_TEMPLATES],
              },
            },
          };

        case "resources/read": {
          const params = requireObjectParams(msg.params);
          if (typeof params.uri !== "string") {
            throw new JsonRpcError(-32602, "resources/read requires `uri`");
          }
          const { result, buildHead } = await runReadResource(params.uri, siteOrigin);
          return { buildHead, response: { jsonrpc: "2.0", id, result } };
        }

        case "prompts/list":
          requireObjectParams(msg.params);
          return {
            response: {
              jsonrpc: "2.0",
              id,
              result: {
                prompts: [...MCP_PROMPTS],
              },
            },
          };

        case "prompts/get": {
          const params = requireObjectParams(msg.params);
          const { result, buildHead } = await runGetPrompt(params, siteOrigin);
          return { buildHead, response: { jsonrpc: "2.0", id, result } };
        }

        default:
          return {
            response: {
              jsonrpc: "2.0",
              id,
              error: { code: -32601, message: `Method not found: ${msg.method}` },
            },
          };
      }
    } catch (error) {
      if (error instanceof JsonRpcError) {
        return {
          response: {
            jsonrpc: "2.0",
            id,
            error: { code: error.code, message: error.message },
          },
        };
      }
      return {
        response: {
          jsonrpc: "2.0",
          id,
          error: { code: -32603, message: "Internal error while reading upstream content" },
        },
      };
    }
  }

  return {
    async fetch(request, env = {}) {
      const url = new URL(request.url);
      const siteOrigin = String(env.SITE_ORIGIN || "https://linxule.com").replace(/\/$/, "");
      const mcpEnabled = (env.MCP_ENABLED ?? "1") === "1";
      const isHead = request.method === "HEAD";

      const plainError = (status, text, allowMethods, extraHeaders = {}) =>
        new Response(isHead ? null : text, {
          status,
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "no-store",
            ...corsHeadersFor(allowMethods),
            ...extraHeaders,
          },
        });

      const jsonResponse = (status, payload, allowMethods, extraHeaders = {}) => {
        const body = JSON.stringify(payload);
        return new Response(isHead ? null : body, {
          status,
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Cache-Control": "no-store",
            ...corsHeadersFor(allowMethods),
            ...extraHeaders,
          },
        });
      };

      // 1. SEP-2127 Server Card at `/mcp/server-card`
      if (url.pathname === MCP_SERVER_CARD_PATH && !url.search && !url.hash) {
        const cardMethods = "GET, HEAD, OPTIONS";
        if (!allowedHost(request, env)) return plainError(403, "Forbidden", cardMethods);
        if (!mcpEnabled) return plainError(503, "MCP unavailable; use /llms.txt", cardMethods);
        if (request.method === "OPTIONS") {
          return new Response(null, { status: 204, headers: corsHeadersFor(cardMethods) });
        }
        if (request.method === "GET" || request.method === "HEAD") {
          const cardBody = JSON.stringify(buildMcpServerCard(siteOrigin));
          const cardBytes = TEXT_ENCODER.encode(cardBody);
          const buildHead = await resolveBuildHead(siteOrigin, env);
          const headers = {
            "Content-Type": "application/mcp-server-card+json; charset=utf-8",
            "Content-Length": String(cardBytes.byteLength),
            "Cache-Control": "public, max-age=3600",
            Allow: cardMethods,
            ...corsHeadersFor(cardMethods),
            ...(buildHead ? { "X-Linxule-Build": buildHead } : {}),
          };
          return new Response(isHead ? null : cardBytes, {
            status: 200,
            headers,
          });
        }
        return plainError(405, "Method not allowed", cardMethods, { Allow: cardMethods });
      }

      // 2. Streamable HTTP MCP endpoint at `/mcp` and `/mcp/`
      const mcpMethods = "POST, OPTIONS";
      if (![MCP_ENDPOINT_PATH, `${MCP_ENDPOINT_PATH}/`].includes(url.pathname) || url.search || url.hash) {
        return plainError(404, "Not found", "GET, HEAD, POST, OPTIONS");
      }
      if (!allowedHost(request, env)) return plainError(403, "Forbidden", mcpMethods);
      if (!mcpEnabled) return plainError(503, "MCP unavailable; use /llms.txt", mcpMethods);

      if (request.method === "OPTIONS") {
        return new Response(null, { status: 204, headers: corsHeadersFor(mcpMethods) });
      }
      if (request.method !== "POST") {
        return plainError(405, "Method not allowed", mcpMethods, { Allow: mcpMethods });
      }

      const contentType = request.headers.get("content-type") || "";
      if (!/^application\/json\b/i.test(contentType)) {
        return plainError(415, "Unsupported Media Type: expected application/json", mcpMethods);
      }

      let rawBytes;
      try {
        rawBytes = await boundedBody(request);
      } catch (cause) {
        const reason = cause instanceof Error ? cause.message : "";
        const status =
          reason === "TOO_LARGE" ? 413 : reason === "TIMEOUT" ? 408 : reason === "ABORTED" ? 499 : 400;
        return plainError(status, "Request refused", mcpMethods);
      }

      let parsed;
      try {
        parsed = JSON.parse(TEXT_DECODER.decode(rawBytes));
      } catch {
        return jsonResponse(
          400,
          {
            jsonrpc: "2.0",
            id: null,
            error: { code: -32700, message: "Parse error" },
          },
          mcpMethods,
        );
      }

      const headerVersion = request.headers.get("mcp-protocol-version");
      if (headerVersion !== null && !MCP_SUPPORTED_PROTOCOLS.includes(headerVersion)) {
        return plainError(400, "Unsupported MCP-Protocol-Version", mcpMethods);
      }
      const activeProtocol = headerVersion ?? DEFAULT_PROTOCOL;

      if (Array.isArray(parsed)) {
        if (parsed.length === 0 || parsed.length > 20) {
          return jsonResponse(
            400,
            {
              jsonrpc: "2.0",
              id: null,
              error: { code: -32600, message: "Invalid Request: batch size must be 1..20" },
            },
            mcpMethods,
          );
        }
        const outcomes = await Promise.all(parsed.map((item) => dispatchRpcMessage(item, siteOrigin)));
        const results = outcomes.map((o) => o.response).filter((item) => item !== null);
        const batchBuildHead =
          outcomes.find((o) => o.buildHead)?.buildHead ||
          (typeof env.BUILD_HEAD === "string" && env.BUILD_HEAD.trim() ? env.BUILD_HEAD.trim() : null);

        if (results.length === 0) {
          return new Response(null, {
            status: 202,
            headers: {
              "Cache-Control": "no-store",
              "MCP-Protocol-Version": activeProtocol,
              ...corsHeadersFor(mcpMethods),
              ...(batchBuildHead ? { "X-Linxule-Build": batchBuildHead } : {}),
            },
          });
        }
        return jsonResponse(200, results, mcpMethods, {
          "MCP-Protocol-Version": activeProtocol,
          ...(batchBuildHead ? { "X-Linxule-Build": batchBuildHead } : {}),
        });
      }

      const outcome = await dispatchRpcMessage(parsed, siteOrigin);
      const buildHead =
        outcome.buildHead ||
        (typeof env.BUILD_HEAD === "string" && env.BUILD_HEAD.trim() ? env.BUILD_HEAD.trim() : null);

      if (outcome.response === null) {
        return new Response(null, {
          status: 202,
          headers: {
            "Cache-Control": "no-store",
            "MCP-Protocol-Version": activeProtocol,
            ...corsHeadersFor(mcpMethods),
            ...(buildHead ? { "X-Linxule-Build": buildHead } : {}),
          },
        });
      }

      const negotiatedVersion = outcome.response?.result?.protocolVersion ?? activeProtocol;
      return jsonResponse(200, outcome.response, mcpMethods, {
        "MCP-Protocol-Version": negotiatedVersion,
        ...(buildHead ? { "X-Linxule-Build": buildHead } : {}),
      });
    },
  };
}

export default createWorker();
