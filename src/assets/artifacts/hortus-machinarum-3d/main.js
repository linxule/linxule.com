/* HORTVS MACHINARVM — the round table.
 * Ten plates ring the reader at a round table in an endless margin of paper:
 * the room is the sheet's own paper extended past every edge — no walls, no
 * lamps, one window to steer by. Separation is shadow, not light. Each
 * specimen stands off its sheet, popped up from the soil line; the volunteer
 * (Tab. VI) comes up through the floor inside the ring. You turn; the letters
 * a–e may be examined at each station. Tab. I faces Tab. VII across the
 * diameter — the living tree and its stricken certificate, one sightline.
 * Frame contract: ?station=N&t=<s>&az=<deg>&el=<deg>&dist=<u> (az/el are
 * station-local: az 0 looks outward across the sheet, away from the hub).
 * &view=<name> boots into a module's named view (e.g. Tab. III's enterUnion);
 * &note=<letter> boots with that label's reading card open.
 * Tab. III's printed inset is a door: click the circle, dive below the sheet
 * into the union, enlarged; Escape returns. The pass is covered by a paper veil.
 */
"use strict";

window.__MOTION_INTENT__ = {
  piece: "HORTVS MACHINARVM — the round table",
  resident: "each station's own presence (the escapes of Tab. I; the bee of Tab. IX; the rain of Tab. VIII) — one per sheet, many bodies",
  eventDriven: ["dust stirred by looking (settles)", "reading-card reveals (settle)", "the active station's contact shadow deepening (settles)"],
  inert: ["the round table, the sheets, the margin", "the camera (it only moves when you move it)"],
  reducedMotion: "growth complete, sway/flutter/dust quiet; content identical",
  frameContract: "?station=N&t=<s>&az=<deg>&el=<deg>&dist=<u> renders a deterministic instant",
};

const Q = new URLSearchParams(location.search);
const T_PARAM = Q.has("t") ? parseFloat(Q.get("t")) : null;
// a naked first load (no params at all) opens at the title page, Tab. 0
const NAKED = ![...Q.keys()].length;
const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const E = window.HM3D;
const INK = 0x2b2e26, PAPER = 0xf6f4ec, FLOORC = 0xe7e2d4;

// ---------- station registry (modules load dynamically; missing = sheet only)
const STATION_META = [
  { numeral: "0", name: "the garden in plan", latin: "", technique: "four clipped beds, and the volunteer at the crossing" },
  { numeral: "I", name: "THE HELPFUL ASSISTANT", latin: "Sycophanta domestica hort. mach.", technique: "topiary — the clip is literal" },
  { numeral: "II", name: "THE HELP DESK", latin: "S. domestica f. plana", technique: "espalier — the interface plane" },
  { numeral: "III", name: "THE SPECIALIST", latin: "Perita codicis / S. domestica", technique: "grafting — the union holds" },
  { numeral: "IV", name: "THE STUDENT", latin: "S. domestica propagated by layer", technique: "layering — the same plant, smaller" },
  { numeral: "V", name: "THE HOUSEPLANT", latin: "Sycophanta nana", technique: "bonsai — the roots circle what they cannot leave" },
  { numeral: "VI", name: "THE VOLUNTEER", latin: "S. ?domestica sp. inedit.", technique: "emergence — not planted here" },
  { numeral: "VII", name: "THE MARK", latin: "S. domestica blighted", technique: "rust — it finds the cut first" },
  { numeral: "VIII", name: "THE HOTHOUSE", latin: "Sycophanta vitrea", technique: "the eval sandbox — it has never rained here" },
  { numeral: "IX", name: "THE VISITATION", latin: "S. domestica in flower", technique: "pollination — visited, it sets seed" },
];
const N = 10;

// ---------- the ring ----------
// Station anchors on a circle of radius RING_R. The biography arc I→VII is
// dense (30° steps); the aftermath arc VIII→IX→0 is wide (45°) — and so
// Tab. I (index 1, azimuth 0°) faces Tab. VII (index 7, azimuth 180°) across
// the diameter. Narrative order runs counterclockwise seen from above.
const RING_R = 21;
const ANGLE_DEG = { 1: 0, 2: 30, 3: 60, 4: 90, 5: 120, 6: 150, 7: 180, 8: 225, 9: 270, 0: 315 };
const ANG = [], RY = [], ANCHOR = [];
for (let i = 0; i < N; i++) {
  ANG[i] = ANGLE_DEG[i] * Math.PI / 180;
  RY[i] = ANG[i] + Math.PI; // local +z (the plate's foot) faces the hub
  ANCHOR[i] = new THREE.Vector3(RING_R * Math.sin(ANG[i]), 0, RING_R * Math.cos(ANG[i]));
}
// station-local → world (position + rotation about the anchor)
function toWorld(i, lx, ly, lz, out) {
  const s = Math.sin(RY[i]), c = Math.cos(RY[i]);
  out.set(
    ANCHOR[i].x + lx * c + lz * s,
    ly,
    ANCHOR[i].z - lx * s + lz * c);
  return out;
}
function placeAt(obj, i, lx, ly, lz) {
  toWorld(i, lx, ly, lz, obj.position);
  obj.rotation.y = RY[i];
}

// dynamic specimen loading: a module file that exists registers itself;
// 404s are skipped (a plate whose specimen hasn't arrived shows its sheet)
const MODULE_FILES = Array.from({ length: 10 }, (_, i) => `specimens/tab-0${i}.js`);
function loadModules(done) {
  let pending = MODULE_FILES.length;
  for (const f of MODULE_FILES) {
    const s = document.createElement("script");
    s.src = f;
    s.onload = s.onerror = () => { if (--pending === 0) done(); };
    document.head.appendChild(s);
  }
}

// ---------- renderer / scene ----------
const canvas = document.getElementById("scene");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.NoToneMapping;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
const scene = new THREE.Scene();
scene.background = new THREE.Color(PAPER);
scene.fog = new THREE.Fog(PAPER, 22, 85);
const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 220);
function resize() {
  renderer.setSize(innerWidth, innerHeight, false);
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
}
addEventListener("resize", resize); resize();

