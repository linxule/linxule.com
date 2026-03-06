# CLAUDE.md - AI Assistant Context

This file helps AI assistants (Claude, etc.) understand the project philosophy and technical architecture. Detailed reference material lives in `.claude/docs/` — read those files when working on the relevant area.

## Reference Docs

These files contain the full details extracted from this file. **Read them when the task involves their area.**

- `.claude/docs/design.md` — Deep design principles, stagger patterns, text shaping rules, accident philosophy. **Read when**: creating new content, modifying layouts, extending the design system.
- `.claude/docs/content-patterns.md` — Frontmatter YAML templates for all content types, workflows for adding new content, series management. **Read when**: adding writing posts, portraits, artifacts, talks.
- `.claude/docs/making-architecture.md` — Making page CSS architecture, unified spread system, shared behaviors across all 6 making pages. **Read when**: modifying making pages, debugging layout issues.
- `.claude/docs/ai-discoverability.md` — Full AI/LLM discoverability system, markdown output templates, content negotiation, discovery signals. **Read when**: adding AI signals, modifying llms.txt, working on md-outputs, debugging middleware.
- `.claude/docs/gotchas.md` — Complete list of all 41 gotchas. **Read when**: encountering unexpected behavior or before making significant changes. Top gotchas are also listed below.
- `.claude/LOCAL_MANUAL.md` (gitignored) — Local file paths, machine-specific workflows, private notes.

## Project Philosophy

### The Book Aesthetic

This site embodies a "book in the algorithmic age" metaphor:
- Paper/ink color scheme (warm cream `#f4f1eb`, dark text `#1a1a1a`)
- Marginalia via footnotes (rendered in sidebar on desktop, inline on mobile)
- Spine-like navigation along left edge
- "Bloom" cursor interaction (violet `#8b7089` glow on hover)
- Print-like typography with careful spacing

### The Accident

Each page should have one "accident" - something intentionally wrong, rendered in cyan (`#4ee1d4`). This represents embracing imperfection in a world of algorithmic precision. The accident is "the wrong color" that we accept rather than correct.

### Human-AI Collaboration

Content often lists multiple authors (human + AI models). This reflects the project's thesis about algorithmic participants in knowledge work. Authors are listed as arrays, not comma-separated strings.

## Architecture

### Build System
- **Eleventy (11ty)** - Static site generator
- **Nunjucks** - Templating language
- **Pagefind** - Client-side search (runs at build time)
- **No framework** - Vanilla CSS/JS, no React/Vue/etc.

### Image Cache
`eleventy-img` outputs to `.cache/@11ty/img/` (persisted by Vercel between deploys). An `eleventy.after` hook copies to `_site`. Without this, every deploy reprocesses all image variants (~20min). With cache, text-only deploys take ~1min.

### Key Files
```
.eleventy.js              # Main config (imports from eleventy/)
middleware.ts             # Vercel Edge Middleware (Accept: text/markdown → .md rewrite)
vercel.json               # Vercel deployment config (redirects, trailingSlash)
eleventy/
  collections.js          # Content collections (writing, portraits, artifacts, tags)
  filters.js              # Template filters (readableDate, slugify, etc.)
  shortcodes.js           # Image optimization shortcode
src/
  _includes/layouts/      # Page templates (writing.njk, portrait.njk, artifact.njk, etc.)
  _data/site.js           # Global site config
  assets/css/main.css     # Global styles
  writing/                # Blog posts (markdown)
  making/portraits/       # Images prompted to other AIs
  making/artifacts/       # Things Claude made directly
  talks/                  # Presentations and symposia
```

### Content Types

1. **Writing** (`src/writing/*.md`) — Layout: `layouts/writing.njk`, Marker: "writing" (003)
2. **Portraits** (`src/making/portraits/*.md`) — Layout: `layouts/portrait.njk`, Marker: "making" (002)
3. **Artifacts** (`src/making/artifacts/*.md`) — Layout: `layouts/artifact.njk`, Marker: "making" (002)
4. **Thinking** (`src/thinking/`) — Layout: `layouts/thinking.njk`, Marker: "thinking" (004)
5. **Teaching** (`src/teaching/`)
6. **CV** (`src/cv/`)
7. **Talks** (`src/talks/*.md`) — Layout: `layouts/talk.njk`, Marker: "talks" (005)

