import { afterAll, describe, expect, test } from "bun:test";
import { existsSync } from "node:fs";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { spawnSync } from "node:child_process";
import markdownIt from "markdown-it";
import Image from "@11ty/eleventy-img";
import sharp from "sharp";
import { createWritingImageTransform, needsLosslessFallback } from "../eleventy/transforms.js";
import {
  getActiveOptimizedFiles,
  imageOptions,
  originalImageHTML,
  preindexWritingAttachments,
  resetActiveOptimizedFiles,
  resetSourceAttachmentIndex,
  resolveOptimizedAttachmentUrl,
} from "../eleventy/image-pipeline.js";
import shortcodes from "../eleventy/shortcodes.js";

const fixtureDir = await mkdtemp(path.join(os.tmpdir(), "image-pipeline-"));
const fixturePath = path.join(fixtureDir, "pixel.png");
await sharp({ create: { width: 1, height: 1, channels: 3, background: "#123456" } })
  .png().toFile(fixturePath);
afterAll(() => rm(fixtureDir, { recursive: true, force: true }));

const page = { inputPath: "./src/writing/test.md", outputPath: "_site/writing/test/index.html" };

function fixtureTransform(calls = [], keepLossless = async () => false) {
  return createWritingImageTransform(async (input, options) => {
    calls.push({ input, options });
    return Image(fixturePath, { ...options, outputDir: path.join(fixtureDir, "optimized") });
  }, keepLossless);
}

