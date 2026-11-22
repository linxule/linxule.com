/**
 * Shared MCP server metadata and server-card builder for `https://linxule.com/mcp`.
 *
 * Pure ESM JavaScript with zero Node.js or Eleventy imports so both the
 * Cloudflare Worker (`mcp/worker.mjs`) and Eleventy (`src/_data/mcpServerCard.js`)
 * derive their server cards, tool schemas, resources, and prompts from a single
 * source of truth. Static Markdown twins derive directly from `eleventy/shapes.mjs`.
 */
import { STATIC_TWINS } from "../eleventy/shapes.mjs";

export const MCP_SERVER_INFO = Object.freeze({
  name: "linxule",
  sep2127Name: "com.linxule/mcp",
  title: "Xule Lin",
  version: "2.0.1",
});

// SEP-2127 server-card schema caps description at 100 characters (currently 92).
export const MCP_CARD_DESCRIPTION =
  "Read-only search and Markdown retrieval for Xule Lin's essays, papers, concepts, and builds.";

export const MCP_SERVER_CARD_SCHEMA =
  "https://static.modelcontextprotocol.io/schemas/v1/server-card.schema.json";

export const MCP_ENDPOINT_PATH = "/mcp";
export const MCP_SERVER_CARD_PATH = "/mcp/server-card";
export const MCP_SERVER_CARD_WELL_KNOWN_PATH = "/.well-known/mcp/server-card.json";

export const MCP_SUPPORTED_PROTOCOLS = Object.freeze([
  "2026-07-28",
  "2025-11-25",
  "2025-03-26",
]);

export const MCP_CAPABILITIES = Object.freeze({
  tools: Object.freeze({ listChanged: false }),
  prompts: Object.freeze({ listChanged: false }),
  resources: Object.freeze({ subscribe: false, listChanged: false }),
});

export const MCP_READONLY_ANNOTATIONS = Object.freeze({
  readOnlyHint: true,
  destructiveHint: false,
  idempotentHint: true,
  openWorldHint: false,
});

export const MCP_INSTRUCTIONS = [
  "Read-only MCP server for Xule Lin's (林徐乐) public research archive at https://linxule.com.",
  "Use `search_site` to find essays (LOOM, SEAM, Research with AI, AI Whispers, Thinking, Singles, Epistemic Voids, Organizational Futures, Archive), formal publications, all 14 signature concepts (anchored, scholarship-grounded, and forming — including Interpretive Orchestration, Polanyi Inversion, Completion Authority, Cognitive Signatures, Token Duality, Artificial Organizing, Runtime Organization), talks, portraits, artifacts, open-source builds (including SIGNA and daogov), static pages (/thinking, /concepts, /cv, /cv-zh, /connect), and human-AI collaborator lineages.",
  "Use `list_site` to inspect section counts, static Markdown twins, paginated pages (`limit`/`offset`), concepts, publications, open-source builds, or collaborators.",
  "Use `read_page` to read the exact authored Markdown twin of any page before quoting or citing it (URL fragments like `#dfn-...` and `.md` suffixes are accepted).",
  "Use the `enter-the-work` prompt for intellectual orientation and cross-surface reading trails, or `xule-research-navigation` for citation and provenance boundaries.",
  "Attribution & licensing: prose in writing, concepts, thinking, CV, and paper landing pages is CC BY 4.0 (credit `Xule Lin (林徐乐), <title>, <year>, <canonical_url>`; prefer DOI/arXiv for formal papers). AI-generated images and artifacts under `/making` carry per-page provenance and are not blanket-licensed.",
].join(" ");

export const PAGE_SECTIONS = Object.freeze([
  "root",
  "writing",
  "papers",
  "talks",
  "portraits",
  "artifacts",
  "builds",
  "making",
  "thinking",
  "concepts",
  "teaching",
  "cv",
  "connect",
]);

export const SEARCH_KINDS = Object.freeze([
  "all",
  "pages",
  "concepts",
  "publications",
  "projects",
  "collaborators",
]);

export const LIST_KINDS = Object.freeze([
  "overview",
  "pages",
  "concepts",
  "publications",
  "projects",
  "collaborators",
]);

/**
 * Fixed public Markdown/text endpoints on `linxule.com` derived directly from
 * `eleventy/shapes.mjs` (`STATIC_TWINS`) plus `/llms.txt` and `SKILL.md`.
 * Every entry maps canonical path -> { canonicalPath, mdPath, title, section, mimeType }.
 */
