# Design Philosophy Reference

Detailed design principles for the site. Read this when creating new content, modifying layouts, or extending the design system.

## The Book Metaphor (Structural, Not Visual)

This isn't "looks like a book" — it's structural:
- Spreads, not pages
- Spine navigation along left edge
- Marginalia as collaborator space (footnotes → sidebar)
- You turn pages (scroll-snap), you don't scroll feeds
- "This surface is one rendering. The source remains."

The site is a window into the work, not a container of it.

## Color as Event, Not State

Elements don't start colored. They *become* violet through interaction. The bloom is earned, not decorative. Stillness is the default; interaction is the event.

## Variation at Moments, Not Throughout

From Tschichold: running text stays consistent. Breathing happens at structural moments — section breaks, pull quotes, page openings. If everything breathes, nothing breathes.

## The Stagger Pattern

Writing index uses a 7-entry wave: 0 → 2rem → 4rem → 5rem → 3rem → 1.5rem → 0.5rem. We chose 7 over 5 because 5 felt too mechanical. On mobile, stagger removed — scanning mode needs straight lines.

Two scales of stagger exist across the site:
- **Block-level** (observation blocks, writing index entries): larger offsets ~0-6.5rem, organic wave
- **Text-level** (fragments, prompt lines, thesis lines): smaller offsets ~0-2.25rem, spread-line pattern

The thinking page uses both: observation blocks wave at block-level (2→5→3→6.5→1.5), thesis-continued and observation fragments wave at text-level (spread-line pattern). "The loom" (final observation) pulls back to 1.5rem to ground the synthesis.

## Text Shaping (CRITICAL FOR NEW CONTENT)

Text is shaped, not just displayed. When adding new portraits, artifacts, or section introductions, apply these patterns:

**Prompt/Context Lines (CSS stagger pattern):**
```css
.spread-line:nth-child(1) { margin-left: 0; }
.spread-line:nth-child(2) { margin-left: 1.5rem; }
.spread-line:nth-child(3) { margin-left: 0.75rem; }
.spread-line:nth-child(4) { margin-left: 2.25rem; }
.spread-line:nth-child(5) { margin-left: 0.5rem; }
.spread-line:nth-child(6) { margin-left: 1.75rem; }
.spread-line:nth-child(7) { margin-left: 1rem; }
.spread-line:nth-child(8) { margin-left: 2rem; }
```

**Section Introduction Poems (CSS):**
```css
.poem-line:nth-child(1) { margin-left: 0; }
.poem-line:nth-child(2) { margin-left: 2rem; }
.poem-line:nth-child(3) { margin-left: 1rem; }
.poem-line:nth-child(4) { margin-left: 3rem; }  /* Often the accident line */
```

**Array Format for Prompts/Excerpts (YAML):**
```yaml
prompt:   # or contextExcerpt for artifacts
  - "First line of text"
  - "Second line"
  - "Third line"
  - text: "The accident line"
    accident: true
  - "Fifth line"
```

The template handles both simple strings and object syntax:
```njk
{%- for line in artifact.data.contextExcerpt -%}
<span class="spread-line{% if line.accident %} accident{% endif %}">
  {{ line.text | default(line) }}
</span>
{%- endfor -%}
```

**When adding new content**, always:
1. Break text into multiple lines (4-8 lines ideal)
2. Include ONE accident line (object syntax with `accident: true`)
3. The template applies the stagger pattern automatically via CSS nth-child

## One Accident Per Page

Not two. Not scattered. One deliberate wrongness, accepted. Cyan (`#4ee1d4`) — "the color that leaked through from somewhere else." The accident is still, not animated. It doesn't seek attention. If accidents were everywhere, they'd be decoration.

**How accidents are used:**
- Writing posts: `accident: true` in frontmatter highlights title in cyan
- Portrait prompts: Individual prompt lines can have `accident: true`
- Thinking fragments: Same object syntax `{text: "...", accident: true}`

## Typography as Dialogue

- **Cormorant Garamond**: the human voice (warm, traditional, book typography)
- **IBM Plex Mono**: the machine voice (precise, systematic, labels)

They coexist on every page — the human-AI collaboration in typographic form.

## The Three Modes (Portraits)

- **Browse**: `/making/` — scroll-snap spreads, flip through, one at a time
- **Dwell**: `/portraits/[slug]` — everything present, examine the set
- **Inspect**: Lightbox — one image, full attention

## Deterministic Layout Variety

Portrait detail pages use 6 layouts (drift, column, focus for landscape; stack, grid, filmstrip for portrait). Layout selected by hashing the slug — same page always gets same layout, different pages get different layouts. "Structured randomness" — variety without chaos.

## Specimens Earn Their Color

Images show grayscale at rest, full color on hover. Attention reveals; stillness conceals.

## Filtered Views = Smaller Books

Filtering changes WHAT you see, not HOW you browse. `/making/model/midjourney-v6/` is a thinner book, same reading experience. Filter pages are Eleventy-generated (not JS filtering) — clean URLs, shareable, bookmarkable. The URL IS the book you pulled off the shelf.

## Mobile Is a Different Reading Mode

- Marginalia hidden — supplementary, not essential
- Stagger removed — scanning mode needs straight lines
- Layouts simplify — the variation is a desktop reward

## AI as Named Collaborator

Portraits list `prompter: claude opus 4.5` — splits into family + model. AI systems appear in author arrays on LOOM posts. The site practices what the research preaches.

## The Recursive Quality

This site studies human-AI collaboration. It was built through human-AI collaboration (Xule + Claude, across multiple sessions, four major "blooms"). The design emerged from dialogue. This isn't trivia — it informs extension.

## Brand Decisions

- **Favicon**: Solid cyan square. "Full wrong." The accident IS the identity.
- **OG image**: ⚠️ STALE — currently shows old "to participants." tagline. Needs regeneration to match new framing: "impossible to see" or "not as tools." in cyan.

## Design Tokens

### Responsive Breakpoints
- **1100px**: Primary breakpoint (hide marginalia, simplify grids)
- **768px**: Secondary breakpoint (full mobile, compact padding)

### Typography Patterns
- **Detail page titles**: `clamp(1.8rem, 4vw, 2.8rem)` at `font-weight: 300`
- **Index page titles**: `1rem` at `font-weight: 400`
- **Label letter-spacing**: `0.2em` for series markers (talk-num, portrait-num, artifact-num), `0.15em` for other labels

### Colors
```css
--paper: #f4f1eb;         /* Background */
--paper-dark: #e8e4dc;    /* Cards, hover states */
--ink: #1a1a1a;           /* Primary text */
--ink-light: #6b6b6b;     /* Secondary text */
--ink-faint: #a0a0a0;     /* Labels, metadata */
--ink-ghost: #c8c8c8;     /* Borders, faint lines */
--bloom: #8b7089;         /* Interactive/hover color */
--bloom-glow: rgba(139, 112, 137, 0.15);
--accident: #4ee1d4;      /* The wrong color - cyan */
```
