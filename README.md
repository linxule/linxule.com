# Xule Lin - Personal Website

Book aesthetic, algorithmic age. Built with Eleventy.

> **For AI assistants**: Start at [CLAUDE.md](./CLAUDE.md): the few things that apply everywhere, and an index of where the rest lives.

## Philosophy

This site embodies a "book in the algorithmic age" metaphor:
- Paper/ink color scheme inspired by physical books
- Marginalia via footnotes (sidebar on desktop)
- Each work has one "accident" - something intentionally wrong, in cyan
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
│   ├── base.njk           # Root template (spine, bloom cursor, JSON-LD, CF Web Analytics)
│   ├── writing.njk        # Articles with marginalia
│   ├── portrait.njk       # AI-generated image pages
│   ├── artifact.njk       # Artifacts made directly by AI collaborators
│   ├── talk.njk           # Presentations and symposia
│   ├── paper.njk          # Formal paper landing pages (Scholar metadata)
│   ├── thinking.njk       # Research thesis page
│   ├── concepts.njk       # Working vocabulary (14 anchored & forming concepts)
│   ├── builds.njk         # Open-source tools and public infrastructure
│   ├── vellum.njk         # Vellum project note
│   ├── teaching.njk       # Courses and curriculum materials
│   └── cv.njk             # Curriculum vitae (English and Chinese)
├── _data/                 # Global data (site, catalogs, MCP server card, skills)
├── assets/css/main.css    # Shared styles, self-hosted fonts, design tokens
├── md-outputs/*.njk       # Markdown twin templates for every twinned shape
├── writing/*.md           # Essays across 9 series
├── papers/                # Formal publications and preprints
├── making/portraits/*.md  # AI portrait series
├── making/artifacts/*.md  # Artifacts made directly by AI
├── talks/                 # Presentations and symposia
├── builds/                # Open-source builds catalog & Vellum note
├── concepts/              # Signature concepts by territory
├── thinking/              # Research manifesto
├── teaching/              # Teaching page
├── cv/ & cv-zh/           # Bilingual academic CV
└── connect.njk            # MCP connection recipes & sibling server scopes

eleventy/
├── shapes.mjs             # Single source of truth for twinned content shapes
├── redirects.mjs          # Canonical 57-rule redirect table, Link header, and Accept negotiation
├── strings.js             # Shared slugify and collaborator credit parsing
├── collections.js         # Content collections
├── filters.js             # Template filters (including htmlToMarkdown, markdownBody)
├── shortcodes.js          # Image optimization and slide outlines
├── transforms.js          # Writing image optimization and anchor transforms
├── image-pipeline.js      # AVIF/WebP/JPEG responsive image pipeline
├── og-card-paths.js       # Social-card path & alt resolution
└── rendering-fidelity.js  # Feed and rendering helpers

worker.ts                  # Cloudflare Worker (redirects, trailing-slash, Accept: text/markdown + x-markdown-tokens, 206 media ranges, security & discovery headers)
wrangler.jsonc             # Cloudflare Workers + Static Assets config (prod & preview, observability, source maps)
src/_headers               # Direct Static Assets Cache-Control, CORS, and security headers (copied to _site/_headers)
mcp/                       # Stateless read-only linxule-mcp Cloudflare Worker (env.SITE Service Binding + observability)
agent-skills/              # Public Agent Skills artifacts
```

## Design Tokens

```css
--paper: #f4f1eb;           /* Background */
--ink: #1a1a1a;             /* Primary text */
--ink-light: #555555;       /* Secondary text */
--ink-faint: #666666;       /* Labels, metadata */
--ink-ghost: #c8c8c8;       /* Rules and ornament only, never a word */
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

Each work should have one "accident" - something intentionally wrong, rendered in cyan (`#4ee1d4`).

**Usage:**
- Writing: `accident: true` in frontmatter
- Portraits: `{text: "...", accident: true}` in prompt array
- Templates: `<span class="accident">text</span>`

## Search

