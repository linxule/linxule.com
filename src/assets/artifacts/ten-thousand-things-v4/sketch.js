// 《万物状》 THE FORM OF TEN THOUSAND THINGS — ten-thousand-things v4
// Gray-Scott morphogenesis on the GPU: two morphogens (U=1 sea, V activator)
// in ping-pong RGBA16F textures, WebGL2 fragment shaders, torus boundary.
// The five phases (木火土金水) and 人 are stamped as chemical seeds whose
// ink perturbs and tints the reaction. Shared by the deterministic render
// harness (render.mjs drives window.renderFrame) and the live piece
// (live.html sets window.__live = true).

const SIZE = 1080;
const FPS = 30;
const DURATION = 62;
const TOTAL_FRAMES = FPS * DURATION;
const SIM_STEPS = 20;
const STATS_EVERY = 15;

// phase colors (from v3): 木火土金水 + 人; index 0 = primordial bone
const FAM = [
  { name: "bone",  glyph: "·", color: [0.91, 0.89, 0.82], root: 220 },
  { name: "wood",  glyph: "木", color: [0.41, 0.77, 0.57], root: 220 },
  { name: "fire",  glyph: "火", color: [0.88, 0.39, 0.24], root: 275 },
  { name: "earth", glyph: "土", color: [0.74, 0.57, 0.29], root: 330 },
  { name: "metal", glyph: "金", color: [0.83, 0.84, 0.86], root: 385 },
  { name: "water", glyph: "水", color: [0.31, 0.64, 0.82], root: 440 },
  { name: "human", glyph: "人", color: [0.91, 0.87, 0.78], root: 495 },
];

// seed schedule: [time, family, x (0..1), y, sizePx]
const SEEDS = [
  [0.8, 0, 0.500, 0.500, 10],    // the one: a single primordial dot
  [9.0, 1, 0.340, 0.360, 150],
  [17.0, 2, 0.660, 0.330, 150],
  [25.0, 3, 0.700, 0.680, 150],
  [33.0, 4, 0.300, 0.700, 150],
  [41.0, 5, 0.560, 0.840, 150],
  [49.0, 6, 0.500, 0.540, 170],  // the human, at the heart
];

// Gray-Scott regimes: mitosis (division era) -> labyrinth (weaving era)
const GS = {
  F0: 0.0545, k0: 0.0620,
  F1: 0.0370, k1: 0.0600,
  ramp0: 30.0, ramp1: 45.0,
};

let gl, canvas;
let progSim, progSeed, progLabel, progShow;
let texField = [null, null], fboField = [null, null], flip = 0;
let texLabel = [null, null], fboLabel = [null, null], labelFlip = 0;
let glyphTex = {};
let miniTex, miniFbo;
let seededFlags = SEEDS.map(() => false);
let live = false;
let liveStart = 0;

// ------------------------------------------------------------ shaders

const VERT = `#version 300 es
layout(location=0) in vec2 p;
void main(){ gl_Position = vec4(p, 0.0, 1.0); }`;

const FRAG_SIM = `#version 300 es
precision highp float;
uniform sampler2D field;
uniform vec2 texel;
uniform float F, k;
out vec4 outColor;
void main(){
  vec2 c = gl_FragCoord.xy;
  vec2 uv = texture(field, c * texel).rg;
  vec2 lap = -uv;
  lap += 0.2  * texture(field, (c + vec2( 1., 0.)) * texel).rg;
  lap += 0.2  * texture(field, (c + vec2(-1., 0.)) * texel).rg;
  lap += 0.2  * texture(field, (c + vec2( 0., 1.)) * texel).rg;
  lap += 0.2  * texture(field, (c + vec2( 0.,-1.)) * texel).rg;
  lap += 0.05 * texture(field, (c + vec2( 1., 1.)) * texel).rg;
  lap += 0.05 * texture(field, (c + vec2(-1., 1.)) * texel).rg;
  lap += 0.05 * texture(field, (c + vec2( 1.,-1.)) * texel).rg;
  lap += 0.05 * texture(field, (c + vec2(-1.,-1.)) * texel).rg;
  float u = uv.r, v = uv.g;
  float uvv = u * v * v;
  outColor = vec4(
    clamp(u + (1.0 * lap.r - uvv + F * (1.0 - u)), 0.0, 1.0),
    clamp(v + (0.5 * lap.g + uvv - (F + k) * v), 0.0, 1.0),
    0.0, 1.0);
}`;

