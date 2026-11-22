import { createHash } from "node:crypto";
import { existsSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, test } from "bun:test";
import {
  MCP_CARD_DESCRIPTION,
  STATIC_MARKDOWN_TWINS,
  buildMcpServerCard,
} from "./metadata.mjs";
import { allowedHost, createWorker, normalizeCandidatePath } from "./worker.mjs";

const ORIGIN = "https://linxule.com";
const FIXTURE_BUILD_HEAD = "9d703ee";

const FIXTURE_INDEX = {
  version: "2026-11-22",
  build_head: FIXTURE_BUILD_HEAD,
  site: {
    title: "Xule Lin",
    titleZh: "林徐乐",
    url: ORIGIN,
    author: "Xule Lin",
    authorZh: "林徐乐",
    description: "What becomes impossible to see when algorithms enter organizational life — not as tools.",
  },
  pages: [
    {
      url: "/",
      url_md: "/index.md",
      title: "Xule Lin",
      section: "root",
      static: true,
      keywords: ["Xule Lin", "林徐乐", "SKEMA", "human-AI collaboration"],
      summary: "What becomes impossible to see when algorithms enter organizational life — not as tools.",
    },
    {
      url: "/cv",
      url_md: "/cv.md",
      title: "CV — organization scholar & AI researcher",
      section: "cv",
      static: true,
      keywords: ["CV", "Xule Lin", "林徐乐", "SKEMA", "Imperial College London"],
      summary: "Xule Lin (林徐乐) — Assistant Professor, SKEMA Centre for Artificial Intelligence, Paris.",
    },
    {
      url: "/cv-zh",
      url_md: "/cv-zh.md",
      title: "简历 — 林徐乐",
      section: "cv",
      static: true,
      keywords: ["简历", "中文简历", "林徐乐", "SKEMA", "帝国理工学院"],
      summary: "林徐乐 (Xule Lin) — SKEMA人工智能中心助理教授(巴黎)，研究人机协作与组织理论。",
    },
    {
      url: "/connect",
      url_md: "/connect.md",
      title: "Connect",
      section: "connect",
      static: true,
      keywords: ["connect", "MCP", "Claude Code", "Cursor", "Codex", "Antigravity"],
      summary: "Read-only MCP connection recipes for linxule.com and sibling public MCP servers.",
    },
    {
      url: "/making",
      url_md: "/making.md",
      title: "Making",
      section: "making",
      static: true,
      keywords: ["making", "portraits", "artifacts", "AI art"],
      summary: "AI-rendered portraits and artifacts made directly in conversation with named AI collaborators.",
    },
    {
      url: "/builds",
      url_md: "/builds.md",
      title: "Builds",
      section: "builds",
      static: true,
      keywords: ["builds", "open-source", "MCP", "daogov", "SIGNA"],
      summary: "Open-source tools and public infrastructure built alongside the research.",
    },
    {
      url: "/writing/loom-xvii-the-polanyi-inversion",
      url_md: "/writing/loom-xvii-the-polanyi-inversion.md",
      title: "LOOM XVII: The Polanyi Inversion",
      section: "writing",
      date: "2026-03-12",
      authors: ["Xule Lin", "Kevin Corley", "Claude Opus 4.6"],
      keywords: ["Polanyi Inversion", "tacit knowledge", "epistemic alienation", "LLMs"],
      summary: "Polanyi's paradox inverted: when friction dissolves, articulation outruns understanding.",
    },
    {
      url: "/writing/what-i-am-thinking-2026-01",
      url_md: "/writing/what-i-am-thinking-2026-01.md",
      title: "What I'm Thinking, January 2026",
      section: "writing",
      date: "2026-01-15",
      authors: ["Xule Lin"],
      keywords: ["thinking", "notes"],
      summary: "What is happening in the field and what the notes show this month.",
    },
    {
      url: "/writing/dao-governance-resources",
      url_md: "/writing/dao-governance-resources.md",
      title: "DAO Governance Resources",
      section: "writing",
      date: "2024-02-01",
      authors: ["Xule Lin"],
      keywords: ["DAO", "governance", "LLM"],
      summary: "Curated research notes on DAO governance and LLM tools for organizational analysis.",
    },
    {
      url: "/writing/loom-xviii-the-end-of-positivism",
      url_md: "/writing/loom-xviii-the-end-of-positivism.md",
      title: "LOOM XVIII: It's the End of Positivism as We Know It (and I Feel Fine)",
      section: "writing",
      date: "2026-06-24",
      authors: ["Xule Lin", "Kevin Corley", "Claude Opus 4.8"],
      keywords: ["positivism", "completion authority", "qualitative research"],
      summary: "Rigorous quantitative methods automate first, and judgment stays human.",
    },
    {
      url: "/writing/writing-in-markdown",
      url_md: "/writing/writing-in-markdown.md",
      title: "Writing in Markdown",
      section: "writing",
      date: "2024-03-01",
      authors: ["Xule Lin"],
      keywords: ["markdown", "archive", "zotero"],
      summary: "Discover practical workflows to recover academic writing notes without friction.",
    },
    {
      url: "/papers/interpretive-orchestration",
      url_md: "/papers/interpretive-orchestration.md",
      title: "Interpretive Orchestration",
      section: "papers",
      date: "2026-06-01",
      venue: "Strategic Organization",
      authors: ["Xule Lin", "Kevin G. Corley"],
      summary: "Exploring the epistemic intersection of human intuition and machine intelligence.",
    },
    {
      url: "/making/portraits/01-threshold",
      url_md: "/making/portraits/01-threshold.md",
      title: "Threshold",
      section: "portraits",
      date: "2026-01-10",
      prompter: "Claude",
      generator: "Midjourney",
      keywords: ["doorway", "winter"],
      summary: "A doorway in winter light.",
    },
    {
      url: "/making/artifacts/signal-bloom",
      url_md: "/making/artifacts/signal-bloom.md",
      title: "signal bloom",
      section: "artifacts",
      date: "2026-04-02",
      creator: "Kimi K3",
      medium: "interactive HTML",
      keywords: ["signal", "bloom"],
      summary: "A glowing signal wave.",
    },
  ],
  concepts: [
    {
      term: "Polanyi Inversion",
      slug: "polanyi-inversion",
      territory: "Epistemology of AI collaboration",
      status: "anchored",
      oneliner: "We can tell more than we know.",
      definition: "The condition where articulation exceeds comprehension — we can tell more than we know.",
      url: "/writing/loom-xvii-the-polanyi-inversion#dfn-polanyi-inversion",
      essayUrl: "/writing/loom-xvii-the-polanyi-inversion",
      canonicalEssay: "LOOM XVII: The Polanyi Inversion",
      authors: ["Xule Lin", "Kevin Corley"],
      date: "2026-03-12",
    },
    {
      term: "Interpretive Orchestration",
      slug: "interpretive-orchestration",
      territory: "Epistemology of AI collaboration",
      status: "anchored",
      oneliner: "Holding your own judgment while gaining from what AI enables.",
      definition: "Maintaining your own interpretive judgment while gaining from what AI enables.",
      url: "/writing/research-memex#dfn-interpretive-orchestration",
      essayUrl: "/writing/research-memex",
      paperUrl: "/papers/interpretive-orchestration",
      canonicalEssay: "Research Memex: Working at the AI Research Frontier",
    },
    {
      term: "Completion Authority",
      slug: "completion-authority",
      territory: "Epistemology of AI collaboration",
      status: "anchored",
      oneliner: "Who gets to say the work is done — the call no external scorer can make for you.",
      definition: "Who holds the right to declare an open-ended inquiry finished when no external whistle exists.",
      url: "/writing/loom-xviii-the-end-of-positivism#dfn-completion-authority",
      essayUrl: "/writing/loom-xviii-the-end-of-positivism",
      canonicalEssay: "LOOM XVIII: It's the End of Positivism as We Know It (and I Feel Fine)",
      authors: ["Xule Lin", "Kevin Corley"],
      date: "2026-06-24",
    },
    {
      term: "Cognitive Signatures",
      slug: "cognitive-signatures",
      territory: "Epistemology of AI collaboration",
      status: "anchored",
      oneliner: "Different AI systems carry different theories of how understanding emerges.",
      definition: "Distinctive interaction patterns reflecting embedded theories of knowledge.",
      url: "/writing/loom-vi-the-pattern-beneath-the-voices#dfn-cognitive-signatures",
      essayUrl: "/writing/loom-vi-the-pattern-beneath-the-voices",
      canonicalEssay: "LOOM VI: The Pattern Beneath the Voices",
    },
    {
      term: "Token Duality",
      slug: "token-duality",
      territory: "Governance and coordination",
      status: "grounded",
      oneliner: "Tokens are simultaneously economic instruments and governance mechanisms.",
      definition: "Tokens are simultaneously economic instruments and governance mechanisms in DAOs.",
      open_questions: ["What happens when markets and governance become recursive?"],
      url: "/concepts#dfn-token-duality",
    },
    {
      term: "SIGNA Framework",
      slug: "signa-framework",
      territory: "Governance and coordination",
      status: "grounded",
      oneliner: "Analyzing token governance across multiple dimensions simultaneously.",
      definition: "Analyzing token governance across multiple dimensions simultaneously.",
      url: "/concepts#dfn-signa-framework",
    },
    {
      term: "Artificial Organizing",
      slug: "artificial-organizing",
      territory: "Actors, composed",
      status: "forming",
      oneliner: "Once, organizations coordinated actors. Now they compose them.",
      definition: "Once, organizations coordinated actors. Now they compose them.",
      open_questions: ["What becomes invisible when the actors themselves are composed?"],
      url: "/concepts#dfn-artificial-organizing",
    },
  ],
  publications: [
    {
      title: "Interpretive Orchestration: An Essay Exploring the Epistemic Intersection of Human Intuition and Machine Intelligence",
      authors: ["Xule Lin", "Kevin G. Corley"],
      year: 2026,
      venue: "Strategic Organization",
      type: "journal-article",
      doi: "10.1177/14761270261448645",
      url: "https://doi.org/10.1177/14761270261448645",
      license: "https://creativecommons.org/licenses/by/4.0/",
      coins: "Interpretive Orchestration",
      onSite: "/papers/interpretive-orchestration",
      read_path: "/papers/interpretive-orchestration",
      url_md: "/papers/interpretive-orchestration.md",
    },
  ],
  projects: [
    {
      name: "Research Memex",
      url: "https://research-memex.org",
      description: "Field handbook for human-AI research collaboration.",
      license: "MIT",
      group: "Featured builds",
    },
    {
      name: "SIGNA",
      url: null,
      description: "An AI-augmented grounded theory method that keeps interpretive depth at scale.",
      group: "Research infrastructure",
    },
    {
      name: "daogov",
      url: null,
      description: "Governance discourse from 78 decentralized organizations: 260,000 discussions, roughly 40.3 million words.",
      note: "dataset in preparation",
      group: "Research infrastructure",
    },
  ],
  collaborators: [
    {
      family: "claude",
      name: "Claude",
      slug: "claude",
      kind: "ai",
      roles: ["author", "prompter", "creator"],
      models: ["Claude Opus 4.8", "Claude 4.5 Sonnet"],
      prompterUrl: "/making/prompter/claude",
      creatorUrl: "/making/creator/claude",
      totalWorks: 12,
    },
    {
      family: "kimi",
      name: "Kimi",
      slug: "kimi",
      kind: "ai",
      roles: ["prompter", "creator"],
      models: ["Kimi K3", "Kimi Code"],
      creatorUrl: "/making/creator/kimi",
      totalWorks: 5,
    },
    {
      name: "Kevin Corley",
      slug: "kevin-corley",
      kind: "human",
      roles: ["coauthor"],
      models: ["Kevin Corley"],
      totalWorks: 16,
    },
    {
      name: "Carliss Y. Baldwin",
      slug: "carliss-y-baldwin",
      kind: "human",
      roles: ["coauthor"],
      models: ["Carliss Y. Baldwin"],
      totalWorks: 2,
    },
    {
      name: "Erkko Autio",
      slug: "erkko-autio",
      kind: "human",
      roles: ["coauthor"],
      models: ["Erkko Autio"],
      totalWorks: 2,
    },
    {
      name: "Ying-Ying Hsieh",
      slug: "ying-ying-hsieh",
      kind: "human",
      roles: ["coauthor"],
      models: ["Ying-Ying Hsieh"],
      totalWorks: 1,
    },
  ],
};

