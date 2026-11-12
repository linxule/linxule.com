import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { encode, periodicLayer, renderStock, seedFor, STOCKS, TILE, SCALE, PAPER } from "./gen-paper.mjs";

const SEED_VERSION = "test000";
const tiles = Object.fromEntries(Object.keys(STOCKS).map((name) => [name, renderStock(name, seedFor(SEED_VERSION, name))]));

const lum = ({ data, size }) => {
  const L = new Float64Array(size * size);
  for (let i = 0; i < L.length; i++) L[i] = 0.2126 * data[i * 3] + 0.7152 * data[i * 3 + 1] + 0.0722 * data[i * 3 + 2];
  return L;
};
const relLum = ([r, g, b]) => {
  const c = (v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
  return 0.2126 * c(r) + 0.7152 * c(g) + 0.0722 * c(b);
};
const contrast = (a, b) => { const [x, y] = [relLum(a), relLum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));

// Mean |difference| between the W columns left of boundary x and the W columns
// right of it, after a vertical blur (the eye sees the slow tone, not the grain).
function boundarySteps(L, S, W = 16, B = 12) {
  const blurred = new Float64Array(L.length);
  for (let x = 0; x < S; x++) {
    let s = 0;
    for (let k = -B; k <= B; k++) s += L[((k + S) % S) * S + x];
    for (let y = 0; y < S; y++) {
      blurred[y * S + x] = s / (2 * B + 1);
      s += L[((y + B + 1) % S) * S + x] - L[((y - B + S) % S) * S + x];
    }
  }
  const steps = [];
  for (let x = 0; x < S; x += 4) {
    let d = 0;
    for (let y = 0; y < S; y++) {
      let l = 0, r = 0;
      for (let k = 0; k < W; k++) { l += blurred[y * S + (x - 1 - k + S) % S]; r += blurred[y * S + (x + k) % S]; }
      d += Math.abs(l - r) / W;
    }
    steps.push(d / S);
  }
  return steps; // steps[0] is the wrap
}
const transpose = (L, S) => { const T = new Float64Array(L.length); for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) T[x * S + y] = L[y * S + x]; return T; };

describe("paper tiles", () => {
  test("are 2x, opaque RGB, the CSS tile size main.css declares", () => {
    const css = readFileSync("src/assets/css/main.css", "utf8");
    expect(css).toContain(`--paper-tile: ${TILE}px;`);
    for (const t of Object.values(tiles)) {
      expect(t.size).toBe(TILE * SCALE);
      expect(t.data.length).toBe(t.size * t.size * 3);
    }
  });

  test("are deterministic: same version and stock, same bytes; different stocks or versions, different paper", async () => {
    const again = renderStock("body", seedFor(SEED_VERSION, "body"));
    expect(Buffer.compare(again.data, tiles.body.data)).toBe(0);
    expect(Buffer.compare(await encode(again), await encode(tiles.body))).toBe(0);
    expect(seedFor(SEED_VERSION, "body")).not.toBe(seedFor(SEED_VERSION, "title"));
    expect(seedFor(SEED_VERSION, "body")).not.toBe(seedFor("test001", "body"));
  }, 30000);

  test("noise fields are exactly periodic at the tile size", () => {
    const maps = [[[0.035, -0.006], [0.003, 0.017]], [[3 / 512, 0], [0, 3 / 512]], [[0.15 * 8, 0], [0, 0.15 * 8]]];
    for (const map of maps) {
      const n = periodicLayer(map, TILE, 12345);
      for (let k = 0; k < 200; k++) {
        const x = (k * 37.3) % TILE, y = (k * 91.7) % TILE;
        expect(Math.abs(n(x + TILE, y) - n(x, y))).toBeLessThan(1e-9);
        expect(Math.abs(n(x, y + TILE) - n(x, y))).toBeLessThan(1e-9);
      }
    }
  });

  test("have no seam: the step across the wrap is an ordinary step", () => {
    for (const t of Object.values(tiles)) {
      const L = lum(t);
      for (const steps of [boundarySteps(L, t.size), boundarySteps(transpose(L, t.size), t.size)]) {
        const inside = steps.slice(1).sort((a, b) => a - b);
        const p95 = inside[Math.floor(inside.length * 0.95)];
        expect(steps[0]).toBeLessThanOrEqual(p95 * 1.05);
      }
    }
  });

  test("have the same contrast at the edges as in the middle (no blend ring)", () => {
    for (const t of Object.values(tiles)) {
      const L = lum(t), S = t.size, n = 8, cell = S / n;
      const sd = [];
      for (let by = 0; by < n; by++) for (let bx = 0; bx < n; bx++) {
        let s = 0, s2 = 0;
        for (let y = by * cell; y < (by + 1) * cell; y++) for (let x = bx * cell; x < (bx + 1) * cell; x++) { const v = L[y * S + x]; s += v; s2 += v * v; }
        const m = s / cell ** 2;
        sd.push({ edge: bx === 0 || by === 0 || bx === n - 1 || by === n - 1, v: Math.sqrt(s2 / cell ** 2 - m * m) });
      }
      const mean = (xs) => xs.reduce((a, b) => a + b, 0) / xs.length;
      const ratio = mean(sd.filter((c) => c.edge).map((c) => c.v)) / mean(sd.filter((c) => !c.edge).map((c) => c.v));
      expect(ratio).toBeGreaterThan(0.85);
      expect(ratio).toBeLessThan(1.15);
    }
  });

  test("keep the colour of --paper, so the declared ink contrasts stay true", () => {
    const inks = { ink: [hex("#1a1a1a"), 15.0], inkLight: [hex("#555555"), 6.4], inkFaint: [hex("#666666"), 5.0] };
    for (const t of Object.values(tiles)) {
      const n = t.size * t.size, mean = [0, 0, 0];
      for (let i = 0; i < n * 3; i++) mean[i % 3] += t.data[i];
      for (let c = 0; c < 3; c++) expect(Math.abs(mean[c] / n - PAPER[c])).toBeLessThan(1.5);
      // The darkest 1% of the sheet still clears AA for the faintest ink.
      const L = lum(t).sort();
      const dark = L[Math.floor(n * 0.01)];
      for (const [name, [ink, floor]] of Object.entries(inks)) {
        expect(contrast(ink, mean.map((v) => v / n)), name).toBeGreaterThan(floor);
        expect(contrast(ink, [dark, dark, dark]), `${name} on dark paper`).toBeGreaterThan(4.5);
      }
    }
  });

  test("fit the byte budget", async () => {
    for (const t of Object.values(tiles)) expect((await encode(t)).length).toBeLessThan(150 * 1024);
  }, 30000);

  test.if(existsSync("_site/index.html"))("are in the build for every stock", () => {
    for (const name of Object.keys(STOCKS)) expect(existsSync(`_site/assets/paper/${name}.avif`)).toBe(true);
  });
});
