/* TAB. IX — THE VISITATION, in the room.
 * The sheet lies on the table; the flowering branch stands off it, hinged
 * at the soil line (py 1300) — the EXACT individual of the plate: the
 * master's own geometry replayed from seed 90817209, no clip, no shear,
 * relief toward the visitor. Five rosettes face the room, ink-dark petals
 * with the engraving's dotted centers made material (pale, no new ink).
 * The bee is the resident: it works a closed loop — the visited flower,
 * the next, out past the left margin and back — slowing to feed at both
 * flowers. The pollen drifts along the plate's own arc between them.
 * Register on window.HM3D_STATIONS.
 */
"use strict";
window.HM3D_STATIONS.push((() => {
  const E = window.HM3D;
  const SEED = 90817209;
  const SOIL = 1300;

  // plate px → station local (sheet surface = y 0)
  const sx = (x) => (x - 700) * E.U;
  const sz = (y) => (y - 1000) * E.U;
  const HINGE = sz(SOIL); // 1.5
  const elev = (y) => (SOIL - y) * E.U; // drawn height above soil

  // ---------- the exact individual ----------
  // tab-09/generate.mjs's geometry, replayed statement for statement in the
  // same rng call order (drawing skipped; the wash blob's 16 draws are
  // consumed for parity). Positions verified against the shipped SVG.
  const G2 = (() => {
    const rng = E.mulberry32(SEED);
    const rr = (a, b) => a + rng() * (b - a);
    function stemCurve(x0, y0, a0, len, n, o = {}) {
      const pts = [[x0, y0]];
      let a = a0, x = x0, y = y0;
      const step = len / n;
      for (let i = 0; i < n; i++) {
        a += (rng() - 0.5) * (o.curl ?? 0.08) + ((o.target ?? a0) - a) * (o.ease ?? 0.05);
        x += Math.cos(a) * step;
        y += Math.sin(a) * step;
        pts.push([x, y]);
      }
      return pts;
    }
    const tangentAt = (pts, i) =>
      Math.atan2(pts[i][1] - pts[i - 1][1], pts[i][0] - pts[i - 1][0]);

    const stemPts = stemCurve(665, SOIL + 1, -Math.PI / 2 + 0.16, 870, 14, {
      curl: 0.08, target: -Math.PI / 2 - 0.13, ease: 0.045,
    });
    const sideSpecs = [
      { i: 4, side: 1, len: rr(200, 235) },
      { i: 6, side: -1, len: rr(205, 240) },
      { i: 8, side: 1, len: rr(195, 230) },
      { i: 11, side: -1, len: rr(165, 190) },
    ];
    const branches = sideSpecs.map((sp) => {
      const p = stemPts[sp.i];
      const d = tangentAt(stemPts, sp.i);
      const a0 = d + sp.side * rr(0.75, 0.95);
      const target = -Math.PI / 2 + sp.side * rr(0.35, 0.55);
      return {
        pts: stemCurve(p[0], p[1], a0, sp.len, 7, { curl: 0.16, target, ease: 0.07 }),
        side: sp.side, i: sp.i,
      };
    });
    for (let i = 0; i < 16; i++) rng(); // the wash blob — rng parity

    const leaves = [];
    function foliage(pts, idxs, s0, s1, curve) {
      let k = 0;
      for (const i of idxs) {
        if (i < 1 || i >= pts.length) continue;
        const side = k++ % 2 ? 1 : -1;
        const d = tangentAt(pts, i);
        const a = d + side * rr(0.95, 1.3);
        const p = pts[i];
        const q = [p[0] + Math.cos(a) * rr(5, 7), p[1] + Math.sin(a) * rr(5, 7)];
        const taper = 1 - 0.18 * (i / pts.length);
        const la = a + rr(-0.15, 0.15);
        const ls = rr(s0, s1) * taper;
        leaves.push({ px: p[0], py: p[1], x: q[0], y: q[1], a: la, s: ls, curve, idx: i });
      }
    }
    foliage(stemPts, [2, 3, 5, 7, 9, 10, 12, 13], 1.2, 1.45, -1);
    branches.forEach((b, bi) => foliage(b.pts, [2, 4, 6], 1.0, 1.25, bi));

    function flowerPlan() {
      const n = rng() < 0.5 ? 5 : 6;
      const rot = rr(0, Math.PI * 2);
      const petals = [];
      for (let i = 0; i < n; i++)
        petals.push({ a: rot + (i / n) * Math.PI * 2 + rr(-0.11, 0.11), s: rr(0.9, 1.08) });
      return { n, rot, petals };
    }
    const flowers = [];
    function addFlower(tipPts, R, curve) {
      const n = tipPts.length;
      const d = tangentAt(tipPts, n - 1);
      const ped = stemCurve(tipPts[n - 1][0], tipPts[n - 1][1], d + rr(-0.1, 0.1), R * 0.75 + 7, 3, {
        curl: 0.25, target: d, ease: 0.02,
      });
      const c = ped[ped.length - 1];
      const plan = flowerPlan();
      flowers.push({ x: c[0], y: c[1], R, plan, ped, curve });
    }
    addFlower(stemPts, 24, -1); // the topmost — the visited one
    branches.forEach((b, bi) => addFlower(b.pts, rr(19, 23), bi));
    return { stemPts, branches, leaves, flowers };
  })();
  const V = G2.flowers[0];
  // the next flower — the nearest unvisited one (the plate's own rule)
  const B = G2.flowers.slice(1).reduce((m, f) =>
    Math.hypot(f.x - V.x, f.y - V.y) < Math.hypot(m.x - V.x, m.y - V.y) ? f : m
  );

  return {
    id: "tab-09", numeral: "IX",
    name: "THE VISITATION", latin: "S. domestica in flower",
    technique: "pollination — visited, it sets seed",
    texture: "textures/tab-09-living.png",
    soil: SOIL,
    geometry2D: G2, // the exact individual (test handle; not part of the room contract)

    build(E3, THREE) {
      void E3;
      const group = new THREE.Group();
      const place = E.leafPlacer(THREE);
      const vineMat = new THREE.MeshStandardMaterial({ color: E.INK, roughness: 0.7 });
      const petalMat = new THREE.MeshStandardMaterial({
        color: E.INK, roughness: 0.72, side: THREE.DoubleSide,
      });
      const paleMat = new THREE.MeshStandardMaterial({ color: E.PAPER, roughness: 0.85 });
      const leafGeo = E.makeLeafGeo(THREE);
      const leafMat = new THREE.MeshStandardMaterial({
        color: E.INK, roughness: 0.9, side: THREE.DoubleSide, transparent: true, opacity: 0.85,
      });
      const specimen = new THREE.Group(); // the plant — it breathes as one body
      group.add(specimen);

      const pop = (x, y, zRel) => new THREE.Vector3(sx(x), elev(y), HINGE + zRel);

      // relief toward the visitor: the stem keeps near the hinge plane,
      // branch tips stand ~0.1 off it, flowers lean a touch further
      const stemZ = G2.stemPts.map((_, i) => 0.05 * Math.pow(i / (G2.stemPts.length - 1), 1.2));
      const branchZ = (b, j) =>
        stemZ[b.i] + (0.1 - stemZ[b.i]) * Math.pow(j / (b.pts.length - 1), 1.15);
      const leafZ = (l) => (l.curve === -1 ? stemZ[l.idx] : branchZ(G2.branches[l.curve], l.idx));
      const flowerZ = (f) => {
        const tip = f.curve === -1 ? stemZ[stemZ.length - 1] : branchZ(G2.branches[f.curve], 7);
        return tip + 0.05;
      };

      // ---------- the plant, standing ----------
      {
        const stem3 = G2.stemPts.map((p, i) => pop(p[0], p[1], stemZ[i]));
        const stem = new THREE.Mesh(E.taperedTube(THREE, stem3, 5.5, 2.5), vineMat);
        stem.castShadow = true;
        specimen.add(stem);
        for (const b of G2.branches) {
          const pts3 = b.pts.map((p, j) => pop(p[0], p[1], branchZ(b, j)));
          const m = new THREE.Mesh(E.taperedTube(THREE, pts3, 3.2, 1.45), vineMat);
          m.castShadow = true;
          specimen.add(m);
        }
      }

      // petioles + foliage (the kept boxwood, growing free)
      const leafData = [];
      {
        const petGeoms = [];
        G2.leaves.forEach((l, i) => {
          const z = leafZ(l);
          petGeoms.push(E.taperedTube(THREE,
            [pop(l.px, l.py, z), pop(l.x, l.y, z + 0.004)], 0.9, 0.55));
          const dir = new THREE.Vector3(Math.cos(l.a), -Math.sin(l.a), 0).normalize();
          leafData.push({
            rest: pop(l.x, l.y, z + 0.004), dir,
            tiltAxis: new THREE.Vector3(dir.y, -dir.x, 0).normalize(),
            tilt: 0.22 + 0.38 * E.h1(i * 3 + 2), phase: E.h1(i * 5 + 1) * Math.PI * 2,
            scale: l.s * 12.5 * E.U,
          });
        });
        specimen.add(new THREE.Mesh(E.mergeGeoms(petGeoms), vineMat));
      }
      const leafMesh = new THREE.InstancedMesh(leafGeo, leafMat, leafData.length);
      leafMesh.castShadow = true;
      leafMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      specimen.add(leafMesh);
      {
        const c = new THREE.Color();
        for (let i = 0; i < leafData.length; i++) {
          c.setHex(E.INK).multiplyScalar(0.78 + 0.22 * E.h1(i * 11 + 1));
          leafMesh.setColorAt(i, c);
        }
      }

      // ---------- the five rosettes ----------
      // the engraving's teardrop petal, unit length, spoon-cupped toward +z
      const petalGeo = (() => {
        const s = new THREE.Shape();
        s.moveTo(0, 0);
        s.bezierCurveTo(-0.143, 0.2, -0.347, 0.52, -0.17, 0.8);
        s.bezierCurveTo(-0.075, 0.96, 0.018, 0.99, 0.07, 1);
        s.bezierCurveTo(0.131, 0.98, 0.257, 0.88, 0.281, 0.72);
        s.bezierCurveTo(0.357, 0.46, 0.136, 0.18, 0, 0);
        const g = new THREE.ShapeGeometry(s, 4);
        const pa = g.attributes.position;
        for (let i = 0; i < pa.count; i++)
          pa.setZ(i, 0.14 * Math.sin(Math.PI * Math.max(0, Math.min(1, pa.getY(i)))));
        g.computeVertexNormals();
        return g;
      })();

      const flowerGroups = [];
      {
        const pedGeoms = [];
        G2.flowers.forEach((f, fi) => {
          const zTip = f.curve === -1 ? stemZ[stemZ.length - 1] : branchZ(G2.branches[f.curve], 7);
          const zF = flowerZ(f);
          pedGeoms.push(E.taperedTube(THREE,
            f.ped.map((p, j) => pop(p[0], p[1], zTip + (zF - zTip) * (j / 3))), 1.1, 0.7));

          const fg = new THREE.Group();
          fg.position.copy(pop(f.x, f.y, zF));
          // face the room, tipped a little up; a whisper of per-flower variation
          fg.rotation.x = -0.28 + 0.1 * (E.h1(fi * 7 + 3) - 0.5);
          fg.rotation.y = 0.12 * (E.h1(fi * 5 + 1) - 0.5);
          for (const p of f.plan.petals) {
            const holder = new THREE.Group();
            holder.rotation.z = -p.a; // the plate's own angle, y-down → y-up
            const m = new THREE.Mesh(petalGeo, petalMat);
            m.position.y = f.R * 0.16 * E.U; // the engraving's petal base offset
            m.rotation.x = -0.38;            // open toward the visitor
            m.scale.setScalar(f.R * p.s * E.U);
            m.castShadow = true;
            holder.add(m);
            fg.add(holder);
          }
          // the dotted center, made material — paper-pale, no new ink
          const dots = [];
          const c0 = new THREE.SphereGeometry(1.6 * 1.4 * E.U, 8, 6);
          c0.translate(0, 0, 0.008);
          dots.push(c0);
          for (let k = 0; k < f.plan.n; k++) {
            const a = f.plan.rot + (k / f.plan.n) * Math.PI * 2 + 0.3;
            const dg = new THREE.SphereGeometry(1.28 * 1.4 * E.U, 7, 5);
            dg.translate(Math.cos(a) * 4.6 * E.U, -Math.sin(a) * 4.6 * E.U, 0.009);
            dots.push(dg);
          }
          fg.add(new THREE.Mesh(E.mergeGeoms(dots), paleMat));
          specimen.add(fg);
          flowerGroups.push({ g: fg, f, restX: fg.rotation.x });
        });
        specimen.add(new THREE.Mesh(E.mergeGeoms(pedGeoms), vineMat));
      }
      const vFlow = pop(V.x, V.y, flowerZ(V));
      const bFlow = pop(B.x, B.y, flowerZ(B));

      // ---------- the bee — the resident ----------
      // the engraving's body in the round: abdomen + head ellipsoids, two
      // swept wing discs, antennae; body ≈ 45 px, the plate's s=1
      const bee = new THREE.Group();
      const beeIn = new THREE.Group(); // head +x → the lookAt frame's −z
      beeIn.rotation.y = Math.PI / 2;
      bee.add(beeIn);
      const wings = [];
      {
        const beeMat = new THREE.MeshStandardMaterial({ color: E.INK, roughness: 0.7 });
        const abd = new THREE.Mesh(new THREE.SphereGeometry(1, 12, 9), beeMat);
        abd.scale.set(14.5 * E.U, 8.6 * E.U, 8.6 * E.U);
        abd.position.x = -7 * E.U;
        abd.castShadow = true;
        beeIn.add(abd);
        const head = new THREE.Mesh(new THREE.SphereGeometry(1, 10, 8), beeMat);
        head.scale.set(7.6 * E.U, 6.6 * E.U, 6.6 * E.U);
        head.position.x = 9 * E.U;
        beeIn.add(head);
        const wingGeo = new THREE.CircleGeometry(1, 14);
        wingGeo.scale(13 * E.U, 4.5 * E.U, 1);
        wingGeo.translate(-9 * E.U, 0, 0); // sweeps back from the thorax base
        const wingMat = new THREE.MeshStandardMaterial({
          color: E.INK, roughness: 0.6, side: THREE.DoubleSide, transparent: true, opacity: 0.45,
        });
        for (const side of [1, -1]) {
          const wg = new THREE.Group();
          wg.position.set(-1 * E.U, 4.5 * E.U, side * 2 * E.U);
          const inner = new THREE.Group();
          inner.rotation.y = side * 0.35; // swept up-back
          const wm = new THREE.Mesh(wingGeo, wingMat);
          wm.rotation.x = -Math.PI / 2; // lie flat
          inner.add(wm);
          wg.add(inner);
          beeIn.add(wg);
          wings.push({ g: wg, side });
        }
        for (const side of [1, -1]) {
          const pts = [
            new THREE.Vector3(15 * E.U, 2 * E.U, side * 2 * E.U),
            new THREE.Vector3(20 * E.U, 6 * E.U, side * 3 * E.U),
            new THREE.Vector3(23 * E.U, 7.5 * E.U, side * 4.5 * E.U),
          ];
          beeIn.add(new THREE.Mesh(E.taperedTube(THREE, pts, 0.9, 0.45), beeMat));
        }
      }
      group.add(bee);

      // the loop: the visited flower, the next, out past the left margin
      // (the plate's second bee arriving), back over the plant to V
      const vHover = pop(V.x + 17.3, V.y - 19.38, 0.34); // the plate's visiting pose
      const bHover = pop(B.x + 15, B.y - 17, 0.34);
      const loop = new THREE.CatmullRomCurve3([
        vHover, bHover,
        new THREE.Vector3(sx(-60), elev(660), HINGE + 0.7),  // off the sheet, left margin
        new THREE.Vector3(sx(430), elev(330), HINGE + 0.55), // the return leg
      ], true, "catmullrom", 0.6);

      // dwells: the bee slows to feed at V (phase 0) and B (phase 1/4).
      // A monotonic phase→arc warp, integrated once at build (deterministic;
      // the bee's position stays a pure function of t)
      const PERIOD = 26;
      const DWELLS = [
        { c: 0, depth: 0.94, sig: 0.05 },
        { c: 0.25, depth: 0.88, sig: 0.045 },
      ];
      const gaussAt = (u, c, sig) => {
        let dd = Math.abs(u - c); dd = Math.min(dd, 1 - dd);
        return Math.exp(-(dd * dd) / (sig * sig));
      };
      const LT_N = 720;
      const lut = new Float32Array(LT_N + 1);
      {
        const speed = (u) => {
          let s = 1;
          for (const d of DWELLS) s -= d.depth * gaussAt(u, d.c, d.sig);
          return Math.max(0.02, s);
        };
        const raw = new Float32Array(LT_N + 1);
        let acc = 0;
        for (let i = 0; i < LT_N; i++) {
          acc += (speed(i / LT_N) + 2 * speed((i + 0.5) / LT_N) + speed((i + 1) / LT_N)) / (4 * LT_N);
          raw[i + 1] = acc;
        }
        for (let i = 0; i <= LT_N; i++) lut[i] = raw[i] / acc;
      }
      const dwellWarp = (u) => {
        const x = u * LT_N, i = Math.min(LT_N - 1, Math.floor(x)), f = x - i;
        return lut[i] + (lut[i + 1] - lut[i]) * f;
      };

      const UP = new THREE.Vector3(0, 1, 0);
      const ZERO = new THREE.Vector3();
      const _tan = new THREE.Vector3(), _toF = new THREE.Vector3(),
        _look = new THREE.Vector3(), _m4 = new THREE.Matrix4();
      function beePose(tt) {
        const phase = ((tt / PERIOD) % 1 + 1) % 1;
        const v = dwellWarp(phase);
        loop.getPoint(v, bee.position);
        loop.getTangent(v, _tan);
        const wV = 0.94 * gaussAt(phase, 0, 0.05);
        const wB = 0.88 * gaussAt(phase, 0.25, 0.045);
        const w = Math.min(1, Math.max(wV, wB));
        // feeding pose: while dwelling, head turns into the flower
        _toF.copy(wV >= wB ? vFlow : bFlow).sub(bee.position).normalize();
        _look.copy(_tan).multiplyScalar(1 - w).addScaledVector(_toF, w).normalize();
        _m4.lookAt(ZERO, _look, UP);
        bee.quaternion.setFromRotationMatrix(_m4);
        // hover bob, strongest at the flowers
        bee.position.y += 0.006 * Math.sin(2 * Math.PI * 2.3 * tt) * (0.25 + 0.75 * w);
        wings[0].g.rotation.x = 0.5 + 0.42 * Math.sin(2 * Math.PI * 11 * tt);
        wings[1].g.rotation.x = -(0.5 + 0.42 * Math.sin(2 * Math.PI * 11 * tt + 1.1));
      }
      function beeStill() { // reduced: it hangs mid-loop, at the visited flower
        bee.position.copy(vHover);
        _toF.copy(vFlow).sub(vHover).normalize();
        _m4.lookAt(ZERO, _toF, UP);
        bee.quaternion.setFromRotationMatrix(_m4);
        wings[0].g.rotation.x = 0.35;
        wings[1].g.rotation.x = -0.35;
      }

      // ---------- the pollen — the plate's own arc, drifting ----------
      const POLLEN_N = 9;
      const pollenBase = [];
      {
        const dx = B.x - V.x, dy = B.y - V.y, m = Math.hypot(dx, dy);
        const p0 = [V.x + (dx / m) * (V.R + 2), V.y + (dy / m) * (V.R + 2)];
        const p2 = [B.x - (dx / m) * (B.R + 2), B.y - (dy / m) * (B.R + 2)];
        let px = -(dy / m), py = dx / m; // perpendicular, bowed upward
        if (py > 0) { px = -px; py = -py; }
        const bow = m * 0.16;
        const p1 = [(p0[0] + p2[0]) / 2 + px * bow, (p0[1] + p2[1]) / 2 + py * bow];
        for (let i = 0; i < POLLEN_N; i++) {
          pollenBase.push({
            u0: 0.08 + (i / POLLEN_N) * 0.84, p0, p1, p2,
            T: 5.5 + 3.5 * E.h1(i * 3 + 1), ph: E.h1(i * 7 + 2) * Math.PI * 2,
            s: 0.8 + 0.4 * E.h1(i * 5 + 3),
          });
        }
      }
      const polMesh = new THREE.InstancedMesh(
        new THREE.SphereGeometry(2.2 * E.U, 6, 5),
        new THREE.MeshBasicMaterial({ color: E.INK, transparent: true, opacity: 0.4 }),
        POLLEN_N);
      polMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      group.add(polMesh);
      const dummy = new THREE.Object3D();
      function placePollen(tt, still) {
        for (let i = 0; i < POLLEN_N; i++) {
          const pb = pollenBase[i];
          // each speck crosses the arc in ~110 s, closed-form
          const u = still ? pb.u0 : ((pb.u0 + tt / 110) % 1);
          const q = (a, b, c) => (1 - u) * (1 - u) * a + 2 * (1 - u) * u * b + u * u * c;
          dummy.position.set(
            sx(q(pb.p0[0], pb.p1[0], pb.p2[0])), elev(q(pb.p0[1], pb.p1[1], pb.p2[1])), HINGE + 0.3);
          if (!still) {
            dummy.position.x += 0.03 * Math.sin((2 * Math.PI * tt) / pb.T + pb.ph);
            dummy.position.y += 0.02 * Math.cos((2 * Math.PI * tt) / (pb.T * 0.8) + pb.ph * 1.7);
            dummy.position.z += 0.03 * Math.sin((2 * Math.PI * tt) / (pb.T * 1.13) + pb.ph * 0.6);
          }
          dummy.quaternion.identity();
          dummy.scale.setScalar(pb.s);
          dummy.updateMatrix();
          polMesh.setMatrixAt(i, dummy.matrix);
        }
        polMesh.instanceMatrix.needsUpdate = true;
      }

      // ---------- per-frame ----------
      function placeLeaves(tt, still, swayQ) {
        for (let i = 0; i < leafData.length; i++)
          place(leafMesh, i, leafData[i], tt, still, swayQ, ZERO);
        leafMesh.instanceMatrix.needsUpdate = true;
      }
      // the flowers nod, very slightly, as the bee leaves — event-flavored,
      // tied to the loop's phase so it stays a pure function of t
      function placeFlowers(tt, phase) {
        for (const fg of flowerGroups) {
          let nod = 0;
          if (fg.f === V) nod = 0.05 * gaussAt(phase, 0.09, 0.035) * Math.sin((2 * Math.PI * tt) / 0.9);
          else if (fg.f === B) nod = 0.05 * gaussAt(phase, 0.34, 0.035) * Math.sin((2 * Math.PI * tt) / 0.9 + 0.7);
          fg.g.rotation.x = fg.restX + nod;
        }
      }
      const breathe = (tt, r) =>
        r ? [0, 0, 0]
          : [0.0028 * Math.sin((2 * Math.PI * tt) / 8.3), 0, 0.0035 * Math.sin((2 * Math.PI * tt) / 11)];
      let placedStatic = false;
      const _specQ = new THREE.Quaternion(); // per-frame temp, hoisted
      function update(t, reduced, active) {
        const br = breathe(t, reduced);
        specimen.rotation.set(br[0], br[1], br[2]);
        if (reduced || !active) { // cheap: the visit hangs still, once
          if (!placedStatic) {
            _specQ.setFromEuler(specimen.rotation);
            placeLeaves(0, true, _specQ);
            placePollen(0, true);
            for (const fg of flowerGroups) fg.g.rotation.x = fg.restX;
            beeStill();
            placedStatic = true;
          }
          return;
        }
        placedStatic = false;
        _specQ.setFromEuler(specimen.rotation);
        placeLeaves(t, false, _specQ);
        beePose(t);
        placePollen(t, false);
        placeFlowers(t, ((t / PERIOD) % 1 + 1) % 1);
      }

      return {
        group, update,
        labels: {
          a: { pos: pop(V.x + 26, V.y - 4, 0.5), name: "the flower",
               note: "the visited one. it opened, the pollinator came, and visited, it sets seed — the next generation is shaped by the visit." },
          b: { pos: new THREE.Vector3(sx(1228), 0.05, sz(1444)), name: "the visitor",
               note: "the pollinator, enlarged threefold on the sheet. in the room it works the loop: this flower, the next, then out past the margin and back." },
          c: { pos: pop(648.7, 433.5, 0.36), name: "the pollen path",
               note: "a dotted arc between the visited flower and the next — the feedback, still drifting across." },
          e: { pos: new THREE.Vector3(sx(950), 0.05, HINGE + 0.05), name: "the surface",
               note: "the deployment boundary. what shows above is the product." },
        },
        views: {
          home: { az: -14, el: 22, dist: 9.8, tg: [0, 1.85, 1.2] },
          a: { az: -22, el: 16, dist: 4.2, tg: [sx(V.x) + 0.3, elev(V.y) - 0.25, HINGE + 0.35] },
          b: { az: 16, el: 50, dist: 4.6, tg: [2.4, 0.12, 2.0] },
          c: { az: -18, el: 18, dist: 4.4, tg: [sx(648.7) + 0.2, elev(433.5) - 0.3, HINGE + 0.4] },
          e: { az: -22, el: 18, dist: 5.2, tg: [0.9, 0.35, 1.55] },
        },
      };
    },
  };
})());