// stamps a glyph mask into the field (chemical seed) or label (color)
const FRAG_SEED = `#version 300 es
precision highp float;
uniform sampler2D field;
uniform sampler2D glyph;
uniform vec2 texel;
uniform vec2 center;
uniform float scalePx;
uniform float strength;
uniform vec3 tint;
uniform int mode;         // 0 = chemical seed, 1 = label color
out vec4 outColor;
void main(){
  vec2 c = gl_FragCoord.xy;
  vec4 cur = texture(field, c * texel);
  vec2 g = (c - center * ${SIZE}.0) / scalePx + 0.5;
  float mask = 0.0;
  if (all(greaterThanEqual(g, vec2(0.0))) && all(lessThanEqual(g, vec2(1.0)))) {
    mask = texture(glyph, g).a;
  }
  if (mode == 0) {
    outColor = vec4(
      clamp(cur.r - 0.5 * strength * mask, 0.0, 1.0),
      clamp(cur.g + strength * mask, 0.0, 1.0),
      cur.b, 1.0);
  } else {
    outColor = vec4(min(cur.rgb + tint * mask, vec3(1.6)), 1.0);
  }
}`;

const FRAG_LABEL = `#version 300 es
precision highp float;
uniform sampler2D label;
uniform vec2 texel;
out vec4 outColor;
void main(){
  vec2 c = gl_FragCoord.xy;
  vec3 cur = texture(label, c * texel).rgb;
  vec3 nb = (
    texture(label, (c + vec2( 1., 0.)) * texel).rgb +
    texture(label, (c + vec2(-1., 0.)) * texel).rgb +
    texture(label, (c + vec2( 0., 1.)) * texel).rgb +
    texture(label, (c + vec2( 0.,-1.)) * texel).rgb) * 0.25;
  // mostly preserve, whisper of spread: homelands keep their hue
  outColor = vec4(cur * 0.9990 + nb * 0.0008, 1.0);
}`;

const FRAG_SHOW = `#version 300 es
precision highp float;
uniform sampler2D field;
uniform sampler2D label;
uniform vec2 texel;
uniform float fade;
out vec4 outColor;
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
void main(){
  vec2 c = gl_FragCoord.xy;
  vec2 fg = texture(field, c * texel).rg;
  vec3 lab = texture(label, c * texel).rgb;
  float ink = smoothstep(0.15, 0.30, fg.g);
  vec3 bone = vec3(0.91, 0.89, 0.82);
  vec3 tint = dot(lab, vec3(1.0)) > 0.06 ? lab * 1.35 : bone;
  vec3 col = tint * ink;
  col += lab * 0.16;  // the territory's soft presence: color even where the reaction has moved on
  float d = length(c * texel - 0.5) * 1.3;
  col *= 1.0 - 0.22 * smoothstep(0.55, 0.95, d);
  col += (hash(c) - 0.5) * 0.014;
  col = max(col, vec3(0.0));
  outColor = vec4(col * fade, 1.0);
}`;

// NOTE: texel must be 1/viewportSize — gl_FragCoord spans the CURRENT
// viewport, so sampling 1/SIZE into the mini target would read only the
// field's bottom-left corner (the stats-blackout bug)

// ------------------------------------------------------------ gl helpers

function compile(type, src) {
  const s = gl.createShader(type);
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    throw new Error("shader: " + gl.getShaderInfoLog(s));
  }
  return s;
}

function link(fragSrc) {
  const p = gl.createProgram();
  gl.attachShader(p, compile(gl.VERTEX_SHADER, VERT));
  gl.attachShader(p, compile(gl.FRAGMENT_SHADER, fragSrc));
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
    throw new Error("link: " + gl.getProgramInfoLog(p));
  }
  return p;
}

