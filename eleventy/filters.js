/**
 * Eleventy Filters
 * Custom filters for date formatting, string manipulation, and content extraction
 */

import { autoCardPath, ogCard, resolveSocialCard } from "./og-card-paths.js";
import { imageAttributes, resolveOptimizedAttachmentUrl } from "./image-pipeline.js";
import { COLLECTION_TWINS, mdAlternateForUrl } from "./shapes.mjs";
import { creditFamily, creditModel, slugify } from "./strings.js";
import sharp from "sharp";
import { decodeHTML } from "entities";

// The Markdown twin of a body. Source bodies are Markdown with a little HTML in
// them (accident spans, <br>, one <details> of liner notes); the twin says the
// same thing in Markdown alone. Code is quoted, never translated: fenced blocks
// and inline code spans pass through byte for byte.
const FENCE = /^[ \t]*(`{3,}|~{3,})[^\n]*\n[\s\S]*?^[ \t]*\1[ \t]*$/gm;
const CODE_SPAN = /(`+)(?!`)[^\n]*?(?<!`)\1(?!`)/g;
const DETAILS = /<details\b[^>]*>([\s\S]*?)<\/details>/gi;
const ACCIDENT = /<span\b[^>]*\bclass=(["'])(?:[^"']*\s)?accident(?:\s[^"']*)?\1[^>]*>([\s\S]*?)<\/span>/gi;
const SCRIPT_BLOCK = /<script\b[\s\S]*?<\/script\s*>/gi;
const EMPTY_DFN_ANCHOR = /<a\b[^>]*\bid=(["'])dfn-[^"']*\1[^>]*>\s*<\/a>/gi;
const BREAK = /<br\s*\/?>/.source;

function weave(text, pattern, onMatch, onRest) {
  let out = "";
  let last = 0;
  for (const match of text.matchAll(pattern)) {
    out += onRest(text.slice(last, match.index)) + onMatch(match);
    last = match.index + match[0].length;
  }
  return out + onRest(text.slice(last));
}

// A <br> that opens a list item is a spacer on the HTML page and nothing in
// Markdown; one that ends a paragraph breaks nothing; any other is a hard break
// (two trailing spaces), so the lines stay one paragraph, or one list item.
function lineBreaks(text) {
  return text
    .replace(new RegExp(`^([ \\t]*(?:[-*+]|\\d+[.)])[ \\t]+)${BREAK}[ \\t]*`, "gim"), "$1")
    .replace(new RegExp(`${BREAK}[ \\t]*(?=\\n[ \\t]*\\n)`, "gi"), "")
    .replace(new RegExp(`${BREAK}[ \\t]*\\n?`, "gi"), "  \n");
}

function rewriteWritingAttachmentUrls(text) {
  // Rewrite Markdown image/link targets pointing at `/writing/attachments/<name>.<ext>`
  // (excluding `*-og.jpg`) to their deterministic optimized `/assets/images/optimized/` URL,
  // preserving any optional origin prefix, query/fragment, and Markdown title.
  const rewrittenMd = text.replace(
    /(\!?\[[^\]]*\]\(\s*)(https?:\/\/linxule\.com)?(\/writing\/attachments\/[^\s)"']+)/gi,
    (match, prefix, origin = "", rawUrl) => {
      const suffixMatch = rawUrl.match(/^([^?#]+)([?#].*)?$/);
      const pathname = suffixMatch ? suffixMatch[1] : rawUrl;
      const suffix = suffixMatch?.[2] || "";
      const optimized = resolveOptimizedAttachmentUrl(pathname);
      if (!optimized) return match;
      return `${prefix}${origin}${optimized}${suffix}`;
    },
  );

  // Also rewrite raw inline HTML <img src="/writing/attachments/..."> attributes if any exist.
  return rewrittenMd.replace(
    /(<img\b[^>]*\bsrc=)(["'])(https?:\/\/linxule\.com)?(\/writing\/attachments\/[^"']+)\2/gi,
    (match, prefix, quote, origin = "", rawUrl) => {
      const suffixMatch = rawUrl.match(/^([^?#]+)([?#].*)?$/);
      const pathname = suffixMatch ? suffixMatch[1] : rawUrl;
      const suffix = suffixMatch?.[2] || "";
      const optimized = resolveOptimizedAttachmentUrl(pathname);
      if (!optimized) return match;
      return `${prefix}${quote}${origin}${optimized}${suffix}${quote}`;
    },
  );
}

function proseToMarkdown(text) {
  const cleaned = text
    .replace(SCRIPT_BLOCK, "")
    .replace(EMPTY_DFN_ANCHOR, "")
    .replace(ACCIDENT, "*$2* *(accident)*");
  return decodeHTML(lineBreaks(rewriteWritingAttachmentUrls(cleaned)));
}

export function htmlToMarkdown(html) {
  if (!html) return "";
  const tidy = text => text.replace(/[ \t]+$/gm, match => (match === "  " ? match : "")).replace(/\n{3,}/g, "\n\n").trim();
  const blocks = text => text
    .replace(/<\/li>\s*/gi, "")
    .replace(/<ol\b[^>]*>([\s\S]*?)<\/ol>/gi, (_, items) => {
      let n = 0;
      return `\n\n${items.replace(/<li\b[^>]*>/gi, () => `\n${++n}. `)}\n\n`;
    })
    .replace(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi, (_, level, heading) => `\n\n${"#".repeat(Number(level))} ${heading.trim()}\n\n`)
    .replace(/<li\b[^>]*>/gi, "\n- ")
    .replace(/<hr\b[^>]*>/gi, "\n\n---\n\n")
    .replace(/<\/?(?:p|ul|div)\b[^>]*>/gi, "\n\n");
  const stripped = String(html)
    .replace(SCRIPT_BLOCK, "")
    .replace(/<style\b[\s\S]*?<\/style\s*>/gi, "");
  const text = blocks(stripped
    .replace(/<summary\b[^>]*>([\s\S]*?)<\/summary>/gi, "\n\n**$1**\n\n")
    .replace(/<blockquote\b[^>]*>([\s\S]*?)<\/blockquote>/gi, (_, quoted) =>
      `\n\n${tidy(blocks(quoted)).replace(/^/gm, "> ").replace(/^> $/gm, ">")}\n\n`))
    .replace(ACCIDENT, "*$2* *(accident)*")
    .replace(/<(strong|b)\b[^>]*>([\s\S]*?)<\/\1>/gi, "**$2**")
    .replace(/<(em|i)\b[^>]*>([\s\S]*?)<\/\1>/gi, "*$2*")
    .replace(/<code\b[^>]*>([\s\S]*?)<\/code>/gi, "`$1`")
    .replace(/<a\b[^>]*\bhref=(["'])(.*?)\1[^>]*>([\s\S]*?)<\/a>/gi, "[$3]($2)");
  return decodeHTML(tidy(lineBreaks(text).replace(/<\/?[a-z][^>]*>/gi, "")));
}

export function markdownBody(value) {
  if (!value) return "";
  const source = String(value).replace(/\{%-?\s*(?:end)?raw\s*-?%\}/g, "");
  return weave(source, FENCE, match => match[0], outsideFences =>
    weave(outsideFences, DETAILS, match => `\n\n${htmlToMarkdown(match[1])}\n\n`, outsideDetails =>
      weave(outsideDetails, CODE_SPAN, match => match[0], proseToMarkdown)));
}

export function stripTrailingSlash(value) {
  const s = String(value || "");
  if (!s || s === "/") return s;
  return s.replace(/\/+$/, "") || "/";
}

const CV_ZH_SECTION_SLUGS = {
  学术任职: "academic-appointments",
  教育背景: "education",
  研究兴趣: "research-interests",
  奖项与资助: "awards-and-grants",
  发表论文: "publications",
  审稿中论文: "under-review",
  工作论文: "working-papers",
  公共学术: "public-scholarship",
  组织研讨会: "organized-symposia",
  学术报告: "presentations",
  客座讲座: "guest-lectures",
  教学经历: "teaching",
  学术经历: "academic-experience",
  技能: "skills",
  "软件、数据与研究成果": "software-data-research-artifacts",
  审稿服务: "reviewing",
  服务: "service",
  专业协会: "professional-affiliations",
  语言: "languages",
  推荐人: "references",
};

export function readableDateZh(dateObj) {
  const date = new Date(dateObj);
  return `${date.getUTCFullYear()}年${date.getUTCMonth() + 1}月`;
}

/**
 * Word-boundary-clean truncation with a single ellipsis (`…`).
 * Never cuts mid-word on space-delimited prose and trims trailing punctuation
 * or dashes before the ellipsis.
 */
export function truncateWords(value, length = 147) {
  if (value == null) return "";
  const str = String(value).replace(/\s+/g, " ").trim();
  if (str.length <= length) return str;
  const slice = str.slice(0, length);
  const lastSpace = slice.lastIndexOf(" ");
  let head = lastSpace > Math.floor(length * 0.5) ? slice.slice(0, lastSpace) : slice;
  head = head.replace(/[\s,;:\-—–(]+$/u, "").trim();
  return `${head}…`;
}

function cvSectionSlug(inner) {
  const plain = decodeHTML(String(inner).replace(/<[^>]+>/g, "")).trim();
  if (!plain) return "";
  if (CV_ZH_SECTION_SLUGS[plain]) return CV_ZH_SECTION_SLUGS[plain];
  return slugify(plain).replace(/-+/g, "-").replace(/^-|-$/g, "");
}

/**
 * Normalize CV HTML heading hierarchy without editing raw `#` headings in `src/cv/index.md`
 * or `src/cv-zh/index.md`:
 *   - opening `<h2>Name</h2>` -> `<h1>Name</h1>`
 *   - opening `<h3>contact</h3>` lines before the first section -> `<p class="cv-contact">...</p>`
 *   - all section `<h1>...</h1>` headings -> `<h2 id="<slug>">...</h2>` (preserving attributes and inner HTML)
 */
