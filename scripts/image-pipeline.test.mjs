import { afterAll, describe, expect, test } from "bun:test";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { spawnSync } from "node:child_process";
import markdownIt from "markdown-it";
import Image from "@11ty/eleventy-img";
import sharp from "sharp";
import { createWritingImageTransform } from "../eleventy/transforms.js";
import { imageOptions, originalImageHTML } from "../eleventy/image-pipeline.js";
import shortcodes from "../eleventy/shortcodes.js";

const fixtureDir = await mkdtemp(path.join(os.tmpdir(), "image-pipeline-"));
const fixturePath = path.join(fixtureDir, "pixel.png");
await sharp({ create: { width: 1, height: 1, channels: 3, background: "#123456" } })
  .png().toFile(fixturePath);
afterAll(() => rm(fixtureDir, { recursive: true, force: true }));

const page = { inputPath: "./src/writing/test.md", outputPath: "_site/writing/test/index.html" };

function fixtureTransform(calls = []) {
  return createWritingImageTransform(async (input, options) => {
    calls.push({ input, options });
    return Image(fixturePath, { ...options, outputDir: path.join(fixtureDir, "optimized") });
  });
}

describe("writing image pipeline", () => {
  test("real markdown keeps its alt text and title through responsive encoding", async () => {
    const markdown = '![A & B say "hello" <there>](/writing/attachments/pixel.png "Title & credit")';
    const original = markdownIt().render(markdown);
    const output = await fixtureTransform().call({ page }, original);
    expect(output).toContain("<picture>");
    expect(output).toContain('alt="A &amp; B say &quot;hello&quot; <there>"');
    expect(output).toContain('title="Title &amp; credit"');
    expect(output).not.toContain("&amp;amp;");
    expect(output).toContain('data-full-src="/writing/attachments/pixel.png"');
    expect(output).toContain('type="image/avif"');
    expect(output).toContain('type="image/webp"');
    expect(output).toContain('width="1" height="1"');
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
    expect(calls[0].options.formats).toEqual(["avif", "webp", "png"]);
    expect(output).toContain('data-full-src="/writing/attachments/pixel.png?v=2&amp;mode=full#detail"');
  });

  test("preserves an encoded-space URL instead of emitting excluded cache filenames", async () => {
    const attachmentDir = path.join(fixtureDir, "src/writing/attachments");
    await mkdir(attachmentDir, { recursive: true });
    await writeFile(path.join(attachmentDir, "space name.png"), await readFile(fixturePath));
    const calls = [];
    const transform = createWritingImageTransform(async (input, options) => {
      calls.push(input);
      return Image(path.resolve(fixtureDir, input), {
        ...options, outputDir: path.join(fixtureDir, "encoded-space-output"),
      });
    });
    const original = '<img src="/writing/attachments/space%20name.png" alt="A &amp; B" title="Original image">';
    const output = await transform.call({ page }, original);
    expect(calls).toEqual(["./src/writing/attachments/space%20name.png"]);
    expect(output).toBe(original);
    expect(output).not.toContain("<picture>");
  });

  test("leaves authored srcset, external images, and data-src placeholders intact", async () => {
    const calls = [];
    const original = '<img src="/writing/attachments/pixel.png" srcset="/custom.png 2x"><img src="https://example.org/image.png"><img data-src="/writing/attachments/pixel.png" src="/placeholder.png">';
    expect(await fixtureTransform(calls).call({ page }, original)).toBe(original);
    expect(calls).toHaveLength(0);
  });

  test("keeps failed images and non-writing/non-HTML outputs byte-for-byte", async () => {
    const original = '<img src="/writing/attachments/missing.png" alt="A &amp; B" title="credit">';
    const transform = createWritingImageTransform(async () => { throw new Error("missing test fixture"); });
    expect(await transform.call({ page }, original)).toBe(original);
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
    const making = imageOptions([400, 800, 1200, null], ["avif", "webp", "png"]);
    expect(writing.filenameFormat("hash", "./src/writing/attachments/cover.jpeg", 800, "avif"))
      .toBe("attachments-cover-800w.avif");
    expect(making.filenameFormat("hash", "./src/assets/images/portraits/portrait/01.png", 1200, "webp"))
      .toBe("portrait-01-1200w.webp");
    expect(writing.widths).toEqual([400, 800, 1200]);
    expect(making.widths).toEqual([400, 800, 1200, null]);
    expect(making.outputDir).toBe(writing.outputDir);
  });

  test("shortcode failure keeps quotes and ampersands inside their attributes", async () => {
    let shortcode;
    shortcodes({ addShortcode() {}, addAsyncShortcode(name, callback) { shortcode = callback; } });
    const source = '/nonexistent/image.png?credit="A"&v=1';
    const output = await shortcode(source, 'A "quoted" & <missing> image');
    expect(output).toBe(originalImageHTML(source, 'A "quoted" & <missing> image'));
    expect(output).toContain('src="/nonexistent/image.png?credit=&quot;A&quot;&amp;v=1"');
    expect(output).toContain('alt="A &quot;quoted&quot; &amp; <missing> image"');
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

  test("Eleventy's after hook copies images into a custom output directory", async () => {
    const configURL = pathToFileURL(path.resolve("eleventy.config.js")).href;
    const cacheDir = path.join(fixtureDir, ".cache/@11ty/img");
    await mkdir(cacheDir, { recursive: true });
    await writeFile(path.join(cacheDir, "test-1w.png"), "fixture");
    const script = `
      import configure from ${JSON.stringify(configURL)};
      let after;
      configure(new Proxy({}, { get(_, name) {
        if (name === "on") return (event, callback) => { if (event === "eleventy.after") after = callback; };
        return () => {};
      }}));
      await after({ dir: { output: "custom-output" } });
    `;
    const child = spawnSync(process.execPath, ["--eval", script], { cwd: fixtureDir, encoding: "utf8" });
    expect(child.stderr).toBe("");
    expect(child.status).toBe(0);
    expect(await readFile(path.join(fixtureDir, "custom-output/assets/images/optimized/test-1w.png"), "utf8"))
      .toBe("fixture");
  });
});
