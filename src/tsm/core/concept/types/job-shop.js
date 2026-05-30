// Job-shop architecture — authored only.
// Invariants:
//   I1 — universal referential integrity.
//   I3 — universal signal-position.
//   I8 — central-coordinator role (warning). Job-shops typically have a
//        coordinator that routes work; if declared, it should connect to
//        >=half of the non-coordinator stations.
//
// I9 is implemented as opt-out: we deliberately do NOT declare I7 here.
// Job-shops are cyclic by design — backward transfers are expected, not
// warnings. See CORPUS.md §I9 and flow-family.js.

export default {
  id: "job-shop",
  origin: "authored",
  invariants: [
    { check: "I1" },
    { check: "I3" },
    { check: "I8", severity: "warning" },
  ],
};
