import { afterEach, expect, test } from "bun:test";
import { mkdtemp, mkdir, readFile, rm, stat, symlink, utimes, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { syncImageCache } from "./lib/image-cache.mjs";

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
  return { source, destination };
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
