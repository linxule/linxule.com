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
- Adding a **paper** landing page (`/papers/<slug>/` for Google Scholar — `citation_*` Highwire tags, a co-located full-text PDF gated on a `pdf:` field, ScholarlyArticle JSON-LD, BibTeX) — in `.claude/rules/papers.md`. The site's AI-discoverability + licensing surface (llms.txt, JSON-LD `license`/`usageInfo`, RSL `/license.xml`, REUSE/SPDX, security.txt, IndexNow) is documented in `.claude/docs/ai-discoverability.md`; the tracked Agent Skills / DNS-AID operations note is [`docs/agent-discovery.md`](./docs/agent-discovery.md).
- **Social cards (og:image)** — every page gets a small 1200×630 card. Two families: **image cards** (cropped portraits/covers and contained SVG or raster artifacts) and **text cards** (brand, sections, writing without covers, HTML artifacts, talks, papers, and writing series), rendered with `@resvg/resvg-js` + vendored fonts in `scripts/og-fonts/`. Cyan is the authored accident when the page has one (`accident: true` titles, the brand phrase "not as tools.") — otherwise a quiet dot; never a mechanically chosen word. The shared `socialCard` resolver selects image and alternative together; use `ogImageAlt` when the selected artwork needs an authored description. `scripts/gen-og-cards.mjs` generates cards and `scripts/check-og-images.mjs` checks decoded dimensions against metadata. Revised designs use new URLs because cards are served immutable. Mechanism in `.claude/rules/og-images.md`; live preview checks in `.claude/rules/og-card-refresh.md`.

### Key Files
```
eleventy.config.js        # Main config (ESM, imports from eleventy/)
middleware.ts             # Vercel Edge Middleware (Accept: text/markdown → .md rewrite; direct .md URLs pass through)
docs/agent-discovery.md   # Tracked Agent Skills, DNS-AID, and DNSSEC operations note
eleventy/
  collections.js          # Collections (writing, portraits, artifacts, tags, concepts)
  transforms.js           # Image optimization + deep-link definition transforms
src/
  _includes/layouts/      # Page templates (writing, portrait, artifact, concepts, etc.)
  assets/css/main.css     # Global styles
  writing/                # Blog posts    concepts/           # Concept territory page
  making/                 # Portraits + artifacts
  talks/                  # Presentations
  papers/                 # Paper landing pages (/papers/, Google Scholar)
```

### Content Types

Writing, Portraits, Artifacts, Thinking, Concepts, Teaching, CV, Talks, Papers. Each has its own layout. Frontmatter patterns in `.claude/docs/content-patterns.md`.

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

**Required publish checklist:** [docs/publishing.md](./docs/publishing.md). Keep **two successful deployments**: current production and the known-good production version recorded before publishing. Temporarily keep three while verifying a new release. After verification, run `bun run publish:retention --current dpl_NEW --rollback dpl_PREVIOUS` (dry-run), then the same command with `--apply`. Never prune before verification, choose the rollback merely by recency, remove aliased/preview deployments automatically, or prune another project. Failed verification means no cleanup. The installed authenticated CLI handles retention API calls; the separate prebuilt deployment command keeps its existing version pin. Routine verified publishing includes this bounded cleanup; unusual aliases, previews, or changed production state require separate review.

Vercel, `linxule.com`. **Git auto-deploy is DISABLED** (since 2026-07-28, `vercel.json` `git.deploymentEnabled: false` — 45-min cold builds kept erroring). `git push` triggers nothing (the Verify GitHub Action is on-demand since 2026-09-06: `gh workflow run verify.yml`, or automatically on PRs). Build and deploy from a detached worktree with `bunx vercel@58.8.0 build --prod --scope linxules-projects` then `bunx vercel@58.8.0 deploy --prebuilt --prod --scope linxules-projects` (needs sandbox off). CLI 58.9.1 rejects this project's documented `@vercel/functions` middleware import during prebuilt validation; re-test before removing the pin. Prebuilt deploys don't populate Vercel's build cache. **Payload hygiene**: a healthy prebuilt payload is ~1.4 GB (`du -sh .vercel/output`, since 2026-09-13: gallery pipeline emits AVIF/WebP/JPEG only, PNG solely for transparent sources; portrait originals stay as download targets); `.cache/@11ty/img` ~0.4 GB. If a deploy is slow, measure the payload FIRST — a 2026-08 incident shipped 3.5 GB of `"…w 2.png"` cache-merge duplicates in every deploy for months (gotcha #57). Never merge the image cache with Finder "keep both" semantics. Details in `.claude/docs/infrastructure.md`.
