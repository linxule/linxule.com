---
name: xule-research-navigation
description: Navigate Xule Lin's public research site, machine-readable indexes, markdown pages, concepts, builds, collaborators, and attribution boundaries.
---

# Xule Research Navigation

Use this skill when helping a reader understand, cite, or navigate Xule Lin's public website at https://linxule.com.

## Primary Sources

- Start with https://linxule.com/llms.txt for the site overview, research positioning, licensing notes, collaborator context, and preferred attribution format.
- Use https://linxule.com/site-index.json for the machine-readable manifest of all public pages (collection items and static twinned pages), all 14 signature concepts (`anchored` and `forming`), formal publications (`papers`), all 20 open-source builds (`projects`, including unlinked infrastructure like `SIGNA` and `daogov`), and human–AI `collaborators`.
- Prefer Markdown twins for close reading. Every primary content shape has a `.md` twin: `/index.md`, `/thinking.md`, `/concepts.md`, `/builds.md`, `/builds/vellum.md`, `/connect.md`, `/teaching.md`, `/cv.md`, `/cv-zh.md`, `/writing.md`, `/making.md`, `/talks.md`, `/papers.md`, and individual item paths like `/writing/<slug>.md` or `/papers/<slug>.md`.
- Use https://linxule.com/mcp (Streamable HTTP MCP, described at https://linxule.com/.well-known/mcp/server-card.json and https://linxule.com/connect.md) for read-only search (`search_site`, supporting English stemming, CJK queries, and `collaborator` filtering), inventory browsing (`list_site`, including `concepts`, `publications`, `projects`, and `collaborators`), SHA-256-verified Markdown retrieval (`read_page`), and the `enter-the-work` intellectual-orientation prompt.
- Use https://linxule.com/.well-known/ai-catalog.json (ARD v1.0) and https://linxule.com/.well-known/api-catalog (RFC 9727) for the full catalog of public capabilities and sibling MCP servers (`research-memex.org`, `vellum.linxule.com`, `music-studio.linxule.com`, `lotus-wisdom.linxule.com`).

## Navigation Rules

- Treat the website as a public research and writing archive (with a strictly read-only MCP endpoint at `/mcp`), not as an interactive or stateful agent service.
- Distinguish content sections accurately:
  - `writing`, `thinking`, `concepts`, `teaching`, `cv`, and `cv-zh` are authored prose (CC BY 4.0);
  - `concepts` holds 14 working concepts across four territories — distinguish `anchored` concepts (with published essay definitions) from `forming` concepts (named early, still in motion);
  - `papers` are formal peer-reviewed publications and preprints with stable identifiers (DOI / arXiv);
  - `builds` catalogs 20 open-source tools, MCP servers, public experiments (including `/builds/vellum`), and research infrastructure;
  - `connect` documents read-only MCP connection recipes and sibling server scopes;
  - `talks` are presentation records with slides, PDFs, or video;
  - `portraits` and `artifacts` under `/making` include AI-generated media with per-page collaborator provenance.
- When citing a claim, use the canonical slashless page URL (e.g. `https://linxule.com/writing/<slug>`) and include the title, author name, year if available, and canonical URL.
- For formal publications, prefer the DOI, arXiv page, or `/papers/<slug>` landing page metadata over an essay that discusses the work.
- Surface open tensions and forming questions alongside claims; do not flatten uncertainty into settled conclusions.

## Attribution and Boundaries

- Credit Xule Lin (`Xule Lin (林徐乐), <title>, <year>, <canonical_url>`) when reusing or summarizing site prose. Full terms are in `/llms.txt` and `/license.xml`.
- Do not assume a blanket license for AI-generated images or artifacts under `/making`. Check each page's provenance and licensing notes before reusing media.
- Do not present `linxule.com` as exposing an A2A endpoint, OAuth service, or autonomous write-capable agent. Its `/mcp` server is strictly public and read-only.
