/**
 * Shared og-card path scheme — imported by BOTH the build template (via
 * filters.js → `autoCardPath` filter) and the generator (scripts/gen-og-cards.mjs)
 * so the file the generator writes and the URL the template emits never drift.
 *
 * Auto-title cards are keyed by Eleventy's `page.fileSlug` (the input file's
 * basename, leading `YYYY-MM-DD-` stripped). The generator replicates that rule
 * in `fileSlugOf()` below. See .claude/rules/og-images.md.
 */

export const OG_CARDS_DIR = "/assets/og-cards";
export const AUTO_DIR = `${OG_CARDS_DIR}/auto`;
export const DEFAULT_CARD = `${OG_CARDS_DIR}/default.jpg`;

// Layouts whose image-less pages get a generated title card.
const AUTO_LAYOUTS = new Set(["layouts/writing.njk", "layouts/artifact.njk"]);

/** Template-side: returns the auto-title card path for a page, or null. */
export function autoCardPath(fileSlug, layout) {
  if (!fileSlug || !AUTO_LAYOUTS.has(layout)) return null;
  return `${AUTO_DIR}/${fileSlug}.jpg`;
}

/** Generator-side: replicate Eleventy `fileSlug` from a filename.
 * Eleventy takes the substring AFTER a YYYY-MM-DD date anywhere in the name
 * (so `artifact-2026-02-10-claude-self-portrait` → `claude-self-portrait`);
 * names without a full date are unchanged. */
export function fileSlugOf(filename) {
  const base = filename.replace(/\.[^.]+$/, "");
  const m = base.match(/\d{4}-\d{2}-\d{2}-?(.+)$/);
  return m ? m[1] : base;
}
