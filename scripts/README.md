# Migration Scripts

Scripts for maintaining content sync between external repos and this Eleventy site.

## LOOM Post Migration

The LOOM repo (`/Users/xulelin/Documents/GitHub/loom`) is actively maintained. New posts need to be migrated to this site periodically.

### Quick Usage

```bash
# From xule-site directory:

# Preview what would be migrated (dry run)
node scripts/migrate-loom.js --dry-run

# Migrate all posts
node scripts/migrate-loom.js

# Migrate a single new post
node scripts/migrate-loom.js --single /path/to/new-post.md
```

### What the Script Does

1. **Reads** posts from these LOOM directories:
   - `posts/` → Main LOOM series (I, II, III...)
   - `epistemic-voids/` → Epistemic Voids series
   - `organizational-futures/` → Organizational Futures series
   - `individual-posts/` → Standalone posts (no series)

2. **Transforms** each post:
   - Adds `layout: layouts/writing.njk` to frontmatter
   - Adds appropriate `series` field (e.g., "LOOM · V", "Epistemic Voids")
   - Converts filename to URL-friendly slug

3. **Writes** to `src/writing/`

### Series Naming

| Source Directory | Series Name | Example |
|-----------------|-------------|---------|
| posts/loom_post_01_* | LOOM · I | "LOOM · I" |
| posts/loom_post_15_* | LOOM · XV | "LOOM · XV" |
| epistemic-voids/* | Epistemic Voids | "Epistemic Voids" |
| organizational-futures/* | Organizational Futures | "Organizational Futures" |
| individual-posts/* | (none) | No series field |

### Filename Conversion Examples

```
loom_post_01_Locus-of-Observed-Meanings.md → loom-i-locus-of-observed-meanings.md
loom_post_15_Theorizing_by_Building.md    → loom-xv-theorizing-by-building.md
epistemic_voids_01_citation_theater.md    → epistemic-voids-01-citation-theater.md
research_memex.md                         → research-memex.md
```

### Adding a New Post

When a new post is published to the LOOM repo:

1. **Run migration:**
   ```bash
   node scripts/migrate-loom.js --single /Users/xulelin/Documents/GitHub/loom/posts/loom_post_16_New_Post.md
   ```

2. **Verify frontmatter** in the generated file:
   ```yaml
   ---
   layout: layouts/writing.njk
   series: "LOOM · XVI"
   title: "..."
   # ... rest of original frontmatter
   ---
   ```

3. **Test locally:**
   ```bash
   npm start
   # Visit http://localhost:8080/writing/
   ```

4. **Commit the new file** to the website repo

### Adding a New Series

To add support for a new series in the LOOM repo:

1. Edit `scripts/migrate-loom.js`
2. Add entry to `CONFIG.sources`:
   ```js
   {
     path: 'new-series-folder',
     glob: '*.md',
     series: 'New Series Name'
   }
   ```

### Frontmatter Fields

Posts should have these fields (from LOOM repo, preserved by migration):

```yaml
---
layout: layouts/writing.njk  # Added by migration
series: "LOOM · V"           # Added by migration (if applicable)
title: "Post Title"
subtitle: "Post Subtitle"
authors:
  - "Author Name"
  - "Claude Model"
keywords:
  - keyword1
  - keyword2
link: https://threadcounts.substack.com/p/...  # Optional
date: 2024-12-23
---
```

### Troubleshooting

**Post not appearing on site?**
- Check that `layout: layouts/writing.njk` is in frontmatter
- Verify date format is `YYYY-MM-DD`
- Run `npm start` and check for Eleventy errors

**Wrong series name?**
- Check filename matches expected pattern (e.g., `loom_post_XX_*`)
- Manual fix: edit the `series` field directly in `src/writing/*.md`

**Footnotes not rendering as marginalia?**
- Ensure footnotes use `[^1]` syntax
- Check `.eleventy.js` has markdown-it-footnote configured
