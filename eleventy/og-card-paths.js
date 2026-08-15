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

// Card revision — bump when the auto-title card DESIGN changes. /assets/* is
// 1-year immutable at the edge AND platform scrapers cache by URL, so a restyle
// must ship at new paths (og-card-refresh.md). Old auto/*.jpg files stay in the
// repo, unreferenced, so already-scraped previews keep resolving.
// r2 (2026-08-15): brand footer moved bottom-right, "XULE LIN ·" dropped.
export const CARD_REV = "-r2";

// Layouts whose image-less pages get a generated title card. Value is a
// section label (used by gen-og-cards.mjs to build each layout's kicker).
const AUTO_LAYOUTS = {
  "layouts/writing.njk": "writing",
  "layouts/artifact.njk": "artifact",
  "layouts/talk.njk": "talk",
};

/** Template-side: returns the auto-title card path for a page, or null. */
export function autoCardPath(fileSlug, layout) {
  if (!fileSlug || !(layout in AUTO_LAYOUTS)) return null;
  return `${AUTO_DIR}/${fileSlug}${CARD_REV}.jpg`;
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