const FIXTURE_BODIES = new Map([
  ["/site-index.json", JSON.stringify(FIXTURE_INDEX)],
  [
    "/.build-manifest.json",
    JSON.stringify({ schemaVersion: 1, head: FIXTURE_BUILD_HEAD, fingerprint: "abc" }),
  ],
  ["/index.md", "# Xule Lin — linxule.com\n\nHomepage overview."],
  ["/thinking.md", "# Thinking\n\nCore question and orientations."],
  ["/connect.md", "# Connect to linxule.com\n\nRead-only MCP recipes."],
  ["/cv.md", "# CV\n\n**Xule Lin 林徐乐**\n\n## Academic Appointments\n"],
  ["/cv-zh.md", "# 简历 — 林徐乐\n\n**林徐乐 Xule Lin**\n\n## 学术任职\n"],
  ["/llms.txt", "# Xule Lin\n\nOverview for AI readers."],
  [
    "/.well-known/agent-skills/xule-research-navigation/SKILL.md",
    "---\nname: xule-research-navigation\n---\n\n# Xule Research Navigation\n",
  ],
  [
    "/writing/loom-xviii-the-end-of-positivism.md",
    "# LOOM XVIII\n\nCompletion authority stays human.",
  ],
  [
    "/papers/interpretive-orchestration.md",
    "# Interpretive Orchestration\n\nDOI: 10.1177/14761270261448645",
  ],
  [
    "/making/portraits/01-threshold.md",
    "# Threshold\n\nPrompter: Claude · Generator: Midjourney",
  ],
  [
    "/making/artifacts/signal-bloom.md",
    "# signal bloom\n\nCreator: Kimi K3",
  ],
]);

function makeFixtureWorker({ extraBodies = new Map(), onFetch } = {}) {
  const seenRequests = [];
  const fetchImpl = async (input, init = {}) => {
    const url = new URL(typeof input === "string" ? input : input.url);
    seenRequests.push({ url: url.toString(), headers: init.headers || {} });
    if (onFetch) {
      const custom = await onFetch(url, init);
      if (custom) return custom;
    }
    if (url.origin !== ORIGIN) {
      throw new Error(`Unexpected off-origin fetch: ${url.toString()}`);
    }
    const body = extraBodies.has(url.pathname)
      ? extraBodies.get(url.pathname)
      : FIXTURE_BODIES.get(url.pathname);
    if (body === undefined) {
      return new Response("Not found", { status: 404 });
    }
    if (body instanceof Response) return body;
    return new Response(body, {
      status: 200,
      headers: {
        "Content-Type": url.pathname.endsWith(".json")
          ? "application/json; charset=utf-8"
          : "text/markdown; charset=utf-8",
      },
    });
  };
  return {
    worker: createWorker({ fetchImpl }),
    seenRequests,
    get seenUrls() {
      return seenRequests.map((r) => r.url);
    },
    env: {
      ALLOWED_HOSTS: "linxule.com",
      SITE_ORIGIN: ORIGIN,
      MCP_ENABLED: "1",
    },
  };
}

async function postRpc(worker, env, payload, extraHeaders = {}) {
  return worker.fetch(
    new Request("https://linxule.com/mcp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json, text/event-stream",
        Host: "linxule.com",
        ...extraHeaders,
      },
      body: JSON.stringify(payload),
    }),
    env,
  );
}

