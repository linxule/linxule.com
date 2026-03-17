# CLAUDE.md - AI Assistant Context

Project architecture and conventions. Extended reference docs live in `.claude/docs/` (local-only, gitignored) — read those files when working on the relevant area.

## Local Reference Docs (gitignored)

- `.claude/docs/design.md` — Design principles, stagger patterns, text shaping, accident philosophy
- `.claude/docs/content-patterns.md` — Frontmatter templates, content workflows, series management
- `.claude/docs/making-architecture.md` — Making page CSS architecture, unified spread system
- `.claude/docs/ai-discoverability.md` — AI/LLM discoverability, markdown outputs, content negotiation
- `.claude/docs/infrastructure.md` — Deployment, redirects, collections, search engine setup
- `.claude/docs/gotchas.md` — Complete gotchas list (top items below)
- `.claude/LOCAL_MANUAL.md` — Local paths, credentials, machine-specific workflows

## Project Philosophy

A "book in the algorithmic age" — paper/ink colors, marginalia, spine navigation, bloom-on-hover. One cyan "accident" per page (intentional wrongness). Content lists human + AI authors as arrays. Full design system in `.claude/docs/design.md`.

## Repo Structure

The website repo is `xule-site/`, not the parent `personal-website/` directory. If Claude Code opens from the parent, all git commands need `git -C xule-site/`.

## Architecture

### Build System
- **Eleventy (11ty)** - Static site generator
- **Nunjucks** - Templating language
- **Pagefind** - Client-side search (runs at build time)
- **No framework** - Vanilla CSS/JS, no React/Vue/etc.

### Image Pipeline
`eleventy-img` optimizes images in two ways: the `optimizedImage` **shortcode** (making pages — called explicitly in templates) and the `optimizeWritingImages` **transform** (writing pages — auto-converts markdown `<img>` to responsive `<picture>` at build time). Both output AVIF/WebP with responsive srcset to `.cache/@11ty/img/` (persisted by Vercel between deploys). An `eleventy.after` hook copies to `_site`. Without cache, first deploy processes all images (~30s). With cache, text-only deploys take ~1.5s. See `.claude/rules/architecture.md` for constraints.

### Key Files
```
eleventy.config.js        # Main config (ESM, imports from eleventy/)
middleware.ts             # Vercel Edge Middleware (Accept: text/markdown → .md rewrite)
vercel.json               # Vercel deployment config (redirects, trailingSlash)
eleventy/
  collections.js          # Content collections (writing, portraits, artifacts, tags, concepts)
  filters.js              # Template filters (readableDate, slugify, etc.)
  shortcodes.js           # Image optimization shortcode (making pages)
  transforms.js           # Image optimization + deep-link definition transforms (writing pages)
src/
  _includes/layouts/      # Page templates (writing.njk, portrait.njk, artifact.njk, concepts.njk, etc.)
  _data/site.js           # Global site config
  assets/css/main.css     # Global styles
  writing/                # Blog posts (markdown)
  concepts/               # Concept territory page (signature concepts with questions)
  making/portraits/       # Images prompted to other AIs
  making/artifacts/       # Things Claude made directly
  talks/                  # Presentations and symposia
```

### Content Types

Writing, Portraits, Artifacts, Thinking, Concepts, Teaching, CV, Talks. Each has its own layout in `src/_includes/layouts/`. Frontmatter templates and workflows in `.claude/docs/content-patterns.md`. Concept propagation and departure infrastructure in `.claude/rules/concept-propagation.md`.

### CSS Architecture

**Intentionally uses inline `<style>` blocks per page.** Each page is self-contained — no unused CSS shipped. Not technical debt, it's the architecture. Global styles in `src/assets/css/main.css`.

## Collections

Defined in `eleventy/collections.js`. Details in `.claude/docs/infrastructure.md`.

Key: collections are **newest-first** for display. Portrait/artifact series numbers are **oldest-first** (01 = oldest). New series need entries in both `collections.js` and `series.njk`. `tagPages` aggregates keywords from writing, portraits, artifacts, and talks.

## Key Gotchas

Most frequently hit. Full list in `.claude/docs/gotchas.md`.

1. **Do NOT use `| reverse`** on collections.writing — already newest-first
2. **Footnotes** render as marginalia on desktop (JS-positioned next to refs), endnotes on mobile (≤1100px)
3. **Text shaping is mandatory** — prompts and contextExcerpts must be arrays with stagger pattern and one accident
4. **Writing images are local and auto-optimized** — All in `src/writing/attachments/`, auto-converted to responsive AVIF/WebP `<picture>` at build time. Use standard markdown `![](path)` — the transform handles optimization. Lightbox shows original via `data-full-src`
5. **Guard undefined arrays** — `contextExcerpt`, `prompt`, `images` can be undefined. Wrap in `{% if array %}`
6. **ESM project** — `package.json` has `"type": "module"`. Config is `eleventy.config.js`. All JS uses ESM (`import`/`export default`). Only `scripts/migrate-loom.cjs` is CommonJS.
7. **`tags` and `keywords` both feed `tagPages`** — standard is `keywords`

## Commands

```bash
bun run start  # Dev server with hot reload
bun run build  # Production build + Pagefind index
```

## Deployment

Vercel, `linxule.com`. `git push` auto-deploys. Details (redirects, middleware, trailingSlash) in `.claude/docs/infrastructure.md`.

Design tokens (breakpoints, typography, colors) in `.claude/docs/design.md`.
