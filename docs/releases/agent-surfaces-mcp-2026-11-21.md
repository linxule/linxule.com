# Agent surfaces, ARD catalog, and `linxule-mcp` — 21 November 2026

Authorized by Xule on 21 November 2026 ("b! hahah my fav too"). Pushed, built
from `.deploy-worktree`, deployed to Vercel and Cloudflare Workers, and
live-verified across both `linxule.com` and `research-memex.org`.

Recorded rollback before publishing: `dpl_4yBRX333ZvrowdLxDjCfwxx5DcSh`
(source `d1649cdb885fb66ddd186f547d17f4b4970eb5ce`, READY on the canonical
domains — the 13 November Making opening release).

## What shipped

Four commits on `main`, culminating in deployed SHA
`af2ca1aaa578a42d0e539e2e8226f46d10d8da62` (with this publish record added as a
docs-only commit immediately afterward):

| Commit | Change |
| --- | --- |
| `0d087b7` | Update 34 moved `research-memex.org` URLs across essays, builds, and Markdown templates to canonical `/docs/craft/*` paths (plus `"nine failure modes"`). |
| `9355a96` | Add ARD v1.0 `/.well-known/ai-catalog.json` (`src/ai-catalog.json.njk`), `Agentmap:` in `robots.txt`, `<link rel="ai-catalog">` in `base.njk`, expanded `Link` headers in `vercel.json`, and build-time ARD validation in `scripts/check-built-json.mjs`. |
| `a1d38ba` | Add `linxule-mcp` (`mcp/metadata.mjs`, `mcp/worker.mjs`, `mcp/wrangler.jsonc`, `mcp/worker.test.mjs`) — a stateless, zero-dependency, read-only Streamable HTTP Cloudflare Worker at `https://linxule.com/mcp` and `https://linxule.com/mcp/server-card` (`search_site`, `list_site`, `read_page`, curated `linxule://` resources, and `xule-research-navigation` prompt) — plus `/.well-known/mcp/server-card.json` (`src/mcp-server-card.json.njk` + `src/_data/mcpServerCard.js`), `urn:air:linxule.com:mcp:linxule` in `ai-catalog.json`, and `/mcp` anchor in `/.well-known/api-catalog`. |
| `af2ca1a` | Pin `typescript: "^5"` (`5.9.3`) in `devDependencies` so `vercel@58.8.0 build --prod` resolves local TypeScript 5 rather than `~/node_modules/typescript@7.0.2` when compiling `middleware.ts`. |

## Publication

- **Vercel (`linxule.com`)**: Built in `.deploy-worktree`, detached at
  `af2ca1aaa578a42d0e539e2e8226f46d10d8da62`, with
  `bunx vercel@58.8.0 build --prod --scope linxules-projects`. Checked for
  dataless files (none) and space-named files (`0`). Output size `1.5 GB`
  (`4,430` files, `16.3 MB` delta uploaded).
- Deployed once: `dpl_3V7aUiWHi3P756PbCgPHecjMG6yH`
  (`https://linxule-ovya6dywt-linxules-projects.vercel.app`), `READY`, aliased
  to `linxule.com`, `www.linxule.com`, `linxule-com.vercel.app`, and
  `linxule-com-linxules-projects.vercel.app`.
- Manifest fingerprint:
  `ee744370c0ea22924d1b61fa7c4c405ee3fca62d961a9a9c4c2404edd7d63aa5`.
- **Cloudflare Worker (`linxule-mcp`)**: Deployed to routes `linxule.com/mcp`
  and `linxule.com/mcp/*` (`45.50 KiB` / `10.98 KiB` gzip), Version ID
  `eb6bef75-1c68-42cd-be00-490cd3c11db8`. Custom domain
  `lotus-wisdom.linxule.com` also attached to `lotus-wisdom-mcp`, zone hardened
  (`ssl: strict`, `min_tls_version: 1.2`, `speed_brain: off`,
  `hotlink_protection: off`, `content_converter: off`), and edge `X-Robots-Tag: noindex, nofollow` rules active on `open-interview-staging.linxule.com` and `a4b.linxule.com`.

## Verification

- Full `bun run build` (`build:site` + `verify`) passed in both `xule-site` and
  `.deploy-worktree`.
- Live `/.build-manifest.json` matches built `head` (`af2ca1a...`) and
  `fingerprint` (`ee744370c0ea...`).
- Live HTTP `200` confirmed on `/`, `/writing`, `/making`, `/builds`,
  `/concepts`, `/.well-known/mcp/server-card.json`, `/mcp/server-card`,
  `/.well-known/ai-catalog.json`, `/.well-known/api-catalog`, and
  `/.well-known/agent-skills/index.json` (with verified SHA-256 skill digest).
- Live `@modelcontextprotocol/client` (`StreamableHTTPClientTransport`) session
  against `https://linxule.com/mcp` verified `listTools` (`search_site`,
  `list_site`, `read_page`), `search_site("Polanyi Inversion")`, and
  `read_page("/")` (`3,040` bytes, SHA-256 verified).
- `bun run seo:agentready --site all` in `research-memex` passed **0 failures**
  on both `https://research-memex.org` and `https://linxule.com` — **Level 4
  (Agent-Integrated)** (`23 pass, 0 fail, 5 expected-na` each), with
  `mcpServerCard`, `ard` (7 resources), and `webMcp` (5 tools:
  `scan_images_c2pa`, `inspect_image_c2pa`, `search_site`, `list_site`,
  `read_page`) all green.
- IndexNow: submitted `139` URLs (`HTTP 200`).

## Cleanup

- Retention dry-run and `--apply` completed: deleted
  `dpl_CGt9VA18qMMJVFSeYMivrxqMYmAQ`; verified `dpl_3V7aUiWHi3P756PbCgPHecjMG6yH`
  (current) and `dpl_4yBRX333ZvrowdLxDjCfwxx5DcSh` (rollback) are the only READY
  deployments.
- Re-checked live `https://linxule.com/` (`200`) and `/.build-manifest.json`
  after deletion.
- Deleted `.deploy-worktree/.vercel/output`.
