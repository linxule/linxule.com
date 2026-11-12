#!/usr/bin/env bun
// Regenerates the Kai files (LXGW WenKai as the italic of the Chinese family) from the built site.
// One command after a build: `bun run fonts:kai`. It
//   1. collects, per page, the CJK characters the built pages set in italic (scripts/check-cjk-italic.mjs --collect),
//   2. splits them into two slices, so an essay that italicises a name does not download the Making set:
//        shared  every italic CJK character used on a page outside /making/, plus CJK punctuation
//        making  the rest (used only on /making/ pages)
//   3. fetches LXGW WenKai v1.530 once into .cache/fonts/ and checks its SHA-256,
//   4. subsets each slice with pyftsubset (uv), names each file by its hash, removes the old files,
//   5. rewrites main.css (both urls, and the shared face's unicode-range, which must be that file's exact characters),
//      kai-italic.chars.txt (the union, which verify checks against) and the two MANIFEST rows.
// Commit the new .woff2 files, the chars file, main.css and MANIFEST.tsv together; `verify` then passes again.
//
// Load-bearing order in main.css: the making face (broad CJK range) is declared BEFORE the shared face (exact range).
// Browsers try the faces of a family last-declared first, so a page whose italic hanzi are all in the shared file
// fetches only that file (proved in Chromium, WebKit and Firefox).
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync, renameSync } from "node:fs";
import path from "node:path";

const FONTS = process.env.FONTS_DIR || "src/assets/fonts";
const CSS = process.env.FONTS_CSS || "src/assets/css/main.css";
const CACHE = process.env.FONT_CACHE || ".cache/fonts";
const SRC = { url: "https://github.com/lxgw/LxgwWenKai/releases/download/v1.530/LXGWWenKai-Regular.ttf",
  sha256: "2d73eea94ad808999d90c0000c239a84a33b09d4bc6ab6c5b8bbf1eda8a7fc8b", file: "LXGWWenKai-Regular-v1.530.ttf" };
const PUNCT = "，。、；：？！「」『』《》〈〉（）【】〔〕…～·　";
const FEATURES = "ccmp,locl,halt,chws";
const sha = (buf) => createHash("sha256").update(buf).digest("hex");
const sorted = (set) => [...set].sort((a, b) => a.codePointAt(0) - b.codePointAt(0)).join("");

const byPage = JSON.parse(execFileSync("bun", [path.join(import.meta.dir, "check-cjk-italic.mjs"), "--collect"], { encoding: "utf8" }));
const shared = new Set(PUNCT), all = new Set(PUNCT);
for (const [p, cs] of Object.entries(byPage)) for (const c of cs) { all.add(c); if (!p.startsWith("/making/")) shared.add(c); }
const slices = { shared: sorted(shared), making: sorted([...all].filter((c) => !shared.has(c))) };

mkdirSync(CACHE, { recursive: true });
const ttf = path.join(CACHE, SRC.file);
if (!existsSync(ttf)) {
  const res = await fetch(SRC.url);
  if (!res.ok) throw new Error(`download failed: ${res.status} ${SRC.url}`);
  writeFileSync(ttf, Buffer.from(await res.arrayBuffer()));
}
if (sha(readFileSync(ttf)) !== SRC.sha256) { rmSync(ttf); throw new Error(`${SRC.file}: SHA-256 mismatch, deleted; rerun to download again`); }

let css = readFileSync(CSS, "utf8");
const manifestRows = []; const report = [];
for (const [slice, chars] of Object.entries(slices)) {
  const stem = `lxgw-wenkai-italic-${slice}`;
  const textFile = path.join(CACHE, `${stem}.txt`); writeFileSync(textFile, chars);
  const tmp = path.join(CACHE, `${stem}.woff2`);
  const args = [ttf, `--output-file=${tmp}`, "--flavor=woff2", "--no-hinting", "--name-IDs=*", "--name-languages=*", "--notdef-outline",
    "--drop-tables+=DSIG,STAT", `--text-file=${textFile}`, `--layout-features=${FEATURES}`];
  execFileSync("uv", ["run", "--no-project", "--with", "fonttools==4.68.0", "--with", "brotli==1.2.1", "pyftsubset", ...args],
    { stdio: ["ignore", "ignore", "inherit"], env: { ...process.env, SOURCE_DATE_EPOCH: "1781654400" } });
  const bytes = readFileSync(tmp); const hash = sha(bytes); const name = `${stem}.${hash.slice(0, 8)}.woff2`;
  const re = new RegExp(`^${stem}\\.[0-9a-f]{8}\\.woff2$`);
  const old = readdirSync(FONTS).filter((f) => re.test(f));
  if (!(old.length === 1 && old[0] === name)) { renameSync(tmp, path.join(FONTS, name)); for (const f of old) if (f !== name) rmSync(path.join(FONTS, f)); }
  else rmSync(tmp);
  const urlRe = new RegExp(`${stem}\\.[0-9a-f]{8}\\.woff2`, "g");
  if (!urlRe.test(css)) throw new Error(`${CSS}: no ${stem}.<hash>.woff2 reference to update`);
  css = css.replace(urlRe, name);
  if (slice === "shared") {
    const range = [...chars].map((c) => "U+" + c.codePointAt(0).toString(16).toUpperCase()).join(", ");
    const block = new RegExp(`(@font-face\\s*\\{[^}]*${stem}\\.[0-9a-f]{8}\\.woff2[^}]*unicode-range:\\s*)[^;]+;`);
    if (!block.test(css)) throw new Error(`${CSS}: the ${stem} @font-face has no unicode-range to rewrite`);
    css = css.replace(block, `$1${range};`);
  }
  manifestRows.push([name, "Noto Serif SC (italic face)", "italic", "300 500", slice === "shared" ? "its own characters (see main.css)" : "U+2E80-2FFF, U+3000-303F, U+3400-9FFF, U+F900-FAFF, U+FF00-FFEF, U+20000-2FFFF",
    bytes.length, hash, `github.com/lxgw/LxgwWenKai release v1.530, LXGWWenKai-Regular.ttf sha256 ${SRC.sha256}; ${[...chars].length} characters (${slice} slice)`,
    `pyftsubset LXGWWenKai-Regular.ttf ${args.slice(1).map((a) => a.replace(/=.*[\\/]/, "=")).join(" ")}`].join("\t"));
  report.push(`${slice}: ${old[0] || "(none)"} -> ${name}, ${[...chars].length} characters, ${bytes.length} bytes`);
}
writeFileSync(CSS, css);
writeFileSync(path.join(FONTS, "kai-italic.chars.txt"),
  `# Characters in the two lxgw-wenkai-italic-* files: every CJK character the built site sets in italic, plus CJK punctuation.\n# Written by \`bun run fonts:kai\`; checked by scripts/check-cjk-italic.mjs in verify.\n${sorted(all)}\n`);
const manifest = path.join(FONTS, "MANIFEST.tsv");
if (existsSync(manifest)) {
  const lines = readFileSync(manifest, "utf8").split("\n").filter((l) => l && !l.startsWith("lxgw-wenkai-italic-"));
  const at = lines.findIndex((l) => l.startsWith("#")); lines.splice(at < 0 ? lines.length : at, 0, ...manifestRows);
  writeFileSync(manifest, lines.join("\n") + "\n");
}
console.log(`[fonts:kai] ${report.join("; ")}`);