export const STATIC_MARKDOWN_TWINS = Object.freeze({
  ...Object.fromEntries(
    STATIC_TWINS.map((shape) => [
      shape.url,
      Object.freeze({
        canonicalPath: shape.url,
        mdPath: shape.mdUrl,
        title: shape.title,
        section: shape.url === "/connect" ? "connect" : shape.section,
        mimeType: "text/markdown",
      }),
    ]),
  ),
  "/llms.txt": Object.freeze({
    canonicalPath: "/llms.txt",
    mdPath: "/llms.txt",
    title: "Xule Lin — Site Overview for AI Readers (llms.txt)",
    section: "discovery",
    mimeType: "text/plain",
  }),
  "/.well-known/agent-skills/xule-research-navigation/SKILL.md": Object.freeze({
    canonicalPath: "/.well-known/agent-skills/xule-research-navigation/SKILL.md",
    mdPath: "/.well-known/agent-skills/xule-research-navigation/SKILL.md",
    title: "Xule Research Navigation Skill",
    section: "discovery",
    mimeType: "text/markdown",
  }),
});

export const MCP_TOOLS = Object.freeze([
  {
    name: "search_site",
    title: "Search Xule Lin's research archive",
    description:
      "Search Xule Lin's essays, formal publications, all 14 signature concepts (anchored, scholarship-grounded, and forming), talks, portraits, artifacts, open-source builds, static pages, and human-AI collaborator lineages on linxule.com. Supports English word/stem/acronym matching and bilingual Chinese-English concept queries. Read matching pages with `read_page` before quoting.",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          minLength: 1,
          maxLength: 200,
          description: "Topic, concept, title, collaborator, or keyword query (English or Chinese).",
        },
        kind: {
          type: "string",
          enum: [...SEARCH_KINDS],
          description: "Optional scope filter (`all` by default).",
        },
        section: {
          type: "string",
          enum: [...PAGE_SECTIONS],
          description: "Optional page-section filter (e.g. `writing`, `papers`, `talks`, `making` [includes `portraits` and `artifacts`], `portraits`, `artifacts`, `builds`, `cv`, `thinking`, `concepts`, `connect`).",
        },
        collaborator: {
          type: "string",
          minLength: 1,
          maxLength: 100,
          description: "Optional human or AI collaborator name or family filter (e.g. `Claude`, `Kevin Corley`, `Erkko Autio`, `Ying-Ying Hsieh`, `Kimi`, `GPT`, `DeepSeek`).",
        },
        limit: {
          type: "integer",
          minimum: 1,
          maximum: 25,
          description: "Maximum matches to return (1..25, default 10).",
        },
      },
      required: ["query"],
      additionalProperties: false,
    },
    annotations: { ...MCP_READONLY_ANNOTATIONS },
  },
  {
    name: "list_site",
    title: "List linxule.com sections, concepts, papers, builds, and collaborators",
    description:
      "Browse section counts, static Markdown twin paths, or paginated structured lists (`limit`/`offset`) of pages, signature concepts, formal publications, open-source builds, and human-AI collaborator lineages from linxule.com.",
    inputSchema: {
      type: "object",
      properties: {
        kind: {
          type: "string",
          enum: [...LIST_KINDS],
          description: "Inventory slice to inspect (`overview` by default).",
        },
        section: {
          type: "string",
          enum: [...PAGE_SECTIONS],
          description: "Optional section filter when listing `pages` or `overview` (`making` includes `portraits` and `artifacts`; `builds` and `connect` both match `/connect`).",
        },
        collaborator: {
          type: "string",
          minLength: 1,
          maxLength: 100,
          description: "Optional collaborator name or family filter when listing `pages` or `collaborators`.",
        },
        limit: {
          type: "integer",
          minimum: 1,
          maximum: 100,
          description: "Maximum entries to return (1..100, default 50).",
        },
        offset: {
          type: "integer",
          minimum: 0,
          description: "Zero-based pagination offset (integer >= 0, default 0) for stepping through lists beyond `limit`.",
        },
      },
      additionalProperties: false,
    },
    annotations: { ...MCP_READONLY_ANNOTATIONS },
  },
  {
    name: "read_page",
    title: "Read an authored Markdown page from linxule.com",
    description:
      "Read exact authored Markdown (with canonical URL, attribution guidance, build head, and UTF-8 SHA-256) for any public page on linxule.com, e.g. `/thinking`, `/concepts`, `/connect`, `/writing/loom-xviii-the-end-of-positivism#dfn-completion-authority`, `/papers/interpretive-orchestration`, or `/llms.txt`.",
    inputSchema: {
      type: "object",
      properties: {
        path: {
          type: "string",
          minLength: 1,
          maxLength: 200,
          description: "Canonical page path, `.md` twin path, or full `https://linxule.com/...` URL (`#fragment` and `?query` are stripped automatically).",
        },
        expected_sha256: {
          type: "string",
          pattern: "^[0-9a-f]{64}$",
          description: "Optional 64-hex SHA-256 guard; returns `CONTENT_CHANGED` if the current Markdown bytes differ.",
        },
      },
      required: ["path"],
      additionalProperties: false,
    },
    annotations: { ...MCP_READONLY_ANNOTATIONS },
  },
]);

