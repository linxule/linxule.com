/* EIGENPLATE — the instrument from EIGEN, playable.
   Physics identical to nodal/tools/compose.py:
   modes f = 55*sqrt((m^2+n^2)/2), shape sin(m*pi*x)sin(n*pi*y), tau = clamp(9*55/f).
   Touch = position is the chord. Sand + displacement shading = the film's picture.
   The rift slider is OMBAK as a performance parameter: a second, identical plate
   detuned 0-50 cents; the beat is heard and seen. The recorder writes every
   gesture as a nodal-schema score; the performer replays scores as ghost touches
   through the same engine — replay is re-performance, not playback. */
"use strict";

const EP = window.EIGENPLATE;
const MODES = EP.modes;              // [{m,n,ratio,f_hz}] x52
const NM = MODES.length;
const F0 = EP.f0;
const OMBAK = EP.ombak_detune;       // +-0.12% per partial, baked in as in the film
const MAP = 0.9 / F0;                // audio Hz -> visual Hz (the film's F11_SIM)

const KINDS = {
  strike: { contact: 2600, tau0: 9.0, tauMin: 0.06, tauMax: 4.5, click: 0.2 },
  damped: { contact: 6000, tau0: 0.8, tauMin: 0.03, tauMax: 0.35, click: 0.6 },
  boom:   { contact: 900,  tau0: 1.4, tauMin: 0.05, tauMax: 0.9,  click: 0.5, voiced: 0, sigma: 0.30 },
};

function nearestDegree(f) {
  let best = 0, bd = 1e9;
  for (const d of EP.degrees) {
    const c = Math.abs(1200 * Math.log2(f / d.f_hz));
    if (c < bd) { bd = c; best = d.degree; }
  }
  return best;
}
function degMode(degree) {           // compose.deg_mode: base mode, doubled by period
  const p = Math.floor(degree / 11), i = degree % 11;
  const r = EP.degree_ratios[i];
  const md = MODES.find(m => Math.abs(m.ratio - r) < 1e-9);
  return [md.m * (2 ** p), md.n * (2 ** p)];
}
function antinodes(m, n) {
  const out = [];
  for (let i = 0; i < m; i++) for (let j = 0; j < n; j++)
    out.push([(2 * i + 1) / (2 * m), (2 * j + 1) / (2 * n)]);
  return out;
}

/* One touch -> per-mode weights. focusSigma null = raw plate. */
function computeGains(nx, ny, force, kind, focusSigma, voicedDeg) {
  const K = KINDS[kind] || KINDS.strike;
  let voiced = voicedDeg != null ? voicedDeg : K.voiced;
  let sigma = focusSigma != null ? focusSigma : K.sigma;
  const raw = MODES.map((md, k) => {
    const w = Math.abs(Math.sin(md.m * Math.PI * nx) * Math.sin(md.n * Math.PI * ny));
    return { k, w: w / (1 + (md.f_hz / K.contact) ** 2) };
  });
  if (voiced == null && sigma != null) {
    const top = raw.reduce((a, b) => (b.w > a.w ? b : a));
    voiced = nearestDegree(MODES[top.k].f_hz);
  }
  const target = voiced != null ? EP.degrees[voiced].f_hz : null;
  const out = [];
  for (const { k, w } of raw) {
    if (w < 0.03) continue;
    const md = MODES[k];
    let ww = w;
    if (sigma != null && target) {
      const dOct = Math.log2(md.f_hz / target);
      ww *= Math.exp(-0.5 * (dOct / sigma) ** 2);
      if (Math.abs(md.f_hz - target) < 1e-9) ww = 1.0;
    }
    const tau = Math.min(Math.max(K.tau0 * (F0 / md.f_hz), K.tauMin), K.tauMax);
    out.push({ k, m: md.m, n: md.n, f: md.f_hz, amp: force * ww, tau });
  }
  return { gains: out, click: K.click, voiced };
}

/* ---- audio graph (works on AudioContext and OfflineAudioContext) ---- */
function spawnStrike(ctx, dest, gains, click, force, nx, when, riftCents = 0) {
  const pan = Math.max(-0.9, Math.min(0.9, (nx - 0.5) * 1.4));
  const R = 2 ** (riftCents / 1200);
  const plates = riftCents > 0.01 ? [1, R] : [1];      // two plates split the energy
  for (const g of gains) {
    if (g.amp < 0.004) continue;
    const pn = ctx.createStereoPanner();
    pn.pan.value = pan;
    pn.connect(dest);
    for (const pf of plates) {
      for (const det of [1 + OMBAK, 1 - OMBAK]) {
        const o = ctx.createOscillator();
        o.frequency.value = g.f * pf * det;
        const gn = ctx.createGain();
        gn.gain.setValueAtTime(g.amp * 0.5 / plates.length, when);
        gn.gain.setTargetAtTime(0, when, g.tau);   // exp(-t/tau), as the film
        o.connect(gn).connect(pn);
        o.start(when);
        o.stop(when + 6 * g.tau + 0.1);
      }
    }
  }
  if (click > 0) {
    const L = Math.floor(0.006 * ctx.sampleRate);
    const nb = ctx.createBuffer(1, L, ctx.sampleRate);
    const d = nb.getChannelData(0);
    for (let i = 0; i < L; i++) d[i] = (Math.random() * 2 - 1) * Math.exp(-(i / ctx.sampleRate) / 0.0015);
    const src = ctx.createBufferSource();
    src.buffer = nb;
    const gn = ctx.createGain();
    gn.gain.value = click * force;
    src.connect(gn).connect(dest);
    src.start(when);
  }
}

