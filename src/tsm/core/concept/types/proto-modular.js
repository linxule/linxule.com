// Proto-modular architecture — authored only.
// Invariants mirror INVARIANT_TABLE["proto-modular"] in core/invariants.js:
// I4 fires as a warning (cross-module transfers are tolerated, not allowed).

export default {
  id: "proto-modular",
  origin: "authored",
  invariants: [
    { check: "I1" },
    { check: "I3" },
    { check: "I4", severity: "warning" },
  ],
};
