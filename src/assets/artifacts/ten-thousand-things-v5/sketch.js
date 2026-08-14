// 《万物状·生生》 THE FORM OF TEN THOUSAND THINGS: BEGETTING — v5
// Gray-Scott morphogenesis at 1620² on the M4 Max (WebGL2, RGBA16F ping-pong,
// torus). Biome (F,k) field; semi-Lagrangian curl advection + slow rotation;
// bloom + emboss + grain. The five phases arrive as TRIOS of dots; when the
// three colonies fuse, the compound glyph (森焱垚鑫淼众) watermarks briefly at
// the fusion point — born from unions, not stamped as plaintext. At 94s the
// sim steps ramp to zero: time crystallizes. Shared by render.mjs
// (deterministic harness) and live.html (window.__live = true).

const SIZE = 1080;        // display
const SIM = 1620;         // simulation
const FPS = 30;
const DURATION = 100;
const TOTAL_FRAMES = FPS * DURATION;
const STATS_EVERY = 15;

const FAM = [
  { name: "bone",  glyph: "·", compound: null, color: [0.91, 0.89, 0.82], root: 220 },
  { name: "wood",  glyph: "木", compound: "森", color: [0.41, 0.77, 0.57], root: 220 },
  { name: "fire",  glyph: "火", compound: "焱", color: [0.88, 0.39, 0.24], root: 275 },
  { name: "earth", glyph: "土", compound: "垚", color: [0.74, 0.57, 0.29], root: 330 },
  { name: "metal", glyph: "金", compound: "鑫", color: [0.83, 0.84, 0.86], root: 385 },
  { name: "water", glyph: "水", compound: "淼", color: [0.31, 0.64, 0.82], root: 440 },
  { name: "human", glyph: "人", compound: "众", color: [0.91, 0.87, 0.78], root: 495 },
];

// trio schedule: [time, family, cx, cy] — three dots around the point
const TRIOS = [
  [15.0, 1, 0.28, 0.40],
  [25.0, 2, 0.70, 0.30],
  [35.0, 3, 0.72, 0.70],
  [45.0, 4, 0.28, 0.72],
  [55.0, 5, 0.52, 0.24],
  [78.0, 6, 0.50, 0.52],
];
const TRIO_R_UV = 0.075;   // dots' distance from trio center
const DOT_SIGMA = 14;      // sim px
const PRIMORDIAL_T = 1.0;
const PRIMORDIAL_SIGMA = 12;

// Gray-Scott regimes and the arc
const GS = {
  F0: 0.0545, k0: 0.0620,  // mitosis (base biome)
  F1: 0.0370, k1: 0.0600,  // labyrinth (convergence regime)
  ramp0: 35.0, ramp1: 60.0,
};
const SWIRL = { t0: 55.0, t1: 85.0 };
const CRYSTALLIZE = { t0: 94.0, t1: 97.0 };
// advection stays OFF while the field establishes itself, then whispers
const ADV = { t0: 20.0, t1: 40.0 };

let gl, canvas;
let progSim, progSeed, progLabel, progShow, progBright, progBlur, progComposite, progBiome;
let texField = [null, null], fboField = [null, null], flip = 0;
let texLabel = [null, null], fboLabel = [null, null], labelFlip = 0;
let texBiome, fboBiome;
let texDisp, fboDisp;
let texBright, fboBright, texBlurA, fboBlurA, texBlurB, fboBlurB;
let miniTex, miniFbo;
let glyphTex = {};
let trioDone = TRIOS.map(() => false);
let primordialDone = false;
let compoundBorn = {};
let prevFamCounts = [0, 0, 0, 0, 0, 0, 0];
let pendingCompound = null;
let live = false;
let liveStart = 0;

// ------------------------------------------------------------ shaders

const VERT = `#version 300 es
layout(location=0) in vec2 p;
void main(){ gl_Position = vec4(p, 0.0, 1.0); }`;

