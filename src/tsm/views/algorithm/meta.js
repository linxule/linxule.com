// Algorithm view — step metadata.
//
// Single source of truth for the 12-step pedagogy's phase, title, and
// caption. Captions are condensed from STORYBOARD-ALGORITHM.md; the
// storyboard owns the canonical voicing.
//
// Phase → step mapping:
//   Phase 1 — Step 1   (intro tiles)
//   Phase 2 — Steps 2-3 (directed arrows, first-order matrix)
//   Phase 3 — Steps 4-5 (transitive closure, visibility matrix)
//   Phase 4 — Steps 6-7 (VFI/VFO, cycle reveal via FLIP reorder)
//   Phase 5 — Steps 8-10 (core, four-square partition, architecture verdict)
//   Phase 6 — Steps 11-12 (final TSM + export, "try your own")

export const TOTAL_STEPS = 12;

export const STEP_META = {
  1: {
    phase: 1,
    title: "Here's a system.",
    caption:
      "We start with a list of components — CLI agents, runtimes, providers, tools, MCPs, plugins, and the like. " +
      "No connections drawn yet. A couple of dozen components is small enough to follow visually, " +
      "but large enough that just looking won't reveal structure.",
  },
  2: {
    phase: 2,
    title: "Direction matters.",
    caption:
      "A dependency has a direction. The CLI calls the harness — but the harness doesn't call back into the CLI. " +
      "Some pairs depend mutually; most don't. " +
      "We can't analyze the system honestly without recording direction.",
  },
  3: {
    phase: 2,
    title: "The first-order matrix.",
    caption:
      "Every component on the diagonal. Each off-diagonal mark is a direct dependency. " +
      "Read a row: 'this thing depends on these things.' Read a column: 'these depend on this thing.' " +
      "Order is arbitrary right now — wherever the capture script put them.",
  },
  4: {
    phase: 3,
    title: "Indirect dependencies are real.",
    caption:
      "If A depends on B and B depends on C, then A is affected by C — even without a direct edge. " +
      "Trace one 2-hop chain, then a 3-hop. The dashed line at the endpoints names the indirect dependency " +
      "the first-order matrix hides.",
  },
  5: {
    phase: 3,
    title: "The visibility matrix captures all of them.",
    caption:
      "Walk every path from each component until you can't anymore. Mark the cell wherever a path lands. " +
      "Direct edges stay as 'x'; the new indirect cells appear as '·'. The visibility matrix is the full " +
      "reach of every component, direct and transitive together.",
  },
  6: {
    phase: 4,
    title: "Counting reach.",
    caption:
      "Two numbers per component. Fan-In counts the components that depend on this one — its reach into the system. " +
      "Fan-Out counts the components it depends on — its surface area to the system. " +
      "High fan-in is a downstream foundation; high fan-out sits atop a long chain.",
  },
  7: {
    phase: 4,
    title: "Equal numbers reveal cycles.",
    caption:
      "Sort components by Fan-In, then Fan-Out. Watch what gathers on the diagonal. " +
      "Two components with identical numbers reach exactly the same parts of the system, and the same parts reach them — " +
      "they have to depend on each other. Equal numbers mean a cyclic group.",
  },
  8: {
    phase: 5,
    title: "The biggest cycle is the Core.",
    caption:
      "The largest cyclic group is the system's Core — a knot of mutual dependency that can't be untied " +
      "without changing several components at once. Everything inside reaches everything else, directly or transitively. " +
      "This is where architectural decisions cost the most: the Core moves together, or not at all.",
  },
  9: {
    phase: 5,
    title: "Four roles around the Core.",
    caption:
      "Every component takes one of four roles. Shared components are the foundations the Core leans on. " +
      "The Core itself is the mutual-dependency knot. Control components depend on the Core to function — they're users of the architecture. " +
      "Periphery components are unrelated to the Core, separate concerns the system happens to also do. " +
      "A companion scatter plots each component's Fan-In against its Fan-Out.",
  },
  10: {
    phase: 5,
    title: "The architecture verdict.",
    caption:
      "Core-periphery means a single dominant knot most of the system orbits — change the Core and everything shifts. " +
      "Multi-core means several knots; architectural risk is distributed. " +
      "Hierarchical means no Core at all — every dependency flows one way, and the system can be decomposed cleanly. " +
      "Core size is the best single measure of how a system was decomposed — and decomposition is where technical structure meets organization. " +
      "A system's dependencies tend to mirror the team that built it, so a monolithic Core is one no single team can change alone. " +
      "When the Core has to change, established organizations struggle even when they see it coming — the architectural-innovation trap.",
  },
  11: {
    phase: 6,
    title: "A proper TSM.",
    caption:
      "The chaotic dependency dump from Step 3 is now one or more Task Structure Matrices. The algorithm didn't draw the structure — " +
      "the structure was always there. Reordering by Fan-In and Fan-Out, then cutting along the cyclic Core, made it legible. " +
      "Region bands label each partition; transfers settle into forward and backward marks, with contracts drawn between matrices when the observation includes them. " +
      "Export the derived scene to save, share, or embed it as a standalone tsm-scene.",
  },
  12: {
    phase: 6,
    title: "Try your own.",
    caption:
      "Now the algorithm runs on something you bring. Drop a dependency-observation JSON to remount the view on your system — " +
      "an agent harness, a codebase, a factory, any directed dependency graph. " +
      "You leave with a tool, not just a viewing experience.",
  },
};
