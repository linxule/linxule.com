import { constants } from "node:fs";
import { copyFile, mkdir, readFile, readdir, stat, unlink, utimes } from "node:fs/promises";
import path from "node:path";

const DEFAULT_CONCURRENCY = 16;
const OPTIMIZED_URL_PATTERN = /\/assets\/images\/optimized\/([^\s"'<>()?#]+)/g;
const SCANNABLE_EXTENSIONS = new Set([".html", ".md", ".json", ".xml", ".css", ".js", ".txt"]);
const FICLONE_FALLBACK_CODES = new Set(["EXDEV", "ENOTSUP", "EOPNOTSUPP", "EINVAL", "EPERM"]);

async function copyFileClone(sourceFile, destinationFile) {
  try {
    await copyFile(sourceFile, destinationFile, constants.COPYFILE_FICLONE);
  } catch (error) {
    if (!FICLONE_FALLBACK_CODES.has(error?.code)) throw error;
    await copyFile(sourceFile, destinationFile);
  }
}

async function runBounded(items, concurrency, worker) {
  const limit = Math.max(1, Math.min(concurrency, items.length || 1));
  let next = 0;
  await Promise.all(
    Array.from({ length: limit }, async () => {
      while (next < items.length) {
        const index = next++;
        await worker(items[index]);
      }
    }),
  );
}

/**
 * Sync generated images without rewriting unchanged files or following symlinks.
 *
 * @param {string} source
 * @param {string} destination
 * @param {{ preserveNewer?: boolean, allowlist?: Iterable<string> | null, concurrency?: number }} [options]
 */
export async function syncImageCache(
  source,
  destination,
  { preserveNewer = false, allowlist = null, concurrency = DEFAULT_CONCURRENCY } = {},
) {
  const result = { copied: 0, skipped: 0, ignored: 0, missing: false };
  const allowed = allowlist ? new Set(allowlist) : null;
  const tasks = [];

  async function collect(from, to, relDir = "") {
    let entries;
    try {
      entries = await readdir(from, { withFileTypes: true });
    } catch (error) {
      if (error.code !== "ENOENT" || from !== source) throw error;
      result.missing = true;
      return;
    }

    let createdDir = false;
    for (const entry of entries) {
      const sourceFile = path.join(from, entry.name);
      const destinationFile = path.join(to, entry.name);
      const relPath = relDir ? `${relDir}/${entry.name}` : entry.name;

      if (entry.isDirectory()) {
        await collect(sourceFile, destinationFile, relPath);
        continue;
      }

      // Eleventy Image does not generate space-named files. Finder's "keep
      // both" merge duplicates once added gigabytes to the deployed payload.
      if (!entry.isFile() || entry.name.includes(" ")) {
        result.ignored++;
        continue;
      }

      if (allowed && !allowed.has(entry.name) && !allowed.has(relPath)) {
        result.ignored++;
        continue;
      }

      if (!createdDir) {
        await mkdir(to, { recursive: true });
        createdDir = true;
      }
      tasks.push({ sourceFile, destinationFile });
    }
  }

  await collect(source, destination);

  await runBounded(tasks, concurrency, async ({ sourceFile, destinationFile }) => {
    const sourceStat = await stat(sourceFile);
    let destinationStat;
    try {
      destinationStat = await stat(destinationFile);
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }

    if (
      destinationStat &&
      ((preserveNewer && destinationStat.mtimeMs > sourceStat.mtimeMs) ||
        (destinationStat.size === sourceStat.size && destinationStat.mtimeMs >= sourceStat.mtimeMs))
    ) {
      result.skipped++;
      return;
    }

    await copyFileClone(sourceFile, destinationFile);
    // Date objects truncate sub-millisecond precision and make unchanged
    // images look newer on every build. Pass fractional seconds instead.
    await utimes(destinationFile, sourceStat.atimeMs / 1000, sourceStat.mtimeMs / 1000);
    result.copied++;
  });

  return result;
}

/**
 * Scan built `_site` outputs (excluding `_site/tsm/`) for every referenced
 * `/assets/images/optimized/<filename>`.
 */
export async function collectReferencedOptimizedImages(siteDir = "_site") {
  const root = path.resolve(siteDir);
  const referenced = new Set();

  async function walk(dir) {
    let entries;
    try {
      entries = await readdir(dir, { withFileTypes: true });
    } catch (error) {
      if (error.code === "ENOENT" && dir === root) {
        throw new Error(
          `[image-cache] built output directory "${siteDir}" is missing; run \`bun run build:site\` first`,
        );
      }
      throw error;
    }

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const rel = path.relative(root, fullPath).split(path.sep).join("/");
      if (entry.isDirectory()) {
        if (rel === "tsm" || rel === "assets/images/optimized" || rel === "pagefind") continue;
        await walk(fullPath);
        continue;
      }
      if (!entry.isFile()) continue;
      if (!SCANNABLE_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) continue;

      const text = await readFile(fullPath, "utf8");
      for (const match of text.matchAll(OPTIMIZED_URL_PATTERN)) {
        const raw = match[1].replace(/[.,;]+$/, "");
        if (raw) {
          try {
            referenced.add(decodeURIComponent(raw));
          } catch {
            referenced.add(raw);
          }
        }
      }
    }
  }

  await walk(root);
  return referenced;
}

/**
 * Prune unreferenced files from one or more image cache directories against built `_site`.
 */
export async function pruneImageCache(cacheDirs, siteDir = "_site", { concurrency = DEFAULT_CONCURRENCY } = {}) {
  const referenced = await collectReferencedOptimizedImages(siteDir);
  if (referenced.size === 0) {
    throw new Error(
      `[image-cache] refusing to prune: found 0 references to /assets/images/optimized/ in "${siteDir}" — run \`bun run build:site\` first`,
    );
  }

  const result = {
    referenced: referenced.size,
    removed: 0,
    kept: 0,
    freedBytes: 0,
  };

  for (const dir of cacheDirs) {
    let entries;
    try {
      entries = await readdir(dir, { withFileTypes: true });
    } catch (error) {
      if (error.code === "ENOENT") continue;
      throw error;
    }

    const toDelete = [];
    for (const entry of entries) {
      if (!entry.isFile()) continue;
      if (referenced.has(entry.name)) {
        result.kept++;
      } else {
        toDelete.push(path.join(dir, entry.name));
      }
    }

    await runBounded(toDelete, concurrency, async (filePath) => {
      const fileStat = await stat(filePath);
      await unlink(filePath);
      result.removed++;
      result.freedBytes += fileStat.size;
    });
  }

  return result;
}
