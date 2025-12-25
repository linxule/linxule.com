/**
 * Eleventy Shortcodes
 * Custom shortcodes for image optimization and other content generation
 */

const Image = require("@11ty/eleventy-img");
const path = require("path");

module.exports = function(eleventyConfig) {

  // Optimized image shortcode - generates AVIF, WebP + responsive srcset
  eleventyConfig.addAsyncShortcode("optimizedImage", async function(src, alt, sizes = "50vw") {
    if (!src) return '';

    // Handle paths - convert /assets/... to ./src/assets/...
    const inputPath = src.startsWith('/') ? `./src${src}` : src;

    try {
      let metadata = await Image(inputPath, {
        widths: [400, 800, 1200, null], // null = original size
        formats: ["avif", "webp", "png"],
        outputDir: "./_site/assets/images/optimized/",
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
};
