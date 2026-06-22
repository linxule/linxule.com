// Validator orchestrator.
//
// Two phases:
//   1. Schema phase — Ajv against the appropriate schema (selected by `kind`).
//   2. Invariant phase — dispatches to core/invariants.js by architectureType.
//      Catches Baldwin's I1–I11 violations.
//
// Phase 2 is stubbed in Unit 3; Unit 4 wires it up.
//
// This module imports `ajv`, which means it's TOOLING-ONLY — never import it
// from browser code paths. Validation runs at `bun run validate` over
// examples/ and fixtures/. Runtime trusts pre-validated JSON.
//
// Schema loading is parameterized (the caller passes the schema in) so this
// module is identical in browser-bundled and Node/Bun-CLI contexts. The
// thinnest wrappers — scripts/validate.js (CLI) — handle I/O.

import Ajv from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import { runInvariants } from "./invariants.js";
import { CANONICAL_LENS_IDS, CANONICAL_LENSES } from "./lenses.js";

let _ajv = null;
const _validators = new Map();

function getAjv() {
  if (_ajv) return _ajv;
  _ajv = new Ajv({ allErrors: true, strict: false });
  addFormats(_ajv);
  return _ajv;
}

function getValidator(kind, schema) {
  if (_validators.has(kind)) return _validators.get(kind);
  const validator = getAjv().compile(schema);
  _validators.set(kind, validator);
  return validator;
}

/**
 * Validate a parsed document against a parsed schema.
 *
 * @param {object} document — parsed JSON document
 * @param {object} schema — parsed JSON schema matching document.kind
 * @returns {{ errors: Array, warnings: Array, valid: boolean }}
 */
export function validateDocument(document, schema) {
  const errors = [];
  const warnings = [];

  if (!document?.kind) {
    errors.push({
      code: "missing_kind",
      severity: "error",
      message: "Document missing required 'kind' field",
    });
    return { errors, warnings, valid: false };
  }

  const validator = getValidator(document.kind, schema);
  const ok = validator(document);
  if (!ok) {
    for (const err of validator.errors ?? []) {
      errors.push({
        code: "schema_error",
        severity: "error",
        path: err.instancePath || "/",
        message: `${err.instancePath || "/"} ${err.message}`.trim(),
        detail: err,
      });
    }
  }

  // Phase 1.5 — kind-specific structural checks the JSON Schema vocabulary
  // can't express. Runs only if schema passed.
  if (errors.length === 0 && document.kind === "dependency-observation") {
    const observationReport = checkDependencyObservationStructure(document);
    errors.push(...observationReport.errors);
    warnings.push(...observationReport.warnings);
  }
  if (errors.length === 0 && document.kind === "tsm-scene") {
    errors.push(...checkTSMSceneStructure(document));
    // Lens vocabulary rules run separately because they emit warnings as
    // well as errors. Aggregating here keeps the warning/error split tidy.
    const lensReport = checkTSMSceneLenses(document);
    errors.push(...lensReport.errors);
    warnings.push(...lensReport.warnings);
  }

  // Phase 2 — invariants. Run only if schema + structural checks passed
  // (otherwise paths in invariant checks may not resolve correctly).
  if (errors.length === 0) {
    const inv = runInvariants(document);
    errors.push(...inv.errors);
    warnings.push(...inv.warnings);
  }

  return { errors, warnings, valid: errors.length === 0 };
}

/**
 * Structural checks for dependency-observation documents that JSON Schema's
 * built-in `uniqueItems` can't express.
 *
 * `uniqueItems` compares whole edge objects — two edges with the same
 * `(from, to)` pair but different `relation` or `evidence` are not flagged
 * as duplicates by the schema, yet they break the derive pipeline (the
 * derived scene gets duplicate transfers). Filed as a follow-up after the
 * wave-3 kimi-code extraction leaked two same-direction edge pairs through
 * derive (see IMPLEMENTATION-PLAN.md "Pipeline follow-ups" + SKILL-NOTES.md).
 *
 * @param {object} doc — already schema-valid dependency-observation
 * @returns {{errors: Array<{code: string, severity: string, message: string, path: string}>, warnings: Array<{code: string, severity: string, message: string, path: string}>}}
 */
