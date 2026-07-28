/**
 * Build freshness guard.
 *
 * `_site` is ignored and long-lived locally, so a green post-build lint can
 * otherwise describe an old build. The manifest fingerprints inputs that
 * affect the public site and records HEAD. `src/tsm/` is intentionally omitted:
 * it is independently developed and its dirty work must not invalidate this
 * site's verification loop.
 */
import { createHash } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";

const MANIFEST_PATH = "_site/.build-manifest.json";
const ROOTS = [
  "src",
  "eleventy",
  "agent-skills",
  "scripts/lib",
  "scripts/og-fonts",
];
const FILES = [
  ".eleventyignore",
  "eleventy.config.js",
  "middleware.ts",
  "package.json",
  "bun.lock",
  "scripts/build-freshness.mjs",
  "scripts/gen-og-cards.mjs",
  "vercel.json",
];
const EXCLUDED_PREFIXES = ["src/tsm/"];

function normalized(relativePath) {
  return relativePath.split(path.sep).join("/");
}

function isExcluded(relativePath) {
  const name = normalized(relativePath);
  return EXCLUDED_PREFIXES.some((prefix) => name.startsWith(prefix));
}

function walk(relativePath) {
  if (!existsSync(relativePath) || isExcluded(relativePath)) return [];
  const stat = statSync(relativePath);
  if (stat.isFile()) return [normalized(relativePath)];
  if (!stat.isDirectory()) return [];

  return readdirSync(relativePath)
    .flatMap((entry) => walk(path.join(relativePath, entry)));
}

function inputFiles() {
  return [...ROOTS.flatMap(walk), ...FILES.filter(existsSync)]
    .filter((file) => !isExcluded(file))
    .sort();
}

function fingerprint() {
  const hash = createHash("sha256");
  for (const file of inputFiles()) {
    hash.update(file);
    hash.update("\0");
    hash.update(readFileSync(file));
    hash.update("\0");
  }
  return hash.digest("hex");
}

function head() {
  try {
    return execFileSync("git", ["rev-parse", "HEAD"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch (error) {
    const deploymentHead = process.env.VERCEL_GIT_COMMIT_SHA?.trim();
    if (deploymentHead) return deploymentHead;
    throw error;
  }
}

function currentState() {
  return {
    schemaVersion: 1,
    head: head(),
    fingerprint: fingerprint(),
  };
}

function writeManifest() {
  mkdirSync(path.dirname(MANIFEST_PATH), { recursive: true });
  const state = { ...currentState(), writtenAt: new Date().toISOString() };
  writeFileSync(MANIFEST_PATH, JSON.stringify(state, null, 2) + "\n");
  console.log(
    `[build-freshness] wrote ${MANIFEST_PATH} for ${state.head.slice(0, 7)} (${state.fingerprint.slice(0, 12)})`,
  );
}

function checkManifest() {
  if (!existsSync(MANIFEST_PATH)) {
    throw new Error(
      `[build-freshness] ${MANIFEST_PATH} is missing; run \`bun run build:site\` first`,
    );
  }

  const recorded = JSON.parse(readFileSync(MANIFEST_PATH, "utf8"));
  const current = currentState();
  const mismatches = [];
  if (recorded.schemaVersion !== current.schemaVersion) {
    mismatches.push(`schema ${recorded.schemaVersion} != ${current.schemaVersion}`);
  }
  if (recorded.head !== current.head) {
    mismatches.push(
      `HEAD ${String(recorded.head).slice(0, 7)} != ${current.head.slice(0, 7)}`,
    );
  }
  if (recorded.fingerprint !== current.fingerprint) {
    mismatches.push(
      `inputs ${String(recorded.fingerprint).slice(0, 12)} != ${current.fingerprint.slice(0, 12)}`,
    );
  }

  if (mismatches.length) {
    throw new Error(
      `[build-freshness] stale _site (${mismatches.join(", ")}); run \`bun run build:site\``,
    );
  }

  console.log(
    `[build-freshness] OK — _site matches ${current.head.slice(0, 7)} (${current.fingerprint.slice(0, 12)}); src/tsm excluded`,
  );
}

const mode = process.argv[2];
try {
  if (mode === "--write") writeManifest();
  else if (mode === "--check") checkManifest();
  else throw new Error("usage: bun scripts/build-freshness.mjs --write|--check");
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
