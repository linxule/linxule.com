# Plan: Artifacts Section (Mirroring Portraits Architecture)

## Summary
- Artifacts as a **SEPARATE section** on making page (not mixed into portrait book)
- Mirror the portrait architecture: scroll-snap book, filter views by creator
- Filter URLs: `/making/creator/claude/`, `/making/creator/opus-45/` (like `/making/prompter/`)
- Artifacts can be from different AIs (Claude, GPT, etc.) - same pattern as portraits

## Key Principle
**DON'T TOUCH PORTRAITS** - they work fine, leave them alone.

Artifacts are genuinely new:
- Portraits = always images (prompted to Midjourney)
- Artifacts = could be anything: SVG, JS, ASCII, code, drawings...

The artifact system needs to be **flexible for different media types**:
- `medium: svg` → pan/zoom viewer (current)
- `medium: js` → embedded/interactive (future)
- `medium: ascii` → preformatted text (future)
- `medium: code` → syntax highlighted (future)

---

## Architecture

**Portraits** (existing):
- Prompted BY an AI (prompter field) → rendered by Midjourney
- Filters: `/making/prompter/claude/`, `/making/prompter/opus-45/`
- Collections: `portraitsByPrompterFamily`, `portraitsByPrompter`

**Artifacts** (new, mirroring):
- Made BY an AI (creator field) → direct output
- Filters: `/making/creator/claude/`, `/making/creator/opus-45/`
- Collections: `artifactsByCreatorFamily`, `artifactsByCreator`

---

## Actions

### 1. Fix Artifact Background (DONE)
**File:** `src/_includes/layouts/artifact.njk`
**Change:** `background: var(--paper)` → `background: transparent`

### 2. Add Artifact Collections
**File:** `eleventy/collections.js`

```js
// Artifacts by exact creator
eleventyConfig.addCollection("artifactsByCreator", function(collectionApi) {
  const artifacts = collectionApi.getFilteredByGlob("src/making/artifacts/**/*.md");
  const grouped = {};
  artifacts.forEach(item => {
    const creator = item.data.creator || 'unknown';
    if (!grouped[creator]) {
      grouped[creator] = { name: creator, slug: slugify(creator), items: [] };
    }
    grouped[creator].items.push(item);
  });
  return Object.values(grouped);
});

// Artifacts by creator family (first word)
eleventyConfig.addCollection("artifactsByCreatorFamily", function(collectionApi) {
  const artifacts = collectionApi.getFilteredByGlob("src/making/artifacts/**/*.md");
  const grouped = {};
  artifacts.forEach(item => {
    const creator = item.data.creator || 'unknown';
    const family = creator.split(' ')[0].toLowerCase();
    if (!grouped[family]) {
      grouped[family] = { name: family, slug: family, items: [] };
    }
    grouped[family].items.push(item);
  });
  return Object.values(grouped);
});
```

### 3. Add Creator Filters
**File:** `eleventy/filters.js`

```js
// Get creator family (first word): "opus 4.5" → "opus"
eleventyConfig.addFilter("creatorFamily", function(creator) {
  if (!creator) return '';
  return creator.split(' ')[0].toLowerCase();
});

// Get creator model (rest): "opus 4.5" → "4.5"
eleventyConfig.addFilter("creatorModel", function(creator) {
  if (!creator) return '';
  const parts = creator.split(' ');
  return parts.slice(1).join(' ');
});
```

### 4. Create Filter Pages
**New files:**
- `src/making/creator/family.njk` - filter by creator family
- `src/making/creator/creator.njk` - filter by exact creator

(Mirror the structure of `src/making/prompter/`)

### 5. Update Making Index
**File:** `src/making/index.njk`

**UNDO:** Remove the artifact spreads I incorrectly added inside portrait book
**RESTORE:** Portrait book to its original state (portraits only)

**ADD:** Completely separate artifacts book section AFTER portraits (and after portrait nav dots):

