/**
 * Eleventy Shortcodes
 * Custom shortcodes for image optimization and other content generation
 */

import Image from "@11ty/eleventy-img";
import sharp from "sharp";
import { existsSync, readFileSync } from "fs";
import { decodeHTML, escapeAttribute } from "entities";
import {
  GALLERY_FORMATS,
  GALLERY_WIDTHS,
  galleryViewUrl,
  imageOptions,
  imageHTML,
  recordOptimizedMetadata,
} from "./image-pipeline.js";

// Convert a single deck-stage <section data-label="..."> to paragraph-form text.
// Scope: deck-stage decks (custom typographic decks at /assets/slides/<slug>/).
// Other deck frameworks (Slidev, reveal.js, Canva embeds) skip extraction —
// the talk's md alternate falls back to link-only.
function extractSlidesMarkdown(html) {
  if (!/<deck-stage[\s>]/.test(html)) return null;

  // Attributes may precede data-label (e.g. <section class="g-white" data-label="…">).
  // Script blocks are dropped first so deck-stage.js's own doc comment, which
  // contains example <section data-label> markup, is never read as a slide.
  const sectionRe = /<section\b[^>]*?\sdata-label="([^"]+)"[^>]*>([\s\S]*?)<\/section>/g;
  const slides = [];
  html = html.replace(/<script[\s\S]*?<\/script>/g, "");

  for (const match of html.matchAll(sectionRe)) {
    const label = decodeHTML(match[1]);
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
    inner = decodeHTML(inner);

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

  // Gallery JSON for the lightbox: src stays the original (identity + download),
  // view is the large generated variant the lightbox actually displays.
  // Strips unused `interpretation` prose to keep inline gallery JSON lean.
  eleventyConfig.addAsyncFilter("galleryItems", async function(images) {
    return Promise.all((images || []).map(async (image) => {
      const { interpretation, ...rest } = image;
      const view = await galleryViewUrl(image.src);
      return { ...rest, view };
    }));
  });

  // Optimized image shortcode - generates AVIF, WebP + responsive srcset.
  // Fails loudly on missing local images instead of silently shipping raw/broken URLs.
  eleventyConfig.addAsyncShortcode(
    "optimizedImage",
    async function(src, alt, sizes = "50vw", className = "", loading = "lazy", fetchpriority = null) {
      if (!src) return "";

      const inputPath = src.startsWith("/") ? `./src${src}` : src;
      const isLocal = !/^https?:\/\//i.test(src);
      const cleanInput = inputPath.split(/[?#]/, 1)[0];
      if (isLocal && !existsSync(cleanInput)) {
        throw new Error(`[optimizedImage] Missing local image: ${src} (resolved to ${cleanInput})`);
      }

      if (isLocal && /\.(?:svg|gif)$/i.test(cleanInput)) {
        const meta = await sharp(cleanInput).metadata();
        const dims = meta.width && meta.height ? ` width="${meta.width}" height="${meta.height}"` : "";
        const cls = className ? ` class="${escapeAttribute(String(className))}"` : "";
        const prio = fetchpriority ? ` fetchpriority="${escapeAttribute(String(fetchpriority))}"` : "";
        return `<img src="${escapeAttribute(String(src))}" alt="${escapeAttribute(String(alt || ""))}"${dims}${cls} loading="${escapeAttribute(String(loading || "lazy"))}" decoding="async"${prio}>`;
      }

      const metadata = await Image(cleanInput, imageOptions(GALLERY_WIDTHS, GALLERY_FORMATS));
      recordOptimizedMetadata(metadata);

      const imageAttributes = {
        alt: alt || "",
        sizes: sizes || "50vw",
        loading: loading || "lazy",
        decoding: "async",
      };
      if (className) imageAttributes.class = className;
      if (fetchpriority) imageAttributes.fetchpriority = fetchpriority;

      return imageHTML(metadata, imageAttributes);
    },
  );
}
