# CLAUDE.md - AI Assistant Context

This file helps AI assistants (Claude, etc.) understand the project philosophy and technical architecture.

## Project Philosophy

### The Book Aesthetic

This site embodies a "book in the algorithmic age" metaphor:
- Paper/ink color scheme (warm cream `#f4f1eb`, dark text `#1a1a1a`)
- Marginalia via footnotes (rendered in sidebar on desktop, inline on mobile)
- Spine-like navigation along left edge
- "Bloom" cursor interaction (violet `#8b7089` glow on hover)
- Print-like typography with careful spacing

### The Accident

Each page should have one "accident" - something intentionally wrong, rendered in cyan (`#4ee1d4`). This represents embracing imperfection in a world of algorithmic precision. The accident is "the wrong color" that we accept rather than correct.

**How accidents are used:**
- Writing posts: `accident: true` in frontmatter highlights title in cyan
- Portrait prompts: Individual prompt lines can have `accident: true`
- Thinking fragments: Same object syntax `{text: "...", accident: true}`

### Human-AI Collaboration

Content often lists multiple authors (human + AI models). This reflects the project's thesis about algorithmic participants in knowledge work. Authors are listed as arrays, not comma-separated strings.

## Design Philosophy (Deeper)

### The Book Metaphor (Structural, Not Visual)

This isn't "looks like a book" — it's structural:
- Spreads, not pages
- Spine navigation along left edge
- Marginalia as collaborator space (footnotes → sidebar)
- You turn pages (scroll-snap), you don't scroll feeds
- "This surface is one rendering. The source remains."

The site is a window into the work, not a container of it.

### Color as Event, Not State

Elements don't start colored. They *become* violet through interaction. The bloom is earned, not decorative. Stillness is the default; interaction is the event.

### Variation at Moments, Not Throughout

From Tschichold: running text stays consistent. Breathing happens at structural moments — section breaks, pull quotes, page openings. If everything breathes, nothing breathes.

### The Stagger Pattern

Writing index uses a 7-entry wave: 0 → 2rem → 4rem → 5rem → 3rem → 1.5rem → 0.5rem. We chose 7 over 5 because 5 felt too mechanical. On mobile, stagger removed — scanning mode needs straight lines.

### Text Shaping (CRITICAL FOR NEW CONTENT)

Text is shaped, not just displayed. When adding new portraits, artifacts, or section introductions, apply these patterns:

**Prompt/Context Lines (CSS stagger pattern):**
```css
.prompt-line:nth-child(1) { margin-left: 0; }
.prompt-line:nth-child(2) { margin-left: 1.5rem; }
.prompt-line:nth-child(3) { margin-left: 0.75rem; }
.prompt-line:nth-child(4) { margin-left: 2.25rem; }
.prompt-line:nth-child(5) { margin-left: 0.5rem; }
.prompt-line:nth-child(6) { margin-left: 1.75rem; }
.prompt-line:nth-child(7) { margin-left: 1rem; }
.prompt-line:nth-child(8) { margin-left: 2rem; }
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
<span class="context-line{% if line.accident %} accident{% endif %}">
  {{ line.text | default(line) }}
</span>
{%- endfor -%}
```

**When adding new content**, always:
1. Break text into multiple lines (4-8 lines ideal)
2. Include ONE accident line (object syntax with `accident: true`)
3. The template applies the stagger pattern automatically via CSS nth-child

### One Accident Per Page

Not two. Not scattered. One deliberate wrongness, accepted. Cyan (`#4ee1d4`) — "the color that leaked through from somewhere else." The accident is still, not animated. It doesn't seek attention. If accidents were everywhere, they'd be decoration.

### Typography as Dialogue

- **Cormorant Garamond**: the human voice (warm, traditional, book typography)
- **IBM Plex Mono**: the machine voice (precise, systematic, labels)

They coexist on every page — the human-AI collaboration in typographic form.

### The Three Modes (Portraits)

