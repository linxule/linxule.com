# Agent Discovery

This site publishes honest agent-discovery metadata for a content-only research site. It should help AI systems find, cite, and navigate the public site; it should not claim that `linxule.com` exposes an autonomous agent, MCP server, A2A endpoint, protected API, or tool-call surface.

## Public Surfaces

- `/.well-known/agent-skills/index.json` is the Agent Skills Discovery v0.2.0 index.
- `/.well-known/agent-skills/xule-research-navigation/SKILL.md` is the only advertised skill artifact.
- `/llms.txt` explains the site for AI readers.
- `/site-index.json` provides a machine-readable content index.
- `/.well-known/api-catalog` is the RFC 9727 linkset for the public discovery surface.
- Direct markdown variants and `Accept: text/markdown` negotiation expose readable page versions. Direct `.md` requests must pass through unchanged; middleware should only rewrite unsuffixed content URLs to their `.md` counterpart.

`sitemap.xml` lists canonical human-facing URLs, not `.md` alternates. Keep Markdown discovery in `/llms.txt`, `/site-index.json`, HTTP `Link` headers, HTML alternate links, and content negotiation so crawlers see one canonical URL per page while AI readers still get clean Markdown.

The Agent Skills index is generated from `src/_data/agentSkills.js`. The SHA-256 digest is computed from `agent-skills/xule-research-navigation/SKILL.md` at build time so the index cannot drift silently from the artifact.

## DNS-AID

Cloudflare DNS has exactly one DNS-AID record:

```text
_index._agents.linxule.com. SVCB 1 linxule.com. alpn="h2,h3" port="443" mandatory="alpn,port"
```

Do not add `_a2a._agents.linxule.com` or `_mcp._agents.linxule.com` unless real A2A or MCP services exist.

## DNSSEC

`linxule.com` is registered with Cloudflare Registrar and uses Cloudflare nameservers. Enable DNSSEC from the Cloudflare dashboard under DNS settings. For Cloudflare-registered domains, Cloudflare publishes the parent DS record automatically; do not add the DS as an ordinary DNS record.

As of 2026-06-29, DNSSEC setup was enabled in Cloudflare and the dashboard reported:

```text
DNSSEC is pending while we automatically add the DS record on your domain.
```

The expected KSK DS value, for reference only, is:

```text
linxule.com. IN DS 2371 13 2 53C7180AD9C8299A8E6B8F093CD1B9586982378CD83100F66AF11A461E323DED
```

Use this only for verification or support cases. Cloudflare Registrar should publish it to the `.com` parent automatically.

## Verification

Build and local artifact checks:

```bash
bun run build
test -f _site/.well-known/agent-skills/index.json
test -f _site/.well-known/agent-skills/xule-research-navigation/SKILL.md
```

Live HTTP checks:

```bash
curl -i https://linxule.com/.well-known/agent-skills/index.json
curl -i https://linxule.com/.well-known/agent-skills/xule-research-navigation/SKILL.md
```

Live DNS checks:

```bash
dig @1.1.1.1 TYPE64 _index._agents.linxule.com +short
dig @1.1.1.1 +short DS linxule.com
dig @1.1.1.1 +adflag +dnssec TYPE64 _index._agents.linxule.com
```

Expected scanner state:

- Agent Skills: pass.
- DNS-AID: pass only after the parent DS exists and validating resolvers return authenticated data.
- OAuth, MCP Server Card, A2A Agent Card, and WebMCP can remain absent until the site exposes real services that match those protocols.