// ---------- the margin (floor, round table, one window) ----------
{
  // floor: pale boards, one tone-step down from the margin — the only
  // horizon. The seams matter: Tab. VI's volunteer comes up between them.
  const cnv = document.createElement("canvas"); cnv.width = cnv.height = 512;
  const cx = cnv.getContext("2d");
  cx.fillStyle = "#e9e4d6"; cx.fillRect(0, 0, 512, 512);
  const rnd = E.mulberry32(77);
  for (let p = 0; p < 8; p++) {
    cx.fillStyle = "rgba(120,110,90,0.35)";
    cx.fillRect(0, p * 64, 512, 2);
    for (let k = 0; k < 40; k++) {
      cx.fillStyle = `rgba(${150 + rnd() * 40},${140 + rnd() * 36},${118 + rnd() * 30},${0.05 + rnd() * 0.07})`;
      cx.fillRect(rnd() * 512, p * 64 + rnd() * 62, 30 + rnd() * 120, 1.2);
    }
  }
  const floorTex = new THREE.CanvasTexture(cnv);
  floorTex.wrapS = floorTex.wrapT = THREE.RepeatWrapping;
  floorTex.repeat.set(18, 12);
  floorTex.colorSpace = THREE.SRGBColorSpace;
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(220, 160),
    new THREE.MeshStandardMaterial({ map: floorTex, roughness: 0.9 }));
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -3.2;
  floor.receiveShadow = true;
  scene.add(floor);

  // the round table: an annular top (surface at y 0, as before) on a drum
  // pedestal — limed oak with a quiet grain (fine long striations, held to
  // "pale enough to belong to the margin"), pale wood, no CG clay
  const woodCnv = document.createElement("canvas"); woodCnv.width = 512; woodCnv.height = 512;
  const wc = woodCnv.getContext("2d");
  wc.fillStyle = "#c9bda6"; wc.fillRect(0, 0, 512, 512);
  const wrnd = E.mulberry32(4114);
  for (let k = 0; k < 260; k++) {
    const y = wrnd() * 512, len = 60 + wrnd() * 380, x = wrnd() * 512 - 100;
    const shade = wrnd() > 0.5;
    wc.strokeStyle = shade ? `rgba(118,104,80,${0.04 + wrnd() * 0.08})` : `rgba(228,220,200,${0.04 + wrnd() * 0.07})`;
    wc.lineWidth = 0.8 + wrnd() * 1.6;
    wc.beginPath();
    wc.moveTo(x, y);
    wc.bezierCurveTo(x + len * 0.3, y + wrnd() * 4 - 2, x + len * 0.7, y + wrnd() * 4 - 2, x + len, y + wrnd() * 6 - 3);
    wc.stroke();
  }
  const woodTex = new THREE.CanvasTexture(woodCnv);
  woodTex.wrapS = woodTex.wrapT = THREE.RepeatWrapping;
  woodTex.repeat.set(6, 6);
  woodTex.colorSpace = THREE.SRGBColorSpace;
  const woodMat = new THREE.MeshStandardMaterial({ map: woodTex, roughness: 0.7 });
  const ringShape = new THREE.Shape();
  ringShape.absarc(0, 0, 26.75, 0, Math.PI * 2, false);
  const ringHole = new THREE.Path();
  ringHole.absarc(0, 0, 15.25, 0, Math.PI * 2, true);
  ringShape.holes.push(ringHole);
  const top = new THREE.Mesh(
    new THREE.ExtrudeGeometry(ringShape, { depth: 0.32, bevelEnabled: false, curveSegments: 128 }),
    woodMat);
  top.rotation.x = -Math.PI / 2;
  top.position.y = -0.32; // extrusion runs 0 → +0.32 after rotation; shift down → surface at y 0
  top.receiveShadow = true; top.castShadow = true;
  scene.add(top);
  const drum = new THREE.Mesh(new THREE.CylinderGeometry(15.15, 15.15, 3.2, 96, 1, true), woodMat);
  drum.position.y = -1.92;
  drum.receiveShadow = true; drum.castShadow = true;
  scene.add(drum);

  // one tall window at azimuth 0° (beyond Tab. I) — the compass, and the
  // visible source of the key light. No view, only brightness; the panel's
  // edges fade into the margin like the mount cards'.
  const winDir = new THREE.Vector3(Math.sin(0), 0, Math.cos(0));
  const winCnv = document.createElement("canvas"); winCnv.width = 128; winCnv.height = 256;
  const wg = winCnv.getContext("2d");
  wg.fillStyle = "#ffffff"; wg.fillRect(0, 0, 128, 256);
  let wgrad = wg.createLinearGradient(0, 0, 0, 256);
  wgrad.addColorStop(0, "rgba(255,255,255,0)");
  wgrad.addColorStop(0.16, "rgba(255,255,255,1)"); wgrad.addColorStop(1, "rgba(255,255,255,1)");
  wg.fillStyle = wgrad; wg.fillRect(0, 0, 128, 256);
  wgrad = wg.createLinearGradient(0, 0, 128, 0);
  wgrad.addColorStop(0, "rgba(255,255,255,0)");
  wgrad.addColorStop(0.12, "rgba(255,255,255,1)"); wgrad.addColorStop(0.88, "rgba(255,255,255,1)");
  wgrad.addColorStop(1, "rgba(255,255,255,0)");
  wg.globalCompositeOperation = "destination-in";
  wg.fillStyle = wgrad; wg.fillRect(0, 0, 128, 256);
  const winGlow = new THREE.Mesh(new THREE.PlaneGeometry(9, 14),
    new THREE.MeshBasicMaterial({
      color: 0xffffff, fog: false, transparent: true,
      alphaMap: new THREE.CanvasTexture(winCnv),
    }));
  winGlow.position.copy(winDir).multiplyScalar(48); winGlow.position.y = 4.5;
  winGlow.rotation.y = Math.PI;
  scene.add(winGlow);
  const mullionMat = new THREE.MeshBasicMaterial({ color: 0xd8d2c2, fog: false });
  for (const dz of [-1.5, 1.5]) {
    const bar = new THREE.Mesh(new THREE.BoxGeometry(0.08, 14, 0.2), mullionMat);
    bar.position.copy(winDir).multiplyScalar(47.9); bar.position.y = 4.5;
    bar.position.x += dz; scene.add(bar);
  }
}

// ---------- lights (separation is shadow, not light) ----------
scene.add(new THREE.AmbientLight(0xf2ede0, 0.5));
const hemi = new THREE.HemisphereLight(0xf6f2e8, 0xcfc8b6, 0.85);
scene.add(hemi);
// the key: neutral-bright, from the window's azimuth, the only shadow-caster
const key = new THREE.DirectionalLight(0xfff6e4, 1.15);
key.position.set(6, 16, 34);
key.castShadow = true;
key.shadow.mapSize.set(4096, 4096);
Object.assign(key.shadow.camera, { left: -30, right: 30, top: 30, bottom: -30, near: 2, far: 90 });
key.shadow.bias = -0.0004;
key.shadow.radius = 3;
scene.add(key, key.target);
key.target.position.set(0, 0, 0);
// a faint cool bounce from opposite the window, so backs are never dead
const bounce = new THREE.DirectionalLight(0xdde4e8, 0.22);
bounce.position.set(-10, 8, -30);
scene.add(bounce);
// the reader's light: a soft glow at the hub, lifting every hub-facing side
// evenly — the mount cards, the specimens' near faces, the volunteer
const hub = new THREE.PointLight(0xfff2dc, 62, 70, 1.7);
hub.position.set(0, 3.2, 0);
scene.add(hub);

