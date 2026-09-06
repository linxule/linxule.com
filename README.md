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

Use Node.js 22 or newer and Bun 1.4.2 (the version pinned in CI). Bun's tracked
`bun.lock` is the source of truth for dependency installs.

```bash
bun install --frozen-lockfile # Install the verified dependency versions
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

Create `.md` files in `src/making/portraits/` with naming `portraits-YYYY-MM-DD-title.md`. Use the work's creation date when supplied:

```yaml
---
layout: layouts/portrait.njk
title: unfinished light         # Lowercase intentional
date: 2026-09-06
series: portraits
orientation: landscape          # landscape, portrait, or mixed
generator: midjourney v8.2
settings: "--ar 16:9 --stylize 250 --no robots, faces, circuit boards, logos, readable text"
prompter: gpt 6 astra            # AI that wrote the prompt; first word is its family
prompt:
  - "An immense, intricate loom suspended above perfectly still black water,"
  - text: "Through the woven window: a quiet patch of sunlit grass, startlingly ordinary and real."
    accident: true
images:
  - src: /assets/images/portraits/portraits-2026-09-06-unfinished-light/01-the-woven-window.png
    alt: Pale threads and suspended maps surround a small sunlit window above dark water.
    interpretation: A small opening of daylight held within an immense, unfinished weave.
---
```

The example abbreviates the prompt; a real entry preserves the supplied words,
split into semantic lines with exactly one `accident: true`. Generator, settings,
and prompter are factual credits supplied for each work, not defaults to copy.

- Keep original images at full resolution in the matching directory. Use
  numbered, descriptive names and place the cover image first.
- Preserve the supplied descriptions in both languages, followed by a short
  attribution with the full English and Chinese titles.
- The build generates responsive images, prompter indexes, a Markdown alternate,
  and a small `og.jpg` social card from the first image. Commit the portrait
  Markdown, originals, and social card together; generated `_site/` and cache
  files stay local.
- Run `bun run build`, then check the detail page and Making index at desktop and
  phone widths. Tap each image to verify its lightbox selection and original
  download, and check that the prompter links resolve.

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

## Agent Discovery

The site publishes content-only AI and agent discovery metadata: `/llms.txt`, `/site-index.json`, `/.well-known/api-catalog`, markdown page variants, and one Agent Skills Discovery index at `/.well-known/agent-skills/index.json`. The sitemap stays canonical HTML pages only; `.md` alternates are discovered through the AI surfaces and content negotiation, not submitted as duplicate sitemap URLs.

DNS-AID is limited to `_index._agents.linxule.com` and should not advertise A2A or MCP unless those real services exist. Operational notes are in [`docs/agent-discovery.md`](./docs/agent-discovery.md).

## Deployment

```bash
bun run build   # Outputs to _site/
```

- `bun run publish:indexnow` submits the current fresh build only on Vercel
  Production. For an intentional manual submission, use
  `INDEXNOW_KEY="$(tail -n 1 src/indexnow-key.njk)" INDEXNOW_FORCE=1 bun run publish:indexnow`.
  The key is the public verification token rendered by `src/indexnow-key.njk`,
  not a secret; Vercel Production supplies the same value as `INDEXNOW_KEY`.
- **Vercel**: Git auto-deployment is disabled. Pushes trigger nothing — the Verify workflow is on-demand (`gh workflow run verify.yml`) and runs on pull requests;
  production uses a separate prebuilt deployment from a detached worktree.
  See [CLAUDE.md](./CLAUDE.md) for the pinned CLI and deployment commands.
- **Netlify**: Same, or drag `_site/` folder
- **GitHub Pages**: Use GitHub Action

## Verification and maintenance

`bun run build` produces a fresh site and runs the output checks plus image-cache,
image-pipeline, Markdown-negotiation, social-card, and rendering-fidelity regressions. `bun run test:making` covers
the gallery across its viewport boundaries; `bun run test:runtime` covers shared
links and the article lightbox at desktop and mobile widths. `bun run test:ui`
covers phone reading, endnote returns, font loading, fullscreen guests, and search
restoration. Install Chromium first with `bunx playwright install chromium`.
See [the September UI review resolutions](docs/ui-review-2026-09-06.md) for scope
and the sandboxed-iframe keyboard boundary.

Image-cache restoration preserves newer local images. Repeated syncs copy only
changed files and omit space-named cache-merge duplicates. Optimized image URLs
remain stable; use a new source filename when replacing an image because these
assets are served with immutable caching.

For dependency maintenance, update `package.json` and `bun.lock` together, run
`bun audit`, then the build and browser checks above. Image encoder upgrades
also need the pipeline's cold-cache format tests; a warm site build alone can
reuse files produced by the previous encoder.

## Credits

Design conversation between Xule Lin and Claude.
Book aesthetic inspired by Dora Lazarevic.
