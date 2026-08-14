/* TAB. VII — THE MARK, in the room.
 * The SAME individual as Tab. I (seed 48151623): the crown builder is copied
 * verbatim from specimens/tab-01.js and the unstruck escapes are the exact
 * exported individual (window.GEO), same pop-up mapping — glance between
 * stations I and VII and it is one plant. Stricken:
 *   - the up-right escape (GEO tree 2) is replaced by the wilted shoot,
 *     grown in the plate plane with the plate's own blight opts (bias 0.06
 *     down); it has STOPPED — no growth, no sway, leaves hang dead (≈ π/2).
 *   - the rust is re-applied to the standing crown: pustules cluster at the
 *     3D stubs with the plate's own placement math, one rust ink #8a4a26.
 *   - the crown's leaves take a faint ochre cast (#6a6b3a), stronger at the
 *     wounds — the on-paper wash is this color at 0.08.
 * Nothing on VII grows (vines render full from the first frame); the crown
 * only breathes. The fallen leaves stay printed on the sheet (letter f).
 * Register on window.HM3D_STATIONS.
 */
"use strict";
window.HM3D_STATIONS.push((() => {
  const E = window.HM3D, GEO = window.GEO;
  const SOIL = 1300;
  const R = GEO.ball.r * E.U;
  const RUST = 0x8a4a26, OCHRE = 0x6a6b3a;
  const WILT_TREE = 2; // GEO index of Tab. I's up-right escape — struck here

  // plate px → station local (sheet surface = y 0)
  const sx = (x) => (x - 700) * E.U;
  const sz = (y) => (y - 1000) * E.U;
  const HINGE = sz(SOIL); // 1.5
  const elev = (y) => (SOIL - y) * E.U; // drawn height above soil

  // the plate's own 2D growth grammar, kept for the wilted shoot so the droop
  // is the plate's bias, in the hinge plane — own rng stream (the crown above
  // stays byte-aligned with Tab. I's module)
  function makeGrow2(rng) {
    const rr2 = (a, b) => a + rng() * (b - a);
    function grow(x, y, angle, len, w, depth, opts, out) {
      let a = angle, px = x, py = y;
      const pts = [[px, py]];
      const segs = opts.segs ?? 4;
      const step = len / segs;
      for (let i = 0; i < segs; i++) {
        a += (rng() - 0.5) * opts.curl + (opts.bias ?? 0);
        px += Math.cos(a) * step; py += Math.sin(a) * step;
        pts.push([px, py]);
        if (depth > 0 && w > 0.9 && i > 0 && rng() < opts.lateral) {
          const side = rng() < 0.5 ? 1 : -1;
          grow(px, py, a + side * opts.spread * (0.7 + rng() * 0.7),
            len * opts.decay * (0.45 + rng() * 0.4), w * 0.55, depth - 1, opts, out);
        }
      }
      out.branches.push({ pts, w });
      if (depth > 0 && w * 0.62 > 0.6) {
        const kids = 2 + (rng() < (opts.tri ?? 0.35) ? 1 : 0);
        for (let k = 0; k < kids; k++) {
          const na = a + (rng() - 0.5) * opts.spread * 2.2;
          grow(px, py, na, len * opts.decay * (0.7 + rng() * 0.5), w * 0.62, depth - 1, opts, out);
        }
      } else {
        out.tips.push({ x: px, y: py, a });
        const n = pts.length;
        for (let i = Math.max(1, n - 3); i < n; i++) {
          if (rng() < opts.leafAlong) {
            out.leaves.push({
              x: pts[i][0], y: pts[i][1],
              a: Math.atan2(pts[i][1] - pts[i - 1][1], pts[i][0] - pts[i - 1][0]) + rr2(-0.7, 0.7),
              s: rr2(0.7, 1.15) * opts.leafScale,
            });
          }
        }
      }
    }
    return { grow, rr2, rng };
  }

  return {
    id: "tab-07", numeral: "VII",
    name: "THE MARK", latin: "S. domestica blighted",
    technique: "rust — it finds the cut first",
    texture: "textures/tab-07-living.png",
    soil: SOIL,

    build(E3, THREE) {
      const SCv = new THREE.Vector3(0, elev(GEO.ball.cy), HINGE); // sphere center
      const group = new THREE.Group();
      const place = E.leafPlacer(THREE);
      const rng3 = E.mulberry32(GEO.seed);
      const { grow3, rr3 } = E.makeGrow3(THREE, rng3);
      const vineMat = new THREE.MeshStandardMaterial({ color: E.INK, roughness: 0.7 });
      const leafGeo = E.makeLeafGeo(THREE);
      const leafMat = new THREE.MeshStandardMaterial({
        color: E.INK, roughness: 0.9, side: THREE.DoubleSide, transparent: true, opacity: 0.85,
      });
      const deadLeafMat = new THREE.MeshStandardMaterial({
        color: E.INK, roughness: 0.95, side: THREE.DoubleSide, transparent: true, opacity: 0.6,
      });
      const specimen = new THREE.Group();
      group.add(specimen);

      // trunk: rises from the soil mark with a trained lean into the crown
      {
        const pts = [
          new THREE.Vector3(0, 0, HINGE),
          new THREE.Vector3(0.05, 0.5, HINGE + 0.02),
          new THREE.Vector3(-0.04, 1.1, HINGE),
          new THREE.Vector3(0, 1.62, HINGE),
        ];
        const trunk = new THREE.Mesh(E.taperedTube(THREE, pts, 15, 7), vineMat);
        trunk.castShadow = true;
        specimen.add(trunk);
      }

      // the pop-up's cut made visible at the trunk foot — same figure as
      // Tab. I, same foot; own rng stream so the crown stays byte-aligned
      {
        const jr = E.mulberry32(GEO.seed + 7);
        const decal = E.makeHingeDecal(THREE, jr);
        decal.position.set(0, 0.002, HINGE);
        decal.rotation.z = 0.05 + (jr() - 0.5) * 0.12;
        group.add(decal);
      }

      // ---- the crown: twelve leaders, sheared at the sphere — VERBATIM Tab. I
      const tangle = { branches: [], tips: [], leaves: [] };
      const crownO = new THREE.Vector3(0, elev(1120), HINGE);
      for (let i = 0; i < 9; i++) {
        const az = (i / 9) * Math.PI * 2 + rr3(-0.15, 0.15);
        const pol = rr3(0.5, 2.4);
        const dir = new THREE.Vector3(Math.sin(pol) * Math.cos(az), Math.cos(pol), Math.sin(pol) * Math.sin(az));
        grow3(crownO.clone().add(new THREE.Vector3(rr3(-0.13, 0.13), rr3(-0.09, 0.06), rr3(-0.09, 0.09))),
          dir, rr3(0.95, 1.3), rr3(4, 5), 5,
          { curl: 1.15, spread: 0.7, decay: 0.68, lateral: 0.15, leafAlong: 0.12, leafScale: 0.5, segs: 6, tri: 0.25 }, tangle);
      }
      for (const pol of [0.3, 0.45, 0.6]) {
        const az = rr3(0, Math.PI * 2);
        const dir = new THREE.Vector3(Math.sin(pol) * Math.cos(az), Math.cos(pol), Math.sin(pol) * Math.sin(az));
        grow3(crownO.clone().add(new THREE.Vector3(rr3(-0.06, 0.06), rr3(-0.03, 0.03), rr3(-0.03, 0.03))),
          dir, rr3(1.35, 1.65), rr3(3.5, 4.5), 5,
          { curl: 1.05, spread: 0.65, decay: 0.68, lateral: 0.15, leafAlong: 0.12, leafScale: 0.5, segs: 7, tri: 0.25 }, tangle);
      }
      const stubs = [];
      const crownGeoms = [];
      for (const b of tangle.branches) {
        const { kept, cut } = E.clipToSphere(THREE, b.pts, SCv, R);
        if (kept.length > 1) crownGeoms.push(E.taperedTube(THREE, kept, b.w, b.w * 0.55));
        if (cut) stubs.push({ ...cut, w: b.w });
      }
      const crown = new THREE.Mesh(E.mergeGeoms(crownGeoms), vineMat);
      crown.castShadow = true;
      specimen.add(crown);

      // stub nubs on the shear surface — the rust's anchor (verbatim Tab. I)
      {
        const stubGeo = new THREE.CylinderGeometry(1, 0.8, 0.02, 8);
        const stubMat = new THREE.MeshStandardMaterial({ color: E.PAPER, roughness: 0.9 });
        const stubMesh = new THREE.InstancedMesh(stubGeo, stubMat, stubs.length);
        const d3 = new THREE.Object3D(), up = new THREE.Vector3(0, 1, 0);
        stubs.forEach((s, i) => {
          d3.position.copy(s.p).addScaledVector(s.d, 0.008);
          d3.quaternion.setFromUnitVectors(up, s.d);
          d3.scale.setScalar(Math.min(3.4, Math.max(1.8, s.w * 0.55)) * E.U);
          d3.updateMatrix();
          stubMesh.setMatrixAt(i, d3.matrix);
        });
        specimen.add(stubMesh);
      }

      // tangle leaves (interior) — verbatim Tab. I
      const tangleLeafData = tangle.leaves.map((l, i) => ({
        rest: l.p, dir: l.d,
        tiltAxis: new THREE.Vector3(l.d.y, -l.d.x, 0).normalize(),
        tilt: 0.6 + 0.7 * E.h1(i * 3 + 2), phase: E.h1(i * 5 + 1) * Math.PI * 2,
        scale: l.s * 12.5 * E.U,
      }));
      const tangleLeafMesh = new THREE.InstancedMesh(leafGeo, leafMat, tangleLeafData.length);
      tangleLeafMesh.castShadow = true;
      tangleLeafMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      specimen.add(tangleLeafMesh);

      // the shell skin — sparse enough to see the tangle inside (verbatim Tab. I)
      const SHELL_N = 2600;
      const shellData = [];
      for (let i = 0; i < SHELL_N; i++) {
        const z = rr3(-1, 1), az = rr3(0, Math.PI * 2);
        const rr_ = Math.sqrt(1 - z * z);
        const u = new THREE.Vector3(rr_ * Math.cos(az), z, rr_ * Math.sin(az));
        const wob = 1 + 0.02 * Math.sin(3 * az + 1.7) + 0.01 * Math.sin(7 * az + 0.4);
        const rad = R * rr3(0.955, 1.0) * wob;
        const tangent = new THREE.Vector3(rr3(-1, 1), rr3(-1, 1), rr3(-1, 1)).cross(u).normalize()
          .applyAxisAngle(u, rr3(0, Math.PI * 2));
        shellData.push({
          rest: SCv.clone().addScaledVector(u, rad),
          dir: tangent,
          tiltAxis: new THREE.Vector3().crossVectors(tangent, u).normalize(),
          tilt: 0.55 + 0.6 * E.h1(i * 7 + 2), phase: E.h1(i * 5 + 3) * Math.PI * 2,
          scale: rr3(0.55, 0.86) * 12.5 * E.U,
        });
      }
      const shellMesh = new THREE.InstancedMesh(leafGeo, leafMat, shellData.length);
      shellMesh.castShadow = true;
      shellMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      specimen.add(shellMesh);
      {
        // the sickly cast: Tab. I's instance shading, but the crown is tinged
        // toward ochre — faint overall, stronger where the wounds cluster
        const c = new THREE.Color(), oc = new THREE.Color(OCHRE);
        [tangleLeafMesh, shellMesh].forEach((mesh, mi) => {
          const data = mi === 0 ? tangleLeafData : shellData;
          for (let i = 0; i < mesh.count; i++) {
            let dmin = 1e9;
            for (const s of stubs) dmin = Math.min(dmin, data[i].rest.distanceTo(s.p));
            const cast = 0.10 + 0.38 * Math.max(0, 1 - dmin / 0.55);
            c.setHex(E.INK).multiplyScalar(0.75 + 0.25 * E.h1(i * 11 + mi)).lerp(oc, Math.min(0.5, cast));
            mesh.setColorAt(i, c);
          }
        });
      }

      // ---------- the rust, re-applied to the standing specimen ----------
      // the plate's own law: pustules gather at the severed stubs, count scaled
      // by wounds within 105px; they spread inward from each cut face and are
      // clamped to tissue; a thin scatter (p 0.4) lands just inside the shear.
      // One rust ink, small-dose. Own rng stream — the crown stays aligned.
      {
        const rng = E.mulberry32(GEO.seed ^ 0x8a4a26);
        const rr = (a, b) => a + rng() * (b - a);
        const rings = [], dots = [];
        const near = stubs.map((s) =>
          stubs.reduce((n, o) => n + (o.p.distanceTo(s.p) < 105 * E.U ? 1 : 0), 0) - 1);
        const addPustule = (pos, s) => {
          const normal = pos.clone().sub(SCv).normalize();
          const t1 = Math.abs(normal.y) < 0.9
            ? new THREE.Vector3().crossVectors(normal, new THREE.Vector3(0, 1, 0)).normalize()
            : new THREE.Vector3(1, 0, 0);
          const t2 = new THREE.Vector3().crossVectors(normal, t1).normalize();
          const kind = rng();
          const SU = 1.8 * E.U; // room scale: the gathering law is the plate's; at 3D distance the hairline marks need ~1.8x to read
          if (kind < 0.5) {
            rings.push({ pos, normal, r: 1.8 * s * SU, shade: rr(0.6, 0.9) });
            const jp = pos.clone()
              .addScaledVector(t1, rr(-0.3, 0.3) * s * SU)
              .addScaledVector(t2, rr(-0.3, 0.3) * s * SU);
            dots.push({ pos: jp, normal, r: 0.7 * s * SU, shade: rr(0.6, 0.9) });
          } else if (kind < 0.82) {
            rings.push({ pos, normal, r: 1.5 * s * SU, shade: rr(0.55, 0.85) });
          } else {
            dots.push({ pos, normal, r: 1.05 * s * SU, shade: rr(0.55, 0.85) });
          }
        };
        stubs.forEach((s, i) => {
          const radial = s.p.clone().sub(SCv).normalize();
          let sideV = new THREE.Vector3().crossVectors(s.d, radial);
          sideV = sideV.lengthSq() < 1e-8 ? new THREE.Vector3(1, 0, 0) : sideV.normalize();
          const crowd = Math.min(4, near[i]);
          const nP = Math.round(rr(0, 1.1) + crowd * rr(0.6, 1.0));
          for (let k = 0; k < nP; k++) {
            const along = rr(-0.15, 1.0) * (6 + crowd * 4) * E.U;  // inward along the twig
            const side = rr(-1, 1) * (5 + crowd * 2.5) * E.U;      // across the wound
            const pos = s.p.clone().addScaledVector(s.d, -along).addScaledVector(sideV, side);
            let dc = pos.distanceTo(SCv);
            // rust grows on tissue, not air — anything past the face pulls back in
            if (dc > R + 6 * E.U) { pos.sub(SCv).multiplyScalar((R * 0.97) / dc).add(SCv); dc = R * 0.97; }
            addPustule(pos, rr(0.65, 1.2));
          }
          // thin scatter onto the shell just inside the shear
          if (rng() < 0.4) {
            const dir = radial.clone().applyAxisAngle(sideV, rr(-0.14, 0.14));
            addPustule(SCv.clone().addScaledVector(dir, R * rr(0.84, 0.95)), rr(0.55, 0.95));
          }
        });
        const ringGeo = new THREE.RingGeometry(0.5, 1, 10);
        const dotGeo = new THREE.CircleGeometry(1, 8);
        const rustMat = new THREE.MeshStandardMaterial({
          color: RUST, roughness: 0.5, side: THREE.DoubleSide, transparent: true, opacity: 0.95,
          // the second ink must stay findable in the room's gloom — a faint
          // self-tone of the same rust, not a light
          emissive: RUST, emissiveIntensity: 0.38,
        });
        const d3 = new THREE.Object3D(), c = new THREE.Color(), ZZ = new THREE.Vector3(0, 0, 1);
        const fill = (mesh, arr) => {
          arr.forEach((g, i) => {
            const n = g.normal;
            // erupting pustule: never sunk under the leaf-skin — it breaks the surface
            const rn = Math.max(g.pos.distanceTo(SCv), R) + 0.006;
            d3.position.copy(SCv).addScaledVector(n, rn);
            d3.quaternion.setFromUnitVectors(ZZ, n);
            d3.scale.setScalar(g.r);
            d3.updateMatrix();
            mesh.setMatrixAt(i, d3.matrix);
            c.setHex(RUST).multiplyScalar(0.9 + 0.25 * g.shade);
            mesh.setColorAt(i, c);
          });
        };
        const ringMesh = new THREE.InstancedMesh(ringGeo, rustMat, rings.length);
        const dotMesh = new THREE.InstancedMesh(dotGeo, rustMat, dots.length);
        fill(ringMesh, rings); fill(dotMesh, dots);
        specimen.add(ringMesh, dotMesh);
      }

      // ---- the escapes: the EXACT individual — but the up-right shoot (GEO
      // tree 2) is struck; the wilted shoot stands in its place, grown with the
      // plate's own blight opts in the hinge plane
      const wilt2 = { branches: [], tips: [], leaves: [] };
      const wg = makeGrow2(E.mulberry32(GEO.seed + 185));
      wg.grow(815 + wg.rr2(-8, 8), 750 + wg.rr2(-8, 8), -0.08 + wg.rr2(-0.04, 0.04),
        185 * wg.rr2(0.92, 1.06), 4.5, 3,
        { curl: 0.16, spread: 0.45, decay: 0.58, lateral: 0.1, leafAlong: 1.0, leafScale: 0.8, segs: 7, tri: 0.3, bias: 0.06 },
        wilt2);
      const outOfBall = (x, y) => Math.hypot(x - GEO.ball.cx, y - GEO.ball.cy) >= GEO.ball.r - 2;
      // spent foliage: smaller, hanging straight down off the twigs
      const wiltLeaves = [];
      for (const l of wilt2.leaves)
        if (outOfBall(l.x, l.y)) wiltLeaves.push({ x: l.x, y: l.y, a: Math.PI / 2 + wg.rr2(-0.45, 0.45), s: l.s });
      const wiltTipsOut = [];
      for (const tp of wilt2.tips) {
        if (!outOfBall(tp.x, tp.y)) continue;
        wiltTipsOut.push(tp);
        wiltLeaves.push({ x: tp.x, y: tp.y, a: tp.a + wg.rr2(0.7, 1.2), s: wg.rr2(0.7, 0.9) });
        if (wg.rng() < 0.6)
          wiltLeaves.push({ x: tp.x + wg.rr2(-6, 6), y: tp.y + wg.rr2(-6, 6), a: Math.PI / 2 + wg.rr2(-0.5, 0.5), s: wg.rr2(0.55, 0.75) });
      }
      // c's anchor: the shoot's true hanging tip — its lowest outside terminal
      let wiltTip = null;
      for (const tp of wiltTipsOut) if (!wiltTip || tp.y > wiltTip.y) wiltTip = tp;
      if (!wiltTip) wiltTip = { x: 1000, y: 860 };

      const LIFT = { shoot: 0.95, sprout: 0.4, sucker: 0.4, wilt: 0.95 };
      const srcTrees = GEO.trees.map((t, i) =>
        i === WILT_TREE ? { g: "wilt", branches: wilt2.branches } : t);
      const trees = srcTrees.map((t, ti) => {
        const branches = t.branches.map((b) => ({
          w: b.w, pts: b.pts, d: new Array(b.pts.length).fill(null), attach: null,
        }));
        branches.forEach((b, i) => {
          const key = b.pts[0][0] + "," + b.pts[0][1];
          for (let j = 0; j < branches.length; j++) {
            const from = i === j ? 1 : 0;
            for (let k = from; k < branches[j].pts.length; k++) {
              if (branches[j].pts[k][0] + "," + branches[j].pts[k][1] === key) {
                b.attach = { branch: j, point: k }; j = branches.length; break;
              }
            }
          }
        });
        for (let pass = 0; pass < 12; pass++) {
          let resolved = 0;
          branches.forEach((b) => {
            if (b.d[0] !== null) { resolved++; return; }
            if (!b.attach) b.d[0] = 0;
            else {
              const pd = branches[b.attach.branch].d[b.attach.point];
              if (pd !== null) b.d[0] = pd;
            }
            if (b.d[0] !== null) {
              for (let k = 1; k < b.pts.length; k++)
                b.d[k] = b.d[k - 1] + Math.hypot(b.pts[k][0] - b.pts[k - 1][0], b.pts[k][1] - b.pts[k - 1][1]);
              resolved++;
            }
          });
          if (resolved === branches.length) break;
        }
        const maxD = Math.max(...branches.flatMap((b) => b.d));
        const liftK = LIFT[t.g] * (0.85 + 0.3 * E.h1(ti * 7 + 1));
        return { g: t.g, branches, maxD, lift: (d) => liftK * Math.pow(d / maxD, 1.35) };
      });
      function trimOutside(branch, inset = 5) {
        const c = GEO.ball, r = c.r - inset;
        const pts = branch.pts, ds = branch.d;
        const outside = (x, y) => Math.hypot(x - c.cx, y - c.cy) - r > 0;
        const cross = (i, entering) => {
          const [x1, y1] = pts[i], [x2, y2] = pts[i + 1];
          const dx = x2 - x1, dy = y2 - y1;
          const fx = x1 - c.cx, fy = y1 - c.cy;
          const A = dx * dx + dy * dy, B = 2 * (fx * dx + fy * dy), C = fx * fx + fy * fy - r * r;
          const disc = B * B - 4 * A * C;
          if (disc < 0 || A === 0) return null;
          const t = (-B + (entering ? -1 : 1) * Math.sqrt(disc)) / (2 * A);
          return { x: x1 + dx * t, y: y1 + dy * t, d: ds[i] + (ds[i + 1] - ds[i]) * t };
        };
        const runs = []; let cur = [];
        for (let i = 0; i < pts.length - 1; i++) {
          const o1 = outside(pts[i][0], pts[i][1]), o2 = outside(pts[i + 1][0], pts[i + 1][1]);
          if (o1 && o2) { cur.push({ x: pts[i + 1][0], y: pts[i + 1][1], d: ds[i + 1] }); continue; }
          if (!o1 && o2) { const p = cross(i, false); cur = [p ?? { x: pts[i + 1][0], y: pts[i + 1][1], d: ds[i + 1] }, { x: pts[i + 1][0], y: pts[i + 1][1], d: ds[i + 1] }]; continue; }
          if (o1 && !o2) { const p = cross(i, true); if (p) cur.push(p); if (cur.length > 1) runs.push(cur); cur = []; continue; }
          if (cur.length > 1) runs.push(cur); cur = [];
        }
        if (cur.length > 1) runs.push(cur);
        if (runs.length && outside(pts[0][0], pts[0][1]) &&
            runs[0][0].x === pts[1][0] && runs[0][0].y === pts[1][1])
          runs[0].unshift({ x: pts[0][0], y: pts[0][1], d: ds[0] });
        return runs;
      }
      const pop = (x, y, zRel) => new THREE.Vector3(sx(x), elev(y), HINGE + zRel);
      const vines = [];
      const treeGroups = [];
      trees.forEach((tree, ti) => {
        const rootB = tree.branches.find((b) => !b.attach);
        const pivotV = pop(rootB.pts[0][0], rootB.pts[0][1], 0);
        const g = new THREE.Group();
        g.position.copy(pivotV);
        group.add(g);
        treeGroups[ti] = { group: g, pivot: pivotV, tree };
        tree.branches.forEach((b) => {
          for (const run of trimOutside(b)) {
            const pts3 = run.map((p) => pop(p.x, p.y, tree.lift(p.d)).sub(pivotV));
            const geo = E.taperedTube(THREE, pts3, b.w, Math.max(1.8, b.w * 0.4));
            const mesh = new THREE.Mesh(geo, vineMat);
            mesh.castShadow = true;
            g.add(mesh);
            vines.push({ mesh, full: geo.getIndex().count, tree: ti });
          }
        });
      });

      // escape leaves — GEO foliage not owned by the struck shoot stands as
      // Tab. I; the struck shoot's own spent leaves hang off the wilt
      const escapeLeafData = [];
      const wiltLeafData = [];
      {
        const origPts = [];
        GEO.trees.forEach((t, ti) => t.branches.forEach((b) =>
          b.pts.forEach((p) => origPts.push({ x: p[0], y: p[1], ti }))));
        const owner = (x, y) => {
          let best = -1, bd = 1e9;
          for (const p of origPts) {
            const d = (p.x - x) * (p.x - x) + (p.y - y) * (p.y - y);
            if (d < bd) { bd = d; best = p.ti; }
          }
          return best;
        };
        const allPts = [];
        trees.forEach((tree, ti) => tree.branches.forEach((b, bi) =>
          b.pts.forEach((p, pi) => { if (b.d[pi] !== null) allPts.push({ x: p[0], y: p[1], ti, bi, pi }); })));
        const findTree = (x, y) => {
          let best = null, bd = 1e9;
          for (const p of allPts) {
            const d = (p.x - x) * (p.x - x) + (p.y - y) * (p.y - y);
            if (d < bd) { bd = d; best = p; }
          }
          return best;
        };
        [...GEO.leaves, ...GEO.tipLeaves].forEach((l, i) => {
          if (owner(l.x, l.y) === WILT_TREE) return; // the struck shoot's old foliage is gone with it
          const m = findTree(l.x, l.y);
          if (!m) return;
          const tree = trees[m.ti];
          const zRel = tree.lift(tree.branches[m.bi].d[m.pi]);
          const dir = new THREE.Vector3(Math.cos(l.a), -Math.sin(l.a), 0).normalize();
          escapeLeafData.push({
            tree: m.ti,
            rest: pop(l.x, l.y, zRel),
            dir,
            tiltAxis: new THREE.Vector3(dir.y, -dir.x, 0).normalize(),
            tilt: 0.22 + 0.38 * E.h1(i * 3 + 2), phase: E.h1(i * 5 + 1) * Math.PI * 2,
            scale: l.s * 12.5 * E.U, u: 1,
          });
        });
        wiltLeaves.forEach((l, i) => {
          const m = findTree(l.x, l.y);
          if (!m) return;
          const tree = trees[m.ti];
          const zRel = tree.lift(tree.branches[m.bi].d[m.pi]);
          const dir = new THREE.Vector3(Math.cos(l.a), -Math.sin(l.a), 0).normalize();
          wiltLeafData.push({
            tree: m.ti,
            rest: pop(l.x, l.y, zRel),
            dir,
            tiltAxis: new THREE.Vector3(dir.y, -dir.x, 0).normalize(),
            tilt: 0.15 + 0.3 * E.h1(i * 3 + 7), phase: E.h1(i * 5 + 11) * Math.PI * 2,
            scale: l.s * 12.5 * E.U, u: 1,
          });
        });
      }
      const escapeLeafMesh = new THREE.InstancedMesh(leafGeo, leafMat, escapeLeafData.length);
      escapeLeafMesh.castShadow = true;
      escapeLeafMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      group.add(escapeLeafMesh);
      const wiltLeafMesh = new THREE.InstancedMesh(leafGeo, deadLeafMat, wiltLeafData.length);
      wiltLeafMesh.castShadow = true;
      wiltLeafMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      group.add(wiltLeafMesh);

      // c's target rides the wilted shoot's hanging tip
      const cPos = (() => {
        const tree = trees[WILT_TREE];
        let best = null, bd = 1e9;
        tree.branches.forEach((b) => b.pts.forEach((p, pi) => {
          const d = (p[0] - wiltTip.x) ** 2 + (p[1] - wiltTip.y) ** 2;
          if (d < bd) { bd = d; best = { b, pi }; }
        }));
        return pop(wiltTip.x, wiltTip.y, tree.lift(best.b.d[best.pi]));
      })();

      // the clip's mark on the silhouette — tab-07's d anchor, (951,1008)
      const dPos = (() => {
        const dir = new THREE.Vector3(sx(951) - SCv.x, elev(1008) - SCv.y, 0).normalize();
        return SCv.clone().addScaledVector(dir, R);
      })();

      // ---- per-frame: one presence. NOTHING grows on VII — the vines render
      // full from the first frame; the crown breathes; the living escapes
      // sway gently; the wilted shoot is still.

        // per-frame temps (hoisted — no garbage in the frame loop)

        const _specQ = new THREE.Quaternion(), _zero = new THREE.Vector3();

      function update(t, reduced, active) {
        _specQ.setFromEuler(specimen.rotation); // refreshed per frame: the sway mutates rotation
        if (!active) {
          // neighbors breathe, nothing more (cheap)
          if (!reduced) specimen.rotation.set(0.0028 * Math.sin((2 * Math.PI * t) / 8.3), 0, 0.0035 * Math.sin((2 * Math.PI * t) / 11));
          return;
        }
        if (reduced) { specimen.rotation.set(0, 0, 0); }
        else specimen.rotation.set(0.0028 * Math.sin((2 * Math.PI * t) / 8.3), 0, 0.0035 * Math.sin((2 * Math.PI * t) / 11));
        treeGroups.forEach((tg, ti) => {
          if (reduced || tg.tree.g === "wilt") { tg.group.quaternion.identity(); return; }
          const amp = 0.55; // no growth ramp — the sway is all the life that's left
          tg.group.rotation.set(
            0.011 * amp * Math.sin((2 * Math.PI * t) / (6.3 + ti * 1.3) + ti),
            0.006 * amp * Math.sin((2 * Math.PI * t) / (7.4 + ti * 1.1) + ti * 1.3),
            0.014 * amp * Math.sin((2 * Math.PI * t) / (8.5 + ti * 1.7) + ti * 2.1));
        });
        
        for (let i = 0; i < escapeLeafData.length; i++) {
          const L = escapeLeafData[i], tg = treeGroups[L.tree];
          place(escapeLeafMesh, i, L, t, reduced, tg.group.quaternion, tg.pivot);
        }
        escapeLeafMesh.instanceMatrix.needsUpdate = true;
        for (let i = 0; i < wiltLeafData.length; i++) {
          const L = wiltLeafData[i], tg = treeGroups[L.tree];
          place(wiltLeafMesh, i, L, t, true, tg.group.quaternion, tg.pivot); // dead: no flutter
        }
        wiltLeafMesh.instanceMatrix.needsUpdate = true;
        for (let i = 0; i < tangleLeafData.length; i++) {
          const L = tangleLeafData[i];
          place(tangleLeafMesh, i, L, t, reduced, _specQ, _zero);
        }
        tangleLeafMesh.instanceMatrix.needsUpdate = true;
        for (let i = 0; i < shellData.length; i++) {
          const L = shellData[i];
          place(shellMesh, i, L, t, reduced, _specQ, _zero);
        }
        shellMesh.instanceMatrix.needsUpdate = true;
      }
      // a sane resting state even when the station is never activated
      update(0, true, true);

      return {
        group, update,
        labels: {
          a: { pos: new THREE.Vector3(sx(668), 0.12, HINGE + 0.3), name: "rootstock",
               note: "the wild stock, never clipped — the blight did not reach it. below the surface it keeps its own counsel." },
          b: { pos: new THREE.Vector3(sx(1204), 0.05, sz(1408)), name: "the wound",
               note: "one severed stub at the scale of its own anatomy, the cut face ringed by the rust that found it. the documentation stays on the sheet." },
          c: { pos: cPos, name: "the wilted shoot",
               note: "the up-right escape, struck. it still clears the shear, but it has stopped growing — its leaves hang straight down." },
          d: { pos: dPos, name: "the clip",
               note: "the sphere is the shear's, not the growth's — and the shear's wounds are where the rust gathers first." },
          e: { pos: new THREE.Vector3(sx(950), 0.05, HINGE + 0.05), name: "the surface",
               note: "the deployment boundary. what shows above is the product — and the product is marked." },
          f: { pos: new THREE.Vector3(sx(758), 0.05, sz(1313)), name: "the fallen leaf",
               note: "what the blight has taken lies on the ground dashes, printed on the sheet — it does not stand in the room." },
        },
        views: {
          home: { az: -14, el: 26, dist: 9.5, tg: [0, 1.0, 0.9] }, // == Tab. I's home: glance I ↔ VII, same plant
          a: { az: -32, el: 14, dist: 5.2, tg: [-0.2, 0.6, 1.5] },
          b: { az: 16, el: 50, dist: 4.6, tg: [2.5, 0.15, 2.0] },
          c: { az: 30, el: 18, dist: 4.6, tg: [cPos.x, cPos.y, cPos.z] },
          d: { az: -26, el: 15, dist: 4.8, tg: [0.2, 2.1, 1.5] }, // the clip, from the lit flank — where the rust reads
          e: { az: -22, el: 20, dist: 5.0, tg: [1.1, 0.4, 1.5] },
          f: { az: -6, el: 42, dist: 4.0, tg: [0.29, 0.1, 1.57] },
        },
      };
    },
  };
})());
