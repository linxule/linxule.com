# Authoring: code map and the gotchas that bite first

Tracked on purpose. `.claude/rules/` and `.claude/docs/` are gitignored (the
repo is public; they are private) and exist only in the main checkout, so a
fresh clone or an agent that reads only `AGENTS.md` starts with this file and
nothing else. Keep it to what someone editing templates or content needs
before their first change; the long numbered list stays in
`.claude/docs/gotchas.md`.

For the full procedures (adding a portrait, deploying an artifact, papers,
talks, social cards), a clone on either of the author's Macs runs
`bun run workspace:link`, which links the private rules and docs in from the
main checkout. It finds that checkout through the worktree link, then the
usual location, or `XULE_SITE_MAIN`. Use `--copy` where links cannot be
followed; copies are disposable, so edit only in the main checkout.

## Code map

- `eleventy.config.js` imports from `eleventy/`: `shapes.mjs` (canonical twinned-shape registry), `redirects.mjs` (pure ESM single source of truth for all 57 redirect rules, `DISCOVERY_LINK_HEADER`, `matchRedirect`, and RFC 9110 `prefersMarkdown`), `strings.js`, `collections.js`, `filters.js`, `shortcodes.js`, `transforms.js`, `image-pipeline.js`, `og-card-paths.js`, `rendering-fidelity.js`. Global data catalogs live in `src/_data/` (`site.js`, `seriesCatalog.js`, `conceptsCatalog.js`, `collaboratorsCatalog.js`, `mcpServerCard.js`, `agentSkills.js`).
- `worker.ts` (configured by `wrangler.jsonc`) serves the site on Cloudflare Workers + Static Assets (`./_site`). It imports `MD_PATHS` from `eleventy/shapes.mjs` and `DISCOVERY_LINK_HEADER`, `matchRedirect`, and `prefersMarkdown` from `eleventy/redirects.mjs` to handle `www` → apex redirects, all 57 legacy redirects, trailing-slash `308` stripping, direct `200` `Accept: text/markdown` negotiation via `env.ASSETS.fetch`, deterministic content/discovery headers, and automatic `X-Robots-Tag: noindex, nofollow` on `*.workers.dev` previews. Static asset cache and CORS headers live in `src/_headers` (passthrough-copied to `_site/_headers`). `src/_includes/layouts/base.njk` loads the explicit Cloudflare Web Analytics beacon (`static.cloudflareinsights.com/beacon.min.js`).
- `mcp/` holds the stateless, zero-dependency `linxule-mcp` Cloudflare Worker (`mcp/worker.mjs`, `mcp/wrangler.jsonc`, `mcp/worker.test.mjs`) serving `https://linxule.com/mcp` and `GET`/`HEAD` `/mcp/server-card`, backed by `/site-index.json`, `/.build-manifest.json`, and the site's authored `.md` twins. `mcp/metadata.mjs` is the single source of truth shared with Eleventy via `src/_data/mcpServerCard.js`.
- Agent-discovery templates live at the root of `src/`: `src/mcp-server-card.json.njk` (`/.well-known/mcp/server-card.json`), `src/ai-catalog.json.njk` (`/.well-known/ai-catalog.json`, ARD v1.0), `src/api-catalog.njk` (`/.well-known/api-catalog`, RFC 9727 linkset), `src/connect.njk` + `src/md-outputs/connect.md.njk` (`/connect` & `/connect.md`), alongside `src/llms.txt.njk`, `src/site-index.json.njk`, and `src/agent-skills-index.json.njk`. See `docs/agent-discovery.md` for surface rules and excluded hosts.
- Content types, each with its own layout in `src/_includes/layouts/` (or root template): Writing, Portraits, Artifacts, Thinking, Concepts, Teaching, Builds, Vellum, Connect, CV (en/zh), Talks, Papers. Standalone sub-apps live at root subpaths (`/tsm/`, `/play/`); slide decks at `/assets/slides/`.
- Images: the `optimizedImage` shortcode (Making) and the writing transform
  both go through `eleventy/image-pipeline.js` and emit AVIF, WebP and a JPEG
  fallback. No PNG output except for sources with real transparency. Portrait
  originals are download targets and are never re-emitted; lightboxes show the
  2000w WebP.
