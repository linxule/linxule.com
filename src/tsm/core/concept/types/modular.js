// Modular architecture — authored only.
// Invariants mirror INVARIANT_TABLE.modular in core/invariants.js:
// I4 error (information hiding), I5/I6 warnings.

export default {
  id: "modular",
  origin: "authored",
  invariants: [
    { check: "I1" },
    { check: "I3" },
    { check: "I4", severity: "error" },
    { check: "I5", severity: "warning" },
    { check: "I6", severity: "warning" },
  ],
};
