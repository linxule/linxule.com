// Scene adapter. Mutates a v0.3 or v0.4 tsm-scene in place with derived
// fields the renderer needs:
//   - per-transfer: direction (forward/backward from index order), cross
//     (true if transfer crosses a region boundary). `mark` is intentionally
//     NOT defaulted at runtime — the renderer doesn't read it, and I3 reads
//     it pre-decoration at validate time. The schema's default: "x" is
//     documentation only (Ajv is constructed without useDefaults).
//   - per-region: color (resolved CSS variable per the theme convention).
//   - per-transfer/overlay/annotation/cross-matrix-arrow: rendering.emphasis
//     back-compat (v0.3) + default (v0.4) per SPEC-LENSES v0.2 §3.1. v0.3
//     scenes get emphasis:primary injected on every arrowed transfer (and
//     every cross-matrix arrow) so existing scenes keep rendering identically
//     under v1.2.0 behavior. v0.4 scenes that omit emphasis on an arrowed
//     transfer get the spec default of "secondary".
//   - rendering.lens normalization: single-string sugar is widened to an
//     array (the renderer + validator + Explore chip strip all consume the
//     array shape).
//
// Multi-matrix: decoration iterates every matrix in `scene.matrices`.
// Selecting which matrix to render is the caller's concern — `mountTSM`
// accepts a `matrixIndex` option (default 0). The schema permits any number
// of matrices; this module no longer enforces a single-matrix runtime guard.
//
// This module replaces core/normalize.js. The legacy {groups, tasks,
// transfers, steps} flattening is gone — render/matrix.js and
// views/walkthrough.js now consume v0.3 fields directly.

/**
 * Get a CSS color for a region. v0.3 keeps colors out of the data file;
 * we map region.id → CSS custom property defined by the theme.
 */
function getRegionColor(region) {
  // Convention: --color-<regionId> defined in styles/theme.css.
  // Fallback: --rule (matrix rule color).
  // Multi-core declares several core regions (core-1, core-2, …) but the theme
  // defines a single --color-core hue, so normalize core-N → core for the
  // lookup; otherwise each core box falls back to the faint --rule color and
  // stops reading as a core. The regions are spatially distinct diagonal blocks
  // labelled "Core 1" / "Core 2", so sharing the warm core hue stays legible.
  const colorKey = /^core-\d+$/.test(region.id) ? "core" : region.id;
  return `var(--color-${colorKey}, var(--rule))`;
}

/**
 * Detect whether a scene is a v0.3 scene (pre-lenses). v0.3 scenes need
 * the back-compat emphasis injection: every arrowed transfer + every
 * cross-matrix arrow gets emphasis:primary so the renderer keeps showing
 * what it always showed. Missing/unknown specVersion is treated as v0.3
 * (the schema rejects unknown values anyway; this is belt-and-suspenders
 * for tests that construct scenes without a specVersion field).
 */
function isV03Scene(scene) {
  const v = scene?.specVersion;
  if (typeof v !== "string") return true;
  return v.startsWith("0.3");
}

/**
 * Normalize rendering.lens from `string` sugar to `string[]` shape, in
 * place. No-op when already an array or when the lens field is absent.
 */
function normalizeLens(rendering) {
  if (!rendering || typeof rendering !== "object") return;
  if (typeof rendering.lens === "string") {
    rendering.lens = [rendering.lens];
  }
}

/**
 * Apply emphasis back-compat + default rules to a rendering object that
 * belongs to an arrowed item (transfer with rendering.arrow:true, or any
 * scene.arrows[] entry). For v0.3, inject "primary" if missing. For v0.4,
 * default missing emphasis to "secondary" per SPEC-LENSES §3.1.
 *
 * For non-arrowed transfers (rendering.arrow falsy), emphasis is left as
 * declared — those items don't render an arrow regardless, and the renderer
 * gates them by reveal alone.
 */
function applyEmphasisToArrowed(rendering, isV03) {
  if (!rendering || typeof rendering !== "object") return;
  if (typeof rendering.emphasis === "string") return; // honor declared value
  rendering.emphasis = isV03 ? "primary" : "secondary";
}

/**
 * Decorate a single matrix in place: regions get color + label fallback,
 * transfers get direction + cross. All derivations are scoped to this matrix
 * — task ids only need to be unique within a matrix.
 *
 * Also applies the emphasis + lens back-compat per SPEC-LENSES v0.2 §3.1/§3.2
 * to each transfer's rendering object (when present), plus to per-matrix
 * overlays and annotations.
 */