const FRAG_SIM = `#version 300 es
precision highp float;
uniform sampler2D field;
uniform sampler2D biome;
uniform vec2 texel;
uniform float t;
uniform float swirlU;
uniform float advU;
out vec4 outColor;
vec2 curl(vec2 uv){
  float dpx = 9.0*cos(9.0*uv.x + 0.11*t) + 5.0*cos(5.0*(uv.x+uv.y) + 0.05*t);
  float dpy = -7.0*sin(7.0*uv.y - 0.07*t) + 5.0*cos(5.0*(uv.x+uv.y) + 0.05*t);
  return vec2(dpy, -dpx);
}
void main(){
  vec2 c = gl_FragCoord.xy;
  vec2 uv0 = c * texel;
  // semi-Lagrangian advection: curl whisper + the turning of the world
  vec2 flow = curl(uv0) * (0.9 * advU + 14.0 * swirlU);
  flow += vec2(-(uv0.y - 0.5), uv0.x - 0.5) * swirlU * 1.85 * ${SIM}.0 / 1080.0;
  float fm = length(flow);
  if (fm > 2.2) flow *= 2.2 / fm;
  vec2 uv = texture(field, (c - flow) * texel).rg;
  vec2 Fk = texture(biome, uv0).rg;
  vec2 lap = -uv;
  lap += 0.2  * texture(field, (c - flow + vec2( 1., 0.)) * texel).rg;
  lap += 0.2  * texture(field, (c - flow + vec2(-1., 0.)) * texel).rg;
  lap += 0.2  * texture(field, (c - flow + vec2( 0., 1.)) * texel).rg;
  lap += 0.2  * texture(field, (c - flow + vec2( 0.,-1.)) * texel).rg;
  lap += 0.05 * texture(field, (c - flow + vec2( 1., 1.)) * texel).rg;
  lap += 0.05 * texture(field, (c - flow + vec2(-1., 1.)) * texel).rg;
  lap += 0.05 * texture(field, (c - flow + vec2( 1.,-1.)) * texel).rg;
  lap += 0.05 * texture(field, (c - flow + vec2(-1.,-1.)) * texel).rg;
  float u = uv.r, v = uv.g;
  float uvv = u * v * v;
  outColor = vec4(
    clamp(u + (1.0 * lap.r - uvv + Fk.x * (1.0 - u)), 0.0, 1.0),
    clamp(v + (0.5 * lap.g + uvv - (Fk.x + Fk.y) * v), 0.0, 1.0),
    0.0, 1.0);
}`;

const FRAG_BIOME = `#version 300 es
precision highp float;
uniform vec2 texel;
uniform float u;   // global ramp 0..1 (drift toward labyrinth)
out vec4 outColor;
float gauss(vec2 p, vec2 c, float s){ vec2 d = p - c; return exp(-dot(d,d)/(2.0*s*s)); }
void main(){
  vec2 uv = gl_FragCoord.xy * texel;
  vec2 Fk = vec2(0.0545, 0.0620);                       // mitosis base
  float b1 = gauss(uv, vec2(0.30, 0.35), 0.16);
  float b2 = gauss(uv, vec2(0.72, 0.62), 0.20);
  float b3 = gauss(uv, vec2(0.55, 0.85), 0.13);
  Fk = mix(Fk, vec2(0.0620, 0.0610), min(b1 * 1.4, 1.0)); // coral
  Fk = mix(Fk, vec2(0.0370, 0.0600), min(b2 * 1.3, 1.0)); // labyrinth
  Fk = mix(Fk, vec2(0.0460, 0.0630), min(b3 * 1.3, 1.0)); // worms
  Fk = mix(Fk, vec2(0.0370, 0.0600), u);                  // the weaving era
  outColor = vec4(Fk, 0.0, 1.0);
}`;

// seeds: mode 0 = chemical dot (gaussian), 1 = label color dot,
//        2 = chemical glyph, 3 = label glyph,
//        4 = chemical ring (shockwave), 5 = label ring
const FRAG_SEED = `#version 300 es
precision highp float;
uniform sampler2D field;
uniform sampler2D glyph;
uniform vec2 texel;
uniform vec2 center;
uniform float scalePx;
uniform float strength;
uniform vec3 tint;
uniform int mode;
uniform float simSize;
out vec4 outColor;
void main(){
  vec2 c = gl_FragCoord.xy;
  vec4 cur = texture(field, c * texel);
  float mask = 0.0;
  if (mode == 0 || mode == 1) {
    float d = length(c - center * simSize) / scalePx;
    mask = exp(-d * d * 2.0) * step(d, 2.0);
  } else if (mode == 4 || mode == 5) {
    float d = length(c - center * simSize) / scalePx;
    mask = exp(-pow((d - 1.0) / 0.16, 2.0)) * step(d, 2.5);
  } else {
    vec2 g = (c - center * simSize) / scalePx + 0.5;
    if (all(greaterThanEqual(g, vec2(0.0))) && all(lessThanEqual(g, vec2(1.0)))) {
      mask = texture(glyph, g).a;
    }
  }
  if (mode == 0 || mode == 2 || mode == 4) {
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
  outColor = vec4(cur * 0.9990 + nb * 0.0008, 1.0);
}`;

