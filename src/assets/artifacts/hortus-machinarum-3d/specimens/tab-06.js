/* TAB. VI — THE VOLUNTEER, in the room.
 * The one specimen that does not stand on its sheet. The documentation lies
 * on the round table — the path, the crack, the root's portrait, the flower
 * drawn twice; the plant itself was not planted there and has come up through
 * the floorboards inside the ring, just off the table's inner rim, leaning
 * back over the table toward its own certificate. No clip, no shear:
 * the series' only free growth, seed 26081706, the plate's own easing-stem
 * grammar (lean ~15°, easing back toward the light) raised to a loose
 * multi-leader shrub, willow leaves instanced, two umbels at the tallest
 * tips. Out of the window's key it catches the cool bounce instead — the
 * leaves on that side carry a faint blue-green. Register on HM3D_STATIONS.
 */
"use strict";
window.HM3D_STATIONS.push((() => {
  const E = window.HM3D;
  const SEED = 26081706;
  const SOIL = 1296;                 // the path's upper hairline — the surface (e)
  const CRACK = { x: 640, y: 1300 }; // px, where the drawing's volunteer rises

  // plate px → station local (sheet surface = y 0)
  const sx = (x) => (x - 700) * E.U;
  const sz = (y) => (y - 1000) * E.U;

  // the off-sheet site: a crack in the boards inside the ring, well clear
  // of the table's inner rim (z +5.75) so the stems never cross the table
  // silhouette — it must read as floor, not as tabletop. The lean reaches
  // back over the rim toward the certificate without touching it.
  // (station-local; the group origin sits FACE_Y above the table, the
  // floor at world y −3.2); main.js reads this via the module's `base`
  const BASE = { x: 3.4, y: -3.2825, z: 7.6 };

  return {
    id: "tab-06", numeral: "VI",
    name: "THE VOLUNTEER", latin: "S. ?domestica sp. inedit.",
    technique: "emergence — not planted here",
    texture: "textures/tab-06-living.png",
    soil: SOIL,
    base: BASE, // the floor site — main.js aims the inlay hairline and the
                // floor contact shadow from this, never from copied numbers

    build(E3, THREE) {
      void E3;
      const group = new THREE.Group();
      const place = E.leafPlacer(THREE);
      const rng = E.mulberry32(SEED);
      const rr = (a, b) => a + rng() * (b - a);
      const { grow3 } = E.makeGrow3(THREE, rng);
      const stemMat = new THREE.MeshStandardMaterial({ color: E.INK, roughness: 0.85 });
      const leafMat = new THREE.MeshStandardMaterial({
        color: E.INK, roughness: 0.9, side: THREE.DoubleSide, transparent: true, opacity: 0.88,
      });
      const petalMat = new THREE.MeshStandardMaterial({
        color: E.INK, roughness: 0.9, side: THREE.DoubleSide, transparent: true, opacity: 0.92,
      });

      // the plate's willow leaf (len 1): long, narrow, gently falcate;
      // o.wf widens it (the cotyledons), bend sets the tip's drift
      const willowGeo = (wf = 1, bend = 0.10) => {
        const w = 0.0855 * wf, bx = bend;
        const s = new THREE.Shape();
        s.moveTo(0, 0);
        s.bezierCurveTo(w, 0.26, 0.9 * w + 0.55 * bx, 0.62, bx, 1.0);
        s.bezierCurveTo(-0.85 * w + 0.55 * bx, 0.64, -w, 0.28, 0, 0);
        return new THREE.ShapeGeometry(s, 6);
      };
      const leafGeo = willowGeo(1, 0.10);
      const cotyGeo = willowGeo(2.4, 0.05);

      // the plate's teardrop petal (len 1, widest 0.34 past the middle,
      // the soft point drifting a little to one side)
      const petalGeo = (() => {
        const s = new THREE.Shape();
        s.moveTo(0, 0);
        s.bezierCurveTo(-0.143, 0.20, -0.347, 0.52, -0.17, 0.80);
        s.bezierCurveTo(-0.075, 0.96, -0.006, 0.99, 0.07, 1.0);
        s.bezierCurveTo(0.131, 0.98, 0.187, 0.88, 0.211, 0.72);
        s.bezierCurveTo(0.357, 0.46, 0.136, 0.18, 0, 0);
        return new THREE.ShapeGeometry(s, 6);
      })();

      // the nursery off the sheet: a crack in the boards inside the
      // ring; the plant comes up through it (drawn, not built — a jagged
      // decal in the same idiom as the hub plan inlay)
      {
        const cc = document.createElement("canvas"); cc.width = 256; cc.height = 80;
        const g = cc.getContext("2d");
        const jr = E.mulberry32(SEED + 7);
        const jag = (a, b) => a + jr() * (b - a);
        g.strokeStyle = "rgba(24,17,10,0.9)"; g.lineCap = "round";
        // the main crack: a hand-jagged line with forks, like a board seam split
        g.lineWidth = 2.6;
        g.beginPath();
        let px = 18, py = 42;
        g.moveTo(px, py);
        for (let s = 0; s < 9; s++) {
          px += jag(18, 30); py += jag(-7, 7);
          g.lineTo(px, Math.max(16, Math.min(64, py)));
        }
        g.stroke();
        g.lineWidth = 1.4;
        for (const fx of [0.3, 0.62]) { // two forks off the main line
          g.beginPath();
          const sx0 = 18 + fx * 220, sy0 = 40 + jag(-5, 5);
          g.moveTo(sx0, sy0);
          g.lineTo(sx0 + jag(10, 26), sy0 + jag(8, 18) * (jr() > 0.5 ? 1 : -1));
          g.stroke();
        }
        const crackTex = new THREE.CanvasTexture(cc);
        const crack = new THREE.Mesh(new THREE.PlaneGeometry(2.3, 0.7),
          new THREE.MeshBasicMaterial({ map: crackTex, transparent: true, depthWrite: false }));
        crack.rotation.x = -Math.PI / 2;
        crack.rotation.z = 0.05;
        crack.position.set(BASE.x, -3.192, BASE.z - 0.12);
        group.add(crack);
        // soil crumbs — what the crack pushed up; the registration cue that
        // says "came through", not "placed here"
        const crumbGeo = new THREE.SphereGeometry(1, 6, 5);
        const crumbMat = new THREE.MeshStandardMaterial({ color: 0x241a10, roughness: 1 });
        const crumbs = new THREE.InstancedMesh(crumbGeo, crumbMat, 9);
        const cm = new THREE.Matrix4();
        for (let ci = 0; ci < 9; ci++) {
          const a = jr() * Math.PI * 2, r = 0.14 + jr() * 0.5;
          const s = 0.022 + jr() * 0.04;
          cm.makeScale(s, s * 0.6, s);
          cm.setPosition(BASE.x - 0.3 + Math.cos(a) * r, -3.19 + s * 0.4, BASE.z - 0.12 + Math.sin(a) * r * 0.5);
          crumbs.setMatrixAt(ci, cm);
        }
        group.add(crumbs);
        // out of the window's key, it catches the cool bounce instead: one
        // faint cool accent, up on the left like the bounce off the boards
        const cool = new THREE.PointLight(0x4a627a, 7, 8.5, 2);
        cool.position.set(BASE.x - 1.6, 1.2, BASE.z + 1.6);
        group.add(cool);
      }

      const plant = new THREE.Group();
      plant.position.set(BASE.x, BASE.y, BASE.z);
      group.add(plant);

      // the lean: back over the table, toward its own certificate
      const leanH = new THREE.Vector2(-0.49, -0.87).normalize();
      const upV = new THREE.Vector3(0, 1, 0);
      const perpOf = (d) => {
        const r = new THREE.Vector3(rng() * 2 - 1, rng() * 2 - 1, rng() * 2 - 1).cross(d);
        return r.lengthSq() < 1e-6 ? new THREE.Vector3(1, 0, 0) : r.normalize();
      };
      // tilt th from the vertical toward the lean azimuth, ph around it
      const dirOf = (th, ph) => {
        const hx = leanH.x * Math.cos(ph) + leanH.y * Math.sin(ph);
        const hz = -leanH.x * Math.sin(ph) + leanH.y * Math.cos(ph);
        return new THREE.Vector3(Math.sin(th) * hx, Math.cos(th), Math.sin(th) * hz);
      };

      const leafLenU = 27.5 * E.U; // the plate's willow length at s = 1
      let leafCount = 0;
      function mkLeaf(p, dir, s, li) {
        const i = leafCount++;
        const d = dir.clone().normalize();
        const tiltAxis = new THREE.Vector3(d.y, -d.x, 0);
        if (tiltAxis.lengthSq() < 0.01) tiltAxis.set(1, 0, 0); else tiltAxis.normalize();
        return {
          rest: p.clone(), dir: d, tiltAxis,
          tilt: 0.35 + 0.45 * E.h1(i * 3 + 2), phase: E.h1(i * 5 + 1) * Math.PI * 2,
          scale: s * leafLenU, leader: li, u: 1,
        };
      }

      // five leaders from the clump — the drawing's stem, grown to a shrub.
      // the plate's grammar: start leaning ~15° off the vertical, ease back
      // toward the light at 0.045 a step, hand-held jitter on the way
      const LEADERS = [
        { h: 3.42, az: -1.16 }, { h: 3.60, az: -0.58 }, { h: 3.84, az: 0.0 },
        { h: 3.36, az: 0.58 }, { h: 3.52, az: 1.16 },
      ];
      const stalks = [];    // { mesh, full, li } — the reaching parts
      const leafData = [];  // willow leaves (leader nodes + lateral tips)
      const cotyData = [];  // the seed-leaves, still out at the first node
      const leaderTips = [];
      LEADERS.forEach((Ld, li) => {
        const th0 = rr(0.24, 0.34) + Math.abs(li - 2) * 0.02;
        const thT = th0 * 0.35;                    // eases back toward the light
        const ph0 = Ld.az + rr(-0.14, 0.14);
        const H = Ld.h * rr(0.97, 1.03);
        const n = 14, step = H / n;
        const base = new THREE.Vector3(rr(-0.07, 0.07), 0, rr(-0.05, 0.05));
        const planeAxis = new THREE.Vector3().crossVectors(upV, dirOf(th0, ph0)).normalize();
        const pts = [base.clone()];
        const nodeDirs = [];
        const pos = base.clone();
        let th = th0, ph = ph0;
        for (let k = 0; k < n; k++) {
          th += (rng() - 0.5) * 0.075 + (thT - th) * 0.045;
          ph += (rng() - 0.5) * 0.05 + (0 - ph) * 0.03;
          const d = dirOf(th, ph);
          nodeDirs.push(d);
          pos.addScaledVector(d, step);
          pts.push(pos.clone());
        }
        const stemMesh = new THREE.Mesh(E.taperedTube(THREE, pts, 4.2, 1.2), stemMat);
        stemMesh.castShadow = true;
        plant.add(stemMesh);
        stalks.push({ mesh: stemMesh, full: stemMesh.geometry.getIndex().count, li });
        leaderTips.push({ p: pos.clone(), d: nodeDirs[n - 1].clone(), li });

        // laterals at nodes 5, 7, 9 — the shrub's loose branchwork, grown
        // with the plate's own params (its root tuft is the only grow() it has)
        const latOut = { branches: [], tips: [], leaves: [] };
        for (const k of [5, 7, 9]) {
          const side = k % 2 ? 1 : -1;
          const d0 = nodeDirs[k - 1].clone()
            .applyAxisAngle(planeAxis, side * rr(0.85, 1.2))
            .applyAxisAngle(perpOf(nodeDirs[k - 1]), rr(-0.35, 0.35));
          grow3(pts[k].clone(), d0, rr(0.45, 0.7) * (1 - 0.35 * (k / n)), 2.1, 2,
            { curl: 0.5, spread: 0.5, decay: 0.62, lateral: 0.22, leafAlong: 0, leafScale: 0, segs: 5, tri: 0.25 }, latOut);
        }
        const latGeoms = latOut.branches.map((b) =>
          E.taperedTube(THREE, b.pts, b.w, Math.max(0.9, b.w * 0.55)));
        if (latGeoms.length) {
          const latMesh = new THREE.Mesh(E.mergeGeoms(latGeoms), stemMat);
          latMesh.castShadow = true;
          plant.add(latMesh);
          stalks.push({ mesh: latMesh, full: latMesh.geometry.getIndex().count, li });
        }
        // willow leaves at the twig tips
        for (const tp of latOut.tips) leafData.push(mkLeaf(tp.p, tp.d, rr(0.95, 1.2), li));

        // true leaves — narrow, alternate, unbothered; the plate's nodes 3–11
        for (let k = 3; k <= 11; k++) {
          const side = k % 2 ? 1 : -1;
          const d = nodeDirs[k - 1].clone()
            .applyAxisAngle(planeAxis, side * rr(0.9, 1.25))
            .applyAxisAngle(perpOf(nodeDirs[k - 1]), rr(-0.3, 0.3));
          leafData.push(mkLeaf(pts[k], d, rr(1.3, 1.55) * (1.18 - 0.42 * (k / 12)), li));
        }
        // cotyledons — still out at the first node, the volunteer's signature
        cotyData.push(mkLeaf(pts[2], nodeDirs[1].clone().applyAxisAngle(planeAxis, -rr(1.5, 1.8)), 0.5, li));
        cotyData.push(mkLeaf(pts[2], nodeDirs[1].clone().applyAxisAngle(planeAxis, rr(1.5, 1.8)), 0.5, li));
      });

      // the strange flower — the identification feature, at the two tallest
      // leaders' tips: a small umbel of teardrop petals around a dotted center
      const flowerAt = (tip, R) => {
        const N_P = rng() < 0.5 ? 5 : 6;
        const rot = rr(0, Math.PI * 2);
        const g = new THREE.Group();
        g.position.copy(tip.p).addScaledVector(tip.d, 0.05);
        const nrm = tip.d.clone().add(new THREE.Vector3(-0.15, 0.9, 0.75)).normalize();
        g.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), nrm); // faces up and out
        for (let i = 0; i < N_P; i++) {
          const a = rot + (i / N_P) * Math.PI * 2 + rr(-0.11, 0.11);
          const m = new THREE.Mesh(petalGeo, petalMat);
          m.position.set(Math.cos(a) * R * 0.16, Math.sin(a) * R * 0.16, 0);
          m.rotation.z = a - Math.PI / 2;
          m.scale.setScalar(R * rr(0.9, 1.08));
          g.add(m);
        }
        g.add(new THREE.Mesh(new THREE.SphereGeometry(R * 0.07, 6, 6), stemMat));
        for (let i = 0; i < N_P; i++) {
          const a = rot + (i / N_P) * Math.PI * 2 + 0.3;
          const d = new THREE.Mesh(new THREE.SphereGeometry(R * 0.055, 5, 5), stemMat);
          d.position.set(Math.cos(a) * R * 0.2, Math.sin(a) * R * 0.2, 0.004);
          g.add(d);
        }
        plant.add(g);
      };
      flowerAt(leaderTips[2], 0.17);
      flowerAt(leaderTips[1], 0.14);

      const leafMesh = new THREE.InstancedMesh(leafGeo, leafMat, leafData.length);
      leafMesh.castShadow = true;
      leafMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      plant.add(leafMesh);
      const cotyMesh = new THREE.InstancedMesh(cotyGeo, leafMat, cotyData.length);
      cotyMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      plant.add(cotyMesh);
      {
        // ink variation; a faint blue-green on the window side (x < 0, plant-local)
        const c = new THREE.Color(), cool = new THREE.Color(0x3f5a55);
        const tint = (L, i, mesh, mi) => {
          c.setHex(E.INK).multiplyScalar(0.75 + 0.25 * E.h1(i * 11 + mi));
          const k = Math.max(0, Math.min(1, -L.rest.x / 0.7)) * 0.32;
          if (k > 0) c.lerp(cool, k);
          mesh.setColorAt(i, c);
        };
        leafData.forEach((L, i) => tint(L, i, leafMesh, 0));
        cotyData.forEach((L, i) => tint(L, i, cotyMesh, 1));
      }

      // deterministic still for the neighbor frames
      const still = (mesh, data) => {
        for (let i = 0; i < data.length; i++) place(mesh, i, data[i], 0, true, null, null);
        mesh.instanceMatrix.needsUpdate = true;
      };
      still(leafMesh, leafData);
      still(cotyMesh, cotyData);

      // ---- per-frame: sway and flutter, and the last of the reach (~70s),
      // staggered leader by leader; neighbors only breathe
      function update(t, reduced, active) {
        if (!active) {
          if (!reduced) plant.rotation.set(
            0.003 * Math.sin((2 * Math.PI * t) / 8.7), 0, 0.0036 * Math.sin((2 * Math.PI * t) / 11.3));
          return;
        }
        if (reduced) plant.rotation.set(0, 0, 0);
        else plant.rotation.set(
          0.011 * Math.sin((2 * Math.PI * t) / 7.3) + 0.005 * Math.sin((2 * Math.PI * t) / 13.7 + 1.3),
          0.004 * Math.sin((2 * Math.PI * t) / 9.7 + 0.6),
          0.013 * Math.sin((2 * Math.PI * t) / 9.1 + 0.7) + 0.005 * Math.sin((2 * Math.PI * t) / 17.3 + 2.1));
        for (const st of stalks) {
          const vis = E.growthOf(st.li, t, reduced);
          st.mesh.geometry.setDrawRange(0, Math.floor((st.full * vis) / 3) * 3);
        }
        for (const [mesh, data] of [[leafMesh, leafData], [cotyMesh, cotyData]]) {
          for (let i = 0; i < data.length; i++) {
            const L = data[i];
            const vis = E.growthOf(L.leader, t, reduced);
            L.u = reduced ? 1 : Math.max(0, Math.min(1, (vis - 0.86) / 0.14));
            place(mesh, i, L, t, reduced, null, null);
          }
          mesh.instanceMatrix.needsUpdate = true;
        }
      }

      return {
        group, update,
        labels: {
          a: { pos: new THREE.Vector3(BASE.x, BASE.y + 0.42, BASE.z - 0.2), name: "the root",
               note: "the drawing keeps its portrait below the stones; the floor keeps the plant. it came up through the boards inside the ring — the same crack, continued." },
          b: { pos: new THREE.Vector3(sx(1138), 0.06, sz(1417)), name: "the flower",
               note: "drawn twice on paper — small on the plant, enlarged in the inset. the living one is off the sheet now, leaning back toward its own plate." },
          c: { pos: new THREE.Vector3(sx(CRACK.x), 0.06, sz(CRACK.y) + 0.15), name: "the crack",
               note: "the whole nursery: the hairlines break at a widened joint. nothing was planted here; the stone hid what passed through it." },
          d: { pos: new THREE.Vector3(0, 0.08, sz(1856)), name: "the note",
               note: "not planted here; origin unknown; persists. the only plate with no clip, no shear, no plane — the technique is its absence." },
          e: { pos: new THREE.Vector3(sx(392), 0.05, sz(1296)), name: "the surface",
               note: "the path between the beds — the deployment boundary, as the soil line was on the other plates. what shows above is the garden's own." },
        },
        views: {
          home: { az: -16, el: 17, dist: 11, tg: [1.7, -0.95, 4.6] },
          a: { az: -22, el: 42, dist: 4.2, tg: [BASE.x - 0.1, -2.5, BASE.z - 0.1] },
          b: { az: 12, el: 50, dist: 4.2, tg: [1.8, 0.1, 1.9] },
          c: { az: -10, el: 38, dist: 3.8, tg: [-0.3, 0.05, 1.55] },
          d: { az: 0, el: 28, dist: 4.0, tg: [0, 0.05, 4.1] },
          e: { az: -26, el: 22, dist: 4.4, tg: [-1.3, 0.1, 1.5] },
        },
      };
    },
  };
})());