function decorateMatrix(matrix, isV03) {
  const taskIndex = Object.fromEntries(matrix.tasks.map((t, i) => [t.id, i]));
  const taskRegion = Object.fromEntries(matrix.tasks.map((t) => [t.id, t.region]));

  for (const region of matrix.regions ?? []) {
    region.color = getRegionColor(region);
    if (region.label === undefined) region.label = region.id;
  }
  for (const tr of matrix.transfers ?? []) {
    const fromIdx = taskIndex[tr.from];
    const toIdx = taskIndex[tr.to];
    if (fromIdx === undefined) throw new Error(`Unknown transfer from: ${tr.from}`);
    if (toIdx === undefined) throw new Error(`Unknown transfer to: ${tr.to}`);
    tr.direction = fromIdx < toIdx ? "forward" : "backward";
    tr.cross = taskRegion[tr.from] !== taskRegion[tr.to];
    // Note: `mark` default ("x") lives in the JSON Schema (schemas/tsm-scene
    // .schema.json) for documentation; the renderer does not read it, and
    // I3 reads it at validate time before decoration, so we don't assign
    // a runtime default here.
    if (tr.rendering && typeof tr.rendering === "object") {
      normalizeLens(tr.rendering);
      // Only arrowed transfers participate in the emphasis gate — the
      // non-arrowed cell marks are visibility-gated by reveal alone.
      if (tr.rendering.arrow === true) {
        applyEmphasisToArrowed(tr.rendering, isV03);
      }
    }
  }
  for (const ov of matrix.overlays ?? []) {
    if (!ov.rendering || typeof ov.rendering !== "object") {
      ov.rendering = {};
    }
    normalizeLens(ov.rendering);
    // v0.3 scenes get implicit primary (back-compat: overlays were always
    // visible). v0.4 scenes get implicit secondary per SPEC-LENSES §3.1 —
    // the renderer's effectiveEmphasis() comment at render/overlays.js:53
    // is now true at the data layer rather than relying on the renderer
    // default. Closes audit H5.
    //
    // Firm-boundary carve-out (SPEC-LENSES §3.1): a firm-boundary overlay
    // is matrix identity, not progressive disclosure. The adapter injects
    // emphasis:"primary" when the author omits it so the perimeter renders
    // loud from frame one. Authors who want a firm-boundary to participate
    // in Explore lens filtering can still override with an explicit
    // rendering.emphasis: "secondary" (the typeof-string guard in
    // applyEmphasisToArrowed honors declared values either way). Closes
    // r4 M1 — without this, omitting emphasis on a future firm-boundary
    // would render at 25% opacity from default frame via the unconditional
    // styles/overlays.css `.firm-boundary-overlay[data-emphasis="secondary"]`
    // rule. Both shipped scenes (Fig 6, Fig 18.1) already declare explicit
    // primary so the change is data-shape backward-compatible.
    if (ov.kind === "firm-boundary" && typeof ov.rendering.emphasis !== "string") {
      ov.rendering.emphasis = "primary";
    } else {
      applyEmphasisToArrowed(ov.rendering, isV03);
    }
  }
  for (const an of matrix.annotations ?? []) {
    if (!an.rendering || typeof an.rendering !== "object") {
      an.rendering = {};
    }
    normalizeLens(an.rendering);
    applyEmphasisToArrowed(an.rendering, isV03);
  }
}

/**
 * Decorate a v0.3 tsm-scene with derived fields used by the renderer.
 *
 * Mutates the input (every matrix). Returns the same scene for chaining.
 *
 * @param {object} scene — schema-valid v0.3 tsm-scene
 * @returns {object} — the same scene, with decorations applied to every matrix
 */
export function decorateScene(scene) {
  if (scene.kind !== "tsm-scene") {
    throw new Error(`decorateScene: expected kind="tsm-scene", got kind="${scene.kind}"`);
  }
  if (!Array.isArray(scene.matrices) || scene.matrices.length === 0) {
    throw new Error(`decorateScene: scene must have at least one matrix`);
  }

  const isV03 = isV03Scene(scene);
  for (const matrix of scene.matrices) {
    decorateMatrix(matrix, isV03);
  }
  // Scene-level cross-matrix arrows participate in the emphasis gate too
  // (Codex B3 fix per SPEC-LENSES §10). v0.3 scenes get primary; v0.4
  // scenes get the spec default of secondary when missing.
  for (const arrow of scene.arrows ?? []) {
    if (!arrow.rendering || typeof arrow.rendering !== "object") {
      arrow.rendering = {};
    }
    normalizeLens(arrow.rendering);
    applyEmphasisToArrowed(arrow.rendering, isV03);
  }
  return scene;
}

/**
 * Resolve the narrative for a given matrix selection.
 *
 * Lookup order: matrix.narrative ?? scene.narrative ?? null.
 *
 * The optional `matrix.narrative` field (added in v1.0.6) lets multi-matrix
 * scenes carry distinct walkthroughs per matrix — Fig 4 (store-household,
 * two-zone) and Fig 18.1 (upstream-downstream firms) need this. Existing
 * single-matrix scenes (laptop, job-shop, flow-*, platform, all fixtures)
 * keep working with scene-level narratives untouched.
 *
 * Returns null when neither side declares a narrative — the caller (mountTSM)
 * interprets null as "mount-only, no walkthrough controller".
 *
 * Pure function: does not mutate scene. Safe to call before or after
 * decorateScene. Out-of-range matrixIndex returns scene.narrative ?? null
 * (the mountTSM guard handles the out-of-range error case separately, so we
 * don't double-throw here).
 *
 * @param {object} scene — v0.3 tsm-scene
 * @param {number} [matrixIndex=0] — which matrix's narrative to prefer
 * @returns {object|null} — the resolved narrative object, or null
 */
export function resolveNarrative(scene, matrixIndex = 0) {
  const matrix = scene?.matrices?.[matrixIndex];
  return matrix?.narrative ?? scene?.narrative ?? null;
}