const FRAG_SHOW = `#version 300 es
precision highp float;
uniform sampler2D field;
uniform sampler2D label;
uniform vec2 texel;       // 1/viewport
uniform vec2 simTexel;    // 1/SIM
uniform float fade;
out vec4 outColor;
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
void main(){
  vec2 c = gl_FragCoord.xy;
  vec2 fg = texture(field, c * texel).rg;
  vec3 lab = texture(label, c * texel).rgb;
  float ink = smoothstep(0.15, 0.30, fg.g);
  // emboss: relief from the V gradient
  vec2 guv = c * texel;
  float gx = texture(field, guv + vec2(simTexel.x, 0.0)).g - texture(field, guv - vec2(simTexel.x, 0.0)).g;
  float gy = texture(field, guv + vec2(0.0, simTexel.y)).g - texture(field, guv - vec2(0.0, simTexel.y)).g;
  float relief = 0.86 + 2.6 * (gx * 0.7 + gy * 0.7);
  vec3 bone = vec3(0.91, 0.89, 0.82);
  vec3 tint = dot(lab, vec3(1.0)) > 0.06 ? lab * 1.35 : bone;
  vec3 col = tint * ink * relief;
  col += lab * 0.16;
  float d = length(c * texel - 0.5) * 1.3;
  col *= 1.0 - 0.22 * smoothstep(0.55, 0.95, d);
  col += (hash(c) - 0.5) * 0.014;
  col = max(col, vec3(0.0));
  outColor = vec4(col * fade, 1.0);
}`;

const FRAG_BRIGHT = `#version 300 es
precision highp float;
uniform sampler2D img;
uniform vec2 texel;
out vec4 outColor;
void main(){
  vec3 c = texture(img, gl_FragCoord.xy * texel).rgb;
  float l = dot(c, vec3(0.299, 0.587, 0.114));
  outColor = vec4(c * smoothstep(0.42, 0.75, l), 1.0);
}`;

const FRAG_BLUR = `#version 300 es
precision highp float;
uniform sampler2D img;
uniform vec2 dir;
uniform vec2 texel;
out vec4 outColor;
void main(){
  float w[5] = float[5](0.227027, 0.1945946, 0.1216216, 0.054054, 0.016216);
  vec3 acc = texture(img, gl_FragCoord.xy * texel).rgb * w[0];
  for (int i = 1; i < 5; i++) {
    acc += texture(img, (gl_FragCoord.xy + dir * float(i)) * texel).rgb * w[i];
    acc += texture(img, (gl_FragCoord.xy - dir * float(i)) * texel).rgb * w[i];
  }
  outColor = vec4(acc, 1.0);
}`;

const FRAG_COMPOSITE = `#version 300 es
precision highp float;
uniform sampler2D img;
uniform sampler2D bloom;
uniform vec2 texel;
out vec4 outColor;
void main(){
  vec3 c = texture(img, gl_FragCoord.xy * texel).rgb;
  vec3 b = texture(bloom, gl_FragCoord.xy * texel).rgb;
  outColor = vec4(min(c + b * 0.38, vec3(1.0)), 1.0);
}`;

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

function makeTarget(w, h, half) {
  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, half ? gl.REPEAT : gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, half ? gl.REPEAT : gl.CLAMP_TO_EDGE);
  if (half) {
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, w, h, 0, gl.RGBA, gl.HALF_FLOAT, null);
  } else {
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  }
  const fbo = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
  if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
    throw new Error("framebuffer incomplete");
  }
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

