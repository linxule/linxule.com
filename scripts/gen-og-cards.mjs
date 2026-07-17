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
import { readFileSync, existsSync, readdirSync, statSync, mkdirSync, writeFileSync } from "fs";
import path from "path";
import { sectionCard, titleCard, brandCard } from "./lib/og-cards.mjs";
import { fileSlugOf } from "../eleventy/og-card-paths.js";

const WRITING_DIR = "src/writing";
const PORTRAITS_DIR = "src/making/portraits";
const ARTIFACTS_DIR = "src/making/artifacts";
const TALKS_DIR = "src/talks";
const OG_CARDS_DIR = "src/assets/og-cards";
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
  const m = txt.match(/^images:[ \t]*\n[ \t]*-[ \t]*src:[ \t]*(\/assets\/images\/portraits\/\S+\.(?:png|webp|jpe?g))/im);
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

// ── Text cards (resvg) — on-brand cards for pages with no hero image ──────────
// Brand/default + section index cards + per-page auto-title cards (writing without
// a cover, HTML artifacts). Wiring: eleventy/og-card-paths.js + base.njk cascade.

mkdirSync(`${OG_CARDS_DIR}/auto`, { recursive: true });

async function writeTextCard(png, outFile) {
  await sharp(png).jpeg({ quality: 86, mozjpeg: true }).toFile(outFile);
  made++;
  console.log(`[og-cards] wrote ${path.relative("src", outFile)}`);
}
const fm = (txt, key) => {
  const m = txt.match(new RegExp(`^${key}:\\s*(.+?)\\s*$`, "im"));
  return m ? m[1].replace(/^["']|["']$/g, "") : null;
};

// Brand / default card (also the global fallback in base.njk). design.md line 148:
// the old card's "to participants." framing is stale → refreshed to "not as tools."
await writeTextCard(
  brandCard({
    name: "Xule Lin",
    kicker: "LINXULE.COM",
    taglineLines: [
      "What becomes impossible to see when",
      "algorithms enter organizational life —",
      { text: "not as tools.", accent: true },
    ],
  }),
  `${OG_CARDS_DIR}/default.jpg`
);

// Section index cards (cyan DOT accent).
const SECTIONS = {
  making: ["Portraits as poems, artifacts Claude", "made directly, and research tools."],
  writing: ["Essays on human–AI collaboration", "in qualitative research."],
  talks: ["On human–AI collaboration and", "the future of organizing."],
  thinking: ["What becomes impossible to see when", "AI carries implicit theories of organizing."],
  concepts: ["A working vocabulary — naming is", "how you make a noticing portable."],
  teaching: ["Methods, cases, and tools for", "teaching and researching with AI."],
  cv: ["Organization scholar and", "human–AI collaboration researcher."],
};
for (const [key, taglineLines] of Object.entries(SECTIONS)) {
  await writeTextCard(
    sectionCard({ kicker: "XULE LIN", title: key, taglineLines }),
    `${OG_CARDS_DIR}/${key}.jpg`
  );
}

// Auto-title cards: writing posts WITHOUT a cover (ogImage), keyed by fileSlug.
for (const file of readdirSync(WRITING_DIR)) {
  if (!file.endsWith(".md")) continue;
  const txt = readFileSync(path.join(WRITING_DIR, file), "utf8");
  if (fm(txt, "ogImage")) continue; // covered posts get a cover card
  const out = `${OG_CARDS_DIR}/auto/${fileSlugOf(file)}.jpg`;
  if (existsSync(out) && statSync(out).mtimeMs >= statSync(path.join(WRITING_DIR, file)).mtimeMs) { skipped++; continue; }
  const series = fm(txt, "series");
  const kicker = series ? `WRITING · ${series.toUpperCase()}` : "WRITING";
  await writeTextCard(titleCard({ kicker, title: fm(txt, "title") || fileSlugOf(file) }), out);
}

// Auto-title cards: artifacts that aren't a rasterizable SVG (HTML/canvas/video).
for (const file of readdirSync(ARTIFACTS_DIR)) {
  if (!file.endsWith(".md")) continue;
  const txt = readFileSync(path.join(ARTIFACTS_DIR, file), "utf8");
  const src = fm(txt, "src") || "";
  if (src.toLowerCase().endsWith(".svg")) continue; // svgCard pass handles these
  const out = `${OG_CARDS_DIR}/auto/${fileSlugOf(file)}.jpg`;
  if (existsSync(out) && statSync(out).mtimeMs >= statSync(path.join(ARTIFACTS_DIR, file)).mtimeMs) { skipped++; continue; }
  await writeTextCard(titleCard({ kicker: "MAKING · ARTIFACT", title: fm(txt, "title") || fileSlugOf(file) }), out);
}

// Auto-title cards: talks WITHOUT an ogImage override, kicker "TALKS · <year>".
for (const file of readdirSync(TALKS_DIR)) {
  if (!file.endsWith(".md")) continue;
  const txt = readFileSync(path.join(TALKS_DIR, file), "utf8");
  if (fm(txt, "ogImage")) continue; // covered talks get a cover card
  const out = `${OG_CARDS_DIR}/auto/${fileSlugOf(file)}.jpg`;
  if (existsSync(out) && statSync(out).mtimeMs >= statSync(path.join(TALKS_DIR, file)).mtimeMs) { skipped++; continue; }
  const year = (fm(txt, "date") || "").slice(0, 4);
  const kicker = year ? `TALKS · ${year}` : "TALKS";
  await writeTextCard(titleCard({ kicker, title: fm(txt, "title") || fileSlugOf(file) }), out);
}

console.log(`[og-cards] done — ${made} generated, ${skipped} up-to-date.`);
if (problems.length) {
  console.error("[og-cards] PROBLEMS:\n" + problems.map((p) => "  - " + p).join("\n"));
  process.exit(1);
}