export function cvHtml(html) {
  if (!html) return "";
  let promotedName = false;
  let seenSection = false;
  const usedIds = new Set();
  return String(html).replace(
    /<(h[123])(\b[^>]*)>([\s\S]*?)<\/\1>/gi,
    (match, tag, attrs, inner) => {
      const lower = tag.toLowerCase();
      if (lower === "h1") {
        seenSection = true;
        if (/\bid\s*=/i.test(attrs)) {
          return `<h2${attrs}>${inner}</h2>`;
        }
        const base = cvSectionSlug(inner);
        if (!base) return `<h2${attrs}>${inner}</h2>`;
        let id = base;
        for (let n = 2; usedIds.has(id); n++) id = `${base}-${n}`;
        usedIds.add(id);
        return `<h2 id="${id}"${attrs}>${inner}</h2>`;
      }
      if (lower === "h2" && !seenSection && !promotedName) {
        promotedName = true;
        return `<h1${attrs}>${inner}</h1>`;
      }
      if (lower === "h3" && !seenSection) {
        if (/\bclass\s*=\s*"([^"]*)"/i.test(attrs)) {
          const merged = attrs.replace(/\bclass\s*=\s*"([^"]*)"/i, (_, cls) => `class="${cls} cv-contact"`);
          return `<p${merged}>${inner}</p>`;
        }
        return `<p class="cv-contact"${attrs}>${inner}</p>`;
      }
      return match;
    },
  );
}