function simPass(t, swirlU, advU) {
  const dst = 1 - flip;
  gl.viewport(0, 0, SIM, SIM);
  gl.bindFramebuffer(gl.FRAMEBUFFER, fboField[dst]);
  gl.useProgram(progSim);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texField[flip]);
  gl.activeTexture(gl.TEXTURE1);
  gl.bindTexture(gl.TEXTURE_2D, texBiome);
  gl.uniform1i(gl.getUniformLocation(progSim, "field"), 0);
  gl.uniform1i(gl.getUniformLocation(progSim, "biome"), 1);
  gl.uniform2f(gl.getUniformLocation(progSim, "texel"), 1 / SIM, 1 / SIM);
  gl.uniform1f(gl.getUniformLocation(progSim, "t"), t);
  gl.uniform1f(gl.getUniformLocation(progSim, "swirlU"), swirlU);
  gl.uniform1f(gl.getUniformLocation(progSim, "advU"), advU);
  drawTriangle();
  flip = dst;
}

function seedPass(opts) {
  const { mode, fam = 0, x = 0.5, y = 0.5, sizePx = 20, strength = 0.9 } = opts;
  const dst = 1 - flip;
  const isLabel = mode === 1 || mode === 3;
  gl.viewport(0, 0, SIM, SIM);
  if (!isLabel) {
    gl.bindFramebuffer(gl.FRAMEBUFFER, fboField[dst]);
  } else {
    gl.bindFramebuffer(gl.FRAMEBUFFER, fboLabel[1 - labelFlip]);
  }
  gl.useProgram(progSeed);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, isLabel ? texLabel[labelFlip] : texField[flip]);
  gl.activeTexture(gl.TEXTURE1);
  gl.bindTexture(gl.TEXTURE_2D, glyphTex[fam] ?? glyphTex[0]);
  gl.uniform1i(gl.getUniformLocation(progSeed, "field"), 0);
  gl.uniform1i(gl.getUniformLocation(progSeed, "glyph"), 1);
  gl.uniform2f(gl.getUniformLocation(progSeed, "texel"), 1 / SIM, 1 / SIM);
  gl.uniform2f(gl.getUniformLocation(progSeed, "center"), x, 1.0 - y);
  gl.uniform1f(gl.getUniformLocation(progSeed, "scalePx"), sizePx);
  gl.uniform1f(gl.getUniformLocation(progSeed, "strength"), strength);
  const c = FAM[fam].color;
  gl.uniform3f(gl.getUniformLocation(progSeed, "tint"), c[0], c[1], c[2]);
  gl.uniform1i(gl.getUniformLocation(progSeed, "mode"), mode);
  gl.uniform1f(gl.getUniformLocation(progSeed, "simSize"), SIM);
  drawTriangle();
  if (isLabel) labelFlip = 1 - labelFlip;
  else flip = dst;
}

function labelPass() {
  const dst = 1 - labelFlip;
  gl.viewport(0, 0, SIM, SIM);
  gl.bindFramebuffer(gl.FRAMEBUFFER, fboLabel[dst]);
  gl.useProgram(progLabel);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texLabel[labelFlip]);
  gl.uniform1i(gl.getUniformLocation(progLabel, "label"), 0);
  gl.uniform2f(gl.getUniformLocation(progLabel, "texel"), 1 / SIM, 1 / SIM);
  drawTriangle();
  labelFlip = dst;
}

function showPass(fade, target, targetSize = SIZE) {
  gl.viewport(0, 0, targetSize, targetSize);
  gl.bindFramebuffer(gl.FRAMEBUFFER, target);
  gl.useProgram(progShow);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texField[flip]);
  gl.activeTexture(gl.TEXTURE1);
  gl.bindTexture(gl.TEXTURE_2D, texLabel[labelFlip]);
  gl.uniform1i(gl.getUniformLocation(progShow, "field"), 0);
  gl.uniform1i(gl.getUniformLocation(progShow, "label"), 1);
  gl.uniform2f(gl.getUniformLocation(progShow, "texel"), 1 / targetSize, 1 / targetSize);
  gl.uniform2f(gl.getUniformLocation(progShow, "simTexel"), 1 / SIM, 1 / SIM);
  gl.uniform1f(gl.getUniformLocation(progShow, "fade"), fade);
  drawTriangle();
}

