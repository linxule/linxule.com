/**
 * gen-og-cards.mjs — generate small 1200×630 social cards (cropped, JPEG, 1.91:1).
 *
 * og:image / twitter:image must be a small, scraper-safe card — never a raw
 * multi-MB source (X fails >5 MB, FB >8 MB) and ideally 1.91:1 so platforms
 * don't crop/letterbox. This generates a card for every hero the `ogCard` filter
 * (eleventy/filters.js) points at:
 *   - Writing covers: every /writing/attachments/<name>.png|webp referenced by an
 *     `ogImage:` value → <name>-og.jpg.
 *   - Portrait galleries: the first image of each portrait → <dir>/og.jpg.
 *   - SVG artifacts: rasterized onto the site's paper → <name>-og.jpg.
 * Idempotent (skips cards newer than their source). Runs before eleventy (wired
 * into the `build` + `start` npm scripts); cards are committed and passthrough-copied.
 * Full mechanism: .claude/rules/og-images.md.
 */
import sharp from "sharp";
import { readFileSync, existsSync, readdirSync, statSync } from "fs";
import path from "path";

const WRITING_DIR = "src/writing";
const PORTRAITS_DIR = "src/making/portraits";
const ARTIFACTS_DIR = "src/making/artifacts";
const PAPER = "#f4f1eb"; // site paper background (matches /assets/og-image.png)

let made = 0;
let skipped = 0;
const problems = [];

async function card(srcFile, outFile) {
  if (!existsSync(srcFile)) {
    problems.push(`source missing: ${srcFile}`);
    return;
  }
  if (existsSync(outFile) && statSync(outFile).mtimeMs >= statSync(srcFile).mtimeMs) {
    skipped++;
    return;
  }
  try {
    await sharp(srcFile)
      .resize(1200, 630, { fit: "cover", position: "attention" })
      .jpeg({ quality: 82, mozjpeg: true })
      .toFile(outFile);
    made++;
    console.log(`[og-cards] wrote ${path.relative("src", outFile)}`);
  } catch (e) {
    problems.push(`failed ${srcFile}: ${e.message}`);
  }
}

// Vector artwork (e.g. SVG artifacts): scrapers can't render SVG, so rasterize
// the whole drawing centered on the site's paper (contain, not crop).
async function svgCard(srcFile, outFile) {
  if (!existsSync(srcFile)) {
    problems.push(`source missing: ${srcFile}`);
    return;
  }
  if (existsSync(outFile) && statSync(outFile).mtimeMs >= statSync(srcFile).mtimeMs) {
    skipped++;
    return;
  }
  try {
    const art = await sharp(srcFile, { density: 200 })
      .resize(520, 520, { fit: "contain", background: PAPER })
      .flatten({ background: PAPER })
      .toBuffer();
    await sharp({ create: { width: 1200, height: 630, channels: 3, background: PAPER } })
      .composite([{ input: art, gravity: "center" }])
      .jpeg({ quality: 88, mozjpeg: true })
      .toFile(outFile);
    made++;
    console.log(`[og-cards] wrote ${path.relative("src", outFile)}`);
  } catch (e) {
    problems.push(`failed ${srcFile}: ${e.message}`);
  }
}

// Writing covers → <name>-og.jpg beside the cover.
for (const file of readdirSync(WRITING_DIR)) {
  if (!file.endsWith(".md")) continue;
  const txt = readFileSync(path.join(WRITING_DIR, file), "utf8");
  const m = txt.match(/^ogImage:\s*(\/writing\/attachments\/\S+\.(?:png|webp))\s*$/im);
  if (!m) continue;
  const srcFile = "src" + m[1];
  const dir = path.dirname(srcFile);
  const base = path.basename(srcFile, path.extname(srcFile));
  await card(srcFile, path.join(dir, `${base}-og.jpg`));
}

// Portrait galleries → <dir>/og.jpg from the first gallery image.
for (const file of readdirSync(PORTRAITS_DIR)) {
  if (!file.endsWith(".md")) continue;
  const txt = readFileSync(path.join(PORTRAITS_DIR, file), "utf8");
  const m = txt.match(/^images:[ \t]*\n[ \t]*-[ \t]*src:[ \t]*(\/assets\/images\/portraits\/\S+\.(?:png|webp))/im);
  if (!m) continue;
  const srcFile = "src" + m[1];
  await card(srcFile, path.join(path.dirname(srcFile), "og.jpg"));
}

// SVG artifacts → <name>-og.jpg (rasterized on paper).
for (const file of readdirSync(ARTIFACTS_DIR)) {
  if (!file.endsWith(".md")) continue;
  const txt = readFileSync(path.join(ARTIFACTS_DIR, file), "utf8");
  const m = txt.match(/^src:[ \t]*(\/assets\/images\/artifacts\/\S+\.svg)\s*$/im);
  if (!m) continue;
  const srcFile = "src" + m[1];
  const base = path.basename(srcFile, ".svg");
  await svgCard(srcFile, path.join(path.dirname(srcFile), `${base}-og.jpg`));
}

console.log(`[og-cards] done — ${made} generated, ${skipped} up-to-date.`);
if (problems.length) {
  console.error("[og-cards] PROBLEMS:\n" + problems.map((p) => "  - " + p).join("\n"));
  process.exit(1);
}
