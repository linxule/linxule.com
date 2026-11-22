# Agent Discovery

This site publishes honest agent-discovery metadata for Xule Lin's public research archive (`linxule.com`), its stateless read-only MCP Worker (`https://linxule.com/mcp`, `mcp/`), and its portfolio directory of public, general-audience sibling MCP servers. `linxule.com` does not expose an A2A endpoint, OAuth server, or protected write API — do **not** publish A2A cards, OAuth metadata, or Poppy stubs.

## Public Surfaces

- `https://linxule.com/mcp` is a stateless, zero-dependency, read-only Cloudflare Worker v2 (`mcp/worker.mjs`, `mcp/wrangler.jsonc`) implementing Streamable HTTP MCP (`search_site` with word-boundary/stem/CJK matching and `collaborator` filtering, `list_site` including `collaborators`, `read_page` with `#fragment`/`?query` stripping and SHA-256 verification, curated `linxule://` resources with optional `.md` suffix, and two prompts: `xule-research-navigation` and `enter-the-work`). It is backed strictly by `/site-index.json`, `/.build-manifest.json`, `/llms.txt`, and the site's authored `.md` twins, emitting `X-Linxule-Build` and `_meta: { sha256, canonical_url, build_head }` across resources and tool responses.
- `/.well-known/mcp/server-card.json` (`src/mcp-server-card.json.njk`, `Content-Type: application/json; charset=utf-8` + `Access-Control-Allow-Origin: *`) and Worker `GET` / `HEAD /mcp/server-card` (`Content-Type: application/mcp-server-card+json; charset=utf-8` + `Allow: GET, HEAD, OPTIONS` + route-accurate CORS) publish the exact same dual SEP-2127 / SEP-1649 Server Card derived from `mcp/metadata.mjs`.
- `/connect` (`src/connect.njk`) and `/connect.md` (`src/md-outputs/connect.md.njk`) provide reference-not-instructions MCP connection recipes (Claude Code, Claude apps, Cursor, Codex CLI, Gemini CLI / Antigravity) for `https://linxule.com/mcp` and scope notes for the four sibling public MCP servers.
- `/.well-known/ai-catalog.json` is the ARD v1.0 AI Resource Directory (`src/ai-catalog.json.njk`, served with `Content-Type: application/json; charset=utf-8` and `Access-Control-Allow-Origin: *`). It indexes `linxule.com`'s own MCP server (`urn:air:linxule.com:mcp:linxule`), Agent Skills index, and API Catalog alongside public, general-audience sibling MCP servers (`vellum.linxule.com`, `music-studio.linxule.com`, `lotus-wisdom.linxule.com`, and `research-memex.org`) while deliberately excluding course-scoped, staging, and asset hosts (`a4b.linxule.com`, `pmux.research-memex.org`, `open-interview-staging.linxule.com`, `media.linxule.com`).
- `/.well-known/agent-skills/index.json` is the Agent Skills Discovery v0.2.0 index.
- `/.well-known/agent-skills/xule-research-navigation/SKILL.md` is the only advertised skill artifact.
- `/llms.txt` explains the site for AI readers (including pointers to `linxule.com/mcp`, `/connect.md`, `music-studio.linxule.com/mcp`, `lotus-wisdom.linxule.com/mcp`, and `vellum.linxule.com`).
- `/site-index.json` provides a machine-readable index of all public pages (collection items + all 13 static twinned shapes), all 14 concepts (`anchored` and `forming`), formal publications, all 20 builds (including unlinked `SIGNA` and `daogov`), `build_head`, and human–AI `collaborators`.
- `/.well-known/api-catalog` is the RFC 9727 linkset anchoring both `https://linxule.com/` (`/llms.txt`, `/connect.md`, `/site-index.json`, `/.well-known/ai-catalog.json`, `/.well-known/agent-skills/index.json`, `/license.xml`, `/feed.xml`, `/index.md`, `/sitemap.xml`) and `https://linxule.com/mcp`.
- HTML `<head>` (`src/_includes/layouts/base.njk`) publishes `<link rel="ai-catalog" type="application/json" href="/.well-known/ai-catalog.json">` and `<link rel="llms-txt" href="/llms.txt" type="text/plain">`.
- `robots.txt` declares `Allow: /` and `Content-Signal: ai-train=yes, search=yes, ai-input=yes` across `*` and explicit named AI crawler groups, plus `Sitemap: https://linxule.com/sitemap.xml` and `Agentmap: https://linxule.com/.well-known/ai-catalog.json`.
- Scoped `Link` response headers (`vercel.json`) advertise `service-doc` (`/llms.txt`, `/connect.md`), `api-catalog`, `describedby`, `sitemap`, `llms-txt`, `agent-skills`, `ai-catalog`, and `service-desc` (`/.well-known/mcp/server-card.json`) on content routes while staying off static asset trees.
- Direct markdown variants and `Accept: text/markdown` negotiation expose readable page versions. Direct `.md` requests must pass through unchanged; middleware should only rewrite unsuffixed content URLs to their `.md` counterpart.

`sitemap.xml` lists canonical human-facing URLs, not `.md` alternates. Keep Markdown discovery in `/llms.txt`, `/site-index.json`, HTTP `Link` headers, HTML alternate links, and content negotiation so crawlers see one canonical URL per page while AI readers still get clean Markdown.

