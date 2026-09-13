# SEO review — 2026-09-13

Status: published commit `174b59f7f4c25a64849797e16dd366ff9d040ec9` from the isolated deployment worktree. Production `dpl_6avETimFhi26akBMB8KXAynAM9gC` is READY and serves linxule.com. Live manifest head and fingerprint match the committed build. Rollback `dpl_BpiLgx8KCh2t94wbH3SBDZCGpdkd` retained; guarded retention confirmed only current and rollback remain. All three video warning detail pages now say “Validation started”, dated September 14. Google separately accepted the LTAC indexing request. These are pending crawls, not passed validations.

## Next-session handoff (user confirmed September 14)

This record is committed locally only. Do not push these notes or deploy as part of saving them. No reminder or recurring automation was requested.

- UI/UX and the authored visual identity take priority over SEO scores. Bing design warnings are diagnostic suggestions, not automatic change requests; accepting an SEO tradeoff is valid.
- The user reviewed the Research Memex homepage changes and explicitly approved keeping all six H1-to-H2 changes, the two separator removals, and the two related heading assertions. Do not revert them on the assumption that the general UI-first preference rejects this specific change.
- Next visit: check completion of the three Google video validations and whether the LTAC talk is indexed. Re-fetch live status; the September 14 record only confirms validation/indexing requests were accepted.
- Performance work is deferred until next time. Investigate paper.js main-thread blocking and contrast with measured before/after rendering; preserve paper texture, typography, interaction, and the intentional cyan accent. Scores alone are not acceptance criteria.
- Beyond code: examine relevant search queries, reader intent, entry pages and navigation, canonical article coverage/internal links, and citations/referrals. Keep web clicks, Google AI impressions, and Bing sampled citations separate.
- Revisit the GSC script runtime and its misleading sampled-total labeling as maintenance, without treating sampled query sums as property totals.
- The corresponding Research Memex handoff is in /Users/xulelin/Documents/GitHub/research-memex/review/seo-2026-09-14.md.

## Published changes

- `src/_includes/layouts/base.njk`: video descriptions for both talk-recording branches; full ISO datetime with timezone for all 15 VideoObjects. The two YouTube recordings use independently checked publication timestamps, rather than the earlier event dates. Artifact dates retain the existing authored publication day, serialized at UTC midnight when no explicit `video.uploadDate` is supplied; midnight is a date-normalization convention, not a recovered upload time.
- `src/talks/rethinking-human-ai-collaboration-interpretive-research.md`: YouTube fPoVMFEh6TM publishes `2026-01-29T08:50:27-08:00`.
- `src/talks/thinking-through-ai-01.md`: YouTube pE0lnabQYg8 publishes `2026-04-30T06:30:21-07:00`.
- Artifact metadata now derives from the title, medium, and complete existing excerpt instead of just its first short line. Visible artwork text is unchanged. Raw capture is escaped once at each output boundary; apostrophes were checked in both generated HTML and JSON-LD.
- `src/concepts/index.md`, `src/thinking/index.md`: fuller `seoDescription` overrides, with visible descriptions and headings preserved.
- `src/search.njk`: `noindex,follow` for the internal search utility; this also excludes it from the sitemap through the existing template policy.
- `src/robots.txt.njk`: `License` and `LLMs-Txt` are comments rather than unsupported directives. Their URLs remain readable. Existing HTTP discovery links, Allow, Sitemap, and affirmative AI Content-Signal policy remain intact.
- `scripts/check-built-json.mjs`: recursively checks top-level and nested VideoObjects for name, description, absolute thumbnail URLs, and timezone-qualified datetimes. It caught 17 problems in the old build (15 date values plus two absent descriptions).

Verification: final `bun run build` includes all normal verification commands; 118 JSON-LD blocks and 15 VideoObjects pass, together with 93 existing tests. Focused assertions also confirm correctly escaped apostrophes, exact YouTube timestamps, and search noindex/sitemap exclusion. Unrelated dirty `src/tsm/` work was not changed. Production must use the isolated committed-SHA flow in `docs/publishing.md`.

Google's [video structured-data documentation](https://developers.google.com/search/docs/appearance/structured-data/video) defines uploadDate as the first publication datetime, recommends timezone information, and recommends a video-specific description. The [robots specification](https://developers.google.com/crawling/docs/robots-txt/robots-txt-spec) documents supported directives and comment syntax.

## Live Google evidence

- Video enhancements, updated September 12: one valid item, zero invalid; all three screenshot warnings affect the January interpretive-research talk, last crawled September 12. Its live HTML reproduced the missing description and date-only uploadDate.
- Video indexing, updated September 10: two videos indexed; zero currently not indexed; historical watch-page reason has count zero. Structured-data validity and actual video indexing are separate reports.
- Page indexing, updated September 4: 144 indexed; 924 excluded. Breakdown: noindex 409, redirects 276, crawled/not indexed 188, discovered/not indexed 38, 404s 9, redirect errors 4. Both duplicate/canonical issue categories show Passed with zero URLs.
- The 188 crawled/not-indexed examples include many markdown variants, tag archives, slash variants, and legacy URLs; they are not 188 missing canonical articles. Canonical article examples that deserve a later content/internal-link review include Frozen Moments, LOOM III, SEAM I, LOOM VII, LOOM I, Thirteen Dreams, Celestial Collaboration, The AI Whisperer, The Foreclosure Problem, Whispered Agency, and Six Dimensions of Understanding. The aggregate report is older than the live URL inspection data; verify individual status before acting.
- Every one of the nine reported 404 URLs now redirects to a 200 destination, including `/terms/` to `/license.xml` and renamed tag routes. All four redirect-error URLs also resolve: `/talks/2023-04/ukfan` to `/cv`, `/curation-mgmt/` to `/cv`, `/about/` to `/`, and `/teaching/2014-spring-teaching-1` to `/teaching`. Validation was already running from July. No new redirects are warranted by these examples.
- Submitted sitemap: zero errors, zero warnings. All 129 currently live sitemap URLs return HTTP 200 without following a redirect. The LTAC talk is present. Local sitemap after excluding Search has 128 URLs.
- URL inspections: both recorded talks, Thinking, Concepts, and Interpretive Orchestration are submitted and indexed. The LTAC talk was unknown to Google; its Request indexing flow completed with “Indexing requested” and confirmation it entered a priority crawl queue. That is a request, not confirmation of indexing.
- HTTPS, updated September 11: zero non-HTTPS issues; no issues detected in 90 days.
- Core Web Vitals, updated September 12: insufficient real-user data for both mobile and desktop; this is not a passing CWV assessment.