- Social cards: every page gets a 1200×630 card from
  `scripts/gen-og-cards.mjs`. Cyan appears on a card only as that page's
  authored accident.
- Inline `<style>` per page is intentional. Global styles are in
  `src/assets/css/main.css`; a class defined there leaks into pages that reuse
  its name.
- `bun run verify` runs the lints and regression tests (`scripts/check-*.mjs`,
  `scripts/*.test.mjs`, and `mcp/worker.test.mjs`). The token lint
  (`scripts/check-tokens.mjs`) enforces the type scale, ink usage, hover-gated
  grayscale, and one accident per work; `scripts/check-renderings.mjs` verifies
  `worker.ts`, `wrangler.jsonc`, and `_site/_headers` parity alongside every
  twinned shape; `scripts/check-sitemap-redirects.mjs` checks all redirect rules
  in `eleventy/redirects.mjs` against `sitemap.xml`; `scripts/worker.test.mjs`
  exercises the Cloudflare Worker handler; and `scripts/check-built-json.mjs`
  validates JSON-LD, `site-index.json`, and all agent-discovery artifacts
  (including parity between `/.well-known/mcp/server-card.json` and
  `mcp/metadata.mjs`).

## Frontmatter

- **`keywords`, not `tags`**, is the field.
- **`prompt` and `contextExcerpt` are arrays**, one line per item, in the
  stagger pattern, with exactly one line marked `accident: true` per work.
  Quoting the same accident again in the full context is an echo, not a second
  accident.
- **Quote any list item that contains a colon followed by a space.** Unquoted,
  YAML reads it as a mapping and the page renders `[object Object]`.
- **Interactive and video artifacts need `thumbnail:`**, or the Making index
  embeds a live iframe. Large video goes to R2 (`media.linxule.com`), never
  into git.

## Templates

- **No `| reverse` on `collections.writing`.** It is already newest-first.
- **Guard arrays that may be undefined** (`contextExcerpt`, `prompt`,
  `images`) with `{% if array %}` before reading them.
- **Don't move the FOUC cloak in `base.njk`.** It hides `body` until fonts are
  ready (1.5 s fallback) and does not reach iframes.
- **Typefaces are self-hosted and named only by `--font-*` tokens.** Every face (including upright `Noto Serif SC` and italic `LXGW WenKai`) is declared at the top of `main.css` with hash-named `.woff2` files in `src/assets/fonts/` and recorded in `MANIFEST.tsv` — no Google Fonts `<link>` in `base.njk`. After adding text that sets Chinese in upright serif or italic, build and run `bun run fonts:noto` (upright) and/or `bun run fonts:kai` (italic), then commit what they change with the content; `verify` (`bun run fonts:lint`) names the page and characters until you do.
- **Sizes under 1rem and letter-spacing use tokens** (`--size-*`,
  `--tracking-*`); `--ink-ghost` is for rules and ornament, not text; resting
  grayscale goes inside `@media (hover: hover)`. The token lint fails the
  build otherwise.
- **Prose set smaller than the body takes `max-width: var(--measure-own)`**
  (28em of its own size, about 70 characters), not a rem width and not the
  width of its container. `--measure` is for body-size text only.

## Writing

- **Images are plain Markdown with alt text**: `![what the image shows](path)`.
  The transform builds the `<picture>`; an empty alt is flagged by search
  engines and is useless to a screen reader.
- **Footnotes** render as marginalia on desktop and as endnotes at ≤1100px.
  Drop any `## Notes` heading the source put before the definitions.

## Assets

- **Don't request a brand-new `/assets/*` file by its bare URL until the
  deploy is confirmed live.** The immutable one-year cache header applies to a
  404 too. Probe with a cache-busting query first.
- **`/assets/*.html` is cached by browsers**, so iframes that load one carry a
  `?v=` version.