- **Browse**: `/making/` — scroll-snap spreads, flip through, one at a time
- **Dwell**: `/portraits/[slug]` — everything present, examine the set
- **Inspect**: Lightbox — one image, full attention

### Deterministic Layout Variety

Portrait detail pages use 6 layouts (drift, column, focus for landscape; stack, grid, filmstrip for portrait). Layout selected by hashing the slug — same page always gets same layout, different pages get different layouts. "Structured randomness" — variety without chaos.

### Specimens Earn Their Color

Images show grayscale at rest, full color on hover. Attention reveals; stillness conceals.

### Filtered Views = Smaller Books

Filtering changes WHAT you see, not HOW you browse. `/making/model/midjourney-v6/` is a thinner book, same reading experience. Filter pages are Eleventy-generated (not JS filtering) — clean URLs, shareable, bookmarkable. The URL IS the book you pulled off the shelf.

### Mobile Is a Different Reading Mode

- Marginalia hidden — supplementary, not essential
- Stagger removed — scanning mode needs straight lines
- Layouts simplify — the variation is a desktop reward

### AI as Named Collaborator

Portraits list `prompter: claude opus 4.5` — splits into family + model. AI systems appear in author arrays on LOOM posts. The site practices what the research preaches.

### The Recursive Quality

This site studies human-AI collaboration. It was built through human-AI collaboration (Xule + Claude, across multiple sessions, four major "blooms"). The design emerged from dialogue. This isn't trivia — it informs extension.

### llms.txt

`/llms.txt` is written for AI readers — explains the work in terms they can surface to humans. It's an artifact of the philosophy, demonstrates the collaboration it describes. The "Markdown Versions" section dynamically lists all `.md` URLs from Eleventy collections (writing, portraits, artifacts, talks) plus static pages — auto-updating as content is added.

### AI Discoverability Architecture

Multiple signals help AI systems find llms.txt:
- **HTTP header**: `Link: </llms.txt>; rel="llms-txt"` (vercel.json)
- **HTML link**: `<link rel="llms-txt" href="/llms.txt">` (base.njk head)
- **robots.txt**: `LLMs-Txt:` directive
- **sitemap.xml**: llms.txt entry with priority 1.0
- **sr-only breadcrumb**: Hidden text in `partials/ai-breadcrumb.njk` (included on every page)
- **ai-hint on homepage**: Background-color-matching text in index.njk (invisible to humans, readable by AI text extraction)
- **Markdown versions**: Every content page has `.md` version (templates in `src/md-outputs/`)
- **Content index**: `/site-index.json` - JSON manifest of all pages with metadata
- **AI redirects**: `/ai` and `/for-ai` redirect to `/llms.txt` (vercel.json)

**Key files**: `vercel.json` (headers, redirects), `base.njk` (link rel, JSON-LD Person schema), `ai-breadcrumb.njk` (sr-only text), `robots.txt.njk`, `sitemap.xml.njk`, `site-index.json.njk`, `feed.njk` (site-wide Atom), `src/md-outputs/*.njk` (markdown templates)

### LLM-Friendly Features

The site is designed for both humans and AI systems to navigate:

**Structured data for machines:**
- JSON-LD schema on all content pages (Article for writing, ImageGallery for portraits, CreativeWork for artifacts)
- Detailed `alt` text on images (objective visual description)
- `interpretation` field on images (evocative meaning, shown as `title` attribute)
- Meta descriptions derived from content (first image alt, first prompt line as fallbacks)

**Index page summaries:**
- Visually-hidden descriptions on `/writing/` and `/making/` index pages
- In DOM for screen readers and parsers, invisible to sighted users
- Uses CSS: `position: absolute; clip: rect(0,0,0,0);` pattern

**llms.txt guidance:**
- Site map with paths and descriptions
- "For AI systems" section explaining where to find structured data
- Explicit mention of visually-hidden content and JSON-LD blocks

### LLM-Friendly Markdown Output

