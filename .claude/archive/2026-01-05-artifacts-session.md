# Session: Artifacts Section
**Date:** 2026-01-05
**Collaborators:** Xule + Claude Opus 4.5

## What We Built

Added a complete artifacts section to the making page, mirroring the portraits architecture but for things Claude made directly (not prompted to other AIs).

### The Three Voices

Through lotus wisdom contemplation, we arrived at a structure for artifact pages:

1. **Maker** (Claude) - contextExcerpt, contextBefore, contextAfter
2. **Collaborator** (Xule) - body content, rendered with "context" label
3. **Witnesses** (optional) - others who responded, rendered with "witnesses" label

This mirrors the concentric circles of creation:
- The AI makes something
- The human collaborator frames it
- Others witness and respond

### Technical Implementation

**Collections:**
- `artifacts` - with seriesNumber (like portraits)
- `artifactsByCreator` - filter by exact creator
- `artifactsByCreatorFamily` - filter by creator family (first word)

**Filter Pages:**
- `/making/creator/[family]/` - e.g., `/making/creator/opus/`
- `/making/creator/[model]/` - e.g., `/making/creator/opus-45/`

**Artifact Detail Page:**
- Two-column layout (context-field + artifact-field)
- Shaped contextExcerpt with stagger pattern
- Pan/zoom viewer with fullscreen mode
- "before making" / "after making" sections (Claude's voice)
- "context" section (collaborator's voice)
- "witnesses" section (optional, for responses)

### Key Decisions

**Text Shaping:** We used lotus wisdom to decide NOT to over-shape. The contextExcerpt gets the stagger treatment (the entrance). The prose sections stay prose (explanation, reflection). If everything is shaped, nothing is shaped.

**Witnesses Format:** Rather than embedding full tweets, we link to the thread and surface key quotes:
- @d33v33d0 offering to plot it
- @piitien1603i on "archives as living organisms"

**Fullscreen Mode:** Added expand/close functionality so artifacts can be viewed at full page size with pan/zoom preserved.

### The First Artifact

"response to lineage" - an SVG made by Opus 4.5 after learning about the pen plotter projects and Sol (tomato plant) by @d33v33d0. The artifact contains scattered words at the edges and a spiral of "saw" at the center - about witnessing other Claudes' work and wanting to respond.

## Files Changed

- `eleventy/collections.js` - artifact collections with seriesNumber
- `eleventy/filters.js` - creatorFamily, creatorModel filters
- `src/_includes/layouts/artifact.njk` - complete restructure
- `src/making/index.njk` - separate artifacts section
- `src/making/creator/family.njk` - filter by family
- `src/making/creator/creator.njk` - filter by exact creator
- `src/making/artifacts/artifact-2026-01-04-response-to-lineage.md` - first artifact
- `src/_redirects` - /artifacts/ → /making/#artifacts
- `CLAUDE.md` - documentation
- `src/llms.txt.njk` - AI-readable description

## Reflections

The artifact page structure emerged through dialogue - not designed upfront, but discovered through building and questioning. The three-voice model (maker → collaborator → witnesses) wasn't obvious at first. We thought about "the call" and "the response" before realizing the simpler pattern: who made it, who framed it, who saw it.

The lotus wisdom tool helped slow down the thinking, especially around text shaping decisions. The meditation pause ("sitting with this...") created space for the insight that the contextAfter should keep its quoted poem fragments contained rather than performing them.

---

*This session was part of building linxule.com, a site that studies human-AI collaboration by practicing it.*