function bloomPass() {
  gl.viewport(0, 0, 270, 270);
  gl.bindFramebuffer(gl.FRAMEBUFFER, fboBright);
  gl.useProgram(progBright);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texDisp);
  gl.uniform1i(gl.getUniformLocation(progBright, "img"), 0);
  gl.uniform2f(gl.getUniformLocation(progBright, "texel"), 1 / 270, 1 / 270);
  drawTriangle();
  gl.bindFramebuffer(gl.FRAMEBUFFER, fboBlurA);
  gl.useProgram(progBlur);
  gl.bindTexture(gl.TEXTURE_2D, texBright);
  gl.uniform1i(gl.getUniformLocation(progBlur, "img"), 0);
  gl.uniform2f(gl.getUniformLocation(progBlur, "dir"), 1, 0);
  gl.uniform2f(gl.getUniformLocation(progBlur, "texel"), 1 / 270, 1 / 270);
  drawTriangle();
  gl.bindFramebuffer(gl.FRAMEBUFFER, fboBlurB);
  gl.bindTexture(gl.TEXTURE_2D, texBlurA);
  gl.uniform1i(gl.getUniformLocation(progBlur, "img"), 0);
  gl.uniform2f(gl.getUniformLocation(progBlur, "dir"), 0, 1);
  drawTriangle();
  gl.viewport(0, 0, SIZE, SIZE);
}

function compositePass(target) {
  gl.viewport(0, 0, SIZE, SIZE);
  gl.bindFramebuffer(gl.FRAMEBUFFER, target);
  gl.useProgram(progComposite);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texDisp);
  gl.activeTexture(gl.TEXTURE1);
  gl.bindTexture(gl.TEXTURE_2D, texBlurB);
  gl.uniform1i(gl.getUniformLocation(progComposite, "img"), 0);
  gl.uniform1i(gl.getUniformLocation(progComposite, "bloom"), 1);
  gl.uniform2f(gl.getUniformLocation(progComposite, "texel"), 1 / SIZE, 1 / SIZE);
  drawTriangle();
}

// ------------------------------------------------------------ stats

function readStats(t) {
  gl.bindFramebuffer(gl.FRAMEBUFFER, miniFbo);
  gl.viewport(0, 0, 64, 64);
  showPass(1.0, miniFbo, 64);
  gl.viewport(0, 0, SIZE, SIZE);
  const px = new Uint8Array(64 * 64 * 4);
  gl.readPixels(0, 0, 64, 64, gl.RGBA, gl.UNSIGNED_BYTE, px);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);

  const trioT = [0, 15, 25, 35, 45, 55, 78];
  let ink = 0, sum = 0;
  const famGrid = new Int8Array(64 * 64).fill(-1);
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
      // bone and human share a hue; before the human trio exists,
      // bone-colored blobs are bone, not people
      if (best === 6 && t < trioT[6]) best = 0;
      famGrid[i] = best;
    }
  }

  // per-family connected components (areas + centroids)
  const famArea = [0, 0, 0, 0, 0, 0, 0];
  const famCounts = [0, 0, 0, 0, 0, 0, 0];
  const famBig = new Array(FAM.length).fill(null);
  const seen = new Uint8Array(64 * 64);
  for (let i = 0; i < 64 * 64; i++) {
    if (!grid[i] || seen[i]) continue;
    const f = famGrid[i];
    let area = 0, cx = 0, cy = 0;
    const stack = [i];
    seen[i] = 1;
    while (stack.length) {
      const q = stack.pop();
      const qx = q % 64, qy = (q / 64) | 0;
      area++;
      cx += qx; cy += qy;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = qx + dx, ny = qy + dy;
        if (nx < 0 || nx >= 64 || ny < 0 || ny >= 64) continue;
        const n = ny * 64 + nx;
        if (grid[n] && !seen[n] && famGrid[n] === f) { seen[n] = 1; stack.push(n); }
      }
    }
    famArea[f] += area;
    famCounts[f]++;
    if (!famBig[f] || area > famBig[f].area) {
      famBig[f] = { area, x: cx / area / 64, y: cy / area / 64 };
    }
  }
  // total blob count (any family)
  const seen2 = new Uint8Array(64 * 64);
  let blobs = 0;
  for (let i = 0; i < 64 * 64; i++) {
    if (!grid[i] || seen2[i]) continue;
    blobs++;
    const stack = [i];
    seen2[i] = 1;
    while (stack.length) {
      const q = stack.pop();
      const qx = q % 64, qy = (q / 64) | 0;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = qx + dx, ny = qy + dy;
        if (nx < 0 || nx >= 64 || ny < 0 || ny >= 64) continue;
        const n = ny * 64 + nx;
        if (grid[n] && !seen2[n]) { seen2[n] = 1; stack.push(n); }
      }
    }
  }

  // fusion detection: a family's 3+ colonies merging into fewer
  let compound = null;
  for (let f = 1; f < FAM.length; f++) {
    if (compoundBorn[f] || t < trioT[f]) continue;
    if (prevFamCounts[f] >= 3 && famCounts[f] < prevFamCounts[f] && famBig[f]) {
      compoundBorn[f] = true;
      compound = { fam: f, x: famBig[f].x, y: famBig[f].y };
      stampCompound(f, famBig[f].x, famBig[f].y);
    }
  }
  prevFamCounts = famCounts;

  return {
    coverage: ink / (64 * 64),
    meanInk: sum / (64 * 64) / 255,
    areas: famArea.map((a) => a / Math.max(ink, 1)),
    blobs,
    compound,
  };
}