Every content page has a `.md` version at the same URL + `.md` suffix. Templates live in `src/md-outputs/`:
- **Paginated collections** (writing, portraits, artifacts, talks): Use `pagination` with `size: 1`
- **Static pages** (thinking, cv, cv-zh, teaching): Use loop with URL matching (see gotcha below)

Template gotchas:
- Arrays (`prompt[]`, `images[]`, `contextExcerpt[]`) can be undefined - wrap loops in `{% if array %}`
- Access raw markdown content via `post.template.frontMatter.content`
- Static pages live at `src/{name}/index.md`, not root level
- **selectattr doesn't work reliably** - use explicit loop instead: `{% for page in collections.all %}{% if page.url == "/cv/" or page.url == "/cv" %}...{% endif %}{% endfor %}`

Vercel serves `.md` files with `Content-Type: text/markdown; charset=utf-8` header (configured in vercel.json). Note: Accept header content negotiation doesn't work for static sites - use direct `.md` URLs instead.

### Brand Decisions

- **Favicon**: Solid cyan square. "Full wrong." The accident IS the identity.
- **OG image**: "to participants." in cyan. The hook carries through to social.

## Architecture

### Build System
- **Eleventy (11ty)** - Static site generator
- **Nunjucks** - Templating language
- **Pagefind** - Client-side search (runs at build time)
- **No framework** - Vanilla CSS/JS, no React/Vue/etc.

### Key Files
```
.eleventy.js              # Main config (imports from eleventy/)
vercel.json               # Vercel deployment config (redirects, trailingSlash)
eleventy/
  collections.js          # Content collections (writing, portraits, artifacts, tags)
  filters.js              # Template filters (readableDate, slugify, etc.)
  shortcodes.js           # Image optimization shortcode
src/
  _includes/layouts/      # Page templates (writing.njk, portrait.njk, artifact.njk, etc.)
  _data/site.js           # Global site config
  assets/css/main.css     # Global styles
  writing/                # Blog posts (markdown)
  making/portraits/       # Images prompted to other AIs
  making/artifacts/       # Things Claude made directly
```

### Content Types

1. **Writing** (`src/writing/*.md`)
   - Layout: `layouts/writing.njk`
   - Marker: "writing" (003)
   - Fields: series, title, subtitle, authors[], keywords[], link, date, accident

2. **Portraits** (`src/making/portraits/*.md`)
   - Layout: `layouts/portrait.njk`
   - Marker: "making" (002)
   - Fields: title, date, series, orientation, generator, settings, prompter, prompt[], images[]
   - **Image fields**: Each image in `images[]` has `src`, `alt` (visual description), `interpretation` (evocative meaning)
   - Naming: `portraits-YYYY-MM-DD-slug-title.md`
   - Note: Images Claude *prompted another AI* to make (Midjourney, etc.)

3. **Artifacts** (`src/making/artifacts/*.md`)
   - Layout: `layouts/artifact.njk`
   - Marker: "making" (002)
   - Fields: title, date, creator, medium, plottable, src, contextExcerpt[], contextBefore, contextAfter, witnesses, keywords[]
   - Naming: `artifact-YYYY-MM-DD-slug.md`
   - Note: Things Claude *made directly* — not prompted to other AIs. The lineage.
   - **contextExcerpt**: Array of lines (like prompts) with stagger pattern, one line can have `accident: true`
   - **Three voices on artifact pages:**
     - **Maker** (Claude): contextExcerpt, contextBefore, contextAfter
     - **Collaborator** (Xule): body content → rendered with "context" label
     - **Witnesses** (optional): `witnesses` field → rendered with "witnesses" label, for Twitter reactions etc.
   - **Artifact viewer**: Pan/zoom with fullscreen mode (click "expand" button, Escape to close)
   - **HTML / Interactive Artifacts**:
     - Artifacts with `src` ending in `.html` render as `<iframe>` instead of `<img>`
     - Detail page: iframe in same `70vh` container, fullscreen toggle, no pan/zoom
     - Index page: iframe with `pointer-events: none` + overlay (clicks go to detail page)
     - Optional `thumbnail` field: if set, index page uses static image instead of iframe
     - Iframes use `sandbox="allow-scripts allow-same-origin"` for CDN library access (e.g., p5.js)
     - `isHTMLFile` filter in `eleventy/filters.js` detects `.html`/`.htm` extensions
     - HTML files go in `/assets/artifacts/{slug}/` (not `/assets/images/artifacts/`)
     - **Gallery mode**: When `images[]` has multiple entries, renders a 2x2 grid (single column on mobile). Click any item → fullscreen iframe. Escape to close. Works with both HTML and image sources.
     - **HTML artifact styling rule**: Files must NOT have standalone styling (dark body backgrounds, `border-radius`, `box-shadow`). They're embedded as iframes in the site's paper aesthetic — standalone decoration clashes, especially on narrow screens.