function checkDependencyObservationStructure(doc) {
  const errors = [];
  const warnings = [];
  const seen = new Map(); // "from→to" → index of first occurrence

  for (let i = 0; i < doc.edges.length; i += 1) {
    const edge = doc.edges[i];
    const key = `${edge.from}→${edge.to}`;
    if (seen.has(key)) {
      const firstIndex = seen.get(key);
      errors.push({
        code: "duplicate_edge",
        severity: "error",
        path: `/edges/${i}`,
        message: `Duplicate edge ${edge.from} → ${edge.to} (also at /edges/${firstIndex}). Collapse into a single edge with a combined relation label and concatenated evidence; the derive pipeline emits duplicate transfers otherwise.`,
      });
    } else {
      seen.set(key, i);
    }
  }

  const hasMatrices = Object.prototype.hasOwnProperty.call(doc, "matrices");
  const matrices = Array.isArray(doc.matrices) ? doc.matrices : [];
  const hasCrossMatrixArrows = Object.prototype.hasOwnProperty.call(doc, "crossMatrixArrows");
  const crossMatrixArrows = Array.isArray(doc.crossMatrixArrows) ? doc.crossMatrixArrows : [];
  const nodeIds = new Set(doc.nodes.map((node) => node.id));

  if (hasMatrices && doc.specVersion !== "0.4") {
    errors.push({
      code: "V-OBS-1",
      severity: "error",
      path: "/specVersion",
      message: `V-OBS-1: observations declaring matrices[] must use specVersion "0.4"; got "${doc.specVersion}".`,
    });
  }

  if (hasMatrices && matrices.length < 2) {
    errors.push({
      code: "V-OBS-1",
      severity: "error",
      path: "/matrices",
      message: `V-OBS-1: matrices[] must contain at least 2 matrices when present; got ${matrices.length}.`,
    });
  }

  if (hasCrossMatrixArrows && !hasMatrices) {
    errors.push({
      code: "V-OBS-2",
      severity: "error",
      path: "/crossMatrixArrows",
      message: "V-OBS-2: crossMatrixArrows[] requires matrices[] so endpoints can resolve to matrix boundaries.",
    });
  }

  const matrixIds = new Map();
  for (let mi = 0; mi < matrices.length; mi += 1) {
    const matrix = matrices[mi];
    if (matrixIds.has(matrix.id)) {
      errors.push({
        code: "V-OBS-7",
        severity: "error",
        path: `/matrices/${mi}/id`,
        message: `V-OBS-7: duplicate matrix id "${matrix.id}" at /matrices/${mi}/id (also at /matrices/${matrixIds.get(matrix.id)}/id).`,
      });
    } else {
      matrixIds.set(matrix.id, mi);
    }
  }

  const membership = new Map(); // node id -> [{ matrixIndex, nodeIndex }]
  for (let mi = 0; mi < matrices.length; mi += 1) {
    const matrix = matrices[mi];
    for (let ni = 0; ni < matrix.nodeIds.length; ni += 1) {
      const nodeId = matrix.nodeIds[ni];
      if (!nodeIds.has(nodeId)) {
        errors.push({
          code: "V-OBS-4",
          severity: "error",
          path: `/matrices/${mi}/nodeIds/${ni}`,
          message: `V-OBS-4: matrix "${matrix.id}" references unknown node id "${nodeId}" at /matrices/${mi}/nodeIds/${ni}.`,
        });
      }
      const entries = membership.get(nodeId) ?? [];
      entries.push({ matrixIndex: mi, nodeIndex: ni });
      membership.set(nodeId, entries);
    }
  }

  if (hasMatrices) {
    for (let ni = 0; ni < doc.nodes.length; ni += 1) {
      const nodeId = doc.nodes[ni].id;
      const entries = membership.get(nodeId) ?? [];
      if (entries.length === 0) {
        errors.push({
          code: "V-OBS-3",
          severity: "error",
          path: `/nodes/${ni}/id`,
          message: `V-OBS-3: node "${nodeId}" appears in nodes[] but in no matrices[].nodeIds partition.`,
        });
      } else if (entries.length > 1) {
        const locations = entries
          .map((entry) => `/matrices/${entry.matrixIndex}/nodeIds/${entry.nodeIndex}`)
          .join(", ");
        errors.push({
          code: "V-OBS-3",
          severity: "error",
          path: `/matrices/${entries[1].matrixIndex}/nodeIds/${entries[1].nodeIndex}`,
          message: `V-OBS-3: node "${nodeId}" appears in multiple matrices[].nodeIds entries (${locations}). Each node must appear exactly once.`,
        });
      }
    }
  }

  const matrixByNodeId = new Map(
    [...membership.entries()]
      .filter(([, entries]) => entries.length === 1)
      .map(([nodeId, entries]) => [nodeId, entries[0].matrixIndex]),
  );

  // Wave 3 r-2 fold-in (Codex r-1 P2-1): track duplicate cross-arrows by
  // (from, to, kind) tuple. Derive's id composition includes kind for
  // collision safety across different-kind arrows between the same
  // endpoints, but same-endpoint same-kind arrows would compose
  // identical scene-arrow ids and trigger derive's runtime duplicate-id
  // throw. V-OBS-8 catches them at validation time instead — matches the
  // V-OBS-7 unique-matrix-id pattern (collisions caught structurally,
  // not at synthesis runtime).
  const crossArrowKeys = new Map();
  for (let ai = 0; ai < crossMatrixArrows.length; ai += 1) {
    const arrow = crossMatrixArrows[ai];
    const arrowLabel = arrow.label ? ` "${arrow.label}"` : "";
    for (const side of ["from", "to"]) {
      const nodeId = arrow[side];
      if (!nodeIds.has(nodeId)) {
        errors.push({
          code: "V-OBS-6",
          severity: "error",
          path: `/crossMatrixArrows/${ai}/${side}`,
          message: `V-OBS-6: crossMatrixArrow${arrowLabel} ${side}="${nodeId}" does not exist in nodes[].`,
        });
      }
    }

    if (!hasMatrices) continue;
    if (!nodeIds.has(arrow.from) || !nodeIds.has(arrow.to)) continue;
    if (!matrixByNodeId.has(arrow.from) || !matrixByNodeId.has(arrow.to)) continue;

    const fromMatrix = matrixByNodeId.get(arrow.from);
    const toMatrix = matrixByNodeId.get(arrow.to);
    if (fromMatrix === toMatrix) {
      errors.push({
        code: "V-OBS-5",
        severity: "error",
        path: `/crossMatrixArrows/${ai}`,
        message: `V-OBS-5: crossMatrixArrow${arrowLabel} from="${arrow.from}" and to="${arrow.to}" both resolve to matrix "${matrices[fromMatrix].id}". Cross-matrix arrows must connect different matrices.`,
      });
      continue;
    }

    // V-OBS-8: reject duplicate (from, to, kind) tuples — these would
    // collide in derive's emitted scene.arrows[] id namespace and
    // surface as a runtime throw instead of a validation error.
    const kindKey = arrow.kind ?? (arrow.label ? "transaction" : "forward");
    const tupleKey = `${arrow.from}|${arrow.to}|${kindKey}`;
    if (crossArrowKeys.has(tupleKey)) {
      const firstIndex = crossArrowKeys.get(tupleKey);
      errors.push({
        code: "V-OBS-8",
        severity: "error",
        path: `/crossMatrixArrows/${ai}`,
        message: `V-OBS-8: duplicate crossMatrixArrow${arrowLabel} (from="${arrow.from}", to="${arrow.to}", kind="${kindKey}") at /crossMatrixArrows/${ai} (also at /crossMatrixArrows/${firstIndex}). Each (from, to, kind) tuple must be unique to avoid scene-arrow id collisions.`,
      });
    } else {
      crossArrowKeys.set(tupleKey, ai);
    }
  }

  if (hasMatrices && !hasCrossMatrixArrows) {
    warnings.push({
      code: "V-OBS-6-WARN",
      severity: "warning",
      path: "/matrices",
      message:
        "V-OBS-6-WARN: matrices[] is present but crossMatrixArrows[] is absent; confirm the matrices are intentionally disconnected.",
    });
  }

  return { errors, warnings };
}

