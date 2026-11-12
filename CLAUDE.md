# CLAUDE.md

Loaded into every session, so it holds only what applies whatever you touch. `AGENTS.md` is a symlink to this file.

Knowledge about one kind of work lives next to that work: tracked `docs/`, path rules in `.claude/rules/` (Claude Code loads them by path; other agents read the one that matches), and reasoning in `.claude/docs/`. **Add new knowledge there, not here.** A line belongs in this file only if a session that never opens the relevant path could still do damage without it.

`.claude/` is gitignored on purpose: this repo is public and the rules are private operational guidance. It exists only in the main checkout. In a clone on either Mac, run `bun run workspace:link` to link the rules and docs in (`--copy` for a sandbox that cannot follow links). Leave the deploy worktree unlinked, so a production build depends only on its committed SHA. Without the link, the tracked `docs/` are all you have, so anything a clone needs in order to edit safely goes in `docs/`, and nothing private does.

| When you are… | Read |
|---|---|
| editing templates, frontmatter or content for the first time | **`docs/authoring.md`** (code map + the gotchas that bite first) |
| publishing, deploying, pruning deployments | **`docs/publishing.md`** (the checklist) · `.claude/docs/infrastructure.md` |
| changing config or the image pipeline | `.claude/rules/architecture.md` |
| adding portraits / artifacts / papers / talks / sub-apps / social cards | the matching rule in `.claude/rules/` |
| writing or porting an essay | `.claude/rules/writing-links.md`, `seo.md`, `concept-propagation.md` |
| setting frontmatter for a content type | `.claude/docs/content-patterns.md` |
| making a design or voice decision | `.claude/docs/design.md`, `design-system.md` |
| working on AI discoverability, licensing, llms.txt | `.claude/docs/ai-discoverability.md` · `docs/agent-discovery.md` |
| bitten by a build quirk | `.claude/docs/gotchas.md` (numbered, searchable) |

## What this is

A "book in the algorithmic age": paper and ink, marginalia, a spine, bloom on hover, and one cyan "accident" per work. Human and AI authors are listed together, as arrays.

Eleventy 3 + Nunjucks + Pagefind, vanilla CSS and JS, ESM throughout. Inline `<style>` per page is intentional; global styles are in `src/assets/css/main.css`.

## Know before you touch anything

1. **The repo is `xule-site/`**, not the parent `personal-website/`. From the parent, use `git -C xule-site/`.
2. **`src/tsm/` often carries uncommitted work.** Leave it alone, never stage it, and never build production from this shared tree.
3. **Build output and git metadata are kept out of iCloud.** `_site`, `.cache` and `node_modules/.cache` are symlinks to `*.nosync` directories, and `.git` is a one-line pointer to `.git.nosync`. Never recreate any of them as real directories, and never `rm -rf _site` (use `scripts/clean-output.mjs`). Gotcha #57.
4. **A command sitting at 0% CPU is stuck, not slow.** iCloud empties files it has already uploaded, and reading one blocks. Find them with `find <dir> -flags +dataless`. Gotcha #61.
5. **A pre-commit secret scanner runs from `.git.nosync/hooks`** (local-only). On a false positive, confirm there is no real key, then `--no-verify`. Gotcha #59.
6. **`git push` deploys nothing.** Production is a prebuilt deploy from a detached worktree (`.deploy-worktree`) at a committed SHA. Follow `docs/publishing.md` step by step, and batch changes: every deploy stays on the storage meter for 30 days, even after it is deleted.

## Commands

```bash
bun run start      # dev server
bun run build      # build:site + verify (lints + regression tests)
bun run test:making | test:runtime | test:ui   # Playwright; needs free port 4173, run outside the sandbox
```
