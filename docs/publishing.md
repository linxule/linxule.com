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
  (≈ 1.3 GB / 4.1k files since the pipeline change; portrait originals ~0.5 GB
  offered as wallpaper downloads and writing attachments ~0.5 GB are
  deliberate) and **how many deployments are created** in a trailing 30 days.
  Batch changes into fewer publishes; do not "deploy to check".
- Expected floor once the pre-fix holds clear (mid-October 2026): number of
  deployments in the trailing 30 days × 1.3 GB, less whatever Vercel
  deduplicates across identical files. Read the chart then before deciding
  whether the originals need to move to external storage (R2 / release assets).
- The two-deployment rule below still matters for rollback hygiene and for
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
enforcement of the two-version policy. Research Memex's `vercel.json` now uses
`git.deploymentEnabled` to suppress Git-triggered deployments for `mcp-worker`,
`dependabot/**`, and `codex/**`; `main` and unspecified branches remain enabled.
This replaces `ignoreCommand`, which cancels builds but still creates deployment
records and consumes deployment/concurrency quota. These exclusions do not
delete existing previews or block manual deploys. See the Research Memex
`DEPLOY-CHECKLIST.md` for branch-config propagation and live rollout verification;
a local edit is not evidence that suppression is active on remote branches.

A weekly launchd job on the primary Mac (`com.xulelin.vercel-retention`,
Mondays 09:30, wrapper `~/.local/bin/vercel-retention.sh`, log
`~/.local/log/vercel-retention.log`) runs
`bun scripts/deployment-retention.mjs --project <name> --auto --apply` for
`research-memex` and then `linxule-com`. `--auto` keeps whatever production
points at plus the newest older READY production deployment; every other guard
(domains, aliases, in-flight builds, previews) is unchanged. It is a no-op when
only two successful releases exist. During a `linxule-com` publish still pass
the recorded IDs explicitly; do not rely on the weekly run.

### September 18 audit and remediation

At the pre-release audit, Research Memex had ten READY previews, seven from
`mcp-worker`, plus stale branch aliases. The branch is checked out in an existing
worktree. The dry-run stopped with `needs separate review; no automatic preview deletion`.
Review ownership, aliases and exact deployment IDs separately before removing
anything. Keep the preview guard; do not classify these as routine production
deletion candidates. Rerun the read-only plan after authorized cleanup.

The installed weekly job had not yet run (`runs=0` at this audit). The original
wrapper returned only the final project's exit status, hiding an earlier failure.
The maintained replacement is `scripts/vercel-retention.sh`; install that exact
file with `install -m 755 scripts/vercel-retention.sh ~/.local/bin/vercel-retention.sh`
without changing the LaunchAgent schedule.
It runs both projects, logs each outcome and returns nonzero if either fails or
logging cannot start. `bun run retention:test` covers the helper and an isolated,
stubbed wrapper regression. A manual check is not proof of future unattended
operation; inspect the next scheduled run's per-project outcomes.

Release checkpoint, September 18 at 22:53 CEST: the reviewed wrapper is installed
and byte-equal to its tracked source. All 25 helper/wrapper tests pass; Kimi's
follow-up review approved the execute-bit and test-isolation corrections.
Research Memex commit `2cc1a41` is pushed to `main` and remote `mcp-worker`.
The existing local MCP worktree was not changed; it must fast-forward before
its next push. Its remote now includes branch suppression.

Vercel reports an active "Elevated Errors Triggering Deployments" incident.
The Git push produced no deployment; the documented CLI fallback created
`dpl_8KhDgT87RXB7C76roGffuxdBEm3G`, which was still INITIALIZING at this checkpoint.
Do not retry blindly or prune during this state. Keep live production/rollback
`dpl_G7EUfCpd95ny5eWBj71K298kHmN8` until the new release is READY and its canonical
surfaces pass. Preview/alias cleanup and the final retention apply remain pending.
Provider source: [Vercel status](https://www.vercel-status.com/).

Routine verified publishing includes the cleanup above. Extra previews, alias
removal, a different rollback window, and deletion outside this project are
separate decisions. A rollback incident itself does not trigger pruning.

References: [Deployment Storage](https://vercel.com/docs/deployment-storage),
[Git deployment configuration](https://vercel.com/docs/project-configuration/git-configuration),
[retention exceptions](https://vercel.com/docs/deployment-retention#exceptions-to-the-retention-policy).

## Provider incidents and the CLI fallback

On 2026-09-18 a `research-memex` push landed inside a Vercel "errors
triggering deployments" incident. The Git deployment arrived 17 minutes late; a
CLI fallback submitted after 3 minutes created a second production deployment
of the same commit that never left INITIALIZING and had to be cancelled. Before
falling back to `vercel deploy --prod` for any project, check
`https://www.vercel-status.com/api/v2/status.json` (indicator `none`), wait at
least 30 minutes, and confirm no deployment already carries the commit SHA. A
pending `Vercel` commit status on GitHub means the webhook was received. The
usage page read 25.4 GB Deployment Storage that evening with `linxule-com` at
22 GB and no deployments since 2026-09-15: the number is the recovery hold, as
described above, and is expected to fall in mid-October.
