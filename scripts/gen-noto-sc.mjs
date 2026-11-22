#!/usr/bin/env bun
// Regenerates the self-hosted upright Noto Serif SC files from the built site.
// One command after a build: `bun run fonts:noto`. It
//   1. collects, per page and per weight (300/400/500), the upright CJK characters the built pages set in serif
//      faces (scripts/check-cjk-upright.mjs --collect; excludes --font-mono which intentionally uses system sans),
//   2. splits each weight into two slices so essays and Making pages never download the Chinese CV corpus:
//        shared  every upright serif CJK character used at that weight outside /cv-zh/, plus CJK punctuation
//        cv-zh   the remaining upright serif CJK characters used at that weight on /cv-zh/ (omitted if empty)
//   3. fetches NotoSerifSC[wght].ttf (SIL OFL 1.1) once into .cache/fonts/ and verifies its SHA-256,
//   4. instantiates static weights 300, 400 and 500 with fonttools varLib.instancer (cached in .cache/fonts/),
//      subsets each non-empty slice with pyftsubset (uv), names each file by its hash, removes superseded files,
//   5. rewrites the /* noto-serif-sc:begin */ .. /* noto-serif-sc:end */ block in main.css,
//      src/assets/fonts/noto-upright.chars.txt (per-weight union checked by verify) and MANIFEST.tsv.
//
// Load-bearing CSS order in main.css (browsers try a family's matching faces last-declared first):
//   1. Three single-weight `local('xule-no-such-face')` guard faces (300/400/500, broad CJK range) FIRST —
//      so any unlisted upright CJK character skips 'Noto Serif SC' instead of falling into italic Kai.
//   2. Per-weight `cv-zh` faces (exact unicode-range) SECOND.
//   3. Per-weight `shared` faces (exact unicode-range) LAST — tried first on every page outside /cv-zh/.
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync, renameSync } from "node:fs";
import path from "node:path";

const FONTS = process.env.FONTS_DIR || "src/assets/fonts";
const CSS = process.env.FONTS_CSS || "src/assets/css/main.css";
const CACHE = process.env.FONT_CACHE || ".cache/fonts";
const SRC = {
  url: "https://raw.githubusercontent.com/google/fonts/main/ofl/notoserifsc/NotoSerifSC%5Bwght%5D.ttf",
  sha256: "050080d9255a86808f2945bffac582b31ef32bc36411ce29563b4961670c66f9",
  file: "NotoSerifSC-wght.ttf",
};
const WEIGHTS = ["300", "400", "500"];
const PUNCT = "，。、；：？！「」『』《》〈〉（）【】〔〕…～·　";
const BROAD_CJK = "U+2E80-2FFF, U+3000-303F, U+3400-9FFF, U+F900-FAFF, U+FF00-FFEF, U+20000-2FFFF";
const FEATURES = "ccmp,locl,halt,chws,kern";
const UV_ENV = { ...process.env, SOURCE_DATE_EPOCH: "1781654400" };
const UV_ARGS = ["run", "--no-project", "--with", "fonttools==4.68.0", "--with", "brotli==1.2.1"];

const sha = (buf) => createHash("sha256").update(buf).digest("hex");
const sorted = (set) => [...set].sort((a, b) => a.codePointAt(0) - b.codePointAt(0)).join("");

function formatUnicodeRange(chars) {
  const cps = [...new Set([...chars])].map((c) => c.codePointAt(0)).sort((a, b) => a - b);
  const ranges = [];
  for (let i = 0; i < cps.length; ) {
    let j = i;
    while (j + 1 < cps.length && cps[j + 1] === cps[j] + 1) j++;
    const hex = (n) => n.toString(16).toUpperCase().padStart(4, "0");
    ranges.push(i === j ? `U+${hex(cps[i])}` : `U+${hex(cps[i])}-${hex(cps[j])}`);
    i = j + 1;
  }
  return ranges.join(", ");
}

const byPage = JSON.parse(
  execFileSync("bun", [path.join(import.meta.dir, "check-cjk-upright.mjs"), "--collect"], { encoding: "utf8" }),
);

const byWeight = {};
for (const w of WEIGHTS) byWeight[w] = { shared: new Set(PUNCT), all: new Set(PUNCT) };
for (const [p, ws] of Object.entries(byPage)) {
  const isCvZh = p === "/cv-zh/" || p.startsWith("/cv-zh/");
  for (const [w, cs] of Object.entries(ws)) {
    if (!byWeight[w]) continue;
    for (const c of cs) {
      byWeight[w].all.add(c);
      if (!isCvZh) byWeight[w].shared.add(c);
    }
  }
}

mkdirSync(CACHE, { recursive: true });
const varTtf = path.join(CACHE, SRC.file);
if (!existsSync(varTtf)) {
  const res = await fetch(SRC.url);
  if (!res.ok) throw new Error(`download failed: ${res.status} ${SRC.url}`);
  writeFileSync(varTtf, Buffer.from(await res.arrayBuffer()));
}
if (sha(readFileSync(varTtf)) !== SRC.sha256) {
  rmSync(varTtf);
  throw new Error(`${SRC.file}: SHA-256 mismatch, deleted; rerun to download again`);
}

const manifestRows = [];
const report = [];
const cvZhBlocks = [];
const sharedBlocks = [];
const keepFiles = new Set();

