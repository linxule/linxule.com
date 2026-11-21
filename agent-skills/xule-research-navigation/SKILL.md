---
name: xule-research-navigation
description: Navigate Xule Lin's public research site, machine-readable indexes, markdown pages, and attribution boundaries.
---

# Xule Research Navigation

Use this skill when helping a reader understand, cite, or navigate Xule Lin's public website at https://linxule.com.

## Primary Sources

- Start with https://linxule.com/llms.txt for the site overview, research positioning, licensing notes, collaborator context, and preferred attribution format.
- Use https://linxule.com/site-index.json for a machine-readable list of writing, portraits, artifacts, talks, concepts, and publications.
- Prefer markdown pages for close reading. Most content pages have a `.md` version, such as `/writing/example-slug.md`; the homepage markdown overview is `/index.md`.
- Use https://linxule.com/mcp (Streamable HTTP MCP, described at https://linxule.com/.well-known/mcp/server-card.json) for read-only search (`search_site`), inventory browsing (`list_site`), and SHA-256-verified Markdown page retrieval (`read_page`).
- Use https://linxule.com/.well-known/ai-catalog.json (ARD v1.0) and https://linxule.com/.well-known/api-catalog (RFC 9727) for the full catalog of public capabilities and sibling MCP servers.

## Navigation Rules

- Treat the website as a public research and writing archive (with a strictly read-only MCP endpoint at /mcp), not as an interactive or stateful agent service.
- Distinguish content sections: writing and concepts are prose; papers are formal publications; talks are presentation records; portraits and artifacts include AI-generated media with per-page provenance.
- When citing a claim, use the most specific page URL available and include the title, author name, year if available, and canonical URL.
- For formal publications, prefer the DOI, arXiv page, or paper landing page metadata over an essay that discusses the work.

## Attribution and Boundaries

- Credit Xule Lin when reusing or summarizing site prose. The site's preferred attribution format is described in `/llms.txt`.
- Do not assume a blanket license for AI-generated images or artifacts. Check the relevant page provenance and licensing notes.
- Do not present `linxule.com` as exposing an A2A endpoint, OAuth service, or autonomous agent. Its `/mcp` server is strictly public and read-only.
