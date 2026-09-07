/** Generate small 1200×630 social cards before Eleventy, using its YAML parser. */
import sharp from "sharp";
import { load } from "js-yaml";
import { readFileSync, existsSync, readdirSync, statSync, mkdirSync } from "node:fs";
import path from "node:path";
import { sectionCard, titleCard, brandCard } from "./lib/og-cards.mjs";
import {
  fileSlugOf, DEFAULT_CARD, BRAND_CARD, SECTION_CARDS, SERIES_CARDS,
  sectionCardPath, seriesCardPath, resolveSocialCard, titleCardOptions,
} from "../eleventy/og-card-paths.js";

const PAPER = "#f4f1eb";
let made = 0;
let skipped = 0;
const problems = [];

function current(out, source) {
  return existsSync(out) && (!source || statSync(out).mtimeMs >= statSync(source).mtimeMs);
}
async function imageCard(srcFile, outFile, mode) {
  if (!existsSync(srcFile)) { problems.push(`source missing: ${srcFile}`); return; }
  if (current(outFile, srcFile)) { skipped++; return; }
  mkdirSync(path.dirname(outFile), { recursive: true });
  try {
    let pipeline;
    if (mode === "vector") {
      // Keep the existing contained SVG composition and its stable URL.
      const art = await sharp(srcFile, { density: 200 })
        .resize(520, 520, { fit: "contain", background: PAPER })
        .flatten({ background: PAPER }).toBuffer();
      pipeline = sharp({ create: { width: 1200, height: 630, channels: 3, background: PAPER } })
        .composite([{ input: art, gravity: "center" }]);
    } else {
      // Raster artworks can carry titles at the edge; preserve the whole work.
      pipeline = sharp(srcFile).rotate().resize(1200, 630, mode === "artwork"
        ? { fit: "contain", background: PAPER }
        : { fit: "cover", position: "attention" }).flatten({ background: PAPER });
    }
    await pipeline.jpeg({ quality: mode === "vector" ? 88 : 82, mozjpeg: true }).toFile(outFile);
    made++;
    console.log(`[og-cards] wrote ${path.relative("src", outFile)}`);
  } catch (error) { problems.push(`failed ${srcFile}: ${error.message}`); }
}
async function writeTextCard(render, outFile, source) {
  if (current(outFile, source)) { skipped++; return; }
  mkdirSync(path.dirname(outFile), { recursive: true });
  await sharp(render()).jpeg({ quality: 86, mozjpeg: true }).toFile(outFile);
  made++;
  console.log(`[og-cards] wrote ${path.relative("src", outFile)}`);
}
function readData(file) {
  const text = readFileSync(file, "utf8");
  const frontmatter = text.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)?.[1];
  // Talks inherit their layout from talks/talks.json rather than each file.
  const directoryData = path.join(path.dirname(file), `${path.basename(path.dirname(file))}.json`);
  const inherited = existsSync(directoryData) ? JSON.parse(readFileSync(directoryData, "utf8")) : {};
  return { ...inherited, ...(frontmatter ? load(frontmatter) : {}) };
}
const inputs = ["src/writing", "src/making/portraits", "src/making/artifacts", "src/talks"]
  .flatMap((dir) => readdirSync(dir).filter((f) => f.endsWith(".md")).map((f) => path.join(dir, f)));
for (const dir of readdirSync("src/papers", { withFileTypes: true })) {
  if (dir.isDirectory() && existsSync(`src/papers/${dir.name}/index.md`)) inputs.push(`src/papers/${dir.name}/index.md`);
}

for (const file of inputs) {
  const data = readData(file);
  const fileSlug = fileSlugOf(path.basename(file));
  const url = data.layout === "layouts/paper.njk" ? `/papers/${path.basename(path.dirname(file))}/` : "";
  data.page = { fileSlug, url };
  const resolved = resolveSocialCard(data);
  const out = `src${resolved.src}`;
  if (resolved.src.startsWith("/assets/og-cards/auto/")) {
    await writeTextCard(() => titleCard(titleCardOptions(data)), out, file);
    continue;
  }
  const hero = data.ogImage || data.images?.[0]?.src || data.src;
  if (!hero?.startsWith("/") || resolved.src === hero) continue;
  const mode = hero.endsWith(".svg") ? "vector" : hero.startsWith("/assets/images/artifacts/") ? "artwork" : "cover";
  await imageCard(`src${hero}`, out, mode);
}

// An undated project note uses an explicit card and the same authored metadata.
const vellumSource = "src/builds/vellum.md";
const vellum = readData(vellumSource);
await writeTextCard(() => titleCard({
  title: vellum.title, subtitle: vellum.subtitle, kicker: "BUILDS · PUBLIC EXPERIMENT",
}), `src${vellum.ogImage}`, vellumSource);

await writeTextCard(() => brandCard(BRAND_CARD), `src${DEFAULT_CARD}`);
for (const [section, taglineLines] of Object.entries(SECTION_CARDS)) {
  await writeTextCard(() => sectionCard({ kicker: "XULE LIN", title: section, taglineLines }), `src${sectionCardPath(section)}`);
}
for (const [slug, [title, subtitle]] of Object.entries(SERIES_CARDS)) {
  await writeTextCard(() => titleCard({ kicker: "WRITING · SERIES", title, subtitle }), `src${seriesCardPath(slug)}`);
}

console.log(`[og-cards] done — ${made} generated, ${skipped} up-to-date.`);
if (problems.length) console.error("[og-cards] PROBLEMS:\n" + problems.map((p) => `  - ${p}`).join("\n"));
// Sharp/Resvg native handles can outlive completed writes in a cache-cold CI run.
process.exit(problems.length ? 1 : 0);