/**
 * Structural checks for tsm-scene documents that JSON Schema can't express.
 *
 * Three classes of issue, all outside JSON Schema's reach:
 *
 *   1. Cross-matrix arrow endpoints (`scene.arrows[]`). The schema only
 *      requires `matrix >= 0` and nonempty `taskId`. A scene with
 *      `from.matrix=99` or `to.taskId="NOPE"` passed validation; at runtime
 *      the renderer logged + skipped, so a malformed scene shipped with
 *      missing arrows could go undetected until a reader noticed. Blocking
 *      these at validate time catches the exact failure mode that masked
 *      the cross-arrows feature for two minor releases.
 *
 *   2. Duplicate `shortLabel` within a single matrix. The schema only checks
 *      string length. Two tasks both stamped `CLI1` render identical
 *      diagonal cells and identical legend badges with no diagnostic.
 *      `shortLabel` is a per-matrix display convention, so uniqueness is
 *      enforced per matrix — different matrices in a multi-matrix scene
 *      can each declare their own `U1` legitimately.
 *
 *   3. V-LENS-6 referential integrity for lens-era authoring fields:
 *      module-border.regionId, firm-boundary.excludedTaskIds, and
 *      annotation.pointer.regionId/taskId. These previously degraded in
 *      renderer-specific ways (missing overlay, error placeholder, or
 *      misplaced annotation).
 *
 * @param {object} doc — already schema-valid tsm-scene
 * @returns {Array<{code: string, severity: string, message: string, path: string}>}
 */
