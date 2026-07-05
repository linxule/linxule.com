/**
 * Eleventy Filters
 * Custom filters for date formatting, string manipulation, and content extraction
 */

import { autoCardPath } from "./og-card-paths.js";
import { imageSize } from "image-size";
import { readFileSync } from "node:fs";

// Classify an image by aspect ratio for layout routing. Reads header dims only
// (image-size, no full decode) from the source file behind a public /assets path.
// Returns 'wide' | 'tall' | 'square', or null if the file can't be measured.
function aspectClassOf(src) {
  if (!src || typeof src !== "string") return null;
  try {
    const file = src.startsWith("/") ? `./src${src}` : src;
    const { width, height } = imageSize(readFileSync(file));
    if (!width || !height) return null;
    const ratio = width / height;
    return ratio > 1.15 ? "wide" : ratio < 0.87 ? "tall" : "square";
  } catch {
    return null;
  }
}

export default function(eleventyConfig) {

  // Auto-title social card for image-less content pages (writing w/o cover, HTML
  // artifacts). Returns the generated card path or null. See .claude/rules/og-images.md.
  eleventyConfig.addFilter("autoCardPath", (fileSlug, layout) => autoCardPath(fileSlug, layout));

  // Date formatting
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return new Date(dateObj).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      timeZone: 'UTC'
    });
  });

  // ISO date format (YYYY-MM-DD)
  eleventyConfig.addFilter("isoDate", (dateObj) => {
    const date = dateObj ? new Date(dateObj) : new Date();
    return date.toISOString().split('T')[0];
  });

  // URL-safe slug generation
  eleventyConfig.addFilter("slugify", (str) => {
    return str.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
  });

  // Number padding
  eleventyConfig.addFilter("padStart", (num, length, char) => {
    return String(num).padStart(length, char);
  });

  // String conversion
  eleventyConfig.addFilter("string", (value) => {
    return String(value);
  });

  // Canonical path helper for extension-style alternates.
  eleventyConfig.addFilter("stripTrailingSlash", (value) => {
    return String(value || '').replace(/\/$/, '');
  });

  // Extract prompter family (first word)
  eleventyConfig.addFilter("prompterFamily", (prompter) => {
    if (!prompter) return null;
    const parts = prompter.split(' ');
    return parts[0].toLowerCase();
  });

  // Extract prompter model (everything after first word)
  eleventyConfig.addFilter("prompterModel", (prompter) => {
    if (!prompter) return null;
    const parts = prompter.split(' ');
    return parts.slice(1).join(' ') || null;
  });

  // Extract creator family (first word): "opus 4.5" → "opus"
  eleventyConfig.addFilter("creatorFamily", (creator) => {
    if (!creator) return null;
    const parts = creator.split(' ');
    return parts[0].toLowerCase();
  });

  // Extract creator model (everything after first word): "opus 4.5" → "4.5"
  eleventyConfig.addFilter("creatorModel", (creator) => {
    if (!creator) return null;
    const parts = creator.split(' ');
    return parts.slice(1).join(' ') || null;
  });

  // Deterministic layout picker. A uniform set of ≤4 same-shape images gets one
  // of three orientation-matched variants, hashed by slug → stable per page,
  // varied across pages ("structured randomness", design.md). Sets that break
  // those variants' assumptions route to a shape-aware layout instead:
  //   • heterogeneous aspect (or `orientation: mixed`) → 'salon': a hero leads,
  //     the rest hang sized by their own aspect (tall frames stay featured-tall).
  //   • uniform shape but >4 images → 'mosaic': one equal-size array (the scatter
  //     variants only position 4 and assume a single shape).
  // This keeps a tall frame from overrunning `drift`'s absolute positions, and a
  // 7th image from landing unpositioned.
  eleventyConfig.addFilter("layoutVariant", (slug, orientation, images) => {
    if (!slug) return 'drift';

    if (orientation === 'mixed') return 'salon';
    if (Array.isArray(images)) {
      const classes = images.map(im => aspectClassOf(im && im.src)).filter(Boolean);
      const heterogeneous = classes.length > 1 && !classes.every(c => c === classes[0]);
      if (heterogeneous) return 'salon';        // mixed shapes → hero + aspect-featured strip
      if (images.length > 4) return 'mosaic';   // uniform but too many for the scatter variants → equal-size array
    }

    // Uniform sets: stable, varied pick within the orientation's layout family.
    const landscapeLayouts = ['drift', 'column', 'focus'];
    const portraitLayouts = ['stack', 'grid', 'filmstrip'];

    const layouts = orientation === 'portrait' ? portraitLayouts : landscapeLayouts;

    let hash = 0;
    for (let i = 0; i < slug.length; i++) {
      hash = ((hash << 5) - hash) + slug.charCodeAt(i);
      hash = hash & hash;
    }
    return layouts[Math.abs(hash) % layouts.length];
  });

  // Per-image aspect class for the salon layout's supporting frames, so a tall
  // frame is featured at portrait height instead of squashed to a wide's height.
  // Returns 'is-wide' | 'is-tall' | 'is-square' (empty if unmeasurable).
  eleventyConfig.addFilter("aspectClass", (src) => {
    const cls = aspectClassOf(src);
    return cls ? `is-${cls}` : "";
  });

  // Extract opening excerpt from content (fallback only — prefer frontmatter description)
  eleventyConfig.addFilter("excerpt", (content, length = 200) => {
    if (!content) return '';
    // Strip HTML tags
    const text = content.replace(/<[^>]+>/g, '');
    // Get first non-empty paragraph (split by double newline)
    const paras = text.split(/\n\n/).map(p => p.trim()).filter(p => p.length > 0);
    const firstPara = paras[0] || '';
    // Truncate if needed
    if (firstPara.length > length) {
      return firstPara.slice(0, length).trim() + '...';
    }
    return firstPara;
  });

  // Strip HTML tags for clean markdown output (used in .md templates)
  eleventyConfig.addFilter("striptags", (str) => {
    if (!str) return '';
    return str
      .replace(/<br\s*\/?>/gi, '\n\n')  // Convert <br> to newlines
      .replace(/<[^>]+>/g, '')           // Strip remaining HTML tags
      .trim();
  });

  // Combine and sort multiple arrays by date (newest first)
  eleventyConfig.addFilter("combineByDate", (...arrays) => {
    const combined = arrays.flat().filter(item => item && item.date);
    return combined.sort((a, b) => new Date(b.date) - new Date(a.date));
  });

  // Check if a source path is an HTML file (for iframe embedding)
  eleventyConfig.addFilter("isHTMLFile", (src) => {
    if (!src) return false;
    return src.toLowerCase().endsWith('.html') || src.toLowerCase().endsWith('.htm');
  });

  // Map a hero image path to its small 1200×630 social card for og:image, so a
  // raw multi-MB source (or an SVG, which most scrapers can't render) is never
  // served as the social card. Cards are generated by scripts/gen-og-cards.mjs:
  //   /assets/images/portraits/<dir>/<file>.png|webp → <dir>/og.jpg (cropped)
  //   /writing/attachments/<name>.png|webp           → <name>-og.jpg (cropped)
  //   /assets/images/artifacts/<name>.svg            → <name>-og.jpg (rasterized on paper)
  //   already a card (.jpg/.jpeg), a non-artifact vector, the default, or external → unchanged.
  // Full rationale + cache discipline in .claude/rules/og-images.md.
  eleventyConfig.addFilter("ogCard", (src) => {
    if (!src || typeof src !== "string") return src;
    const artifactSvg = src.match(/^\/assets\/images\/artifacts\/([^/]+)\.svg$/i);
    if (artifactSvg) return `/assets/images/artifacts/${artifactSvg[1]}-og.jpg`;
    const lower = src.toLowerCase();
    if (lower.endsWith(".jpg") || lower.endsWith(".jpeg") || lower.endsWith(".svg")) return src;
    const portrait = src.match(/^(\/assets\/images\/portraits\/[^/]+)\/[^/]+\.(?:png|webp)$/i);
    if (portrait) return `${portrait[1]}/og.jpg`;
    const cover = src.match(/^\/writing\/attachments\/([^/]+)\.(?:png|webp)$/i);
    if (cover) return `/writing/attachments/${cover[1]}-og.jpg`;
    return src;
  });

  // Get content type from page URL for feed entries
  eleventyConfig.addFilter("contentType", (url) => {
    if (url.startsWith('/writing/')) return 'writing';
    if (url.startsWith('/making/portraits/')) return 'portrait';
    if (url.startsWith('/making/artifacts/')) return 'artifact';
    if (url.startsWith('/talks/')) return 'talk';
    return 'page';
  });
}