The Agent Skills index is generated from `src/_data/agentSkills.js`. The SHA-256 digest is computed from `agent-skills/xule-research-navigation/SKILL.md` at build time so the index cannot drift silently from the artifact, and `src/ai-catalog.json.njk` derives the skills entry's `capabilities` from `agentSkills.skills`.

### Hosted Public MCP Subdomains

- `https://vellum.linxule.com/mcp` — serves its own SEP-2127 `/.well-known/mcp/server-card.json` (referenced by `url` in `ai-catalog.json`).
- `https://music-studio.linxule.com/mcp` — serves its own SEP-2127 `/.well-known/mcp/server-card.json` and `/llms.txt` (referenced by `url` in `ai-catalog.json`).
- `https://lotus-wisdom.linxule.com/mcp` — custom domain attached to the `lotus-wisdom-mcp` Cloudflare Worker, serving its own SEP-2127 `/.well-known/mcp/server-card.json` and `/llms.txt` (referenced by `url` in `ai-catalog.json`).
- `https://research-memex.org/mcp` — sibling domain MCP server (`https://research-memex.org/mcp/server-card`, referenced by `url` in `ai-catalog.json`).

## Cloudflare Edge Posture (hardened 2026-11-22)

- `ssl: strict`, `min_tls_version: 1.2`, `speed_brain: off`, `hotlink_protection: off`, `rocket_loader: off`, `fonts: off`, `browser_check: off`.
- Edge response header rules add `X-Robots-Tag: noindex, nofollow` on `open-interview-staging.linxule.com` and `a4b.linxule.com`.
- Keep Cloudflare's edge "Markdown for Agents" (`content_converter`) **OFF** — origin `.md` twins and `middleware.ts` negotiation are authoritative and preserve curated structure and exact headers.

## DNS-AID

Cloudflare DNS has exactly one DNS-AID record:

```text
_index._agents.linxule.com. SVCB 1 linxule.com. alpn="h2,h3" port="443" mandatory="alpn,port"
```

Keep `_index._agents.linxule.com` as the single apex DNS-AID index pointer (matching `research-memex.org`); MCP discovery runs through `/.well-known/mcp/server-card.json`, `/.well-known/ai-catalog.json`, and `/.well-known/api-catalog`. Do not add `_a2a._agents.linxule.com` unless `linxule.com` hosts a real A2A service.

## DNSSEC

`linxule.com` is registered with Cloudflare Registrar and uses Cloudflare nameservers. Enable DNSSEC from the Cloudflare dashboard under DNS settings. For Cloudflare-registered domains, Cloudflare publishes the parent DS record automatically; do not add the DS as an ordinary DNS record.

The expected KSK DS value, for reference only, is:

```text
linxule.com. IN DS 2371 13 2 53C7180AD9C8299A8E6B8F093CD1B9586982378CD83100F66AF11A461E323DED
```

## Verification

For the full cross-domain post-release and monthly audit (origin surfaces, `isitagentready.com` via `bun run seo:agentready` in Research Memex, Cloudflare zone settings, IndexNow, and GSC), follow `~/Documents/GitHub/research-memex/handbook/procedures/release-and-surface-audit.md`.

Build and local artifact checks (`bun run build` runs `scripts/check-built-json.mjs`, which validates ARD v1.0 schema rules on `ai-catalog.json`, excluded hosts, SEP-2127 / SEP-1649 parity of `.well-known/mcp/server-card.json` with `mcp/metadata.mjs`, `robots.txt` `Agentmap:`, and `<link rel="ai-catalog">`, plus `mcp/worker.test.mjs`):

```bash
bun run build
test -f _site/.well-known/mcp/server-card.json
test -f _site/.well-known/ai-catalog.json
test -f _site/.well-known/agent-skills/index.json
test -f _site/.well-known/agent-skills/xule-research-navigation/SKILL.md
```

Live HTTP checks:

```bash
curl -i https://linxule.com/.well-known/mcp/server-card.json
curl -I https://linxule.com/mcp/server-card
curl -i https://linxule.com/mcp/server-card
curl -i https://linxule.com/connect.md
curl -i https://linxule.com/.well-known/ai-catalog.json
curl -i https://linxule.com/.well-known/agent-skills/index.json
curl -i https://linxule.com/.well-known/agent-skills/xule-research-navigation/SKILL.md
```

Live DNS checks:

```bash
dig @1.1.1.1 TYPE64 _index._agents.linxule.com +short
dig @1.1.1.1 +short DS linxule.com
dig @1.1.1.1 +adflag +dnssec TYPE64 _index._agents.linxule.com
```

Expected scanner state (`isitagentready.com`, L4 "Agent-Integrated"):

- Pass: `robotsTxt`, `sitemap`, `linkHeaders`, `dnsAid`, `robotsTxtAiRules`, `contentSignals`, `markdownNegotiation`, `apiCatalog`, `agentSkills`, `mcpServerCard`, `ard`, `webMcp`.
- Intentional N/A / neutral: `a2aAgentCard`, `oauthDiscovery`, `oauthProtectedResource`, `authMd`, `webBotAuth`, `personalAgentProtocol`, commerce checks (`x402`, `mpp`, `ucp`, `acp`, `ap2`).
