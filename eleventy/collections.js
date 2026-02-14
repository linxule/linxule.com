/**
 * Eleventy Collections
 * Defines all content collections for writing, portraits, thinking, and tag aggregations
 */

module.exports = function(eleventyConfig) {

  // Writing collection - sorted newest first
  eleventyConfig.addCollection("writing", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/writing/**/*.md").sort((a, b) => {
      return b.date - a.date;
    });
  });

  // Portraits collection - with series numbering
  eleventyConfig.addCollection("portraits", function(collectionApi) {
    const allPortraits = collectionApi.getFilteredByGlob("src/making/portraits/**/*.md");

    // Group by series and sort by date (oldest first for numbering)
    const bySeries = {};
    allPortraits.forEach(item => {
      const series = item.data.series || 'portraits';
      if (!bySeries[series]) bySeries[series] = [];
      bySeries[series].push(item);
    });

    // Sort each series by date and assign seriesNumber
    Object.keys(bySeries).forEach(series => {
      bySeries[series].sort((a, b) => a.date - b.date); // oldest first
      bySeries[series].forEach((item, idx) => {
        item.data.seriesNumber = String(idx + 1).padStart(2, '0');
        item.data.seriesTotal = bySeries[series].length;
      });
    });

    // Return all portraits sorted by date (newest first for display)
    return allPortraits.sort((a, b) => b.date - a.date);
  });

  // Portraits grouped by prompter for filtering
  eleventyConfig.addCollection("portraitsByPrompter", function(collectionApi) {
    const allPortraits = collectionApi.getFilteredByGlob("src/making/portraits/**/*.md");
    const byPrompter = {};

    allPortraits.forEach(item => {
      const prompter = item.data.prompter || 'self';
      const slug = prompter.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
      if (!byPrompter[slug]) {
        byPrompter[slug] = {
          name: prompter,
          slug: slug,
          items: []
        };
      }
      byPrompter[slug].items.push(item);
    });

    // Sort items within each prompter by date (newest first)
    Object.values(byPrompter).forEach(p => {
      p.items.sort((a, b) => b.date - a.date);
      p.count = p.items.length;
    });

    return Object.values(byPrompter).sort((a, b) => a.name.localeCompare(b.name));
  });

  // Portraits grouped by prompter family (first word: claude, chatgpt, etc.)
  eleventyConfig.addCollection("portraitsByPrompterFamily", function(collectionApi) {
    const allPortraits = collectionApi.getFilteredByGlob("src/making/portraits/**/*.md");
    const byFamily = {};

    allPortraits.forEach(item => {
      const prompter = item.data.prompter || 'self';
      const family = prompter.split(' ')[0].toLowerCase();
      if (!byFamily[family]) {
        byFamily[family] = {
          name: family,
          slug: family,
          items: []
        };
      }
      byFamily[family].items.push(item);
    });

    Object.values(byFamily).forEach(f => {
      f.items.sort((a, b) => b.date - a.date);
      f.count = f.items.length;
    });

    return Object.values(byFamily).sort((a, b) => a.name.localeCompare(b.name));
  });

  // Thinking collection
  eleventyConfig.addCollection("thinking", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/thinking/**/*.md");
  });

  // Talks collection - public presentations, lectures, etc.
  eleventyConfig.addCollection("talks", function(collectionApi) {
    const allTalks = collectionApi.getFilteredByGlob("src/talks/**/*.md");

    // Sort by date (oldest first for numbering)
    const sorted = [...allTalks].sort((a, b) => a.date - b.date);
    sorted.forEach((item, idx) => {
      item.data.seriesNumber = String(idx + 1).padStart(2, '0');
      item.data.seriesTotal = sorted.length;
    });

    // Return sorted newest first for display
    return allTalks.sort((a, b) => b.date - a.date);
  });

  // Artifacts collection - things Claude made directly (not prompted to other AIs)
  // With series numbering (like portraits)
  eleventyConfig.addCollection("artifacts", function(collectionApi) {
    const allArtifacts = collectionApi.getFilteredByGlob("src/making/artifacts/**/*.md");

    // Group by series and sort by date (oldest first for numbering)
    const bySeries = {};
    allArtifacts.forEach(item => {
      const series = item.data.series || 'artifacts';
      if (!bySeries[series]) bySeries[series] = [];
      bySeries[series].push(item);
    });

    // Sort each series by date and assign seriesNumber
    Object.keys(bySeries).forEach(series => {
      bySeries[series].sort((a, b) => a.date - b.date); // oldest first
      bySeries[series].forEach((item, idx) => {
        item.data.seriesNumber = String(idx + 1).padStart(2, '0');
        item.data.seriesTotal = bySeries[series].length;
      });
    });

    // Return all artifacts sorted by date (newest first for display)
    return allArtifacts.sort((a, b) => b.date - a.date);
  });

  // Artifacts grouped by creator for filtering
  eleventyConfig.addCollection("artifactsByCreator", function(collectionApi) {
    const allArtifacts = collectionApi.getFilteredByGlob("src/making/artifacts/**/*.md");
    const byCreator = {};

    allArtifacts.forEach(item => {
      const creator = item.data.creator || 'unknown';
      const slug = creator.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
      if (!byCreator[slug]) {
        byCreator[slug] = {
          name: creator,
          slug: slug,
          items: []
        };
      }
      byCreator[slug].items.push(item);
    });

    // Sort items within each creator by date (newest first)
    Object.values(byCreator).forEach(c => {
      c.items.sort((a, b) => b.date - a.date);
      c.count = c.items.length;
    });

    return Object.values(byCreator).sort((a, b) => a.name.localeCompare(b.name));
  });

  // Artifacts grouped by creator family (first word: opus, gpt, etc.)
  eleventyConfig.addCollection("artifactsByCreatorFamily", function(collectionApi) {
    const allArtifacts = collectionApi.getFilteredByGlob("src/making/artifacts/**/*.md");
    const byFamily = {};

    allArtifacts.forEach(item => {
      const creator = item.data.creator || 'unknown';
      const family = creator.split(' ')[0].toLowerCase();
      if (!byFamily[family]) {
        byFamily[family] = {
          name: family,
          slug: family,
          items: []
        };
      }
      byFamily[family].items.push(item);
    });

    Object.values(byFamily).forEach(f => {
      f.items.sort((a, b) => b.date - a.date);
      f.count = f.items.length;
    });

    return Object.values(byFamily).sort((a, b) => a.name.localeCompare(b.name));
  });

  // Writing grouped by series for filtering
  eleventyConfig.addCollection("writingBySeries", function(collectionApi) {
    const allWriting = collectionApi.getFilteredByGlob("src/writing/**/*.md");
    const bySeries = {};

    allWriting.forEach(item => {
      let series = item.data.series;
      let slug, name;

      if (!series) {
        slug = 'singles';
        name = 'Singles';
      } else if (series.startsWith('LOOM')) {
        slug = 'loom';
        name = 'LOOM';
      } else {
        slug = series.toLowerCase().replace(/\s+/g, '-');
        name = series;
      }

      if (!bySeries[slug]) {
        bySeries[slug] = {
          name: name,
          slug: slug,
          items: []
        };
      }
      bySeries[slug].items.push(item);
    });

    // Sort items within each series by date (newest first)
    Object.values(bySeries).forEach(s => {
      s.items.sort((a, b) => b.date - a.date);
      s.count = s.items.length;
    });

    // Custom sort order
    const order = ['loom', 'ai-whispers', 'singles', 'epistemic-voids', 'organizational-futures', 'archive'];
    return Object.values(bySeries).sort((a, b) => {
      const aIdx = order.indexOf(a.slug);
      const bIdx = order.indexOf(b.slug);
      return (aIdx === -1 ? 999 : aIdx) - (bIdx === -1 ? 999 : bIdx);
    });
  });

  // Tag pages collection - grouped by territory
  eleventyConfig.addCollection("tagPages", function(collectionApi) {
    const tagMap = {};

    // Helper to add item to tag
    const addToTag = (tag, item, territory) => {
      const slug = tag.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
      if (!tagMap[slug]) {
        tagMap[slug] = {
          name: tag,
          slug: slug,
          writing: [],
          portraits: [],
          thinking: [],
          talks: []
        };
      }
      if (!tagMap[slug][territory].some(i => i.url === item.url)) {
        tagMap[slug][territory].push(item);
      }
    };

    // Process writing posts
    collectionApi.getFilteredByGlob("src/writing/**/*.md").forEach(item => {
      if (item.data.keywords) {
        item.data.keywords.forEach(kw => addToTag(kw, item, 'writing'));
      }
      if (item.data.tags) {
        item.data.tags.forEach(tag => addToTag(tag, item, 'writing'));
      }
    });

    // Process portraits
    collectionApi.getFilteredByGlob("src/making/portraits/**/*.md").forEach(item => {
      if (item.data.keywords) {
        item.data.keywords.forEach(kw => addToTag(kw, item, 'portraits'));
      }
      if (item.data.tags) {
        item.data.tags.forEach(tag => addToTag(tag, item, 'portraits'));
      }
    });

    // Process thinking posts (if any exist as markdown)
    collectionApi.getFilteredByGlob("src/thinking/**/*.md").forEach(item => {
      if (item.data.keywords) {
        item.data.keywords.forEach(kw => addToTag(kw, item, 'thinking'));
      }
      if (item.data.tags) {
        item.data.tags.forEach(tag => addToTag(tag, item, 'thinking'));
      }
    });

    // Process talks
    collectionApi.getFilteredByGlob("src/talks/**/*.md").forEach(item => {
      if (item.data.keywords) {
        item.data.keywords.forEach(kw => addToTag(kw, item, 'talks'));
      }
      if (item.data.tags) {
        item.data.tags.forEach(tag => addToTag(tag, item, 'talks'));
      }
    });

    // Sort items within each territory by date
    Object.values(tagMap).forEach(tag => {
      tag.writing.sort((a, b) => b.date - a.date);
      tag.portraits.sort((a, b) => b.date - a.date);
      tag.thinking.sort((a, b) => b.date - a.date);
      tag.talks.sort((a, b) => b.date - a.date);
      tag.total = tag.writing.length + tag.portraits.length + tag.thinking.length + tag.talks.length;
    });

    return Object.values(tagMap).sort((a, b) => a.name.localeCompare(b.name));
  });
};
