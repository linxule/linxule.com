# Xule Lin - Personal Website

Book aesthetic, algorithmic age. Built with Eleventy.

> **For AI assistants**: See [CLAUDE.md](./CLAUDE.md) for architecture, philosophy, and gotchas.

## Philosophy

This site embodies a "book in the algorithmic age" metaphor:
- Paper/ink color scheme inspired by physical books
- Marginalia via footnotes (sidebar on desktop)
- Each page has one "accident" - something intentionally wrong, in cyan
- Human-AI collaboration is explicit (multiple authors)

## Quick Start

```bash
bun install    # Install dependencies
bun run start  # Dev server at localhost:8080
bun run build  # Production build + search index
```

## Structure

```
src/
├── _includes/layouts/     # Page templates
│   ├── base.njk           # Root template (spine, bloom cursor)
│   ├── writing.njk        # Articles with marginalia
│   ├── portrait.njk       # AI-generated image pages
│   ├── thinking.njk       # Research thesis page
│   ├── teaching.njk       # Workshop materials
│   └── cv.njk             # Curriculum vitae
├── _data/site.js          # Global metadata
├── assets/css/main.css    # Shared styles, design tokens
├── writing/*.md           # Blog posts
├── making/portraits/*.md  # AI portrait series
├── talks/                 # Presentations and symposia
├── thinking/              # Research manifesto
├── teaching/              # Teaching page
└── cv/                    # CV page

eleventy/
├── collections.js         # Content collections
├── filters.js             # Template filters
└── shortcodes.js          # Image optimization
```

## Design Tokens

```css
--paper: #f4f1eb;           /* Background */
--ink: #1a1a1a;             /* Primary text */
--ink-light: #6b6b6b;       /* Secondary text */
--ink-faint: #a0a0a0;       /* Tertiary text */
--ink-ghost: #c8c8c8;       /* Borders */
--accident: #4ee1d4;        /* The wrong color - cyan */
--bloom: #8b7089;           /* Interaction color - violet */
```

## Content Types

### Writing Posts

Create `.md` files in `src/writing/`:

```yaml
---
layout: layouts/writing.njk
series: "LOOM · X"              # Optional series grouping
title: "Post Title"
subtitle: "Optional subtitle"   # Italicized
authors:
  - "Xule Lin"
  - "Claude 3.5 Sonnet"
keywords:
  - whispered-agency
  - dialogue
date: 2025-04-15
link: https://...               # Optional external link
accident: true                  # Optional - highlights title
---

Content here. Footnotes become marginalia[^1].

[^1]: This appears in the sidebar on desktop.
```

### AI Portraits

Create `.md` files in `src/making/portraits/` with naming `portraits-YYYY-MM-DD-title.md`:

```yaml
---
layout: layouts/portrait.njk
title: the echo                 # Lowercase intentional
date: 2025-11-25
series: portraits
orientation: landscape          # or portrait
generator: midjourney v7
settings: stylize 200, style raw
prompter: claude opus 4.5       # AI that wrote prompt
prompt:
  - "abstract visualization"
  - text: "the accident line"   # Object syntax for accidents
    accident: true
images:
  - src: /assets/images/portraits/portraits-2025-11-25-the-echo/01.png
    alt: Description
---
```

### Artifacts

Artifacts live in `src/making/artifacts/` and use the naming pattern `artifact-YYYY-MM-DD-slug.md`.

Use `layout: layouts/artifact.njk` with fields such as `creator`, `medium`, `src` or `images`, and optional context fields like `contextExcerpt`, `contextBefore`, and `contextAfter`.

### The Accident

Each page should have one "accident" - something intentionally wrong, rendered in cyan (`#4ee1d4`).

**Usage:**
- Writing: `accident: true` in frontmatter
- Portraits: `{text: "...", accident: true}` in prompt array
- Templates: `<span class="accident">text</span>`

## Search

The site uses [Pagefind](https://pagefind.app/) for client-side search:
- Indexes at build time
- Available at `/search/`
- Searches writing, portraits, artifacts, talks, teaching, and CV

## Deployment

```bash
bun run build   # Outputs to _site/
```

- **Vercel**: Auto-detects Eleventy, deploys on push
- **Netlify**: Same, or drag `_site/` folder
- **GitHub Pages**: Use GitHub Action

## Credits

Design conversation between Xule Lin and Claude.
Book aesthetic inspired by Dora Lazarevic.