Comparable property-level Search Analytics windows (final data; 28 days each):

| Window | Clicks | Impressions | CTR | Average position |
| --- | ---: | ---: | ---: | ---: |
| Aug 14–Sep 10 | 33 | 1,390 | 2.37% | 10.57 |
| Jul 17–Aug 13 | 32 | 1,235 | 2.59% | 11.35 |

Traffic is broadly stable at a small scale; impressions increased 12.6%. Existing striking-distance/CTR-gap scripts found only the branded `xule lin` query to `/cv` above their thresholds. This does not support a broad title rewrite.

The existing GSC history command saved its query/page/country snapshot. Its `totals.csv` sums disclosed query rows, which omit anonymized searches; do not treat those sums as property totals. Authoritative comparison is saved separately in `scripts/gsc/history/seo-review-2026-09-13.json`. The local query tool also emits Python 3.9/dependency warnings despite returning API results; its runtime and historical-total labeling are maintenance follow-ups.

## Bing and other live checks

- Bing Recommendations: 19 moderate short-description warnings and no listed high/low categories. Fifteen are artwork pages; Concepts and Thinking are addressed by this patch. The Chinese CV has a substantive 82-character Chinese description; do not pad it to an English character target. `/tsm` is left to its active workstream.
- Bing Search Performance, June 13–September 12: 6 clicks, 455 impressions. This is a different period from the Google comparison.
- Bing AI Performance, same three months: 39 sampled citations from Microsoft Copilots and partners. Page breakdown: Synaptic Bloom 30; Research Memex essay 4; LOOM VI 3; homepage 2. Grounding-query details were unavailable. This is not a measure of all AI services or of referral clicks.
- IndexNow: dashboard shows 134 URLs submitted in the last 21 hours, source Cloudflare. Recent examples are largely image assets. This proves submissions are active, but does not prove that the manual post-publish script ran or that every new HTML page was submitted.
- Public robots, llms.txt, site-index.json, canonical tags, and representative HTML/markdown responses were reachable. A default Python-urllib request to the sitemap received 403, while normal curl, browser, and Google access succeeded. That alone does not establish a verified-crawler block. Cloudflare private analytics, Baidu, and scholarly identity providers were not audited in this pass.

Fresh [mobile homepage PageSpeed report](https://pagespeed.web.dev/analysis/https-linxule-com/hd8domr192?form_factor=mobile), September 13 at 23:47 Paris time: Performance 80, Accessibility 90, Best Practices 100, SEO 92; FCP 1.7 s, LCP 2.6 s, TBT 610 ms, CLS 0. These are one synthetic slow-4G mobile run, not field data. SEO's two findings are exactly the two robots directives fixed locally. The main performance issue is one 738 ms task in `assets/js/paper.js`; contrast warnings affect muted navigation/colophon text and the cyan phrase. A performance/contrast pass should preserve the paper texture and authored visual choices, and needs its own browser comparison before publishing.

## Publication and follow-up

1. Completed: eight-file commit, isolated production build, live manifest/talk schema/search-noindex checks, and guarded retention. The shared tree's unrelated TSM work was preserved. Pinned Vercel CLI 58.8.0 used prebuilt output; disposable output was removed after verification while build caches were preserved.
2. Completed: all three Google video warning validations started successfully September 14.
3. Completed: [post-publication mobile PageSpeed](https://pagespeed.web.dev/analysis/https-linxule-com/x3htrlfigv?form_factor=mobile), September 14 at 00:14 Paris, gives SEO 100, up from 92; the robots findings are gone. Accessibility 90, Best Practices 100, Performance 70. FCP 1.7s, LCP 3.1s, TBT 1,050ms, CLS 0. Speed varied from the earlier run's 80. This metadata patch did not change paper.js or fix its main-thread bottleneck; do not infer causation from two synthetic runs.
4. On a later check, inspect LTAC indexing and Google's pending validations. No new automation was created.
5. Separately consider paper-texture main-thread work, text contrast, canonical article indexing/internal links, and the GSC script's runtime and sampled-total labels.

Google's separate generative-AI-feature report shows 84 impressions versus 85 for the same two 28-day windows. Leading recent pages: Macaw (24) and Which AI Tool Should I Use (21). These are impressions, not referral clicks or Bing citations.

Research Memex received the corresponding audit and published fixes. Record: `/Users/xulelin/Documents/GitHub/research-memex/review/seo-2026-09-14.md`.
