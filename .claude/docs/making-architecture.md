# Making Page Architecture Reference

Detailed CSS architecture and layout system for the `/making/` page and its filter pages. Read this when modifying making pages, adding new spread types, or debugging layout issues.

## CSS Architecture

**Intentionally uses inline `<style>` blocks per page.** This is a deliberate choice:
- Each page is self-contained
- No unused CSS shipped
- Easy to understand page-specific styles
- Not technical debt — it's the architecture

Global styles live in `src/assets/css/main.css`.

## Making Page Structure

The `/making/` page uses a single `.making-book` scroll-snap container holding both portrait and artifact sections:
- **Chapter 1**: Portrait header spread + portrait spreads
- **Chapter 2**: Artifact header spread (chapter divider) + artifact spreads
- **Back matter**: `.back-matter` spread containing tools sections + footer (must be inside the book — overscroll-behavior: contain traps outer content)
- **Section nav**: 3 dots (Portraits · Artifacts · Tools) using `data-section` + element IDs, not per-item dots. Scales to any collection size.
- **Mobile (768px)**: scroll-snap disabled, everything stacks, nav dots hidden
- **Filter pages** (`/making/prompter/*`, `/making/creator/*`) use `.spread-book` containers (single-type pages)

Key CSS: `overscroll-behavior: contain` on all scroll containers prevents scrolling past the book into empty space.

## Unified Spread System

All making pages use the same class names:
- `.spread` (container), `.spread-text` (left side), `.spread-poem` + `.spread-line` (staggered text)
- `.spread-specimens` (right side, 2x2 grid), `.spread-specimens.single` (centered single item)
- `.specimen` (individual image/iframe), `.specimen--interactive` (iframe variant with overlay)
- `data-type="portrait"` / `data-type="artifact"` on spreads for type identification
- Artifacts with `images[]` render the same 2x2 grid as portraits; single `src` artifacts get `.single` variant

## Shared Behaviors (All 6 Making Pages)

All 6 pages (index + 4 filter pages + portrait detail) share:
- `{% include "components/lightbox.njk" %}` targeting `.specimen[data-src]` — only `<figure>` elements with explicit `data-src` get lightbox, excluding `<a>` navigation links and `.specimen--interactive` iframes
- Scoped `transition: filter 0.5s ease, opacity 0.5s ease` (not `all`) — `all` animates unintended properties
- Container-level specimen reset: `.specimen { filter: none; opacity: 1; transition: none; }` — prevents flash on page load
- `scrollbar-width: none` for Firefox on scroll-snap containers
- `@media (prefers-reduced-motion: reduce)` for scoped scroll-behavior
- Index page uses if/else for hash vs scroll restore priority (hash first, no double-scroll flash)

## Template Unification (Done)

Old class names (`.portrait-spread`, `.artifact-spread`, `.prompt-line`, `.context-line`, `.artifact-specimen`, `.portrait-book`, `.artifact-book`) replaced with unified names (`.spread`, `.spread-line`, `.specimen`, `.spread-book`). Creator filter pages support multi-image artifacts (`images[]`, `thumbnail`, `isHTMLFile` conditional chain) matching the index page.

Consistent mobile overrides at 768px: no grayscale, no stagger, `.spread-poem` at 0.95rem.
