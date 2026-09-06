import markdownIt from "markdown-it";
import markdownItFootnote from "markdown-it-footnote";
import path from "node:path";
import { syncImageCache } from "./scripts/lib/image-cache.mjs";
import { IMAGE_CACHE_DIR, IMAGE_URL_PATH } from "./eleventy/image-pipeline.js";

import collections from './eleventy/collections.js';
import filters from './eleventy/filters.js';
import shortcodes from './eleventy/shortcodes.js';
import transforms from './eleventy/transforms.js';

export default function(eleventyConfig) {

  // Markdown with footnotes (custom marginalia rendering)
  const md = markdownIt({
    html: true,
    breaks: false,
    linkify: true
  }).use(markdownItFootnote);

  // Customize footnote output for marginalia
  md.renderer.rules.footnote_ref = (tokens, idx, options, env, slf) => {
    const id = slf.rules.footnote_anchor_name(tokens, idx, options, env, slf);
    return `<a href="#fn${id}" class="fn-ref">${id}</a>`;
  };

  md.renderer.rules.footnote_block_open = () => '<aside class="marginalia">\n';
  md.renderer.rules.footnote_block_close = () => '</aside>\n';

  md.renderer.rules.footnote_open = (tokens, idx, options, env, slf) => {
    const id = slf.rules.footnote_anchor_name(tokens, idx, options, env, slf);
    return `<div class="margin-note" id="fn${id}"><span class="fn-num">${id}</span> `;
  };

  md.renderer.rules.footnote_close = () => '</div>\n';
  md.renderer.rules.footnote_anchor = () => ''; // Remove back-links

  eleventyConfig.setLibrary("md", md);

  // Passthrough copy
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/writing/attachments");
  // TSM demo — self-contained static sub-app, copied verbatim, served at /tsm/
  eleventyConfig.addPassthroughCopy("src/tsm");
  // Papers — self-hosted PDFs co-located with each paper's landing page (Google Scholar)
  eleventyConfig.addPassthroughCopy("src/papers/**/*.pdf");
  // Agent Skills Discovery — raw skill artifacts served from the well-known path
  eleventyConfig.addPassthroughCopy({ "agent-skills": ".well-known/agent-skills" });

  // Register modular configuration
  collections(eleventyConfig);
  filters(eleventyConfig);
  shortcodes(eleventyConfig);
  transforms(eleventyConfig);

  // Use the same incremental copy policy as persisted-cache synchronization.
  // Respect --output and programmatic builds instead of always writing _site.
  eleventyConfig.on("eleventy.after", async ({ dir }) => {
    await syncImageCache(IMAGE_CACHE_DIR, path.join(dir.output, IMAGE_URL_PATH));
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data"
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
}