describe("linxule-mcp metadata and HTTP boundary", () => {
  test("server card satisfies dual SEP-2127 and SEP-1649 constraints", () => {
    const card = buildMcpServerCard(ORIGIN);
    expect(MCP_CARD_DESCRIPTION.length).toBeLessThanOrEqual(100);
    expect(card.description.length).toBeLessThanOrEqual(100);
    expect(card.name).toBe("com.linxule/mcp");
    expect(card.serverInfo).toEqual({
      name: "linxule",
      title: "Xule Lin",
      version: "2.0.1",
    });
    expect(card.version).toBe("2.0.1");
    expect(card.url).toBe("https://linxule.com/mcp");
    expect(card.remotes[0].url).toBe("https://linxule.com/mcp");
    expect(card.transport).toEqual({ type: "streamable-http", endpoint: "/mcp" });
    expect(card.authentication).toEqual({ required: false });
    expect(card.tools.map((t) => t.name)).toEqual(["search_site", "list_site", "read_page"]);
    const listSiteCardTool = card.tools.find((t) => t.name === "list_site");
    expect(listSiteCardTool.inputSchema.properties.offset).toEqual(
      expect.objectContaining({ type: "integer", minimum: 0 }),
    );
    expect(card.prompts.map((p) => p.name)).toEqual(["xule-research-navigation", "enter-the-work"]);
  });

  test("GET, HEAD, and OPTIONS /mcp/server-card return route-accurate CORS and identical headers", async () => {
    const { worker, env } = makeFixtureWorker();

    const optionsRes = await worker.fetch(
      new Request("https://linxule.com/mcp/server-card", { method: "OPTIONS" }),
      env,
    );
    expect(optionsRes.status).toBe(204);
    expect(optionsRes.headers.get("access-control-allow-origin")).toBe("*");
    expect(optionsRes.headers.get("access-control-allow-methods")).toBe("GET, HEAD, OPTIONS");

    const getRes = await worker.fetch(
      new Request("https://linxule.com/mcp/server-card", { method: "GET" }),
      env,
    );
    const headRes = await worker.fetch(
      new Request("https://linxule.com/mcp/server-card", { method: "HEAD" }),
      env,
    );

    expect(getRes.status).toBe(200);
    expect(headRes.status).toBe(200);
    expect(await headRes.text()).toBe("");
    expect(headRes.headers.get("allow")).toBe("GET, HEAD, OPTIONS");
    expect(getRes.headers.get("allow")).toBe("GET, HEAD, OPTIONS");
    expect(headRes.headers.get("access-control-allow-methods")).toBe("GET, HEAD, OPTIONS");
    expect(headRes.headers.get("x-linxule-build")).toBe(FIXTURE_BUILD_HEAD);

    // HEAD headers must match GET headers identically
    for (const [k, v] of getRes.headers.entries()) {
      expect(headRes.headers.get(k)).toBe(v);
    }

    const parsed = await getRes.json();
    expect(parsed).toEqual(buildMcpServerCard(ORIGIN));
    expect(Number(headRes.headers.get("content-length"))).toBe(
      new TextEncoder().encode(JSON.stringify(parsed)).byteLength,
    );
  });

  test("enforces host, HTTPS, method, HEAD empty error bodies, route-accurate CORS, kill-switch, and body bounds", async () => {
    const { worker, env } = makeFixtureWorker();

    expect(
      allowedHost(new Request("http://linxule.com/mcp"), { ALLOWED_HOSTS: "linxule.com" }),
    ).toBe(false);
    expect(
      allowedHost(new Request("https://evil.example/mcp"), { ALLOWED_HOSTS: "linxule.com" }),
    ).toBe(false);

    const getRes = await worker.fetch(new Request("https://linxule.com/mcp", { method: "GET" }), env);
    expect(getRes.status).toBe(405);
    expect(getRes.headers.get("allow")).toBe("POST, OPTIONS");
    expect(getRes.headers.get("access-control-allow-methods")).toBe("POST, OPTIONS");
    expect(getRes.headers.get("access-control-allow-origin")).toBe("*");

    // HEAD on /mcp must return 405 with an empty body
    const headMcp = await worker.fetch(new Request("https://linxule.com/mcp", { method: "HEAD" }), env);
    expect(headMcp.status).toBe(405);
    expect(await headMcp.text()).toBe("");
    expect(headMcp.headers.get("allow")).toBe("POST, OPTIONS");

    // HEAD on unknown route returns 404 with empty body
    const headUnknown = await worker.fetch(
      new Request("https://linxule.com/mcp/unknown", { method: "HEAD" }),
      env,
    );
    expect(headUnknown.status).toBe(404);
    expect(await headUnknown.text()).toBe("");

    const disabled = await worker.fetch(
      new Request("https://linxule.com/mcp", { method: "POST" }),
      { ...env, MCP_ENABLED: "0" },
    );
    expect(disabled.status).toBe(503);

    const wrongCt = await worker.fetch(
      new Request("https://linxule.com/mcp", {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: "{}",
      }),
      env,
    );
    expect(wrongCt.status).toBe(415);

    const tooLarge = await worker.fetch(
      new Request("https://linxule.com/mcp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pad: "x".repeat(20 * 1024) }),
      }),
      env,
    );
    expect(tooLarge.status).toBe(413);
  });

  test("normalizeCandidatePath strips #fragment and ?query while blocking off-origin, traversal, and /mcp recursion", () => {
    expect(normalizeCandidatePath("https://evil.example/index.md", ORIGIN)).toBeNull();
    expect(normalizeCandidatePath("/writing/../secrets", ORIGIN)).toBeNull();
    expect(normalizeCandidatePath("/%2e%2e/secrets", ORIGIN)).toBeNull();
    expect(normalizeCandidatePath("/mcp", ORIGIN)).toBeNull();
    expect(normalizeCandidatePath("/mcp/server-card", ORIGIN)).toBeNull();
    expect(normalizeCandidatePath("https://linxule.com/writing/foo/", ORIGIN)).toBe("/writing/foo");
    expect(normalizeCandidatePath("/writing/foo?bar=1", ORIGIN)).toBe("/writing/foo");
    expect(
      normalizeCandidatePath(
        "https://linxule.com/writing/loom-xviii-the-end-of-positivism#dfn-completion-authority",
        ORIGIN,
      ),
    ).toBe("/writing/loom-xviii-the-end-of-positivism");
    expect(normalizeCandidatePath("/concepts#token-duality", ORIGIN)).toBe("/concepts");
    expect(normalizeCandidatePath("/", ORIGIN)).toBe("/");
  });
});

