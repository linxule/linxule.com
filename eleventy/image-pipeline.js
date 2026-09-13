import path from "node:path";
import Image from "@11ty/eleventy-img";
import { decodeHTMLAttribute, escapeAttribute } from "entities";

export const IMAGE_CACHE_DIR = ".cache/@11ty/img/";
export const IMAGE_URL_PATH = "/assets/images/optimized/";

// Gallery images: AVIF/WebP for every browser since 2023, JPEG only as the
// <picture> fallback. The 2000w step is the lightbox view; the original file
// stays in place as the download (wallpaper) target and is never re-emitted.
export const GALLERY_WIDTHS = [400, 800, 1200, 2000];
export const GALLERY_FORMATS = ["avif", "webp", "jpeg"];

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
  const inputPath = src.startsWith("/") ? `./src${src}` : src;
  const metadata = await processImage(inputPath, imageOptions(GALLERY_WIDTHS, GALLERY_FORMATS));
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