/* ================= live instrument ================= */
const canvas = document.getElementById("plate");
const readout = document.getElementById("readout");
const focusSlider = document.getElementById("focus");
const focusVal = document.getElementById("focusval");
const riftSlider = document.getElementById("rift");
const riftVal = document.getElementById("riftval");

let ctx = null, master = null, shaper = null;
function audio() {
  if (ctx) return ctx;
  ctx = new (window.AudioContext || window.webkitAudioContext)();
  shaper = ctx.createWaveShaper();
  const curve = new Float32Array(2048);
  for (let i = 0; i < 2048; i++) {
    const x = (i / 2047) * 6 - 3;
    curve[i] = Math.tanh(x * 0.9) / Math.tanh(0.9);
  }
  shaper.curve = curve;
  master = ctx.createGain();
  master.gain.value = 0.85;
  master.connect(shaper).connect(ctx.destination);
  return ctx;
}

function focusSigma() {
  const v = +focusSlider.value;
  if (v === 0) return null;
  return 0.5 - 0.42 * (v / 100);          // 0.50 .. 0.08 octaves
}
focusSlider.oninput = () => {
  focusVal.textContent = focusSigma() == null ? "raw" : "σ " + focusSigma().toFixed(2);
};
function riftCents() { return +riftSlider.value; }
riftSlider.oninput = () => {
  riftVal.textContent = riftCents() === 0 ? "unison" : "+" + riftCents() + "¢";
};

/* visual modal state — one number per mode, the sand and shading read this */
const gvis = new Float64Array(NM);
const tvis = new Float64Array(NM).fill(1);
const phase = new Float64Array(NM);
const lfoRate = new Float64Array(NM);
const lfoSeed = new Float64Array(NM);
for (let k = 0; k < NM; k++) {
  phase[k] = Math.random() * 6.283;
  lfoRate[k] = 0.07 + Math.random() * 0.14;      // the film's per-mode slow swell
  lfoSeed[k] = Math.random() * 6.283;
}
let shakeT = 0;
const flashes = [];                               // (t_perfnow, x, y) strike rings

function strikeAt(nx, ny, force, kind, opts = {}) {
  const c = audio();
  if (c.state === "suspended") c.resume();
  const { gains, click, voiced } = computeGains(
    nx, ny, force, kind,
    opts.sigma !== undefined ? opts.sigma : focusSigma(),
    opts.voiced !== undefined ? opts.voiced : null);
  spawnStrike(c, master, gains, opts.click ?? click, force, nx, c.currentTime, riftCents());
  for (const g of gains) { gvis[g.k] = Math.max(gvis[g.k], g.amp); tvis[g.k] = g.tau; }
  shakeT = Math.max(shakeT, kind === "boom" ? 0.45 : 0.22);
  flashes.push([performance.now(), nx, ny]);
  if (!opts.fromReplay) recPush(strikeEvent(gains, voiced, nx, ny, force, kind, opts));
  showReadout(gains, voiced, nx, ny);
}
function strikeEvent(gains, voiced, nx, ny, force, kind, opts) {
  const top = gains.reduce((a, b) => (b.amp > a.amp ? b : a), { amp: 0 });
  const deg = voiced != null ? voiced : nearestDegree(top.f || F0);
  if (kind === "damped" || kind === "boom")
    return { kind: "tap", tkind: kind, x: +nx.toFixed(4), y: +ny.toFixed(4), amp: force };
  return { kind: "strike", degree: deg, x: +nx.toFixed(4), y: +ny.toFixed(4),
           amp: force, sigma_oct: opts.sigma ?? focusSigma() ?? 0.17, click: 0.22 };
}

/* ---- bows: sustained excitation, one per held pointer (multi-touch) ---- */
const bows = new Map();   // pointerId -> bow instance

