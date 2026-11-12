/**
 * Make the paper once per printing.
 *
 * One tile per stock (title / body / workshop), seeded by the commit that
 * versions main.css (`site.version`), so the same commit always prints on the
 * same paper and each deploy gets its own. The tile is periodic in both axes
 * (noise on a wrapped simplex lattice, fibres drawn across the edges), rendered
 * at 2x, and baked to the final colour the reader sees: --paper with the old
 * texture composited at the stock's old opacity. The browser cuts the sheet at
 * a per-session offset (inline script in base.njk); it never makes paper.
 *
 *   bun scripts/gen-paper.mjs            # skip when the tiles for this seed exist
 *   bun scripts/gen-paper.mjs --force
 */
import sharp from "sharp";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const TILE = 768;          // CSS px per tile; the image is 2 * TILE square
export const SCALE = 2;
export const OUT_DIR = ".cache/paper";
export const PAPER = [0xf4, 0xf1, 0xeb];
export const AVIF = { quality: 90, effort: 6, chromaSubsampling: "4:4:4" };

// Art direction carried over from the in-browser generator (paper.js, retired
// 2026-11-12). Grain and fibre scales are in CSS px, as they were there.
export const STOCKS = {
  title: {
    grainScale: 0.035, grainOctaves: 4, grainIntensity: 0.07,
    fiberDensity: 0.35, fiberDirection: 10, fiberSpread: 25, fiberLength: 0.6,
    warmth: 0.65, toneVariation: 0.025, roughness: 0.035, opacity: 0.35,
  },
  body: {
    grainScale: 0.04, grainOctaves: 4, grainIntensity: 0.03,
    fiberDensity: 0.15, fiberDirection: 15, fiberSpread: 30, fiberLength: 0.4,
    warmth: 0.5, toneVariation: 0.01, roughness: 0.015, opacity: 0.25,
  },
  workshop: {
    grainScale: 0.05, grainOctaves: 5, grainIntensity: 0.065,
    fiberDensity: 0.4, fiberDirection: -5, fiberSpread: 35, fiberLength: 0.55,
    warmth: 0.35, toneVariation: 0.02, roughness: 0.04, opacity: 0.35,
  },
};

export function seedFor(version, stock) {
  return createHash("sha256").update(`${version}:${stock}`).digest().readUInt32LE(0);
}

