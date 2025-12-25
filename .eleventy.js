const markdownIt = require("markdown-it");
const markdownItFootnote = require("markdown-it-footnote");

// Modular configuration
const collections = require('./eleventy/collections');
const filters = require('./eleventy/filters');
const shortcodes = require('./eleventy/shortcodes');

module.exports = function(eleventyConfig) {

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

  // Register modular configuration
  collections(eleventyConfig);
  filters(eleventyConfig);
  shortcodes(eleventyConfig);

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
};