for (const w of WEIGHTS) {
  const instTtf = path.join(CACHE, `NotoSerifSC-${SRC.sha256.slice(0, 8)}-w${w}.ttf`);
  if (!existsSync(instTtf)) {
    execFileSync(
      "uv",
      [...UV_ARGS, "fonttools", "varLib.instancer", varTtf, `wght=${w}`, "-o", instTtf],
      { stdio: ["ignore", "ignore", "inherit"], env: UV_ENV },
    );
  }

  const sharedChars = sorted(byWeight[w].shared);
  const cvZhChars = sorted([...byWeight[w].all].filter((c) => !byWeight[w].shared.has(c)));

  for (const [slice, chars] of [["cv-zh", cvZhChars], ["shared", sharedChars]]) {
    if (!chars.length) continue;
    const stem = `noto-serif-sc-roman-${w}-${slice}`;
    const textFile = path.join(CACHE, `${stem}.txt`);
    writeFileSync(textFile, chars);
    const tmp = path.join(CACHE, `${stem}.woff2`);
    const args = [
      instTtf,
      `--output-file=${tmp}`,
      "--flavor=woff2",
      "--no-hinting",
      "--name-IDs=*",
      "--name-languages=*",
      "--notdef-outline",
      "--drop-tables+=DSIG,STAT",
      `--text-file=${textFile}`,
      `--layout-features=${FEATURES}`,
    ];
    execFileSync("uv", [...UV_ARGS, "pyftsubset", ...args], {
      stdio: ["ignore", "ignore", "inherit"],
      env: UV_ENV,
    });
    const bytes = readFileSync(tmp);
    const hash = sha(bytes);
    const name = `${stem}.${hash.slice(0, 8)}.woff2`;
    keepFiles.add(name);
    const dest = path.join(FONTS, name);
    if (!existsSync(dest)) renameSync(tmp, dest);
    else rmSync(tmp);

    const range = formatUnicodeRange(chars);
    const faceBlock = [
      "@font-face {",
      "    font-family: 'Noto Serif SC';",
      "    font-style: normal;",
      `    font-weight: ${w};`,
      "    font-display: swap;",
      `    src: url('/assets/fonts/${name}') format('woff2');`,
      `    unicode-range: ${range};`,
      "}",
    ].join("\n");
    if (slice === "cv-zh") cvZhBlocks.push(faceBlock);
    else sharedBlocks.push(faceBlock);

    manifestRows.push([
      name,
      "Noto Serif SC",
      "normal",
      w,
      "its own characters (see main.css)",
      bytes.length,
      hash,
      `google/fonts main ofl/notoserifsc/NotoSerifSC[wght].ttf sha256 ${SRC.sha256}; ${[...chars].length} characters (w${w} ${slice} slice)`,
      `fonttools varLib.instancer NotoSerifSC[wght].ttf wght=${w} && pyftsubset NotoSerifSC-w${w}.ttf ${args.slice(1).map((a) => a.replace(/=.*[\\/]/, "=")).join(" ")}`,
    ].join("\t"));
    report.push(`w${w}-${slice}: ${name} (${[...chars].length} chars, ${bytes.length} bytes)`);
  }
}

// Remove any superseded noto-serif-sc-roman-*.woff2 files
for (const f of readdirSync(FONTS)) {
  if (/^noto-serif-sc-roman-.*\.woff2$/.test(f) && !keepFiles.has(f)) {
    rmSync(path.join(FONTS, f));
  }
}

const guardBlocks = WEIGHTS.map(
  (w) => `@font-face { font-family: 'Noto Serif SC'; font-style: normal; font-weight: ${w}; src: local('xule-no-such-face'); unicode-range: ${BROAD_CJK}; }`,
);

const generatedBlock = [
  "/* noto-serif-sc:begin */",
  ...guardBlocks,
  ...cvZhBlocks,
  ...sharedBlocks,
  "/* noto-serif-sc:end */",
].join("\n");

const css = readFileSync(CSS, "utf8");
const markerRe = /\/\* noto-serif-sc:begin \*\/[\s\S]*?\/\* noto-serif-sc:end \*\//;
if (!markerRe.test(css)) {
  throw new Error(`${CSS}: missing /* noto-serif-sc:begin */ ... /* noto-serif-sc:end */ markers`);
}
writeFileSync(CSS, css.replace(markerRe, generatedBlock));

const charsLines = [
  "# Characters in the self-hosted noto-serif-sc-roman-* files: every upright CJK character the built site sets in serif faces, per weight, plus CJK punctuation.",
  "# Written by `bun run fonts:noto`; checked by scripts/check-cjk-upright.mjs in verify.",
  ...WEIGHTS.map((w) => `${w}\t${sorted(byWeight[w].all)}`),
];
writeFileSync(path.join(FONTS, "noto-upright.chars.txt"), charsLines.join("\n") + "\n");

const manifest = path.join(FONTS, "MANIFEST.tsv");
if (existsSync(manifest)) {
  const lines = readFileSync(manifest, "utf8").split("\n").filter((l) => l && !l.startsWith("noto-serif-sc-roman-"));
  const at = lines.findIndex((l) => l.startsWith("#"));
  lines.splice(at < 0 ? lines.length : at, 0, ...manifestRows);
  const note = "# Noto Serif SC (upright Chinese serif): google/fonts main ofl/notoserifsc/NotoSerifSC[wght].ttf (Version 2.003-H1), static 300/400/500 instances, unhinted, subset per weight into shared + cv-zh slices; OFL-NotoSerifSC.txt = ofl/notoserifsc/OFL.txt, no Reserved Font Name.";
  if (!lines.some((l) => l.startsWith("# Noto Serif SC"))) lines.push(note);
  writeFileSync(manifest, lines.join("\n") + "\n");
}

console.log(`[fonts:noto] ${report.join("; ")}`);