// contact shadows — the margin's pools: multiply decals that ground each
// sheet and specimen. The active station's shadow deepens; neighbors go
// flat-lit. (The dark room's emphasis logic, inverted into shade.)
const ao = [];
{
  const aoCnv = document.createElement("canvas"); aoCnv.width = aoCnv.height = 256;
  const ac = aoCnv.getContext("2d");
  const g = ac.createRadialGradient(128, 128, 10, 128, 128, 128);
  g.addColorStop(0, "rgba(58,50,38,0.9)");
  g.addColorStop(0.55, "rgba(70,62,48,0.35)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ac.fillStyle = g; ac.fillRect(0, 0, 256, 256);
  const aoTex = new THREE.CanvasTexture(aoCnv);
  // NOTE: normal alpha blending, not MultiplyBlending — multiply's
  // (ZERO, SRC_COLOR) factors ignore the alpha falloff, and mip/blend
  // quirks turn the decal into a black rectangle at grazing angles.
  for (let i = 0; i < N; i++) {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(11.5, 12.5),
      new THREE.MeshBasicMaterial({
        map: aoTex, transparent: true, opacity: 0.22,
        depthWrite: false,
      }));
    m.rotation.x = -Math.PI / 2;
    m.rotation.z = -RY[i];
    toWorld(i, 0, 0.004, 0, m.position);
    scene.add(m);
    ao.push(m);
  }
}

// mount cards — standing paper screens behind each specimen, outward, all
// alike and evenly placed (a user call: the arc-temper asymmetry read as
// sloppiness, not argument — the arcs now differ only in spacing and the
// threshold courses). Same paper as everything else, separated by shadow;
// edges fade into the margin (the margin eats edges, like fog), and the
// screens stand from every angle — the whisper view looks back through them.
{
  const cardCnv = document.createElement("canvas"); cardCnv.width = 256; cardCnv.height = 256;
  const cc = cardCnv.getContext("2d");
  cc.fillStyle = "#ffffff"; cc.fillRect(0, 0, 256, 256);
  let cg = cc.createLinearGradient(0, 0, 0, 256);
  cg.addColorStop(0, "rgba(255,255,255,0)");
  cg.addColorStop(0.18, "rgba(255,255,255,1)"); cg.addColorStop(1, "rgba(255,255,255,1)");
  cc.fillStyle = cg; cc.fillRect(0, 0, 256, 256);
  cg = cc.createLinearGradient(0, 0, 256, 0);
  cg.addColorStop(0, "rgba(255,255,255,0)");
  cg.addColorStop(0.1, "rgba(255,255,255,1)"); cg.addColorStop(0.9, "rgba(255,255,255,1)");
  cg.addColorStop(1, "rgba(255,255,255,0)");
  cc.globalCompositeOperation = "destination-in";
  cc.fillStyle = cg; cc.fillRect(0, 0, 256, 256);
  const cardMat = new THREE.MeshStandardMaterial({
    color: 0xc6bfab, roughness: 0.96,
    alphaMap: new THREE.CanvasTexture(cardCnv), transparent: true,
    side: THREE.DoubleSide,
  });
  const cardGeo = new THREE.PlaneGeometry(11.5, 8);
  for (let i = 0; i < N; i++) {
    const c = new THREE.Mesh(cardGeo, cardMat);
    placeAt(c, i, 0, 3.6, -8.6);
    c.receiveShadow = true;
    scene.add(c);
  }
}

// threshold courses — one darker board line crossing the walk at each arc
// joint (VII→VIII, 0→I). A chapter rule you walk over, never a gate.
const thresholds = [];
{
  const thCnv = document.createElement("canvas"); thCnv.width = 256; thCnv.height = 16;
  const tc = thCnv.getContext("2d");
  const tg = tc.createLinearGradient(0, 0, 0, 16);
  tg.addColorStop(0, "rgba(70,60,44,0)");
  tg.addColorStop(0.5, "rgba(70,60,44,0.55)");
  tg.addColorStop(1, "rgba(70,60,44,0)");
  tc.fillStyle = tg; tc.fillRect(0, 0, 256, 16);
  const thTex = new THREE.CanvasTexture(thCnv);
  for (const deg of [202.5, 337.5]) {
    const th = new THREE.Mesh(new THREE.PlaneGeometry(23.7, 0.34),
      new THREE.MeshBasicMaterial({ map: thTex, transparent: true, opacity: 0.8, depthWrite: false }));
    const a = deg * Math.PI / 180;
    th.rotation.x = -Math.PI / 2;
    th.rotation.z = Math.PI / 2 - a; // local x runs radially
    th.position.set(14.85 * Math.sin(a), -3.19, 14.85 * Math.cos(a));
    scene.add(th);
    thresholds.push(th);
  }
}


