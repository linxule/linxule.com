import { afterEach, expect, test } from "bun:test";
import { existsSync } from "node:fs";
import { mkdtemp, mkdir, readFile, rm, stat, symlink, utimes, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { pruneImageCache, syncImageCache } from "./lib/image-cache.mjs";

const directories = [];
afterEach(async () => {
  await Promise.all(directories.splice(0).map(dir => rm(dir, { recursive: true, force: true })));
});

async function fixture() {
  const root = await mkdtemp(path.join(tmpdir(), "xule-image-cache-"));
  directories.push(root);
  const source = path.join(root, "source");
  const destination = path.join(root, "destination");
  await mkdir(source);
  return { root, source, destination };
}

async function writeAt(file, content, seconds) {
  await writeFile(file, content);
  await utimes(file, seconds, seconds);
}

test("copies nested images once and leaves unchanged file timestamps intact", async () => {
  const { source, destination } = await fixture();
  await mkdir(path.join(source, "nested"));
  const image = "nested/art-800w.webp";
  await writeAt(path.join(source, image), "image data", 1_700_000_000.123456);
  expect((await syncImageCache(source, destination)).copied).toBe(1);
  const before = await stat(path.join(destination, image));
  expect(await syncImageCache(source, destination)).toEqual({ copied: 0, skipped: 1, ignored: 0, missing: false });
  expect((await stat(path.join(destination, image))).mtimeMs).toBe(before.mtimeMs);
  expect(await readFile(path.join(destination, image), "utf8")).toBe("image data");
});

test("same-size re-encodes replace older output; restoration preserves newer local images", async () => {
  const { source, destination } = await fixture();
  const image = "art-800w.webp";
  await writeAt(path.join(source, image), "old", 1_700_000_000);
  await syncImageCache(source, destination);
  await writeAt(path.join(source, image), "new", 1_700_000_100);
  expect((await syncImageCache(source, destination)).copied).toBe(1);
  expect(await readFile(path.join(destination, image), "utf8")).toBe("new");
  await writeAt(path.join(destination, image), "newer local encoding", 1_700_000_200);
  expect((await syncImageCache(source, destination, { preserveNewer: true })).skipped).toBe(1);
  expect(await readFile(path.join(destination, image), "utf8")).toBe("newer local encoding");
  // Authoritative output sync still repairs a different-size destination.
  expect((await syncImageCache(source, destination)).copied).toBe(1);
});

test("does not copy merge duplicates or symlinks and tolerates an absent cache", async () => {
  const { source, destination } = await fixture();
  await writeFile(path.join(source, "art-800w 2.webp"), "duplicate");
  await writeFile(path.join(source, "art-800w.webp"), "image");
  await symlink(path.join(source, "art-800w.webp"), path.join(source, "linked.webp"));
  expect(await syncImageCache(source, destination)).toEqual({ copied: 1, skipped: 0, ignored: 2, missing: false });
  expect((await syncImageCache(path.join(source, "missing"), destination)).missing).toBe(true);
});

test("allowlist excludes retired orphan files while copying active variants", async () => {
  const { source, destination } = await fixture();
  await writeFile(path.join(source, "active-1200w.webp"), "active");
  await writeFile(path.join(source, "retired-2912w.png"), "orphan");
  const result = await syncImageCache(source, destination, {
    allowlist: new Set(["active-1200w.webp"]),
  });
  expect(result).toEqual({ copied: 1, skipped: 0, ignored: 1, missing: false });
  expect(existsSync(path.join(destination, "active-1200w.webp"))).toBe(true);
  expect(existsSync(path.join(destination, "retired-2912w.png"))).toBe(false);
});

test("pruneImageCache deletes unreferenced cache files against built _site and refuses empty sites", async () => {
  const { root } = await fixture();
  const siteDir = path.join(root, "_site");
  const cacheA = path.join(root, "cache-a");
  const cacheB = path.join(root, "cache-b");
  await mkdir(path.join(siteDir, "writing"), { recursive: true });
  await mkdir(path.join(siteDir, "tsm"), { recursive: true });
  await mkdir(cacheA, { recursive: true });
  await mkdir(cacheB, { recursive: true });

  await writeFile(
    path.join(siteDir, "writing/post.html"),
    '<picture><source srcset="/assets/images/optimized/keep-800w.avif 800w"><img src="/assets/images/optimized/keep-1200w.jpeg"></picture>',
  );
  await writeFile(
    path.join(siteDir, "writing/post.md"),
    '![alt](/assets/images/optimized/keep-md-1200w.jpeg)',
  );
  // References inside _site/tsm must be ignored
  await writeFile(path.join(siteDir, "tsm/index.html"), '<img src="/assets/images/optimized/tsm-only.jpeg">');

  await writeFile(path.join(cacheA, "keep-800w.avif"), "12345");
  await writeFile(path.join(cacheA, "keep-1200w.jpeg"), "123456");
  await writeFile(path.join(cacheA, "orphan-2944w.png"), "orphan-bytes");
  await writeFile(path.join(cacheB, "keep-md-1200w.jpeg"), "ok");
  await writeFile(path.join(cacheB, "tsm-only.jpeg"), "tsm");

  const pruned = await pruneImageCache([cacheA, cacheB], siteDir);
  expect(pruned.referenced).toBe(3);
  expect(pruned.kept).toBe(3);
  expect(pruned.removed).toBe(2);
  expect(pruned.freedBytes).toBe("orphan-bytes".length + "tsm".length);
  expect(existsSync(path.join(cacheA, "keep-800w.avif"))).toBe(true);
  expect(existsSync(path.join(cacheA, "orphan-2944w.png"))).toBe(false);
  expect(existsSync(path.join(cacheB, "tsm-only.jpeg"))).toBe(false);

  // Refuses to prune if site has 0 references
  const emptySite = path.join(root, "empty-site");
  await mkdir(emptySite, { recursive: true });
  await expect(pruneImageCache([cacheA], emptySite)).rejects.toThrow(/refusing to prune/i);
});
