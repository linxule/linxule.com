#!/usr/bin/env bun
// Keeps the self-hosted faces, main.css and the preload links in step (verify; no browser, no build needed).
//   F1  every url() in a main.css @font-face names a file in src/assets/fonts
//   F2  every .woff2 in src/assets/fonts is used by an @font-face (no stale file shipped to every deploy)
//   F3  every <link rel="preload" as="font"> in a template names a url an @font-face uses, and carries crossorigin
//       (a preload the faces never request is a wasted download; one without crossorigin is fetched twice)
//   F4  every file in src/assets/fonts has a MANIFEST.tsv row, and each row's sha256 matches the file
//   F5  every .woff2 is named <stem>.<first 8 hex of its sha256>.woff2 and the hash is right: a file swapped in
//       under an old name (an unfrozen EB Garamond, say) changes its hash and fails here, as well as in F4
//   F6  the Kai `shared` face is declared after the `making` face: browsers try a family's faces last-declared first,
//       so the other order sends a page that italicises one name to the 177 kB making file (kai-slice-proof.mjs)
import { createHash } from "node:crypto";
import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import path from "node:path";

const FONTS = process.env.FONTS_DIR || "src/assets/fonts";
const CSS = process.env.FONTS_CSS || "src/assets/css/main.css";
const TEMPLATES = (process.env.FONT_TEMPLATES || "src/_includes/layouts/base.njk").split(",");
const problems = [];
const css = readFileSync(CSS, "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
const used = new Set();
for (const m of css.matchAll(/@font-face\s*\{[^}]*\}/g)) for (const u of m[0].matchAll(/url\(\s*['"]?\/assets\/fonts\/([^'")]+)['"]?\s*\)/g)) used.add(u[1]);
for (const f of used) if (!existsSync(path.join(FONTS, f))) problems.push(`F1 ${CSS}: @font-face url /assets/fonts/${f} has no file in ${FONTS}`);
const files = readdirSync(FONTS).filter((f) => f.endsWith(".woff2"));
for (const f of files) if (!used.has(f)) problems.push(`F2 ${FONTS}/${f} is not used by any @font-face in ${CSS}; delete it`);
for (const t of TEMPLATES) {
  const html = readFileSync(t, "utf8");
  for (const m of html.matchAll(/<link\b[^>]*\brel=["']preload["'][^>]*>/gi)) {
    if (!/\bas=["']font["']/i.test(m[0])) continue;
    const href = (m[0].match(/\bhref=["']\/assets\/fonts\/([^"']+)["']/) || [])[1];
    if (!href || !used.has(href)) problems.push(`F3 ${t}: font preload ${href || m[0]} is not a url any @font-face uses`);
    if (!/\bcrossorigin\b/i.test(m[0])) problems.push(`F3 ${t}: font preload ${href} lacks crossorigin (the font would be fetched twice)`);
  }
}
const kaiAt = (slice) => css.search(new RegExp(`@font-face\\s*\\{[^}]*lxgw-wenkai-italic-${slice}\\.`));
if (kaiAt("shared") >= 0 && kaiAt("making") >= 0 && kaiAt("shared") < kaiAt("making"))
  problems.push(`F6 ${CSS}: the lxgw-wenkai-italic-shared @font-face must come after the -making one (last declared is tried first)`);
const manifest = path.join(FONTS, "MANIFEST.tsv");
const rows = existsSync(manifest) ? new Map(readFileSync(manifest, "utf8").split("\n").filter((l) => l && !l.startsWith("#") && !l.startsWith("file\t")).map((l) => { const c = l.split("\t"); return [c[0], c[6]]; })) : new Map();
for (const f of files) {
  const sha = createHash("sha256").update(readFileSync(path.join(FONTS, f))).digest("hex");
  const named = (f.match(/\.([0-9a-f]{8})\.woff2$/) || [])[1];
  if (!named) problems.push(`F5 ${FONTS}/${f}: name lacks the .<8 hex>.woff2 content hash`);
  else if (named !== sha.slice(0, 8)) problems.push(`F5 ${FONTS}/${f}: named ${named} but its sha256 starts ${sha.slice(0, 8)}; rename it (and its url in ${CSS}) or restore the file`);
  if (!rows.has(f)) { problems.push(`F4 ${manifest}: no row for ${f}`); continue; }
  if (rows.get(f) !== sha) problems.push(`F4 ${manifest}: sha256 for ${f} does not match the file`);
}
if (problems.length) { console.error(`[fonts] ${problems.length} problem(s):\n  ${problems.join("\n  ")}`); process.exit(1); }
console.log(`[fonts] OK: ${files.length} files, named by their hash, all used by main.css, all in MANIFEST.tsv; preloads match; Kai slices in order`);