// Classify an image by aspect ratio for layout routing. Reads header dims only
// (Sharp metadata, no full decode) from the source file behind a public /assets path.
// Returns 'wide' | 'tall' | 'square', or null if the file can't be measured.
async function aspectClassOf(src) {
  if (!src || typeof src !== "string") return null;
  try {
    const file = src.startsWith("/") ? `./src${src}` : src;
    const { width, height } = await sharp(file).metadata();
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
  eleventyConfig.addFilter("autoCardPath", autoCardPath);
  eleventyConfig.addFilter("socialCard", (data, content = "") => {
    // Cover alternatives belong to the matching image, never the page synopsis.
    const imageTags = String(content).match(/<img\b(?:[^>"']|"[^"]*"|'[^']*')*>/gi) || [];
    const cover = imageTags.map(imageAttributes).find((img) =>
      (img["data-full-src"] || img.src) === data.ogImage
    );
    return resolveSocialCard(data, cover?.alt);
  });

  // Markdown twin alternate URL from unified shapes registry
  eleventyConfig.addFilter("mdAlternate", mdAlternateForUrl);

  // Date formatting
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return new Date(dateObj).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      timeZone: 'UTC'
    });
  });

  eleventyConfig.addFilter("readableDateZh", readableDateZh);
  eleventyConfig.addFilter("truncateWords", truncateWords);

  // ISO date format (YYYY-MM-DD)
  eleventyConfig.addFilter("isoDate", (dateObj) => {
    const date = dateObj ? new Date(dateObj) : new Date();
    return date.toISOString().split('T')[0];
  });

  // URL-safe slug generation
  eleventyConfig.addFilter("slugify", slugify);

  // Number padding
  eleventyConfig.addFilter("padStart", (num, length, char) => {
    return String(num).padStart(length, char);
  });

  // String conversion
  eleventyConfig.addFilter("string", (value) => {
    return String(value);
  });

  // Canonical path helper for extension-style alternates and slashless URLs.
  eleventyConfig.addFilter("stripTrailingSlash", stripTrailingSlash);

  // Extract prompter / creator family & model via shared credit normalizer
  eleventyConfig.addFilter("prompterFamily", creditFamily);
  eleventyConfig.addFilter("prompterModel", creditModel);
  eleventyConfig.addFilter("creatorFamily", creditFamily);
  eleventyConfig.addFilter("creatorModel", creditModel);

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
  eleventyConfig.addFilter("layoutVariant", async (slug, orientation, images) => {
    if (!slug) return 'drift';

    if (orientation === 'mixed') return 'salon';
    if (Array.isArray(images)) {
      const classes = (await Promise.all(images.map(im => aspectClassOf(im && im.src)))).filter(Boolean);
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
  eleventyConfig.addFilter("aspectClass", async (src) => {
    const cls = await aspectClassOf(src);
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
    // Truncate cleanly at a word boundary if needed
    return truncateWords(firstPara, length);
  });

  // Strip HTML tags for clean markdown output (used in .md templates)
  eleventyConfig.addFilter("striptags", (str) => {
    if (!str) return '';
    return str
      .replace(/<br\s*\/?>/gi, '\n\n')  // Convert <br> to newlines
      .replace(/<[^>]+>/g, '')           // Strip remaining HTML tags
      .trim();
  });

  eleventyConfig.addFilter("htmlToMarkdown", htmlToMarkdown);
  eleventyConfig.addFilter("markdownBody", markdownBody);
  eleventyConfig.addFilter("cvHtml", cvHtml);

  // Combine and sort multiple arrays by date (newest first)
  eleventyConfig.addFilter("combineByDate", (...arrays) => {
    const combined = arrays.flat().filter(item => item && item.date);
    return combined.sort((a, b) => new Date(b.date) - new Date(a.date));
  });

  // Feed selection with a per-shape floor: the newest `limit` items overall,
  // PLUS the newest `minPerShape` of every shape, so a burst of one content
  // type (e.g. an artifact wave) can never push a whole shape out of the feed.
  // The renderings lint requires every shape to surface in feed.xml.
  eleventyConfig.addFilter("feedSelection", (combined, limit, minPerShape, ...shapes) => {
    const chosen = new Set(combined.slice(0, limit).map(item => item.url));
    for (const shape of shapes) {
      const sorted = (shape || []).filter(item => item && item.date)
        .sort((a, b) => new Date(b.date) - new Date(a.date));
      for (const item of sorted.slice(0, minPerShape)) chosen.add(item.url);
    }
    return combined.filter(item => chosen.has(item.url));
  });

  // Check if a source path is an HTML file (for iframe embedding)
  eleventyConfig.addFilter("isHTMLFile", (src) => {
    if (!src) return false;
    return src.toLowerCase().endsWith('.html') || src.toLowerCase().endsWith('.htm');
  });

  // Shared with the card generator so URL normalization cannot drift.
  eleventyConfig.addFilter("ogCard", ogCard);

  // Get content type from page URL for feed entries (derived from shapes registry)
  eleventyConfig.addFilter("contentType", (url) => {
    if (!url || typeof url !== "string") return "page";
    for (const shape of COLLECTION_TWINS) {
      if (url.startsWith(shape.urlPrefix)) return shape.pagefindType;
    }
    return "page";
  });
}
