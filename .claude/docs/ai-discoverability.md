# AI Discoverability Architecture Reference

Full details of the AI/LLM discoverability system. Read this when adding new AI signals, modifying llms.txt, working on markdown outputs, or debugging content negotiation.

## llms.txt

`/llms.txt` is written for AI readers — explains the work in terms they can surface to humans. It's an artifact of the philosophy, demonstrates the collaboration it describes. The "Markdown Versions" section dynamically lists all `.md` URLs from Eleventy collections (writing, portraits, artifacts, talks) plus static pages — auto-updating as content is added.

## Discovery Signals

Multiple signals help AI systems find llms.txt:
- **HTTP header**: `Link: </llms.txt>; rel="llms-txt"` (vercel.json)
- **HTML link**: `<link rel="llms-txt" href="/llms.txt">` (base.njk head)
- **robots.txt**: `LLMs-Txt:` directive
- **sitemap.xml**: llms.txt entry with priority 1.0
- **sr-only breadcrumb**: Hidden text in `partials/ai-breadcrumb.njk` (included on every page)
- **ai-hint on homepage**: Background-color-matching text in index.njk (invisible to humans, readable by AI text extraction)
- **Markdown versions**: Every content page has `.md` version (templates in `src/md-outputs/`)
- **Content negotiation**: `Accept: text/markdown` header → Vercel middleware rewrites to `.md` version (`middleware.ts`)
- **Content index**: `/site-index.json` — JSON manifest of all pages with metadata
- **AI redirects**: `/ai` and `/for-ai` redirect to `/llms.txt` (vercel.json)

**Key files**: `vercel.json` (headers, redirects), `middleware.ts` (Accept header content negotiation), `base.njk` (link rel, JSON-LD Person schema), `ai-breadcrumb.njk` (sr-only text), `robots.txt.njk`, `sitemap.xml.njk`, `site-index.json.njk`, `feed.njk` (site-wide Atom), `src/md-outputs/*.njk` (markdown templates)

## LLM-Friendly Features

**Structured data for machines:**
- JSON-LD schema on all content pages (Article for writing, ImageGallery for portraits, CreativeWork for artifacts)
- Detailed `alt` text on images (objective visual description)
- `interpretation` field on images (evocative meaning, shown as `title` attribute)
- Meta descriptions derived from content (first image alt, first prompt line as fallbacks)

**Index page summaries:**
- Visually-hidden descriptions on `/writing/` and `/making/` index pages
- In DOM for screen readers and parsers, invisible to sighted users
- Uses CSS: `position: absolute; clip: rect(0,0,0,0);` pattern

## Markdown Output System

Every content page has a `.md` version at the same URL + `.md` suffix. Templates live in `src/md-outputs/`:
- **Paginated collections** (writing, portraits, artifacts, talks): Use `pagination` with `size: 1`
- **Index pages** (writing-index, making-index, talks-index): Static templates using collection loops, permalink `/writing.md` etc.
- **Static pages** (thinking, cv, cv-zh, teaching): Use loop with URL matching

**Template gotchas:**
- Arrays (`prompt[]`, `images[]`, `contextExcerpt[]`) can be undefined — wrap loops in `{% if array %}`
- Access raw markdown content via `post.template.frontMatter.content`
- Static pages live at `src/{name}/index.md`, not root level
- **selectattr doesn't work reliably** — use explicit loop: `{% for page in collections.all %}{% if page.url == "/cv/" %}...{% endif %}{% endfor %}`

**Content negotiation:** Vercel serves `.md` files with `Content-Type: text/markdown; charset=utf-8` (vercel.json). `Accept: text/markdown` → middleware rewrites to `.md` version. Direct `.md` URLs also work.

**Index page `.md` versions:** `/writing.md`, `/making.md`, `/talks.md` are index-level markdown outputs. Middleware matcher includes exact paths. `base.njk` has a separate condition block for `link rel="alternate"` on these three.
