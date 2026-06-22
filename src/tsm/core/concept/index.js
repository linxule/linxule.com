// Bootstraps the architecture-type registry. Importing this module
// registers all 9 architectureType plugins, the four-square strategy, and
// the invariant check functions (I1, I3, I4, I5, I6, I7, I8, I10, I11,
// I14, I15, I16). Consumers (synthesis/derive.js, core/invariants.js)
// should import this for the side effect before calling registry lookups.
//
// I9 is implemented as an opt-out: the job-shop plugin simply does not
// declare I7, so backward transfers in job-shop don't trigger the flow
// forward-dominance warning. No check function is registered.
//
// I14-I16 are derived-family (Hidden Structure output) invariants —
// declared by core-periphery / multi-core / hierarchical plugins.

import {
  registerArchitectureType,
  registerStrategy,
  registerCheck,
} from "./registry.js";
import fourSquare from "./strategies/four-square.js";
import multiCoreFourSquare from "./strategies/multi-core-four-square.js";

import integral from "./types/integral.js";
import protoModular from "./types/proto-modular.js";
import modular from "./types/modular.js";
import flow from "./types/flow.js";
import jobShop from "./types/job-shop.js";
import platform from "./types/platform.js";
import corePeriphery from "./types/core-periphery.js";
import multiCore from "./types/multi-core.js";
import hierarchical from "./types/hierarchical.js";

import { I1, I3 } from "./invariants/shared.js";
import { I4, I5, I6, I10 } from "./invariants/modular-family.js";
import { I7, I8, I11 } from "./invariants/flow-family.js";
import { I14, I15, I16 } from "./invariants/derived-family.js";

registerStrategy(fourSquare);
registerStrategy(multiCoreFourSquare);

for (const plugin of [
  integral,
  protoModular,
  modular,
  flow,
  jobShop,
  platform,
  corePeriphery,
  multiCore,
  hierarchical,
]) {
  registerArchitectureType(plugin);
}

registerCheck("I1", I1);
registerCheck("I3", I3);
registerCheck("I4", I4);
registerCheck("I5", I5);
registerCheck("I6", I6);
registerCheck("I7", I7);
registerCheck("I8", I8);
registerCheck("I10", I10);
registerCheck("I11", I11);
registerCheck("I14", I14);
registerCheck("I15", I15);
registerCheck("I16", I16);
