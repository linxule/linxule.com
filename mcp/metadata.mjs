/**
 * Shared MCP server metadata and server-card builder for `https://linxule.com/mcp`.
 *
 * Pure ESM JavaScript with zero Node.js or Eleventy imports so both the
 * Cloudflare Worker (`mcp/worker.mjs`) and Eleventy (`src/_data/mcpServerCard.js`)
 * derive their server cards, tool schemas, resources, and prompts from a single
 * source of truth.
 */

export const MCP_SERVER_INFO = Object.freeze({
  name: "linxule",
  sep2127Name: "com.linxule/mcp",
  title: "Xule Lin",
  version: "1.0.0",
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
  "Use `search_site` to find essays (LOOM, Research with AI, SEAM, Organizational Futures), formal publications, signature concepts (Interpretive Orchestration, Polanyi Inversion, Completion Authority, Cognitive Signatures, Token Duality), talks, portraits, artifacts, and open-source builds.",
  "Use `list_site` to inspect section counts, static Markdown twins, concepts, publications, or open-source builds.",
  "Use `read_page` to read the exact authored Markdown twin of any page before quoting or citing it.",
  "Attribution & licensing: prose in writing, concepts, thinking, CV, and paper landing pages is CC BY 4.0 (credit `Xule Lin (林徐乐), <title>, <year>, <canonical_url>`; prefer DOI/arXiv for formal papers). AI-generated images and artifacts under `/making/` carry per-page provenance and are not blanket-licensed.",
].join(" ");

export const PAGE_SECTIONS = Object.freeze([
  "writing",
  "papers",
  "talks",
  "portraits",
  "artifacts",
  "builds",
]);

export const SEARCH_KINDS = Object.freeze([
  "all",
  "pages",
  "concepts",
  "publications",
  "projects",
]);

export const LIST_KINDS = Object.freeze([
  "overview",
  "pages",
  "concepts",
  "publications",
  "projects",
]);

/**
 * Fixed public Markdown/text endpoints on `linxule.com` beyond `site-index.json`'s
 * collection items. Every entry maps canonical path -> { mdPath, title, section, mimeType }.
 */
export const STATIC_MARKDOWN_TWINS = Object.freeze({
  "/": {
    canonicalPath: "/",
    mdPath: "/index.md",
    title: "Xule Lin — Homepage Overview",
    section: "root",
    mimeType: "text/markdown",
  },
  "/thinking": {
    canonicalPath: "/thinking",
    mdPath: "/thinking.md",
    title: "Thinking — Research Framework",
    section: "thinking",
    mimeType: "text/markdown",
  },
  "/concepts": {
    canonicalPath: "/concepts",
    mdPath: "/concepts.md",
    title: "Concepts — Signature Concepts by Territory",
    section: "concepts",
    mimeType: "text/markdown",
  },
  "/builds": {
    canonicalPath: "/builds",
    mdPath: "/builds.md",
    title: "Builds — Open-Source Tools and Public Infrastructure",
    section: "builds",
    mimeType: "text/markdown",
  },
  "/builds/vellum": {
    canonicalPath: "/builds/vellum",
    mdPath: "/builds/vellum.md",
    title: "Vellum",
    section: "builds",
    mimeType: "text/markdown",
  },
  "/cv": {
    canonicalPath: "/cv",
    mdPath: "/cv.md",
    title: "CV (English)",
    section: "cv",
    mimeType: "text/markdown",
  },
  "/cv-zh": {
    canonicalPath: "/cv-zh",
    mdPath: "/cv-zh.md",
    title: "CV (中文)",
    section: "cv",
    mimeType: "text/markdown",
  },
  "/teaching": {
    canonicalPath: "/teaching",
    mdPath: "/teaching.md",
    title: "Teaching",
    section: "teaching",
    mimeType: "text/markdown",
  },
  "/writing": {
    canonicalPath: "/writing",
    mdPath: "/writing.md",
    title: "Writing Index",
    section: "writing",
    mimeType: "text/markdown",
  },
  "/making": {
    canonicalPath: "/making",
    mdPath: "/making.md",
    title: "Making Index",
    section: "making",
    mimeType: "text/markdown",
  },
  "/talks": {
    canonicalPath: "/talks",
    mdPath: "/talks.md",
    title: "Talks Index",
    section: "talks",
    mimeType: "text/markdown",
  },
  "/papers": {
    canonicalPath: "/papers",
    mdPath: "/papers.md",
    title: "Papers Index",
    section: "papers",
    mimeType: "text/markdown",
  },
  "/llms.txt": {
    canonicalPath: "/llms.txt",
    mdPath: "/llms.txt",
    title: "Xule Lin — Site Overview for AI Readers (llms.txt)",
    section: "discovery",
    mimeType: "text/plain",
  },
  "/.well-known/agent-skills/xule-research-navigation/SKILL.md": {
    canonicalPath: "/.well-known/agent-skills/xule-research-navigation/SKILL.md",
    mdPath: "/.well-known/agent-skills/xule-research-navigation/SKILL.md",
    title: "Xule Research Navigation Skill",
    section: "discovery",
    mimeType: "text/markdown",
  },
});

export const MCP_TOOLS = Object.freeze([
  {
    name: "search_site",
    title: "Search Xule Lin's research archive",
    description:
      "Search Xule Lin's essays, formal publications, signature concepts, talks, portraits, artifacts, and open-source builds on linxule.com. Read matching pages with `read_page` before quoting.",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          minLength: 1,
          maxLength: 200,
          description: "Topic, concept, title, collaborator, or keyword query.",
        },
        kind: {
          type: "string",
          enum: [...SEARCH_KINDS],
          description: "Optional scope filter (`all` by default).",
        },
        section: {
          type: "string",
          enum: [...PAGE_SECTIONS],
          description: "Optional page-section filter (`writing`, `papers`, `talks`, `portraits`, `artifacts`, `builds`).",
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
    title: "List linxule.com sections, concepts, papers, and builds",
    description:
      "Browse section counts, static Markdown twin paths, or structured lists of pages, signature concepts, formal publications, and open-source builds from linxule.com.",
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
          description: "Optional section filter when listing `pages` or `overview`.",
        },
        limit: {
          type: "integer",
          minimum: 1,
          maximum: 100,
          description: "Maximum entries to return (1..100, default 50).",
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
      "Read exact authored Markdown (with canonical URL, attribution guidance, and UTF-8 SHA-256) for any public page on linxule.com, e.g. `/thinking`, `/concepts`, `/writing/loom-xviii-the-end-of-positivism`, `/papers/interpretive-orchestration`, or `/llms.txt`.",
    inputSchema: {
      type: "object",
      properties: {
        path: {
          type: "string",
          minLength: 1,
          maxLength: 200,
          description: "Canonical page path, `.md` twin path, or full `https://linxule.com/...` URL.",
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
    description: "Complete JSON manifest of pages, signature concepts, formal publications, and open-source projects on linxule.com.",
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
    description: "Signature concepts organized by intellectual territory, with definitions and open questions.",
    mimeType: "text/markdown",
  },
  {
    uri: "linxule://pages/builds",
    name: "/builds.md",
    title: "Open-Source Builds Catalogue",
    description: "MCP servers, agent plugins, research tools, and public experiments with repository and license links.",
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
      "Read any public Markdown twin on linxule.com by path slug, e.g. `linxule://pages/writing/loom-xviii-the-end-of-positivism` or `linxule://pages/papers/interpretive-orchestration`.",
    mimeType: "text/markdown",
  },
]);

export const MCP_PROMPTS = Object.freeze([
  {
    name: "xule-research-navigation",
    description:
      "Guide for navigating, reading, and attributing Xule Lin's essays, formal papers, concepts, builds, and per-page media provenance on linxule.com.",
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
      annotations: { ...tool.annotations },
    })),
    prompts: MCP_PROMPTS.map((prompt) => ({
      name: prompt.name,
      description: prompt.description,
    })),
  };
}
