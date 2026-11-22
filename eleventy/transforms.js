/**
 * Eleventy Transforms
 * Post-processing transforms for HTML output
 */

import Image from "@11ty/eleventy-img";
import sharp from "sharp";
import path from "node:path";
import {
  WRITING_WIDTHS,
  imageAttributes,
  imageHTML,
  imageOptions,
  recordOptimizedMetadata,
} from "./image-pipeline.js";
import { slugify } from "./strings.js";

// Export the factory so regressions can exercise the real markup generation
// with a tiny image fixture instead of re-encoding the site's complete gallery.
// PNG stays PNG only when it actually uses transparency; opaque PNG artwork
// re-encoded as PNG at three widths was most of the deployed payload.
export async function needsLosslessFallback(inputPath) {
  const metadata = await sharp(inputPath).metadata();
  if (!metadata.hasAlpha) return false;
  const stats = await sharp(inputPath).stats();
  return !stats.isOpaque;
}

const ARTICLE_BODY_OPEN = /<div\b[^>]*\bclass\s*=\s*["'][^"']*\barticle-body\b[^"']*["'][^>]*>/i;

export function createWritingImageTransform(processImage = Image, keepLossless = needsLosslessFallback) {
  return async function(content) {
    const outputPath = this.page.outputPath;
    if (!outputPath || typeof outputPath !== "string" || !outputPath.endsWith(".html")) return content;
    if (!this.page.inputPath?.includes("/writing/")) return content;

    const imgPattern = /<img(?=\s)(?:[^"'<>]|"[^"]*"|'[^']*')*>/gi;
    const matches = [...content.matchAll(imgPattern)].map(match => ({
      tag: match[0], index: match.index, attributes: imageAttributes(match[0]),
    })).filter(({ attributes }) => {
      // Authored responsive markup owns its source selection. Leave it intact.
      return attributes.src?.startsWith("/writing/attachments/") && !("srcset" in attributes);
    });
    if (!matches.length) return content;

    // Identify the first hero/opening image inside `.article-body` (within the first
    // 400 characters of body HTML) so LCP images opt into eager/high-priority loading.
    const bodyMatch = content.match(ARTICLE_BODY_OPEN);
    let lcpMatchIndex = -1;
    if (bodyMatch) {
      const bodyStart = bodyMatch.index + bodyMatch[0].length;
      const firstBodyImg = matches.find((m) => m.index >= bodyStart);
      if (firstBodyImg && firstBodyImg.index - bodyStart <= 400) {
        lcpMatchIndex = firstBodyImg.index;
      }
    }

    const srcToMetadata = new Map();
    const uniqueSrcs = [...new Set(matches.map(match => match.attributes.src))];
    console.log(`[writing-img] Optimizing ${uniqueSrcs.length} unique images in ${this.page.inputPath}`);

    await Promise.all(uniqueSrcs.map(async (src) => {
      // Query strings and fragments belong to the public URL, not the
      // filesystem path or output format. Fail loudly on missing local attachments
      // since raw attachments are no longer passthrough-copied to `_site`.
      const pathname = src.split(/[?#]/, 1)[0];
      const inputPath = `./src${pathname}`;
      const ext = path.extname(pathname).slice(1).toLowerCase();
      // A probe failure is not a format decision; let processImage report the file.
      const lossless = ext === "png" && await keepLossless(inputPath).catch(() => false);
      const fallbackFormat = lossless ? "png" : "jpeg";
      const formats = [...new Set(["avif", "webp", fallbackFormat])];
      const metadata = await processImage(inputPath, imageOptions(WRITING_WIDTHS, formats));
      recordOptimizedMetadata(metadata);
      srcToMetadata.set(src, metadata);
    }));

    let result = "";
    let lastIndex = 0;
    for (const { tag, index, attributes } of matches) {
      const metadata = srcToMetadata.get(attributes.src);
      result += content.slice(lastIndex, index);
      const { src: _rawSrc, ...restAttributes } = attributes;
      const isLcp = index === lcpMatchIndex;
      const defaults = {
        alt: "",
        // 42rem is --measure-figure in main.css: figures keep that width
        // above 768px whatever the text measure is.
        sizes: "(max-width: 768px) 100vw, 42rem",
        loading: isLcp ? "eager" : "lazy",
        decoding: "async",
      };
      if (isLcp) defaults.fetchpriority = "high";
      result += imageHTML(metadata, {
        ...defaults,
        ...restAttributes,
      });
      lastIndex = index + tag.length;
    }
    return result + content.slice(lastIndex);
  };
}

// Blockquotes that open with a bold term and a colon (> **Term**: or
// > **Term** (qualifier):) become deep-linkable definitions, #dfn-<slug>.
// A term that recurs on one page (four "Quick Application" callouts in loom-ix)
// keeps the bare id on its first use and gets -2, -3 after, so the id a link
// already points at never moves and no two elements share one.
const DEFINITION = /<blockquote>\s*\n<p><strong>([^<]+)<\/strong>\s*(?:\([^)]*\)\s*)?:/g;

export function addDefinitionIds(content) {
  const used = new Set();
  return content.replace(DEFINITION, (match, term) => {
    const slug = slugify(term);
    let id = `dfn-${slug}`;
    for (let n = 2; used.has(id); n++) id = `dfn-${slug}-${n}`;
    used.add(id);
    return match.replace('<blockquote>', `<blockquote id="${id}" class="concept-definition">`);
  });
}

export default function(eleventyConfig) {
  // Writing attachments share the shortcode's cache and responsive formats.
  eleventyConfig.addTransform("optimizeWritingImages", createWritingImageTransform());

  // Deep-link blockquote definitions: add id and class to > **Term**: patterns
  // Makes every concept definition deep-linkable via #dfn-slugified-term
  eleventyConfig.addTransform("deepLinkDefinitions", function(content) {
    const outputPath = this.page.outputPath;
    if (!outputPath || typeof outputPath !== 'string' || !outputPath.endsWith(".html")) return content;
    if (!this.page.inputPath?.includes("/writing/")) return content;

    return addDefinitionIds(content);
  });
}
