# Publishing and deployment retention

Keep **two successful production deployments** of `linxule-com`: the current
verified release and the known-good production release immediately before it.
During a publish there will temporarily be three. Delete the oldest only after
the new release passes verification. Git history remains the source archive;
Vercel snapshots provide the live site and one quick rollback.

This policy is specific to `linxule-com` on `linxules-projects`. It does not
change other projects, image quality, or the site's production domains.

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
   before upload. Recent output was approximately 2.6 GB as of September 6,
   2026; measure each release rather than treating this as a permanent budget.
   Generated optimized images must have zero space-named merge duplicates.
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
`2 × 2.6 GB + 1.7 GB for other projects = 6.9 GB`. A third similar release
temporarily raises that estimate to 9.5 GB against the account's 10 GB Hobby
allowance. These are planning estimates, not confirmed metered usage: Vercel's
accounting uses daily maxima and retained deleted data can take time to clear.
If the payload or other projects grow, investigate before publishing; never
delete the known-good rollback early merely to make room for an unverified build.

Thirty-day Vercel retention is a fallback, not enforcement of this two-version
policy. Its minimum-history and alias exceptions can preserve older versions.
The post-publish helper enforces the narrower project policy. Large originals
and generated PNG variants still need separate image-pipeline work if the
storage margin becomes too small.

Routine verified publishing includes the cleanup above. Extra previews, alias
removal, a different rollback window, and deletion outside this project are
separate decisions. A rollback incident itself does not trigger pruning.

References: [Deployment Storage](https://vercel.com/docs/deployment-storage),
[retention exceptions](https://vercel.com/docs/deployment-retention#exceptions-to-the-retention-policy).
