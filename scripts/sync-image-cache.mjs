import path from "node:path";
import { pruneImageCache, syncImageCache } from "./lib/image-cache.mjs";

const mode = process.argv[2];
const generatedDir = path.resolve(".cache/@11ty/img");
const persistedDir = path.resolve("node_modules/.cache/site-img");
const siteDir = path.resolve(process.argv[3] || "_site");

if (mode === "prune" || mode === "--prune") {
  const result = await pruneImageCache([generatedDir, persistedDir], siteDir);
  const mb = (result.freedBytes / (1024 * 1024)).toFixed(2);
  console.log(
    `[image-cache] prune: ${result.removed} orphan(s) removed (${mb} MB freed), ${result.kept} kept across caches (${result.referenced} unique references in ${path.relative(process.cwd(), siteDir) || "_site"})`,
  );
  process.exit(0);
}

if (mode !== "restore" && mode !== "save") {
  console.error("Usage: bun scripts/sync-image-cache.mjs <restore|save|prune>");
  process.exit(1);
}

const restoring = mode === "restore";
const result = await syncImageCache(
  restoring ? persistedDir : generatedDir,
  restoring ? generatedDir : persistedDir,
  { preserveNewer: restoring },
);

if (result.copied + result.skipped === 0) {
  if (restoring && (process.env.WORKERS_CI === "1" || process.env.VERCEL === "1")) {
    const ciName = process.env.WORKERS_CI === "1" ? "Cloudflare Workers CI" : "Vercel";
    console.warn(
      `\n[image-cache] WARNING: ${ciName} restored an empty responsive-image cache. ` +
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