Full field lists and frontmatter templates: `.claude/docs/content-patterns.md`

### CSS Architecture

**Intentionally uses inline `<style>` blocks per page.** Each page is self-contained — no unused CSS shipped. Not technical debt, it's the architecture. Global styles in `src/assets/css/main.css`.

## Collections

Defined in `eleventy/collections.js`:

- `writing` - All posts, newest first
- `portraits` - With auto-numbered seriesNumber
- `artifacts` - Things Claude made directly, newest first
- `writingBySeries` - Grouped by series field. Sort order: `loom`, `research-with-ai`, `ai-whispers`, `singles`, `epistemic-voids`, `organizational-futures`, `archive`. Series with numbered parts (e.g., "LOOM · IV", "Research with AI · I", "Organizational Futures · I") use `startsWith()` normalization in `collections.js`. New series need entries in both `collections.js` (sort order + slug pattern) and `series.njk` (poem + description)
- `portraitsByPrompter` - Grouped by exact prompter
- `portraitsByPrompterFamily` - Grouped by first word of prompter (claude, gpt, etc.)
- `artifactsByCreator` - Grouped by exact creator (e.g., "opus 4.5")
- `artifactsByCreatorFamily` - Grouped by first word of creator (e.g., "opus")
- `talks` - Public presentations, with auto-numbered seriesNumber
- `tagPages` - Aggregated from all content keywords (includes talks)

## Key Gotchas

Most frequently hit. Full list of 41 in `.claude/docs/gotchas.md`.

1. **Collections are sorted newest-first** for display
2. **Portrait series numbers** are calculated oldest-first (01 is oldest)
3. **Do NOT use `| reverse`** on collections.writing — it's already newest-first
4. **The `prompterFamily` filter** splits on first space: "claude opus 4.5" → family: "claude", model: "opus 4.5"
5. **The `creatorFamily` filter** same pattern: "opus 4.5" → family: "opus", model: "4.5"
6. **Layout variants** for portraits are deterministic based on page slug hash
7. **Text shaping is mandatory** — prompts and contextExcerpts must be arrays with stagger pattern and one accident
8. **Trailing slashes** — `vercel.json` has `trailingSlash: false`; sitemap.xml.njk strips trailing slashes to match
9. **New content type checklist** — When adding a section, update: `collections.js`, homepage nav in `index.njk`, `llms.txt.njk`, `tag.njk`. Ensure grayscale hover-reveal + mobile override
10. **Nunjucks regex in replace** — Use `| replace(r/\/$/, "")` for regex patterns
11. **JSON output in Nunjucks** — Use `| dump | safe` for proper JSON string escaping
12. **Guard undefined arrays in templates** — `contextExcerpt`, `prompt`, `images` can be undefined. Wrap in `{% if array %}`
13. **Vercel middleware + Eleventy CommonJS** — Do NOT add `"type": "module"` to `package.json`
14. **Artifact HTML template processing** — Prevented via `src/assets/artifacts/artifacts.json` with `"permalink": false`. `.eleventyignore` did NOT work.
15. **Writing images are local** — All in `src/writing/attachments/`. No remote image URLs in markdown `![]()` syntax.

## Commands

```bash
bun run start  # Dev server with hot reload
bun run build  # Production build + Pagefind index
```

## Deployment

### Hosting
- **Platform**: Vercel
- **Domain**: `linxule.com` (canonical, apex domain)
- **www redirect**: `www.linxule.com` → `linxule.com` (308 permanent)

### Configuration
- **vercel.json**: Handles all redirects (legacy URLs, case sensitivity, Chinese shortcuts)
- **middleware.ts**: Vercel Edge Middleware for `Accept: text/markdown` content negotiation (rewrites to `.md` files)
- **trailingSlash**: `false` - URLs normalize without trailing slashes

### Key Redirects
- `/daogov/*` → `/writing/dao-governance-resources/`
- `/posts/*` → `/writing/`
- `/llm`, `/llm.txt`, `/llms` → `/llms.txt`
- `/简历`, `/履历` → `/cv-zh/`

### Deploy
```bash
git push  # Auto-deploys via Vercel Git integration
```

Design tokens (breakpoints, typography, colors) are in `.claude/docs/design.md`.