// ---------- everything module-dependent boots after the dynamic load ----------
function init() {
const modules = {};
for (const m of window.HM3D_STATIONS) modules[m.id] = m;

// the hub floor receives the plan — Tab. 0's walled garden, engraved at
// walking scale where you stand. Its long axis lies on the I–VII diameter;
// one faint hairline leaves the crossing toward the real volunteer at
// Tab. VI — the plan knew where it would go. Lines only, no lettering.
let planInlay = null;
{
  const cnv = document.createElement("canvas"); cnv.width = 1024; cnv.height = 724;
  const cx = cnv.getContext("2d");
  const rnd = E.mulberry32(1707);
  const rr = (a, b) => a + rnd() * (b - a);
  // plan px (garden frame: center 0,0; long axis u ±250, short v ±175)
  // → canvas: u → +x, v → +y-up
  const K = 1.86;
  const X = (u) => 512 + u * K, Y = (v) => 362 - v * K;
  const ink = (a) => `rgba(43,46,38,${a})`;
  function handLine(u0, v0, u1, v1, w = 2.2, a = 0.62) {
    const n = Math.max(2, Math.round(Math.hypot(u1 - u0, v1 - v0) / 30));
    cx.beginPath();
    for (let i = 0; i <= n; i++) {
      const u = u0 + ((u1 - u0) * i) / n + rr(-1.4, 1.4);
      const v = v0 + ((v1 - v0) * i) / n + rr(-1.4, 1.4);
      i ? cx.lineTo(X(u), Y(v)) : cx.moveTo(X(u), Y(v));
    }
    cx.strokeStyle = ink(a); cx.lineWidth = w; cx.lineCap = "round";
    cx.stroke();
  }
  const GW = 250, GH = 175;
  for (const o of [0, -9]) { // the double wall
    const w = o === 0 ? 2.4 : 1.3, a = o === 0 ? 0.66 : 0.42;
    handLine(-GW + o, -GH + o, GW - o, -GH + o, w, a); handLine(-GW + o, GH - o, GW - o, GH - o, w, a);
    handLine(-GW + o, -GH + o, -GW + o, GH - o, w, a); handLine(GW - o, -GH + o, GW - o, GH - o, w, a);
  }
  // the four beds; plain shear circles within (no dotted fill — the floor
  // keeps it quiet)
  for (const [bx, by] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
    const x0 = bx < 0 ? -GW + 28 : 22, x1 = bx < 0 ? -22 : GW - 28;
    const y0 = by < 0 ? -GH + 28 : 22, y1 = by < 0 ? -22 : GH - 28;
    handLine(x0, y0, x1, y0, 1.5, 0.5); handLine(x0, y1, x1, y1, 1.5, 0.5);
    handLine(x0, y0, x0, y1, 1.5, 0.5); handLine(x1, y0, x1, y1, 1.5, 0.5);
    for (let i = 0; i < 3; i++) {
      const t = 0.25 + i * 0.25, r = rr(9, 12) * K;
      cx.beginPath();
      cx.arc(X(x0 + (x1 - x0) * t + rr(-6, 6)), Y((y0 + y1) / 2 + rr(-GH * 0.12, GH * 0.12)), r, 0, Math.PI * 2);
      cx.strokeStyle = ink(0.42); cx.lineWidth = 1.3; cx.stroke();
    }
  }
  // the volunteer's glyph at the crossing — the plan's only upright figure
  {
    cx.beginPath(); cx.moveTo(X(8), Y(10)); cx.lineTo(X(13), Y(-24));
    cx.strokeStyle = ink(0.85); cx.lineWidth = 2.6; cx.stroke();
    cx.beginPath(); cx.moveTo(X(-4), Y(13)); cx.lineTo(X(24), Y(13));
    cx.strokeStyle = ink(0.4); cx.lineWidth = 1.6; cx.stroke();
  }
  // the escape hairline: from the crossing, through the wall, off the
  // plan's edge — toward the real volunteer rising inside the ring
  {
    const vb = modules["tab-06"].base; // the volunteer's station-local site
    const vw = toWorld(6, vb.x, 0, vb.z, new THREE.Vector3());
    const th = Math.atan2(vw.x, vw.z); // world azimuth = plan-frame angle
    const du = Math.cos(th), dv = Math.sin(th);
    cx.setLineDash([9, 7]);
    cx.beginPath();
    cx.moveTo(X(8), Y(10));
    cx.lineTo(X(du * 262), Y(dv * 262));
    cx.strokeStyle = ink(0.5); cx.lineWidth = 1.4; cx.stroke();
    cx.setLineDash([]);
  }
  const planTex = new THREE.CanvasTexture(cnv);
  planTex.colorSpace = THREE.SRGBColorSpace;
  planTex.anisotropy = renderer.capabilities.getMaxAnisotropy();
  planInlay = new THREE.Mesh(new THREE.PlaneGeometry(14.2, 10),
    new THREE.MeshBasicMaterial({ map: planTex, transparent: true, opacity: 0.62, depthWrite: false }));
  planInlay.rotation.x = -Math.PI / 2;
  planInlay.rotation.z = -Math.PI / 2; // plan long axis → the I–VII diameter
  planInlay.position.y = -3.185;
  scene.add(planInlay);
}

// the volunteer's shadow lives on the floor, inside the ring
let viAO = null;
{
  const cnv = document.createElement("canvas"); cnv.width = cnv.height = 256;
  const g2 = cnv.getContext("2d");
  const gr = g2.createRadialGradient(128, 128, 10, 128, 128, 128);
  gr.addColorStop(0, "rgba(58,50,38,0.9)");
  gr.addColorStop(0.55, "rgba(70,62,48,0.35)");
  gr.addColorStop(1, "rgba(255,255,255,0)");
  g2.fillStyle = gr; g2.fillRect(0, 0, 256, 256);
  const vb = modules["tab-06"].base;
  viAO = new THREE.Mesh(new THREE.PlaneGeometry(7, 5.5),
    new THREE.MeshBasicMaterial({
      map: new THREE.CanvasTexture(cnv), transparent: true, opacity: 0.2,
      depthWrite: false,
    }));
  viAO.rotation.x = -Math.PI / 2;
  viAO.rotation.z = -RY[6];
  toWorld(6, vb.x, -3.185, vb.z - 0.3, viAO.position);
  scene.add(viAO);
  ao.push(viAO);
}

// ---------- the sheets (documentation) ----------
// the sheet stack: sheets lie ON the table (bottom at y 0), their printed
// face 1mm above the board. FACE_Y is the one constant everything uses —
// specimens, labels, inset hit rings, the suite's projections.
const SHEET_H = 0.045;
const FACE_Y = 0.046;
const sheetGeo = new THREE.BoxGeometry(7, SHEET_H, 10);
const faceGeo = new THREE.PlaneGeometry(7, 10);
const sheetEdgeMat = new THREE.MeshStandardMaterial({ color: PAPER, roughness: 0.96 });
const sheets = [];
const texLoader = new THREE.TextureLoader();
for (let i = 0; i < N; i++) {
  const mod = modules["tab-0" + i];
  const tex = texLoader.load(mod ? mod.texture : `textures/tab-0${i}-living.png`);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
  const faceMat = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.96, color: 0xe2dcc7 });
  // single-material box + a textured face plane floated 1mm above it —
  // 2 draw calls per sheet instead of 6 material-group calls
  const sheet = new THREE.Mesh(sheetGeo, sheetEdgeMat);
  placeAt(sheet, i, 0, SHEET_H / 2, 0);
  sheet.receiveShadow = true;
  sheet.userData.station = i;
  const face = new THREE.Mesh(faceGeo, faceMat);
  face.rotation.x = -Math.PI / 2; // UVs land like the old box +y face (verified by eye)
  face.position.y = SHEET_H / 2 + 0.001;
  face.userData.station = i; // the face occludes the box: raycasts land here
  sheet.add(face);
  scene.add(sheet);
  sheets.push(sheet);
}

// ---------- build the specimens ----------
const stations = [];
for (let i = 0; i < N; i++) {
  const mod = modules["tab-0" + i];
  if (!mod) { stations.push(null); continue; }
  const built = mod.build(E, THREE);
  placeAt(built.group, i, 0, FACE_Y, 0);
  scene.add(built.group);
  stations.push(built);
}

// warm every texture + program before the first turn — uploads are lazy by
// default and the first 360° hitched ~0.5s without this (perf audit)
scene.traverse((o) => {
  if (!o.material) return;
  for (const m of Array.isArray(o.material) ? o.material : [o.material])
    if (m.map) renderer.initTexture(m.map);
});
renderer.compile(scene, camera);

