/** Validate built social cards, including the dimensions of their actual files. */
import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { decodeHTMLAttribute } from "entities";
import sharp from "sharp";

const MAX_BYTES = 1024 * 1024;
const CARD_WIDTH = 1200;
const CARD_HEIGHT = 630;
const OK_EXT = new Set([".png", ".jpg", ".jpeg"]);

function htmlFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(dir, entry.name);
    return entry.isDirectory() ? htmlFiles(file) : file.endsWith(".html") ? [file] : [];
  });
}

// Meta attributes may be reordered, capitalized, single-quoted, or unquoted.
// Ignore examples in comments and script/style bodies, and keep > inside quotes.
function metadataFrom(html) {
  const markup = html.replace(/<!--[\s\S]*?-->|<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, "");
  const metadata = new Map();
  for (const match of markup.matchAll(/<meta\b(?:[^"'<>]|"[^"]*"|'[^']*')*>/gi)) {
    const attributes = new Map();
    for (const attribute of match[0].matchAll(/\s([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g)) {
      const name = attribute[1].toLowerCase();
      if (!attributes.has(name)) {
        attributes.set(name, decodeHTMLAttribute(attribute[2] ?? attribute[3] ?? attribute[4] ?? ""));
      }
    }
    const key = (attributes.get("property") || attributes.get("name") || "").toLowerCase();
    if (!key || !attributes.has("content")) continue;
    const values = metadata.get(key) || [];
    values.push(attributes.get("content"));
    metadata.set(key, values);
  }
  return metadata;
}

/**
 * @param {string} siteRoot Built output directory.
 * @param {{siteUrl?: string}} options Origin whose absolute image URLs are local.
 * @returns {Promise<{issues: string[], uniqueCount: number, checkedCount: number, externalCount: number}>}
 */
export async function checkOgImages(siteRoot, { siteUrl = "https://linxule.com" } = {}) {
  const root = path.resolve(siteRoot);
  const site = new URL(siteUrl);
  const issues = [];
  const seen = new Set();
  const external = new Set();
  const decoded = new Map();
  const report = (message, url, page) => issues.push(`${message}: ${url}  [${path.relative(root, page)}]`);

  for (const page of htmlFiles(root)) {
    const metadata = metadataFrom(readFileSync(page, "utf8"));
    const first = (name) => metadata.get(name)?.[0]?.trim() || "";
    for (const url of metadata.get("og:image") || []) {
      seen.add(url);
      let imageUrl;
      try {
        imageUrl = new URL(url, site);
      } catch {
        report("invalid image URL", url, page);
        continue;
      }
      if (!url.trim() || !["http:", "https:"].includes(imageUrl.protocol)) {
        report("unsupported image URL", url, page);
        continue;
      }

      const width = first("og:image:width");
      const height = first("og:image:height");
      if (width !== String(CARD_WIDTH) || height !== String(CARD_HEIGHT)) {
        report(`advertised dimensions must be ${CARD_WIDTH}x${CARD_HEIGHT} (got ${width || "missing"}x${height || "missing"})`, url, page);
      }
      const ogAlt = first("og:image:alt");
      const twitterAlt = first("twitter:image:alt");
      if (!ogAlt || !twitterAlt) {
        report("missing og:image:alt or twitter:image:alt", url, page);
      } else if (ogAlt !== twitterAlt) {
        report("og:image:alt and twitter:image:alt differ", url, page);
      }
      const twitterImage = first("twitter:image");
      try {
        if (!twitterImage || new URL(twitterImage, site).href !== imageUrl.href) {
          report("twitter:image is missing or differs from og:image", url, page);
        }
      } catch {
        report("invalid twitter:image URL", url, page);
      }

      // A true remote image cannot be inspected from the local output. Do not
      // strip its host and accidentally validate an unrelated local file.
      if (imageUrl.host !== site.host) {
        external.add(imageUrl.href);
        continue;
      }
      let file;
      try {
        file = path.resolve(root, `.${decodeURIComponent(imageUrl.pathname)}`);
      } catch {
        report("invalid URL path encoding", url, page);
        continue;
      }
      if (!file.startsWith(`${root}${path.sep}`)) {
        report("image path leaves the output directory", url, page);
        continue;
      }
      const ext = path.extname(file).toLowerCase();
      if (!OK_EXT.has(ext)) {
        report(`unsupported format (${ext || "none"})`, url, page);
        continue;
      }

      if (!decoded.has(file)) {
        // Decode each shared card once, while checking metadata on every page.
        try {
          const size = statSync(file).size;
          const image = await sharp(file).metadata();
          decoded.set(file, { size, image });
        } catch (error) {
          decoded.set(file, { error: error.code === "ENOENT" ? "missing file" : `cannot decode image (${error.message})` });
        }
      }
      const card = decoded.get(file);
      if (card.error) {
        report(card.error, url, page);
        continue;
      }
      if (card.size > MAX_BYTES) {
        report(`too big (${(card.size / MAX_BYTES).toFixed(2)} MB > 1 MB)`, url, page);
      }
      if (!["jpeg", "png"].includes(card.image.format)) {
        report(`unsupported decoded format (${card.image.format})`, url, page);
      } else if (card.image.format !== (ext === ".png" ? "png" : "jpeg")) {
        report(`file extension does not match decoded format (${card.image.format})`, url, page);
      }
      const actual = card.image.autoOrient || card.image;
      if (actual.width !== CARD_WIDTH || actual.height !== CARD_HEIGHT) {
        report(`decoded dimensions must be ${CARD_WIDTH}x${CARD_HEIGHT} (got ${actual.width}x${actual.height})`, url, page);
      }
      if (actual.width !== Number(width) || actual.height !== Number(height)) {
        report(`decoded dimensions ${actual.width}x${actual.height} do not match advertised ${width || "missing"}x${height || "missing"}`, url, page);
      }
    }
  }
  return { issues, uniqueCount: seen.size, checkedCount: decoded.size, externalCount: external.size };
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const { issues, uniqueCount, checkedCount, externalCount } = await checkOgImages("_site");
  if (issues.length) {
    console.error(
      `[og-lint] FAILED — ${issues.length} social-card problem(s):\n` +
      issues.map((issue) => `  - ${issue}`).join("\n") +
      "\nFix: ensure each hero resolves through ogCard / gen-og-cards. See .claude/rules/og-images.md",
    );
    process.exitCode = 1;
  } else {
    console.log(
      `[og-lint] OK — ${uniqueCount} unique og:image(s), ${checkedCount} local cards decoded at 1200x630, all ≤ 1 MB; ` +
      `${externalCount} external image(s) skipped.`,
    );
  }
}
