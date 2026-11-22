# Publishing and rollback

`linxule.com` runs directly on **Cloudflare Workers + Static Assets** (`wrangler.jsonc`, `worker.ts`, `eleventy/redirects.mjs`, `src/_headers`, with `upload_source_maps: true` and a single manual Cloudflare Web Analytics beacon in `src/_includes/layouts/base.njk` — token `96154bbaeaf34818a4a431b20138b9cc`, RUM `auto_install: false`, `lite: false` for EU + global coverage with zero double-injection). The Eleventy build in `_site/` is served directly from Cloudflare's edge on custom domains `linxule.com` and `www.linxule.com` (no Vercel origin hop).

Git auto-deploy is not used: `git push` deploys nothing. Every production release is built and verified locally from a detached worktree (`.deploy-worktree`) at the exact committed SHA, then deployed with Wrangler. Cloudflare stores immutable Worker + Static Assets versions for instant rollback (`bunx wrangler rollback --env ""`), and git history remains the source archive.

## Publish sequence

1. **Build and verify the exact committed SHA in a detached worktree** (`.deploy-worktree`, beside `xule-site/`). Never publish the shared dirty checkout: uncommitted work such as `src/tsm/` would ship. Leave `.deploy-worktree` unlinked from `.claude/` so a production build depends only on its committed SHA.

   ```bash
   # iCloud empties files it has already uploaded; reading one blocks the build forever.
   find .cache.nosync node_modules.nosync -flags +dataless | head   # expect nothing
   bun run build
   du -sh _site/
   ```

   If the first command lists files, restore them before building: cache images from the main checkout's `.cache.nosync`, dependencies with `~/.local/bin/nosync-deps --apply`. A build showing 0% CPU for a minute is stuck on such a file, not slow (it cost 25 minutes on 2026-11-12; see `docs/releases/design-2026-11-12.md`).

   `bun run build` runs `build:site` followed by `verify` (build freshness, OG cards, rendering fidelity including `worker.ts` / `wrangler.jsonc` / `_site/_headers` parity, design tokens, self-hosted fonts, built JSON & agent-discovery surfaces, sitemap redirect collision checks against `eleventy/redirects.mjs`, image pipeline, `scripts/worker.test.mjs`, and `mcp/worker.test.mjs`).

   Inspect `_site/` payload hygiene before deploying. After dropping PNG variants (Sept 2026), unreferenced writing originals, and retired responsive orphans (Nov 2026; use `bun run cache:prune` to prune stale cache artifacts locally), measure each release rather than treating a historical figure as a permanent budget. Generated optimized images must have zero space-named merge duplicates (iCloud conflict copies; `_site`, `.cache`, and `node_modules/.cache` are symlinks to `*.nosync` directories so iCloud never writes them — check with `ls -la` if any real directory appears) and no PNG variants except for sources with real transparency. Do not wipe the image cache unnecessarily: it avoids ~40-minute cold image builds. The paper tiles are generated per commit by `scripts/gen-paper.mjs` into `.cache/paper/`, seeded by the short SHA, and copied to `assets/paper/` (~190 KB total); they are not tracked in git and need no separate step.

2. **Optional shadow preview on Cloudflare Workers.** Recommended before promoting routing, header, template, or asset-pipeline changes:

   ```bash
   bun run deploy:preview   # freshness:check && wrangler deploy --env preview → https://linxule-com-preview.linxule.workers.dev
   bun run verify:live      # defaults to BASE_URL=https://linxule-com-preview.linxule.workers.dev
   ```

   `worker.ts` automatically adds `X-Robots-Tag: noindex, nofollow` on any `*.workers.dev` host. `bun run verify:live` runs `scripts/verify-cloudflare-migration.sh`, checking all 57 redirect rules from `eleventy/redirects.mjs` (including `#publications` fragment preservation, single-hop `/CV/`, and literal + percent-encoded Chinese shortcuts), trailing-slash `308` canonicalization, direct `200` `Accept: text/markdown` negotiation + `x-markdown-tokens` (on both negotiated and direct `.md` twins), RFC 9110 `206 Partial Content` byte-range streaming on `/assets/artifacts/*` media (`Accept-Ranges: bytes`, `Content-Range`), security headers parity (`Strict-Transport-Security: max-age=63072000`, `X-Content-Type-Options: nosniff`) on both Worker and direct Static Assets, static/discovery `Content-Type` and `Link` headers, `/pagefind/pagefind.js`, `/tsm`, immutable asset caching, and the preview `X-Robots-Tag` guard.