The site uses [Pagefind](https://pagefind.app/) for client-side search:
- Indexes at build time
- Available at `/search`
- Searches writing, papers, portraits, artifacts, talks, thinking, concepts, teaching, builds (including Vellum), connect, and CV (English and Chinese)

## Agent Discovery

The site publishes honest AI and agent discovery surfaces: `/llms.txt`, `/connect.md`, `/site-index.json` (pages, all 14 concepts, publications, all 20 builds, and human–AI collaborator lineages), a stateless read-only Streamable HTTP MCP Worker v2 at `https://linxule.com/mcp` (`mcp/`, backed by a zero-latency `env.SITE` Cloudflare Service Binding to `linxule-com`, with `search_site`, `list_site`, `read_page`, `xule-research-navigation`, and `enter-the-work`), dual SEP-2127/1649 Server Cards at `/.well-known/mcp/server-card.json` and `/mcp/server-card` (`GET` and `HEAD`), an ARD v1.0 AI Resource Directory at `/.well-known/ai-catalog.json` (indexing `linxule.com/mcp`, skills, API catalog, and public sibling MCP servers), `/.well-known/api-catalog`, Markdown page twins with `Accept: text/markdown` negotiation and `x-markdown-tokens` headers, and one Agent Skills Discovery v0.2.0 index at `/.well-known/agent-skills/index.json`. The sitemap stays canonical HTML pages only; `.md` alternates are discovered through the AI surfaces and content negotiation, not submitted as duplicate sitemap URLs.

DNS-AID uses `_index._agents.linxule.com` as the single apex discovery pointer (matching `research-memex.org`); do not advertise A2A, OAuth, or Poppy stubs unless those real services exist. Operational notes are in [`docs/agent-discovery.md`](./docs/agent-discovery.md).

## Deployment

```bash
bun run build                                    # Build to _site/ + run full verify suite
bun run deploy:preview                           # Optional preview → linxule-com-preview.linxule.workers.dev
bun run verify:live                              # Run scripts/verify-cloudflare-migration.sh against preview
bun run deploy:prod                              # Deploy production Worker + Static Assets (wrangler deploy --env "")
BASE_URL=https://linxule.com bun run verify:live # Verify live production contracts
```

- `bun run publish:indexnow` uses a fail-closed production allowlist (`VERCEL_ENV=production`,
  `WORKERS_CI=1` + `WORKERS_CI_BRANCH=main`, or `CF_PAGES_BRANCH=main`). For an
  intentional manual submission after production verification, run
  `INDEXNOW_KEY="$(tail -n 1 src/indexnow-key.njk)" INDEXNOW_FORCE=1 bun run publish:indexnow`.
  The key is the public verification token rendered by `src/indexnow-key.njk`,
  not a secret.
- **Cloudflare Workers + Static Assets**: Production runs directly on Cloudflare Workers + Static Assets (`wrangler.jsonc`, `worker.ts`, `eleventy/redirects.mjs`, `src/_headers`, with `upload_source_maps: true`, `206 Partial Content` byte-range streaming for `/assets/artifacts/*` media, `x-markdown-tokens`, `HSTS` + `nosniff` security headers parity, and a single manual Cloudflare Web Analytics beacon in `src/_includes/layouts/base.njk` with RUM `auto_install: false`, `lite: false`), while `mcp/` deploys separately as the `linxule-mcp` Cloudflare Worker (bound via `env.SITE` → `linxule-com`) only when Worker code changes. Git auto-deployment is not used — `git push origin main` deploys nothing, the Verify workflow is on-demand (`gh workflow run verify.yml`) and runs on pull requests, and production is built and deployed from a detached worktree (`.deploy-worktree`).
  Follow [Publishing and rollback](./docs/publishing.md) for the detached-worktree
  checklist, live verification, instant `wrangler rollback --env ""`, and the
  7–14 day warm Vercel fallback window (`commandForIgnoringBuildStep: "exit 0"`
  on Vercel `linxule-com`; `scripts/vercel-retention.sh` is already scoped
  exclusively to `research-memex`).

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

Dependabot checks the native Bun lockfile and GitHub Actions weekly, grouping
minor/patch updates and security fixes. Keep `path-to-regexp` on its audited v6
line while `eleventy/redirects.mjs` and the sitemap checker use `:path*` and `:path+` route syntax;
v8 rejects those patterns. Markdown's bare-domain link setting is explicit so
parser upgrades preserve existing article links.
Only this parser's non-security major version updates are ignored; its security,
minor, and patch updates remain enabled.

## Credits

Design conversation between Xule Lin and Claude.
Book aesthetic inspired by Dora Lazarevic.