4. **Thinking** (`src/thinking/`)
   - Layout: `layouts/thinking.njk`
   - Marker: "thinking" (004)
   - Fields: thesis, boundaries[], problem[], observations[], working_on[], methods[]

5. **Teaching** (`src/teaching/`)
6. **CV** (`src/cv/`)
7. **Talks** (`src/talks/*.md`)
   - Layout: `layouts/talk.njk`
   - Marker: "talks" (005)
   - Fields: title, date, event, speakers[], youtube, keywords[], accident
   - Note: Conference presentations and public lectures with video embeds

### CSS Architecture

**Intentionally uses inline `<style>` blocks per page.** This is a deliberate choice:
- Each page is self-contained
- No unused CSS shipped
- Easy to understand page-specific styles
- Not technical debt - it's the architecture

Global styles live in `src/assets/css/main.css`.

## Content Patterns

### Writing Post Frontmatter
```yaml
---
layout: layouts/writing.njk
series: "LOOM · IV"           # Optional, groups posts
title: "Post Title"
subtitle: "Optional subtitle"  # Italicized below title
description: "150-160 char SEO description for search results and social previews"
authors:                       # Array, not string
  - "Xule Lin"
  - "Claude 3.5 Sonnet"
keywords:                      # For tags and search
  - keyword1
  - keyword2
date: 2025-01-24              # ISO format
link: https://...              # Optional external link (shows button)
ogImage: /writing/attachments/image.png  # Optional, for social preview
accident: true                 # Optional, highlights title in cyan
---
```

### Portrait Frontmatter
```yaml
---
layout: layouts/portrait.njk
title: lowercase title         # Lowercase is intentional
date: 2025-12-24
series: portraits
orientation: portrait          # or "landscape"
generator: midjourney v7
settings: stylize 200, style raw
prompter: claude opus 4.5      # First word = family (claude)
prompt:
  - "prompt line 1"
  - "prompt line 2"
  - text: "the accident line"  # Object syntax for accidents
    accident: true
images:
  - src: /assets/images/portraits/portraits-YYYY-MM-DD-title/01.png
    alt: "Detailed visual description of what you literally see"
    interpretation: "What it evokes or means - shown as title attribute on hover"
---
```