function startBow(id, nx, ny, force, opts = {}) {
  const c = audio();
  const b = { nodes: new Map(), noise: null, noiseGain: null,
              nx, ny, force, t0: performance.now(), opts, active: true };
  bows.set(id, b);
  const nb = c.createBuffer(1, c.sampleRate, c.sampleRate);
  const d = nb.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  const src = c.createBufferSource();
  src.buffer = nb; src.loop = true;
  const bp = c.createBiquadFilter();
  bp.type = "bandpass"; bp.frequency.value = 1500; bp.Q.value = 0.8;
  b.noiseGain = c.createGain();
  b.noiseGain.gain.value = 0;
  b.noiseGain.gain.linearRampToValueAtTime(0.012 * force, c.currentTime + 0.4);
  src.connect(bp).connect(b.noiseGain).connect(master);
  src.start();
  b.noise = src;
  retargetBow(b, nx, ny);
}

function retargetBow(b, nx, ny) {
  const c = ctx, now = c.currentTime;
  b.nx = nx; b.ny = ny;
  const { gains } = computeGains(nx, ny, b.force, "strike",
    b.opts.sigma !== undefined ? b.opts.sigma : focusSigma(),
    b.opts.voiced !== undefined ? b.opts.voiced : null);
  gains.sort((a, bb) => bb.amp - a.amp);
  const wanted = new Map();
  for (const g of gains.slice(0, 10)) wanted.set(g.k, g);
  for (const [k, nd] of b.nodes) {
    if (!wanted.has(k)) {
      nd.gn.gain.setTargetAtTime(0, now, 0.09);
      if (!nd.fading) { nd.fading = true; setTimeout(() => stopBowNode(b, k), 1200); }
    }
  }
  const pan = Math.max(-0.9, Math.min(0.9, (nx - 0.5) * 1.4));
  const R = 2 ** (riftCents() / 1200);
  const plates = riftCents() > 0.01 ? [1, R] : [1];
  for (const [k, g] of wanted) {
    const target = g.amp * 0.4;
    let nd = b.nodes.get(k);
    if (!nd) {
      const gn = c.createGain();
      gn.gain.value = 0;
      const pn = c.createStereoPanner();
      pn.pan.value = pan;
      gn.connect(pn).connect(master);
      const dets = [1, 1.0015];                       // the film's bow shimmer
      const oscs = [];
      for (const pf of plates) {
        for (let i = 0; i < 2; i++) {
          const o = c.createOscillator();
          o.frequency.value = g.f * pf * dets[i];
          const og = c.createGain();
          og.gain.value = (i === 0 ? 1 : 0.6) / plates.length;
          o.connect(og).connect(gn);
          o.start();
          oscs.push(o);
        }
      }
      nd = { gn, oscs, fading: false };
      b.nodes.set(k, nd);
    }
    nd.fading = false;
    nd.gn.gain.setTargetAtTime(target, now, 0.09);
    gvis[k] = Math.max(gvis[k], target * 2.2);   // sustained excitation reads brighter
    tvis[k] = g.tau;
  }
}

function stopBowNode(b, k) {
  const nd = b.nodes.get(k);
  if (!nd || !nd.fading) return;
  nd.oscs.forEach(o => { try { o.stop(); } catch (e) {} });
  nd.gn.disconnect();
  b.nodes.delete(k);
}

function endBow(id) {
  const b = bows.get(id);
  if (!b || !b.active) return;
  b.active = false;
  bows.delete(id);
  const now = ctx.currentTime;
  if (b.noise) {
    b.noiseGain.gain.setTargetAtTime(0, now, 0.05);
    const src = b.noise;
    setTimeout(() => { try { src.stop(); } catch (e) {} }, 400);
  }
  let topK = -1, topG = 0;
  for (const [k, nd] of b.nodes) {
    const md = MODES[k];
    const tau = Math.min(Math.max(9 * (F0 / md.f_hz), 0.06), 4.5);
    nd.gn.gain.setTargetAtTime(0, now, tau);
    nd.fading = true;
    tvis[k] = tau;                                // visual rings on like a strike
    if (nd.gn.gain.value > topG) { topG = nd.gn.gain.value; topK = k; }
    setTimeout(() => stopBowNode(b, k), (6 * tau + 0.2) * 1000);
  }
  if (!b.opts.fromReplay && topK >= 0) {
    const dur = (performance.now() - b.t0) / 1000;
    recPush({ kind: "bow", dur: +dur.toFixed(3), degree: nearestDegree(MODES[topK].f_hz),
              amp: +(b.force * 0.5).toFixed(3) });
  }
}

/* ---- sub voice (replay only; the plate does not feel it, as in the film) ---- */
function subVoice(t1minusT0, amp, attack = 3.0) {
  const c = audio(), now = c.currentTime;
  const o = c.createOscillator();
  o.frequency.value = F0;
  const g = c.createGain();
  g.gain.setValueAtTime(0, now);
  g.gain.linearRampToValueAtTime(amp, now + Math.min(attack, t1minusT0 / 2));
  g.gain.setValueAtTime(amp, now + Math.max(attack, t1minusT0 - attack));
  g.gain.linearRampToValueAtTime(0, now + t1minusT0);
  o.connect(g).connect(master);
  o.start(now); o.stop(now + t1minusT0 + 0.1);
}

