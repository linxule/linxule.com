import path from "node:path";
import { syncImageCache } from "./lib/image-cache.mjs";

const mode = process.argv[2];
const generatedDir = path.resolve(".cache/@11ty/img");
const persistedDir = path.resolve("node_modules/.cache/site-img");

if (mode !== "restore" && mode !== "save") {
  console.error("Usage: bun scripts/sync-image-cache.mjs <restore|save>");
  process.exit(1);
}

const restoring = mode === "restore";
const result = await syncImageCache(
  restoring ? persistedDir : generatedDir,
  restoring ? generatedDir : persistedDir,
  { preserveNewer: restoring },
);

if (result.copied + result.skipped === 0) {
  if (restoring && process.env.VERCEL === "1") {
    console.warn(
      "\n[image-cache] WARNING: Vercel restored an empty responsive-image cache. " +
      "This is a cold image build and may take about 40 minutes.\n",
    );
  } else {
    console.log(`[image-cache] no generated image files to ${mode}`);
  }
} else {
  console.log(
    `[image-cache] ${mode}: ${result.copied} copied, ${result.skipped} unchanged/newer, ${result.ignored} ignored`,
  );
}
