import markdownIt from "markdown-it";
import markdownItFootnote from "markdown-it-footnote";
import path from "node:path";
import { syncImageCache } from "./scripts/lib/image-cache.mjs";
import { IMAGE_CACHE_DIR, IMAGE_URL_PATH } from "./eleventy/image-pipeline.js";

import collections from './eleventy/collections.js';
import filters from './eleventy/filters.js';
import shortcodes from './eleventy/shortcodes.js';
import transforms from './eleventy/transforms.js';
import renderingFidelity from './eleventy/rendering-fidelity.js';

export default function(eleventyConfig) {

  // Markdown with footnotes (custom marginalia rendering)
  const md = markdownIt({
    html: true,
    breaks: false,
    linkify: true
  }).use(markdownItFootnote);

  // Markdown 15 disables bare-domain links by default; preserve existing prose.
  md.linkify.set({ fuzzyLink: true });

  // Customize footnote output for marginalia
  md.renderer.rules.footnote_ref = (tokens, idx, options, env, slf) => {
    const id = slf.rules.footnote_anchor_name(tokens, idx, options, env, slf);
    const { id: noteId, subId } = tokens[idx].meta;
    const refId = subId > 0 ? `${id}:${subId}` : id;
    return `<a href="#fn${md.utils.escapeHtml(id)}" id="fnref${md.utils.escapeHtml(refId)}" class="fn-ref" role="doc-noteref" aria-label="Note ${noteId + 1}">${noteId + 1}</a>`;
  };

  md.renderer.rules.footnote_block_open = () => '<aside class="marginalia">\n';
  md.renderer.rules.footnote_block_close = () => '</aside>\n';

  md.renderer.rules.footnote_open = (tokens, idx, options, env, slf) => {
    const id = slf.rules.footnote_anchor_name(tokens, idx, options, env, slf);
    return `<div class="margin-note" id="fn${md.utils.escapeHtml(id)}" tabindex="-1"><span class="fn-num">${tokens[idx].meta.id + 1}</span> `;
  };

  md.renderer.rules.footnote_close = () => '</div>\n';
  md.renderer.rules.footnote_anchor = (tokens, idx, options, env, slf) => {
    const id = slf.rules.footnote_anchor_name(tokens, idx, options, env, slf);
    const { id: noteId, subId } = tokens[idx].meta;
    const refId = subId > 0 ? `${id}:${subId}` : id;
    const repeated = env.footnotes.list[noteId].count > 1;
    const label = `Return to reference ${noteId + 1}${repeated ? ` (${subId + 1})` : ''}`;
    // A distinct return destination for every mention, shown only in endnote mode.
    return ` <a href="#fnref${md.utils.escapeHtml(refId)}" class="fn-backref" role="doc-backlink" aria-label="${label}">return to text${repeated ? ` ${subId + 1}` : ''}</a>`;
  };

  // Keep the native table inside a keyboard-scrollable region instead of
  // allowing its minimum width to widen (and clip) the entire article.
  md.renderer.rules.table_open = (tokens, idx, options, env, slf) =>
    '<div class="table-scroll" role="region" aria-label="Scrollable table" tabindex="0">\n' + slf.renderToken(tokens, idx, options);
  md.renderer.rules.table_close = () => '</table>\n</div>\n';

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
  renderingFidelity(eleventyConfig);
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
