// Public surface preserved for test files and import sites.
// Internal layering lives under engine/ and synthesis/.
// See reviews/2026-05-25-modularity-synthesis.md (Phase 1).

export { N_CAP, computeVisibilityMatrix } from "./engine/visibility.js";
export { computeVFIVFO } from "./engine/vfi-vfo.js";
export { findCyclicGroups } from "./engine/cyclic-groups.js";
export {
  deriveSceneFromObservation,
  partitionFourSquare,
  classifyArchitecture,
} from "./synthesis/derive.js";
