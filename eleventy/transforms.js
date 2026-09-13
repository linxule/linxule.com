/**
 * Eleventy Transforms
 * Post-processing transforms for HTML output
 */

import Image from "@11ty/eleventy-img";
import sharp from "sharp";
import path from "node:path";
import { imageAttributes, imageHTML, imageOptions } from "./image-pipeline.js";

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

    const srcToMetadata = new Map();
    const uniqueSrcs = [...new Set(matches.map(match => match.attributes.src))];
    console.log(`[writing-img] Optimizing ${uniqueSrcs.length} unique images in ${this.page.inputPath}`);

    await Promise.all(uniqueSrcs.map(async (src) => {
      // Query strings and fragments belong to the public/lightbox URL, not the
      // filesystem path or output format.
      try {
        const pathname = src.split(/[?#]/, 1)[0];
        const inputPath = `./src${pathname}`;
        const ext = path.extname(pathname).slice(1).toLowerCase();
        // A probe failure is not a format decision; let processImage report the file.
        const lossless = ext === "png" && await keepLossless(inputPath).catch(() => false);
        const fallbackFormat = lossless ? "png" : "jpeg";
        const formats = [...new Set(["avif", "webp", fallbackFormat])];
        const metadata = await processImage(inputPath, imageOptions([400, 800, 1200], formats));
        srcToMetadata.set(src, metadata);
      } catch (error) {
        console.error(`[writing-img] Failed to optimize ${src}:`, error.message);
      }
    }));

    let result = "";
    let lastIndex = 0;
    for (const { tag, index, attributes } of matches) {
      const metadata = srcToMetadata.get(attributes.src);
      result += content.slice(lastIndex, index);
      if (metadata) {
        result += imageHTML(metadata, {
          alt: "",
          sizes: "(max-width: 768px) 100vw, 42rem",
          loading: "lazy",
          decoding: "async",
          ...attributes,
          "data-full-src": attributes.src,
        });
      } else {
        result += tag;
      }
      lastIndex = index + tag.length;
    }
    return result + content.slice(lastIndex);
  };
}

export default function(eleventyConfig) {
  // Writing attachments share the shortcode's cache and responsive formats.
  // Originals remain available to the lightbox via data-full-src.
  eleventyConfig.addTransform("optimizeWritingImages", createWritingImageTransform());

  // Deep-link blockquote definitions: add id and class to > **Term**: patterns
  // Makes every concept definition deep-linkable via #dfn-slugified-term
  eleventyConfig.addTransform("deepLinkDefinitions", function(content) {
    const outputPath = this.page.outputPath;
    if (!outputPath || typeof outputPath !== 'string' || !outputPath.endsWith(".html")) return content;
    if (!this.page.inputPath?.includes("/writing/")) return content;

    // Add id and class to blockquote definitions: > **Term** (optional qualifier):
    const bqRegex = /<blockquote>\s*\n<p><strong>([^<]+)<\/strong>\s*(?:\([^)]*\)\s*)?:/g;
    content = content.replace(bqRegex, (match, term) => {
      const slug = term.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
      return match.replace('<blockquote>', `<blockquote id="dfn-${slug}" class="concept-definition">`);
    });

    return content;
  });
}
