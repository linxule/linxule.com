// Invariant dispatch. Plugins declare their invariant set inline
// (core/concept/types/*.js). Check functions are registered in
// core/concept/index.js via core/concept/invariants/. This module
// reads the plugin's list, resolves each {check, severity?} reference,
// and runs the check function.
//
// Reference: CORPUS.md Part 2. Each check produces issues with severity
// "error" or "warning"; runInvariants() lifts them into the returned
// {errors, warnings} buckets by their severity field.
//
// I1  — diagonal placement (universal)
// I2  — direction-from-position (enforced by core/scene-adapter.js; nothing to validate)
// I3  — signal-position invariant (universal)
// I4  — information hiding (modular / proto-modular / platform)
// I5  — design rules dispatch only (modular / platform)
// I6  — integration receives but does not send back (modular / platform)
// I10 — platform requires design rules
// I7, I8, I11 — flow / coordinator / module-to-integration heuristics (Unit 5/6 scope)

import "./concept/index.js";
import { getArchitectureType, getCheck } from "./concept/registry.js";

/**
 * Run all relevant invariants for a tsm-scene document.
 *
 * @param {object} document — a parsed tsm-scene (kind === "tsm-scene")
 * @returns {{ errors: Array, warnings: Array }}
 */
export function runInvariants(document) {
  const errors = [];
  const warnings = [];

  if (document.kind !== "tsm-scene") {
    return { errors, warnings };
  }

  for (const matrix of document.matrices ?? []) {
    const plugin = getArchitectureType(matrix.architectureType);
    if (!plugin) {
      errors.push({
        code: "unknown_architecture_type",
        severity: "error",
        message: `Unknown architectureType: "${matrix.architectureType}" (matrix "${matrix.id}")`,
      });
      continue;
    }
    for (const ref of plugin.invariants ?? []) {
      const fn = getCheck(ref.check);
      if (!fn) {
        errors.push({
          code: "unknown_check",
          severity: "error",
          message: `Plugin "${plugin.id}" references unknown check "${ref.check}"`,
        });
        continue;
      }
      // Universal checks (I1, I3, I10) take (matrix, _, document); severity-
      // bearing checks (I4, I5, I6, I7, I8, I11, I14, I15, I16) take
      // (matrix, severity, document). The third argument is the scene root
      // (`document`), so checks that need scene-level artifacts (e.g.,
      // I14/I15 cross-checking engine provenance) can opt in. Checks that
      // ignore it are unaffected — JavaScript silently drops extra args.
      const results =
        ref.severity !== undefined
          ? fn(matrix, ref.severity, document)
          : fn(matrix, undefined, document);
      for (const issue of results) {
        const tagged = { ...issue, matrixId: matrix.id };
        if (issue.severity === "warning") warnings.push(tagged);
        else errors.push(tagged);
      }
    }
  }

  return { errors, warnings };
}
