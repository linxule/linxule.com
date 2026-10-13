# Making additions — reviewed locally, awaiting publication

The October 14 batch adds two works:

- **Unfinished Light** (GPT-6 Astra, September 8): the v3 interactive loom and procedural score, a three-minute film, artist notes, and reciprocal links to its existing portraits.
- **Why Put a Ventriloquist on the Air?** (Claude Opus 5.5, September 30): the final phonautograph film, seven seekable chapters, and liner notes crediting the nine model contributions and sampled recordings.

The user authorized committing and pushing the local additions. This record is not a production release. Git deployments are disabled; the website and the two large videos remain unpublished.

## Media required before deployment

Both wrappers and their page `video.contentUrl` fields currently use local `film.mp4` placeholders. Those videos are deliberately absent from Git and the build output. Do not deploy this batch until the approved source films are hosted and all four references are replaced with verified media URLs.

Originals in the sibling `llm-world` checkout:

- `unfinished-light/gpt-6-astra/2026-09-08-v3-1080p.mp4` — 180 seconds, 1920 × 1080.
- `many-rooms/video/phono/why-put-a-ventriloquist-on-the-air.phonautograph.mp4` — 876.715 seconds, 1920 × 1080. Use this final film, not an earlier dashboard/tower version or the social excerpt.

On the review machine, `personal-website/tmp/making-2026-10-14/preview.mjs` serves the built site on port 4175 and maps exactly these two source files to the placeholder routes, with HTTP Range support. It performs no upload. The same directory holds the review scripts, logs and screenshots.

## Source handling and checks

The loom preserves the bundled scene and score, Three.js license and font licenses. Its four reference image hashes match the existing portrait originals; the embedded edition reuses those files. Adaptations add noindex metadata and fit the controls to small embedded windows. Its reviewed same-origin sandbox exception permits the local module and fonts.

The album's text and timings come from `many-rooms/POSTS.md`, `LINER-NOTES.md` and `video/phono/segments.json`. The displayed notes omit a prospective promise to send First Sounds a copy; the downloadable original is unchanged. No messages were sent and no social links were added.

Validation: full site build and verification passed; Making regressions passed (17 passed, 13 skipped). Browser checks covered album duration and chapter seeks at desktop, 390px and 320px; expandable liner notes; loom entry, audio start, mute and About; film seeking and player teardown when switching tabs. Desktop and mobile screenshots were inspected. The source files and unrelated `src/tsm` work were left unchanged.

When publication is authorized, follow `docs/publishing.md`, including a committed detached worktree, production verification and retention cleanup.
