/* HM3D — the shared bench for the living room.
 * One presence per station; everything deterministic (seeded or closed-form
 * in t). A station module registers itself on window.HM3D_STATIONS:
 * {
 *   id, numeral, name, latin, technique, texture, soil (hinge py),
 *   build(E, THREE) -> { group, update(t, reduced, active), labels, views }
 * }
 * Station-local frame: origin at sheet center; x = (px-700)/200;
 * z = (py-1000)/200; y = up from the paper. The pop-up hinge: a drawn point
 * (px, py) above the soil line stands at y = (soil-py)/200, z = hinge z.
 */
"use strict";
window.HM3D_STATIONS = window.HM3D_STATIONS || [];
window.HM3D = (() => {
  const U = 1 / 200;
  const INK = 0x2b2e26, PAPER = 0xf6f4ec, GREEN = 0x55794a;

  const h1 = (i) => { const x = Math.sin(i * 127.1 + 0.7) * 43758.5453; return x - Math.floor(x); };
  function mulberry32(seed) {
    let a = seed >>> 0;
    return function () {
      a |= 0; a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // burin ribbon, made round (endpoints pinned by the curve)
  function taperedTube(THREE, points3, w0px, w1px) {
    const curve = points3.length === 2
      ? new THREE.LineCurve3(points3[0], points3[1])
      : new THREE.CatmullRomCurve3(points3, false, "catmullrom", 0.5);
    const segs = Math.max(6, Math.min(72, Math.round(curve.getLength() * 9)));
    const radial = 6;
    const frames = curve.computeFrenetFrames(segs, false);
    const pos = [], norm = [], idx = [];
    const P = new THREE.Vector3(), v = new THREE.Vector3();
    for (let i = 0; i <= segs; i++) {
      const t = i / segs;
      curve.getPointAt(t, P);
      const wpx = (w0px + (w1px - w0px) * t) * (1 + 0.22 * Math.sin(Math.PI * t)) / 2;
      const r = Math.max(wpx * U, 0.0045);
      const N = frames.normals[i], B = frames.binormals[i];
      for (let j = 0; j <= radial; j++) {
        const a = (j / radial) * Math.PI * 2;
        v.copy(N).multiplyScalar(Math.cos(a)).addScaledVector(B, Math.sin(a));
        pos.push(P.x + v.x * r, P.y + v.y * r, P.z + v.z * r);
        norm.push(v.x, v.y, v.z);
      }
    }
    for (let i = 0; i < segs; i++) for (let j = 0; j < radial; j++) {
      const a = i * (radial + 1) + j, b = a + radial + 1;
      idx.push(a, b, a + 1, b, b + 1, a + 1);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    geo.setAttribute("normal", new THREE.Float32BufferAttribute(norm, 3));
    geo.setIndex(idx);
    return geo;
  }

  // merge static geometries (positions + normals + index)
  function mergeGeoms(geoms) {
    let vTotal = 0, iTotal = 0;
    for (const g of geoms) { vTotal += g.attributes.position.count; iTotal += g.getIndex().count; }
    const pos = new Float32Array(vTotal * 3), norm = new Float32Array(vTotal * 3);
    const idx = new (vTotal > 65535 ? Uint32Array : Uint16Array)(iTotal);
    let vo = 0, io = 0;
    for (const g of geoms) {
      pos.set(g.attributes.position.array, vo * 3);
      norm.set(g.attributes.normal.array, vo * 3);
      const gi = g.getIndex().array;
      for (let i = 0; i < gi.length; i++) idx[io + i] = gi[i] + vo;
      vo += g.attributes.position.count; io += gi.length;
    }
    const out = new (geoms[0].constructor)();
    out.setAttribute("position", new geoms[0].attributes.position.constructor(pos, 3));
    out.setAttribute("normal", new geoms[0].attributes.normal.constructor(norm, 3));
    // index must carry itemSize 1 — a bare constructor leaves count NaN and
    // the merged mesh silently renders nothing (caught by the tab-05 builder)
    out.setIndex(new THREE.BufferAttribute(idx, 1));
    return out;
  }

  // 3D growth engine — the master's grammar, the dimension added
  function makeGrow3(THREE, rng) {
    const rr3 = (a, b) => a + rng() * (b - a);
    const perp = (v) => {
      const r = new THREE.Vector3(rng() * 2 - 1, rng() * 2 - 1, rng() * 2 - 1).cross(v);
      return r.lengthSq() < 1e-6 ? new THREE.Vector3(1, 0, 0) : r.normalize();
    };
    function grow3(pos, dir, len, w, depth, opts, out) {
      const segs = opts.segs ?? 4, step = len / segs;
      const pts = [pos.clone()];
      let d = dir.clone();
      for (let i = 0; i < segs; i++) {
        d = d.clone().applyAxisAngle(perp(d), (rng() - 0.5) * opts.curl + (opts.bias ?? 0)).normalize();
        pos = pos.clone().addScaledVector(d, step);
        pts.push(pos.clone());
        if (depth > 0 && w > 0.9 && i > 0 && rng() < opts.lateral) {
          const nd = d.clone().applyAxisAngle(perp(d), opts.spread * (0.7 + rng() * 0.7) * (rng() < 0.5 ? 1 : -1));
          grow3(pos, nd, len * opts.decay * (0.45 + rng() * 0.4), w * 0.55, depth - 1, opts, out);
        }
      }
      out.branches.push({ pts, w });
      if (depth > 0 && w * 0.62 > 0.6) {
        const kids = 2 + (rng() < (opts.tri ?? 0.35) ? 1 : 0);
        for (let k = 0; k < kids; k++) {
          const nd = d.clone().applyAxisAngle(perp(d), (rng() - 0.5) * opts.spread * 2.2);
          grow3(pos, nd, len * opts.decay * (0.7 + rng() * 0.5), w * 0.62, depth - 1, opts, out);
        }
      } else {
        out.tips.push({ p: pos.clone(), d: d.clone() });
        const n = pts.length;
        for (let i = Math.max(1, n - 3); i < n; i++) {
          if (rng() < opts.leafAlong) {
            out.leaves.push({
              p: pts[i].clone(),
              d: pts[i].clone().sub(pts[i - 1]).normalize(),
              s: rr3(0.7, 1.15) * opts.leafScale,
            });
          }
        }
      }
    }
    return { grow3, rr3 };
  }

  function clipToSphere(THREE, pts, SC, R) {
    const kept = [pts[0]];
    let cut = null;
    for (let i = 0; i < pts.length - 1; i++) {
      const a = pts[i], b = pts[i + 1];
      const da = a.distanceTo(SC) - R, db = b.distanceTo(SC) - R;
      if (db <= 0) { kept.push(b); continue; }
      if (da <= 0) {
        const d = b.clone().sub(a), f = a.clone().sub(SC);
        const A = d.lengthSq(), B = 2 * f.dot(d), Cc = f.lengthSq() - R * R;
        const disc = B * B - 4 * A * Cc;
        if (disc >= 0 && A > 0) {
          const t = (-B + Math.sqrt(disc)) / (2 * A);
          const ix = a.clone().addScaledVector(d, t);
          kept.push(ix);
          cut = { p: ix, d: d.clone().normalize() };
        }
      }
      break;
    }
    return { kept, cut };
  }

  // shared leaf shape (the engraving's own)
  function makeLeafGeo(THREE) {
    const s = new THREE.Shape();
    s.moveTo(0, 0);
    s.bezierCurveTo(0.416, 0.35, 0.416, 0.72, 0, 1);
    s.bezierCurveTo(-0.416, 0.72, -0.416, 0.35, 0, 0);
    return new THREE.ShapeGeometry(s, 5);
  }

  // the escape's growth curve — you witness the last of it (~75s), then it holds
  function growthOf(ti, t, reduced, start = 0.82) {
    if (reduced) return 1;
    const g = Math.max(0, Math.min(1, (t - 2.5 - ti * 2.8) / 70));
    return start + (1 - start) * (1 - Math.pow(1 - g, 3));
  }

  // the pop-up's cut made visible: one jagged hairline + a soft lift-shadow,
  // flat on the sheet at a standing foot (tab-06's crack idiom, on the paper).
  // The caller positions the mesh and spins it in-plane with rotation.z.
  // Normal alpha blending — multiply turns these quads into hard black
  // planes at grazing angles (the AO-decal lesson, WORK.md).
  function makeHingeDecal(THREE, rng, opts = {}) {
    const scale = opts.scale ?? 1;
    const W = 256, H = 144;
    const cc = document.createElement("canvas");
    cc.width = W; cc.height = H;
    const g = cc.getContext("2d");
    const jag = (a, b) => a + rng() * (b - a);
    // the lift-shadow: warm dark, held under the cut, gone by the edges —
    // squashed to a band so it hugs the line instead of pooling around it
    g.save();
    g.translate(W / 2, H / 2);
    g.scale(1, 0.52);
    const sh = g.createRadialGradient(0, 0, 4, 0, 0, W * 0.44);
    sh.addColorStop(0, "rgba(52,46,36,0.30)");
    sh.addColorStop(0.55, "rgba(52,46,36,0.13)");
    sh.addColorStop(1, "rgba(52,46,36,0)");
    g.fillStyle = sh;
    g.fillRect(-W / 2, -H, W, 2 * H);
    g.restore();
    // the hairline: one hand-jagged cut with a fork or two
    g.strokeStyle = "rgba(38,35,28,0.75)";
    g.lineCap = "round";
    g.lineWidth = 2;
    g.beginPath();
    const segs = 5 + Math.floor(rng() * 4); // 5–8
    let px = 16, py = H / 2 + jag(-5, 5);
    g.moveTo(px, py);
    for (let s = 0; s < segs; s++) {
      px += ((W - 32) / segs) * jag(0.8, 1.2);
      py = Math.max(H * 0.2, Math.min(H * 0.8, py + jag(-9, 9)));
      g.lineTo(px, py);
    }
    g.stroke();
    g.lineWidth = 1.2;
    for (let f = 0, n = 1 + (rng() < 0.6 ? 1 : 0); f < n; f++) {
      const fx = W * jag(0.25, 0.7), fy = H / 2 + jag(-8, 8);
      g.beginPath();
      g.moveTo(fx, fy);
      g.lineTo(fx + jag(10, 26) * (rng() < 0.5 ? 1 : -1),
               fy + jag(8, 20) * (rng() < 0.5 ? 1 : -1));
      g.stroke();
    }
    const tex = new THREE.CanvasTexture(cc);
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(0.9 * scale, 0.5 * scale),
      new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false }));
    mesh.rotation.x = -Math.PI / 2;
    return mesh;
  }

  // leaf matrix updater: flutter + optional sway quaternion about a pivot
  const dummy = { obj: null };
  function leafPlacer(THREE) {
    const d = new THREE.Object3D();
    const tmpQ = new THREE.Quaternion(), flutQ = new THREE.Quaternion(), tmpV = new THREE.Vector3();
    const UP = new THREE.Vector3(0, 1, 0);
    return function place(mesh, i, L, t, reduced, swayQ, pivot, scaleMul = 1) {
      flutQ.setFromAxisAngle(L.tiltAxis, L.tilt + (reduced ? 0 : 0.09 * Math.sin((2 * Math.PI * t) / (3.1 + h1(i) * 2.2) + L.phase)));
      const align = tmpQ.setFromUnitVectors(UP, L.dir);
      if (swayQ) {
        tmpQ.multiply(flutQ).premultiply(swayQ);
        tmpV.copy(L.rest).sub(pivot).applyQuaternion(swayQ).add(pivot);
      } else {
        tmpQ.multiply(flutQ);
        tmpV.copy(L.rest);
      }
      d.position.copy(tmpV);
      d.quaternion.copy(tmpQ);
      d.scale.setScalar(L.scale * (L.u === undefined ? 1 : L.u) * scaleMul);
      d.updateMatrix();
      mesh.setMatrixAt(i, d.matrix);
    };
  }

  return { U, INK, PAPER, GREEN, h1, mulberry32, taperedTube, mergeGeoms,
           makeGrow3, clipToSphere, makeLeafGeo, growthOf, leafPlacer,
           makeHingeDecal };
})();
