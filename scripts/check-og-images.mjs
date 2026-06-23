/**
 * check-og-images.mjs — build-time lint: no oversized / unsupported social cards.
 *
 * Scans every built _site/**\/*.html for its <meta property="og:image"> URL,
 * resolves it to the local file, and FAILS the build if any resolved card is
 * larger than MAX_BYTES or not a scraper-safe format. This is the regression
 * guard for the og:image mechanism (see .claude/rules/og-images.md) — it makes a
 * raw multi-MB source leaking back into og:image impossible to ship silently.
 *
 * Runs after eleventy (wired into the `build` npm script, before pagefind).
 */
import { readFileSync, statSync, existsSync } from "fs";
import { execSync } from "child_process";
import path from "path";

const SITE = "_site";
const MAX_BYTES = 1024 * 1024; // 1 MB — cards should be ~30–300 KB; raw sources are MBs
const OK_EXT = new Set([".png", ".jpg", ".jpeg", ".svg"]); // formats scrapers render

const files = execSync(`find ${SITE} -name '*.html'`, { maxBuffer: 64 * 1024 * 1024 })
  .toString()
  .trim()
  .split("\n")
  .filter(Boolean);

const re = /<meta property="og:image" content="([^"]+)"/g;
const seen = new Map(); // url -> example page that referenced it

for (const f of files) {
  const html = readFileSync(f, "utf8");
  let m;
  while ((m = re.exec(html))) {
    if (!seen.has(m[1])) seen.set(m[1], f);
  }
}

const problems = [];
for (const [url, page] of seen) {
  const rel = url.replace(/^https?:\/\/[^/]+/, "");
  if (!rel.startsWith("/")) continue; // external host — skip
  const file = path.join(SITE, rel);
  const ext = path.extname(file).toLowerCase();
  if (!OK_EXT.has(ext)) {
    problems.push(`unsupported format (${ext || "none"}): ${url}  [e.g. ${page}]`);
    continue;
  }
  if (!existsSync(file)) {
    problems.push(`missing file: ${url}  [e.g. ${page}]`);
    continue;
  }
  const size = statSync(file).size;
  if (size > MAX_BYTES) {
    problems.push(`too big (${(size / 1048576).toFixed(2)} MB > 1 MB): ${url}  [e.g. ${page}]`);
  }
}

if (problems.length) {
  console.error(
    `[og-lint] FAILED — ${problems.length} bad og:image(s):\n` +
      problems.map((p) => "  - " + p).join("\n") +
      `\nFix: ensure the page's hero resolves through the ogCard filter / gen-og-cards. See .claude/rules/og-images.md`
  );
  process.exit(1);
}

console.log(`[og-lint] OK — ${seen.size} unique og:image(s), all ≤ 1 MB and a supported format.`);