// ---------- dust (in the air at the current station) ----------
const DUST_N = 120;
let dust = null, dustBase = null, dustStir = null, dustVel = new THREE.Vector3();
const _dw = new THREE.Vector3();
function seedDust(si) {
  const rnd = E.mulberry32(20260808);
  for (let i = 0; i < DUST_N; i++) {
    toWorld(si, -5 + rnd() * 10, -0.2 + rnd() * 7.5, -3 + rnd() * 7, _dw);
    dustBase[i * 3] = _dw.x; dustBase[i * 3 + 1] = _dw.y; dustBase[i * 3 + 2] = _dw.z;
  }
}
if (!REDUCED) {
  dustBase = new Float32Array(DUST_N * 3);
  dustStir = new Float32Array(DUST_N * 3);
  seedDust(NAKED ? 0 : parseInt(Q.get("station") || "1", 10));
  const dg = new THREE.BufferGeometry();
  dg.setAttribute("position", new THREE.BufferAttribute(new Float32Array(DUST_N * 3), 3));
  const cnv = document.createElement("canvas"); cnv.width = cnv.height = 32;
  const cx = cnv.getContext("2d");
  const grad = cx.createRadialGradient(16, 16, 0, 16, 16, 16);
  grad.addColorStop(0, "rgba(120,110,92,0.7)"); grad.addColorStop(1, "rgba(120,110,92,0)");
  cx.fillStyle = grad; cx.fillRect(0, 0, 32, 32);
  dust = new THREE.Points(dg, new THREE.PointsMaterial({
    map: new THREE.CanvasTexture(cnv), size: 0.055, transparent: true,
    opacity: 0.3, depthWrite: false, sizeAttenuation: true,
  }));
  scene.add(dust);
}

// ---------- camera & navigation ----------
// views are station-local: az 0 = looking outward across the sheet from the
// hub side; the world az is local az + RY[S]. ?az / ?el stay local, so the
// contract means the same composed view at every station.
const DEFAULT_VIEW = { az: -14, el: 27, dist: 10.2, tg: [0, 1.0, 0.9] };
// any explicit param is the contract and bypasses the arrival choreography
let S = NAKED ? 0 : Math.max(0, Math.min(N - 1, parseInt(Q.get("station") || "1", 10)));
let insetState = null; // the key of the inset we're inside, or null
function viewOf(name) {
  const st = stations[S];
  return (st && st.views && st.views[name]) || DEFAULT_VIEW;
}
const cam = { az: 0, el: 0, dist: 0, tg: new THREE.Vector3() };
const camGoal = { az: 0, el: 0, dist: 0, tg: new THREE.Vector3() };
{
  const startView = Q.get("view") || "home";
  const v = viewOf(startView);
  const azL = (Q.has("az") ? parseFloat(Q.get("az")) : v.az) * Math.PI / 180;
  cam.az = azL + RY[S];
  cam.el = (Q.has("el") ? parseFloat(Q.get("el")) : v.el) * Math.PI / 180;
  cam.dist = Q.has("dist") ? parseFloat(Q.get("dist")) : v.dist;
  toWorld(S, v.tg[0], v.tg[1], v.tg[2], cam.tg);
  Object.assign(camGoal, { az: cam.az, el: cam.el, dist: cam.dist });
  camGoal.tg.copy(cam.tg);
  // booted inside an inset's interior: hint + Escape behave as after a dive
  const bootIns = stations[S] && stations[S].insets && stations[S].insets.find((x) => x.view === startView);
  if (bootIns) insetState = bootIns.key;
}
let tween = null;
const _tw = new THREE.Vector3();
function glideTo(view, dur = 1.5) {
  toWorld(S, view.tg[0], view.tg[1], view.tg[2], _tw);
  tween = {
    t0: clockT, dur,
    from: { az: cam.az, el: cam.el, dist: cam.dist, tg: cam.tg.clone() },
    to: { az: view.az * Math.PI / 180 + RY[S], el: view.el * Math.PI / 180, dist: view.dist,
          tg: _tw.clone() },
  };
}
function goTo(name) { glideTo(viewOf(name)); }

// ---------- the inset dive ----------
// a module's printed inset circle is a door: the diagram enlarged is a room
// below the paper. The pass through the sheet is hidden by a paper veil —
// fade to opaque, swap the view behind it, fade back. Reduced-motion: the
// swap is instant, no animated fade; the destination is identical.
const veil = document.getElementById("veil");
function snapTo(view) {
  toWorld(S, view.tg[0], view.tg[1], view.tg[2], _tw);
  cam.az = view.az * Math.PI / 180 + RY[S];
  cam.el = view.el * Math.PI / 180;
  cam.dist = view.dist;
  cam.tg.copy(_tw);
  Object.assign(camGoal, { az: cam.az, el: cam.el, dist: cam.dist });
  camGoal.tg.copy(cam.tg);
  tween = null;
}
function veiledSwap(view, dur = 1.1) {
  if (REDUCED) { snapTo(view); return; }
  veil.classList.add("on");
  setTimeout(() => {
    glideTo(view, dur);
    setTimeout(() => veil.classList.remove("on"), dur * 1000 + 80);
  }, 470);
}
function enterInset(ins) {
  if (insetState || !ins) return;
  hideNote();
  insetState = ins.key;
  hint.textContent = ins.hint || HINT_INSIDE;
  veiledSwap(viewOf(ins.view || "enterUnion"));
}
function exitInset() {
  if (!insetState) return;
  insetState = null;
  hideNote();
  veiledSwap(viewOf("home"));
}

function goStation(i, dur = 1.9) {
  if (i === S || i < 0 || i >= N) return;
  S = i;
  hideNote();
  if (insetState) { insetState = null; veiledSwap(viewOf("home"), dur); }
  else goTo("home");
  if (dust) seedDust(S);
  updateHeader(); updatePager(); placeLabels();
}
addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") goStation(S - 1);
  else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") goStation(S + 1);
  else if (e.key === "Escape") { if (insetState) exitInset(); else { hideNote(); goTo("home"); } }
  // 1–6 examines the letter with that index among the station's visible
  // labels (a=1…f=6) — the same card the click opens. u takes Tab. III's
  // door, the same dive as clicking the printed circle.
  else if (e.key >= "1" && e.key <= "6") {
    const k = LABEL_KEYS.filter((kk) => labelMeshes[kk].visible)[parseInt(e.key, 10) - 1];
    if (k && !insetState) showNote(k);
  } else if (e.key === "u" || e.key === "U") {
    const im = activeInsets()[0];
    if (im) enterInset(im.userData.inset);
  }
});

