/* TAB. I — THE HELPFUL ASSISTANT, in the room.
 * The sheet lies on the table; the specimen pops up from the soil line
 * (py 1300, the hinge). The crown is the same seed's 3D biography; the
 * escapes are the EXACT exported individual, standing in the hinge plane
 * with relief toward the visitor. Register on window.HM3D_STATIONS.
 */
"use strict";
window.HM3D_STATIONS.push((() => {
  const E = window.HM3D, GEO = window.GEO;
  const SOIL = 1300;
  const R = GEO.ball.r * E.U;

  // plate px → station local (sheet surface = y 0)
  const sx = (x) => (x - 700) * E.U;
  const sz = (y) => (y - 1000) * E.U;
  const HINGE = sz(SOIL); // 1.5
  const elev = (y) => (SOIL - y) * E.U; // drawn height above soil
  const SC = null; // set in build

  return {
    id: "tab-01", numeral: "I",
    name: "THE HELPFUL ASSISTANT", latin: "Sycophanta domestica hort. mach.",
    technique: "topiary — the clip is literal",
    texture: "textures/tab-01-living.png",
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

      // the pop-up's cut made visible at the trunk foot — ink on the sheet,
      // not geometry; own rng stream so the crown keeps its bytes
      {
        const jr = E.mulberry32(GEO.seed + 7);
        const decal = E.makeHingeDecal(THREE, jr);
        decal.position.set(0, 0.002, HINGE);
        decal.rotation.z = 0.05 + (jr() - 0.5) * 0.12;
        group.add(decal);
      }

      // the crown: twelve leaders, sheared at the sphere
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

      // stub nubs on the shear surface
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

      // tangle leaves (interior)
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

      // the shell skin — sparse enough to see the tangle inside
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
        const c = new THREE.Color();
        [tangleLeafMesh, shellMesh].forEach((mesh, mi) => {
          for (let i = 0; i < mesh.count; i++) {
            c.setHex(E.INK).multiplyScalar(0.75 + 0.25 * E.h1(i * 11 + mi));
            mesh.setColorAt(i, c);
          }
        });
      }

      // ---- the escapes: the EXACT individual, standing in the hinge plane ----
      const LIFT = { shoot: 0.95, sprout: 0.4, sucker: 0.4 };
      const trees = GEO.trees.map((t, ti) => {
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

      // escape leaves
      const escapeLeafData = [];
      {
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
            scale: l.s * 12.5 * E.U,
          });
        });
      }
      const escapeLeafMesh = new THREE.InstancedMesh(leafGeo, leafMat, escapeLeafData.length);
      escapeLeafMesh.castShadow = true;
      escapeLeafMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      group.add(escapeLeafMesh);

      // c's target rides the escaped tip
      const cPos = (() => {
        let best = null, bd = 1e9;
        trees.forEach((tree) => {
          if (tree.g === "sucker") return;
          tree.branches.forEach((b) => b.pts.forEach((p, pi) => {
            const d = (p[0] - GEO.leftTip.x) ** 2 + (p[1] - GEO.leftTip.y) ** 2;
            if (d < bd) { bd = d; best = { tree, bi: b, pi }; }
          }));
        });
        const tree = best.tree;
        return pop(GEO.leftTip.x, GEO.leftTip.y, tree.lift(best.bi.d[best.pi]));
      })();

      // ---- per-frame: one presence (escapes keep escaping; the crown is done)
      const UP = new THREE.Vector3(0, 1, 0);

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
          if (reduced) { tg.group.quaternion.identity(); return; }
          const vis = E.growthOf(ti, t, reduced);
          const amp = Math.min(1, Math.max(0, (vis - 0.82) / 0.18) + 0.35);
          tg.group.rotation.set(
            0.011 * amp * Math.sin((2 * Math.PI * t) / (6.3 + ti * 1.3) + ti),
            0.006 * amp * Math.sin((2 * Math.PI * t) / (7.4 + ti * 1.1) + ti * 1.3),
            0.014 * amp * Math.sin((2 * Math.PI * t) / (8.5 + ti * 1.7) + ti * 2.1));
        });
        for (const v of vines) {
          const vis = E.growthOf(v.tree, t, reduced);
          v.mesh.geometry.setDrawRange(0, Math.floor((v.full * vis) / 3) * 3);
        }
        
        for (let i = 0; i < escapeLeafData.length; i++) {
          const L = escapeLeafData[i], tg = treeGroups[L.tree];
          const vis = E.growthOf(L.tree, t, reduced);
          L.u = reduced ? 1 : Math.max(0, Math.min(1, (vis - 0.88) / 0.12));
          place(escapeLeafMesh, i, L, t, reduced, tg.group.quaternion, tg.pivot);
        }
        escapeLeafMesh.instanceMatrix.needsUpdate = true;
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
      void UP;

      return {
        group, update,
        labels: {
          a: { pos: new THREE.Vector3(sx(668), 0.12, HINGE + 0.3), name: "rootstock",
               note: "the wild stock, never clipped — it re-sprouts from the root, up through the surface." },
          b: { pos: new THREE.Vector3(sx(1228), 0.05, sz(1444)), name: "section",
               note: "cut through the clip: light reaches only the shell; the tangle continues inside. look through the skin, then at the drawing." },
          c: { pos: cPos, name: "escape shoots",
               note: "growth beyond the shear. it has left the plate, and it has not stopped." },
          d: { pos: SCv.clone().add(new THREE.Vector3(R * 0.98, 0, 0)), name: "the clip",
               note: "the sphere is the shear's, not the growth's — walk around it: the cut is a surface, not a wall." },
          e: { pos: new THREE.Vector3(sx(950), 0.05, HINGE + 0.05), name: "the surface",
               note: "the deployment boundary. what shows above is the product." },
        },
        views: {
          home: { az: -14, el: 26, dist: 9.5, tg: [0, 1.0, 0.9] },
          a: { az: -32, el: 14, dist: 5.2, tg: [-0.2, 0.6, 1.5] },
          b: { az: 14, el: 52, dist: 4.6, tg: [2.6, 0.15, 2.2] },
          c: { az: -18, el: 18, dist: 5.4, tg: [cPos.x, cPos.y, cPos.z] },
          d: { az: 46, el: 12, dist: 6.6, tg: [0.3, 2.2, 1.5] },
          e: { az: -22, el: 20, dist: 5.0, tg: [1.1, 0.4, 1.5] },
        },
      };
    },
  };
})());
