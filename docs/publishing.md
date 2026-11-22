# Publishing and deployment retention

Keep **two successful production deployments** of `linxule-com`: the current
verified release and the known-good production release immediately before it.
During a publish there will temporarily be three. Delete the oldest only after
the new release passes verification. Git history remains the source archive;
Vercel snapshots provide the live site and one quick rollback.

This policy applies to `linxule-com` and, in `--auto` mode, to `research-memex`
on `linxules-projects` (both listed in `scripts/deployment-retention.mjs`). It
does not change image quality or either site's production domains.

## Publish sequence

1. **Record the rollback before publishing.** Read current production and save
   its deployment ID in the publish record. This is the known-good version to
   keep; do not later substitute whichever deployment happens to be second newest.

   ```bash
   vercel api '/v9/projects/prj_KYGjrsiyQVCOEiLMdIkaWAKc9aiK?teamId=team_TT999ORKqVDviH2vw2yzYh8o' --raw |
     bun -e 'const p = JSON.parse(await Bun.stdin.text()); console.log(p.targets.production.id)'
   ```

   Serialize publishing for this project: do not deploy, promote, roll back, or
   change aliases concurrently with retention cleanup.

2. **Build the authorized committed SHA in a detached worktree**
   (`.deploy-worktree`, beside `xule-site/`). Never publish the shared dirty
   checkout: uncommitted work such as `src/tsm/` would ship. Git auto-deploy is
   disabled, so `git push` deploys nothing. Preserve the existing cache
   workflow and CLI pin (58.9.1 built but rejected the middleware import at
   deploy, 2026-08-11):

   ```bash
   # iCloud empties files it has uploaded; reading one blocks the build forever.
   find .cache.nosync node_modules.nosync -flags +dataless | head   # expect nothing
   bunx vercel@58.8.0 build --prod --scope linxules-projects
   du -sh .vercel/output
   ```

   If the first command lists files, restore them before building: cache
   images from the main checkout's `.cache.nosync`, dependencies with
   `~/.local/bin/nosync-deps --apply`. A build showing 0% CPU for a minute is
   stuck on such a file, not slow (it cost 25 minutes on 2026-11-12; see
   `docs/releases/design-2026-11-12.md`).

   The normal build runs the site's verification gate. Inspect payload size
   before upload. After dropping PNG variants (Sept 2026), unreferenced writing
   originals, and retired responsive orphans (Nov 2026; use `bun run cache:prune`
   to prune stale cache artifacts locally), measure each release rather than
   treating a historical figure as a permanent budget. Generated optimized images
   must have zero space-named merge duplicates (they are iCloud conflict copies;
   `_site`, `.cache` and `node_modules/.cache` are symlinks to `*.nosync`
   directories so iCloud never writes them — check with `ls -la` if any appear)
   and no PNG variants except for sources with real transparency. `.vercel/output`
   is not nosync-protected: delete it after the deploy is verified. Do not wipe
   the image cache to solve deployment storage: it avoids expensive cold builds
   and is separate from retained deployment output.
   The paper is made per commit: `scripts/gen-paper.mjs` writes one tile per
   stock to `.cache/paper/`, seeded by the short SHA, and the build copies them
   to `assets/paper/` (about 190 KB in all). They are not in git and need no
   step here; a new SHA gives a new `?v=` and new paper.

3. **Deploy once and record the new deployment ID and URL.**

   ```bash
   bunx vercel@58.8.0 deploy --prebuilt --prod --scope linxules-projects
   ```

   Ordinary content, essay, and template publishes do **not** require redeploying
   the `linxule-mcp` Cloudflare Worker (`https://linxule.com/mcp`), because the
   Worker reads `/site-index.json` and `.md` twins from `https://linxule.com`
   with a 5-minute TTL. Only when `mcp/` (`mcp/metadata.mjs`, `mcp/worker.mjs`,
   or `mcp/wrangler.jsonc`) changes, promote the Worker *after* the Vercel
   deployment is `READY` and verified:

   ```bash
   (cd ~/Documents/GitHub/research-memex && bunx wrangler deploy --config ~/Documents/Apps/personal-website/xule-site/mcp/wrangler.jsonc --env "")
   ```

4. **Verify before deleting anything.** Require Vercel `READY`, canonical domain
   aliases pointing to the new deployment, and live checks of the homepage,
   Writing, Making, and changed content. Compare the deployed
   `/.build-manifest.json` with the built manifest, including `head` and
   `fingerprint`, so a cached old page cannot count as a verified release.
   Check the affected image/lightbox or interactive path when relevant, and
   Markdown negotiation when middleware changed. If verification fails or is
   ambiguous, keep the previous snapshots and diagnose or roll back first.

   When the release adds or changes font files (`src/assets/fonts/`, each named
   by its hash — including upright `Noto Serif SC` via `bun run fonts:noto` and
   italic `LXGW WenKai` via `bun run fonts:kai`): fetch each new file once with
   a cache-busting query (`…woff2?cb=<n>`) and require 200 before requesting its
   bare URL, because a 404 on a new `/assets/` path is cached for a year. Then
   open one essay, `/cv-zh` and one portrait in a browser with an empty cache
   and check that text, titles, margin notes, upright Chinese, and italic
   Chinese are in the site's self-hosted faces, not Georgia or a system serif.
   The stylesheet link carries the release SHA (`main.css?v=<sha>`), so a new
   release never pairs new pages with an old stylesheet; no cache purge is
   needed for that.

