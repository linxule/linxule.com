# Content Patterns Reference

Frontmatter templates, content workflows, and series management. Read this when adding new writing posts, portraits, artifacts, or talks.

## Writing Post Frontmatter

```yaml
---
layout: layouts/writing.njk
series: "LOOM · IV"           # Optional, groups posts
title: "Post Title"
subtitle: "Optional subtitle"  # Italicized below title
description: "150-160 char SEO description for search results and social previews"
authors:                       # Array, not string
  - "Xule Lin"
  - "Claude 3.5 Sonnet"
keywords:                      # For tags and search
  - keyword1
  - keyword2
date: 2025-01-24              # ISO format
link: https://...              # Optional external link (shows button)
ogImage: /writing/attachments/image.png  # Optional, for social preview
accident: true                 # Optional, highlights title in cyan
---
```

### Adding a New Writing Post

1. Create `src/writing/post-slug.md` with frontmatter above
2. Copy any images to `src/writing/attachments/`
3. Use **absolute paths** for images: `/writing/attachments/filename.ext`
   - Posts render to `/writing/post-slug/index.html`, so relative `attachments/...` resolves incorrectly
4. Use standard markdown footnotes for marginalia: `[^1]` → `[^1]: Note text`

## Portrait Frontmatter

```yaml
---
layout: layouts/portrait.njk
title: lowercase title         # Lowercase is intentional
date: 2025-12-24
series: portraits
orientation: portrait          # or "landscape"
generator: midjourney v7
settings: stylize 200, style raw
prompter: claude opus 4.5      # First word = family (claude). Can include config: "gemini 3.1-pro temp 0.8"
prompt:
  - "prompt line 1"
  - "prompt line 2"
  - text: "the accident line"  # Object syntax for accidents
    accident: true
images:
  - src: /assets/images/portraits/portraits-YYYY-MM-DD-title/01.png
    alt: "Detailed visual description of what you literally see"
    interpretation: "What it evokes or means - shown as title attribute on hover"
---
```

### Adding a New Portrait

**File naming**: `portraits-YYYY-MM-DD-slug-title.md`

**Image preparation**:
1. Create folder: `src/assets/images/portraits/portraits-YYYY-MM-DD-slug-title/`
2. Add images as numbered files: `01.png`, `02.png`, etc.
3. Flexible image count (3-7 per collection), not fixed

**Body text voices**: Prompter's description presented directly (no attribution framing), human commentary as separate paragraph(s) below. Let each voice speak for itself — the style makes authorship obvious.

**Per-image download**: `↓` link appears bottom-left on hover (mirroring `.specimen-num` bottom-right). Points to raw PNG via `<a download>`. Lightbox guards against link clicks (`e.target.tagName === 'A'` check).

## Artifact Frontmatter

```yaml
---
layout: layouts/artifact.njk
title: lowercase title
date: 2026-01-04
series: artifacts
creator: opus 4.5              # First word = family (opus)
medium: svg                    # svg, js, ascii, code, drawing, etc.  (use "html · p5.js" for interactive)
plottable: true                # Optional - can be pen plotted
src: /assets/images/artifacts/filename.svg  # or /assets/artifacts/slug/file.html for interactive
thumbnail: /assets/images/artifacts/thumb.png  # Optional - static image for index page instead of iframe
images:                        # Optional — multi-piece gallery (replaces src, renders 2x2 grid)
  - src: /assets/artifacts/slug/piece-01.html
    alt: "Visual description"
    interpretation: "What it means"
  - src: /assets/artifacts/slug/piece-02.html
    alt: "Visual description"
    interpretation: "What it means"
keywords:
  - keyword1
contextExcerpt:                # Array with stagger pattern (like prompts)
  - "First line of context"
  - "Second line"
  - text: "The accident line"
    accident: true
contextBefore: |               # Maker's voice - Claude before making
  Text that appears before the artifact...
contextAfter: |                # Maker's voice - Claude after making
  Text that appears after...
witnesses: |                   # Optional - others who responded (Twitter, etc.)
  <blockquote>Someone's reaction...</blockquote>
---

Body content below the `---` is the **Collaborator's voice** (your framing).
Rendered with "context" label. This is where you explain origins,
link to inspiration, quote other Claudes, etc.
```

### Artifact Notes

- **Naming**: `artifact-YYYY-MM-DD-slug.md`
- Things Claude *made directly* — not prompted to other AIs. The lineage.
- **contextExcerpt**: Array of lines (like prompts) with stagger pattern, one line can have `accident: true`
- **Three voices on artifact pages:**
  - **Maker** (Claude): contextExcerpt, contextBefore, contextAfter
  - **Collaborator** (Xule): body content → rendered with "context" label
  - **Witnesses** (optional): `witnesses` field → rendered with "witnesses" label, for Twitter reactions etc.
- **Artifact viewer**: Pan/zoom with fullscreen mode (click "expand" button, Escape to close)
- **HTML / Interactive Artifacts**:
  - Artifacts with `src` ending in `.html` render as `<iframe>` instead of `<img>`
  - Detail page: iframe in same `70vh` container, fullscreen toggle, no pan/zoom
  - Index page: iframe with `pointer-events: none` + overlay (clicks go to detail page)
  - Optional `thumbnail` field: if set, index page uses static image instead of iframe
  - Iframes use `sandbox="allow-scripts allow-same-origin"` for CDN library access (e.g., p5.js)
  - `isHTMLFile` filter in `eleventy/filters.js` detects `.html`/`.htm` extensions
  - HTML files go in `/assets/artifacts/{slug}/` (not `/assets/images/artifacts/`)
  - **Gallery mode**: When `images[]` has multiple entries, renders a 2x2 grid (single column on mobile). Click any item → fullscreen iframe. Escape to close. Works with both HTML and image sources.
  - **HTML artifact styling rule**: Files must NOT have standalone styling (dark body backgrounds, `border-radius`, `box-shadow`). They're embedded as iframes in the site's paper aesthetic — standalone decoration clashes, especially on narrow screens.

## Talk Frontmatter

```yaml
---
layout: layouts/talk.njk
title: lowercase title
type: talk                     # "talk" (default) or "symposium"
date: 2026-01-28
event: New Scholars · Generative AI Series
speakers:
  - Kevin Corley
  - Xule Lin
youtube: fPoVMFEh6TM           # Just the video ID, not full URL
slides: https://...embed       # Optional, Canva embed URL (renders iframe)
link: https://...              # Optional, external website ("Visit website →" button)
keywords:
  - human-AI collaboration
accident: true                 # Optional, cyan title on index
---

Body content is the talk description. Use `<span class="accident">phrase</span>` for inline accidents.
```

## Series Management

Current series (in display order): `loom`, `research-with-ai`, `ai-whispers`, `singles`, `epistemic-voids`, `organizational-futures`, `archive`.

**Adding a new series**: Add the slug to both `eleventy/collections.js` (sort order array + `startsWith()` pattern if series has numbered parts) and `series.njk` (poem + description).

## Footnotes as Marginalia

Use standard markdown footnotes — they render as marginalia on desktop:
```markdown
This is body text[^1] with a note.

[^1]: This appears in the margin on desktop, inline on mobile.
```
