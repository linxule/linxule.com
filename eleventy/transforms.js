/**
 * Eleventy Transforms
 * Post-processing transforms for HTML output
 */

import Image from "@11ty/eleventy-img";
import path from "path";

export default function(eleventyConfig) {

  // Optimize writing images: convert markdown <img> to responsive <picture>
  // Images are processed through eleventy-img (same pipeline as optimizedImage shortcode)
  // and served as AVIF/WebP with responsive srcset. Original files remain available
  // for lightbox full-size view via data-full-src attribute.
  eleventyConfig.addTransform("optimizeWritingImages", async function(content) {
    const outputPath = this.page.outputPath;
    if (!outputPath || typeof outputPath !== 'string' || !outputPath.endsWith(".html")) return content;
    if (!this.page.inputPath?.includes("/writing/")) return content;

    const imgRegex = /<img\s+([^>]*?)src="(\/writing\/attachments\/[^"]+)"([^>]*?)\/?>/gi;
    const matches = [...content.matchAll(imgRegex)];

    if (!matches.length) return content;

    // Deduplicate: process each unique src once, in parallel
    const srcToMetadata = new Map();
    const uniqueSrcs = [...new Set(matches.map(m => m[2]))];

    console.log(`[writing-img] Optimizing ${uniqueSrcs.length} unique images in ${this.page.inputPath}`);

    await Promise.all(uniqueSrcs.map(async (src) => {
      const inputPath = `./src${src}`;
      const ext = path.extname(src).slice(1).toLowerCase();
      const fallbackFormat = ext === 'jpg' ? 'jpeg' : ext;
      const formats = ["avif", "webp"];
      if (!formats.includes(fallbackFormat)) {
        formats.push(fallbackFormat);
      }

      try {
        const metadata = await Image(inputPath, {
          widths: [400, 800, 1200],
          formats,
          outputDir: "./.cache/@11ty/img/",
          urlPath: "/assets/images/optimized/",
          filenameFormat: function(id, src, width, format) {
            const parentDir = path.basename(path.dirname(src));
            const name = path.basename(src, path.extname(src));
            const widthStr = width ? `${width}w` : 'original';
            return `${parentDir}-${name}-${widthStr}.${format}`;
          }
        });
        srcToMetadata.set(src, metadata);
      } catch (e) {
        console.error(`[writing-img] Failed to optimize ${src}:`, e.message);
      }
    }));

    // Replace matches in document order, building result from segments
    let result = '';
    let lastIndex = 0;

    for (const match of matches) {
      const [fullMatch, beforeSrc, src, afterSrc] = match;
      const metadata = srcToMetadata.get(src);

      result += content.slice(lastIndex, match.index);

      if (metadata) {
        const altMatch = (beforeSrc + afterSrc).match(/alt="([^"]*)"/);
        const alt = altMatch ? altMatch[1] : '';

        let pictureHtml = Image.generateHTML(metadata, {
          alt,
          sizes: "(max-width: 768px) 100vw, 42rem",
          loading: "lazy",
          decoding: "async",
        });

        // Store original path for lightbox full-size view
        pictureHtml = pictureHtml.replace('<img', `<img data-full-src="${src}"`);

        result += pictureHtml;
      } else {
        result += fullMatch;
      }

      lastIndex = match.index + fullMatch.length;
    }

    result += content.slice(lastIndex);
    return result;
  });
}