function makeFloatTarget(w, h) {
  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, w, h, 0, gl.RGBA, gl.HALF_FLOAT, null);
  const fbo = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
  if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
    throw new Error("float framebuffer incomplete");
  }
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  return [tex, fbo];
}

function makeByteTarget(w, h) {
  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  const fbo = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  return [tex, fbo];
}

function makeGlyphTexture(ch, px) {
  const g = createGraphics(px, px);
  g.pixelDensity(1);
  g.textFont("Songti SC");
  g.textStyle(BOLD);
  g.textSize(px * 0.72);
  g.textAlign(CENTER, CENTER);
  g.fill(255);
  g.text(ch, px / 2, px / 2 + px * 0.04);
  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, g.elt);
  g.remove();
  return tex;
}

function drawTriangle() {
  gl.drawArrays(gl.TRIANGLES, 0, 3);
}

// ------------------------------------------------------------ passes

function simPass(F, k) {
  const dst = 1 - flip;
  gl.bindFramebuffer(gl.FRAMEBUFFER, fboField[dst]);
  gl.useProgram(progSim);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texField[flip]);
  gl.uniform1i(gl.getUniformLocation(progSim, "field"), 0);
  gl.uniform2f(gl.getUniformLocation(progSim, "texel"), 1 / SIZE, 1 / SIZE);
  gl.uniform1f(gl.getUniformLocation(progSim, "F"), F);
  gl.uniform1f(gl.getUniformLocation(progSim, "k"), k);
  drawTriangle();
  flip = dst;
}

function seedPass(s) {
  const [, fam, x, y, sizePx] = s;
  const dst = 1 - flip;
  gl.bindFramebuffer(gl.FRAMEBUFFER, fboField[dst]);
  gl.useProgram(progSeed);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texField[flip]);
  gl.activeTexture(gl.TEXTURE1);
  gl.bindTexture(gl.TEXTURE_2D, glyphTex[fam]);
  gl.uniform1i(gl.getUniformLocation(progSeed, "field"), 0);
  gl.uniform1i(gl.getUniformLocation(progSeed, "glyph"), 1);
  gl.uniform2f(gl.getUniformLocation(progSeed, "texel"), 1 / SIZE, 1 / SIZE);
  gl.uniform2f(gl.getUniformLocation(progSeed, "center"), x, 1.0 - y);
  gl.uniform1f(gl.getUniformLocation(progSeed, "scalePx"), sizePx);
  gl.uniform1f(gl.getUniformLocation(progSeed, "strength"), 0.9);
  gl.uniform3f(gl.getUniformLocation(progSeed, "tint"), 0, 0, 0);
  gl.uniform1i(gl.getUniformLocation(progSeed, "mode"), 0);
  drawTriangle();
  flip = dst;

  const c = FAM[fam].color;
  const ldst = 1 - labelFlip;
  gl.bindFramebuffer(gl.FRAMEBUFFER, fboLabel[ldst]);
  gl.useProgram(progSeed);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texLabel[labelFlip]);
  gl.activeTexture(gl.TEXTURE1);
  gl.bindTexture(gl.TEXTURE_2D, glyphTex[fam]);
  gl.uniform1i(gl.getUniformLocation(progSeed, "field"), 0);
  gl.uniform1i(gl.getUniformLocation(progSeed, "glyph"), 1);
  gl.uniform2f(gl.getUniformLocation(progSeed, "texel"), 1 / SIZE, 1 / SIZE);
  gl.uniform2f(gl.getUniformLocation(progSeed, "center"), x, 1.0 - y);
  gl.uniform1f(gl.getUniformLocation(progSeed, "scalePx"), sizePx);
  gl.uniform1f(gl.getUniformLocation(progSeed, "strength"), 0.9);
  gl.uniform3f(gl.getUniformLocation(progSeed, "tint"), c[0], c[1], c[2]);
  gl.uniform1i(gl.getUniformLocation(progSeed, "mode"), 1);
  drawTriangle();
  labelFlip = ldst;
}

