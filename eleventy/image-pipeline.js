import { execFileSync } from "node:child_process";
import { existsSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Image from "@11ty/eleventy-img";
import sharp from "sharp";
import { decodeHTMLAttribute, escapeAttribute } from "entities";

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export const IMAGE_CACHE_DIR = ".cache/@11ty/img/";
export const IMAGE_URL_PATH = "/assets/images/optimized/";
export const WRITING_ATTACHMENTS_DIR = "src/writing/attachments";
export const WRITING_WIDTHS = [400, 800, 1200];
// Matches @11ty/eleventy-img's default minimumThreshold (src/global-options.js)
// so predicted widths agree 1:1 with the responsive files eleventy-img emits.
export const WRITING_WIDTH_MINIMUM_THRESHOLD = 1.25;

// Gallery images: AVIF/WebP for every browser since 2023, JPEG only as the
// <picture> fallback. The 2000w step is the lightbox view; the original file
// stays in place as the download (wallpaper) target and is never re-emitted.
export const GALLERY_WIDTHS = [400, 800, 1200, 2000];
export const GALLERY_FORMATS = ["avif", "webp", "jpeg"];

// Active optimized filenames emitted during the current Eleventy build.
// Passed as an allowlist to syncImageCache in `eleventy.after` so retired
// cache orphans (e.g. legacy 2912w/2944w files) are never copied to `_site`.
const activeOptimizedFiles = new Set();

export function resetActiveOptimizedFiles() {
  activeOptimizedFiles.clear();
}

export function recordOptimizedFilename(filename) {
  if (typeof filename === "string" && filename.trim()) {
    activeOptimizedFiles.add(path.basename(filename.trim()));
  }
}

export function recordOptimizedMetadata(metadata) {
  if (!metadata || typeof metadata !== "object") return;
  for (const variants of Object.values(metadata)) {
    if (!Array.isArray(variants)) continue;
    for (const variant of variants) {
      if (variant?.filename) recordOptimizedFilename(variant.filename);
      else if (variant?.outputPath) recordOptimizedFilename(variant.outputPath);
      else if (variant?.url) recordOptimizedFilename(variant.url);
    }
  }
}

export function getActiveOptimizedFiles() {
  return new Set(activeOptimizedFiles);
}

// Cached index of `attachments-<stem>-<w>w.<jpeg|png>` files per cache directory.
const attachmentIndexCache = new Map();

// Primary source-derived index: Map<resolvedAttachmentsDir, Map<filename, { width, ext, file }>>
// Populated asynchronously in `eleventy.before` via `preindexWritingAttachments`,
// with lazy single-file inspection if called cold outside a build (e.g. unit tests).
const sourceAttachmentIndex = new Map();

const ATTACHMENT_FILE_RE = /^([^/]+)\.(png|jpe?g|webp|avif|gif)$/i;

export function resetSourceAttachmentIndex() {
  sourceAttachmentIndex.clear();
  attachmentIndexCache.clear();
}

export function selectOptimizedWritingWidth(intrinsicWidth, widths = WRITING_WIDTHS) {
  if (!Number.isFinite(intrinsicWidth) || intrinsicWidth <= 0) {
    return Math.max(...widths);
  }
  const valid = Image.getWidths(
    Math.round(intrinsicWidth),
    widths,
    false,
    WRITING_WIDTH_MINIMUM_THRESHOLD,
  );
  if (!valid.length) return Math.min(Math.round(intrinsicWidth), Math.max(...widths));
  return valid[valid.length - 1];
}

function buildAttachmentRecord(stem, intrinsicWidth, losslessPng) {
  const width = selectOptimizedWritingWidth(intrinsicWidth);
  const ext = losslessPng ? "png" : "jpeg";
  return { width, ext, file: `attachments-${stem}-${width}w.${ext}` };
}

export async function inspectWritingAttachment(filePath) {
  const basename = path.basename(filePath);
  const match = basename.match(ATTACHMENT_FILE_RE);
  if (!match) return null;
  const [, stem, ext] = match;
  if (stem.endsWith("-og") && /^jpe?g$/i.test(ext)) return null;

  const meta = await sharp(filePath).metadata();
  let losslessPng = false;
  if (ext.toLowerCase() === "png" && meta.hasAlpha) {
    const stats = await sharp(filePath).stats();
    losslessPng = !stats.isOpaque;
  }
  return buildAttachmentRecord(stem, meta.width, losslessPng);
}

const SYNC_PROBE_SCRIPT = `
import sharp from "sharp";
const [filePath, isPng] = process.argv.slice(1);
const meta = await sharp(filePath).metadata();
let lossless = false;
if (isPng === "1" && meta.hasAlpha) {
  const stats = await sharp(filePath).stats();
  lossless = !stats.isOpaque;
}
process.stdout.write(JSON.stringify({ width: meta.width, lossless }));
`;

function inspectWritingAttachmentSync(filePath, stem, ext) {
  const isPng = ext.toLowerCase() === "png" ? "1" : "0";
  const stdout = execFileSync(
    process.execPath,
    ["-e", SYNC_PROBE_SCRIPT, path.resolve(filePath), isPng],
    { cwd: REPO_ROOT, encoding: "utf8" },
  );
  const { width, lossless } = JSON.parse(stdout);
  return buildAttachmentRecord(stem, width, Boolean(lossless));
}

export async function preindexWritingAttachments(attachmentsDir = WRITING_ATTACHMENTS_DIR) {
  const resolvedDir = path.resolve(attachmentsDir);
  const index = new Map();
  sourceAttachmentIndex.set(resolvedDir, index);
  if (!existsSync(resolvedDir)) return index;

  const entries = readdirSync(resolvedDir).filter((name) => {
    const m = name.match(ATTACHMENT_FILE_RE);
    return m && !(m[1].endsWith("-og") && /^jpe?g$/i.test(m[2]));
  });

  await Promise.all(
    entries.map(async (name) => {
      try {
        const record = await inspectWritingAttachment(path.join(resolvedDir, name));
        if (record) index.set(name, record);
      } catch {
        // Let the writing transform surface unreadable source images loudly.
      }
    }),
  );

  return index;
}

function lookupSourceAttachment(filename, stem, ext, attachmentsDir) {
  if (!attachmentsDir) return null;
  const resolvedDir = path.resolve(attachmentsDir);
  let index = sourceAttachmentIndex.get(resolvedDir);
  if (index?.has(filename)) {
    return index.get(filename).file;
  }
  const sourcePath = path.join(resolvedDir, filename);
  if (!existsSync(sourcePath)) return null;

  try {
    const record = inspectWritingAttachmentSync(sourcePath, stem, ext);
    if (!index) {
      index = new Map();
      sourceAttachmentIndex.set(resolvedDir, index);
    }
    index.set(filename, record);
    return record.file;
  } catch {
    return null;
  }
}

function scanAttachmentDir(dir) {
  const index = new Map();
  if (!existsSync(dir)) return index;
  for (const name of readdirSync(dir)) {
    const match = name.match(/^attachments-(.+)-(\d+)w\.(jpeg|png)$/i);
    if (!match) continue;
    const stem = match[1];
    const width = Number(match[2]);
    const ext = match[3].toLowerCase();
    if (width > 1200) continue;
    const existing = index.get(stem);
    if (
      !existing ||
      width > existing.width ||
      (width === existing.width && ext === "jpeg" && existing.ext !== "jpeg")
    ) {
      index.set(stem, { width, ext, file: name });
    }
  }
  return index;
}

function lookupCachedAttachment(stem, cacheDirs) {
  for (const dir of cacheDirs) {
    let index = attachmentIndexCache.get(dir);
    if (!index) {
      index = scanAttachmentDir(dir);
      attachmentIndexCache.set(dir, index);
    }
    const hit = index.get(stem);
    if (hit) return hit.file;
  }
  // One refresh pass in case the cache was populated mid-build.
  for (const dir of cacheDirs) {
    const index = scanAttachmentDir(dir);
    attachmentIndexCache.set(dir, index);
    const hit = index.get(stem);
    if (hit) return hit.file;
  }
  return null;
}

/**
 * Resolve `/writing/attachments/<name>.<ext>` (excluding `*-og.jpg`) to its
 * deterministic optimized `/assets/images/optimized/attachments-<stem>-<w>w.<jpeg|png>`
 * URL. Primary authority is the source attachment under `./src/writing/attachments/`
 * (intrinsic width via eleventy-img's width rules + PNG alpha inspection), falling
 * back to cache scan only when the source file is absent on disk.
 */
export function resolveOptimizedAttachmentUrl(
  src,
  {
    cacheDirs = [IMAGE_CACHE_DIR, "node_modules/.cache/site-img"],
    attachmentsDir = WRITING_ATTACHMENTS_DIR,
  } = {},
) {
  if (!src || typeof src !== "string") return null;
  const pathname = src.split(/[?#]/, 1)[0];
  const match = pathname.match(/^\/writing\/attachments\/([^/]+)\.(png|jpe?g|webp|avif|gif)$/i);
  if (!match) return null;
  const [, stem, ext] = match;
  if (stem.endsWith("-og") && /^jpe?g$/i.test(ext)) return null;

  const sourceFile = lookupSourceAttachment(`${stem}.${ext}`, stem, ext, attachmentsDir);
  const chosenFile = sourceFile || lookupCachedAttachment(stem, cacheDirs) || `attachments-${stem}-1200w.jpeg`;
  recordOptimizedFilename(chosenFile);
  return `${IMAGE_URL_PATH}${chosenFile}`;
}

// Keep existing URLs: both image entry points share these cache files, and
// deployed assets have immutable caching. Source edits need a new source name.
export function imageOptions(widths, formats) {
  return {
    widths,
    formats,
    outputDir: `./${IMAGE_CACHE_DIR}`,
    urlPath: IMAGE_URL_PATH,
    cacheOptions: { directory: "./node_modules/.cache/eleventy-img-fetch/" },
    filenameFormat(id, src, width, format) {
      const parentDir = path.basename(path.dirname(src));
      const name = path.basename(src, path.extname(src));
      return `${parentDir}-${name}-${width ? `${width}w` : "original"}.${format}`;
    },
  };
}

// Largest WebP the gallery pipeline produced for a source: what a lightbox
// should display instead of the multi-megabyte original.
export async function galleryViewUrl(src, processImage = Image) {
  if (!src || typeof src !== "string") return src;
  if (/\.(?:html?|svg|gif)(?:[?#].*)?$/i.test(src) || /^https?:\/\//i.test(src)) return src;
  const inputPath = src.startsWith("/") ? `./src${src}` : src;
  const metadata = await processImage(inputPath, imageOptions(GALLERY_WIDTHS, GALLERY_FORMATS));
  recordOptimizedMetadata(metadata);
  const variants = metadata.webp || metadata.jpeg || Object.values(metadata)[0] || [];
  return variants.length ? variants[variants.length - 1].url : src;
}

// eleventy-img escapes alt itself, but interpolates other attribute values.
// Accept decoded values here so all callers escape each attribute exactly once.
export function imageHTML(metadata, attributes) {
  const escaped = Object.fromEntries(Object.entries(attributes).map(([key, value]) => [
    key, key === "alt" ? value : escapeAttribute(String(value)),
  ]));
  return Image.generateHTML(metadata, escaped);
}

export function originalImageHTML(src, alt) {
  return `<img src="${escapeAttribute(String(src))}" alt="${escapeAttribute(String(alt || ""))}" loading="lazy">`;
}

// Read an img start tag without reserializing its surrounding document. Support
// both quote styles, unquoted attributes, and '>' inside quoted values.
export function imageAttributes(tag) {
  const attributes = Object.create(null);
  const attributePattern = /([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
  for (const match of tag.replace(/^<img\s+/i, "").replace(/\/?\s*>$/, "").matchAll(attributePattern)) {
    const name = match[1].toLowerCase();
    // HTML keeps the first occurrence of a duplicate attribute.
    if (!(name in attributes)) attributes[name] = decodeHTMLAttribute(match[2] ?? match[3] ?? match[4] ?? "");
  }
  return attributes;
}