3. **Deploy to production and verify live.**

   ```bash
   bun run deploy:prod      # freshness:check && wrangler deploy --env ""
   BASE_URL=https://linxule.com bun run verify:live
   ```

   Record the committed SHA and Wrangler Version ID from the deploy output. Compare live `https://linxule.com/.build-manifest.json` against the built `_site/.build-manifest.json`, including `head` and `fingerprint`, so a cached old page cannot count as a verified release:

   ```bash
   curl -s https://linxule.com/.build-manifest.json
   cat _site/.build-manifest.json
   ```

   Check the homepage, Writing, Making, changed content, and affected lightbox or interactive paths.

   When the release adds or changes font files (`src/assets/fonts/`, each named by its hash — including upright `Noto Serif SC` via `bun run fonts:noto` and italic `LXGW WenKai` via `bun run fonts:kai`): fetch each new file once with a cache-busting query (`…woff2?cb=<n>`) and require `200` before requesting its bare URL, because `src/_headers` sets a one-year immutable cache on `/assets/*` and a 404 on a new path would be cached for a year. Then open one essay, `/cv-zh`, and one portrait in a browser with an empty cache and check that text, titles, margin notes, upright Chinese, and italic Chinese render in the site's self-hosted faces rather than Georgia or a system serif. The stylesheet link carries the release SHA (`main.css?v=<sha>`), so a new release never pairs new pages with an old stylesheet; no cache purge is needed for that.

   **MCP Worker (`linxule-mcp`):** Ordinary content, essay, and template publishes do **not** require redeploying the `linxule-mcp` Cloudflare Worker (`https://linxule.com/mcp`), because it reads `/site-index.json`, `/.build-manifest.json`, and `.md` twins from `linxule-com` with a 5-minute TTL — using a zero-latency Cloudflare Service Binding (`env.SITE` → `linxule-com` in `mcp/wrangler.jsonc`, with `fetch` fallback locally) and Workers `observability` + `traces` + `upload_source_maps`. Only when `mcp/` (`mcp/metadata.mjs`, `mcp/worker.mjs`, or `mcp/wrangler.jsonc`) changes, deploy `linxule-mcp` *after* `linxule-com` production is live and verified:

   ```bash
   bunx wrangler deploy --config mcp/wrangler.jsonc --env ""
   ```

   **IndexNow submission:** Run manually only after production passes live verification (`scripts/indexnow-submit.sh` stays fail-closed unless `INDEXNOW_FORCE=1` or an allowlisted production CI variable is set):

   ```bash
   INDEXNOW_KEY="$(tail -n 1 src/indexnow-key.njk)" INDEXNOW_FORCE=1 bun run publish:indexnow
   ```

4. **Close the publish record.** Record the committed SHA, Wrangler Version ID, measured `_site/` size, `verify:live` result, `/.build-manifest.json` check, and IndexNow outcome.

   For post-release and monthly live-surface verification across both `linxule.com` and `research-memex.org` (origin Markdown negotiation, `/.well-known/*`, `isitagentready.com` via `bun run seo:agentready` in Research Memex, Cloudflare zone hardening checks, IndexNow, and Google Search Console via `scripts/gsc/query.py --site ...`), follow `~/Documents/GitHub/research-memex/handbook/procedures/release-and-surface-audit.md`.

## Rollback and warm Vercel fallback window

### Instant Cloudflare rollback

