import { cp, mkdir, readdir, stat } from "node:fs/promises";
import path from "node:path";

const mode = process.argv[2];
const generatedDir = path.resolve(".cache/@11ty/img");
const persistedDir = path.resolve("node_modules/.cache/site-img");

if (mode !== "restore" && mode !== "save") {
  console.error("Usage: bun scripts/sync-image-cache.mjs <restore|save>");
  process.exit(1);
}

async function countFiles(directory) {
  let entries;
  try {
    entries = await readdir(directory, { withFileTypes: true });
  } catch (error) {
    if (error?.code === "ENOENT") return 0;
    throw error;
  }

  let count = 0;
  for (const entry of entries) {
    if (entry.isDirectory()) {
      count += await countFiles(path.join(directory, entry.name));
    } else if (entry.isFile()) {
      count += 1;
    }
  }
  return count;
}

async function copyCache(source, destination) {
  await mkdir(destination, { recursive: true });
  await cp(source, destination, {
    recursive: true,
    force: true,
    preserveTimestamps: true,
  });
}

if (mode === "restore") {
  const persistedCount = await countFiles(persistedDir);
  if (persistedCount === 0) {
    if (process.env.VERCEL === "1") {
      console.warn(
        "\n[image-cache] WARNING: Vercel restored an empty responsive-image cache. " +
        "This is a cold image build and may take about 40 minutes.\n",
      );
    } else {
      console.log("[image-cache] no persisted responsive-image cache to restore");
    }
    process.exit(0);
  }

  await copyCache(persistedDir, generatedDir);
  console.log(`[image-cache] restored ${persistedCount} generated image files`);
  process.exit(0);
}

const generatedCount = await countFiles(generatedDir);
if (generatedCount === 0) {
  console.warn("[image-cache] no generated image files found to persist");
  process.exit(0);
}

await copyCache(generatedDir, persistedDir);

const persistedStats = await stat(persistedDir);
if (!persistedStats.isDirectory()) {
  throw new Error(`${persistedDir} is not a directory`);
}

console.log(`[image-cache] persisted ${generatedCount} generated image files`);
