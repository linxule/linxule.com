import { mkdirSync, realpathSync, rmSync } from "node:fs";

// `_site` is a symlink to `_site.nosync` so iCloud Drive never syncs build
// output (every rebuild inside ~/Documents otherwise leaves "name 2.ext"
// conflict copies). `rm -rf _site` would delete the link and the next build
// would recreate a synced directory, so empty the real target instead.
const target = (() => {
  try { return realpathSync("_site"); } catch { return "_site"; }
})();
rmSync(target, { recursive: true, force: true });
mkdirSync(target, { recursive: true });