/* ---- recorder: every gesture becomes a nodal-schema score ---- */
const rec = { t0: null, events: [] };
function recPush(e) {
  if (!e) return;
  if (rec.t0 == null) rec.t0 = performance.now();
  e.t = +(((performance.now() - rec.t0) / 1000).toFixed(3));
  rec.events.push(e);
}
function exportScore() {
  const data = { f0: F0, sr: 48000, events: rec.events };
  const blob = new Blob([JSON.stringify(data, null, 1)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "eigenplate-score.json";
  a.click();
  const enc = btoa(unescape(encodeURIComponent(JSON.stringify(rec.events))));
  if (enc.length < 6000) history.replaceState(null, "", "#score=" + enc);
  readout.textContent = `score: ${rec.events.length} gestures — downloaded` +
    (enc.length < 6000 ? " · in URL" : "");
}

/* ---- performer: replay a score as ghost touches through the same engine ---- */
const perf = { active: false, timers: [], fired: 0, ghost: null };
function cancelPerform() {
  perf.active = false;
  perf.timers.forEach(clearTimeout);
  perf.timers = [];
  for (const id of [...bows.keys()]) if (String(id).startsWith("perf")) endBow(id);
  perf.ghost = null;
}
function perform(events, opts = {}) {
  cancelPerform();
  const speed = opts.speed || 1;
  perf.active = true; perf.fired = 0;
  for (const e of events) {
    const dt = ((e.t ?? e.t0 ?? 0) * 1000) / speed;
    perf.timers.push(setTimeout(() => { if (perf.active) fireEvent(e, speed); }, dt));
  }
}
let perfSeq = 0;
function fireEvent(e, speed) {
  perf.fired++;
  if (e.kind === "strike") {
    strikeAt(e.x, e.y, e.amp, "strike",
      { voiced: e.degree, sigma: e.sigma_oct ?? 0.17, click: e.click ?? 0.22, fromReplay: true });
    perf.ghost = [e.x, e.y];
  } else if (e.kind === "tap") {
    strikeAt(e.x, e.y, e.amp, e.tkind === "boom" ? "boom" : "damped", { fromReplay: true });
    perf.ghost = [e.x, e.y];
  } else if (e.kind === "bow") {
    const [m, n] = degMode(e.degree);
    const [bx, by] = antinodes(Math.min(m, 8), Math.min(n, 8))[0];
    const id = "perf" + (perfSeq++);
    startBow(id, bx, by, Math.min(1, e.amp * 2.2), { fromReplay: true, voiced: e.degree, sigma: 0.14 });
    perf.ghost = [bx, by];
    perf.timers.push(setTimeout(() => endBow(id), (e.dur * 1000) / speed));
  } else if (e.kind === "sub") {
    subVoice((e.t1 - e.t0) / speed, e.amp, Math.min(e.attack ?? 3, 3));
  } else if (e.kind === "sweep") {
    /* a sweep is a frequency glide; choreograph as a slow bow drag (blooms follow) */
    const up = e.r1 > e.r0, durS = ((e.t1 - e.t0) * 1000) / speed;
    const id = "perf" + (perfSeq++);
    const bx0 = up ? 0.2 : 0.8;
    startBow(id, bx0, 0.5, Math.min(1, e.amp * 2.5), { fromReplay: true, sigma: 0.5 });
    const t0 = performance.now();
    const step = setInterval(() => {
      const b = bows.get(id);
      if (!b) { clearInterval(step); return; }
      const u = Math.min(1, (performance.now() - t0) / durS);
      const bx = up ? 0.2 + 0.6 * u : 0.8 - 0.6 * u;
      retargetBow(b, bx, 0.5);
      perf.ghost = [bx, 0.5];
      if (u >= 1) { clearInterval(step); endBow(id); }
    }, 50);
    perf.timers.push(step);
  }
}

/* ---- pointer grammar: every pointer is its own touch (multi-touch polyphony) ---- */
const pdowns = new Map();   // pointerId -> {nx, ny, t, moved, force, bowTimer}

function platePos(e) {
  const r = canvas.getBoundingClientRect();
  return {
    nx: Math.min(0.999, Math.max(0.001, (e.clientX - r.left) / r.width)),
    ny: Math.min(0.999, Math.max(0.001, (e.clientY - r.top) / r.height)),
  };
}
function forceOf(e) {
  return e.pressure && e.pressure !== 0.5 ? Math.min(1, e.pressure) : 0.72;
}

canvas.addEventListener("pointerdown", e => {
  e.preventDefault();
  canvas.focus({ preventScroll: true });
  cancelPerform();
  try { canvas.setPointerCapture(e.pointerId); } catch (err) {}
  const { nx, ny } = platePos(e);
  const pd = { nx, ny, t: performance.now(), moved: 0, force: forceOf(e),
               bowTimer: null };
  pd.bowTimer = setTimeout(() => {
    const cur = pdowns.get(e.pointerId);
    if (cur && cur.moved < 8) startBow(e.pointerId, cur.nx, cur.ny, cur.force);
  }, 200);
  pdowns.set(e.pointerId, pd);
});
canvas.addEventListener("pointermove", e => {
  const pd = pdowns.get(e.pointerId);
  if (!pd) return;
  const { nx, ny } = platePos(e);
  pd.moved += Math.hypot(nx - pd.nx, ny - pd.ny) * canvas.width;
  pd.nx = nx; pd.ny = ny;
  const b = bows.get(e.pointerId);
  if (b) retargetBow(b, nx, ny);
});
function pointerDone(e, fire) {
  const pd = pdowns.get(e.pointerId);
  if (pd) {
    clearTimeout(pd.bowTimer);
    pdowns.delete(e.pointerId);
  }
  if (bows.has(e.pointerId)) { endBow(e.pointerId); }
  else if (fire && pd) {
    const kind = e.altKey ? "boom" : e.shiftKey ? "damped" : "strike";
    strikeAt(pd.nx, pd.ny, pd.force, kind);
  }
}
canvas.addEventListener("pointerup", e => pointerDone(e, true));
canvas.addEventListener("pointercancel", e => pointerDone(e, false));

window.addEventListener("keydown", e => {
  if (e.key === "r" || e.key === "R") redust(0.08);
  else if (e.key === "e" || e.key === "E") exportScore();
  else if (e.key === "1" && window.EIGENPLATE_REPERTOIRE) {
    readout.textContent = "performing: " + window.EIGENPLATE_REPERTOIRE.name;
    perform(window.EIGENPLATE_REPERTOIRE.events);
  }
  else if (e.key === "Escape") cancelPerform();
});

/* on load: a score in the URL performs itself */
if (location.hash.startsWith("#score=")) {
  try {
    const events = JSON.parse(decodeURIComponent(escape(atob(location.hash.slice(7)))));
    setTimeout(() => perform(events), 800);
    readout.textContent = `performing shared score — ${events.length} gestures`;
  } catch (err) { console.warn("bad score hash", err); }
}

/* ---- readout ---- */
function showReadout(gains, voiced, nx, ny) {
  if (!gains.length) { readout.textContent = "(a node — nothing rang)"; return; }
  const top = gains.reduce((a, b) => (b.amp > a.amp ? b : a));
  const deg = nearestDegree(top.f);
  const rift = riftCents();
  readout.textContent =
    `deg ${deg} · ${top.f.toFixed(1)} Hz · mode (${top.m},${top.n}) · ${gains.length} modes` +
    (voiced != null ? ` · voiced ${voiced}` : "") +
    (rift > 0 ? ` · beat ${(top.f * (2 ** (rift / 1200) - 1)).toFixed(2)} Hz` : "") +
    `\n(${nx.toFixed(3)}, ${ny.toFixed(3)})`;
}

/* ---- sand + breath: the film's rules, ported ---- */
const N = 96;
const NPART = 60000;
const px = new Float32Array(NPART), py = new Float32Array(NPART);
function redust(frac) {
  for (let i = 0; i < NPART; i++) {
    if (Math.random() < frac) { px[i] = 0.01 + Math.random() * 0.98; py[i] = 0.01 + Math.random() * 0.98; }
  }
}
for (let i = 0; i < NPART; i++) { px[i] = 0.01 + Math.random() * 0.98; py[i] = 0.01 + Math.random() * 0.98; }

const E = new Float32Array(N * N), Eb = new Float32Array(N * N), En = new Float32Array(N * N);
const gx = new Float32Array(N * N), gy = new Float32Array(N * N);
const Uf = new Float32Array(N * N);             // instantaneous displacement (breath)
const phiCache = new Map();                      // SIGNED phi (squared on the fly for E)
let peakT = 1e-9, umaxT = 1e-9;

function phiOf(k) {
  let P = phiCache.get(k);
  if (P) return P;
  P = new Float32Array(N * N);
  const md = MODES[k];
  for (let j = 0; j < N; j++) {
    const sy = Math.sin(md.n * Math.PI * (j + 0.5) / N);
    for (let i = 0; i < N; i++)
      P[j * N + i] = Math.sin(md.m * Math.PI * (i + 0.5) / N) * sy;
  }
  phiCache.set(k, P);
  return P;
}
function blur3(src, dst) {
  for (let j = 0; j < N; j++) {
    for (let i = 0; i < N; i++) {
      const l = src[j * N + Math.max(0, i - 1)], r = src[j * N + Math.min(N - 1, i + 1)];
      dst[j * N + i] = (l + src[j * N + i] + r) / 3;
    }
  }
  for (let j = 0; j < N; j++) {
    for (let i = 0; i < N; i++) {
      const u = dst[Math.max(0, j - 1) * N + i], d = dst[Math.min(N - 1, j + 1) * N + i];
      src[j * N + i] = (u + dst[j * N + i] + d) / 3;
    }
  }
  for (let i = 0; i < N * N; i++) dst[i] = src[i];
}
function bilin(A, x, y) {
  const xi = Math.min(N - 1.001, Math.max(0, x));
  const yi = Math.min(N - 1.001, Math.max(0, y));
  const x0 = xi | 0, y0 = yi | 0, fx = xi - x0, fy = yi - y0;
  const i00 = y0 * N + x0;
  return A[i00] * (1 - fx) * (1 - fy) + A[i00 + 1] * fx * (1 - fy)
       + A[i00 + N] * (1 - fx) * fy + A[i00 + N + 1] * fx * fy;
}

const off = document.createElement("canvas");
off.width = off.height = 480;
const offCtx = off.getContext("2d");
const imgData = offCtx.createImageData(480, 480);
const vig = new Float32Array(480 * 480);
for (let j = 0; j < 480; j++)
  for (let i = 0; i < 480; i++)
    vig[j * 480 + i] = 1 - 0.55 * (((i - 240) / (480 * 0.62)) ** 2 + ((j - 240) / (480 * 0.62)) ** 2);

const dens = new Float32Array(480 * 480);
const ctx2d = canvas.getContext("2d");
let lastT = null;               /* rAF's first timestamp can PREDATE module time —
                                   a negative first dt turns sqrt(dt) into NaN and
                                   kills every grain at once. Clamp, always. */
let lastReadout = 0;

function frame(now) {
  if (lastT == null) lastT = now;
  const dt = Math.max(0, Math.min(0.05, (now - lastT) / 1000));
  lastT = now;
  const tS = now / 1000;

  /* decay modal state (bowed modes hold while the bow is down) */
  let any = false;
  for (let k = 0; k < NM; k++) {
    if (gvis[k] > 1e-4) { gvis[k] *= Math.exp(-dt / tvis[k]); any = true; }
    else gvis[k] = 0;
  }
  for (const b of bows.values()) {
    for (const [k, nd] of b.nodes) {
      const v = nd.gn.gain.value * 2.2;
      if (v > gvis[k]) { gvis[k] = v; any = true; }
    }
  }
  if (shakeT > 0) shakeT -= dt;

  /* energy + displacement fields (the film: E = sum a^2 phi^2, u = sum a phi sin) */
  E.fill(0);
  Uf.fill(0);
  const R = 2 ** (riftCents() / 1200);
  const rifted = riftCents() > 0.01;
  let umax = 0;
  if (any) {
    for (let k = 0; k < NM; k++) {
      const g = gvis[k];
      if (g < 0.002) continue;
      const P = phiOf(k), w = g * g;
      const fSim = MODES[k].f_hz * MAP;
      phase[k] += 2 * Math.PI * fSim * dt;
      const a = g * (1 + 0.045 * Math.sin(2 * Math.PI * lfoRate[k] * tS + lfoSeed[k]));
      let s = Math.sin(phase[k]);
      if (rifted) s = 0.5 * (s + Math.sin(phase[k] * R));   // the beat, seen
      const av = a * s * 3.0;
      for (let i = 0; i < N * N; i++) {
        E[i] += w * P[i] * P[i];
        Uf[i] += av * P[i];
      }
    }
    for (let i = 0; i < N * N; i++) { const au = Math.abs(Uf[i]); if (au > umax) umax = au; }
  }
  umaxT = Math.max(umax, umaxT * 0.995, 1e-9);
  blur3(E, Eb); blur3(Eb, E);
  let mx = 0;
  for (let i = 0; i < N * N; i++) if (E[i] > mx) mx = E[i];
  peakT = Math.max(mx, peakT * 0.995, 1e-9);
  for (let i = 0; i < N * N; i++) En[i] = Math.pow(Math.min(1, E[i] / peakT), 0.75);
  for (let j = 1; j < N - 1; j++)
    for (let i = 1; i < N - 1; i++) {
      gx[j * N + i] = (En[j * N + i + 1] - En[j * N + i - 1]) / 2;
      gy[j * N + i] = (En[(j + 1) * N + i] - En[(j - 1) * N + i]) / 2;
    }

  /* grains (the film's rule: down-gradient drift, energy jitter, bevel, rain) */
  const sh = shakeT > 0 ? 1 : 0;
  const sdt = Math.sqrt(dt) * 3;
  const mEdge = 9 / N, rainK = Math.floor(NPART * 0.008 * dt);
  for (let p = 0; p < NPART; p++) {
    const X = px[p] * (N - 1), Y = py[p] * (N - 1);
    const e = bilin(En, X, Y);
    let vx = -bilin(gx, X, Y), vy = -bilin(gy, X, Y);
    const nrm = Math.hypot(vx, vy) + 1e-9;
    const drift = 50 * Math.min(e * 6, 1);
    const jit = (2.6 * e + 0.006 + sh * 3) * sdt;
    px[p] += (vx / nrm) * drift * dt / N + (Math.random() * 2 - 1) * 1.2247 * jit / N;
    py[p] += (vy / nrm) * drift * dt / N + (Math.random() * 2 - 1) * 1.2247 * jit / N;
    if (px[p] < mEdge) px[p] += (mEdge - px[p]) * 0.5 * dt * 30;
    if (px[p] > 1 - mEdge) px[p] += (1 - mEdge - px[p]) * 0.5 * dt * 30;
    if (py[p] < mEdge) py[p] += (mEdge - py[p]) * 0.5 * dt * 30;
    if (py[p] > 1 - mEdge) py[p] += (1 - mEdge - py[p]) * 0.5 * dt * 30;
    px[p] = Math.min(0.996, Math.max(0.004, px[p]));
    py[p] = Math.min(0.996, Math.max(0.004, py[p]));
  }
  for (let r = 0; r < rainK; r++) {
    const i = (Math.random() * NPART) | 0;
    if (px[i] < 0.09 || px[i] > 0.91 || py[i] < 0.09 || py[i] > 0.91) {
      px[i] = 0.04 + Math.random() * 0.92; py[i] = 0.04 + Math.random() * 0.92;
    }
  }

  /* draw: the film's recipe — displacement shading, glow, density sand */
  dens.fill(0);
  for (let p = 0; p < NPART; p++) {
    const i = Math.min(479, (px[p] * 480) | 0), j = Math.min(479, (py[p] * 480) | 0);
    dens[j * 480 + i]++;
  }
  const d32 = imgData.data;
  for (let j = 0; j < 480; j++) {
    const gj = Math.min(N - 1, (j / 5) | 0);
    const gjl = Math.max(0, gj - 1), gjh = Math.min(N - 1, gj + 1);
    for (let i = 0; i < 480; i++) {
      const gi = Math.min(N - 1, (i / 5) | 0);
      const gil = Math.max(0, gi - 1), gih = Math.min(N - 1, gi + 1);
      const en = En[gj * N + gi];
      /* breath: lambert-ish shading of the instantaneous displacement */
      const un = Math.max(-1.5, Math.min(1.5, Uf[gj * N + gi] / umaxT));
      const dux = (Uf[gj * N + gih] - Uf[gj * N + gil]) / (2 * umaxT);
      const duy = (Uf[gjh * N + gi] - Uf[gjl * N + gi]) / (2 * umaxT);
      const shade = 0.5 + 0.42 * Math.tanh((dux + duy) * 2.2);
      const glow = Math.pow(Math.min(1, en * 0.9), 2);
      const pv = (16 + 34 * shade + 10 * glow) * vig[j * 480 + i];
      const s = 1 - Math.exp(-dens[j * 480 + i] / 4);
      const o = (j * 480 + i) * 4;
      d32[o] = pv * 0.85 + s * 200;
      d32[o + 1] = pv * 0.95 + s * 180;
      d32[o + 2] = Math.min(255, pv * 1.15) + s * 140;
      d32[o + 3] = 255;
    }
  }
  offCtx.putImageData(imgData, 0, 0);
  ctx2d.imageSmoothingEnabled = true;
  ctx2d.drawImage(off, 0, 0, canvas.width, canvas.height);

  /* strike flashes (the film's expanding rings) + bow/ghost markers */
  const k = canvas.width / 960;
  for (let i = flashes.length - 1; i >= 0; i--) {
    /* rAF timestamps can lag performance.now() across a blocked frame — clamp */
    const age = Math.max(0, (now - flashes[i][0]) / 1000);
    if (age >= 0.28) { flashes.splice(i, 1); continue; }
    const a = (1 - age / 0.28) ** 2 * 0.8;
    ctx2d.strokeStyle = `rgba(220,228,240,${a.toFixed(3)})`;
    ctx2d.lineWidth = 1.5;
    ctx2d.beginPath();
    ctx2d.arc(flashes[i][1] * canvas.width, flashes[i][2] * canvas.height,
      Math.max(0.1, (4 + age * 260) * k), 0, 6.283);
    ctx2d.stroke();
  }
  const marks = [];
  for (const b of bows.values()) marks.push([b.nx, b.ny, 0.55]);
  if (perf.ghost) marks.push([perf.ghost[0], perf.ghost[1], 0.3]);
  for (const mark of marks) {
    ctx2d.strokeStyle = `rgba(200,210,224,${mark[2]})`;
    ctx2d.lineWidth = 1.5;
    ctx2d.beginPath();
    ctx2d.arc(mark[0] * canvas.width, mark[1] * canvas.height, 14 * k, 0, 6.283);
    ctx2d.stroke();
  }

  if (any && now - lastReadout > 250 && !perf.active) {
    lastReadout = now;
    let bk = 0;
    for (let k = 1; k < NM; k++) if (gvis[k] > gvis[bk]) bk = k;
    if (gvis[bk] > 0.01) {
      const md = MODES[bk];
      readout.textContent = `deg ${nearestDegree(md.f_hz)} · ${md.f_hz.toFixed(1)} Hz · mode (${md.m},${md.n})`;
    }
  }
  window.__eigenplate.debug.umax = umaxT;
  window.__eigenplate.debug.peakE = peakT;
  requestAnimationFrame(frame);
}

/* ---- offline render hook for tests / agents ---- */
window.__eigenplate = {
  debug: { umax: 0, peakE: 0 },
  rec,
  perf,
  perform,
  sandX: px, sandY: py, En, dens,
  bows,
  get peakT() { return peakT; },
  async offlineStrike(nx, ny, opts = {}) {
    const kind = opts.kind || "strike";
    const seconds = opts.seconds || 2.0;
    const force = opts.force ?? 0.8;
    const rift = opts.rift ?? 0;
    const { gains, click, voiced } = computeGains(nx, ny, force, kind, opts.sigma ?? null, opts.voiced ?? null);
    const oc = new OfflineAudioContext(2, Math.floor(seconds * 48000), 48000);
    spawnStrike(oc, oc.destination, gains, click, force, nx, 0.01, rift);
    const buf = await oc.startRendering();
    const d = buf.getChannelData(0);
    let peak = 0;
    for (let i = 0; i < d.length; i++) { const a = Math.abs(d[i]); if (a > peak) peak = a; }
    /* Goertzel at both ombak-detuned frequencies per mode (powers add — immune
       to the random phases), compensated for each mode's decay envelope so
       long-ringing modes aren't undercounted. Amplitude itself stays measured. */
    const L = d.length, T = L / 48000;
    const tauOf = new Map(gains.map(g => [g.k, g.tau]));
    const R = 2 ** (rift / 1200);
    const probe = (fq) => {
      const w = 2 * Math.PI * fq / 48000, cw = 2 * Math.cos(w);
      let s0 = 0, s1 = 0, s2 = 0;
      for (let i = 0; i < L; i++) { s0 = d[i] + cw * s1 - s2; s2 = s1; s1 = s0; }
      return s1 * s1 + s2 * s2 - cw * s1 * s2;
    };
    let best = { f: 0, p: -1 }, powers = [];
    for (let k = 0; k < NM; k++) {
      const md = MODES[k];
      let p = probe(md.f_hz * (1 + OMBAK)) + probe(md.f_hz * (1 - OMBAK));
      const tau = tauOf.get(k);
      if (tau) { const c = tau * (1 - Math.exp(-T / tau)); p /= c * c; }
      powers.push({ f: md.f_hz, m: md.m, n: md.n, p });
      if (p > best.p) best = { f: md.f_hz, p, k };
    }
    powers.sort((a, b) => b.p - a.p);
    const ampOf = new Map(gains.map(g => [MODES[g.k].f_hz, g.amp]));
    const result = {
      dominant_hz: best.f, peak,
      top: powers.slice(0, 5).map(q => ({
        f_hz: q.f, mode: [q.m, q.n], power: +q.p.toExponential(2),
        amp: +(ampOf.get(q.f) ?? 0).toFixed(4),
      })),
      max_amp: +Math.max(...gains.map(g => g.amp)).toFixed(4),
      voiced,
    };
    if (rift > 0 && best.k !== undefined) {
      const md = MODES[best.k];
      const tau = tauOf.get(best.k);
      const c = tau * (1 - Math.exp(-T / tau));
      const pa = (probe(md.f_hz * (1 + OMBAK)) + probe(md.f_hz * (1 - OMBAK))) / (c * c);
      const pb = (probe(md.f_hz * R * (1 + OMBAK)) + probe(md.f_hz * R * (1 - OMBAK))) / (c * c);
      result.rift = { cents: rift, beat_hz: +(md.f_hz * (R - 1)).toFixed(3),
                      plate_a_power: +pa.toExponential(2), plate_b_power: +pb.toExponential(2),
                      b_over_a: +(pb / pa).toFixed(3) };
    }
    return result;
  },
  gvis,
  modes: MODES,
};
requestAnimationFrame(frame);
