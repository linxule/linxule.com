# Making's opening — 13 November 2026

Authorized by Xule on 13 November 2026 ("all good, let's fix all and ship"),
after he had seen four pictures of the local build. Pushed, deployed and
live-verified the same afternoon.

Recorded rollback before publishing: `dpl_CGt9VA18qMMJVFSeYMivrxqMYmAQ`,
source `14045b04d62e488ac11c9c0f103d03b2cf213549`, READY on the canonical
domains (the paper-under-ink release of 12 November).

## What shipped

Two commits on `0ac37f4`, fast-forwarded into `main` and pushed. `main` =
`origin/main` = `d1649cdb885fb66ddd186f547d17f4b4970eb5ce` at the time of the
build. (This record is one docs-only commit after it.)

| Commit | Change |
| --- | --- |
| `d1649cd` | **Making opens on itself.** The book used to open inside its Portraits chapter, with the contents beside that chapter's poem (under it on a narrow window) and a third part, Tools, that held only a pointer to `/builds/`. It now opens on a spread of its own (`#opening`, the bare `/making`): a statement and four lines from the page's front matter, in the shape Thinking and Builds open with, and the contents beside it. Portraits opens on its own spread like Artifacts. The contents lists two parts. The last page (`#end`) keeps the sentence about the tools and its linked accident; the line carries `id="tools"`, so an old `/making#tools` link opens that page. Four nav dots: Contents, Portraits, Artifacts, End. `/making.md` carries the opening and the Artifacts poem. |
| `566e613` | **Browser suites start again.** The machine's daily upgrade keeps only the browser build its newest Playwright uses; on 13 November it removed build 1243, which this repo's Playwright 1.63 expected, and every suite failed at launch. `@playwright/test` is now 1.65.0 (build 1254), and `playwright.config.js` launches the newest installed headless shell when the expected build is missing. With the expected build present, as in CI, nothing changes. No effect on the site. |

## Publication

- Built in `.deploy-worktree`, detached at `d1649cdb885fb66ddd186f547d17f4b4970eb5ce`,
  with `bunx vercel@58.8.0 build --prod`. The worktree was checked for dataless
  files and ` 2` conflict copies first (none). Payload 1.5 GB, 4,427 files in
  the output (4,400 static), zero space-named files. Three PNGs in the
  optimized images are one transparent source at three widths.
- Deployed once: `dpl_4yBRX333ZvrowdLxDjCfwxx5DcSh`
  (`https://linxule-8hhe41iiq-linxules-projects.vercel.app`), READY, aliased to
  `linxule.com`, `www.linxule.com`, `linxule-com.vercel.app` and
  `linxule-com-linxules-projects.vercel.app`. 16.1 MB was uploaded; the rest
  was already stored.
- Manifest fingerprint `9516e17b3272b93d92dc9f0a7d31e8325e9d0f638884b932782596288dc5b16c`.
- Vercel status before the build: indicator `none`.

## Verification

- Before the commit, on the shared checkout's build: `bun run build` (site and
  `verify`), then `test:making` (96 passed), `test:runtime` (14) and `test:ui`
  (44, 14 and 10), each run as written with no failures. Every browser suite
  across all sixteen window sizes had passed on the same change before the
  Playwright bump (954 passed, 0 failed).
- Production build: every lint and test group in `verify` passed. One
  artifact-pipeline test is skipped in the worktree by design.
- Live `/.build-manifest.json` (cache-busted) matches the built head and
  fingerprint.
- Live 200s on 20 pages: home, Writing, Making, `/making.md`, a prompter page,
  a creator page, a portrait, both CVs, `/tsm`, a paper, Talks, Builds,
  Thinking, Concepts, Search, `llms.txt`, the feed and two essays. `www`
  redirects to the apex. `Accept: text/markdown` on `/making` returns
  `text/markdown`. The home page links `main.css?v=d1649cd`.
- Live `/making` markup: the first spread is `#opening` with the statement;
  `#portraits`, `#end` and the `id="tools"` line are present; no third
  contents row and no tools grid; four dots. "← all portraits" on a prompter
  page goes to `/making/#portraits`.
- Cold browser (headless Chromium, empty cache) against production at
  1440 × 900: the statement is drawn in Cormorant Garamond; the contents lists
  Portraits and Artifacts; the Contents dot is lit on arrival; the Portraits
  link rests the book on `#portraits` with its dot lit and the address
  following; the End dot rests it on `#end`, where the Builds link is; a fresh
  arrival at `/making/#tools` rests on the last page. At 390 × 844 the order
  down the page is statement, contents, Portraits, and the page is 390 wide.
  The opening was read by eye from a production picture.
- **Not checked:** Safari and real phones. Chromium only.

## Cleanup

- Retention applied: `dpl_ApgCo8oNx61UXMyrmR6prtR6tW6U` (`11fc126`) deleted.
  Current and rollback are the only READY deployments. Homepage and manifest
  re-checked after deletion.
- `.deploy-worktree/.vercel/output` deleted.

## Notes

- The opening's words ("A book of things the models made." and the four lines
  under it) were drafted in the session and accepted as shown. They live in the
  front matter of `src/making/index.njk` as `thesis` and `thesis_continued`.
- A slip caught by the suites before commit: the cyan "Builds →" on the last
  page had been restyled as an ordinary link. It is the page's linked accident,
  and `tests/reading/keyboard.spec.js` uses it as its example; it was put back.