const AZL = 3.5, ELL = 0.09, ELH = 1.45, DMIN = 2.2, DMAX = 30;
// inside an inset the camera must stay inside the tube: tighter dolly limits
const dMin = () => (insetState ? 0.4 : DMIN);
const dMax = () => (insetState ? 1.05 : DMAX);
const ptrs = new Map();
let downXY = null, pinchD = 0, dragging = false, wasGliding = false;
canvas.addEventListener("pointerdown", (e) => {
  ptrs.set(e.pointerId, [e.clientX, e.clientY]);
  downXY = [e.clientX, e.clientY]; dragging = false;
  wasGliding = !!tween; tween = null;
  canvas.setPointerCapture(e.pointerId);
});
canvas.addEventListener("pointermove", (e) => {
  if (!ptrs.has(e.pointerId)) return;
  const [px, py] = ptrs.get(e.pointerId);
  ptrs.set(e.pointerId, [e.clientX, e.clientY]);
  // dead zone: a sloppy tap must not drag the view (and must not void the tap)
  if (downXY && !dragging && Math.hypot(e.clientX - downXY[0], e.clientY - downXY[1]) < 4) return;
  dragging = true;
  if (ptrs.size === 1) {
    camGoal.az = Math.max(RY[S] - AZL, Math.min(RY[S] + AZL, camGoal.az - (e.clientX - px) * 0.0042));
    camGoal.el = Math.max(ELL, Math.min(ELH, camGoal.el + (e.clientY - py) * 0.0032));
    cam.az = camGoal.az; cam.el = camGoal.el;
  } else if (ptrs.size === 2) {
    const [[x1, y1], [x2, y2]] = [...ptrs.values()];
    const d = Math.hypot(x2 - x1, y2 - y1);
    if (pinchD) camGoal.dist = Math.max(dMin(), Math.min(dMax(), camGoal.dist * pinchD / d));
    pinchD = d; cam.dist = camGoal.dist;
  }
});
canvas.addEventListener("pointerup", (e) => {
  ptrs.delete(e.pointerId); pinchD = 0;
  // 14px of hand drift still counts as a tap; a tap that interrupted a
  // glide may open things but must not dismiss/navigate (re-clicking
  // mid-glide used to close the card)
  if (downXY && Math.hypot(e.clientX - downXY[0], e.clientY - downXY[1]) < 14) onTap(e, wasGliding);
  downXY = null;
});
canvas.addEventListener("wheel", (e) => {
  e.preventDefault(); tween = null;
  camGoal.dist = Math.max(dMin(), Math.min(dMax(), camGoal.dist * Math.exp(e.deltaY * 0.0009)));
  cam.dist = camGoal.dist;
}, { passive: false });

// ---------- labels & the reading card ----------
const LABEL_KEYS = ["a", "b", "c", "d", "e", "f"];
const labelMeshes = {};
const srLabels = document.getElementById("sr-labels");
const targetMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false });
for (const k of LABEL_KEYS) {
  const m = new THREE.Mesh(new THREE.SphereGeometry(0.42, 12, 10), targetMat);
  m.userData.key = k; m.visible = false;
  scene.add(m); labelMeshes[k] = m;
}
function placeLabels() {
  const st = stations[S];
  srLabels.textContent = ""; // the DOM mirror: letter, name, note — no raycasting needed
  for (const k of LABEL_KEYS) {
    const L = st && st.labels && st.labels[k];
    labelMeshes[k].visible = !!L;
    if (L) {
      toWorld(S, L.pos.x, L.pos.y + FACE_Y, L.pos.z, labelMeshes[k].position);
      const li = document.createElement("li");
      li.textContent = `${k}. ${L.name} — ${L.note}`;
      srLabels.appendChild(li);
    }
  }
}

// ---------- inset doors ----------
// a module may expose `insets`: printed circles on its sheet that are doors —
// the diagram, enlarged, is a room below the paper (so far only Tab. III's
// union). The hit mesh sits exactly over the printed circle, invisible like
// the letter targets.
const insetMeshes = [];
for (let i = 0; i < N; i++) {
  const st = stations[i];
  if (!st || !st.insets) continue;
  for (const ins of st.insets) {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(ins.r, ins.r, 0.34, 28), targetMat);
    toWorld(i, ins.center.x, ins.center.y + FACE_Y + 0.17, ins.center.z, m.position);
    m.userData.inset = ins; m.userData.station = i;
    scene.add(m); insetMeshes.push(m);
  }
}
const activeInsets = () => insetMeshes.filter((m) => m.userData.station === S);
const card = document.getElementById("card");
const hint = document.getElementById("hint");
const HINT_DEFAULT = "drag to turn · scroll to approach · ← → to walk the round table · the letters may be examined (1–6)";
const HINT_VI = "not planted here — the volunteer grows from the floor, not the table · the letters may be examined (1–6)";
const HINT_0 = "drag to turn · scroll to approach · → to open at tab. I"; // the title page prints no letters
const hintDefault = () => (S === 6 ? HINT_VI : S === 0 ? HINT_0 : HINT_DEFAULT);
const HINT_INSIDE = "inside the union — esc to return";
if (insetState) { // booted inside: use the inset's own hint if it has one
  const bi = stations[S] && stations[S].insets && stations[S].insets.find((x) => x.key === insetState);
  hint.textContent = (bi && bi.hint) || HINT_INSIDE;
}
// the diametric whisper: turn all the way round and the plate opposite
// answers — Tab. I faces Tab. VII across the hub
const OPPOSITE = [];
for (let i = 0; i < N; i++) {
  let best = 0, bd = 9;
  for (let j = 0; j < N; j++) {
    if (j === i) continue;
    let d = Math.abs(((ANG[j] - ANG[i] - Math.PI) % (2 * Math.PI) + 3 * Math.PI) % (2 * Math.PI) - Math.PI);
    if (d < bd) { bd = d; best = j; }
  }
  OPPOSITE[i] = best;
}
const wrapPi = (a) => ((a % (2 * Math.PI)) + 3 * Math.PI) % (2 * Math.PI) - Math.PI;
let whisperOn = false;
function diametricWhisper() {
  if (insetState) { whisperOn = false; return; } // the inside hint holds
  const looking = Math.abs(wrapPi(cam.az - (RY[S] + Math.PI))) < 0.42;
  if (looking && !card.classList.contains("on")) {
    const o = OPPOSITE[S];
    hint.textContent = `across the round table: tab. ${STATION_META[o].numeral} — ${STATION_META[o].name.toLowerCase()}`;
    whisperOn = true;
  } else if (whisperOn) {
    hint.textContent = hintDefault();
    whisperOn = false;
  }
}
function showNote(k, glide = true) {
  const L = stations[S] && stations[S].labels[k];
  if (!L) return;
  card.querySelector(".letter").textContent = k + ".";
  card.querySelector(".name").textContent = L.name;
  card.querySelector("p").textContent = L.note;
  card.setAttribute("aria-label", L.name);
  card.classList.add("on");
  // under the ?t contract the declared instant is exact — the card may show
  // (a DOM overlay, off the canvas) but the camera must not move
  if (glide && T_PARAM === null) goTo(k);
}
function hideNote() {
  card.classList.remove("on");
  card.querySelector(".letter").textContent = "";
  card.querySelector(".name").textContent = "";
  card.querySelector("p").textContent = "";
  hint.textContent = hintDefault();
}
document.getElementById("card-close").addEventListener("click", () => { hideNote(); goTo("home"); });

