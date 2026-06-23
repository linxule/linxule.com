/**
 * gen-og-cards.mjs — generate small social cards for writing covers.
 *
 * Writing cover images live in src/writing/attachments/ and are passthrough-copied
 * raw (they never touch the eleventy-img pipeline). Several are 5–20 MB — far over
 * X/Twitter's ~5 MB and Facebook's ~8 MB scraper limits, so they silently fail as
 * og:image. For every cover referenced by an `ogImage:` frontmatter value, this
 * emits a 1200×630 JPEG card beside it (`<name>-og.jpg`), which the `ogCard` filter
 * (eleventy/filters.js) points og:image at. Idempotent: skips cards already newer
 * than their source. Portraits/gallery images are handled separately by the
 * pipeline's 1200w JPEG derivative — see .claude/rules/og-images.md.
 *
 * Run before eleventy (wired into the `build` + `start` npm scripts).
 */
import sharp from "sharp";
import { readFileSync, existsSync, readdirSync, statSync } from "fs";
import path from "path";

const WRITING_DIR = "src/writing";

function coversFromFrontmatter() {
  const covers = new Set();
  for (const file of readdirSync(WRITING_DIR)) {
    if (!file.endsWith(".md")) continue;
    const txt = readFileSync(path.join(WRITING_DIR, file), "utf8");
    const m = txt.match(/^ogImage:\s*(\/writing\/attachments\/\S+\.(?:png|webp))\s*$/im);
    if (m) covers.add(m[1]);
  }
  return covers;
}

let made = 0;
let skipped = 0;
const problems = [];

for (const url of coversFromFrontmatter()) {
  const srcFile = "src" + url; // src/writing/attachments/<name>.png
  if (!existsSync(srcFile)) {
    problems.push(`source missing: ${srcFile}`);
    continue;
  }
  const dir = path.dirname(srcFile);
  const base = path.basename(srcFile, path.extname(srcFile));
  const outFile = path.join(dir, `${base}-og.jpg`);

  if (existsSync(outFile) && statSync(outFile).mtimeMs >= statSync(srcFile).mtimeMs) {
    skipped++;
    continue;
  }

  try {
    await sharp(srcFile)
      .resize(1200, 630, { fit: "cover", position: "attention" })
      .jpeg({ quality: 82, mozjpeg: true })
      .toFile(outFile);
    made++;
    console.log(`[og-cards] wrote ${path.basename(outFile)}`);
  } catch (e) {
    problems.push(`failed ${srcFile}: ${e.message}`);
  }
}

console.log(`[og-cards] done — ${made} generated, ${skipped} up-to-date.`);
if (problems.length) {
  console.error("[og-cards] PROBLEMS:\n" + problems.map((p) => "  - " + p).join("\n"));
  process.exit(1);
}
