import { afterAll, describe, expect, test } from "bun:test";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import sharp from "sharp";
import nunjucks from "nunjucks";
import { load } from "js-yaml";
import filters from "../eleventy/filters.js";
import { BRAND_CARD, DEFAULT_CARD, SERIES_CARDS, ogCard, resolveSocialCard, titleCardOptions } from "../eleventy/og-card-paths.js";
import { titleCardSvg, brandCardSvg } from "./lib/og-cards.mjs";
import { checkOgImages } from "./check-og-images.mjs";

const env = new nunjucks.Environment(null, { autoescape: true });
filters({ addFilter(name, filter) { env.addFilter(name, filter); } });
const base = await readFile("src/_includes/layouts/base.njk", "utf8");
const head = base.slice(base.indexOf("    {# Open Graph #}"), base.indexOf("    {# Favicon #}"));
const site = { url: "https://linxule.com", title: "Xule Lin", description: "A research website" };
const temporary = await mkdtemp(path.join(os.tmpdir(), "social-card-test-"));
afterAll(() => rm(temporary, { recursive: true, force: true }));

async function contentData(file, url) {
  const source = await readFile(file, "utf8");
  return { ...load(source.match(/^---\n([\s\S]*?)\n---/)[1]), page: { url, fileSlug: "index" } };
}

function metadata(image, width = 1200, height = 630, alt = "The shared image") {
  return `<meta content='${image}' PROPERTY='og:image'>
    <meta content=${width} property=og:image:width><meta property=og:image:height content='${height}'>
    <meta content='image/jpeg' property='og:image:type'>
    <meta property='og:image:alt' content='${alt}'>
    <meta content='${image}' name='twitter:image'><meta name='twitter:image:alt' content='${alt}'>`;
}

