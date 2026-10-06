# October 6 tool catalogue release

The approved refresh updates Memex, Vox MCP, OpenInterviewer, and Durable
Thinking. It also corrects their current summaries elsewhere on linxule.com.
Xule authorized the audit, necessary follow-through fixes, and deployment in
the Teaching chat. This authorization superseded the earlier publication hold.

## Findings and fixes

- Memex now describes the standalone CLI and Claude Code, Codex, and Kimi Code
  integrations. Automatic hooks remain specific to Claude Code.
- Vox now describes multiple providers, compatible local servers, conversation
  threads, and JSON or Markdown export. The old provider count is removed.
  Its verified license is Apache-2.0, not MIT.
- OpenInterviewer now links to the scripted synthetic demo and Cloudflare
  installer. The copy separates the keyless, nonpersistent demo from real
  studies, which require deployment, inference, storage, and consent and data
  handling decisions. The installer is linked without a one-click or complete
  verification claim.
- Durable Thinking is added with MIT licensing and attribution to MCP's
  Sequential Thinking reference server. The copy describes submitted notes,
  branches, revisions, retrieval, and deletion in the deployment owner's
  Cloudflare account. It does not imply access to hidden model reasoning.
- The catalogue's search metadata, both website CVs, and `llms.txt` carry the
  current descriptions. The local academic CV derivative has only the same
  four description lines updated; its export metadata is preserved. No CV PDF
  was regenerated or verified.
- The outdated OpenInterviewer setup bullet in LOOM XV has a dated correction.
  The historical essay's argument and account of its original tools remain intact.
- `llms.txt` no longer assigns MIT to every linked repository. `REUSE.toml`
  now includes the catalogue prose under the existing CC BY 4.0 prose license.

The existing catalogue data already generates HTML, Markdown, JSON-LD, and
`site-index.json`. No template change was needed. The legacy `/projects` and
`/projects.md` redirects still lead to `/builds` and `/builds.md`. The catalogue's
social card remains accurate. Regeneration produced no changed asset bytes.

## Public primary evidence

Sources were read at these public commits on October 6, 2026:

