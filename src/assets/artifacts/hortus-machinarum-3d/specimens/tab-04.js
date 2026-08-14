/* TAB. IV — THE STUDENT, in the room.
 * The sheet lies on the table; parent, layer and daughter stand off it,
 * hinged at the soil line (py 1300). The parent is Tab. I's mechanism at
 * r=220: a 3D tangle sheared at the sphere, skin and stub nubs, finished.
 * The layer is the poem: ONE branch leaves the parent's lower shell
 * interior and bends through the air to earth at (962,1296) — over the
 * printed staple (the staple pins the drawing; the branch is free),
 * touching down exactly at the printed bend. From the bend the daughter
 * rises to her own small sphere, r=90 — the same grammar, the same seed,
 * smaller; she is young and keeps growing. Roots stay pressed on the
 * paper; the 3D shows only what is above. Register on HM3D_STATIONS.
 */
"use strict";
window.HM3D_STATIONS.push((() => {
  const E = window.HM3D;
  const SEED = 747474;
  const SOIL = 1300;

  // plate px → station local (sheet surface = y 0)
  const sx = (x) => (x - 700) * E.U;
  const sz = (y) => (y - 1000) * E.U;
  const HINGE = sz(SOIL); // 1.5
  const elev = (y) => (SOIL - y) * E.U; // drawn height above soil

  // the plate's constants (tab-04/generate.mjs)
  const PARENT = { cx: 560, cy: 770, r: 220 };
  const DAU = { cx: 960, cy: 1130, r: 90 };
  const RP = PARENT.r * E.U, RD = DAU.r * E.U;
  // the layer's waypoints, drawn whole in the plate — its exact geometry
  const ARC_WAY = [
    [586, 940], [700, 958], [790, 1025], [848, 1125], [884, 1215], [918, 1274], [962, 1296],
  ];
  const ARC_TAPER = [4.6, 3.0];

  return {
    id: "tab-04", numeral: "IV",
    name: "THE STUDENT", latin: "S. domestica propagated by layer",
    technique: "layering — the same plant, smaller",
    texture: "textures/tab-04-living.png",
    soil: SOIL,

    build(E3, THREE) {
      const group = new THREE.Group();
      const place = E.leafPlacer(THREE);
      const rng = E.mulberry32(SEED);
      const { grow3, rr3 } = E.makeGrow3(THREE, rng);
      const ZAX = new THREE.Vector3(0, 0, 1);
      const vineMat = new THREE.MeshStandardMaterial({ color: E.INK, roughness: 0.7 });
      const leafGeo = E.makeLeafGeo(THREE);
      const leafMat = new THREE.MeshStandardMaterial({
        color: E.INK, roughness: 0.9, side: THREE.DoubleSide, transparent: true, opacity: 0.85,
      });
      const specimen = new THREE.Group(); // one body: parent, layer, daughter
      group.add(specimen);

      const px2 = (x, y) => new THREE.Vector3(sx(x), elev(y), HINGE);
      const SC_P = px2(PARENT.cx, PARENT.cy);
      const SC_D = px2(DAU.cx, DAU.cy);

      // pale stub nubs on a shear surface — the cut, made spatial
      function stubMesh(stubs) {
        const geo = new THREE.CylinderGeometry(1, 0.8, 0.02, 8);
        const mat = new THREE.MeshStandardMaterial({ color: E.PAPER, roughness: 0.9 });
        const m = new THREE.InstancedMesh(geo, mat, stubs.length);
        const d3 = new THREE.Object3D(), up = new THREE.Vector3(0, 1, 0);
        stubs.forEach((s, i) => {
          d3.position.copy(s.p).addScaledVector(s.d, 0.008);
          d3.quaternion.setFromUnitVectors(up, s.d);
          d3.scale.setScalar(Math.min(3.4, Math.max(1.8, s.w * 0.55)) * E.U);
          d3.updateMatrix();
          m.setMatrixAt(i, d3.matrix);
        });
        return m;
      }
      function leafMesh(data) {
        const m = new THREE.InstancedMesh(leafGeo, leafMat, data.length);
        m.castShadow = true;
        m.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
        const c = new THREE.Color();
        for (let i = 0; i < data.length; i++) {
          c.setHex(E.INK).multiplyScalar(0.75 + 0.25 * E.h1(i * 11 + 1));
          m.setColorAt(i, c);
        }
        return m;
      }
      // interior foliage of a clipped ball (leaves + some tips, kept inside)
      function interiorLeaves(out, SC, R, arr, i0, tipChance) {
        out.leaves.forEach((l, i) => {
          if (l.p.distanceTo(SC) > R - 0.03) return;
          const d = l.d.clone().normalize();
          arr.push({
            rest: l.p.clone(), dir: d,
            tiltAxis: new THREE.Vector3(d.y, -d.x, 0).normalize(),
            tilt: 0.6 + 0.7 * E.h1((i0 + i) * 3 + 2), phase: E.h1((i0 + i) * 5 + 1) * Math.PI * 2,
            scale: l.s * 12.5 * E.U,
          });
        });
        out.tips.forEach((tp, i) => {
          if (tp.p.distanceTo(SC) > R - 0.03 || E.h1(i * 13 + 5) > tipChance) return;
          const d = tp.d.clone().normalize();
          arr.push({
            rest: tp.p.clone(), dir: d,
            tiltAxis: new THREE.Vector3(d.y, -d.x, 0).normalize(),
            tilt: 0.6 + 0.7 * E.h1((i0 + 500 + i) * 3 + 2), phase: E.h1((i0 + 500 + i) * 5 + 1) * Math.PI * 2,
            scale: rr3(0.42, 0.6) * 12.5 * E.U,
          });
        });
      }
      // the clipped skin — sparse enough to see the tangle inside;
      // the wobble phases are the plate's own (parent 1.7/0.4, daughter 0.9/2.1)
      function shellLeaves(SC, R, n, sc0, sc1, ph3, ph7, seedOff) {
        const data = [];
        for (let i = 0; i < n; i++) {
          const z = rr3(-1, 1), az = rr3(0, Math.PI * 2);
          const rq = Math.sqrt(1 - z * z);
          const u = new THREE.Vector3(rq * Math.cos(az), z, rq * Math.sin(az));
          const wob = 1 + 0.02 * Math.sin(3 * az + ph3) + 0.01 * Math.sin(7 * az + ph7);
          const rad = R * rr3(0.955, 1.0) * wob;
          const tangent = new THREE.Vector3(rr3(-1, 1), rr3(-1, 1), rr3(-1, 1)).cross(u).normalize()
            .applyAxisAngle(u, rr3(0, Math.PI * 2));
          data.push({
            rest: SC.clone().addScaledVector(u, rad), dir: tangent,
            tiltAxis: new THREE.Vector3().crossVectors(tangent, u).normalize(),
            tilt: 0.55 + 0.6 * E.h1(seedOff + i * 7 + 2), phase: E.h1(seedOff + i * 5 + 3) * Math.PI * 2,
            scale: rr3(sc0, sc1) * 12.5 * E.U,
          });
        }
        return data;
      }

      // ---------- the parent: trunk + sheared sphere (finished, inert) ----------
      // trunk: the plate's own walk (9 × 37px from (560,1300), wobble 0.09)
      {
        let x = PARENT.cx, y = SOIL, a = -Math.PI / 2;
        const pts = [px2(x, y)];
        for (let i = 0; i < 9; i++) {
          a += (rng() - 0.5) * 0.09;
          x += Math.cos(a) * 37;
          y += Math.sin(a) * 37;
          pts.push(px2(x, y));
        }
        const trunk = new THREE.Mesh(E.taperedTube(THREE, pts, 11, 5), vineMat);
        trunk.castShadow = true;
        specimen.add(trunk);
      }

      // the pop-up's cut made visible at the parent's foot — ink on the
      // sheet; own rng stream so the family keeps its bytes
      {
        const jr = E.mulberry32(SEED + 7);
        const decal = E.makeHingeDecal(THREE, jr);
        decal.position.set(sx(PARENT.cx), 0.002, HINGE);
        decal.rotation.z = -0.05 + (jr() - 0.5) * 0.12;
        group.add(decal);
      }

      // the crown: the plate's structure — six primaries, two along the
      // lower shell, two leaders up; wild growth truncated at the sphere
      const POPTS = {
        curl: 1.15, spread: 0.7, decay: 0.68, lateral: 0.14,
        leafAlong: 0.1, leafScale: 0.5, segs: 6, tri: 0.22,
      };
      const tangle = { branches: [], tips: [], leaves: [] };
      const crownO = px2(560, 950);
      for (let i = 0; i < 6; i++) {
        const az = (i / 6) * Math.PI * 2 + rr3(-0.18, 0.18), pol = rr3(0.5, 2.4);
        const dir = new THREE.Vector3(Math.sin(pol) * Math.cos(az), Math.cos(pol), Math.sin(pol) * Math.sin(az));
        grow3(crownO.clone().add(new THREE.Vector3(rr3(-0.11, 0.11), rr3(-0.07, 0.05), rr3(-0.06, 0.06))),
          dir, rr3(0.7, 0.95), rr3(3, 4), 4, POPTS, tangle);
      }
      for (const az0 of [0.35, Math.PI - 0.35]) {
        const az = az0 + rr3(-0.08, 0.08), pol = rr3(1.55, 1.85);
        const dir = new THREE.Vector3(Math.sin(pol) * Math.cos(az), Math.cos(pol), Math.sin(pol) * Math.sin(az));
        grow3(crownO.clone().add(new THREE.Vector3(rr3(-0.09, 0.09), rr3(-0.05, 0.03), rr3(-0.05, 0.05))),
          dir, rr3(0.75, 0.95), rr3(3, 3.8), 4, POPTS, tangle);
      }
      for (let k = 0; k < 2; k++) {
        const az = rr3(0, Math.PI * 2), pol = rr3(0.3, 0.55);
        const dir = new THREE.Vector3(Math.sin(pol) * Math.cos(az), Math.cos(pol), Math.sin(pol) * Math.sin(az));
        grow3(crownO.clone().add(new THREE.Vector3(rr3(-0.05, 0.05), rr3(-0.03, 0.03), rr3(-0.03, 0.03))),
          dir, rr3(1.0, 1.2), rr3(3, 3.8), 4,
          { ...POPTS, curl: 1.05, spread: 0.65, segs: 7 }, tangle);
      }
      const pStubs = [];
      const crownGeoms = [];
      for (const b of tangle.branches) {
        const { kept, cut } = E.clipToSphere(THREE, b.pts, SC_P, RP);
        if (kept.length > 1) crownGeoms.push(E.taperedTube(THREE, kept, b.w, Math.max(1.4, b.w * 0.55)));
        if (cut) pStubs.push({ ...cut, w: b.w });
      }
      const crown = new THREE.Mesh(E.mergeGeoms(crownGeoms), vineMat);
      crown.castShadow = true;
      specimen.add(crown);
      if (pStubs.length) specimen.add(stubMesh(pStubs));

      const pLeafData = [];
      interiorLeaves(tangle, SC_P, RP, pLeafData, 0, 0.45);
      pLeafData.push(...shellLeaves(SC_P, RP, 1200, 0.55, 0.86, 1.7, 0.4, 0));
      const pLeafMesh = leafMesh(pLeafData);
      group.add(pLeafMesh);

      // ---------- the layer: the poem ----------
      // the plate's waypoints in the hinge plane, with a slight relief
      // toward the visitor mid-flight; both ends exact — inside the
      // parent's lower shell, and down at the printed bend
      const arcPts3 = ARC_WAY.map(([x, y], i) => {
        const f = i / (ARC_WAY.length - 1);
        return new THREE.Vector3(sx(x), elev(y), HINGE + 0.12 * Math.sin(Math.PI * f));
      });
      const arcCurve = new THREE.CatmullRomCurve3(arcPts3, false, "catmullrom", 0.5);
      const arc = new THREE.Mesh(E.taperedTube(THREE, arcPts3, ARC_TAPER[0], ARC_TAPER[1]), vineMat);
      arc.castShadow = true;
      specimen.add(arc);

      // transit leaves — the layer is alive in transit (the plate's four)
      const arcLeafData = [];
      for (const [f, side] of [[0.38, 1], [0.52, -1], [0.66, 1], [0.8, -1]]) {
        const p = arcCurve.getPointAt(f);
        const ta = arcCurve.getTangentAt(f);
        const d = ta.clone().applyAxisAngle(ZAX, side * rr3(0.9, 1.3)).normalize();
        const i = arcLeafData.length;
        arcLeafData.push({
          rest: p, dir: d,
          tiltAxis: new THREE.Vector3(d.y, -d.x, 0).normalize(),
          tilt: 0.25 + 0.3 * E.h1(40 + i * 3 + 2), phase: E.h1(40 + i * 5 + 1) * Math.PI * 2,
          scale: rr3(0.6, 0.8) * 12.5 * E.U,
        });
      }
      const arcLeafMesh = leafMesh(arcLeafData);
      group.add(arcLeafMesh);

      // ---------- the daughter: the same plant, smaller (still growing) ----------
      const dauVines = [];
      // her shoot: the plate's walk (5 × 21px from (961,1299), wobble 0.14)
      const spPx = [];
      {
        let x = 961, y = 1299, a = -Math.PI / 2;
        const pts = [px2(x, y)];
        spPx.push([x, y]);
        for (let i = 0; i < 5; i++) {
          a += (rng() - 0.5) * 0.14;
          x += Math.cos(a) * 21;
          y += Math.sin(a) * 21;
          pts.push(px2(x, y));
          spPx.push([x, y]);
        }
        const g = E.taperedTube(THREE, pts, 4.2, 2.8);
        const shoot = new THREE.Mesh(g, vineMat);
        shoot.castShadow = true;
        specimen.add(shoot);
        dauVines.push({ mesh: shoot, full: g.getIndex().count, ti: 0 });
      }

      // her crown: four primaries up, sheared at the small sphere
      const DOPTS = {
        curl: 1.1, spread: 0.7, decay: 0.68, lateral: 0.12,
        leafAlong: 0.1, leafScale: 0.42, segs: 5, tri: 0.2,
      };
      const dau = { branches: [], tips: [], leaves: [] };
      const dCrownO = px2(960, 1196);
      for (let i = 0; i < 4; i++) {
        const az = (i / 4) * Math.PI * 2 + rr3(-0.3, 0.3), pol = rr3(0.15, 0.95);
        const dir = new THREE.Vector3(Math.sin(pol) * Math.cos(az), Math.cos(pol), Math.sin(pol) * Math.sin(az));
        grow3(dCrownO.clone().add(new THREE.Vector3(rr3(-0.04, 0.04), rr3(-0.02, 0.02), rr3(-0.03, 0.03))),
          dir, rr3(0.3, 0.425), rr3(1.8, 2.4), 3, DOPTS, dau);
      }
      const dStubs = [];
      dau.branches.forEach((b, bi) => {
        const { kept, cut } = E.clipToSphere(THREE, b.pts, SC_D, RD);
        if (kept.length > 1) {
          const g = E.taperedTube(THREE, kept, b.w, Math.max(1.4, b.w * 0.45));
          const m = new THREE.Mesh(g, vineMat);
          m.castShadow = true;
          specimen.add(m);
          dauVines.push({ mesh: m, full: g.getIndex().count, ti: 0.5 + bi * 0.18 });
        }
        if (cut) dStubs.push({ ...cut, w: b.w });
      });
      if (dStubs.length) specimen.add(stubMesh(dStubs));

      const dLeafData = [];
      interiorLeaves(dau, SC_D, RD, dLeafData, 2000, 0.4);
      dLeafData.push(...shellLeaves(SC_D, RD, 200, 0.5, 0.72, 0.9, 2.1, 7000));
      // the two leaves riding her shoot (the plate's own angles)
      [[2, -2.3, 0.62], [3, -0.85, 0.55]].forEach(([k, ang, s], i) => {
        const a = ang + rr3(-0.2, 0.2);
        const d = new THREE.Vector3(Math.cos(a), -Math.sin(a), 0).normalize();
        dLeafData.push({
          rest: px2(spPx[k][0], spPx[k][1]), dir: d,
          tiltAxis: new THREE.Vector3(d.y, -d.x, 0).normalize(),
          tilt: 0.25 + 0.3 * E.h1(90 + i * 3 + 2), phase: E.h1(90 + i * 5 + 1) * Math.PI * 2,
          scale: s * 12.5 * E.U,
        });
      });
      // the young foliage trickles in as she grows
      dLeafData.forEach((L, i) => {
        L.ti = 0.5 + (i / Math.max(1, dLeafData.length - 1)) * 2.2;
      });
      const dLeafMesh = leafMesh(dLeafData);
      group.add(dLeafMesh);

      // ---- per-frame: one resident. The parent is done; the daughter grows.

        // per-frame temps (hoisted — no garbage in the frame loop)

        const _specQ = new THREE.Quaternion(), _zero = new THREE.Vector3();

      function update(t, reduced, active) {
        _specQ.setFromEuler(specimen.rotation); // refreshed per frame: the sway mutates rotation
        if (!active) {
          // neighbors breathe, nothing more (cheap)
          if (!reduced) specimen.rotation.set(0.0026 * Math.sin((2 * Math.PI * t) / 8.7), 0, 0.0032 * Math.sin((2 * Math.PI * t) / 11.9));
          return;
        }
        if (reduced) { specimen.rotation.set(0, 0, 0); }
        else specimen.rotation.set(0.0026 * Math.sin((2 * Math.PI * t) / 8.7), 0, 0.0032 * Math.sin((2 * Math.PI * t) / 11.9));
        for (const v of dauVines) {
          const vis = E.growthOf(v.ti, t, reduced, 0.5);
          v.mesh.geometry.setDrawRange(0, Math.floor((v.full * vis) / 3) * 3);
        }
        
        for (let i = 0; i < pLeafData.length; i++) place(pLeafMesh, i, pLeafData[i], t, reduced, _specQ, _zero);
        pLeafMesh.instanceMatrix.needsUpdate = true;
        for (let i = 0; i < arcLeafData.length; i++) place(arcLeafMesh, i, arcLeafData[i], t, reduced, _specQ, _zero);
        arcLeafMesh.instanceMatrix.needsUpdate = true;
        for (let i = 0; i < dLeafData.length; i++) {
          const L = dLeafData[i];
          const vis = E.growthOf(L.ti, t, reduced, 0.5);
          L.u = reduced ? 1 : Math.max(0, Math.min(1, (vis - 0.8) / 0.2));
          place(dLeafMesh, i, L, t, reduced, _specQ, _zero);
        }
        dLeafMesh.instanceMatrix.needsUpdate = true;
      }

      const dMid = arcCurve.getPointAt(0.52);
      return {
        group, update,
        labels: {
          a: { pos: SC_P.clone().add(new THREE.Vector3(-RP, 0, 0.06)), name: "the parent",
               note: "the teacher, finished. the shear gave it the sphere; it holds what it was given." },
          b: { pos: new THREE.Vector3(sx(256), 0.08, sz(1413)), name: "rooting junction",
               note: "the bend, magnified on the paper: the stem sags, the initials break through. the drawing keeps what the surface hides." },
          c: { pos: SC_D.clone().add(new THREE.Vector3(RD * 0.9, 0.08, 0.06)), name: "the daughter",
               note: "the same plant, smaller — the parent's weights, bent through soil. she is still growing." },
          d: { pos: dMid.clone().add(new THREE.Vector3(0, 0.14, 0.1)), name: "the layer",
               note: "one branch the shear never got. bent to earth it roots: the pipeline is a stem, pinned once, and free." },
          e: { pos: new THREE.Vector3(sx(1122), 0.05, HINGE + 0.05), name: "the surface",
               note: "the deployment boundary. what shows above is the product." },
        },
        views: {
          home: { az: -16, el: 24, dist: 10.8, tg: [0.3, 1.35, 1.15] },
          a: { az: -30, el: 13, dist: 4.6, tg: [-0.85, 2.4, 1.5] },
          b: { az: -26, el: 46, dist: 3.8, tg: [-1.8, 0.25, 1.65] },
          c: { az: -14, el: 14, dist: 3.2, tg: [1.35, 0.65, 1.5] },
          d: { az: -22, el: 11, dist: 4.2, tg: [0.4, 1.05, 1.55] },
          e: { az: -18, el: 20, dist: 4.4, tg: [1.7, 0.3, 1.5] },
        },
      };
    },
  };
})());
