import { copyFile, mkdir, readdir, stat, utimes } from "node:fs/promises";
import path from "node:path";

/** Sync generated images without rewriting unchanged files or following symlinks. */
export async function syncImageCache(source, destination, { preserveNewer = false } = {}) {
  const result = { copied: 0, skipped: 0, ignored: 0, missing: false };

  async function copyDirectory(from, to) {
    let entries;
    try {
      entries = await readdir(from, { withFileTypes: true });
    } catch (error) {
      if (error.code !== "ENOENT" || from !== source) throw error;
      result.missing = true;
      return;
    }

    await mkdir(to, { recursive: true });
    for (const entry of entries) {
      const sourceFile = path.join(from, entry.name);
      const destinationFile = path.join(to, entry.name);
      if (entry.isDirectory()) {
        await copyDirectory(sourceFile, destinationFile);
        continue;
      }
      // Eleventy Image does not generate space-named files. Finder's "keep
      // both" merge duplicates once added gigabytes to the deployed payload.
      if (!entry.isFile() || entry.name.includes(" ")) {
        result.ignored++;
        continue;
      }

      const sourceStat = await stat(sourceFile);
      let destinationStat;
      try {
        destinationStat = await stat(destinationFile);
      } catch (error) {
        if (error.code !== "ENOENT") throw error;
      }

      if (destinationStat && (
        (preserveNewer && destinationStat.mtimeMs > sourceStat.mtimeMs) ||
        (destinationStat.size === sourceStat.size && destinationStat.mtimeMs >= sourceStat.mtimeMs)
      )) {
        result.skipped++;
        continue;
      }

      await copyFile(sourceFile, destinationFile);
      // Date objects truncate sub-millisecond precision and make unchanged
      // images look newer on every build. Pass fractional seconds instead.
      await utimes(destinationFile, sourceStat.atimeMs / 1000, sourceStat.mtimeMs / 1000);
      result.copied++;
    }
  }

  await copyDirectory(source, destination);
  return result;
}
