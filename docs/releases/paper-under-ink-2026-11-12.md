# Paper under ink — 12 November 2026

Authorized by Xule on 12 November 2026 ("push merge deploy :3"), after he had
seen sixteen before/after pictures of the branch. Pushed, merged, deployed and
live-verified the same evening. This is the second release of the day; the
first is `design-2026-11-12.md`.

Recorded rollback before publishing: `dpl_ApgCo8oNx61UXMyrmR6prtR6tW6U`,
source `11fc1260c29444fe993ca48d97c7b542b43df795`, READY on the canonical domains.

## What shipped

Branch `design/paper-under-ink`, 25 commits on `a1d4793`, fast-forwarded into
`main` and pushed. `main` = `origin/main` = `14045b04d62e488ac11c9c0f103d03b2cf213549`
at the time of the build. (This record is one docs-only commit after it.)

| Commits | Change |
| --- | --- |
| `c48a684` `710edd1` `ca47f6a` `08ee1b2` | **Paper.** The texture layer moved under the text, so every ink renders at its declared value (body ink had measured 7.4:1 instead of 15.4:1 on some page types). The paper is made at build time by `scripts/gen-paper.mjs`, one seamless tile per stock, instead of in the browser on every load. Making, Thinking and Concepts get the workshop stock, softened to its designed grain. A test checks that nothing sits between reader and ink. |
| `75371aa` `7954dd0` | **Typefaces.** Families are named once, in `--font-*` tokens (token lint T6, T7). All faces are served from `/assets/fonts/`, each file named by its hash: EB Garamond for reading text (400/500, roman and italic), Cormorant Garamond Light for display titles only, the 8-point EB Garamond italic for margin notes, IBM Plex Mono, and LXGW WenKai as the italic of the Chinese serif. Nothing is synthesized. New `fonts:lint` in `verify`. |
| `9a8b40a` `7af8070` `856a11b` `d0b048e` `39ea234` `21cccc1` | **Measure.** Reading column 38rem → 32rem (about 70 characters). An essay with no margin notes is centred. An image narrower than the figure is centred on the text column. `--measure-own: 28em` holds prose set smaller than the body (artifact context and collaborator notes, portrait and Builds descriptions). The home opening keeps its five lines. `text-wrap: pretty` on body, so blocks no longer end on one stranded word. |
| `52c1c4f` `ea9efb3` `e2e00ed` | **Margin notes.** Each note sits beside its reference instead of below the previous note. Notes wrap as ordinary text, so Safari places them as Chrome does. The footnote return test checks where the link lands, not its animation. |
| `4077a65` `7fed492` | **Addresses.** Every spread of the scroll books has an id; repeated definition callouts get their own ids (`-2`, `-3`). `renderings:lint` fails on a repeated id. |
| `8e210ef` `0665ea3` `1236e49` | **Keyboard, touch, phone.** Focus gives a portrait plate what hover gives; the bloom no longer parks under a finger. Making's filter chips wrap, so the page fits a 360px phone; `tests/reading/width.spec.js` measures laid-out width on 16 pages. The spine's veil eases out instead of ending on an edge. |
| `e622318` `7305576` `723a502` | **Machine renderings.** The papers index is built from the papers collection; a paper's year is ink, not cyan. Markdown twins carry what their pages show (accident, entities, spacers). Two lines of text hidden from people and addressed to AI readers are removed; the open `llms.txt` link and `rel="alternate"` remain. |
| `c6ae0db` | Chinese CV: spaces around parentheses, curly quotes. Text only. |
| `14045b0` | Docs: `--measure-own` in `docs/authoring.md`; font checks at publish in `docs/publishing.md`. |

## Publication

- Built in `.deploy-worktree`, detached at `14045b04d62e488ac11c9c0f103d03b2cf213549`,
  with `bunx vercel@58.8.0 build --prod`. The worktree was checked for dataless
  files first (none). Payload 1.5 GB, 4,427 files, zero space-named files. Three
  PNGs in the optimized images are one transparent source at three widths.
  20 font files, 463 KB in all (the largest, a Kai slice, is 177 KB), and
  184 KB of paper.
- Deployed once: `dpl_CGt9VA18qMMJVFSeYMivrxqMYmAQ`
  (`https://linxule-7u6wvt9a0-linxules-projects.vercel.app`), READY, aliased to
  `linxule.com`, `www.linxule.com`, `linxule-com.vercel.app` and
  `linxule-com-linxules-projects.vercel.app`. 16.7 MB was new to Vercel; the
  rest was already stored.
- Manifest fingerprint `b690c0fa10d73ed126c8a43ac316ccffae9dc9e58448438c1debda69657fd69c`.

## Verification

- Build: every lint and test group in `verify` passed, including `fonts`
  (20 files, all used, preloads match) and `cjk-italic` (817 italic CJK
  characters, all in the Kai subset). One artifact-pipeline test is skipped in
  the worktree by design.
- Live `/.build-manifest.json` (cache-busted) matches the built head and fingerprint.
- Live 200s on 18 pages: home, Writing, Making, a creator page, a portrait, both
  CVs, `/tsm`, a paper, Talks, Builds, Thinking, Concepts, Search, `llms.txt`,
  the feed and two essays. `www` redirects to the apex. `Accept: text/markdown`
  on `/writing` returns `text/markdown`.
- Live `main.css?v=14045b0` carries the EB Garamond faces and `--measure-own`;
  the home page links that stamped URL.
- Each of the 20 font files was fetched with a cache-busting query first, then
  at its bare URL: all `200 font/woff2` at the committed size.
- Cold browser (headless Chromium, empty cache) against production: the drawn
  face of 14 elements read through `CSS.getPlatformFontsForNode` matches the
  local build (EB Garamond text and strong, Cormorant Light titles, the 8-point
  italic in margin notes, WenKai for italic Chinese, Noto Serif SC for upright
  Chinese), and the 16 pages of the look set were photographed from production;
  the margin-note essay, the Chinese portrait description and `/cv-zh/` were
  read by eye.
- **Not checked:** Safari and real phones. Only Chromium was photographed. Xule
  will report from ordinary use.

## Cleanup

- Retention applied: `dpl_GpR4ssvSamekvtoYTTLeKLkSRgs1` (`a300985`) deleted.
  Current and rollback are the only READY deployments. Homepage and manifest
  re-checked after deletion.
- `.deploy-worktree/.vercel/output` deleted.

## Incident: iCloud conflict copies after the font commit

Not a deploy incident, but it would have become one. After the 63-file font
commit landed in the iCloud-synced checkout, iCloud left a dataless ` 2` copy
beside 29 of the changed files (`src/index 2.njk`, `src/assets/css/main 2.css`,
…), each the size of the previous version. A recursive grep hung on them, and
Eleventy would have built them as pages. All 29 were matched by size against
`git cat-file -s HEAD~1:<path>` and deleted unread. The deploy worktree, a
fresh checkout of the SHA, had none.

After a large patch, before building anywhere:
`find . -name '* 2.*' -not -path './node_modules/*'`. Search tracked files with
`git grep`, which never touches a conflict copy.
