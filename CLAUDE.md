# CLAUDE.md - AI Assistant Context

Loaded into every session; keep it short. Path-scoped rules in `.claude/rules/` load when you touch their paths; the reasoning lives in `.claude/docs/` (local-only, gitignored) and tracked `docs/`.

| Read this when… | File |
|---|---|
| publishing / deployment / retention | **`docs/publishing.md`** (the checklist) · `.claude/docs/infrastructure.md` (hosting, Cloudflare, build cache, payload hygiene) |
| a build quirk bites you | `.claude/docs/gotchas.md` (58 numbered, searchable) |
| design or voice decisions | `.claude/docs/design.md`, `design-system.md` |
| frontmatter for a content type | `.claude/docs/content-patterns.md` |
| AI discoverability, licensing, llms.txt | `.claude/docs/ai-discoverability.md` · tracked `docs/agent-discovery.md` |
| adding portraits / artifacts / papers / talks / sub-apps / social cards | the matching rule in `.claude/rules/` (auto-loads on those paths) |

## Philosophy

A "book in the algorithmic age": paper/ink colors, marginalia, spine navigation, bloom-on-hover, one cyan "accident" per page (intentional wrongness). Content lists human + AI authors as arrays.

## Repo

The site is `xule-site/`, not the parent `personal-website/`. From the parent, use `git -C xule-site/`. `src/tsm/` often carries uncommitted work: never build production from the shared tree (see Deployment).

## Architecture

- **Eleventy 3** + **Nunjucks** + **Pagefind**; vanilla CSS/JS, no framework. ESM throughout.
- **Inline `<style>` per page is intentional.** Global styles in `src/assets/css/main.css`.
- Config `eleventy.config.js` imports from `eleventy/` (collections, filters, shortcodes, transforms, image-pipeline, og-card-paths). `middleware.ts` rewrites `Accept: text/markdown` → `.md`.
- Content types (each has a layout): Writing, Portraits, Artifacts, Thinking, Concepts, Teaching, CV, Talks, Papers. Standalone sub-apps at a root subpath (`/tsm/`); slide decks at `/assets/slides/`.
- Images: `optimizedImage` shortcode (Making) and the writing transform both go through `eleventy/image-pipeline.js` → AVIF/WebP + JPEG fallback, no PNG except transparent sources. Portrait originals are download targets (wallpapers), never re-emitted; lightboxes show the 2000w WebP. Detail: `.claude/rules/architecture.md`.
- Social cards: every page gets a 1200×630 card via `scripts/gen-og-cards.mjs`; cyan is only the page's authored accident. Detail: `.claude/rules/og-images.md`.

## Gotchas that bite on day one

1. **No `| reverse`** on `collections.writing`: already newest-first.
2. **Footnotes** are marginalia on desktop, endnotes ≤1100px.
3. **Text shaping is mandatory**: `prompt` / `contextExcerpt` are arrays with the stagger pattern and one accident.
4. **Writing images**: plain `![](path)`; the transform makes the `<picture>`.
5. **Guard undefined arrays** (`contextExcerpt`, `prompt`, `images`) in templates.
6. **`keywords`**, not `tags`, is the frontmatter field.
7. **FOUC cloak in `base.njk`** hides `body` until fonts are ready (1.5s fallback). Don't move it; it doesn't reach iframes. `.claude/rules/font-loading.md`.
8. **Pre-commit secret scanner** lives in `.git/hooks` (local-only). Its `sk-` pattern is bounded now; a fresh false positive → verify no real key, then `--no-verify`. Gotcha #59.
9. **Interactive/video artifacts need `thumbnail:`** or the Making index embeds a live iframe. Big video → R2 (`media.linxule.com`), never git. `.claude/rules/deploying-artifacts.md`, gotcha #60.
10. **`_site`, `.cache` and `node_modules/.cache` are symlinks to `*.nosync` dirs** so iCloud Drive (which syncs `~/Documents`) never touches build output; every rebuild inside iCloud otherwise leaves byte-identical `name 2.ext` conflict copies. Never `rm -rf _site` (use `scripts/clean-output.mjs`); never recreate those as real directories. Gotcha #57.

## Commands

```bash
bun run start      # dev server
bun run build      # build:site + verify (lints + regression tests)
bun run test:making | test:runtime | test:ui   # Playwright (needs a free port 4173; run outside the sandbox)
```

## Deployment

Vercel + Cloudflare, `linxule.com`. **Git auto-deploy is disabled**; `git push` deploys nothing (Verify GHA is on-demand). Production is a prebuilt deploy from a **detached worktree at a committed SHA** (`.deploy-worktree`): `bunx vercel@58.8.0 build --prod --scope linxules-projects`, then `… deploy --prebuilt --prod …` (sandbox off). CLI pinned at 58.8.0 (58.9.1 rejects the middleware import). Healthy payload ≈ 1.4 GB / 4.1k files, zero space-named files; if a deploy is slow, measure `du -sh .vercel/output` first, and delete `.vercel/output` after a verified deploy (it is not nosync-protected).

Keep **two READY deployments**: current + the rollback recorded *before* publishing. After live verification: `bun run publish:retention --current dpl_NEW --rollback dpl_PREVIOUS` (dry-run, then `--apply`). **Deleting does not lower Deployment Storage for 30 days**: deleted deployments sit in Vercel's recovery hold and stay metered. The meter ≈ everything deployed in the trailing 30 days, so the only levers that act now are payload size and how many deploys you create — batch changes into fewer publishes. Full sequence, guards, and the storage model: **`docs/publishing.md`**.