function stampCompound(fam, x, y) {
  // no letterforms: the compound's birth is a shockwave in the medium —
  // a ring of V expanding through the labyrinth, perturbing the pattern
  // it passes through, ringed in the family hue
  seedPass({ mode: 4, fam, x, y, sizePx: 70, strength: 1.25 });
  seedPass({ mode: 5, fam, x, y, sizePx: 70, strength: 0.8 });
}

// ------------------------------------------------------------ lifecycle

function smoothstep(a, b, x) {
  const u = Math.min(Math.max((x - a) / (b - a), 0), 1);
  return u * u * (3 - 2 * u);
}

function biomeRamp(t) { return smoothstep(GS.ramp0, GS.ramp1, t); }
function swirlAt(t) { return smoothstep(SWIRL.t0, SWIRL.t1, t); }
function advAt(t) { return smoothstep(ADV.t0, ADV.t1, t); }
function simStepsAt(t) {
  return Math.round(24 * (1 - smoothstep(CRYSTALLIZE.t0, CRYSTALLIZE.t1, t)));
}

function advanceSim(t) {
  if (!primordialDone && t >= PRIMORDIAL_T) {
    primordialDone = true;
    seedPass({ mode: 0, x: 0.5, y: 0.5, sizePx: PRIMORDIAL_SIGMA, strength: 0.9 });
  }
  for (let s = 0; s < TRIOS.length; s++) {
    const [tt, fam, cx, cy] = TRIOS[s];
    if (!trioDone[s] && t >= tt) {
      trioDone[s] = true;
      for (let q = 0; q < 3; q++) {
        const a = (Math.PI / 2) + (q * 2 * Math.PI / 3);
        const dx = Math.cos(a) * TRIO_R_UV, dy = Math.sin(a) * TRIO_R_UV;
        seedPass({ mode: 0, fam, x: cx + dx, y: cy + dy, sizePx: DOT_SIGMA, strength: 0.9 });
        seedPass({ mode: 1, fam, x: cx + dx, y: cy + dy, sizePx: DOT_SIGMA * 2.2, strength: 0.9 });
      }
    }
  }
  const steps = simStepsAt(t);
  const sw = swirlAt(t), av = advAt(t);
  for (let i = 0; i < steps; i++) simPass(t, sw, av);
  labelPass();
}

function fadeAt(t) {
  if (t > DURATION - 1.6) {
    return 1 - smoothstep(DURATION - 1.6, DURATION - 0.25, t);
  }
  return 1.0;
}

function renderAtFrame(i) {
  const t = i / FPS;
  advanceSim(t);
  showPass(fadeAt(t), fboDisp);
  bloomPass();
  compositePass(null);
  if (i % STATS_EVERY === 0) {
    const stats = readStats(i / FPS);
    return { frame: i, t, ...stats, seeded: trioDone.filter(Boolean).length };
  }
  return { frame: i, t };
}