5. **Prune only after successful verification.** Replace the placeholders with
   the new current ID and the production ID recorded in step 1:

   ```bash
   # Read-only plan: inspect the two preserved IDs and every deletion candidate.
   bun run publish:retention --current dpl_NEW --rollback dpl_PREVIOUS

   # Apply the bounded cleanup as part of the verified publish.
   bun run publish:retention --current dpl_NEW --rollback dpl_PREVIOUS --apply
   ```

   The helper uses the installed authenticated `vercel api` CLI (tested with
   59.15.1), independently of the older prebuilt-deployment pin. No API key or
   1Password access is needed. There is no deletion in `build`, `verify`, or CI.

   It deletes only older, unaliased, READY production deployments. It refuses
   cleanup if either keep ID is missing/not ready, production or canonical
   aliases changed, a build is in flight, an unexpected newer release exists,
   or any extra successful preview or aliased release requires review. It
   rechecks before each deletion and verifies the final inventory. Any API
   failure stops the run without an automatic retry; inspect the partial result
   before rerunning. It never removes aliases or failed/canceled builds.

6. **Close the publish record.** Record the committed SHA, current and rollback
   IDs, measured output size, live verification, and cleanup outcome. Check the
   canonical homepage after cleanup. A failed cleanup is outstanding work even
   if the deployment succeeded. If an explicitly approved preview must remain,
   record the exception and its size; do not report a two-deployment result.

   For post-release and monthly live-surface verification across both
   `linxule.com` and `research-memex.org` (origin Markdown negotiation,
   `/.well-known/*`, `isitagentready.com` via `bun run seo:agentready` in
   Research Memex, Cloudflare zone hardening checks, IndexNow, and Google Search
   Console via `scripts/gsc/query.py --site ...`), follow
   `~/Documents/GitHub/research-memex/handbook/procedures/release-and-surface-audit.md`.

## Storage budget and recovery

**How Vercel meters it (verified on the usage page, 2026-09-16).** Deployment
Storage counts build output for every deployment that is retained *or in the
30-day recovery hold*. Expired and deleted deployments move to the hold
(project Settings → Security → "Recently Deleted Deployments"; the row menu
offers only View Source / Restore, no purge) and remain on the meter until the
hold ends. So pruning changes the number only 30 days later; the ~78 GB plateau
before 2026-09-13 was roughly a month of ~2.6 GB releases, and the 22 GB read
on 2026-09-16 was two live 1.3 GB deployments plus 30+ held ones. The usage
chart shows the daily maximum per project and lags a little.

Consequences for planning:

- Only two levers act inside the current period: **payload per deployment**
  (portrait originals ~0.5 GB offered as wallpaper downloads are deliberate;
  writing attachments ship optimized variants rather than raw PNG/WebP originals)
  and **how many deployments are created** in a trailing 30 days.
  Batch changes into fewer publishes; do not "deploy to check".
- The two-deployment rule above still matters for rollback hygiene and for
  keeping the list legible; it is not a storage tool.
- Never delete the known-good rollback early merely to make room for an
  unverified build.

Vercel's own retention on all four team projects (`linxule-com` and
`research-memex` since 2026-09-13; `openinterviewer` and `mgmt-docs-os` since
2026-09-18) is set to 1 day for previews, production, errored and canceled
builds (changed from the 30-day default via
`PATCH /v1/projects/<id>/deployment-expiration`). The retention helper and
launchd job still cover only the first two. Vercel keeps
a floor of the last 10 deployments (`deploymentsToKeep` is not writable on
Hobby) and never expires aliased deployments, so it is a fallback, not
enforcement of the two-version policy. Research Memex's `vercel.json` uses
`git.deploymentEnabled` to suppress Git-triggered deployments for `mcp-worker`,
`dependabot/**`, and `codex/**`; `main` and unspecified branches remain enabled.

A weekly launchd job on the primary Mac (`com.xulelin.vercel-retention`,
Mondays 09:30, wrapper `scripts/vercel-retention.sh` installed at
`~/.local/bin/vercel-retention.sh`, log `~/.local/log/vercel-retention.log`)
runs `bun scripts/deployment-retention.mjs --project <name> --auto --apply`
for `research-memex` and then `linxule-com`. `--auto` keeps whatever production
points at plus the newest older READY production deployment; every other guard
(domains, aliases, in-flight builds, previews) is unchanged. `bun run retention:test`
covers the helper and wrapper regressions. During a `linxule-com` publish still
pass the recorded IDs explicitly; do not rely on the weekly run.

Routine verified publishing includes the cleanup above. Extra previews, alias
removal, a different rollback window, and deletion outside this project are
separate decisions. A rollback incident itself does not trigger pruning.

References: [Deployment Storage](https://vercel.com/docs/deployment-storage),
[Git deployment configuration](https://vercel.com/docs/project-configuration/git-configuration),
[retention exceptions](https://vercel.com/docs/deployment-retention#exceptions-to-the-retention-policy).

## Provider incidents and the CLI fallback

Before falling back to `vercel deploy --prod` during a delayed Git deployment
on any project, check `https://www.vercel-status.com/api/v2/status.json`
(indicator `none`), wait at least 30 minutes, and confirm no deployment already
carries the commit SHA. A pending `Vercel` commit status on GitHub means the
webhook was received.

*Historical incident archive (2026-09-18, resolved):* A `research-memex` push
landed during a Vercel "Elevated Errors Triggering Deployments" incident. The
Git deployment arrived 17 minutes late while a 3-minute CLI fallback created a
duplicate production deployment stuck in `INITIALIZING` that had to be
cancelled; the same audit surfaced 10 stale `mcp-worker` previews on Research
Memex and replaced the weekly LaunchAgent wrapper with `scripts/vercel-retention.sh`
so failures in the first project are never masked. The 22 GB storage reading on
`linxule-com` that evening reflected the 30-day recovery hold on prior 2.6 GB
deploys rather than active payload size.