describe("writing image pipeline", () => {
  test("opaque PNG falls back to JPEG; transparent PNG keeps PNG", async () => {
    const original = '<img src="/writing/attachments/pixel.png" alt="">';
    const opaque = []; await fixtureTransform(opaque).call({ page }, original);
    expect(opaque[0].options.formats).toEqual(["avif", "webp", "jpeg"]);
    const alpha = []; await fixtureTransform(alpha, async () => true).call({ page }, original);
    expect(alpha[0].options.formats).toEqual(["avif", "webp", "png"]);
    expect(await needsLosslessFallback(fixturePath)).toBe(false);
  });

  test("real markdown keeps its alt text and title, drops unused data-full-src, and tracks active files", async () => {
    resetActiveOptimizedFiles();
    const markdown = '![A & B say "hello" <there>](/writing/attachments/pixel.png "Title & credit")';
    const original = markdownIt().render(markdown);
    const output = await fixtureTransform().call({ page }, original);
    expect(output).toContain("<picture>");
    expect(output).toContain('alt="A &amp; B say &quot;hello&quot; <there>"');
    expect(output).toContain('title="Title &amp; credit"');
    expect(output).not.toContain("&amp;amp;");
    expect(output).not.toContain("data-full-src");
    expect(output).toContain('type="image/avif"');
    expect(output).toContain('type="image/webp"');
    expect(output).toContain('width="1" height="1"');
    expect(getActiveOptimizedFiles().size).toBeGreaterThan(0);
  });

  test("opts the first opening image in .article-body (<=400 chars) into eager + fetchpriority=high", async () => {
    const heroHtml = '<div class="article-body"><p><img src="/writing/attachments/pixel.png" alt="hero"></p><p>Later</p><img src="/writing/attachments/pixel.png" alt="second"></div>';
    const output = await fixtureTransform().call({ page }, heroHtml);
    const imgs = [...output.matchAll(/<img\b[^>]*>/g)].map((m) => m[0]);
    expect(imgs).toHaveLength(2);
    expect(imgs[0]).toContain('loading="eager"');
    expect(imgs[0]).toContain('fetchpriority="high"');
    expect(imgs[1]).toContain('loading="lazy"');
    expect(imgs[1]).not.toContain("fetchpriority");

    // An image buried deep in the essay (>400 chars into .article-body) stays lazy.
    const deepHtml = `<div class="article-body"><p>${"word ".repeat(100)}</p><img src="/writing/attachments/pixel.png" alt="deep"></div>`;
    const deepOutput = await fixtureTransform().call({ page }, deepHtml);
    expect(deepOutput).toContain('loading="lazy"');
    expect(deepOutput).not.toContain('fetchpriority="high"');
  });

  test("retains quoted attributes, loading priority, and authored sizes", async () => {
    const original = `<img class='diagram' src='/writing/attachments/pixel.png' alt='A &#38; B' title='A > B &quot;quoted&quot;' loading=eager decoding=sync sizes='90vw' aria-describedby='caption'>`;
    const output = await fixtureTransform().call({ page }, original);
    for (const attribute of [
      'class="diagram"', 'alt="A &amp; B"', 'title="A > B &quot;quoted&quot;"',
      'loading="eager"', 'decoding="sync"', 'sizes="90vw"', 'aria-describedby="caption"',
    ]) expect(output).toContain(attribute);
  });

  test("deduplicates repeated sources and keeps their individual attributes", async () => {
    const calls = [];
    const original = '<p>Before</p><img src="/writing/attachments/pixel.png" alt="first"><hr><img alt="second" src="/writing/attachments/pixel.png"><p>After</p>';
    const output = await fixtureTransform(calls).call({ page }, original);
    expect(calls).toHaveLength(1);
    expect(output).toMatch(/^<p>Before<\/p><picture>/);
    expect(output).toContain('alt="first"');
    expect(output).toContain('</picture><hr><picture>');
    expect(output).toContain('alt="second"');
    expect(output).toEndWith('</picture><p>After</p>');
  });

  test("separates public query and fragment from the source file and fallback format", async () => {
    const calls = [];
    const original = '<img src="/writing/attachments/pixel.png?v=2&amp;mode=full#detail" alt="">';
    const output = await fixtureTransform(calls).call({ page }, original);
    expect(calls[0].input).toBe("./src/writing/attachments/pixel.png");
    expect(calls[0].options.formats).toEqual(["avif", "webp", "jpeg"]);
    expect(output).not.toContain("data-full-src");
  });

  test("leaves authored srcset, external images, and data-src placeholders intact", async () => {
    const calls = [];
    const original = '<img src="/writing/attachments/pixel.png" srcset="/custom.png 2x"><img src="https://example.org/image.png"><img data-src="/writing/attachments/pixel.png" src="/placeholder.png">';
    expect(await fixtureTransform(calls).call({ page }, original)).toBe(original);
    expect(calls).toHaveLength(0);
  });

  test("fails loud on missing local attachments while leaving non-writing/non-HTML outputs intact", async () => {
    const original = '<img src="/writing/attachments/missing.png" alt="A &amp; B" title="credit">';
    const transform = createWritingImageTransform(async () => { throw new Error("missing test fixture"); });
    await expect(transform.call({ page }, original)).rejects.toThrow("missing test fixture");
    for (const context of [
      { ...page, inputPath: "./src/making/test.md" },
      { ...page, outputPath: "_site/writing/test.md" },
      { ...page, outputPath: undefined },
    ]) expect(await transform.call({ page: context }, original)).toBe(original);
  });
});

