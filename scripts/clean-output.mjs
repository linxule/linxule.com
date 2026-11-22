import { execFileSync } from "node:child_process";
import { mkdirSync, readdirSync, realpathSync, rmSync } from "node:fs";
import path from "node:path";

// `_site` is a symlink to `_site.nosync` so iCloud Drive never syncs build
// output (every rebuild inside ~/Documents otherwise leaves "name 2.ext"
// conflict copies). Empty children inside the real target instead of deleting
// the directory itself so `com.apple.fileprovider.ignore#P` survives every clean.
const target = (() => {
  try {
    return realpathSync("_site");
  } catch {
    return "_site";
  }
})();

mkdirSync(target, { recursive: true });
for (const entry of readdirSync(target)) {
  rmSync(path.join(target, entry), { recursive: true, force: true });
}

if (process.platform === "darwin") {
  const XATTR_KEY = "com.apple.fileprovider.ignore#P";
  try {
    execFileSync("/usr/bin/xattr", ["-p", XATTR_KEY, target], { stdio: "ignore" });
  } catch {
    try {
      execFileSync("/usr/bin/xattr", ["-w", XATTR_KEY, "1", target], { stdio: "ignore" });
    } catch (error) {
      console.warn(`[clean-output] could not set ${XATTR_KEY} on ${target}: ${error.message}`);
    }
  }
}
