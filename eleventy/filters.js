/**
 * Eleventy Filters
 * Custom filters for date formatting, string manipulation, and content extraction
 */

module.exports = function(eleventyConfig) {

  // Date formatting
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return new Date(dateObj).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
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

  // Deterministic layout picker based on slug hash and orientation
  eleventyConfig.addFilter("layoutVariant", (slug, orientation) => {
    if (!slug) return 'drift';

    // Different layout sets for different orientations
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

  // Extract opening excerpt from content
  eleventyConfig.addFilter("excerpt", (content, length = 200) => {
    if (!content) return '';
    // Strip HTML tags
    const text = content.replace(/<[^>]+>/g, '');
    // Get first paragraph (split by double newline)
    const firstPara = text.split(/\n\n/)[0].trim();
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

  // Get content type from page URL for feed entries
  eleventyConfig.addFilter("contentType", (url) => {
    if (url.startsWith('/writing/')) return 'writing';
    if (url.startsWith('/making/portraits/')) return 'portrait';
    if (url.startsWith('/making/artifacts/')) return 'artifact';
    if (url.startsWith('/talks/')) return 'talk';
    return 'page';
  });
};