| Project | Verified source | Evidence used |
| --- | --- | --- |
| Memex | [README at 1b5f4bf](https://github.com/linxule/memex-plugin/blob/1b5f4bf3abbfbc645020d2e62b67b84e5b3cde42/README.md) | CLI, local vault, portable integrations, Claude-only hooks; MIT license |
| Vox MCP | [README at 6044035](https://github.com/linxule/vox-mcp/blob/6044035a5fee3519db539f94b2c8009fdd707bbe/README.md) and [LICENSE](https://github.com/linxule/vox-mcp/blob/6044035a5fee3519db539f94b2c8009fdd707bbe/LICENSE) | Multi-provider routing, local compatibility, threads, exports, prompt behavior; Apache-2.0 |
| OpenInterviewer | [README at 397f18d](https://github.com/linxule/openinterviewer/blob/397f18d4cd35ed0d8c28b2492472c2b5a7fb62be/README.md) and [installer](https://github.com/linxule/openinterviewer/blob/397f18d4cd35ed0d8c28b2492472c2b5a7fb62be/docs/operations/cloudflare-migration/INSTALLER.md) | Scripted demo, no AI calls or persistence, real-study requirements; MIT license |
| Durable Thinking | [README at 99618ce](https://github.com/linxule/durable-thinking/blob/99618cebe9138d640425e356039b83706f7c91b8/README.md) and [NOTICE](https://github.com/linxule/durable-thinking/blob/99618cebe9138d640425e356039b83706f7c91b8/NOTICE) | Explicit notes and storage boundaries, retrieval/deletion, upstream adaptation; MIT license |

All four repository license files were read. The public demo returned HTTP 200
and identified its content as scripted and synthetic. No AI-provider or study-data
requests were made as part of this audit.

## Verification and isolation

- The isolated candidate passed `bun run build`: all lints, 101 passing tests,
  zero failures, and one existing skipped local-guide test.
- The production build used `bunx vercel@58.8.0 build --prod --scope
  linxules-projects` from the clean detached `.deploy-worktree` at the release
  commit. The same complete gate passed again.
- Browser checks passed at widths 1440, 390, and 320: one primary link per
  reviewed project, complete visible copy, correct supplementary links, no
  horizontal overflow, and no browser errors. Screenshots were inspected.
- HTML metadata, JSON-LD, the catalogue Markdown, the project JSON index,
  `llms.txt`, and both CV Markdown outputs matched source. A Pagefind search
  for Durable Thinking returned the catalogue and opened it successfully.
- An independent Kimi review checked all four Chinese entries against English,
  including source-byte parentheses checks. It found no mistranslations or
  omissions. Two optional literalness changes were retained as idiomatic or
  supported by the upstream attribution.
- All 94 shared `src/tsm` file paths and hashes remained unchanged. The payload
  contained exactly the 88 committed TSM files, each byte-equal to the release
  checkout. None of the separate tracked or untracked TSM work was included.
- Payload: 1.4 GB by `du`, 1,457,304,260 logical bytes, 4,231 files, no
  space-named files. All 3 optimized PNG variants had real transparency.
- Source release: `f2b76f52a26f361cd018a8478a144365377a9c97`, pushed to `main`.
  Git auto-deploy remains disabled. Deployment uses existing Vercel CLI
  authentication; no 1Password or unrelated provider credentials were accessed.
- Build fingerprint:
  `d7931757640b0a0329098735009ed8785d4d746a972ce6633502d23f487b60c3`.
  It matches the isolated candidate's fingerprint.

## Deployment record

Rollback recorded before publishing:
`dpl_6ubfmCxcpRS28AJc91edV6Vg5c5m`, release
`a39b150adb7c8e0a29812589c1be2a2c2bbd3702`.

Completed October 6, 2026, at 1:04 PM CEST.

| Role | Deployment | Release |
| --- | --- | --- |
| Current, READY | `dpl_GnyvyfjeU1sxu1kKofKsFhTTKW4j` | `f2b76f52a26f361cd018a8478a144365377a9c97` |
| Recorded rollback, READY | `dpl_6ubfmCxcpRS28AJc91edV6Vg5c5m` | `a39b150adb7c8e0a29812589c1be2a2c2bbd3702` |

The release was deployed once, using the approved prebuilt command. Vercel
confirmed READY and the `linxule.com` and `www.linxule.com` aliases on the new
deployment. The deployment URL is
[linxule-rai7eborn-linxules-projects.vercel.app](https://linxule-rai7eborn-linxules-projects.vercel.app).

Live verification passed for the [homepage](https://linxule.com/),
[Writing](https://linxule.com/writing), [Making](https://linxule.com/making),
[catalogue](https://linxule.com/builds), [English CV](https://linxule.com/cv),
[Chinese CV](https://linxule.com/cv-zh),
[LOOM XV](https://linxule.com/writing/loom-xv-theorizing-by-building),
[AI-readable guide](https://linxule.com/llms.txt), and
[JSON index](https://linxule.com/site-index.json). Direct
[catalogue Markdown](https://linxule.com/builds.md) and `Accept: text/markdown`
negotiation returned identical bytes. Both legacy project redirects resolved to
the catalogue. The complete live build manifest, including `head` and
`fingerprint`, matched the local manifest with and without a cache-busting query.

The focused browser checks also passed against production at all three widths,
including search, source-to-output fidelity, and browser error checks. The live
catalogue screenshot was inspected.

Retention dry-run preserved the two recorded IDs and proposed only
`dpl_6fH9YjKy69nhf1QswbHWwTWBhq5z` for removal. The bounded apply deleted that
older unaliased production snapshot and verified exactly two READY deployments.
The homepage still returned HTTP 200 after cleanup, and the manifest still
matched. The deployment worktree's `.vercel/output` was then removed; its
protected build/cache symlinks remain intact.

No release blockers remain. This record is a documentation-only follow-up to
the deployed source commit; it does not require another deployment. Research
Memex, the SKEMA Word document, correspondence, and the separate TSM work were
not changed or published by this release.

Local command logs, primary-source snapshots, manifests, screenshots, and
content-isolation hashes are retained under
`tools/catalogue-release-2026-10-06/` in the shared repository (gitignored).
