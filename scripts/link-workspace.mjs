#!/usr/bin/env bun
// Give a clone or worktree the private rules and docs that live only in the
// main checkout's gitignored .claude/ folder. Links by default; --copy for
// sandboxes that cannot follow a link out of their root.
//
//   bun run workspace:link              # link .claude/rules and .claude/docs
//   bun run workspace:link --copy       # copy them instead
//   bun run workspace:link --dry-run    # print the plan, change nothing
//   XULE_SITE_MAIN=/path/to/xule-site bun run workspace:link

import { execFileSync } from "node:child_process";
import { cpSync, existsSync, lstatSync, mkdirSync, readlinkSync, realpathSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join, relative, resolve, sep } from "node:path";

const SHARED = ["rules", "docs"];
// Written beside copies so they are never mistaken for the real folders.
const COPY_MARKER = ".workspace-copy";
const args = new Set(process.argv.slice(2));
const copy = args.has("--copy");
const dryRun = args.has("--dry-run");

const here = realpathSync(process.cwd());

function git(...argv) {
  try {
    return execFileSync("git", argv, { cwd: here, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
  } catch {
    return "";
  }
}

function hasWorkspace(dir) {
  if (!dir || existsSync(join(dir, ".claude", COPY_MARKER))) return false;
  return SHARED.every((name) => {
    const p = join(dir, ".claude", name);
    return existsSync(p) && !lstatSync(p).isSymbolicLink();
  });
}

// The main checkout is, in order: the one named explicitly, the checkout this
// worktree is linked to, or the usual iCloud location (same on both Macs).
function findMain() {
  const candidates = [];
  if (process.env.XULE_SITE_MAIN) candidates.push(resolve(process.env.XULE_SITE_MAIN));
  const common = git("rev-parse", "--path-format=absolute", "--git-common-dir");
  if (common) candidates.push(dirname(common));
  candidates.push(join(homedir(), "Documents", "Apps", "personal-website", "xule-site"));
  for (const dir of candidates) {
    if (!existsSync(dir)) continue;
    const real = realpathSync(dir);
    if (real !== here && hasWorkspace(real)) return real;
  }
  return null;
}

const top = git("rev-parse", "--show-toplevel");
if (!top || realpathSync(top) !== here) {
  console.error("[workspace-link] Run this from the root of a xule-site checkout.");
  process.exit(1);
}
if (hasWorkspace(here)) {
  console.log("[workspace-link] This checkout already holds the real .claude/rules and .claude/docs. Nothing to do.");
  process.exit(0);
}

const main = findMain();
if (!main) {
  console.error(
    "[workspace-link] Could not find a checkout that holds .claude/rules and .claude/docs.\n" +
      "Set XULE_SITE_MAIN to the main xule-site folder. Without it, the tracked docs/ are what you have.",
  );
  process.exit(1);
}

const markerPath = join(here, ".claude", COPY_MARKER);
const isCopy = existsSync(markerPath);
let changed = 0;
for (const name of SHARED) {
  const source = join(main, ".claude", name);
  const target = join(here, ".claude", name);
  // Relative when both sit under the home folder, so a link inside iCloud
  // resolves on both Macs; absolute otherwise.
  const home = homedir() + sep;
  const linkText = source.startsWith(home) && target.startsWith(home) ? relative(dirname(target), source) : source;

  let existing = null;
  try {
    existing = lstatSync(target);
  } catch {}

  if (existing?.isSymbolicLink()) {
    if (!copy && readlinkSync(target) === linkText) {
      console.log(`[workspace-link] .claude/${name} already links to ${linkText}`);
      continue;
    }
    if (!dryRun) rmSync(target);
  } else if (existing && isCopy) {
    // An earlier --copy made this; it is disposable.
    if (!dryRun) rmSync(target, { recursive: true });
  } else if (existing) {
    console.error(`[workspace-link] .claude/${name} exists here and is not a link. Left alone; move it aside to replace it.`);
    process.exitCode = 1;
    continue;
  }

  console.log(`[workspace-link] ${dryRun ? "would " : ""}${copy ? "copy" : "link"} .claude/${name} ${copy ? "from" : "->"} ${copy ? source : linkText}`);
  if (dryRun) continue;
  mkdirSync(dirname(target), { recursive: true });
  if (copy) cpSync(source, target, { recursive: true });
  else symlinkSync(linkText, target);
  changed += 1;
}

if (!dryRun && changed) {
  if (copy) writeFileSync(markerPath, `Copied from ${main}. Disposable: edit rules and docs in the main checkout.\n`);
  else if (isCopy) rmSync(markerPath);
  console.log(`[workspace-link] Done. ${copy ? "Copies go stale: rerun with --copy to refresh, and edit only in the main checkout." : "Links follow the main checkout."}`);
}
