// Architecture-type + partition-strategy registry.
//
// Phase 2 of the modularity refactor. Each architectureType is a plugin
// object; each partition strategy is a strategy object. Both are registered
// at import time via core/concept/index.js (side-effect bootstrap).
//
// Plugin shape — see reviews/2026-05-25-claude-modularity.md ("Architecture-
// type plugin shape" section) and the worked examples in core/concept/types/.
// Strategy shape — see core/concept/strategies/four-square.js.
//
// Phase 3 completes the migration: each plugin's `invariants` list is the
// dispatch source of truth, and the check functions live in
// core/concept/invariants/* — registered into CHECKS at bootstrap.

const TYPES = new Map();
const STRATEGIES = new Map();
const CHECKS = new Map();

export function registerArchitectureType(plugin) {
  if (!plugin?.id) throw new Error("registerArchitectureType: plugin.id required");
  if (TYPES.has(plugin.id)) throw new Error(`Duplicate architecture type: ${plugin.id}`);
  TYPES.set(plugin.id, plugin);
}

export function getArchitectureType(id) {
  return TYPES.get(id) ?? null;
}

export function listArchitectureTypes() {
  return [...TYPES.values()];
}

export function registerStrategy(strategy) {
  if (!strategy?.id) throw new Error("registerStrategy: strategy.id required");
  if (STRATEGIES.has(strategy.id)) throw new Error(`Duplicate strategy: ${strategy.id}`);
  STRATEGIES.set(strategy.id, strategy);
}

export function getStrategy(id) {
  return STRATEGIES.get(id) ?? null;
}

export function registerCheck(id, fn) {
  if (!id) throw new Error("registerCheck: id required");
  if (typeof fn !== "function") throw new Error("registerCheck: fn must be a function");
  if (CHECKS.has(id)) throw new Error(`Duplicate check: ${id}`);
  CHECKS.set(id, fn);
}

export function getCheck(id) {
  return CHECKS.get(id) ?? null;
}

// Test-only escape hatch. Used by tests/unit/registry.test.js to reset state
// between tests. Not part of the public surface — do not call from production
// code.
export function _resetRegistryForTest() {
  TYPES.clear();
  STRATEGIES.clear();
  CHECKS.clear();
}