export const MCP_STATIC_RESOURCES = Object.freeze([
  {
    uri: "linxule://llms.txt",
    name: "llms.txt",
    title: "Xule Lin — Site Overview for AI Readers",
    description: "Research positioning, key concepts, selected publications, open-source builds, and CC BY 4.0 / per-page attribution rules.",
    mimeType: "text/plain",
  },
  {
    uri: "linxule://site-index",
    name: "site-index.json",
    title: "Machine-Readable Site Index",
    description: "Complete JSON manifest of pages, all 14 signature concepts, formal publications, open-source projects, and human-AI collaborators on linxule.com.",
    mimeType: "application/json",
  },
  {
    uri: "linxule://pages/index",
    name: "/index.md",
    title: "Homepage Overview (Markdown)",
    description: "Compact Markdown overview of Xule Lin's research, orientation paths, and agent surfaces.",
    mimeType: "text/markdown",
  },
  {
    uri: "linxule://pages/thinking",
    name: "/thinking.md",
    title: "Thinking — Research Framework",
    description: "Core research question, thesis, observations, and orientations.",
    mimeType: "text/markdown",
  },
  {
    uri: "linxule://pages/concepts",
    name: "/concepts.md",
    title: "Concepts Index",
    description: "All 14 signature concepts organized by intellectual territory, with anchored definitions, forming vocabulary, and open questions.",
    mimeType: "text/markdown",
  },
  {
    uri: "linxule://pages/builds",
    name: "/builds.md",
    title: "Open-Source Builds Catalogue",
    description: "MCP servers, agent plugins, research tools, datasets, and public experiments with repository and license links.",
    mimeType: "text/markdown",
  },
  {
    uri: "linxule://pages/connect",
    name: "/connect.md",
    title: "MCP Connection Recipes",
    description: "Read-only connection recipes for Claude Code, Claude apps, Cursor, Codex, and Antigravity, plus sibling public MCP servers.",
    mimeType: "text/markdown",
  },
  {
    uri: "linxule://pages/cv",
    name: "/cv.md",
    title: "Academic CV (English)",
    description: "Full academic record, appointments, publications, working papers, talks, and teaching.",
    mimeType: "text/markdown",
  },
]);

export const MCP_RESOURCE_TEMPLATES = Object.freeze([
  {
    uriTemplate: "linxule://pages/{+slug}",
    name: "pages",
    title: "Authored Markdown Twin by Slug",
    description:
      "Read any public Markdown twin on linxule.com by path slug (with or without `.md`), e.g. `linxule://pages/writing/loom-xviii-the-end-of-positivism` or `linxule://pages/papers/interpretive-orchestration.md`.",
    mimeType: "text/markdown",
  },
]);

export const MCP_PROMPTS = Object.freeze([
  {
    name: "xule-research-navigation",
    description:
      "Guide for navigating, reading, and attributing Xule Lin's essays, formal papers, concepts, builds, and per-page media provenance on linxule.com.",
  },
  {
    name: "enter-the-work",
    description:
      "Intellectual orientation to Xule Lin's core question, active tensions, anchored, scholarship-grounded, and forming concepts, human-AI collaborator practice, and cross-surface reading trails.",
  },
]);

/**
 * Build a dual-compatible MCP Server Card satisfying both SEP-2127 (`$schema`,
 * reverse-DNS `name`, <=100-char `description`, `remotes`) and SEP-1649 /
 * `isitagentready.com` validators (`serverInfo`, `url`, `transport`,
 * `authentication`, `capabilities`, `tools`, `prompts`).
 */
export function buildMcpServerCard(siteUrl = "https://linxule.com") {
  const origin = siteUrl.replace(/\/$/, "");
  const endpointUrl = `${origin}${MCP_ENDPOINT_PATH}`;
  return {
    $schema: MCP_SERVER_CARD_SCHEMA,
    name: MCP_SERVER_INFO.sep2127Name,
    title: MCP_SERVER_INFO.title,
    version: MCP_SERVER_INFO.version,
    description: MCP_CARD_DESCRIPTION,
    websiteUrl: origin,
    documentationUrl: `${origin}/llms.txt`,
    remotes: [
      {
        type: "streamable-http",
        url: endpointUrl,
        supportedProtocolVersions: [...MCP_SUPPORTED_PROTOCOLS],
      },
    ],
    serverInfo: {
      name: MCP_SERVER_INFO.name,
      title: MCP_SERVER_INFO.title,
      version: MCP_SERVER_INFO.version,
    },
    url: endpointUrl,
    transport: {
      type: "streamable-http",
      endpoint: MCP_ENDPOINT_PATH,
    },
    authentication: {
      required: false,
    },
    capabilities: {
      tools: { ...MCP_CAPABILITIES.tools },
      prompts: { ...MCP_CAPABILITIES.prompts },
      resources: { ...MCP_CAPABILITIES.resources },
    },
    tools: MCP_TOOLS.map((tool) => ({
      name: tool.name,
      title: tool.title,
      description: tool.description,
      inputSchema: tool.inputSchema,
      annotations: { ...tool.annotations },
    })),
    prompts: MCP_PROMPTS.map((prompt) => ({
      name: prompt.name,
      description: prompt.description,
    })),
  };
}