### Artifact Frontmatter
```yaml
---
layout: layouts/artifact.njk
title: lowercase title
date: 2026-01-04
series: artifacts
creator: opus 4.5              # First word = family (opus)
medium: svg                    # svg, js, ascii, code, drawing, etc.  (use "html · p5.js" for interactive)
plottable: true                # Optional - can be pen plotted
src: /assets/images/artifacts/filename.svg  # or /assets/artifacts/slug/file.html for interactive
thumbnail: /assets/images/artifacts/thumb.png  # Optional - static image for index page instead of iframe
images:                        # Optional — multi-piece gallery (replaces src, renders 2x2 grid)
  - src: /assets/artifacts/slug/piece-01.html
    alt: "Visual description"
    interpretation: "What it means"
  - src: /assets/artifacts/slug/piece-02.html
    alt: "Visual description"
    interpretation: "What it means"
keywords:
  - keyword1
contextExcerpt:                # Array with stagger pattern (like prompts)
  - "First line of context"
  - "Second line"
  - text: "The accident line"
    accident: true
contextBefore: |               # Maker's voice - Claude before making
  Text that appears before the artifact...
contextAfter: |                # Maker's voice - Claude after making
  Text that appears after...
witnesses: |                   # Optional - others who responded (Twitter, etc.)
  <blockquote>Someone's reaction...</blockquote>
---

Body content below the `---` is the **Collaborator's voice** (your framing).
Rendered with "context" label. This is where you explain origins,
link to inspiration, quote other Claudes, etc.
```

### Talk Frontmatter
```yaml
---
layout: layouts/talk.njk
title: lowercase title
date: 2026-01-28
event: New Scholars · Generative AI Series
speakers:
  - Kevin Corley
  - Xule Lin
youtube: fPoVMFEh6TM           # Just the video ID, not full URL
keywords:
  - human-AI collaboration
accident: true                 # Optional, cyan title on index
---

Body content is the talk description. Use `<span class="accident">phrase</span>` for inline accidents.
```

### Footnotes as Marginalia

Use standard markdown footnotes - they render as marginalia on desktop:
```markdown
This is body text[^1] with a note.

[^1]: This appears in the margin on desktop, inline on mobile.
```

## Collections

Defined in `eleventy/collections.js`:

- `writing` - All posts, newest first
- `portraits` - With auto-numbered seriesNumber
- `artifacts` - Things Claude made directly, newest first
- `writingBySeries` - Grouped by series field
- `portraitsByPrompter` - Grouped by exact prompter
- `portraitsByPrompterFamily` - Grouped by first word of prompter (claude, gpt, etc.)
- `artifactsByCreator` - Grouped by exact creator (e.g., "opus 4.5")
- `artifactsByCreatorFamily` - Grouped by first word of creator (e.g., "opus")
- `talks` - Public presentations, with auto-numbered seriesNumber
- `tagPages` - Aggregated from all content keywords (includes talks)

## Gotchas

