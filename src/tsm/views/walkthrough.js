// Walkthrough view — step choreography.
//
// Owns the current step index. Forwards each step's v0.3 reveal-token array
// straight to the matrix renderer + module-overlay view. Reports state
// changes through onChange so external UI (caption, progress dots, buttons)
// can update.
//
// This view does NOT mount the caption/buttons itself. Those stay external
// so the renderer surface can be reused without the walkthrough UI.
//
// The walkthrough no longer knows which tokens drive which effects. Each
// component (matrix, overlays) accepts the same token array and routes it
// through the shared dispatcher in render/reveal.js. Adding a new reveal
// token is a one-file change in render/reveal.js — this view stays put.

/**
 * Create a walkthrough controller.
 *
 * @param {object} matrix — { applyReveal(tokens) } from render/matrix.js
 * @param {object} overlays — { applyReveal(tokens) } from render/overlays.js
 * @param {object|null} narrative — the resolved narrative object (per the
 *   resolution order in core/scene-adapter.js#resolveNarrative:
 *   matrix.narrative ?? scene.narrative ?? null). Consumes `narrative.steps`;
 *   each step's `reveal.include` is a v0.3 reveal-token array
 *   (e.g. ["diagonal", "transfer:directed:forward"]). The tokens flow
 *   to both matrix.applyReveal and overlays.applyReveal; the shared
 *   dispatcher in render/reveal.js resolves them to effect flags.
 *
 *   Pre-v1.0.6 callers passed the full `scene` and we read `scene.narrative`
 *   internally; that coupling prevented per-matrix narratives. Now the
 *   caller does the resolution (one place — main.js#mountTSM) and we accept
 *   whatever shape it landed on. Null is tolerated and yields an empty steps
 *   array (mount-only, no-op controller).
 * @param {{ onChange?: (state) => void }} options
 * @returns {{ step, next, prev, restart, getStepIndex, getStepCount, getCurrentStep }}
 */