function checkTSMSceneStructure(doc) {
  const errors = [];
  const matrices = Array.isArray(doc.matrices) ? doc.matrices : [];

  // shortLabel uniqueness per matrix.
  for (let mi = 0; mi < matrices.length; mi += 1) {
    const matrix = matrices[mi];
    const tasks = Array.isArray(matrix?.tasks) ? matrix.tasks : [];
    const seen = new Map(); // shortLabel → first task index
    for (let ti = 0; ti < tasks.length; ti += 1) {
      const task = tasks[ti];
      const label = task?.shortLabel;
      if (typeof label !== "string" || label.length === 0) continue;
      if (seen.has(label)) {
        const firstIndex = seen.get(label);
        errors.push({
          code: "duplicate_short_label",
          severity: "error",
          path: `/matrices/${mi}/tasks/${ti}/shortLabel`,
          message: `Duplicate shortLabel "${label}" in matrix "${matrix.id ?? mi}" (tasks ${tasks[firstIndex].id} and ${task.id}). shortLabel uniqueness is enforced per matrix; the diagonal cell and legend would render identical labels otherwise.`,
        });
      } else {
        seen.set(label, ti);
      }
    }
  }

  // V-LENS-6: overlay and annotation pointers must resolve inside their
  // owning matrix. setEmphasis.byId intentionally stays free-form; see
  // SPEC-LENSES §7 for the documented asymmetry.
  for (let mi = 0; mi < matrices.length; mi += 1) {
    const matrix = matrices[mi];
    const matrixId = matrix?.id ?? mi;
    const regionIds = new Set(
      (matrix?.regions ?? []).map((r) => r?.id).filter((id) => typeof id === "string"),
    );
    const taskIds = new Set(
      (matrix?.tasks ?? []).map((t) => t?.id).filter((id) => typeof id === "string"),
    );

    const overlays = Array.isArray(matrix?.overlays) ? matrix.overlays : [];
    for (let oi = 0; oi < overlays.length; oi += 1) {
      const overlay = overlays[oi];
      if (overlay?.kind === "module-border" && typeof overlay.regionId === "string") {
        if (!regionIds.has(overlay.regionId)) {
          errors.push({
            code: "V-LENS-6",
            severity: "error",
            path: `/matrices/${mi}/overlays/${oi}/regionId`,
            message: `Unknown module-border.regionId "${overlay.regionId}" at /matrices/${mi}/overlays/${oi}/regionId; matrix "${matrixId}" regions are: ${[...regionIds].join(", ")}.`,
          });
        }
      }
      // nested-modules.regionIds[] — schema admits an array of region
      // references (schemas/tsm-scene.schema.json overlay $def). Each entry
      // must resolve in the owning matrix. Renderer would silently drop
      // unresolved ids; the validator catches authoring typos at build
      // time.
      if (overlay?.kind === "nested-modules" && Array.isArray(overlay.regionIds)) {
        for (let ri = 0; ri < overlay.regionIds.length; ri += 1) {
          const regionId = overlay.regionIds[ri];
          if (typeof regionId !== "string" || regionIds.has(regionId)) continue;
          errors.push({
            code: "V-LENS-6",
            severity: "error",
            path: `/matrices/${mi}/overlays/${oi}/regionIds/${ri}`,
            message: `Unknown nested-modules.regionIds value "${regionId}" at /matrices/${mi}/overlays/${oi}/regionIds/${ri}; matrix "${matrixId}" regions are: ${[...regionIds].join(", ")}.`,
          });
        }
      }
      if (overlay?.kind === "firm-boundary" && Array.isArray(overlay.excludedTaskIds)) {
        for (let ei = 0; ei < overlay.excludedTaskIds.length; ei += 1) {
          const taskId = overlay.excludedTaskIds[ei];
          if (typeof taskId !== "string" || taskIds.has(taskId)) continue;
          errors.push({
            code: "V-LENS-6",
            severity: "error",
            path: `/matrices/${mi}/overlays/${oi}/excludedTaskIds/${ei}`,
            message: `Unknown firm-boundary.excludedTaskIds value "${taskId}" at /matrices/${mi}/overlays/${oi}/excludedTaskIds/${ei}; matrix "${matrixId}" tasks are: ${[...taskIds].join(", ")}.`,
          });
        }
      }
    }

    const annotations = Array.isArray(matrix?.annotations) ? matrix.annotations : [];
    for (let ai = 0; ai < annotations.length; ai += 1) {
      const pointer = annotations[ai]?.pointer;
      if (!pointer || typeof pointer !== "object") continue;
      if (typeof pointer.regionId === "string" && !regionIds.has(pointer.regionId)) {
        errors.push({
          code: "V-LENS-6",
          severity: "error",
          path: `/matrices/${mi}/annotations/${ai}/pointer/regionId`,
          message: `Unknown annotation.pointer.regionId "${pointer.regionId}" at /matrices/${mi}/annotations/${ai}/pointer/regionId; matrix "${matrixId}" regions are: ${[...regionIds].join(", ")}.`,
        });
      }
      if (typeof pointer.taskId === "string" && !taskIds.has(pointer.taskId)) {
        errors.push({
          code: "V-LENS-6",
          severity: "error",
          path: `/matrices/${mi}/annotations/${ai}/pointer/taskId`,
          message: `Unknown annotation.pointer.taskId "${pointer.taskId}" at /matrices/${mi}/annotations/${ai}/pointer/taskId; matrix "${matrixId}" tasks are: ${[...taskIds].join(", ")}.`,
        });
      }
      // pointer.rowRange / pointer.columnRange — schema admits each as a
      // 2-tuple of task ids. Both endpoints must resolve. Renderer at
      // render/annotations.js uses these for ranged pointer arrows; an
      // unknown id silently no-ops the pointer.
      for (const rangeField of ["rowRange", "columnRange"]) {
        const range = pointer[rangeField];
        if (!Array.isArray(range)) continue;
        for (let xi = 0; xi < range.length; xi += 1) {
          const taskId = range[xi];
          if (typeof taskId !== "string" || taskIds.has(taskId)) continue;
          errors.push({
            code: "V-LENS-6",
            severity: "error",
            path: `/matrices/${mi}/annotations/${ai}/pointer/${rangeField}/${xi}`,
            message: `Unknown annotation.pointer.${rangeField} value "${taskId}" at /matrices/${mi}/annotations/${ai}/pointer/${rangeField}/${xi}; matrix "${matrixId}" tasks are: ${[...taskIds].join(", ")}.`,
          });
        }
      }
    }
  }

  // Cross-matrix arrow endpoint validation. Build the per-matrix task-id
  // sets up front so the per-arrow loop is a couple of Set lookups.
  const taskIdsByMatrix = matrices.map((m) =>
    new Set((m?.tasks ?? []).map((t) => t?.id).filter((id) => typeof id === "string")),
  );
  const arrows = Array.isArray(doc.arrows) ? doc.arrows : [];
  for (let ai = 0; ai < arrows.length; ai += 1) {
    const arrow = arrows[ai];
    const arrowId = arrow?.id ?? `<index ${ai}>`;
    for (const side of ["from", "to"]) {
      const endpoint = arrow?.[side];
      if (!endpoint || typeof endpoint.matrix !== "number") continue;
      const mIdx = endpoint.matrix;
      if (mIdx < 0 || mIdx >= matrices.length) {
        errors.push({
          code: "arrow_matrix_out_of_range",
          severity: "error",
          path: `/arrows/${ai}/${side}/matrix`,
          message: `Arrow "${arrowId}" ${side}.matrix=${mIdx} is out of range; scene has ${matrices.length} matrices (valid indices 0..${matrices.length - 1}).`,
        });
        continue;
      }
      const taskId = endpoint.taskId;
      if (typeof taskId !== "string" || taskId.length === 0) continue;
      if (!taskIdsByMatrix[mIdx].has(taskId)) {
        errors.push({
          code: "arrow_task_unknown",
          severity: "error",
          path: `/arrows/${ai}/${side}/taskId`,
          message: `Arrow "${arrowId}" ${side}.taskId="${taskId}" not found in matrix ${mIdx} ("${matrices[mIdx].id ?? mIdx}"). Renderer skips unresolved endpoints silently; declare task or fix the id.`,
        });
      }
    }
  }

  return errors;
}