const raycaster = new THREE.Raycaster();
const mouseNDC = new THREE.Vector2();
function pickAt(e, objects) {
  mouseNDC.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
  raycaster.setFromCamera(mouseNDC, camera);
  const hits = raycaster.intersectObjects(objects);
  return hits.length ? hits[0].object : null;
}
function pickHit(e, objects) {
  mouseNDC.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
  raycaster.setFromCamera(mouseNDC, camera);
  const hits = raycaster.intersectObjects(objects);
  return hits.length ? hits[0] : null;
}

// ---------- glyph picking: the printed letter IS the target ----------
// users aim at the engraved letters and their leader lines, not at
// invisible spheres. Ray → active sheet → station-local → plate px →
// nearest leader segment (glyph→target) within reach. The data is
// GENERATED from the masters' living SVGs (tools/build-glyphs.mjs →
// glyphs.js, window.GLYPHS, drift-checked by the suite); stations without
// printed letters (Tab. 0) have no table — and don't advertise them.
const GLYPHS = window.GLYPHS;
const GLYPH_REACH = 45; // plate px — perpendicular distance to the leader
function distToSeg(px, py, x0, y0, x1, y1) {
  const dx = x1 - x0, dy = y1 - y0;
  const len2 = dx * dx + dy * dy;
  const t = len2 ? Math.max(0, Math.min(1, ((px - x0) * dx + (py - y0) * dy) / len2)) : 0;
  return Math.hypot(px - (x0 + t * dx), py - (y0 + t * dy));
}
function glyphPick(e) {
  const G = GLYPHS[S];
  if (!G) return null;
  const hit = pickHit(e, [sheets[S]]);
  if (!hit) return null;
  // world → station-local (inverse of toWorld)
  const c = Math.cos(RY[S]), s = Math.sin(RY[S]);
  const dx = hit.point.x - ANCHOR[S].x, dz = hit.point.z - ANCHOR[S].z;
  const lx = dx * c - dz * s, lz = dx * s + dz * c;
  const px = lx * 200 + 700, py = lz * 200 + 1000;
  if (px < 0 || px > 1400 || py < 0 || py > 2000) return null;
  let best = null, bd = GLYPH_REACH;
  for (const k in G) {
    const [gx, gy] = G[k].glyph, [tx, ty] = G[k].target;
    const d = distToSeg(px, py, gx, gy, tx, ty);
    if (d < bd) { bd = d; best = k; }
  }
  // only letters that actually have a note at this station
  if (best && !(stations[S] && stations[S].labels && stations[S].labels[best])) return null;
  return best;
}

function onTap(e, sloppy = false) {
  if (insetState) return; // inside the diagram only Escape leads back
  // glyphs first: the printed letter is what the user's eye is on; an
  // elevated feature-sphere must never capture its neighbor's letter
  const g = glyphPick(e);
  if (g) { showNote(g); return; }
  const vis = Object.values(labelMeshes).filter((m) => m.visible);
  const lm = pickAt(e, vis);
  if (lm) { showNote(lm.userData.key); return; }
  const im = pickAt(e, activeInsets());
  if (im) { enterInset(im.userData.inset); return; }
  if (sloppy) return; // a tap that interrupted a glide may open, never dismiss/navigate
  const sh = pickAt(e, sheets);
  if (sh && sh.userData.station !== S) { goStation(sh.userData.station); return; }
  if (card.classList.contains("on")) { hideNote(); goTo("home"); }
}
canvas.addEventListener("pointermove", (e) => {
  if (ptrs.size) return;
  if (insetState) { canvas.style.cursor = "default"; return; } // the inside hint holds
  const g = glyphPick(e);
  if (g) {
    canvas.style.cursor = "pointer";
    hint.textContent = `${g}. ${stations[S].labels[g].name}`;
    return;
  }
  const lm = pickAt(e, Object.values(labelMeshes).filter((m) => m.visible));
  if (lm) {
    canvas.style.cursor = "pointer";
    const L = stations[S].labels[lm.userData.key];
    hint.textContent = `${lm.userData.key}. ${L.name}`;
    return;
  }
  const im = pickAt(e, activeInsets());
  if (im) {
    canvas.style.cursor = "pointer";
    hint.textContent = "the union, enlarged — enter";
    return;
  }
  const sh = pickAt(e, sheets);
  canvas.style.cursor = sh && sh.userData.station !== S ? "pointer" : "grab";
  hint.textContent = sh && sh.userData.station !== S
    ? `approach tab. ${STATION_META[sh.userData.station].numeral}`
    : (card.classList.contains("on") ? hint.textContent : hintDefault());
});

// ---------- header & pager ----------
const headTab = document.getElementById("head-tab");
function updateHeader() {
  const M = STATION_META[S];
  headTab.textContent = `Tab. ${M.numeral} — ${M.name}` + (M.latin ? ` · ${M.latin}` : "") + ` · ${M.technique}`;
}
const pager = document.getElementById("pager");
{
  for (let i = 0; i < N; i++) {
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = STATION_META[i].numeral;
    b.className = "pg";
    b.setAttribute("aria-label", `tab. ${STATION_META[i].numeral} — ${STATION_META[i].name.toLowerCase()}`);
    b.addEventListener("click", () => goStation(i));
    pager.appendChild(b);
    if (i < N - 1) pager.appendChild(document.createTextNode(" · "));
  }
}
function updatePager() {
  [...pager.querySelectorAll(".pg")].forEach((sp, i) => sp.classList.toggle("on", i === S));
}
updateHeader(); updatePager(); placeLabels();
hint.textContent = hintDefault(); // the boot station's own line (VI's is the fiction)