export function createWalkthrough(matrix, overlays, narrative, { onChange, emphasis } = {}) {
  let stepIndex = 0;

  const steps = narrative?.steps ?? [];

  // Per SPEC-LENSES §4: a step may declare `setEmphasis: { primary: {...},
  // secondary: {...} }` with criteria `byLens`, `byId`, `byMark`. The
  // controller resolves matching items by walking EVERY matrix the host
  // passed in (`emphasis.matrices` — multi-matrix; falls back to
  // `emphasis.matrix` single for back-compat) plus scene-level arrows
  // (`emphasis.sceneArrows`), then forwards override maps to each renderer
  // via its applyEmphasis hook. Items not mentioned by the step retain
  // their JSON-declared emphasis.
  //
  // Pre-v1.6.2 this walked only the host's `emphasis.matrix` slot, so a
  // multi-matrix step (e.g., Fig 18.1 step 3 demoting downstream's
  // forward-handoff primaries) silently no-op'd on matrix 1's arrows
  // renderer in multi-mount. CONVERGENCE-1 fix: union the diff across all
  // matrices and let the host fan out to every renderer.
  //
  // byId semantics differ per renderer slot — author-facing footgun if
  // not documented (CLAUDE-H2). SPEC-LENSES §4 is canonical; this is the
  // quick reference for contributors reading the controller. v0.3.15
  // (v1.6.5 Wave 2 r-2 INFO-1) sharpens transfers + annotations to match
  // the SPEC + schema-description rewrite:
  //   - transfers:    id = `${t.from}→${t.to}` (the transfer pair key,
  //                   NOT the task id). `byId: ["dr1"]` matches NOTHING;
  //                   use `byId: ["dr1→s-spec"]`. Additional gate: the
  //                   matcher only runs against transfers whose
  //                   `rendering.arrow === true` (see line ~159, the
  //                   `transfers.filter(...)` call) — a lens-tagged or
  //                   byId-targeted transfer without an arrow-rendering
  //                   directive is silently a no-op. Mirrored by
  //                   render/explore-disclosure.js#buildLensFilter.
  //   - overlays:     module-border id = overlay.regionId;
  //                   firm-boundary id = `firm-boundary:${overlayIndex}`
  //                   (mirrors render/overlays.js + Explore disclosure;
  //                   v1.6.4 D3).
  //   - annotations:  id = the integer index in the matrix's annotations[]
  //                   array. The current schema (`schemas/tsm-scene
  //                   .schema.json` `annotation` object has
  //                   `additionalProperties: false` with no `id`
  //                   property), so for schema-valid scenes the byId
  //                   namespace is index-only. The matcher below uses
  //                   `an.id ?? i` as a dormant authoring fallback that
  //                   stays compatible if a future schema bump adds an
  //                   `id` field.
  //   - cross-arrows: id = arrow.id when declared, else the fallback
  //                   `${fromMatrix}:${fromTaskId}→${toMatrix}:${toTaskId}`.
  //
  // Diff shape (v1.6.3 — Round-3 Fix 1, Path B "per-renderer scoped diff"):
  //
  //   {
  //     arrows:      Map<matrixIdx, Map<transferKey, tier>>,
  //     overlays:    Map<matrixIdx, Map<regionId,    tier>>,
  //     annotations: Map<matrixIdx, Map<annoIdx,     tier>>,
  //     crossArrows: Map<arrowKey, tier>,   // scene-level, no per-matrix scoping
  //   }
  //
  // The per-matrix Maps are keyed by the LOCAL index into the
  // `sceneMatrices` array the host passed in — i.e., 0..N-1 for however
  // many matrices the walkthrough is driving. The renderer-side fan-out
  // adapter in main.js (createEmphasisFanOut) is responsible for dispatching
  // each per-matrix slice to the matching renderer instance.
  //
  // Pre-v1.6.3 the diff was a single Map per renderer slot keyed by item
  // id alone — fine for transfers/overlays/cross-arrows whose keys are
  // globally unique by author convention, but BROKEN for annotations
  // (indexed per-matrix — index 0 of matrix 0 collides with index 0 of
  // matrix 1) and latently broken for transfers/overlays the moment two
  // matrices share a task id like "A" or a region like "core". Per-matrix
  // scoping closes the entire class.
  function resolveEmphasisDiff(setEmphasis) {
    const out = {
      arrows: new Map(),
      overlays: new Map(),
      annotations: new Map(),
      crossArrows: new Map(),
    };

    // Accept either an array of matrices (preferred — covers multi-mount)
    // or a single matrix (back-compat with single-mount callers that pass
    // emphasis.matrix). Each matrix's diff is emitted under its LOCAL
    // index into this array.
    const sceneMatrices = emphasis
      ? (Array.isArray(emphasis.matrices)
          ? emphasis.matrices
          : (emphasis.matrix ? [emphasis.matrix] : []))
      : [];
    const sceneArrows = emphasis?.sceneArrows ?? [];

    // Pre-seed empty per-matrix Maps so consumers can iterate every slot
    // (and so reset:true semantics are honored even on steps that don't
    // declare setEmphasis). Without this, a matrix unaffected by the
    // current step — or any matrix when the step has no setEmphasis — would
    // be missing from overridesByMatrix entirely; the fan-out adapter
    // would skip it and stale walkthrough-layer overrides from prior steps
    // would persist.
    for (let i = 0; i < sceneMatrices.length; i++) {
      out.arrows.set(i, new Map());
      out.overlays.set(i, new Map());
      out.annotations.set(i, new Map());
    }

    if (!setEmphasis || !emphasis) return out;

    function transferKey(t) { return `${t.from}→${t.to}`; }
    function lensesOf(item) {
      const l = item?.rendering?.lens;
      if (Array.isArray(l)) return l;
      if (typeof l === "string") return [l];
      return [];
    }
    function matchesCriteria(criteria, item, opts = {}) {
      if (!criteria) return false;
      const byLens = criteria.byLens ?? [];
      const byId = criteria.byId ?? [];
      const byMark = criteria.byMark ?? [];
      if (byLens.length > 0) {
        const lenses = lensesOf(item);
        if (byLens.some((l) => lenses.includes(l))) return true;
      }
      if (byId.length > 0 && opts.id != null && byId.includes(opts.id)) return true;
      if (byMark.length > 0 && item?.mark && byMark.includes(item.mark)) return true;
      return false;
    }

    for (const tier of ["primary", "secondary"]) {
      const criteria = setEmphasis[tier];
      if (!criteria) continue;
      for (let mi = 0; mi < sceneMatrices.length; mi++) {
        const sceneMatrix = sceneMatrices[mi];
        const transfers = sceneMatrix?.transfers ?? [];
        const overlaysList = sceneMatrix?.overlays ?? [];
        const annotationsList = sceneMatrix?.annotations ?? [];
        const arrowsMap = out.arrows.get(mi);
        const overlaysMap = out.overlays.get(mi);
        const annotationsMap = out.annotations.get(mi);
        for (const t of transfers.filter((x) => x?.rendering?.arrow === true)) {
          if (matchesCriteria(criteria, t, { id: `${t.from}→${t.to}` })) {
            arrowsMap.set(transferKey(t), tier);
          }
        }
        for (let oi = 0; oi < overlaysList.length; oi++) {
          const ov = overlaysList[oi];
          if (ov.kind === "module-border") {
            if (!ov.regionId) continue;
            if (matchesCriteria(criteria, ov, { id: ov.regionId })) {
              overlaysMap.set(ov.regionId, tier);
            }
          } else if (ov.kind === "firm-boundary") {
            // Renderer-local key shape `firm-boundary:${index}` matches
            // render/overlays.js#applyEmphasisToElements (which reads
            // dataset.boundaryIndex to compose the same key) and
            // render/explore-disclosure.js#buildLensFilter (which emits
            // `firm-boundary:${oi}` for the chip-filter path). The walkthrough
            // therefore uses the same key shape — setEmphasis.byId of
            // `firm-boundary:0` flips that overlay's tier inside its matrix's
            // slice. Pre-v1.6.4 D3 the walkthrough skipped firm-boundary
            // overlays entirely so authoring a per-step firm-boundary
            // emphasis change was silently impossible even though Explore
            // chips could target them via the same key shape.
            const key = `firm-boundary:${oi}`;
            if (matchesCriteria(criteria, ov, { id: key })) {
              overlaysMap.set(key, tier);
            }
          }
        }
        for (let i = 0; i < annotationsList.length; i++) {
          const an = annotationsList[i];
          if (matchesCriteria(criteria, an, { id: an.id ?? i })) {
            annotationsMap.set(i, tier);
          }
        }
      }
      for (const a of sceneArrows) {
        const k = a.id ?? `${a.from?.matrix}:${a.from?.taskId}→${a.to?.matrix}:${a.to?.taskId}`;
        if (matchesCriteria(criteria, a, { id: k })) {
          out.crossArrows.set(k, tier);
        }
      }
    }
    return out;
  }

  function apply() {
    const step = steps[stepIndex];
    if (!step) return;
    const tokens = step.reveal?.include ?? [];
    matrix.applyReveal(tokens);
    overlays.applyReveal(tokens);

    // setEmphasis transitions — compute the diff against this step's
    // criteria and forward to each renderer slot.
    //
    // Per-matrix slots (arrows, overlays, annotations) receive an
    // `overridesByMatrix: Map<matrixIdx, Map<key, tier>>` payload; the
    // fan-out adapter in main.js dispatches each per-matrix slice to that
    // matrix's renderer instance (createEmphasisFanOut). Pre-v1.6.3 the
    // walkthrough emitted a single union Map per slot keyed by item id;
    // collisions across matrices (annotation indices intrinsically,
    // transfer/overlay ids the moment two matrices share names) silently
    // applied one matrix's overrides to another's DOM. Per-matrix scoping
    // closes the entire class.
    //
    // Cross-arrows are scene-level (one renderer for all matrices), so
    // they receive the unscoped `overrides: Map<arrowKey, tier>` directly.
    //
    // Items not mentioned by the diff retain their JSON-declared emphasis;
    // we reset only the walkthrough layer each step so the prior step's
    // runtime tier doesn't bleed forward — the Explore chip filter
    // (layer:"explore") survives intact. Closes CONVERGENCE-2 + B3: chip
    // filter no longer gets silently wiped by walkthrough.next/prev/restart.
    if (emphasis) {
      const diff = resolveEmphasisDiff(step.setEmphasis);
      emphasis.arrows?.applyEmphasis?.({ overridesByMatrix: diff.arrows, reset: true, layer: "walkthrough" });
      emphasis.overlays?.applyEmphasis?.({ overridesByMatrix: diff.overlays, reset: true, layer: "walkthrough" });
      emphasis.annotations?.applyEmphasis?.({ overridesByMatrix: diff.annotations, reset: true, layer: "walkthrough" });
      emphasis.crossArrows?.applyEmphasis?.({ overrides: diff.crossArrows, reset: true, layer: "walkthrough" });
    }

    onChange?.({
      stepIndex,
      step,
      total: steps.length,
      isFirst: stepIndex === 0,
      isLast: stepIndex === steps.length - 1,
    });
  }

  return {
    step(n) {
      if (n < 0 || n >= steps.length) return;
      stepIndex = n;
      apply();
    },
    next() {
      if (stepIndex < steps.length - 1) {
        stepIndex += 1;
        apply();
      }
    },
    prev() {
      if (stepIndex > 0) {
        stepIndex -= 1;
        apply();
      }
    },
    restart() {
      stepIndex = 0;
      apply();
    },
    getStepIndex: () => stepIndex,
    getStepCount: () => steps.length,
    getCurrentStep: () => steps[stepIndex],
  };
}
