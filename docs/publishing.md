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

2. **Build the authorized committed SHA in a detached worktree.** Never publish
   the shared dirty checkout. Preserve the existing cache workflow and CLI pin:

   ```bash
   bunx vercel@58.8.0 build --prod --scope linxules-projects
   du -sh .vercel/output
   ```

   The normal build runs the site's verification gate. Inspect payload size
   before upload. Output was approximately 1.4 GB as of September 13, 2026
   (down from 2.6 GB once the gallery pipeline stopped re-emitting PNG: AVIF,
   WebP and a JPEG fallback at 400/800/1200/2000w; the original files under
   `assets/images/portraits/` remain as the download targets). Measure each
   release rather than treating this as a permanent budget.
   Generated optimized images must have zero space-named merge duplicates
   (they are iCloud conflict copies; `_site`, `.cache` and
   `node_modules/.cache` are symlinks to `*.nosync` directories so iCloud
   never writes them — check with `ls -la` if any appear) and no PNG
   variants except for sources with real transparency. `.vercel/output` is
   not nosync-protected: delete it after the deploy is verified.
   Do not wipe the image cache to solve deployment storage: it avoids expensive
   cold builds and is separate from retained deployment output.

3. **Deploy once and record the new deployment ID and URL.**

   ```bash
   bunx vercel@58.8.0 deploy --prebuilt --prod --scope linxules-projects
   ```

4. **Verify before deleting anything.** Require Vercel `READY`, canonical domain
   aliases pointing to the new deployment, and live checks of the homepage,
   Writing, Making, and changed content. Compare the deployed
   `/.build-manifest.json` with the built manifest, including `head` and
   `fingerprint`, so a cached old page cannot count as a verified release.
   Check the affected image/lightbox or interactive path when relevant, and
   Markdown negotiation when middleware changed. If verification fails or is
   ambiguous, keep the previous snapshots and diagnose or roll back first.

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

## Storage budget and recovery

The September 10 cleanup left two READY deployments. A rough estimate was
`2 × 2.6 GB + 1.7 GB for other projects = 6.9 GB`; a third similar release
temporarily raised that to 9.5 GB against the account's 10 GB Hobby allowance.
After the September 13 pipeline change each release is about 1.4 GB, so three
in flight is roughly `3 × 1.4 + 1.7 = 5.9 GB`. These are planning estimates, not confirmed metered usage: Vercel's
accounting uses daily maxima and retained deleted data can take time to clear.
If the payload or other projects grow, investigate before publishing; never
delete the known-good rollback early merely to make room for an unverified build.

Vercel's own retention on both projects is set to 1 day for previews,
production, errored and canceled builds (changed from the 30-day default on
2026-09-13 via `PATCH /v1/projects/<id>/deployment-expiration`). That clears
`research-memex` branch previews and failed builds by itself, but Vercel keeps
a floor of 10 production deployments (`deploymentsToKeep` is not writable on
Hobby) and never expires aliased deployments, so it is a fallback, not
enforcement of this two-version policy. The post-publish helper enforces the
narrower project policy.

A weekly launchd job on the primary Mac (`com.xulelin.vercel-retention`,
Mondays 09:30, wrapper `~/.local/bin/vercel-retention.sh`, log
`~/.local/log/vercel-retention.log`) runs
`bun scripts/deployment-retention.mjs --project <name> --auto --apply` for
`research-memex` and then `linxule-com`. `--auto` keeps whatever production
points at plus the newest older READY production deployment; every other guard
(domains, aliases, in-flight builds, previews) is unchanged. It is a no-op when
only two successful releases exist. During a `linxule-com` publish still pass
the recorded IDs explicitly; do not rely on the weekly run. What remains
large is deliberate: portrait originals (~0.5 GB, offered for download as
wallpapers) and writing attachments (~0.5 GB, passthrough-copied originals).

Routine verified publishing includes the cleanup above. Extra previews, alias
removal, a different rollback window, and deletion outside this project are
separate decisions. A rollback incident itself does not trigger pruning.

References: [Deployment Storage](https://vercel.com/docs/deployment-storage),
[retention exceptions](https://vercel.com/docs/deployment-retention#exceptions-to-the-retention-policy).
