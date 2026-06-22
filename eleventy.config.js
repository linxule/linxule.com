import markdownIt from "markdown-it";
import markdownItFootnote from "markdown-it-footnote";
import fs from "fs";

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

  // Register modular configuration
  collections(eleventyConfig);
  filters(eleventyConfig);
  shortcodes(eleventyConfig);
  transforms(eleventyConfig);

  // Copy cached optimized images to build output after build (incremental:
  // copy a file only when the destination is absent or differs in size, so a
  // build with no image changes is a near-noop instead of re-copying ~886MB).
  eleventyConfig.on("eleventy.after", () => {
    const cacheDir = ".cache/@11ty/img/";
    const outputDir = "_site/assets/images/optimized/";
    if (!fs.existsSync(cacheDir)) return;

    const copyIncremental = (srcDir, destDir) => {
      fs.mkdirSync(destDir, { recursive: true });
      for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
        const srcPath = srcDir + "/" + entry.name;
        const destPath = destDir + "/" + entry.name;
        if (entry.isDirectory()) {
          copyIncremental(srcPath, destPath);
        } else if (entry.isFile()) {
          let needsCopy = true;
          try {
            const destStat = fs.statSync(destPath);
            const srcStat = fs.statSync(srcPath);
            // Fresh if same size AND dest is at least as new as src. eleventy-img
            // bumps the cache file's mtime when it re-encodes, so an in-place
            // re-encode at an identical byte size still triggers a re-copy.
            if (destStat.size === srcStat.size && srcStat.mtimeMs <= destStat.mtimeMs) needsCopy = false;
          } catch {
            // destination absent → needs copy
          }
          if (needsCopy) fs.copyFileSync(srcPath, destPath);
        }
      }
    };

    copyIncremental(cacheDir.replace(/\/$/, ""), outputDir.replace(/\/$/, ""));
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
