/**
 * Eleventy Shortcodes
 * Custom shortcodes for image optimization and other content generation
 */

import Image from "@11ty/eleventy-img";
import path from "path";
import { existsSync, readFileSync } from "fs";

// Decode common HTML entities back to characters.
function decodeEntities(s) {
  return s
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–")
    .replace(/&hellip;/g, "…");
}

// Convert a single deck-stage <section data-label="..."> to paragraph-form text.
// Scope: deck-stage decks (custom typographic decks at /assets/slides/<slug>/).
// Other deck frameworks (Slidev, reveal.js, Canva embeds) skip extraction —
// the talk's md alternate falls back to link-only.
function extractSlidesMarkdown(html) {
  if (!/<deck-stage[\s>]/.test(html)) return null;

  const sectionRe = /<section\s+data-label="([^"]+)"[^>]*>([\s\S]*?)<\/section>/g;
  const slides = [];

  for (const match of html.matchAll(sectionRe)) {
    const label = match[1];
    let inner = match[2];

    // Drop nested style/script and the page-counter overlay
    inner = inner
      .replace(/<style[\s\S]*?<\/style>/g, "")
      .replace(/<script[\s\S]*?<\/script>/g, "")
      .replace(/<div\s+class="page-counter"[^>]*>[\s\S]*?<\/div>/g, "");

    // Headings → bold (so they don't fight the slide-label hierarchy in the
    // surrounding markdown). Internal <br> and stray whitespace collapse to
    // a single space so multi-line headings stay on one line.
    inner = inner.replace(/<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/g, (_, content) => {
      const collapsed = content
        .replace(/<br\s*\/?>/g, " ")
        .replace(/<[^>]+>/g, "")
        .replace(/\s+/g, " ")
        .trim();
      return collapsed ? `\n**${collapsed}**\n` : "";
    });

    // List items → "- " bullets
    inner = inner.replace(/<li[^>]*>([\s\S]*?)<\/li>/g, "\n- $1");

    // Block-ending tags become line breaks
    inner = inner.replace(/<br\s*\/?>/g, "\n");
    inner = inner.replace(/<\/(p|div|section|tr|li|ul|ol)>/g, "\n");

    // Strip everything else
    inner = inner.replace(/<[^>]+>/g, "");
    inner = decodeEntities(inner);

    // Per-line whitespace collapse, drop blanks
    inner = inner
      .split("\n")
      .map((line) => line.replace(/\s+/g, " ").trim())
      .filter(Boolean)
      .join("\n");

    if (inner) slides.push({ label, content: inner });
  }

  // Dedup consecutive slides whose normalized content is identical
  // (catches reveal-build pairs like "02 X" + "02b X — reveal" when the
  // static text is the same and only the visual state differs).
  const deduped = [];
  for (const slide of slides) {
    const last = deduped[deduped.length - 1];
    if (last && last.content === slide.content) {
      deduped[deduped.length - 1] = slide; // keep the later label (usually the "complete" reveal)
    } else {
      deduped.push(slide);
    }
  }

  return deduped.map((s) => `### ${s.label}\n\n${s.content}`).join("\n\n");
}

export default function(eleventyConfig) {

  // Slides outline shortcode — for the talk-md alternate.
  // Reads the local deck's index.html at build time, extracts a textual
  // outline if it's a deck-stage deck, returns an empty string otherwise.
  eleventyConfig.addShortcode("slidesOutline", function(slidesPath) {
    if (!slidesPath || typeof slidesPath !== "string" || !slidesPath.startsWith("/")) return "";

    const cleanPath = slidesPath.replace(/\/$/, "");
    const filePath = `./src${cleanPath}/index.html`;
    if (!existsSync(filePath)) return "";

    const html = readFileSync(filePath, "utf8");
    const extracted = extractSlidesMarkdown(html);
    if (!extracted) return "";

    return `\n\n---\n\n## Slide outline\n\n_Auto-extracted from the hosted deck for AI/RSS consumers. The visual deck at ${slidesPath} is canonical._\n\n${extracted}\n`;
  });

  // Optimized image shortcode - generates AVIF, WebP + responsive srcset
  eleventyConfig.addAsyncShortcode("optimizedImage", async function(src, alt, sizes = "50vw") {
    if (!src) return '';

    // Handle paths - convert /assets/... to ./src/assets/...
    const inputPath = src.startsWith('/') ? `./src${src}` : src;

    try {
      let metadata = await Image(inputPath, {
        widths: [400, 800, 1200, null], // null = original size
        formats: ["avif", "webp", "png"],
        outputDir: "./.cache/@11ty/img/",
        urlPath: "/assets/images/optimized/",
        filenameFormat: function (id, src, width, format) {
          // Include parent folder to avoid collisions (01.png exists in multiple folders)
          const parentDir = path.basename(path.dirname(src));
          const name = path.basename(src, path.extname(src));
          const widthStr = width ? `${width}w` : 'original';
          return `${parentDir}-${name}-${widthStr}.${format}`;
        }
      });

      let imageAttributes = {
        alt: alt || '',
        sizes,
        loading: "lazy",
        decoding: "async",
      };

      return Image.generateHTML(metadata, imageAttributes);
    } catch (e) {
      console.error(`Error processing image ${src}:`, e.message);
      // Fallback to original image if processing fails
      return `<img src="${src}" alt="${alt || ''}" loading="lazy">`;
    }
  });
}
