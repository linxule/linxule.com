# CLAUDE.md - AI Assistant Context

Extended reference docs in `.claude/docs/` (local-only, gitignored). Rules in `.claude/rules/`.

## Project Philosophy

A "book in the algorithmic age" — paper/ink colors, marginalia, spine navigation, bloom-on-hover. One cyan "accident" per page (intentional wrongness). Content lists human + AI authors as arrays. Design system in `.claude/docs/design.md`.

## Repo Structure

The website repo is `xule-site/`, not the parent `personal-website/` directory. If Claude Code opens from the parent, all git commands need `git -C xule-site/`.

## Architecture

- **Eleventy (11ty)** + **Nunjucks** + **Pagefind** — no framework (vanilla CSS/JS)
- **Inline `<style>` per page** — intentional, not debt. Global styles in `main.css`
- Image pipeline details in `.claude/rules/architecture.md`
- Concept propagation and departure infrastructure in `.claude/rules/concept-propagation.md`
- Standalone interactive sub-apps at a root subpath (e.g. `/tsm/`) — vendoring, base-href, privacy allowlist, linking — in `.claude/rules/interactive-subapps.md`. A fourth content shape, distinct from slide decks at `/assets/slides/`.
- Deploying Making **artifacts** (interactive HTML / video / image into the gallery) — wrappers, poster capture, R2, and why artifacts need *no* base-href (loaded by full file path, not directory URL) — in `.claude/rules/deploying-artifacts.md`.
- Adding Making **portraits** (a prompt written by one AI, rendered by another generator like Midjourney) — file/dir layout, semantic image naming, the prompt-poem accident, prompter auto-pages, build/verify — in `.claude/rules/adding-portraits.md`.

### Key Files
```
eleventy.config.js        # Main config (ESM, imports from eleventy/)
middleware.ts             # Vercel Edge Middleware (Accept: text/markdown → .md rewrite)
eleventy/
  collections.js          # Collections (writing, portraits, artifacts, tags, concepts)
  transforms.js           # Image optimization + deep-link definition transforms
src/
  _includes/layouts/      # Page templates (writing, portrait, artifact, concepts, etc.)
  assets/css/main.css     # Global styles
  writing/                # Blog posts    concepts/           # Concept territory page
  making/                 # Portraits + artifacts
  talks/                  # Presentations
```

### Content Types

Writing, Portraits, Artifacts, Thinking, Concepts, Teaching, CV, Talks. Each has its own layout. Frontmatter patterns in `.claude/docs/content-patterns.md`.

## Key Gotchas

Full list in `.claude/docs/gotchas.md`.

1. **Do NOT use `| reverse`** on collections.writing — already newest-first
2. **Footnotes** render as marginalia on desktop, endnotes on mobile (≤1100px)
3. **Text shaping is mandatory** — prompts and contextExcerpts must be arrays with stagger pattern and one accident
4. **Writing images are auto-optimized** — use standard `![](path)`, the transform handles AVIF/WebP conversion
5. **Guard undefined arrays** — `contextExcerpt`, `prompt`, `images` can be undefined
6. **ESM project** — all JS uses `import`/`export default`
7. **`keywords` is the standard** frontmatter field (not `tags`), both feed `tagPages`
8. **FOUC cloak in `base.njk`** hides the body until `document.fonts.ready` resolves (1.5s fallback timer). Don't move it, don't remove the timer, and remember it doesn't propagate into iframes — embedded slide decks need their own cloak. Detail in `.claude/rules/font-loading.md`
9. **Pre-commit secret scanner — `sk-` false positive (fixed 2026-05-31)** — `.git/hooks/pre-commit` used `sk-[a-zA-Z0-9]` (no word boundary), matching `task-`, `ask-`, `risk-`, etc. Now split into `sk-ant-` + `sk-[a-zA-Z0-9]\{20,\}` (catches Anthropic + legacy OpenAI; modern `sk-proj-` an accepted gap, noted in-hook). The hook lives in `.git/` — untracked, local-only (not shared via clone). If a fresh false positive appears, `--no-verify` after verifying no real keys. See `.claude/rules/interactive-subapps.md`
10. **Interactive/video artifacts need a `thumbnail` poster** — the Making index renders HTML-`src` / `images[]` artifacts as live `<iframe>`s; setting `thumbnail:` makes the index show a static image instead (the live iframe then loads only on the detail page). Large video → Cloudflare R2 (`media.linxule.com`), not git (>100 MB hard-fails GitHub). See `.claude/rules/media-hosting.md`

## Commands

```bash
bun run start  # Dev server with hot reload
bun run build  # Production build + Pagefind index
```

## Deployment

Vercel, `linxule.com`. `git push` auto-deploys. Details in `.claude/docs/infrastructure.md`.