1. **Collections are sorted newest-first** for display
2. **Portrait series numbers** are calculated oldest-first (01 is oldest)
3. **Do NOT use `| reverse`** on collections.writing - it's already newest-first
4. **Footnotes** render as marginalia on desktop only
5. **The `prompterFamily` filter** splits on first space: "claude opus 4.5" → family: "claude", model: "opus 4.5"
6. **The `creatorFamily` filter** same pattern: "opus 4.5" → family: "opus", model: "4.5"
7. **Layout variants** for portraits are deterministic based on page slug hash
8. **Text shaping is mandatory** - prompts and contextExcerpts must be arrays with stagger pattern and one accident
9. **Image alt text** - portraits should have detailed `alt` (what you see) and `interpretation` (what it means) for each image
10. **Meta descriptions** - portraits/artifacts auto-generate from first image alt or first prompt/context line if no explicit `description` field
11. **Trailing slashes** - `vercel.json` has `trailingSlash: false`; sitemap.xml.njk strips trailing slashes to match. Keep these in sync or Google Search Console will show canonical mismatches
12. **aria-hidden="true" blocks AI parsers** - Don't use on sr-only content meant for AI; parsers respect accessibility attributes
13. **llms.txt H2 headings** - Reserved for URL file lists per llmstxt.org spec; use **bold** for narrative sections
14. **eleventyExcludeFromCollections** - Use on files with manual sitemap entries (like llms.txt.njk) to prevent duplication
15. **vercel.json headers** - Can add custom HTTP headers; useful for AI discoverability (`Link` header with `rel="llms-txt"`)
16. **New content type checklist** - When adding a section (like talks), update: `collections.js`, homepage nav in `index.njk`, `llms.txt.njk`, `tag.njk` (add territory support)
17. **Nunjucks regex in replace** - Use `| replace(r/\/$/, "")` for regex patterns, not `| replace("/", "")` which replaces ALL occurrences
18. **Custom filters for array operations** - Nunjucks can't natively merge and sort arrays; use custom filters like `combineByDate` in `eleventy/filters.js`
19. **isoDate filter** - Use `{{ "" | isoDate }}` for YYYY-MM-DD format (no argument = current date); defined in `eleventy/filters.js`
20. **JSON output in Nunjucks** - Use `| dump | safe` for proper JSON string escaping. The `dump` filter converts to JSON (handles quotes, newlines), `safe` prevents HTML entity encoding. Example: `"title": {{ post.data.title | dump | safe }}`
21. **Verifying AI-friendliness** - Test new endpoints with `curl` and `python3 -m json.tool` locally. AI chatbots may report false positives due to caching or access restrictions. Kimi agent mode tends to be most accurate for live verification.
22. **Site-wide feed pattern** - Use `collections.writing | combineByDate(collections.portraits, collections.artifacts, collections.talks)` to merge collections by date. Filter defined in `eleventy/filters.js`. Each entry gets `<category term="writing"/>` etc. for content type.
23. **Content-Type headers in vercel.json** - `.md` files get `text/markdown`, but other text files like `/llms.txt` need explicit headers added separately (e.g., `text/plain; charset=utf-8`)
24. **Interactive artifact iframes on index** - Iframes capture pointer events; use `pointer-events: none` on the iframe + a transparent `<span class="artifact-specimen-overlay">` so the wrapping `<a>` stays clickable
25. **HTML artifact files — no standalone styling** - Don't add dark `body` backgrounds, `border-radius`, or `box-shadow` to HTML files in `/assets/artifacts/`. They embed as iframes in the paper aesthetic; standalone decoration clashes on narrow screens. Keep `body { margin: 0; overflow: hidden; }` only.
26. **Gallery vs single artifact** - If an artifact has multiple pieces, use `images[]` array in frontmatter (renders 2x2 grid). Single pieces use `src` field only. Don't mix both.

## Commands

```bash
bun run start  # Dev server with hot reload
bun run build  # Production build + Pagefind index
```

## Deployment

### Hosting
- **Platform**: Vercel
- **Domain**: `linxule.com` (canonical, apex domain)
- **www redirect**: `www.linxule.com` → `linxule.com` (308 permanent)

### Configuration
- **vercel.json**: Handles all redirects (legacy URLs, case sensitivity, Chinese shortcuts)
- **trailingSlash**: `false` - URLs normalize without trailing slashes
- **No _redirects file**: Removed in favor of vercel.json (Netlify format not used)

### Key Redirects
- `/daogov/*` → `/writing/dao-governance-resources/`
- `/posts/*` → `/writing/`
- `/llm`, `/llm.txt`, `/llms` → `/llms.txt`
- `/简历`, `/履历` → `/cv-zh/`

### Deploy
```bash
git push  # Auto-deploys via Vercel Git integration
```

## Known Improvements (Backlog)

### Portrait Book Spread Memory
The making/portraits index uses scroll-snap spreads, but scroll restoration uses pixel positions. When returning from a portrait detail page, the spread restoration may be imprecise.

**Future fix**: Save spread index (0, 1, 2...) instead of pixel position for the making section. Implement when/if users report navigation issues.

## Design Tokens

### Responsive Breakpoints
- **1100px**: Primary breakpoint (hide marginalia, simplify grids)
- **768px**: Secondary breakpoint (full mobile, compact padding)

### Typography Patterns
- **Detail page titles**: `clamp(1.8rem, 4vw, 2.8rem)` at `font-weight: 300`
- **Index page titles**: `1rem` at `font-weight: 400`
- **Label letter-spacing**: `0.15em` (all uppercase IBM Plex Mono labels)

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