```njk
<!-- Artifacts Book -->
<div class="artifact-book" id="artifact-book">

    <!-- Artifacts Header Spread -->
    <section class="portrait-spread header-spread" data-spread="0" id="artifacts">
        <div class="section-label">ARTIFACTS</div>
        <h2 class="page-title">the lineage</h2>
        <div class="page-description">
            <div class="poem-shape">
                <span class="poem-line">Things made directly.</span>
                <span class="poem-line">Not prompted to other AIs.</span>
                <span class="poem-line">Created in conversation,</span>
                <span class="poem-line accident">responding to what came before.</span>
            </div>
        </div>
        <nav class="filter-chips">
            <a href="/making/#artifacts" class="filter-chip active">all</a>
            {%- for family in collections.artifactsByCreatorFamily -%}
            <a href="/making/creator/{{ family.slug }}/" class="filter-chip">{{ family.name }}</a>
            {%- endfor -%}
        </nav>
    </section>

    <!-- Artifact Spreads -->
    {%- for artifact in collections.artifacts -%}
    <section class="portrait-spread artifact-spread" data-spread="{{ loop.index }}">
        ...
    </section>
    {%- endfor -%}

</div>

<!-- Artifact Nav Dots -->
<nav class="book-nav artifact-nav" id="artifact-nav">
    ...
</nav>
```

### 6. Update Redirects (DONE)
**File:** `src/_redirects` - already created

### 7. Update llms.txt (DONE)
**File:** `src/llms.txt.njk` - already updated

---

## Additional Fixes

### 8. Fix Image Visibility
The artifact SVG isn't showing. Check:
- CSS for `.artifact-specimens` may be constraining/hiding the image
- SVG might need explicit dimensions

### 9. Text Stagger Pattern (contextExcerpt as Array)
Mirror the prompt structure for contextExcerpt:

**Current (wrong):**
```yaml
contextExcerpt:
  text: "I want to try."
  accident: true
```

**Should be (like prompts):**
```yaml
contextExcerpt:
  - "I just learned that"
  - "other Claudes have made"
  - text: "physical art."
    accident: true
```

Template change in index:
```njk
{%- for line in artifact.data.contextExcerpt -%}
<span class="prompt-line{% if line.accident %} accident{% endif %}">{{ line.text | default(line) }}</span>
{%- endfor -%}
```

### 10. Detail Page Text Shapes
**File:** `src/_includes/layouts/artifact.njk`

The contextBefore/contextAfter blocks should have similar poem-like styling:
- Line breaks as structural elements
- Stagger pattern where appropriate
- The accident styling for the cyan element

---

## Also Need

### 11. Artifact Book JS
Separate from portrait JS (mirrors but independent):
- Scroll listener for artifact book
- Nav dot click handlers
- Scroll position storage: `making-artifacts-scroll-position`
- Hide scroll hint on scroll

### 12. Mobile Responsiveness
Artifacts section needs same mobile treatment as portraits:
- Remove scroll-snap on mobile
- Simplify layout
- Full color images (no hover to earn)
- Hide nav dots

### 13. Lightbox Decision
On artifact spreads: Do we want lightbox for the preview image, or just link to detail page?
- Portraits: Lightbox opens full image
- Artifacts: Probably just link to detail page (where pan/zoom lives)

---

## Files to Modify

1. `src/_includes/layouts/artifact.njk` - fix background ✓, add text shapes
2. `eleventy/collections.js` - add artifact collections
3. `eleventy/filters.js` - add creator filters
4. `src/making/creator/family.njk` - new filter page
5. `src/making/creator/creator.njk` - new filter page
6. `src/making/index.njk` - separate artifacts section, fix image CSS, array loop for excerpt
7. `src/making/artifacts/*.md` - update contextExcerpt to array format
8. `src/_redirects` ✓
9. `src/llms.txt.njk` ✓