describe("social cards", () => {
  test("nested paper index pages get distinct cards containing canonical titles and venues", async () => {
    const resolved = [];
    for (const slug of ["interpretive-orchestration", "cognitio-emergens"]) {
      const data = await contentData(`src/papers/${slug}/index.md`, `/papers/${slug}/`);
      const card = resolveSocialCard(data);
      expect(card.src).toContain(`/paper-${slug}-r3.jpg`);
      expect(card.alt).toContain(data.paperTitle);
      expect(card.alt).toContain(data.venue);
      const html = env.renderString(head, { ...data, site });
      expect(html).toContain(`content="${site.url}${card.src}"`);
      expect(html).not.toContain(DEFAULT_CARD);
      const dimensions = await sharp(`src${card.src}`).metadata();
      expect([dimensions.width, dimensions.height]).toEqual([1200, 630]);
      resolved.push(card.src);
    }
    expect(new Set(resolved).size).toBe(2);
    expect(resolveSocialCard({ page: { url: "/papers/" } }).src).toBe("/assets/og-cards/papers.jpg");
  });

  test("talks inheriting their layout have a generated title card", async () => {
    const source = "src/talks/thinking-through-ai-01.md";
    const inherited = JSON.parse(await readFile("src/talks/talks.json", "utf8"));
    const data = { ...inherited, ...await contentData(source, "/talks/thinking-through-ai-01/") };
    data.page.fileSlug = "thinking-through-ai-01";
    const card = resolveSocialCard(data);
    expect(card.src).toBe("/assets/og-cards/auto/thinking-through-ai-01-r3.jpg");
    expect(card.alt).toContain("TALKS · 2026");
    expect(card.alt).toContain(data.title);
    const dimensions = await sharp(`src${card.src}`).metadata();
    expect([dimensions.width, dimensions.height]).toEqual([1200, 630]);
  });

  test("all nine series landings select their own card and corresponding visible copy", () => {
    expect(Object.keys(SERIES_CARDS)).toHaveLength(9);
    for (const [slug, [name, subtitle]] of Object.entries(SERIES_CARDS)) {
      const card = resolveSocialCard({ page: { url: `/writing/series/${slug}/` }, series: { slug, name } });
      expect(card.src).toBe(`/assets/og-cards/series/${slug}-r3.jpg`);
      expect(card.alt).toContain(name);
      expect(card.alt).toContain(subtitle);
    }
  });

  test("raster normalization is idempotent and preserves existing authored art cards", () => {
    expect(ogCard("/assets/images/artifacts/vaporwave_cat.png")).toBe("/assets/images/artifacts/vaporwave_cat-og-r2.jpg");
    for (const src of [
      "/assets/images/artifacts/vaporwave_cat-og-r2.jpg", "/assets/images/artifacts/hortus-machinarum/og.jpg",
      "/assets/images/artifacts/response_to_lineage-og.jpg", "/writing/attachments/rwa-01-cover-og.jpg",
    ]) expect(ogCard(src)).toBe(src);
    expect(ogCard("/assets/images/portraits/example/hero.jpg")).toBe("/assets/images/portraits/example/og.jpg");
  });

  test("Nyan Wave advertises normalized dimensions and the selected artwork alternative", async () => {
    const data = await contentData("src/making/artifacts/artifact-2026-04-13-nyan-wave.md", "/making/artifacts/artifact-2026-04-13-nyan-wave/");
    const html = env.renderString(head, { ...data, metaDescription: "deep vaporwave gradient", site });
    expect(html).toContain("vaporwave_cat-og-r2.jpg");
    expect(html).toContain(`property="og:image:alt" content="${data.images[0].alt}"`);
    expect(html).toContain(`name="twitter:image:alt" content="${data.images[0].alt}"`);
    const card = await sharp(`src${resolveSocialCard(data).src}`).metadata();
    expect([card.width, card.height]).toEqual([1200, 630]);
  });

  test("text fallback alternatives describe the card, and cover alternatives follow matching images", () => {
    const data = { layout: "layouts/artifact.njk", title: "blocked out, then drawn on", src: "/assets/artifacts/blocked/index.html", page: { fileSlug: "blocked-out-then-drawn-on", url: "/making/artifacts/blocked/" } };
    const html = env.renderString(head, { ...data, site, metaDescription: "An underlying solid" });
    expect(html).toContain('property="og:image:alt" content="MAKING · ARTIFACT. blocked out, then drawn on. LINXULE.COM"');
    const covered = env.renderString(head, { ...data, site, ogImage: "/writing/attachments/test.png", content: `<img src='/writing/attachments/other.png' alt='Wrong image'><img alt='A &amp; B say &quot;hello&quot;' src='/writing/attachments/test.png'>` });
    expect(covered).toContain('property="og:image:alt" content="A &amp; B say &quot;hello&quot;"');
    expect(covered).not.toContain('alt" content="Wrong image');
    expect(resolveSocialCard({ ...data, ogImageAlt: "Authored alternative" }).alt).toBe("Authored alternative");
  });

  test("cyan is the authored accident when there is one, otherwise a single quiet dot", () => {
    for (const svg of [
      titleCardSvg({ title: "LOOM III: Between Automated Precision and Lived Understanding", kicker: "WRITING · LOOM · III" }),
      titleCardSvg({ title: "blocked out, then drawn on", kicker: "MAKING · ARTIFACT" }),
    ]) {
      expect(svg.match(/fill="#4ee1d4"/g)).toHaveLength(1);
      expect(svg).toMatch(/<circle[^>]+fill="#4ee1d4"/);
      expect(svg).not.toMatch(/<(?:text|tspan)[^>]+fill="#4ee1d4"/);
    }
    // A title that is the accident on the page is the accident on the card — no dot beside it.
    const accidentCard = titleCardSvg(titleCardOptions({ layout: "layouts/writing.njk", title: "Epistemic Voids #3: Mechanism Literalism", series: "Epistemic Voids", accident: true }));
    expect(accidentCard).not.toMatch(/<circle/);
    expect(accidentCard).toMatch(/<text[^>]+fill="#4ee1d4"[^>]*>Epistemic Voids/);
    expect(accidentCard).not.toMatch(/<text[^>]+fill="#1a1a1a"[^>]*>(?:Epistemic|Mechanism)/);
    expect(titleCardOptions({ layout: "layouts/writing.njk", title: "Plain" }).accident).toBe(false);
    // The brand card carries its authored phrase — "not as tools." — in cyan, and nothing else.
    const brand = brandCardSvg(BRAND_CARD);
    expect(brand).not.toMatch(/<circle/);
    expect(brand.match(/fill="#4ee1d4"/g)).toHaveLength(1);
    expect(brand).toMatch(/<text[^>]+fill="#4ee1d4"[^>]*>not as tools\./);
    expect(resolveSocialCard({}).alt).toBe("Xule Lin. What becomes impossible to see when algorithms enter organizational life — not as tools.. LINXULE.COM");
    const making = resolveSocialCard({ ogImage: "/assets/og-cards/making.jpg" });
    expect(making.src).toBe("/assets/og-cards/making-r2.jpg");
    expect(making.alt).toContain("artifacts made by AI");
    expect(making.alt).not.toContain("Claude");
  });

  test("the lint catches decoded/advertised mismatch even when another page shares the card", async () => {
    const dir = path.join(temporary, "dimensions");
    await mkdir(dir);
    await sharp({ create: { width: 1200, height: 630, channels: 3, background: "white" } }).jpeg().toFile(path.join(dir, "card.jpg"));
    await writeFile(path.join(dir, "good.html"), metadata("https://linxule.com/card.jpg?rev=1", 1200, 630, "A &amp; B"));
    expect((await checkOgImages(dir)).issues).toEqual([]);
    await writeFile(path.join(dir, "bad.html"), metadata("/card.jpg", 1810, 1271));
    expect((await checkOgImages(dir)).issues.join("\n")).toContain("do not match advertised");
    await sharp({ create: { width: 1810, height: 1271, channels: 3, background: "white" } }).jpeg().toFile(path.join(dir, "raw.jpg"));
    await writeFile(path.join(dir, "raw.html"), metadata("/raw.jpg"));
    expect((await checkOgImages(dir)).issues.join("\n")).toContain("decoded dimensions must be 1200x630");
  });
});