Cloudflare Workers + Static Assets versions bundle the Worker code and its static asset manifest atomically. If live verification fails or a regression appears after deploy, inspect recent versions and roll back immediately:

```bash
bunx wrangler deployments list --env ""
bunx wrangler rollback --env ""
BASE_URL=https://linxule.com bun run verify:live
```

Confirm `https://linxule.com/.build-manifest.json` reports the expected rolled-back `head` and `fingerprint`.

### 7–14 day warm Vercel fallback window

For **7–14 days after the Cloudflare cutover**, keep the last verified Vercel production deployment of `linxule-com` — **`dpl_JCgDAczUVGMh1pD7vjg6RBjdH9EC`** on `linxules-projects` (`prj_KYGjrsiyQVCOEiLMdIkaWAKc9aiK`, frozen with `commandForIgnoringBuildStep: "exit 0"` so `git push` never builds on Vercel) — intact as a warm origin fallback. Do not delete the Vercel project or prune `dpl_JCgDAczUVGMh1pD7vjg6RBjdH9EC` until Cloudflare observability, GSC coverage, and live surface checks remain clean across the soak window.

If a platform-level Cloudflare Workers incident requires falling back to Vercel during that window, detach `linxule.com` and `www.linxule.com` from the `linxule-com` Worker custom domains so the zone routes back to the Vercel origin (allow 1–5 minutes for edge cache flush). `scripts/vercel-retention.sh` is already scoped exclusively to `research-memex`; once the 7–14 day soak window closes cleanly, simply retire the Vercel `linxule-com` project.

## Vercel deployment retention (`research-memex`)

`scripts/deployment-retention.mjs` (covered by `bun run retention:test`) enforces a **two-READY-production** retention policy — current production plus one known-good rollback — for projects hosted on Vercel (`linxules-projects`). `research-memex` remains on Vercel and continues using this helper:

```bash
# Dry-run plan for research-memex
bun run retention:memex

# Apply bounded cleanup for research-memex
bun scripts/deployment-retention.mjs --project research-memex --auto --apply
```

The helper uses the installed authenticated `vercel api` CLI, never runs inside `build`, `verify`, or CI, deletes only older unaliased READY production deployments, and stops without retrying if production or aliases changed, a build is in flight, or an extra READY preview requires review.

A weekly launchd job on the primary Mac (`com.xulelin.vercel-retention`, Mondays 09:30, wrapper `scripts/vercel-retention.sh` installed at `~/.local/bin/vercel-retention.sh`, log `~/.local/log/vercel-retention.log`) is already scoped to run **only** `research-memex` (`bun scripts/deployment-retention.mjs --project research-memex --auto --apply`). `linxule-com` stays frozen on Vercel at its 2 warm fallback deployments (`commandForIgnoringBuildStep: "exit 0"`) until post-soak decommission.

**Vercel storage metering note (for `research-memex` and remaining Vercel projects):** Vercel Deployment Storage counts build output for retained deployments *plus* deployments in the 30-day recovery hold ("Recently Deleted Deployments"), so pruning keeps rollback lists legible rather than lowering the meter inside the current 30-day period. Vercel's own expiration on team projects is set to 1 day (with a non-writable 10-deployment floor on Hobby and aliased-deployment protection). Research Memex's `vercel.json` suppresses Git-triggered deploys on `mcp-worker`, `dependabot/**`, and `codex/**`.

Before falling back to `vercel deploy --prod` during a delayed Git deployment on `research-memex`, check `https://www.vercel-status.com/api/v2/status.json` (indicator `none`), wait at least 30 minutes, and confirm no deployment already carries the commit SHA.

References: [Cloudflare Workers Static Assets](https://developers.cloudflare.com/workers/static-assets/), [Wrangler Rollbacks](https://developers.cloudflare.com/workers/configuration/versions-and-deployments/rollbacks/), [Vercel Deployment Storage](https://vercel.com/docs/deployment-storage).