function mulberry32(a) {
  return function () {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

// ── Periodic simplex noise ─────────────────────────────────────────
// Simplex noise is periodic under any translation that maps its skewed integer
// lattice to itself, provided the gradient chosen at a lattice point depends
// only on that point's class modulo the period. So: snap the tile's two period
// vectors (in noise space) to the nearest lattice vectors, and hash each
// corner by its canonical representative modulo those two vectors.
const F2 = 0.5 * (Math.sqrt(3) - 1);
const G2 = (3 - Math.sqrt(3)) / 6;
const GRAD = [[1, 1], [-1, 1], [1, -1], [-1, -1], [1, 0], [-1, 0], [0, 1], [0, -1]];
const skew = (x, y) => { const s = (x + y) * F2; return [x + s, y + s]; };
const unskew = (i, j) => { const t = (i + j) * G2; return [i - t, j - t]; };

function gradIndex(i, j, seed) {
  let h = Math.imul(i, 0x27d4eb2d) ^ Math.imul(j, 0x165667b1) ^ seed;
  h = Math.imul(h ^ (h >>> 15), 0x85ebca6b);
  h = Math.imul(h ^ (h >>> 13), 0xc2b2ae35);
  return (h ^ (h >>> 16)) & 7;
}

/**
 * A noise field over the tile: value(x, y) for CSS-px x, y in [0, T), periodic
 * with period T in both axes. `map` is the linear map from CSS px to noise space
 * that the old generator used; it is nudged (by at most half a lattice step per
 * tile) so the tile's period vectors land on lattice vectors.
 */
export function periodicLayer(map, T, seed) {
  const [[a, b], [c, d]] = map;               // noise = [[a, b], [c, d]] · (x, y)
  const p1 = skew(a * T, c * T).map(Math.round);
  const p2 = skew(b * T, d * T).map(Math.round);
  const det = p1[0] * p2[1] - p2[0] * p1[1];
  if (det === 0) throw new Error("degenerate noise period");
  const u1 = unskew(...p1).map((v) => v / T);
  const u2 = unskew(...p2).map((v) => v / T);

  function corner(i, j, x, y) {
    let t = 0.5 - x * x - y * y;
    if (t < 0) return 0;
    const fs = Math.floor((p2[1] * i - p2[0] * j) / det);
    const ft = Math.floor((p1[0] * j - p1[1] * i) / det);
    const g = GRAD[gradIndex(i - fs * p1[0] - ft * p2[0], j - fs * p1[1] - ft * p2[1], seed)];
    t *= t;
    return t * t * (g[0] * x + g[1] * y);
  }
  return function value(px, py) {
    const xin = u1[0] * px + u2[0] * py;
    const yin = u1[1] * px + u2[1] * py;
    const s = (xin + yin) * F2;
    const i = Math.floor(xin + s), j = Math.floor(yin + s);
    const t = (i + j) * G2;
    const x0 = xin - (i - t), y0 = yin - (j - t);
    const i1 = x0 > y0 ? 1 : 0, j1 = 1 - i1;
    const x1 = x0 - i1 + G2, y1 = y0 - j1 + G2;
    const x2 = x0 - 1 + 2 * G2, y2 = y0 - 1 + 2 * G2;
    return 70 * (corner(i, j, x0, y0) + corner(i + i1, j + j1, x1, y1) + corner(i + 1, j + 1, x2, y2));
  };
}

// Octaves double in frequency, so each octave's period lattice is twice the last.
function periodicFbm(map, octaves, T, seed) {
  const layers = [];
  let amplitude = 1, max = 0;
  for (let k = 0; k < octaves; k++) {
    const f = 2 ** k;
    layers.push([periodicLayer(map.map((row) => row.map((v) => v * f)), T, seed + k * 1013), amplitude]);
    max += amplitude;
    amplitude *= 0.5;
  }
  return (x, y) => { let v = 0; for (const [n, amp] of layers) v += n(x, y) * amp; return v / max; };
}

function hslToRgb(h, s, l) {
  if (s === 0) return [l, l, l];
  const hue2rgb = (p, q, t) => {
    if (t < 0) t += 1; if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  return [hue2rgb(p, q, h + 1 / 3), hue2rgb(p, q, h), hue2rgb(p, q, h - 1 / 3)];
}

/** The final, opaque tile as 8-bit RGB: { data, size } with size = T * SCALE. */
export function renderStock(name, seed, T = TILE) {
  const params = STOCKS[name];
  const size = T * SCALE;
  const baseH = 37 + (params.warmth - 0.5) * 10;
  const baseS = 0.10 + params.warmth * 0.08;
  const baseL = 0.94;

  const tone = periodicFbm([[3 / 512, 0], [0, 3 / 512]], 2, T, seed);
  const r = params.fiberDirection * Math.PI / 180;
  const g = params.grainScale;
  const grain = periodicFbm([[g * Math.cos(r), -g * Math.sin(r)], [0.5 * g * Math.sin(r), 0.5 * g * Math.cos(r)]],
    params.grainOctaves, T, seed + 101);
  const fine = periodicLayer([[0.15, 0], [0, 0.15]], T, seed + 7919);

  const rgb = new Float32Array(size * size * 3);
  for (let y = 0; y < size; y++) {
    const cy = (y + 0.5) / SCALE;
    for (let x = 0; x < size; x++) {
      const cx = (x + 0.5) / SCALE;
      const largeTone = tone(cx, cy) * params.toneVariation;
      const L = baseL + largeTone + grain(cx, cy) * params.grainIntensity + fine(cx, cy) * params.roughness;
      const c = hslToRgb((baseH + largeTone * 100) / 360, baseS, Math.max(0, Math.min(1, L)));
      const i = (y * size + x) * 3;
      rgb[i] = c[0]; rgb[i + 1] = c[1]; rgb[i + 2] = c[2];
    }
  }

  // Fibres: short strokes multiplied onto the sheet, wrapped across the edges.
  // Same count per CSS px² as the old 512 tile; drawn at device resolution.
  const rng = mulberry32(seed + 42);
  const count = Math.floor(params.fiberDensity * 25000 * (T / 512) ** 2);
  for (let n = 0; n < count; n++) {
    const fx = rng() * T, fy = rng() * T;
    const angle = (params.fiberDirection + (rng() - 0.5) * params.fiberSpread * 2) * Math.PI / 180;
    const len = (2 + rng() * 6) * params.fiberLength * SCALE;
    const alpha = 0.02 + rng() * 0.04;
    const fibre = hslToRgb(baseH / 360, baseS * 0.5, baseL - 0.05 - rng() * 0.05);
    const width = (0.5 + rng() * 0.5) * SCALE;
    stroke(rgb, size, fx * SCALE, fy * SCALE, Math.cos(angle), Math.sin(angle), len, width, alpha, fibre);
  }

  // Bake: the old layer sat over --paper at the stock's opacity.
  const data = Buffer.alloc(size * size * 3);
  const op = params.opacity;
  for (let i = 0; i < rgb.length; i++) {
    const v = PAPER[i % 3] * (1 - op) + rgb[i] * 255 * op;
    data[i] = Math.max(0, Math.min(255, Math.round(v)));
  }
  return { data, size };
}

// A butt-capped segment, box-filtered coverage, multiply blend, toroidal wrap.
function stroke(rgb, size, x0, y0, dx, dy, len, width, alpha, colour) {
  const half = width / 2;
  const xs = [x0, x0 + dx * len], ys = [y0, y0 + dy * len];
  const minX = Math.floor(Math.min(...xs) - half - 1), maxX = Math.ceil(Math.max(...xs) + half + 1);
  const minY = Math.floor(Math.min(...ys) - half - 1), maxY = Math.ceil(Math.max(...ys) + half + 1);
  const overlap = (c, lo, hi) => Math.max(0, Math.min(c + 0.5, hi) - Math.max(c - 0.5, lo));
  for (let py = minY; py <= maxY; py++) {
    for (let px = minX; px <= maxX; px++) {
      const vx = px + 0.5 - x0, vy = py + 0.5 - y0;
      const along = vx * dx + vy * dy;
      const across = -vx * dy + vy * dx;
      const cover = overlap(along, 0, len) * overlap(across, -half, half);
      if (cover <= 0) continue;
      const k = alpha * cover;
      const i = ((((py % size) + size) % size) * size + (((px % size) + size) % size)) * 3;
      for (let ch = 0; ch < 3; ch++) rgb[i + ch] *= 1 - k * (1 - colour[ch]);
    }
  }
}

export async function encode({ data, size }) {
  return sharp(data, { raw: { width: size, height: size, channels: 3 } }).avif(AVIF).toBuffer();
}

function generatorKey(version) {
  const self = readFileSync(fileURLToPath(import.meta.url));
  return `${version}:${TILE}:${createHash("sha256").update(self).digest("hex").slice(0, 12)}`;
}

async function main() {
  const { default: site } = await import("../src/_data/site.js");
  const force = process.argv.includes("--force");
  const key = generatorKey(site.version);
  const stampFile = path.join(OUT_DIR, "stamp.json");
  const files = Object.keys(STOCKS).map((name) => path.join(OUT_DIR, `${name}.avif`));
  if (!force && existsSync(stampFile) && files.every(existsSync)
      && JSON.parse(readFileSync(stampFile, "utf8")).key === key) {
    console.log(`[paper] ${site.version}: tiles current`);
    return;
  }
  mkdirSync(OUT_DIR, { recursive: true });
  for (const entry of readdirSync(OUT_DIR)) rmSync(path.join(OUT_DIR, entry), { force: true });
  for (const name of Object.keys(STOCKS)) {
    const t0 = performance.now();
    const avif = await encode(renderStock(name, seedFor(site.version, name)));
    writeFileSync(path.join(OUT_DIR, `${name}.avif`), avif);
    console.log(`[paper] ${site.version} ${name}: ${(avif.length / 1024).toFixed(0)} KB in ${Math.round(performance.now() - t0)} ms`);
  }
  writeFileSync(stampFile, JSON.stringify({ key }) + "\n");
}

if (import.meta.main) await main();
