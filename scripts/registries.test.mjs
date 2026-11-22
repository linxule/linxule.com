import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import markdownIt from "markdown-it";
import {
  COLLECTION_TWINS,
  MD_PATHS,
  MIDDLEWARE_MATCHERS,
  STATIC_TWINS,
  mdAlternateForUrl,
} from "../eleventy/shapes.mjs";
import { creditFamily, creditModel, slugify } from "../eleventy/strings.js";
import { cvHtml, htmlToMarkdown, markdownBody, stripTrailingSlash } from "../eleventy/filters.js";
import seriesCatalog from "../src/_data/seriesCatalog.js";
import conceptsCatalog from "../src/_data/conceptsCatalog.js";
import collaboratorsCatalog from "../src/_data/collaboratorsCatalog.js";

describe("eleventy/shapes.mjs", () => {
  test("declares all 5 collections and 13 static shapes including /connect", () => {
    expect(COLLECTION_TWINS.map((c) => c.id)).toEqual([
      "writing",
      "portraits",
      "artifacts",
      "talks",
      "papers",
    ]);
    expect(STATIC_TWINS.map((s) => s.url)).toEqual([
      "/",
      "/writing",
      "/making",
      "/talks",
      "/papers",
      "/thinking",
      "/concepts",
      "/teaching",
      "/builds",
      "/builds/vellum",
      "/cv",
      "/cv-zh",
      "/connect",
    ]);
    expect(MIDDLEWARE_MATCHERS).toContain("/connect");
    expect(MIDDLEWARE_MATCHERS).toContain("/builds/:path");
  });

  test("mdAlternateForUrl resolves every twinned URL and excludes filter/non-twinned routes", () => {
    expect(mdAlternateForUrl("/")).toBe("/index.md");
    expect(mdAlternateForUrl("/writing/")).toBe("/writing.md");
    expect(mdAlternateForUrl("/writing")).toBe("/writing.md");
    expect(mdAlternateForUrl("/connect/")).toBe("/connect.md");
    expect(mdAlternateForUrl("/connect")).toBe("/connect.md");
    expect(mdAlternateForUrl("/builds/vellum/")).toBe("/builds/vellum.md");
    expect(mdAlternateForUrl("/writing/loom-i/")).toBe("/writing/loom-i.md");
    expect(mdAlternateForUrl("/making/portraits/p1/")).toBe("/making/portraits/p1.md");
    expect(mdAlternateForUrl("/making/artifacts/a1/")).toBe("/making/artifacts/a1.md");
    expect(mdAlternateForUrl("/talks/t1/")).toBe("/talks/t1.md");
    expect(mdAlternateForUrl("/papers/p1/")).toBe("/papers/p1.md");

    for (const excluded of [
      "/tag/ai-governance/",
      "/making/prompter/claude/",
      "/making/creator/opus/",
      "/writing/series/loom/",
      "/writing/series/",
      "/writing/attachments/cover.png",
      "/writing/attachments/",
      "/search/",
      "/404.html",
      "/writing/loom-i.md",
      "/index.md",
      "",
      null,
    ]) {
      expect(mdAlternateForUrl(excluded), `mdAlternateForUrl(${excluded})`).toBeNull();
    }
  });

  test("MD_PATHS rejects direct .md URLs and series/attachments paths", () => {
    expect(MD_PATHS.test("/connect")).toBe(true);
    expect(MD_PATHS.test("/builds/vellum")).toBe(true);
    expect(MD_PATHS.test("/writing/loom-i")).toBe(true);
    expect(MD_PATHS.test("/writing/loom-i.md")).toBe(false);
    expect(MD_PATHS.test("/writing/series/loom")).toBe(false);
    expect(MD_PATHS.test("/writing/attachments/foo.png")).toBe(false);
  });
});

describe("eleventy/strings.js", () => {
  test("normalizes gpt-6 astra and gpt 6 astra into the gpt family while preserving slug", () => {
    expect(creditFamily("gpt-6 astra")).toBe("gpt");
    expect(creditModel("gpt-6 astra")).toBe("6 astra");
    expect(creditFamily("gpt 6 astra")).toBe("gpt");
    expect(creditModel("gpt 6 astra")).toBe("6 astra");
    expect(slugify("gpt-6 astra")).toBe("gpt-6-astra");
    expect(slugify("gpt 6 astra")).toBe("gpt-6-astra");

    expect(creditFamily("claude")).toBe("claude");
    expect(creditModel("claude")).toBeNull();
    expect(creditFamily("codex gpt-5.6 sol")).toBe("codex");
    expect(creditModel("codex gpt-5.6 sol")).toBe("gpt-5.6 sol");
  });
});