/**
 * Current SPEC-LENSES §3.4 validation. Six rules:
 *
 *   V-LENS-1 (error): every `rendering.lens` reference (on transfers,
 *     overlays, annotations, or cross-matrix arrows) must be a canonical
 *     vocabulary entry from §2. Unknown values fail.
 *   V-LENS-2 (warn): a scene SHOULD declare ≥1 item with
 *     `rendering.emphasis: "primary"`. Zero → warn ("scene will render
 *     blank by default"). v0.3 scenes pass through the adapter, which
 *     injects primary on arrowed transfers — so the check operates on the
 *     pre-adapter JSON, and v0.3 scenes are exempt because the adapter
 *     will supply the primary tier at decoration time.
 *   V-LENS-3 (warn): every lens listed in scene-level `lenses` must have
 *     ≥1 referencing item. Unused lenses → warn ("clean up").
 *   V-LENS-4 (error): every `rendering.emphasis` value must be in
 *     ["primary", "secondary"]. Unknown values error. (The schema enum
 *     already enforces this on schema-valid documents; this check is the
 *     belt-and-suspenders so an out-of-band caller — e.g., a unit test
 *     pre-adapter — still gets the diagnostic.)
 *   V-LENS-5 (error): every walkthrough `setEmphasis.*.byLens` entry must
 *     be a canonical lens id.
 *   V-LENS-6 (error): referential integrity for overlay and annotation
 *     pointer ids is enforced in checkTSMSceneStructure().
 *
 * @param {object} doc — already schema-valid tsm-scene
 * @returns {{ errors: Array, warnings: Array }}
 */
