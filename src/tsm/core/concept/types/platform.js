// Platform architecture — authored only.
// Invariants:
//   I1   — universal referential integrity.
//   I3   — universal signal-position.
//   I10  — platform requires at least one design-rules region. Always
//          fires as error regardless of severity (the check function
//          ignores its severity argument).
//   I4   — information hiding (no cross-module transfers). Error in
//          platform: modules MUST be sealed.
//   I5   — design rules dispatch only (warning). Soft heuristic.
//   I6   — integration receives but does not send back (warning).
//   I11  — module thin crossing (warning). Each module should expose a
//          simple interface to integration — Fig 8's single-arrow per
//          module is canonical; > 3 transfers from one module to
//          integration suggests leaky information hiding.
//
// I10 row omits severity because the I10 check function hardcodes "error"
// and ignores any declaration to the contrary.

export default {
  id: "platform",
  origin: "authored",
  invariants: [
    { check: "I1" },
    { check: "I3" },
    { check: "I10" },
    { check: "I4", severity: "error" },
    { check: "I5", severity: "warning" },
    { check: "I6", severity: "warning" },
    { check: "I11", severity: "warning" },
  ],
};
