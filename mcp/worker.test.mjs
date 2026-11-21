import { createHash } from "node:crypto";
import { describe, expect, test } from "bun:test";
import { MCP_CARD_DESCRIPTION, buildMcpServerCard } from "./metadata.mjs";
import { allowedHost, createWorker, normalizeCandidatePath } from "./worker.mjs";

const ORIGIN = "https://linxule.com";

const FIXTURE_INDEX = {
  version: "2026-11-21",
  site: {
    title: "Xule Lin",
    url: ORIGIN,
    author: "Xule Lin",
    description: "What becomes impossible to see when algorithms enter organizational life — not as tools.",
  },
  pages: [
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
      summary: "A doorway in winter light.",
    },
  ],
  concepts: [
    {
      term: "Completion Authority",
      definition: "Who holds the right to declare an open-ended inquiry finished when no external whistle exists.",
      url: "/writing/loom-xviii-the-end-of-positivism#completion-authority",
      canonicalEssay: "LOOM XVIII: It's the End of Positivism as We Know It (and I Feel Fine)",
      authors: ["Xule Lin", "Kevin Corley"],
      date: "2026-06-24",
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
      license: "CC BY 4.0",
      coins: "Interpretive Orchestration",
      onSite: "/papers/interpretive-orchestration/",
    },
  ],
  projects: [
    {
      name: "Research Memex",
      url: "https://research-memex.org",
      description: "Field handbook for human-AI research collaboration.",
      license: "MIT",
      group: "Research Infrastructure",
    },
  ],
};

const FIXTURE_BODIES = new Map([
  ["/site-index.json", JSON.stringify(FIXTURE_INDEX)],
  ["/index.md", "# Xule Lin — linxule.com\n\nHomepage overview."],
  ["/thinking.md", "# Thinking\n\nCore question and orientations."],
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
]);