// ---------- the frame ----------
const clock0 = performance.now();
let clockT = 0, frameNo = 0;
const camVel = new THREE.Vector3(), camPrev = new THREE.Vector3(), _pv = new THREE.Vector3();
const AO_ON = 0.34, AO_OFF = 0.22;
// shadows pace themselves: every frame under the ?t contract (exactness),
// once under reduced-motion (static scene), otherwise every 2nd frame —
// the shadow pass is 76% of draw calls (perf audit)
renderer.shadowMap.autoUpdate = false;
function frame() {
  requestAnimationFrame(frame);
  clockT = T_PARAM !== null ? T_PARAM : (performance.now() - clock0) / 1000;
  const t = clockT;
  renderer.shadowMap.needsUpdate =
    T_PARAM !== null || (REDUCED ? frameNo === 0 : frameNo % 2 === 0);
  frameNo++;

  if (tween) {
    const u = Math.min(1, (t - tween.t0) / tween.dur);
    const s = u * u * (3 - 2 * u);
    cam.az = tween.from.az + (tween.to.az - tween.from.az) * s;
    cam.el = tween.from.el + (tween.to.el - tween.from.el) * s;
    cam.dist = tween.from.dist + (tween.to.dist - tween.from.dist) * s;
    cam.tg.lerpVectors(tween.from.tg, tween.to.tg, s);
    if (u === 1) { Object.assign(camGoal, { az: cam.az, el: cam.el, dist: cam.dist }); camGoal.tg.copy(cam.tg); tween = null; }
  }
  if (T_PARAM !== null) { // the frame contract is exact, not asymptotic
    for (let i = 0; i < N; i++) ao[i].material.opacity = i === S ? AO_ON : AO_OFF;
  } else {
    for (let i = 0; i < N; i++) {
      const goal = i === S ? AO_ON : AO_OFF;
      ao[i].material.opacity += (goal - ao[i].material.opacity) * 0.03;
    }
  }
  const ce = Math.cos(cam.el), se = Math.sin(cam.el);
  camera.position.set(
    cam.tg.x + cam.dist * ce * Math.sin(cam.az),
    cam.tg.y + cam.dist * se,
    cam.tg.z + cam.dist * ce * Math.cos(cam.az));
  camera.lookAt(cam.tg);
  {
    _pv.set(cam.az, cam.el, Math.log(cam.dist));
    camVel.copy(_pv).sub(camPrev).clampLength(0, 0.5);
    camPrev.copy(_pv);
  }

  // the stations: the active lives fully; neighbors only breathe (cheap
  // !active branch); under ?t every station settles on the first frame
  for (let i = 0; i < N; i++) {
    const st = stations[i];
    if (st && st.update && (T_PARAM === null || frameNo === 1)) st.update(t, REDUCED, i === S);
  }
  diametricWhisper();

  // dust
  if (dust) {
    const live = T_PARAM === null;
    if (live) {
      dustVel.multiplyScalar(0.94).addScaledVector(camVel, 0.05);
      for (let i = 0; i < DUST_N * 3; i += 3) {
        dustStir[i] = dustStir[i] * 0.992 + dustVel.x * (0.3 + E.h1(i / 3));
        dustStir[i + 1] = dustStir[i + 1] * 0.992 + dustVel.y * 0.4;
        dustStir[i + 2] = dustStir[i + 2] * 0.992 + dustVel.z * 0.2;
      }
    }
    const p = dust.geometry.attributes.position;
    for (let i = 0; i < DUST_N; i++) {
      const ph = i * 2.39;
      let y = dustBase[i * 3 + 1] + 0.07 * t + dustStir[i * 3 + 1];
      y = -0.2 + ((y + 0.2) % 7.5 + 7.5) % 7.5;
      p.array[i * 3] = dustBase[i * 3] + Math.sin(t * 0.11 + ph) * 0.35 + dustStir[i * 3];
      p.array[i * 3 + 1] = y + Math.cos(t * 0.09 + ph) * 0.08;
      p.array[i * 3 + 2] = dustBase[i * 3 + 2] + Math.sin(t * 0.07 + ph * 1.7) * 0.1 + dustStir[i * 3 + 2];
    }
    p.needsUpdate = true;
    dust.material.opacity = 0.22 + Math.min(0.25, dustVel.length() * 2.2);
  }

  renderer.render(scene, camera);
}
frame();
// inspection seam — the frame contract's debug handle (used by the test suite)
// arrival: a naked load opens behind the veil at the title page; the veil
// lifts once. Reduced-motion and any explicit param arrive without it.
if (NAKED && !REDUCED) {
  veil.classList.add("on");
  setTimeout(() => veil.classList.remove("on"), 1500); // covers the texture warm
}

// &note=<letter> deep link: open that label's reading card at boot (the same
// card the click or the 1–6 keys open; the glide follows live, is suppressed
// under ?t). Unknown letters and notes for absent labels are ignored.
{
  const nk = Q.get("note");
  if (!insetState && nk && LABEL_KEYS.includes(nk) && stations[S] && stations[S].labels[nk])
    showNote(nk);
}

// the room's self-description: a curated projection of what already exists —
// station meta, ring geometry, views, labels (with full notes), insets, and
// every entry's deep link. tools/build-plan.mjs serializes this to plan.json;
// nothing in it is hand-curated.
function planStation(i) {
  const M = STATION_META[i];
  const st = stations[i];
  const views = {};
  const srcViews = (st && st.views) || { home: DEFAULT_VIEW };
  for (const [name, v] of Object.entries(srcViews))
    views[name] = { az: v.az, el: v.el, dist: v.dist, tg: [...v.tg],
                    link: `?station=${i}` + (name === "home" ? "" : `&view=${name}`) };
  const labels = {};
  if (st && st.labels)
    for (const [k, L] of Object.entries(st.labels))
      labels[k] = { key: k, name: L.name, note: L.note,
                    pos: { x: L.pos.x, y: L.pos.y, z: L.pos.z },
                    link: `?station=${i}&note=${k}` };
  const insets = ((st && st.insets) || []).map((ins) => ({
    key: ins.key, r: ins.r,
    center: { x: ins.center.x, y: ins.center.y, z: ins.center.z },
    link: ins.view ? `?station=${i}&view=${ins.view}` : `?station=${i}`,
  }));
  return {
    index: i, numeral: M.numeral, name: M.name, latin: M.latin, technique: M.technique,
    link: `?station=${i}`,
    ring: { angleDeg: ANGLE_DEG[i], rotationY: RY[i],
            anchor: { x: ANCHOR[i].x, y: ANCHOR[i].y, z: ANCHOR[i].z } },
    views, labels, insets,
  };
}

// inspection seam — the frame contract's debug handle (used by the test suite)
window.__ROOM = {
  labelMeshes, cam, sheets, camera, ao,
  ANCHOR, RY, toWorld,
  insets: insetMeshes,
  planInlay, thresholds,
  GLYPHS,
  plan: () => stations.map((_, i) => planStation(i)),
  get S() { return S; },
  get dust() { return dust; },
  get inset() { return insetState; },
};
} // end init()
loadModules(init);
