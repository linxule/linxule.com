// Flow architecture — authored only.
// Invariants:
//   I1 — universal referential integrity.
//   I3 — universal signal-position.
//   I7 — forward dominance (warning). Flow expects backward <20% of forward.
//   I8 — central-coordinator role (warning). If a coordinator region is
//        present, the coordinator task should connect to >=half of the
//        non-coordinator tasks.
//
// I7 is OPT-IN: declaring it here is what makes flow the "no backward
// cycles" architecture. The job-shop plugin deliberately omits it (= I9).

export default {
  id: "flow",
  origin: "authored",
  invariants: [
    { check: "I1" },
    { check: "I3" },
    { check: "I7", severity: "warning" },
    { check: "I8", severity: "warning" },
  ],
};
