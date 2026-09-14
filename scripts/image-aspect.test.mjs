import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import sharp from "sharp";
import filters from "../eleventy/filters.js";

const registered = {};
filters({ addFilter(name, filter) { registered[name] = filter; } });
let dir;
const images = {};

beforeAll(async () => {
  dir = await mkdtemp(path.join(os.tmpdir(), "site-aspect-"));
  for (const [name, width, height] of [["wide", 160, 90], ["tall", 90, 160], ["square", 100, 100]]) {
    // Relative paths are accepted as-is; absolute public paths map under src/.
    const file = path.join(dir, `${name}.png`);
    await sharp({ create: { width, height, channels: 3, background: "white" } }).png().toFile(file);
    images[name] = { src: path.relative(process.cwd(), file) };
  }
});
afterAll(async () => { if (dir) await rm(dir, { recursive: true, force: true }); });

describe("portrait aspect routing", () => {
  test("preserves wide, tall and square classes and layout routing", async () => {
    for (const name of ["wide", "tall", "square"]) {
      expect(await registered.aspectClass(images[name].src)).toBe(`is-${name}`);
    }
    expect(await registered.layoutVariant("sample", "landscape", [images.wide, images.tall])).toBe("salon");
    expect(await registered.layoutVariant("sample", "landscape", Array(5).fill(images.wide))).toBe("mosaic");
    expect(await registered.layoutVariant("sample", "mixed", [])).toBe("salon");
    expect(["drift", "column", "focus"]).toContain(await registered.layoutVariant("sample", "landscape", [images.wide]));
    expect(["stack", "grid", "filmstrip"]).toContain(await registered.layoutVariant("sample", "portrait", [images.tall]));
  });

  test("unreadable and malformed ICNS inputs remain unclassified", async () => {
    const file = path.join(dir, "malformed.icns");
    const bytes = Buffer.alloc(16);
    bytes.write("icns");
    bytes.writeUInt32BE(16, 4);
    bytes.write("ic07", 8); // Zero entry length previously stalled image-size.
    await writeFile(file, bytes);
    expect(await registered.aspectClass(path.relative(process.cwd(), file))).toBe("");
    expect(await registered.aspectClass("missing-image.png")).toBe("");
    expect(await registered.aspectClass(null)).toBe("");
  });
});