function labelPass() {
  const dst = 1 - labelFlip;
  gl.bindFramebuffer(gl.FRAMEBUFFER, fboLabel[dst]);
  gl.useProgram(progLabel);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texLabel[labelFlip]);
  gl.uniform1i(gl.getUniformLocation(progLabel, "label"), 0);
  gl.uniform2f(gl.getUniformLocation(progLabel, "texel"), 1 / SIZE, 1 / SIZE);
  drawTriangle();
  labelFlip = dst;
}

function showPass(fade, target, targetSize = SIZE) {
  gl.bindFramebuffer(gl.FRAMEBUFFER, target);
  gl.useProgram(progShow);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texField[flip]);
  gl.activeTexture(gl.TEXTURE1);
  gl.bindTexture(gl.TEXTURE_2D, texLabel[labelFlip]);
  gl.uniform1i(gl.getUniformLocation(progShow, "field"), 0);
  gl.uniform1i(gl.getUniformLocation(progShow, "label"), 1);
  gl.uniform2f(gl.getUniformLocation(progShow, "texel"), 1 / targetSize, 1 / targetSize);
  gl.uniform1f(gl.getUniformLocation(progShow, "fade"), fade);
  drawTriangle();
}

// ------------------------------------------------------------ stats

function readStats() {
  gl.bindFramebuffer(gl.FRAMEBUFFER, miniFbo);
  gl.viewport(0, 0, 64, 64);
  showPass(1.0, miniFbo, 64);
  gl.viewport(0, 0, SIZE, SIZE);
  const px = new Uint8Array(64 * 64 * 4);
  gl.readPixels(0, 0, 64, 64, gl.RGBA, gl.UNSIGNED_BYTE, px);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);

  let ink = 0, sum = 0;
  const famArea = [0, 0, 0, 0, 0, 0, 0];
  const grid = new Uint8Array(64 * 64);
  for (let i = 0; i < 64 * 64; i++) {
    const r = px[i * 4], g = px[i * 4 + 1], b = px[i * 4 + 2];
    const m = Math.max(r, g, b);
    sum += m;
    grid[i] = m > 76 ? 1 : 0;
    if (grid[i]) {
      ink++;
      let best = 0, bestD = 1e9;
      for (let f = 0; f < FAM.length; f++) {
        const c = FAM[f].color;
        const d = (r / 255 - c[0]) ** 2 + (g / 255 - c[1]) ** 2 + (b / 255 - c[2]) ** 2;
        if (d < bestD) { bestD = d; best = f; }
      }
      famArea[best]++;
    }
  }

  const seen = new Uint8Array(64 * 64);
  let blobs = 0;
  for (let i = 0; i < 64 * 64; i++) {
    if (!grid[i] || seen[i]) continue;
    blobs++;
    const stack = [i];
    seen[i] = 1;
    while (stack.length) {
      const q = stack.pop();
      const qx = q % 64, qy = (q / 64) | 0;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = qx + dx, ny = qy + dy;
        if (nx < 0 || nx >= 64 || ny < 0 || ny >= 64) continue;
        const n = ny * 64 + nx;
        if (grid[n] && !seen[n]) { seen[n] = 1; stack.push(n); }
      }
    }
  }

  return {
    coverage: ink / (64 * 64),
    meanInk: sum / (64 * 64) / 255,
    areas: famArea.map((a) => a / Math.max(ink, 1)),
    blobs,
  };
}

// ------------------------------------------------------------ lifecycle

function gsParams(t) {
  const u = Math.min(Math.max((t - GS.ramp0) / (GS.ramp1 - GS.ramp0), 0), 1);
  const s = u * u * (3 - 2 * u);
  return [GS.F0 + (GS.F1 - GS.F0) * s, GS.k0 + (GS.k1 - GS.k0) * s];
}

function advanceSim(t) {
  for (let s = 0; s < SEEDS.length; s++) {
    if (!seededFlags[s] && t >= SEEDS[s][0]) {
      seededFlags[s] = true;
      seedPass(SEEDS[s]);
    }
  }
  const [F, k] = gsParams(t);
  for (let i = 0; i < SIM_STEPS; i++) simPass(F, k);
  labelPass();
}