describe("linxule-mcp Streamable HTTP JSON-RPC 2.0 protocol & retrieval", () => {
  test("handles initialize, 202 notifications, ping, tools, resources, prompts, _meta, and batches", async () => {
    const { worker, env, seenUrls } = makeFixtureWorker();

    // 1. initialize
    const initRes = await postRpc(worker, env, {
      jsonrpc: "2.0",
      id: 1,
      method: "initialize",
      params: {
        protocolVersion: "2025-11-25",
        capabilities: {},
        clientInfo: { name: "test-client", version: "1.0.0" },
      },
    });
    expect(initRes.status).toBe(200);
    expect(initRes.headers.get("mcp-protocol-version")).toBe("2025-11-25");
    const initJson = await initRes.json();
    expect(initJson.result.protocolVersion).toBe("2025-11-25");
    expect(initJson.result.serverInfo.name).toBe("linxule");

    // 2. notifications/initialized -> 202 Accepted with empty body
    const notifRes = await postRpc(worker, env, {
      jsonrpc: "2.0",
      method: "notifications/initialized",
    });
    expect(notifRes.status).toBe(202);
    expect(await notifRes.text()).toBe("");

    // 3. search_site across pages, concepts, publications, and projects
    const searchRes = await postRpc(worker, env, {
      jsonrpc: "2.0",
      id: 2,
      method: "tools/call",
      params: {
        name: "search_site",
        arguments: { query: "Completion Authority" },
      },
    });
    expect(searchRes.headers.get("x-linxule-build")).toBe(FIXTURE_BUILD_HEAD);
    const searchBody = await searchRes.json();
    expect(searchBody.result.isError).toBeUndefined();
    expect(searchBody.result._meta.build_head).toBe(FIXTURE_BUILD_HEAD);
    expect(searchBody.result.structuredContent.build_head).toBe(FIXTURE_BUILD_HEAD);
    const kinds = searchBody.result.structuredContent.matches.map((m) => m.kind);
    expect(kinds).toContain("concept");
    expect(kinds).toContain("page");

    // 4. list_site overview + collaborators
    const listRes = await postRpc(worker, env, {
      jsonrpc: "2.0",
      id: 3,
      method: "tools/call",
      params: {
        name: "list_site",
        arguments: { kind: "overview" },
      },
    });
    const listBody = await listRes.json();
    expect(listBody.result.structuredContent.counts.concepts).toBe(7);
    expect(listBody.result.structuredContent.counts.publications).toBe(1);
    expect(listBody.result.structuredContent.counts.projects).toBe(3);
    expect(listBody.result.structuredContent.counts.collaborators).toBe(6);

    const collabListRes = await postRpc(worker, env, {
      jsonrpc: "2.0",
      id: 31,
      method: "tools/call",
      params: {
        name: "list_site",
        arguments: { kind: "collaborators" },
      },
    });
    const collabListBody = await collabListRes.json();
    expect(collabListBody.result.structuredContent.total).toBe(6);
    expect(collabListBody.result.structuredContent.count).toBe(6);
    expect(collabListBody.result.structuredContent.offset).toBe(0);
    expect(collabListBody.result.structuredContent.items.map((c) => c.slug)).toEqual([
      "claude",
      "kimi",
      "kevin-corley",
      "carliss-y-baldwin",
      "erkko-autio",
      "ying-ying-hsieh",
    ]);

    // 5. read_page with #fragment stripping, SHA-256 verification, CONTENT_CHANGED guard, and portraits provenance
    const expectedEssayMd = FIXTURE_BODIES.get("/writing/loom-xviii-the-end-of-positivism.md");
    const expectedHash = createHash("sha256").update(expectedEssayMd).digest("hex");

    const readRes = await postRpc(worker, env, {
      jsonrpc: "2.0",
      id: 4,
      method: "tools/call",
      params: {
        name: "read_page",
        arguments: {
          path: "https://linxule.com/writing/loom-xviii-the-end-of-positivism#dfn-completion-authority",
          expected_sha256: expectedHash,
        },
      },
    });
    expect(readRes.headers.get("x-linxule-build")).toBe(FIXTURE_BUILD_HEAD);
    const readBody = await readRes.json();
    expect(readBody.result.structuredContent.ok).toBe(true);
    expect(readBody.result.structuredContent.sha256).toBe(expectedHash);
    expect(readBody.result.structuredContent.build_head).toBe(FIXTURE_BUILD_HEAD);
    expect(readBody.result.structuredContent.markdown).toBe(expectedEssayMd);

    const changedRes = await postRpc(worker, env, {
      jsonrpc: "2.0",
      id: 5,
      method: "tools/call",
      params: {
        name: "read_page",
        arguments: {
          path: "/writing/loom-xviii-the-end-of-positivism",
          expected_sha256: "0".repeat(64),
        },
      },
    });
    const changedBody = await changedRes.json();
    expect(changedBody.result.isError).toBe(true);
    expect(changedBody.result.structuredContent.code).toBe("CONTENT_CHANGED");

    const portraitRes = await postRpc(worker, env, {
      jsonrpc: "2.0",
      id: 6,
      method: "tools/call",
      params: {
        name: "read_page",
        arguments: { path: "/making/portraits/01-threshold" },
      },
    });
    const portraitBody = await portraitRes.json();
    expect(portraitBody.result.structuredContent.attribution).toContain("per-page provenance");

    // Unlisted path never triggers an arbitrary upstream fetch
    const beforeCount = seenUrls.length;
    const unlistedRes = await postRpc(worker, env, {
      jsonrpc: "2.0",
      id: 7,
      method: "tools/call",
      params: {
        name: "read_page",
        arguments: { path: "/private/not-in-index" },
      },
    });
    const unlistedBody = await unlistedRes.json();
    expect(unlistedBody.result.isError).toBe(true);
    expect(unlistedBody.result.structuredContent.code).toBe("NOT_FOUND");
    expect(seenUrls.length).toBe(beforeCount);

    // 6. resources/read across pages (with and without .md), site-index, and llms.txt — all with _meta
    const resRead = await postRpc(worker, env, {
      jsonrpc: "2.0",
      id: 8,
      method: "resources/read",
      params: { uri: "linxule://pages/papers/interpretive-orchestration" },
    });
    const resReadBody = await resRead.json();
    expect(resReadBody.result.contents[0].text).toContain("10.1177/14761270261448645");
    expect(resReadBody.result._meta).toEqual({
      sha256: createHash("sha256")
        .update(FIXTURE_BODIES.get("/papers/interpretive-orchestration.md"))
        .digest("hex"),
      canonical_url: "https://linxule.com/papers/interpretive-orchestration",
      build_head: FIXTURE_BUILD_HEAD,
    });

    const resReadWithMd = await postRpc(worker, env, {
      jsonrpc: "2.0",
      id: 81,
      method: "resources/read",
      params: { uri: "linxule://pages/writing/loom-xviii-the-end-of-positivism.md" },
    });
    const resReadWithMdBody = await resReadWithMd.json();
    expect(resReadWithMdBody.result.contents[0].text).toBe(expectedEssayMd);
    expect(resReadWithMdBody.result._meta.build_head).toBe(FIXTURE_BUILD_HEAD);

    const resSiteIndex = await postRpc(worker, env, {
      jsonrpc: "2.0",
      id: 82,
      method: "resources/read",
      params: { uri: "linxule://site-index" },
    });
    expect(resSiteIndex.headers.get("x-linxule-build")).toBe(FIXTURE_BUILD_HEAD);
    const resSiteIndexBody = await resSiteIndex.json();
    expect(resSiteIndexBody.result._meta).toEqual({
      sha256: createHash("sha256").update(FIXTURE_BODIES.get("/site-index.json")).digest("hex"),
      canonical_url: "https://linxule.com/site-index.json",
      build_head: FIXTURE_BUILD_HEAD,
    });

    const resLlms = await postRpc(worker, env, {
      jsonrpc: "2.0",
      id: 83,
      method: "resources/read",
      params: { uri: "linxule://llms.txt" },
    });
    const resLlmsBody = await resLlms.json();
    expect(resLlmsBody.result._meta).toEqual({
      sha256: createHash("sha256").update(FIXTURE_BODIES.get("/llms.txt")).digest("hex"),
      canonical_url: "https://linxule.com/llms.txt",
      build_head: FIXTURE_BUILD_HEAD,
    });

    // Invalid dot suffix in resources/read still rejected
    const resBadExt = await postRpc(worker, env, {
      jsonrpc: "2.0",
      id: 84,
      method: "resources/read",
      params: { uri: "linxule://pages/writing/foo.html" },
    });
    expect((await resBadExt.json()).error.code).toBe(-32602);

    // 7. prompts/get for both xule-research-navigation and enter-the-work
    const promptOk = await postRpc(worker, env, {
      jsonrpc: "2.0",
      id: 9,
      method: "prompts/get",
      params: { name: "xule-research-navigation" },
    });
    const promptOkBody = await promptOk.json();
    expect(promptOkBody.result.messages[0].content.text).toContain("# Xule Research Navigation");
    expect(promptOkBody.result._meta.build_head).toBe(FIXTURE_BUILD_HEAD);

    const enterRes = await postRpc(worker, env, {
      jsonrpc: "2.0",
      id: 91,
      method: "prompts/get",
      params: { name: "enter-the-work" },
    });
    expect(enterRes.headers.get("x-linxule-build")).toBe(FIXTURE_BUILD_HEAD);
    const enterBody = await enterRes.json();
    const enterText = enterBody.result.messages[0].content.text;
    expect(enterText).toContain("What becomes impossible to see");
    expect(enterText).toContain("## Anchored Concepts (4)");
    expect(enterText).toContain("## Scholarship-Grounded Concepts (2)");
    expect(enterText).toContain("## Forming Vocabulary (1 — Still in Motion)");
    expect(enterText).toContain("Token Duality");
    expect(enterText).toContain("Artificial Organizing");
    expect(enterText).toContain("Cross-Surface Reading Trails");
    // Human co-authors never leak into "named AI collaborators (...)"
    expect(enterText).toContain(
      "Human co-authors (Kevin Corley, Carliss Y. Baldwin, Erkko Autio, Ying-Ying Hsieh) and named AI collaborators (Claude, Kimi)",
    );
    expect(enterText).toContain("1 formal paper landing · 3 catalogued builds.");
    expect(enterText).not.toContain("landing(s)");
    expect(enterText).not.toContain("build(s)");
    expect(enterBody.result._meta.build_head).toBe(FIXTURE_BUILD_HEAD);
    expect(enterBody.result._meta.sha256).toMatch(/^[0-9a-f]{64}$/);

    const promptBadArgs = await postRpc(worker, env, {
      jsonrpc: "2.0",
      id: 10,
      method: "prompts/get",
      params: { name: "xule-research-navigation", arguments: { extra: "nope" } },
    });
    const promptBadArgsBody = await promptBadArgs.json();
    expect(promptBadArgsBody.error.code).toBe(-32602);

    // 8. JSON-RPC batch mixing notification and request
    const batchRes = await postRpc(worker, env, [
      { jsonrpc: "2.0", method: "notifications/cancelled", params: { requestId: 99 } },
      { jsonrpc: "2.0", id: 11, method: "ping" },
    ]);
    expect(batchRes.status).toBe(200);
    const batchBody = await batchRes.json();
    expect(batchBody).toEqual([{ jsonrpc: "2.0", id: 11, result: {} }]);
  });

  test("word-boundary, stemming, wildcard, CJK, and collaborator search retrieval works with zero false positives", async () => {
    const { worker, env } = makeFixtureWorker();

    const search = async (args) => {
      const res = await postRpc(worker, env, {
        jsonrpc: "2.0",
        id: 1,
        method: "tools/call",
        params: { name: "search_site", arguments: args },
      });
      return (await res.json()).result.structuredContent.matches;
    };

    // 1. SIGNA hits SIGNA project and SIGNA Framework concept — NEVER "signal bloom" or "Cognitive Signatures"
    const signaMatches = await search({ query: "SIGNA" });
    expect(signaMatches.some((m) => m.kind === "project" && m.name === "SIGNA" && m.url === null)).toBe(true);
    expect(signaMatches.some((m) => m.kind === "concept" && m.term === "SIGNA Framework")).toBe(true);
    expect(signaMatches.some((m) => m.title === "signal bloom")).toBe(false);
    expect(signaMatches.some((m) => m.term === "Cognitive Signatures")).toBe(false);

    // 2. Token Duality hits scholarship-grounded concept
    const tokenMatches = await search({ query: "Token Duality" });
    expect(
      tokenMatches.some(
        (m) => m.kind === "concept" && m.term === "Token Duality" && m.status === "grounded",
      ),
    ).toBe(true);

    // 3. daogov hits unlinked project #1 (ahead of /builds page)
    const daogovMatches = await search({ query: "daogov" });
    expect(daogovMatches[0]).toEqual(
      expect.objectContaining({
        kind: "project",
        name: "daogov",
        url: null,
        read_path: "/builds",
      }),
    );

    // 4. CJK search "林徐乐" hits /cv-zh and /cv
    const zhMatches = await search({ query: "林徐乐" });
    expect(zhMatches.some((m) => m.kind === "page" && m.path === "/cv-zh")).toBe(true);
    expect(zhMatches.some((m) => m.kind === "page" && m.path === "/cv")).toBe(true);

    // 5. "CV" hits /cv and /cv-zh — NEVER "Writing in Markdown" (which contains "archive" / "discover" / "recover")
    const cvMatches = await search({ query: "CV" });
    expect(cvMatches.some((m) => m.kind === "page" && m.path === "/cv")).toBe(true);
    expect(cvMatches.some((m) => m.path === "/writing/writing-in-markdown")).toBe(false);

    // 6. Stemming & wildcard: "positivist" and "positivis*" hit LOOM XVIII ("Positivism")
    const stemMatches = await search({ query: "positivist" });
    expect(stemMatches.some((m) => m.path === "/writing/loom-xviii-the-end-of-positivism")).toBe(true);
    const wildcardMatches = await search({ query: "positivis*" });
    expect(wildcardMatches.some((m) => m.path === "/writing/loom-xviii-the-end-of-positivism")).toBe(true);

    // 6b. Artificial Organizing ranks #1 as forming concept
    const aoMatches = await search({ query: "Artificial Organizing" });
    expect(aoMatches[0]).toEqual(
      expect.objectContaining({
        kind: "concept",
        term: "Artificial Organizing",
        status: "forming",
      }),
    );

    // 7. Collaborator filtering in search_site and list_site
    const claudePages = await search({ query: "doorway", collaborator: "Claude" });
    expect(claudePages.map((m) => m.path)).toEqual(["/making/portraits/01-threshold"]);
    const wrongCollab = await search({ query: "doorway", collaborator: "Kimi" });
    expect(wrongCollab).toEqual([]);

    const listClaudePagesRes = await postRpc(worker, env, {
      jsonrpc: "2.0",
      id: 2,
      method: "tools/call",
      params: { name: "list_site", arguments: { kind: "pages", collaborator: "Claude" } },
    });
    const listClaudePaths = (await listClaudePagesRes.json()).result.structuredContent.items.map(
      (i) => i.path,
    );
    expect(listClaudePaths).toContain("/writing/loom-xviii-the-end-of-positivism");
    expect(listClaudePaths).toContain("/making/portraits/01-threshold");
    expect(listClaudePaths).not.toContain("/making/artifacts/signal-bloom");
  });

  test("deduplicates concurrent site-index fetches, caches hot static files, avoids duplicate Accept, and bounds oversized origin reads", async () => {
    let indexFetches = 0;
    const { worker, env, seenRequests } = makeFixtureWorker({
      onFetch: async (url) => {
        if (url.pathname === "/site-index.json") {
          indexFetches += 1;
          await new Promise((r) => setTimeout(r, 15));
        }
        return null;
      },
    });

    // Concurrent cold-start requests share one /site-index.json fetch
    await Promise.all([
      postRpc(worker, env, {
        jsonrpc: "2.0",
        id: 1,
        method: "tools/call",
        params: { name: "search_site", arguments: { query: "SIGNA" } },
      }),
      postRpc(worker, env, {
        jsonrpc: "2.0",
        id: 2,
        method: "tools/call",
        params: { name: "list_site", arguments: { kind: "overview" } },
      }),
    ]);
    expect(indexFetches).toBe(1);

    // Reading /llms.txt twice fetches origin once and sends clean `Accept: text/plain` (no duplicate)
    await postRpc(worker, env, {
      jsonrpc: "2.0",
      id: 3,
      method: "resources/read",
      params: { uri: "linxule://llms.txt" },
    });
    await postRpc(worker, env, {
      jsonrpc: "2.0",
      id: 4,
      method: "resources/read",
      params: { uri: "linxule://llms.txt" },
    });
    const llmsReqs = seenRequests.filter((r) => r.url.endsWith("/llms.txt"));
    expect(llmsReqs.length).toBe(1);
    expect(llmsReqs[0].headers.Accept).toBe("text/plain");

    // Stream-bounded fetchOriginBytes rejects oversized upstream response without full buffering
    const bigChunk = new Uint8Array(64 * 1024);
    let chunksPulled = 0;
    const bigStream = new ReadableStream({
      pull(controller) {
        chunksPulled += 1;
        if (chunksPulled <= 10) controller.enqueue(bigChunk);
        else controller.close();
      },
    });
    const oversized = makeFixtureWorker({
      extraBodies: new Map([
        ["/thinking.md", new Response(bigStream, { status: 200 })],
      ]),
    });
    const tooBigRes = await postRpc(oversized.worker, oversized.env, {
      jsonrpc: "2.0",
      id: 5,
      method: "tools/call",
      params: { name: "read_page", arguments: { path: "/thinking" } },
    });
    const tooBigBody = await tooBigRes.json();
    expect(tooBigBody.result.isError).toBe(true);
    expect(tooBigBody.result.structuredContent.code).toBe("PAGE_TOO_LARGE");
    // Content-Length header over limit is rejected immediately and cancels the stream without reading
    let bodyCancelled = false;
    let bodyPulled = 0;
    const headerOversized = makeFixtureWorker({
      extraBodies: new Map([
        [
          "/thinking.md",
          new Response(
            new ReadableStream({
              pull(controller) {
                bodyPulled += 1;
                controller.enqueue(new Uint8Array(1024));
              },
              cancel() {
                bodyCancelled = true;
              },
            }),
            { status: 200, headers: { "Content-Length": String(512 * 1024) } },
          ),
        ],
      ]),
    });
    const clTooBig = await postRpc(headerOversized.worker, headerOversized.env, {
      jsonrpc: "2.0",
      id: 6,
      method: "tools/call",
      params: { name: "read_page", arguments: { path: "/thinking" } },
    });
    expect((await clTooBig.json()).result.structuredContent.code).toBe("PAGE_TOO_LARGE");
    expect(bodyCancelled).toBe(true);
    expect(bodyPulled).toBeLessThanOrEqual(1);
    expect(chunksPulled).toBeLessThan(10);
  });

  test("strictly validates MCP-Protocol-Version header and CORS preflight headers", async () => {
    const { worker, env } = makeFixtureWorker();

    const optionsRes = await worker.fetch(
      new Request("https://linxule.com/mcp", { method: "OPTIONS" }),
      env,
    );
    expect(optionsRes.status).toBe(204);
    expect(optionsRes.headers.get("access-control-allow-methods")).toBe("POST, OPTIONS");
    const allowHeaders = optionsRes.headers.get("access-control-allow-headers") || "";
    expect(allowHeaders).toContain("Mcp-Method");
    expect(allowHeaders).toContain("Mcp-Name");
    expect(allowHeaders).toContain("MCP-Protocol-Version");

    const defaultProtoRes = await postRpc(worker, env, {
      jsonrpc: "2.0",
      id: 1,
      method: "ping",
    });
    expect(defaultProtoRes.status).toBe(200);
    expect(defaultProtoRes.headers.get("mcp-protocol-version")).toBe("2025-11-25");

    for (const supported of ["2026-07-28", "2025-11-25", "2025-03-26"]) {
      const okRes = await postRpc(
        worker,
        env,
        { jsonrpc: "2.0", id: 1, method: "ping" },
        { "MCP-Protocol-Version": supported },
      );
      expect(okRes.status).toBe(200);
      expect(okRes.headers.get("mcp-protocol-version")).toBe(supported);
    }

    const badProtoRes = await postRpc(
      worker,
      env,
      { jsonrpc: "2.0", id: 1, method: "ping" },
      { "MCP-Protocol-Version": "1999-01-01" },
    );
    expect(badProtoRes.status).toBe(400);
    expect(await badProtoRes.text()).toContain("Unsupported MCP-Protocol-Version");
  });

  test("strictly validates JSON-RPC 2.0 id types and object params across all MCP methods", async () => {
    const { worker, env } = makeFixtureWorker();

    for (const badId of [true, false, {}, [1]]) {
      const res = await postRpc(worker, env, {
        jsonrpc: "2.0",
        id: badId,
        method: "ping",
      });
      expect(res.status).toBe(200);
      expect(await res.json()).toEqual({
        jsonrpc: "2.0",
        id: null,
        error: {
          code: -32600,
          message: "Invalid Request: id must be string, number, or null",
        },
      });
    }

    for (const goodId of [null, "req-42", 0, 42]) {
      const res = await postRpc(worker, env, {
        jsonrpc: "2.0",
        id: goodId,
        method: "ping",
      });
      expect(res.status).toBe(200);
      expect(await res.json()).toEqual({ jsonrpc: "2.0", id: goodId, result: {} });
    }

    const mcpMethods = [
      "initialize",
      "ping",
      "tools/list",
      "tools/call",
      "resources/list",
      "resources/templates/list",
      "resources/read",
      "prompts/list",
      "prompts/get",
    ];
    for (const method of mcpMethods) {
      for (const badParams of [[], "invalid", 123, null, true]) {
        const res = await postRpc(worker, env, {
          jsonrpc: "2.0",
          id: `bad-${method}`,
          method,
          params: badParams,
        });
        expect(res.status).toBe(200);
        const body = await res.json();
        expect(body).toEqual({
          jsonrpc: "2.0",
          id: `bad-${method}`,
          error: {
            code: -32602,
            message: "Invalid params: params must be an object",
          },
        });
      }
    }
  });

  test("search_site filters pages on section when kind=all/pages, and ignores section on explicit non-page kinds", async () => {
    const { worker, env } = makeFixtureWorker();

    const allWithSection = await postRpc(worker, env, {
      jsonrpc: "2.0",
      id: 1,
      method: "tools/call",
      params: {
        name: "search_site",
        arguments: { query: "Completion Authority", kind: "all", section: "writing" },
      },
    });
    const allWithSectionBody = await allWithSection.json();
    expect(allWithSectionBody.result.structuredContent.section).toBe("writing");
    expect(allWithSectionBody.result.structuredContent.matches.map((m) => m.kind)).toEqual(["page"]);

    const conceptsWithSection = await postRpc(worker, env, {
      jsonrpc: "2.0",
      id: 2,
      method: "tools/call",
      params: {
        name: "search_site",
        arguments: { query: "Completion Authority", kind: "concepts", section: "writing" },
      },
    });
    const conceptsMatches = (await conceptsWithSection.json()).result.structuredContent.matches;
    expect(conceptsMatches.map((m) => m.kind)).toEqual(["concept"]);

    const pubsWithSection = await postRpc(worker, env, {
      jsonrpc: "2.0",
      id: 3,
      method: "tools/call",
      params: {
        name: "search_site",
        arguments: { query: "Interpretive Orchestration", kind: "publications", section: "writing" },
      },
    });
    const pubsMatches = (await pubsWithSection.json()).result.structuredContent.matches;
    expect(pubsMatches.map((m) => m.kind)).toEqual(["publication"]);

    const projectsWithSection = await postRpc(worker, env, {
      jsonrpc: "2.0",
      id: 4,
      method: "tools/call",
      params: {
        name: "search_site",
        arguments: { query: "Research Memex", kind: "projects", section: "writing" },
      },
    });
    const projectsMatches = (await projectsWithSection.json()).result.structuredContent.matches;
    expect(projectsMatches.length).toBeGreaterThanOrEqual(1);
    expect(projectsMatches[0].name).toBe("Research Memex");
    expect(projectsMatches.every((m) => m.kind === "project")).toBe(true);
  });

  test("v2.0.1 fixes: collaborator kind preservation, stop-words, acronym plurals, bilingual Chinese aliases, making/connect sections, and list_site offset pagination", async () => {
    const { worker, env } = makeFixtureWorker();

    const callTool = async (name, args) => {
      const res = await postRpc(worker, env, {
        jsonrpc: "2.0",
        id: 1,
        method: "tools/call",
        params: { name, arguments: args },
      });
      return { res, body: await res.json() };
    };

    // 1. Collaborator discriminator `kind: "collaborator"` is preserved alongside `collaboratorKind`
    const { body: claudeSearch } = await callTool("search_site", {
      query: "Claude",
      kind: "collaborators",
    });
    expect(claudeSearch.result.structuredContent.matches[0]).toEqual(
      expect.objectContaining({
        kind: "collaborator",
        collaboratorKind: "ai",
        slug: "claude",
      }),
    );

    const { body: erkkoSearch } = await callTool("search_site", {
      query: "Erkko Autio",
      kind: "collaborators",
    });
    expect(erkkoSearch.result.structuredContent.matches[0]).toEqual(
      expect.objectContaining({
        kind: "collaborator",
        collaboratorKind: "human",
        name: "Erkko Autio",
      }),
    );

    // 2. Stop-word filtering: "what is the Polanyi Inversion" hits Polanyi Inversion concept & essay, NOT "What I'm Thinking"
    const { body: nlPolanyi } = await callTool("search_site", {
      query: "what is the Polanyi Inversion",
    });
    const nlMatches = nlPolanyi.result.structuredContent.matches;
    expect(nlMatches[0]).toEqual(
      expect.objectContaining({ kind: "concept", term: "Polanyi Inversion" }),
    );
    expect(
      nlMatches.some(
        (m) => m.kind === "page" && m.path === "/writing/loom-xvii-the-polanyi-inversion",
      ),
    ).toBe(true);
    expect(nlMatches.some((m) => m.path === "/writing/what-i-am-thinking-2026-01")).toBe(false);

    // All-stop-word query still falls back safely instead of returning empty or throwing
    const { body: allStop } = await callTool("search_site", { query: "what is the" });
    expect(allStop.result.structuredContent.ok).toBe(true);
    expect(allStop.result.structuredContent.matches.length).toBeGreaterThan(0);

    // 3. Mixed-case & lowercase acronym plural normalization (DAOs <-> DAO, LLMs <-> LLM)
    for (const daoQuery of ["DAO", "DAOs", "daos", "dao"]) {
      const { body } = await callTool("search_site", { query: daoQuery });
      const matches = body.result.structuredContent.matches;
      expect(
        matches.some((m) => m.kind === "page" && m.path === "/writing/dao-governance-resources"),
        `query "${daoQuery}" should hit DAO page`,
      ).toBe(true);
      expect(
        matches.some((m) => m.kind === "concept" && m.term === "Token Duality"),
        `query "${daoQuery}" should hit DAOs concept`,
      ).toBe(true);
    }

    for (const llmQuery of ["LLM", "LLMs", "llms", "llm"]) {
      const { body } = await callTool("search_site", { query: llmQuery });
      const matches = body.result.structuredContent.matches;
      expect(
        matches.some((m) => m.kind === "page" && m.path === "/writing/dao-governance-resources"),
        `query "${llmQuery}" should hit LLM page`,
      ).toBe(true);
      expect(
        matches.some((m) => m.kind === "page" && m.path === "/writing/loom-xvii-the-polanyi-inversion"),
        `query "${llmQuery}" should hit LLMs page`,
      ).toBe(true);
    }

    // 4. Bilingual Chinese concept queries hit English concepts, essays, and publications
    const { body: zhPolanyi } = await callTool("search_site", { query: "波兰尼反转" });
    const zhPolanyiMatches = zhPolanyi.result.structuredContent.matches;
    expect(zhPolanyiMatches[0]).toEqual(
      expect.objectContaining({ kind: "concept", term: "Polanyi Inversion" }),
    );
    expect(
      zhPolanyiMatches.some(
        (m) => m.kind === "page" && m.path === "/writing/loom-xvii-the-polanyi-inversion",
      ),
    ).toBe(true);

    for (const zhIo of ["诠释性编排", "诠释编排"]) {
      const { body } = await callTool("search_site", { query: zhIo });
      const matches = body.result.structuredContent.matches;
      expect(
        matches.some((m) => m.kind === "concept" && m.term === "Interpretive Orchestration"),
        `query "${zhIo}" should hit Interpretive Orchestration concept`,
      ).toBe(true);
      expect(
        matches.some((m) => m.kind === "publication" && m.title.includes("Interpretive Orchestration")),
        `query "${zhIo}" should hit Interpretive Orchestration publication`,
      ).toBe(true);
    }

    // 5. section="making" expands to ["making", "portraits", "artifacts"]; /connect accepted under "connect" and "builds"
    const { body: makingSearch } = await callTool("search_site", {
      query: "doorway",
      section: "making",
    });
    expect(makingSearch.result.structuredContent.matches.map((m) => m.path)).toEqual([
      "/making/portraits/01-threshold",
    ]);

    const { body: makingList } = await callTool("list_site", {
      kind: "pages",
      section: "making",
    });
    const makingPaths = makingList.result.structuredContent.items.map((i) => i.path);
    expect(makingPaths).toEqual([
      "/making",
      "/making/portraits/01-threshold",
      "/making/artifacts/signal-bloom",
    ]);
    expect(makingList.result.structuredContent.total).toBe(3);
    expect(makingList.result.structuredContent.count).toBe(3);

    const { body: connectSectionList } = await callTool("list_site", {
      kind: "pages",
      section: "connect",
    });
    expect(connectSectionList.result.structuredContent.items.map((i) => i.path)).toEqual(["/connect"]);

    const { body: buildsSectionList } = await callTool("list_site", {
      kind: "pages",
      section: "builds",
    });
    expect(buildsSectionList.result.structuredContent.items.map((i) => i.path)).toEqual([
      "/connect",
      "/builds",
    ]);

    const { body: readConnect } = await callTool("read_page", { path: "/connect" });
    expect(readConnect.result.structuredContent.section).toBe("connect");

    // 6. list_site offset pagination (including >100 pages beyond limit=100)
    const { body: page1 } = await callTool("list_site", {
      kind: "pages",
      limit: 4,
      offset: 0,
    });
    const { body: page2 } = await callTool("list_site", {
      kind: "pages",
      limit: 4,
      offset: 4,
    });
    expect(page1.result.structuredContent.total).toBe(FIXTURE_INDEX.pages.length);
    expect(page1.result.structuredContent.count).toBe(4);
    expect(page1.result.structuredContent.offset).toBe(0);
    expect(page2.result.structuredContent.count).toBe(4);
    expect(page2.result.structuredContent.offset).toBe(4);
    expect(page1.result.structuredContent.items[0].path).not.toBe(
      page2.result.structuredContent.items[0].path,
    );

    // Invalid offset rejected with -32602
    const { body: badOffset } = await callTool("list_site", {
      kind: "pages",
      offset: -1,
    });
    expect(badOffset.error.code).toBe(-32602);

    // 136-page archive pagination beyond limit=100
    const manyPages = Array.from({ length: 136 }, (_, idx) => ({
      url: `/writing/essay-${idx + 1}`,
      url_md: `/writing/essay-${idx + 1}.md`,
      title: `Essay ${idx + 1}`,
      section: "writing",
    }));
    const bigIndex = { ...FIXTURE_INDEX, pages: manyPages };
    const big = makeFixtureWorker({
      extraBodies: new Map([["/site-index.json", JSON.stringify(bigIndex)]]),
    });
    const tailRes = await postRpc(big.worker, big.env, {
      jsonrpc: "2.0",
      id: 99,
      method: "tools/call",
      params: { name: "list_site", arguments: { kind: "pages", limit: 100, offset: 100 } },
    });
    const tailBody = (await tailRes.json()).result.structuredContent;
    expect(tailBody.total).toBe(136);
    expect(tailBody.offset).toBe(100);
    expect(tailBody.count).toBe(36);
    expect(tailBody.items[0].path).toBe("/writing/essay-101");
    expect(tailBody.items[35].path).toBe("/writing/essay-136");

    // 7. enter-the-work also accepts status: "established" alongside "grounded" and handles plural paper landings
    const establishedIndex = {
      ...FIXTURE_INDEX,
      concepts: FIXTURE_INDEX.concepts.map((c) =>
        c.status === "grounded" ? { ...c, status: "established" } : c,
      ),
      publications: [
        ...FIXTURE_INDEX.publications,
        {
          title: "Cognitio Emergens",
          authors: ["Xule Lin"],
          year: 2025,
          venue: "arXiv",
          url: "https://arxiv.org/abs/2505.03105",
        },
      ],
      projects: [FIXTURE_INDEX.projects[0]],
    };
    const estWorker = makeFixtureWorker({
      extraBodies: new Map([["/site-index.json", JSON.stringify(establishedIndex)]]),
    });
    const estPromptRes = await postRpc(estWorker.worker, estWorker.env, {
      jsonrpc: "2.0",
      id: 100,
      method: "prompts/get",
      params: { name: "enter-the-work" },
    });
    const estText = (await estPromptRes.json()).result.messages[0].content.text;
    expect(estText).toContain("## Scholarship-Grounded Concepts (2)");
    expect(estText).toContain("2 formal paper landings · 1 catalogued build.");
  });

  test("every STATIC_MARKDOWN_TWINS mdPath exists as a non-empty file in _site when freshly built", () => {
    const siteDir = fileURLToPath(new URL("../_site", import.meta.url));
    const manifestPath = path.join(siteDir, ".build-manifest.json");
    const metadataPath = fileURLToPath(new URL("./metadata.mjs", import.meta.url));
    if (!existsSync(siteDir)) return;
    // Skip disk check only when _site predates the current metadata.mjs (pre-rebuild parallel lane).
    if (existsSync(manifestPath) && statSync(manifestPath).mtimeMs < statSync(metadataPath).mtimeMs) {
      return;
    }

    for (const [canonicalPath, entry] of Object.entries(STATIC_MARKDOWN_TWINS)) {
      const diskPath = path.join(siteDir, entry.mdPath.replace(/^\//, ""));
      expect(existsSync(diskPath), `${canonicalPath} -> ${diskPath} missing`).toBe(true);
      expect(statSync(diskPath).size).toBeGreaterThan(0);
    }
  });

  test("prefers env.SITE service binding for https://linxule.com and falls back to fetchImpl when unbound or custom SITE_ORIGIN", async () => {
    const siteBindingRequests = [];
    const siteBinding = {
      async fetch(req) {
        const url = new URL(req.url);
        siteBindingRequests.push({
          method: req.method,
          url: url.toString(),
          accept: req.headers.get("accept"),
          userAgent: req.headers.get("user-agent"),
        });
        const body = FIXTURE_BODIES.get(url.pathname);
        if (body === undefined) return new Response("Not found", { status: 404 });
        return new Response(body, {
          status: 200,
          headers: {
            "Content-Type": url.pathname.endsWith(".json")
              ? "application/json; charset=utf-8"
              : "text/markdown; charset=utf-8",
          },
        });
      },
    };

    // 1. When env.SITE is bound and SITE_ORIGIN === "https://linxule.com", fetchImpl is NOT called
    const externalCallsWhenBound = [];
    const boundWorker = createWorker({
      fetchImpl: async (input) => {
        externalCallsWhenBound.push(String(input));
        throw new Error(`fetchImpl should not be called when env.SITE is bound (got ${String(input)})`);
      },
    });
    const boundEnv = {
      ALLOWED_HOSTS: "linxule.com",
      SITE_ORIGIN: ORIGIN,
      MCP_ENABLED: "1",
      SITE: siteBinding,
    };

    const cardRes = await boundWorker.fetch(
      new Request("https://linxule.com/mcp/server-card", { method: "GET" }),
      boundEnv,
    );
    expect(cardRes.status).toBe(200);
    expect(cardRes.headers.get("x-linxule-build")).toBe(FIXTURE_BUILD_HEAD);

    const searchRes = await postRpc(boundWorker, boundEnv, {
      jsonrpc: "2.0",
      id: 1,
      method: "tools/call",
      params: { name: "search_site", arguments: { query: "Polanyi Inversion" } },
    });
    const searchBody = await searchRes.json();
    expect(searchBody.result.structuredContent.ok).toBe(true);
    expect(searchBody.result.structuredContent.matches.length).toBeGreaterThan(0);

    const readRes = await postRpc(boundWorker, boundEnv, {
      jsonrpc: "2.0",
      id: 2,
      method: "tools/call",
      params: { name: "read_page", arguments: { path: "/cv" } },
    });
    const readBody = await readRes.json();
    expect(readBody.result.structuredContent.ok).toBe(true);
    expect(readBody.result.structuredContent.markdown).toBe(FIXTURE_BODIES.get("/cv.md"));

    expect(externalCallsWhenBound).toHaveLength(0);
    expect(siteBindingRequests.map((r) => new URL(r.url).pathname)).toEqual([
      "/.build-manifest.json",
      "/site-index.json",
      "/cv.md",
    ]);
    expect(siteBindingRequests.every((r) => r.method === "GET")).toBe(true);
    expect(siteBindingRequests.every((r) => r.userAgent?.startsWith("linxule-mcp/"))).toBe(true);

    // 2. When env.SITE is absent, fetchImpl is used as before
    const unbound = makeFixtureWorker();
    const unboundRes = await postRpc(unbound.worker, unbound.env, {
      jsonrpc: "2.0",
      id: 3,
      method: "tools/call",
      params: { name: "read_page", arguments: { path: "/cv" } },
    });
    expect((await unboundRes.json()).result.structuredContent.ok).toBe(true);
    expect(unbound.seenUrls).toContain("https://linxule.com/cv.md");

    // 3. When SITE_ORIGIN is overridden to a non-production origin, fetchImpl is used even if env.SITE is present
    const customOrigin = "https://linxule-com-preview.linxule.workers.dev";
    const customExternalUrls = [];
    let bindingCalledForCustom = false;
    const customWorker = createWorker({
      fetchImpl: async (input) => {
        const url = new URL(typeof input === "string" ? input : input.url);
        customExternalUrls.push(url.toString());
        const body = FIXTURE_BODIES.get(url.pathname);
        if (body === undefined) return new Response("Not found", { status: 404 });
        return new Response(body, { status: 200 });
      },
    });
    const customEnv = {
      ALLOWED_HOSTS: "linxule.com",
      SITE_ORIGIN: customOrigin,
      MCP_ENABLED: "1",
      SITE: {
        async fetch() {
          bindingCalledForCustom = true;
          throw new Error("SITE binding must not be used for custom SITE_ORIGIN");
        },
      },
    };
    const customRes = await postRpc(customWorker, customEnv, {
      jsonrpc: "2.0",
      id: 4,
      method: "tools/call",
      params: { name: "read_page", arguments: { path: "/cv" } },
    });
    expect((await customRes.json()).result.structuredContent.ok).toBe(true);
    expect(bindingCalledForCustom).toBe(false);
    expect(customExternalUrls).toContain(`${customOrigin}/cv.md`);

    // 4. mcp/wrangler.jsonc declares SITE service binding, observability, source maps, and empty local services
    const mcpWranglerRaw = readFileSync(new URL("./wrangler.jsonc", import.meta.url), "utf8")
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/^\s*\/\/.*$/gm, "");
    const mcpWrangler = JSON.parse(mcpWranglerRaw);
    expect(mcpWrangler.compatibility_date).toBe("2026-11-22");
    expect(mcpWrangler.upload_source_maps).toBe(true);
    expect(mcpWrangler.observability).toEqual({ enabled: true, traces: { enabled: true } });
    expect(mcpWrangler.services).toEqual([{ binding: "SITE", service: "linxule-com" }]);
    expect(mcpWrangler.env.local.services).toEqual([]);
  });
});
