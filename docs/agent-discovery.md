# Agent Discovery

This site publishes honest agent-discovery metadata for a content-only apex research site (`linxule.com`) and a portfolio directory pointing at public, general-audience sibling MCP servers. Apex `linxule.com` does not expose an MCP server, A2A endpoint, OAuth server, or protected API — do **not** publish `/.well-known/mcp/server-card.json` or `_mcp._agents.linxule.com` at the apex.

## Public Surfaces

- `/.well-known/ai-catalog.json` is the ARD v1.0 AI Resource Directory (`src/ai-catalog.json.njk`, served with `Content-Type: application/json; charset=utf-8` and `Access-Control-Allow-Origin: *`). It indexes `linxule.com`'s Agent Skills index and API Catalog alongside public, general-audience MCP servers (`vellum.linxule.com`, `music-studio.linxule.com`, `lotus-wisdom.linxule.com`, and `research-memex.org`) while deliberately excluding course-scoped, staging, and asset hosts (`a4b.linxule.com`, `pmux.research-memex.org`, `open-interview-staging.linxule.com`, `media.linxule.com`).
- `/.well-known/agent-skills/index.json` is the Agent Skills Discovery v0.2.0 index.
- `/.well-known/agent-skills/xule-research-navigation/SKILL.md` is the only advertised skill artifact.
- `/llms.txt` explains the site for AI readers (including pointers to `music-studio.linxule.com/mcp`, `lotus-wisdom.linxule.com/mcp`, and `vellum.linxule.com`).
- `/site-index.json` provides a machine-readable content index.
- `/.well-known/api-catalog` is the RFC 9727 linkset for the public discovery surface.
- HTML `<head>` (`src/_includes/layouts/base.njk`) publishes `<link rel="ai-catalog" type="application/json" href="/.well-known/ai-catalog.json">` and `<link rel="llms-txt" href="/llms.txt" type="text/plain">`.
- `robots.txt` declares `Content-Signal: ai-train=yes, search=yes, ai-input=yes`, `Sitemap: https://linxule.com/sitemap.xml`, and `Agentmap: https://linxule.com/.well-known/ai-catalog.json`.
- Global `Link` response headers (`vercel.json`) advertise `service-doc`, `api-catalog`, `describedby`, `sitemap`, `llms-txt`, `agent-skills`, and `ai-catalog`.
- Direct markdown variants and `Accept: text/markdown` negotiation expose readable page versions. Direct `.md` requests must pass through unchanged; middleware should only rewrite unsuffixed content URLs to their `.md` counterpart.

`sitemap.xml` lists canonical human-facing URLs, not `.md` alternates. Keep Markdown discovery in `/llms.txt`, `/site-index.json`, HTTP `Link` headers, HTML alternate links, and content negotiation so crawlers see one canonical URL per page while AI readers still get clean Markdown.

The Agent Skills index is generated from `src/_data/agentSkills.js`. The SHA-256 digest is computed from `agent-skills/xule-research-navigation/SKILL.md` at build time so the index cannot drift silently from the artifact, and `src/ai-catalog.json.njk` derives the skills entry's `capabilities` from `agentSkills.skills`.

### Hosted Public MCP Subdomains

- `https://vellum.linxule.com/mcp` — serves its own `/.well-known/mcp/server-card.json` (referenced by `url` in `ai-catalog.json`).
- `https://music-studio.linxule.com/mcp` — represented via inline SEP-2127/SEP-1649 `data` server card in `ai-catalog.json`.
- `https://lotus-wisdom.linxule.com/mcp` — custom domain attached to the `lotus-wisdom-mcp` Cloudflare Worker (2026-11-21), represented via inline SEP-2127/SEP-1649 `data` server card in `ai-catalog.json`.
- `https://research-memex.org/mcp` — sibling domain MCP server (`https://research-memex.org/mcp/server-card`, referenced by `url` in `ai-catalog.json`).

## Cloudflare Edge Posture (hardened 2026-11-21)

- `ssl: strict`, `min_tls_version: 1.2`, `speed_brain: off`, `hotlink_protection: off`, `rocket_loader: off`.
- Edge response header rules add `X-Robots-Tag: noindex, nofollow` on `open-interview-staging.linxule.com` and `a4b.linxule.com`.
- Keep Cloudflare's edge "Markdown for Agents" (`content_converter`) **OFF** — origin `.md` twins and `middleware.ts` negotiation are authoritative and preserve curated structure and exact headers.

## DNS-AID

Cloudflare DNS has exactly one DNS-AID record:

```text
_index._agents.linxule.com. SVCB 1 linxule.com. alpn="h2,h3" port="443" mandatory="alpn,port"
```

Do not add `_a2a._agents.linxule.com` or `_mcp._agents.linxule.com` at the apex unless apex `linxule.com` itself exposes a real A2A or MCP service.

## DNSSEC

`linxule.com` is registered with Cloudflare Registrar and uses Cloudflare nameservers. Enable DNSSEC from the Cloudflare dashboard under DNS settings. For Cloudflare-registered domains, Cloudflare publishes the parent DS record automatically; do not add the DS as an ordinary DNS record.

The expected KSK DS value, for reference only, is:

```text
linxule.com. IN DS 2371 13 2 53C7180AD9C8299A8E6B8F093CD1B9586982378CD83100F66AF11A461E323DED
```

## Verification

For the full cross-domain post-release and monthly audit (origin surfaces, `isitagentready.com` via `bun run seo:agentready` in Research Memex, Cloudflare zone settings, IndexNow, and GSC), follow `~/Documents/GitHub/research-memex/handbook/procedures/release-and-surface-audit.md`.

Build and local artifact checks (`bun run build` runs `scripts/check-built-json.mjs`, which validates ARD v1.0 schema rules on `ai-catalog.json`, excluded hosts, absence of apex `mcp/server-card.json`, `robots.txt` `Agentmap:`, and `<link rel="ai-catalog">`):

```bash
bun run build
test -f _site/.well-known/ai-catalog.json
test -f _site/.well-known/agent-skills/index.json
test -f _site/.well-known/agent-skills/xule-research-navigation/SKILL.md
```

Live HTTP checks:

```bash
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

- Pass: `robotsTxt`, `sitemap`, `linkHeaders`, `dnsAid`, `robotsTxtAiRules`, `contentSignals`, `markdownNegotiation`, `apiCatalog`, `agentSkills`, `ard`, `webMcp`.
- Intentional N/A / absent at apex: `mcpServerCard` (no `/mcp` at apex `linxule.com`; subdomain MCPs are indexed in `ai-catalog.json`), `a2aAgentCard`, `oauthDiscovery`, `oauthProtectedResource`, `authMd`, `webBotAuth`, `personalAgentProtocol`.