describe("shared image contract", () => {
  test("preserves existing optimized asset filenames and per-path image widths", () => {
    const writing = imageOptions([400, 800, 1200], ["avif", "webp", "jpeg"]);
    const making = imageOptions([400, 800, 1200, 2000], ["avif", "webp", "jpeg"]);
    expect(writing.filenameFormat("hash", "./src/writing/attachments/cover.jpeg", 800, "avif"))
      .toBe("attachments-cover-800w.avif");
    expect(making.filenameFormat("hash", "./src/assets/images/portraits/portrait/01.png", 1200, "webp"))
      .toBe("portrait-01-1200w.webp");
    expect(writing.widths).toEqual([400, 800, 1200]);
    expect(making.widths).toEqual([400, 800, 1200, 2000]);
    expect(making.outputDir).toBe(writing.outputDir);
  });

  test("originalImageHTML escapes quotes and ampersands inside attributes", () => {
    const source = '/nonexistent/image.png?credit="A"&v=1';
    const output = originalImageHTML(source, 'A "quoted" & <missing> image');
    expect(output).toContain('src="/nonexistent/image.png?credit=&quot;A&quot;&amp;v=1"');
    expect(output).toContain('alt="A &quot;quoted&quot; &amp; <missing> image"');
  });

  test("optimizedImage fails loud on missing local images and supports className, loading, fetchpriority", async () => {
    let shortcode;
    let galleryItems;
    shortcodes({
      addShortcode() {},
      addAsyncFilter(name, callback) { if (name === "galleryItems") galleryItems = callback; },
      addAsyncShortcode(name, callback) { if (name === "optimizedImage") shortcode = callback; },
    });

    await expect(shortcode("/nonexistent/image.png", "Missing")).rejects.toThrow(/Missing local image/i);

    const relFixture = path.relative(process.cwd(), fixturePath);
    const html = await shortcode(relFixture, "Hero", "100vw", "hero-img", "eager", "high");
    expect(html).toContain('class="hero-img"');
    expect(html).toContain('loading="eager"');
    expect(html).toContain('fetchpriority="high"');

    // galleryItems strips unused interpretation prose
    const items = await galleryItems([
      { src: "/assets/artifacts/demo/index.html", alt: "Interactive", interpretation: "Verbose prose not needed in JSON" },
    ]);
    expect(items).toEqual([{ src: "/assets/artifacts/demo/index.html", alt: "Interactive", view: "/assets/artifacts/demo/index.html" }]);
    expect("interpretation" in items[0]).toBe(false);
  });

  test.each(["png", "jpeg", "webp", "svg"])("cold %s encoding writes valid responsive assets", async (format) => {
    const input = path.join(fixtureDir, `cold-${format}.${format}`);
    if (format === "svg") {
      await writeFile(input, '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="8"><rect width="12" height="8" fill="#123456"/></svg>');
    } else {
      await sharp({ create: { width: 12, height: 8, channels: 3, background: "#123456" } })
        .toFormat(format).toFile(input);
    }
    const fallback = format === "svg" ? "png" : format;
    const metadata = await Image(input, {
      ...imageOptions([6, 12], [...new Set(["avif", "webp", fallback])]),
      outputDir: path.join(fixtureDir, `cold-output-${format}`),
    });
    expect(Object.keys(metadata)).toEqual([...new Set(["avif", "webp", fallback])]);
    for (const entries of Object.values(metadata)) {
      expect(entries.map(entry => entry.width)).toEqual([6, 12]);
      for (const entry of entries) {
        const decoded = await sharp(entry.outputPath).metadata();
        expect(decoded.width).toBe(entry.width);
        expect(decoded.height).toBe(entry.height);
        expect(entry.url).toStartWith("/assets/images/optimized/");
      }
    }
  });

  test("Eleventy's after hook copies active tracked images and excludes retired cache orphans", async () => {
    const configURL = pathToFileURL(path.resolve("eleventy.config.js")).href;
    const pipelineURL = pathToFileURL(path.resolve("eleventy/image-pipeline.js")).href;
    const cacheDir = path.join(fixtureDir, ".cache/@11ty/img");
    await mkdir(cacheDir, { recursive: true });
    await writeFile(path.join(cacheDir, "active-1200w.webp"), "active-bytes");
    await writeFile(path.join(cacheDir, "orphan-2912w.png"), "retired-orphan");
    const script = `
      import configure from ${JSON.stringify(configURL)};
      import { recordOptimizedFilename } from ${JSON.stringify(pipelineURL)};
      const hooks = {};
      configure(new Proxy({}, { get(_, name) {
        if (name === "on") return (event, callback) => { hooks[event] = callback; };
        return () => {};
      }}));
      hooks["eleventy.before"]?.();
      recordOptimizedFilename("active-1200w.webp");
      await hooks["eleventy.after"]({ dir: { output: "custom-output" } });
    `;
    const child = spawnSync(process.execPath, ["--eval", script], { cwd: fixtureDir, encoding: "utf8" });
    expect(child.stderr).toBe("");
    expect(child.status).toBe(0);
    expect(await readFile(path.join(fixtureDir, "custom-output/assets/images/optimized/active-1200w.webp"), "utf8"))
      .toBe("active-bytes");
    expect(existsSync(path.join(fixtureDir, "custom-output/assets/images/optimized/orphan-2912w.png")))
      .toBe(false);
  });

  test("resolveOptimizedAttachmentUrl resolves exact width and PNG transparency from source even on a cold cache", async () => {
    // Cold cache + un-preindexed lazy sync inspection
    resetSourceAttachmentIndex();
    expect(
      resolveOptimizedAttachmentUrl("/writing/attachments/seam_01_chevrolet_toledo_1927.jpg", { cacheDirs: [] }),
    ).toBe("/assets/images/optimized/attachments-seam_01_chevrolet_toledo_1927-400w.jpeg");
    expect(
      resolveOptimizedAttachmentUrl(
        "/writing/attachments/epistemic_voids_01_citation_theater_02_aicoscientist_overview.png",
        { cacheDirs: [] },
      ),
    ).toBe(
      "/assets/images/optimized/attachments-epistemic_voids_01_citation_theater_02_aicoscientist_overview-1200w.png",
    );

    // Pre-indexed path (mirrors eleventy.before) + stale JPEG cache entry must NOT override transparent PNG
    resetSourceAttachmentIndex();
    await preindexWritingAttachments();
    const staleCache = path.join(fixtureDir, "stale-cache");
    await mkdir(staleCache, { recursive: true });
    await writeFile(
      path.join(
        staleCache,
        "attachments-epistemic_voids_01_citation_theater_02_aicoscientist_overview-1200w.jpeg",
      ),
      "stale",
    );
    await writeFile(path.join(staleCache, "attachments-only-in-cache-800w.jpeg"), "cached");

    expect(
      resolveOptimizedAttachmentUrl("/writing/attachments/seam_01_chevrolet_toledo_1927.jpg", { cacheDirs: [] }),
    ).toBe("/assets/images/optimized/attachments-seam_01_chevrolet_toledo_1927-400w.jpeg");
    expect(
      resolveOptimizedAttachmentUrl("/writing/attachments/loom-vi-the-pattern-beneath-the-voices-03.png", {
        cacheDirs: [],
      }),
    ).toBe("/assets/images/optimized/attachments-loom-vi-the-pattern-beneath-the-voices-03-586w.jpeg");
    expect(
      resolveOptimizedAttachmentUrl("/writing/attachments/loom-vi-the-pattern-beneath-the-voices-04.png", {
        cacheDirs: [],
      }),
    ).toBe("/assets/images/optimized/attachments-loom-vi-the-pattern-beneath-the-voices-04-800w.jpeg");
    expect(
      resolveOptimizedAttachmentUrl(
        "/writing/attachments/epistemic_voids_01_citation_theater_01_effortlessacademic.jpeg",
        { cacheDirs: [] },
      ),
    ).toBe(
      "/assets/images/optimized/attachments-epistemic_voids_01_citation_theater_01_effortlessacademic-1196w.jpeg",
    );
    expect(
      resolveOptimizedAttachmentUrl(
        "/writing/attachments/epistemic_voids_01_citation_theater_02_aicoscientist_overview.png",
        { cacheDirs: [staleCache] },
      ),
    ).toBe(
      "/assets/images/optimized/attachments-epistemic_voids_01_citation_theater_02_aicoscientist_overview-1200w.png",
    );
    // Fallback to cache scan when source file does not exist on disk
    expect(
      resolveOptimizedAttachmentUrl("/writing/attachments/only-in-cache.png", { cacheDirs: [staleCache] }),
    ).toBe("/assets/images/optimized/attachments-only-in-cache-800w.jpeg");
    // OG cards are never rewritten
    expect(
      resolveOptimizedAttachmentUrl("/writing/attachments/rwa-01-cover-og.jpg", { cacheDirs: [] }),
    ).toBeNull();
  });
});