function fadeAt(t) {
  if (t > DURATION - 0.8) {
    const u = Math.min((t - (DURATION - 0.8)) / 0.65, 1);
    return 1 - u * u * (3 - 2 * u);
  }
  return 1.0;
}

function resetField() {
  gl.bindFramebuffer(gl.FRAMEBUFFER, fboField[0]);
  gl.clearColor(1, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.bindFramebuffer(gl.FRAMEBUFFER, fboLabel[0]);
  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  flip = 0;
  labelFlip = 0;
}

function setupGL(cnv) {
  canvas = cnv;
  gl = canvas.getContext("webgl2", {
    antialias: false,
    preserveDrawingBuffer: true,
  });
  if (!gl) throw new Error("WebGL2 unavailable");
  if (!gl.getExtension("EXT_color_buffer_float")) {
    throw new Error("EXT_color_buffer_float unavailable");
  }
  gl.getExtension("OES_texture_float_linear");

  progSim = link(FRAG_SIM);
  progSeed = link(FRAG_SEED);
  progLabel = link(FRAG_LABEL);
  progShow = link(FRAG_SHOW);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

  [texField[0], fboField[0]] = makeFloatTarget(SIZE, SIZE);
  [texField[1], fboField[1]] = makeFloatTarget(SIZE, SIZE);
  [texLabel[0], fboLabel[0]] = makeFloatTarget(SIZE, SIZE);
  [texLabel[1], fboLabel[1]] = makeFloatTarget(SIZE, SIZE);
  resetField();
  [miniTex, miniFbo] = makeByteTarget(64, 64);

  for (let f = 0; f < FAM.length; f++) {
    glyphTex[f] = makeGlyphTexture(FAM[f].glyph, 192);
  }
}

// p5 lifecycle ------------------------------------------------------------

function setup() {
  live = window.__live === true;
  noCanvas(); // p5 hosts the loop + 2D glyph textures; the GL canvas is ours
  const cnv = document.createElement("canvas");
  cnv.width = SIZE;
  cnv.height = SIZE;
  cnv.id = "morpho";
  document.body.appendChild(cnv);
  setupGL(cnv);
  if (live) {
    frameRate(60);
    liveStart = millis();
  } else {
    noLoop();
    renderAtFrame(0);
    window.__ready = true;
  }
}

function renderAtFrame(i) {
  const t = i / FPS;
  advanceSim(t);
  showPass(fadeAt(t), null);
  if (i % STATS_EVERY === 0) {
    const stats = readStats();
    return { frame: i, t, ...stats, seeded: seededFlags.filter(Boolean).length };
  }
  return { frame: i, t };
}

window.renderFrame = async function (i) {
  const meta = renderAtFrame(i);
  await new Promise((resolve) => requestAnimationFrame(() => resolve()));
  return meta;
};

// live mode: free-running, loops forever (万物复归，循环不息)
function draw() {
  if (!live) return;
  const t = (millis() - liveStart) / 1000;
  const cycle = t % 78; // 62s film + 16s of stillness and rebirth
  if (cycle < DURATION + 6) {
    advanceSim(Math.min(cycle, DURATION));
    showPass(fadeAt(cycle), null);
  } else {
    const u = (cycle - DURATION - 6) / 10;
    if (u > 0.96) {
      resetField();
      seededFlags = SEEDS.map(() => false);
      liveStart = millis();
    } else {
      // the field relaxes toward the sea before the one returns
      const dst = 1 - flip;
      gl.bindFramebuffer(gl.FRAMEBUFFER, fboField[dst]);
      gl.useProgram(progLabel);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texField[flip]);
      gl.uniform1i(gl.getUniformLocation(progLabel, "label"), 0);
      gl.uniform2f(gl.getUniformLocation(progLabel, "texel"), 1 / SIZE, 1 / SIZE);
      drawTriangle();
      flip = dst;
      showPass(1.0, null);
    }
  }
}
