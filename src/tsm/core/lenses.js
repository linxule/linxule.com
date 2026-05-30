// Canonical lens vocabulary — SPEC-LENSES §2.
//
// Single source of truth for the six canonical lens ids. The validator,
// the Explore disclosure renderer, and the synthesis layer all import from
// here so they cannot drift out of sync. The Explore disclosure additionally
// owns the human-readable LABEL + CLAIM strings (presentation concerns); this
// module owns only the id list + the canonical display order.
//
// Display order matches SPEC-LENSES §2's enumeration. `collectSceneLenses`
// in core/synthesis/derive.js + `emitEmphasisAndLenses`'s lens-array sort
// both use this order so scene.lenses + per-item rendering.lens arrays read
// in the same canonical sequence regardless of which rule emitted them.
//
// Why the list is duplicated in `schemas/tsm-scene.schema.json`. JSON Schema
// cannot import a JS module, so the schema hand-duplicates the same six
// ids in TWO places: `$defs.renderingLens` (per-item enum, both string
// and array branches) AND `properties.lenses.items.enum` (the scene-level
// declaration). Both copies are pinned to this array by the sync guard
// `tests/unit/lens-vocab-sync.test.js` — drift fails at unit-test time
// rather than shipping silently. If you change CANONICAL_LENS_IDS, update
// both schema enums in lockstep or the sync test will catch it.
//
// v1.6.4 D5.3 — dropped `label-only` from the vocabulary. It is no longer a
// canonical lens; items whose label IS the load-bearing claim (rather than
// encoding a recurring concept) use the orthogonal `rendering.labelStyle`
// field instead (SPEC-LENSES §3.5). The two systems are independent: lenses
// remain pedagogical chips on the Explore strip; labelStyle is a display
// directive that never surfaces as a chip and never collides with lens ids.

export const CANONICAL_LENS_IDS = [
  "cyclic-flow",
  "coordinator-dispatch",
  "forward-handoff",
  "modularity-boundary",
  "cross-region-edge",
  "core-periphery-boundary",
];

export const CANONICAL_LENSES = new Set(CANONICAL_LENS_IDS);

// Canonical labelStyle values — SPEC-LENSES §3.5.
//
// labelStyle is a display directive on transfers / overlays / annotations /
// cross-matrix arrows, separate from the lens vocabulary. Its only currently
// defined value is `load-bearing` — used for items whose label is the
// figure-specific identity (knife/money transfers in Fig 4, delivery/order
// transactions in Fig 6, contract arrows in Fig 18.1) rather than encoding
// a claim that recurs across figures. Renderers stamp the value to the DOM
// as `data-label-style` for CSS hooks and debugging; the field does not
// drive emphasis or visibility (those remain owned by rendering.emphasis +
// reveal tokens).
//
// Why a closed enum: the value is a display posture, not free-form metadata.
// Locking the enum keeps authors from inventing new styles that would need
// to be threaded through every renderer + the SPEC. New values require a
// SPEC bump and a renderer audit, mirroring how lens-vocabulary expansion
// works.

export const CANONICAL_LABEL_STYLE_IDS = ["load-bearing"];

export const CANONICAL_LABEL_STYLES = new Set(CANONICAL_LABEL_STYLE_IDS);