function makeFixtureWorker() {
  const seenUrls = [];
  const fetchImpl = async (input) => {
    const url = new URL(typeof input === "string" ? input : input.url);
    seenUrls.push(url.toString());
    if (url.origin !== ORIGIN) {
      throw new Error(`Unexpected off-origin fetch: ${url.toString()}`);
    }
    const body = FIXTURE_BODIES.get(url.pathname);
    if (body === undefined) {
      return new Response("Not found", { status: 404 });
    }
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
    seenUrls,
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

describe("linxule-mcp metadata and boundary", () => {
  test("server card satisfies dual SEP-2127 and SEP-1649 constraints", () => {
    const card = buildMcpServerCard(ORIGIN);
    expect(MCP_CARD_DESCRIPTION.length).toBeLessThanOrEqual(100);
    expect(card.description.length).toBeLessThanOrEqual(100);
    expect(card.name).toBe("com.linxule/mcp");
    expect(card.serverInfo).toEqual({
      name: "linxule",
      title: "Xule Lin",
      version: "1.0.0",
    });
    expect(card.url).toBe("https://linxule.com/mcp");
    expect(card.remotes[0].url).toBe("https://linxule.com/mcp");
    expect(card.transport).toEqual({ type: "streamable-http", endpoint: "/mcp" });
    expect(card.authentication).toEqual({ required: false });
    expect(card.tools.map((t) => t.name)).toEqual(["search_site", "list_site", "read_page"]);
    expect(card.prompts.map((p) => p.name)).toEqual(["xule-research-navigation"]);
  });

  test("GET /mcp/server-card and OPTIONS return open CORS and SEP-2127 media type", async () => {
    const { worker, env } = makeFixtureWorker();

    const optionsRes = await worker.fetch(
      new Request("https://linxule.com/mcp/server-card", { method: "OPTIONS" }),
      env,
    );
    expect(optionsRes.status).toBe(204);
    expect(optionsRes.headers.get("access-control-allow-origin")).toBe("*");

    const cardRes = await worker.fetch(
      new Request("https://linxule.com/mcp/server-card", { method: "GET" }),
      env,
    );
    expect(cardRes.status).toBe(200);
    expect(cardRes.headers.get("content-type")).toContain("application/mcp-server-card+json");
    expect(cardRes.headers.get("access-control-allow-origin")).toBe("*");
    const parsed = await cardRes.json();
    expect(parsed).toEqual(buildMcpServerCard(ORIGIN));
  });

  test("enforces host, HTTPS, method, kill-switch, content-type, and body size bounds", async () => {
    const { worker, env } = makeFixtureWorker();

    expect(
      allowedHost(new Request("http://linxule.com/mcp"), { ALLOWED_HOSTS: "linxule.com" }),
    ).toBe(false);
    expect(
      allowedHost(new Request("https://evil.example/mcp"), { ALLOWED_HOSTS: "linxule.com" }),
    ).toBe(false);

    const getRes = await worker.fetch(new Request("https://linxule.com/mcp", { method: "GET" }), env);
    expect(getRes.status).toBe(405);
    expect(getRes.headers.get("allow")).toContain("POST");
    expect(getRes.headers.get("access-control-allow-origin")).toBe("*");

    const unknownSubpath = await worker.fetch(
      new Request("https://linxule.com/mcp/unknown", { method: "GET" }),
      env,
    );
    expect(unknownSubpath.status).toBe(404);

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

  test("normalizeCandidatePath blocks off-origin URLs, traversal, query strings, and /mcp recursion", () => {
    expect(normalizeCandidatePath("https://evil.example/index.md", ORIGIN)).toBeNull();
    expect(normalizeCandidatePath("/writing/../secrets", ORIGIN)).toBeNull();
    expect(normalizeCandidatePath("/%2e%2e/secrets", ORIGIN)).toBeNull();
    expect(normalizeCandidatePath("/writing/foo?bar=1", ORIGIN)).toBeNull();
    expect(normalizeCandidatePath("/mcp", ORIGIN)).toBeNull();
    expect(normalizeCandidatePath("/mcp/server-card", ORIGIN)).toBeNull();
    expect(normalizeCandidatePath("https://linxule.com/writing/foo/", ORIGIN)).toBe("/writing/foo");
    expect(normalizeCandidatePath("/", ORIGIN)).toBe("/");
  });
});

describe("linxule-mcp Streamable HTTP JSON-RPC 2.0 protocol", () => {
  test("handles initialize, 202 notifications, ping, tools, resources, prompts, and batches", async () => {
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
    const searchBody = await searchRes.json();
    expect(searchBody.result.isError).toBeUndefined();
    const kinds = searchBody.result.structuredContent.matches.map((m) => m.kind);
    expect(kinds).toContain("concept");
    expect(kinds).toContain("page");

    // 4. list_site overview + concepts
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
    expect(listBody.result.structuredContent.counts).toEqual({
      pages_total: 3,
      by_section: { writing: 1, papers: 1, portraits: 1 },
      concepts: 1,
      publications: 1,
      projects: 1,
    });

    // 5. read_page with SHA-256 verification,CONTENT_CHANGED guard, and portraits provenance note
    const expectedEssayMd = FIXTURE_BODIES.get("/writing/loom-xviii-the-end-of-positivism.md");
    const expectedHash = createHash("sha256").update(expectedEssayMd).digest("hex");

    const readRes = await postRpc(worker, env, {
      jsonrpc: "2.0",
      id: 4,
      method: "tools/call",
      params: {
        name: "read_page",
        arguments: {
          path: "/writing/loom-xviii-the-end-of-positivism",
          expected_sha256: expectedHash,
        },
      },
    });
    const readBody = await readRes.json();
    expect(readBody.result.structuredContent.ok).toBe(true);
    expect(readBody.result.structuredContent.sha256).toBe(expectedHash);
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

    // 6. resources/list, resources/templates/list, resources/read
    const resRead = await postRpc(worker, env, {
      jsonrpc: "2.0",
      id: 8,
      method: "resources/read",
      params: { uri: "linxule://pages/papers/interpretive-orchestration" },
    });
    const resReadBody = await resRead.json();
    expect(resReadBody.result.contents[0].text).toContain("10.1177/14761270261448645");

    // 7. prompts/get + unexpected arguments refusal
    const promptOk = await postRpc(worker, env, {
      jsonrpc: "2.0",
      id: 9,
      method: "prompts/get",
      params: { name: "xule-research-navigation" },
    });
    const promptOkBody = await promptOk.json();
    expect(promptOkBody.result.messages[0].content.text).toContain("# Xule Research Navigation");

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
});