describe("global data catalogs", () => {
  test("seriesCatalog exposes all 9 series in display order including thinking with standard accident pair", () => {
    expect(seriesCatalog.list.map((s) => s.slug)).toEqual([
      "loom",
      "seam",
      "research-with-ai",
      "ai-whispers",
      "thinking",
      "singles",
      "epistemic-voids",
      "organizational-futures",
      "archive",
    ]);

    for (const s of seriesCatalog.list) {
      expect(seriesCatalog.bySlug[s.slug]).toBe(s);
      expect(s.poemHtml).toContain('<span class="accident">◆</span>');
      expect(s.description).toContain('<span class="accident">');
      expect(s.cardSubtitle.length).toBeGreaterThan(0);
      expect(s.seoTitle.length).toBeGreaterThan(0);
      expect(s.seoDescription.length).toBeGreaterThan(0);
    }
    expect(seriesCatalog.bySlug.seam.companion?.link).toBe("/tsm/");
  });

  test("conceptsCatalog joins all 14 concepts (7 anchored + 7 forming) with canonical slashless URLs", () => {
    expect(conceptsCatalog.list).toHaveLength(14);
    expect(conceptsCatalog.anchoredCount).toBe(7);
    expect(conceptsCatalog.formingCount).toBe(7);
    expect(conceptsCatalog.territories).toHaveLength(4);

    for (const c of conceptsCatalog.list) {
      expect(conceptsCatalog.bySlug[c.slug]).toBe(c);
      expect(["anchored", "forming"]).toContain(c.status);
      expect(c.anchorId).toBe(`dfn-${c.slug}`);
      expect(c.url).not.toMatch(/\/#/);
      expect(c.url).not.toMatch(/\/$/);
      expect(c.definition.length).toBeGreaterThan(0);
      expect(c.openQuestions.length).toBeGreaterThan(0);
      if (c.status === "anchored") {
        expect(c.essayUrl).toMatch(/^\/writing\/[^/]+$/);
        expect(c.essayTitle).toBeTruthy();
        expect(typeof c.essayYear).toBe("number");
      } else {
        expect(c.url).toBe(`/concepts#dfn-${c.slug}`);
        expect(c.essayUrl).toBeNull();
      }
    }

    const io = conceptsCatalog.bySlug["interpretive-orchestration"];
    expect(io.doi).toBe("10.1177/14761270261448645");
    expect(io.essayUrl).toBe("/writing/research-memex");
  });

  test("collaboratorsCatalog aggregates human-AI lineage with valid slashless filter-book URLs", () => {
    expect(collaboratorsCatalog.totalWorks).toBeGreaterThan(50);
    expect(collaboratorsCatalog.families.length).toBeGreaterThan(5);
    expect(collaboratorsCatalog.models.length).toBeGreaterThan(20);

    const claude = collaboratorsCatalog.families.find((f) => f.slug === "claude");
    const gpt = collaboratorsCatalog.families.find((f) => f.slug === "gpt");
    const kevin = collaboratorsCatalog.families.find((f) => f.slug === "kevin-corley");
    expect(claude?.prompterUrl).toBe("/making/prompter/claude");
    expect(claude?.creatorUrl).toBe("/making/creator/claude");
    expect(gpt?.prompterUrl).toBe("/making/prompter/gpt");
    expect(gpt?.creatorUrl).toBe("/making/creator/gpt");
    expect(kevin?.kind).toBe("human");

    const astra = collaboratorsCatalog.models.find((m) => m.slug === "gpt-6-astra");
    expect(astra?.familySlug).toBe("gpt");
    expect(astra?.prompterUrl).toBe("/making/prompter/gpt-6-astra");
    expect(astra?.creatorUrl).toBe("/making/creator/gpt-6-astra");

    for (const entry of [...collaboratorsCatalog.families, ...collaboratorsCatalog.models]) {
      if (entry.prompterUrl) expect(entry.prompterUrl).not.toMatch(/\/$/);
      if (entry.creatorUrl) expect(entry.creatorUrl).not.toMatch(/\/$/);
    }
  });
});

describe("eleventy/filters.js upgrades", () => {
  test("stripTrailingSlash preserves '/' and strips trailing slashes everywhere else", () => {
    expect(stripTrailingSlash("/")).toBe("/");
    expect(stripTrailingSlash("/writing/")).toBe("/writing");
    expect(stripTrailingSlash("/writing/loom-i/")).toBe("/writing/loom-i");
    expect(stripTrailingSlash("/connect")).toBe("/connect");
    expect(stripTrailingSlash("")).toBe("");
  });

  test("htmlToMarkdown converts links, accident spans, formatting, blockquotes, and decodes entities", () => {
    const html =
      '<p>See <a href="/writing/a"><em>A &amp; B</em></a> and <span class="accident">the seam</span> with <code>code</code> and <strong>bold</strong>.</p>' +
      '<blockquote><p>Quoted &mdash; line<br>two</p></blockquote>';
    const md = htmlToMarkdown(html);
    expect(md).toContain("[*A & B*](/writing/a)");
    expect(md).toContain("*the seam* *(accident)*");
    expect(md).toContain("`code`");
    expect(md).toContain("**bold**");
    expect(md).toContain("> Quoted — line");
    expect(md).not.toMatch(/<\/?[a-z]/i);
    expect(md).not.toContain("&amp;");
  });

  test("markdownBody strips <script>, empty dfn anchors, and rewrites /writing/attachments/* except *-og.jpg", () => {
    const input = [
      '<script type="application/ld+json">{"@type":"Article"}</script>',
      '<a id="dfn-polanyi-inversion"></a>**The Polanyi Inversion**: test.',
      '<a id="deliberate"></a>',
      "![Cover](/writing/attachments/rwa-01-cover.png)",
      "![OG](/writing/attachments/rwa-01-cover-og.jpg)",
      "```html",
      '<script>alert(1)</script>',
      "![Code](/writing/attachments/rwa-01-cover.png)",
      "```",
    ].join("\n\n");

    const out = markdownBody(input);
    expect(out).not.toContain("application/ld+json");
    expect(out).not.toContain('id="dfn-polanyi-inversion"');
    expect(out).toContain('<a id="deliberate"></a>');
    expect(out).toMatch(/!\[Cover\]\(\/assets\/images\/optimized\/attachments-rwa-01-cover-\d+w\.(?:jpeg|png)\)/);
    expect(out).toContain("![OG](/writing/attachments/rwa-01-cover-og.jpg)");
    // Fenced code blocks remain byte-for-byte intact
    expect(out).toContain("<script>alert(1)</script>");
    expect(out).toContain("![Code](/writing/attachments/rwa-01-cover.png)");
  });

  test("cvHtml produces exactly one <h1>, converts top <h3> lines to .cv-contact, and demotes section <h1>s to <h2>", () => {
    const md = markdownIt({ html: true });
    for (const file of ["src/cv/index.md", "src/cv-zh/index.md"]) {
      const raw = readFileSync(file, "utf8").replace(/^---[\s\S]*?---\r?\n/, "");
      const html = cvHtml(md.render(raw));
      expect((html.match(/<h1\b/gi) || []).length, `${file} h1 count`).toBe(1);
      expect((html.match(/<p class="cv-contact"/gi) || []).length, `${file} cv-contact count`).toBe(2);
      expect((html.match(/<h2\b/gi) || []).length, `${file} h2 count`).toBeGreaterThanOrEqual(18);
      expect((html.match(/<h3\b/gi) || []).length, `${file} h3 count`).toBe(0);
    }
  });

  test("src/assets/assets.json excludes static assets from Eleventy templates and collections", () => {
    const assetDataPath = path.resolve("src/assets/assets.json");
    expect(existsSync(assetDataPath)).toBe(true);
    expect(JSON.parse(readFileSync(assetDataPath, "utf8"))).toEqual({
      permalink: false,
      eleventyExcludeFromCollections: true,
    });
  });
});