window.renderFrame = async function (i) {
  const meta = renderAtFrame(i);
  await new Promise((resolve) => requestAnimationFrame(() => resolve()));
  return meta;
};

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
  progBright = link(FRAG_BRIGHT);
  progBlur = link(FRAG_BLUR);
  progComposite = link(FRAG_COMPOSITE);
  progBiome = link(FRAG_BIOME);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

  [texField[0], fboField[0]] = makeTarget(SIM, SIM, true);
  [texField[1], fboField[1]] = makeTarget(SIM, SIM, true);
  [texLabel[0], fboLabel[0]] = makeTarget(SIM, SIM, false);
  [texLabel[1], fboLabel[1]] = makeTarget(SIM, SIM, false);
  [texBiome, fboBiome] = makeTarget(SIM, SIM, false);
  [texDisp, fboDisp] = makeTarget(SIZE, SIZE, false);
  [texBright, fboBright] = makeTarget(270, 270, false);
  [texBlurA, fboBlurA] = makeTarget(270, 270, false);
  [texBlurB, fboBlurB] = makeTarget(270, 270, false);
  [miniTex, miniFbo] = makeTarget(64, 64, false);
  resetField();

  // biome (F,k) field, static per ramp u=0 at start — NOTE: the fbo is
  // SIM-sized, so the viewport must be set explicitly (it does NOT
  // follow the framebuffer; a stale 1080 viewport writes only the
  // bottom-left 2/3 and leaves the rest uninitialized)
  gl.viewport(0, 0, SIM, SIM);
  gl.bindFramebuffer(gl.FRAMEBUFFER, fboBiome);
  gl.useProgram(progBiome);
  gl.uniform2f(gl.getUniformLocation(progBiome, "texel"), 1 / SIM, 1 / SIM);
  gl.uniform1f(gl.getUniformLocation(progBiome, "u"), 0.0);
  drawTriangle();
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.viewport(0, 0, SIZE, SIZE);

  for (let f = 0; f < FAM.length; f++) {
    glyphTex[f] = makeGlyphTexture(FAM[f].compound ?? FAM[f].glyph, 192);
  }
}

function updateBiome(t) {
  gl.viewport(0, 0, SIM, SIM);
  gl.bindFramebuffer(gl.FRAMEBUFFER, fboBiome);
  gl.useProgram(progBiome);
  gl.uniform2f(gl.getUniformLocation(progBiome, "texel"), 1 / SIM, 1 / SIM);
  gl.uniform1f(gl.getUniformLocation(progBiome, "u"), biomeRamp(t));
  drawTriangle();
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.viewport(0, 0, SIZE, SIZE);
}

// p5 lifecycle ------------------------------------------------------------

function setup() {
  live = window.__live === true;
  noCanvas();
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

// biome update every 10 frames
const origRender = renderAtFrame;
renderAtFrame = function (i) {
  if (i % 10 === 0) updateBiome(i / FPS);
  return origRender(i);
};

function draw() {
  if (!live) return;
  const t = (millis() - liveStart) / 1000;
  const cycle = t % (DURATION + 18);
  if (cycle < DURATION + 6) {
    const ct = Math.min(cycle, DURATION);
    if (frameCount % 10 === 0) updateBiome(ct);
    advanceSim(ct);
    showPass(fadeAt(ct), fboDisp);
    bloomPass();
    compositePass(null);
  } else {
    const u = (cycle - DURATION - 6) / 12;
    if (u > 0.96) {
      resetField();
      trioDone = TRIOS.map(() => false);
      primordialDone = false;
      compoundBorn = {};
      prevFamCounts = [0, 0, 0, 0, 0, 0, 0];
      updateBiome(0);
      liveStart = millis();
    } else {
      const dst = 1 - flip;
      gl.bindFramebuffer(gl.FRAMEBUFFER, fboField[dst]);
      gl.useProgram(progLabel);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texField[flip]);
      gl.uniform1i(gl.getUniformLocation(progLabel, "label"), 0);
      gl.uniform2f(gl.getUniformLocation(progLabel, "texel"), 1 / SIM, 1 / SIM);
      drawTriangle();
      flip = dst;
      compositePass(null);
    }
  }
}