function checkTSMSceneLenses(doc) {
  const errors = [];
  const warnings = [];

  const VALID_EMPHASIS = new Set(["primary", "secondary"]);
  const isV03 = typeof doc.specVersion === "string" && doc.specVersion.startsWith("0.3");

  // Collect every rendering object in the scene paired with its JSON path,
  // so V-LENS-1, V-LENS-2, V-LENS-3, V-LENS-4 can run in a single sweep.
  // `kind` carries the overlay.kind for overlay-targets — V-LENS-2 needs it
  // to recognize firm-boundary overlays as effectively-primary (the renderer
  // at render/overlays.js always draws them; see firm-boundary comment in
  // current SPEC §7.6 + drawFirmBoundaries() at render/overlays.js:140).
  const renderingTargets = [];
  const matrices = Array.isArray(doc.matrices) ? doc.matrices : [];
  for (let mi = 0; mi < matrices.length; mi += 1) {
    const m = matrices[mi];
    const transfers = Array.isArray(m?.transfers) ? m.transfers : [];
    for (let ti = 0; ti < transfers.length; ti += 1) {
      const r = transfers[ti]?.rendering;
      if (r && typeof r === "object") {
        renderingTargets.push({ rendering: r, path: `/matrices/${mi}/transfers/${ti}/rendering` });
      }
    }
    const overlays = Array.isArray(m?.overlays) ? m.overlays : [];
    for (let oi = 0; oi < overlays.length; oi += 1) {
      const overlay = overlays[oi];
      const r = overlay?.rendering;
      if (r && typeof r === "object") {
        renderingTargets.push({
          rendering: r,
          path: `/matrices/${mi}/overlays/${oi}/rendering`,
          overlayKind: overlay?.kind,
        });
      } else if (overlay?.kind === "firm-boundary") {
        // Firm-boundary overlays often omit `rendering` entirely (see Fig 6
        // job-shop.json). The adapter's overlay loop still injects a
        // rendering object during decoration, but V-LENS-2 runs pre-adapter
        // on raw JSON, so we synthesize a marker target so the firm-boundary
        // counts as primary-by-renderer-contract below.
        renderingTargets.push({
          rendering: null,
          path: `/matrices/${mi}/overlays/${oi}`,
          overlayKind: "firm-boundary",
        });
      }
    }
    const annotations = Array.isArray(m?.annotations) ? m.annotations : [];
    for (let ai = 0; ai < annotations.length; ai += 1) {
      const r = annotations[ai]?.rendering;
      if (r && typeof r === "object") {
        renderingTargets.push({ rendering: r, path: `/matrices/${mi}/annotations/${ai}/rendering` });
      }
    }
  }
  const sceneArrows = Array.isArray(doc.arrows) ? doc.arrows : [];
  for (let ai = 0; ai < sceneArrows.length; ai += 1) {
    const r = sceneArrows[ai]?.rendering;
    if (r && typeof r === "object") {
      renderingTargets.push({ rendering: r, path: `/arrows/${ai}/rendering` });
    }
  }

  // V-LENS-1 (lens vocab) + V-LENS-4 (emphasis vocab) + collect lens usage
  // for V-LENS-3, and count primary emphases for V-LENS-2.
  const lensRefs = new Set();
  let primaryCount = 0;
  for (const target of renderingTargets) {
    const { rendering, path, overlayKind } = target;
    // Firm-boundary overlays always render (see render/overlays.js:140 —
    // drawFirmBoundaries draws unconditionally, no reveal gate, and styles
    // by data-emphasis (primary loud; secondary ghosted at 25% opacity via
    // styles/overlays.css). For V-LENS-2 they count as primary when emphasis
    // is omitted or explicitly "primary": the adapter injects "primary" on
    // missing emphasis (firm-boundary carve-out in core/scene-adapter.js
    // per SPEC-LENSES §3.1), so an authored firm-boundary without
    // explicit emphasis IS primary at render time. Explicit "secondary"
    // firm-boundaries render dimly but are intentionally not counted as
    // primary here — they participate in Explore lens filtering and warrant
    // the "scene will render blank" warning if they're the only item.
    if (overlayKind === "firm-boundary") {
      const explicit = rendering && typeof rendering === "object" ? rendering.emphasis : undefined;
      if (explicit === undefined || explicit === "primary") {
        primaryCount += 1;
      }
    }
    if (!rendering || typeof rendering !== "object") continue;
    const lens = rendering.lens;
    if (lens !== undefined) {
      const lensList = Array.isArray(lens) ? lens : [lens];
      for (const entry of lensList) {
        if (typeof entry !== "string" || !CANONICAL_LENSES.has(entry)) {
          errors.push({
            code: "V-LENS-1",
            severity: "error",
            path: `${path}/lens`,
            message: `Unknown lens "${entry}" at ${path}/lens. Must be one of: ${CANONICAL_LENS_IDS.join(", ")}.`,
          });
        } else {
          lensRefs.add(entry);
        }
      }
    }
    if (rendering.emphasis !== undefined) {
      if (!VALID_EMPHASIS.has(rendering.emphasis)) {
        errors.push({
          code: "V-LENS-4",
          severity: "error",
          path: `${path}/emphasis`,
          message: `Invalid rendering.emphasis "${rendering.emphasis}" at ${path}/emphasis. Must be one of: primary, secondary.`,
        });
      } else if (rendering.emphasis === "primary" && overlayKind !== "firm-boundary") {
        // firm-boundary primary is counted above so we don't double-count.
        primaryCount += 1;
      }
    }
  }

  // V-LENS-2: scenes SHOULD have ≥1 primary item. v0.3 scenes are exempt
  // because the adapter back-fills emphasis:primary on every arrowed
  // transfer; firing the warning here would noise-up every legacy scene.
  if (!isV03 && primaryCount === 0) {
    warnings.push({
      code: "V-LENS-2",
      severity: "warning",
      path: "/",
      message: "No items with rendering.emphasis:\"primary\" in scene; scene will render blank by default.",
    });
  }

  // V-LENS-3: lenses listed in scene.lenses must have ≥1 referencing item.
  if (Array.isArray(doc.lenses)) {
    for (let li = 0; li < doc.lenses.length; li += 1) {
      const lens = doc.lenses[li];
      if (typeof lens !== "string") continue;
      if (!lensRefs.has(lens)) {
        warnings.push({
          code: "V-LENS-3",
          severity: "warning",
          path: `/lenses/${li}`,
          message: `Lens "${lens}" declared in scene.lenses but no item references it. Remove from scene.lenses or tag at least one item with rendering.lens:"${lens}".`,
        });
      }
    }
  }

  // V-LENS-5: setEmphasis.byLens values use the same vocabulary as
  // rendering.lens. Schema intentionally leaves byLens as string[] so this
  // validator can emit a step-local authoring diagnostic.
  for (const target of collectWalkthroughSteps(doc)) {
    const setEmphasis = target.step?.setEmphasis;
    if (!setEmphasis || typeof setEmphasis !== "object") continue;
    for (const tier of ["primary", "secondary"]) {
      const byLens = setEmphasis[tier]?.byLens;
      if (!Array.isArray(byLens)) continue;
      for (let li = 0; li < byLens.length; li += 1) {
        const lens = byLens[li];
        if (typeof lens !== "string" || CANONICAL_LENSES.has(lens)) continue;
        const path = `${target.path}/setEmphasis/${tier}/byLens/${li}`;
        errors.push({
          code: "V-LENS-5",
          severity: "error",
          path,
          message: `Unknown setEmphasis.${tier}.byLens value "${lens}" at ${path} (${target.label}). Must be one of: ${CANONICAL_LENS_IDS.join(", ")}.`,
        });
      }
    }
  }

  return { errors, warnings };
}

function collectWalkthroughSteps(doc) {
  const out = [];
  const sceneSteps = doc?.narrative?.steps;
  if (Array.isArray(sceneSteps)) {
    for (let si = 0; si < sceneSteps.length; si += 1) {
      out.push({
        step: sceneSteps[si],
        path: `/narrative/steps/${si}`,
        label: `scene step ${si + 1}`,
      });
    }
  }
  const matrices = Array.isArray(doc?.matrices) ? doc.matrices : [];
  for (let mi = 0; mi < matrices.length; mi += 1) {
    const steps = matrices[mi]?.narrative?.steps;
    if (!Array.isArray(steps)) continue;
    for (let si = 0; si < steps.length; si += 1) {
      out.push({
        step: steps[si],
        path: `/matrices/${mi}/narrative/steps/${si}`,
        label: `matrix ${matrices[mi]?.id ?? mi} step ${si + 1}`,
      });
    }
  }
  return out;
}
