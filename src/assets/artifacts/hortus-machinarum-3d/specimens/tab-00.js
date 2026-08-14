/* TAB. 0 — the title page, in the room.
 * The overture. The sheet is ALL documentation (a plan does not pop up), and
 * the garden itself stands on it, tiny — an architect's model on its own map.
 * Four clipped hedges rise from the beds' printed outlines: the plan's own
 * geometry is the hinge map (there is no soil line here), and the paths stay
 * printed. At the crossing, one unclipped sprig — seed 1707, the master's
 * growth grammar at miniature height — the only uncut thing on the sheet,
 * swaying. Register on window.HM3D_STATIONS.
 */
"use strict";
window.HM3D_STATIONS.push((() => {
  const E = window.HM3D;
  const SEED = 1707;

  // plate px → station local (sheet surface = y 0)
  const sx = (x) => (x - 700) * E.U;
  const sz = (y) => (y - 1000) * E.U;

  // the plan's own geometry (tab-00/generate.mjs, seed 1707): the wall sits
  // at half-extents GW 250 / GH 175 about (700, 990); the beds are the four
  // bordered plots inside it, the crossing paths the gaps between
  const BEDS = [ // [x0, y0, x1, y1] in plate px — NW, NE, SW, SE
    [478, 843, 678, 968], [722, 843, 922, 968],
    [478, 1012, 678, 1137], [722, 1012, 922, 1137],
  ];
  const CROSS = { x: 708, y: 1000 }; // where the plan's volunteer stands

  return {
    id: "tab-00", numeral: "0",
    name: "the garden in plan", latin: "",
    technique: "four clipped beds, and the volunteer at the crossing",
    texture: "textures/tab-00-living.png",
    soil: null, // a title page has no soil line — the plan itself is the hinge map

    build(E3, THREE) {
      void E3;
      const group = new THREE.Group();
      const place = E.leafPlacer(THREE);
      const rng = E.mulberry32(SEED);
      const rr = (a, b) => a + rng() * (b - a);
      const hedgeMat = new THREE.MeshStandardMaterial({ color: E.INK, roughness: 0.9 });
      const stemMat = new THREE.MeshStandardMaterial({ color: E.INK, roughness: 0.7 });
      const leafGeo = E.makeLeafGeo(THREE);
      const leafMat = new THREE.MeshStandardMaterial({
        color: E.INK, roughness: 0.9, side: THREE.DoubleSide, transparent: true, opacity: 0.85,
      });

      // E.mergeGeoms re-wraps the index with no itemSize (count NaN → the
      // mesh draws nothing in this three build). Local merge, same spirit,
      // index built as a plain array so three sizes it properly.
      function mergeLocal(geoms) {
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
        const out = new THREE.BufferGeometry();
        out.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
        out.setAttribute("normal", new THREE.Float32BufferAttribute(norm, 3));
        out.setIndex(new THREE.BufferAttribute(idx, 1));
        return out;
      }

      // ---------- the four clipped hedges, standing on the beds' outlines ----------
      // a hedge run = a row of overlapping ovoid puffs, cloud-clipped, the
      // centreline ON the drawing's own rectangle (jitter ≤ the line's own)
      const puffGeoms = [];
      const hedgeLeafData = [];
      const unitPuff = new THREE.SphereGeometry(1, 10, 8);
      const addHedgeLeaf = (p, out, i) => {
        const d = out.clone().multiplyScalar(0.7).add(new THREE.Vector3(0, 1, 0)).normalize();
        const tiltAxis = new THREE.Vector3(d.y, -d.x, 0);
        if (tiltAxis.lengthSq() < 0.01) tiltAxis.set(1, 0, 0); else tiltAxis.normalize();
        hedgeLeafData.push({
          rest: p.clone(), dir: d, tiltAxis,
          tilt: 0.3 + 0.4 * E.h1(i * 3 + 2), phase: E.h1(i * 5 + 1) * Math.PI * 2,
          scale: rr(0.28, 0.45) * 12.5 * E.U,
        });
      };
      let hi = 0;
      const puff = (x, z, rx, ry, out) => {
        const g = unitPuff.clone();
        g.scale(rx, ry, rx);
        g.translate(x, ry * 0.88, z); // a breath sunk into the paper
        puffGeoms.push(g);
        if (rng() < 0.8) {
          // leaves ON the puff's skin: the outer flank, sometimes the crown
          if (rng() < 0.65)
            addHedgeLeaf(new THREE.Vector3(
              x + out.x * rx * 0.8, ry * 1.5, z + out.z * rx * 0.8), out, hi++);
          else
            addHedgeLeaf(new THREE.Vector3(
              x + out.x * rx * 0.2, ry * 1.82, z + out.z * rx * 0.2), out, hi++);
        }
      };
      for (const [x0, y0, x1, y1] of BEDS) {
        const corners = [
          [sx(x0), sz(y0)], [sx(x1), sz(y0)], [sx(x1), sz(y1)], [sx(x0), sz(y1)],
        ];
        const cx = (corners[0][0] + corners[2][0]) / 2;
        const cz = (corners[0][1] + corners[2][1]) / 2;
        // the runs, corner to corner; each side owns its start corner only
        for (let s = 0; s < 4; s++) {
          const [ax, az] = corners[s], [bx, bz] = corners[(s + 1) % 4];
          const len = Math.hypot(bx - ax, bz - az);
          const n = Math.max(2, Math.round(len / (16 * E.U)));
          const out = new THREE.Vector3((ax + bx) / 2 - cx, 0, (az + bz) / 2 - cz).normalize();
          for (let i = 0; i < n; i++) {
            const t = i / n;
            puff(ax + (bx - ax) * t + rr(-1.5, 1.5) * E.U,
                 az + (bz - az) * t + rr(-1.5, 1.5) * E.U,
                 rr(9, 11) * E.U, rr(28, 34) * E.U, out);
          }
        }
        // the corner puffs, a shade larger — the clip's punctuation
        for (const [px2, pz2] of corners) {
          const out = new THREE.Vector3(px2 - cx, 0, pz2 - cz).normalize();
          puff(px2 + rr(-1, 1) * E.U, pz2 + rr(-1, 1) * E.U,
               rr(11, 13.5) * E.U, rr(31, 37) * E.U, out);
        }
      }
      const hedges = new THREE.Mesh(mergeLocal(puffGeoms), hedgeMat);
      hedges.castShadow = true;
      group.add(hedges);

      // a faint shell of clipped leaves on the hedge surfaces — static
      if (hedgeLeafData.length) {
        const hedgeLeafMesh = new THREE.InstancedMesh(leafGeo, leafMat, hedgeLeafData.length);
        for (let i = 0; i < hedgeLeafData.length; i++)
          place(hedgeLeafMesh, i, hedgeLeafData[i], 0, true, null, null);
        const c = new THREE.Color();
        for (let i = 0; i < hedgeLeafMesh.count; i++) {
          c.setHex(E.INK).multiplyScalar(0.75 + 0.25 * E.h1(i * 11 + 2));
          hedgeLeafMesh.setColorAt(i, c);
        }
        group.add(hedgeLeafMesh);
      }

      // ---------- the volunteer at the crossing — the only uncut thing ----------
      const base = new THREE.Vector3(sx(CROSS.x), 0, sz(CROSS.y));
      const sprig = new THREE.Group();
      sprig.position.copy(base);
      group.add(sprig);
      const { grow3 } = E.makeGrow3(THREE, rng);
      const out3 = { branches: [], tips: [], leaves: [] };
      grow3(new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(rr(-0.2, 0.2), 1, rr(-0.15, 0.15)).normalize(),
        rr(0.46, 0.52), 2.4, 1,
        { curl: 0.5, spread: 0.55, decay: 0.6, lateral: 0.32,
          leafAlong: 0.85, leafScale: 1.0, segs: 6, tri: 0.3 }, out3);
      const stems = new THREE.Mesh(
        mergeLocal(out3.branches.map((b) =>
          E.taperedTube(THREE, b.pts, b.w, Math.max(0.9, b.w * 0.5)))),
        stemMat);
      stems.castShadow = true;
      sprig.add(stems);

      const sprigLeafData = [];
      const pushSprigLeaf = (p, dir, s, i) => {
        const d = dir.clone().normalize();
        const tiltAxis = new THREE.Vector3(d.y, -d.x, 0);
        if (tiltAxis.lengthSq() < 0.01) tiltAxis.set(1, 0, 0); else tiltAxis.normalize();
        sprigLeafData.push({
          rest: p.clone().add(base), dir: d, tiltAxis,
          tilt: 0.25 + 0.4 * E.h1(i * 3 + 2), phase: E.h1(i * 5 + 1) * Math.PI * 2,
          scale: s * 12.5 * E.U,
        });
      };
      out3.leaves.forEach((l, i) => pushSprigLeaf(l.p, l.d, l.s, i));
      out3.tips.forEach((tp, i) => pushSprigLeaf(tp.p, tp.d, rr(0.8, 1.05), 100 + i));
      const sprigLeafMesh = new THREE.InstancedMesh(leafGeo, leafMat, sprigLeafData.length);
      sprigLeafMesh.castShadow = true;
      sprigLeafMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      group.add(sprigLeafMesh);
      {
        const c = new THREE.Color();
        for (let i = 0; i < sprigLeafMesh.count; i++) {
          c.setHex(E.INK).multiplyScalar(0.75 + 0.25 * E.h1(i * 11 + 1));
          sprigLeafMesh.setColorAt(i, c);
        }
        for (let i = 0; i < sprigLeafData.length; i++) // the deterministic still
          place(sprigLeafMesh, i, sprigLeafData[i], 0, true, null, null);
      }

      // c rides the sprig's highest leaf
      const cPos = (() => {
        let best = null;
        for (const L of sprigLeafData) if (!best || L.rest.y > best.rest.y) best = L;
        return best ? best.rest.clone().add(new THREE.Vector3(0, 0.05, 0))
                    : base.clone().add(new THREE.Vector3(0, 0.5, 0));
      })();

      // ---- per-frame: clipped things do not move; the volunteer sways ----
      function update(t, reduced, active) {
        if (!active) {
          // neighbors: the faintest breathe, nothing more (cheap)
          if (!reduced) sprig.rotation.set(
            0.004 * Math.sin((2 * Math.PI * t) / 8.9), 0,
            0.005 * Math.sin((2 * Math.PI * t) / 11.7));
          return;
        }
        if (reduced) sprig.rotation.set(0, 0, 0);
        else sprig.rotation.set(
          0.018 * Math.sin((2 * Math.PI * t) / 6.7) + 0.007 * Math.sin((2 * Math.PI * t) / 12.9 + 1.1),
          0.006 * Math.sin((2 * Math.PI * t) / 9.3 + 0.5),
          0.022 * Math.sin((2 * Math.PI * t) / 7.9 + 0.8) + 0.008 * Math.sin((2 * Math.PI * t) / 15.1 + 2.2));
        for (let i = 0; i < sprigLeafData.length; i++)
          place(sprigLeafMesh, i, sprigLeafData[i], t, reduced, sprig.quaternion, base);
        sprigLeafMesh.instanceMatrix.needsUpdate = true;
      }

      return {
        group, update,
        labels: {
          // NB: the room's pick spheres are r 0.4 — on this miniature the
          // letters are spaced ≥ 0.9 apart so none shadows another's ray
          a: { pos: new THREE.Vector3(-1.5, 0.06, -1.05), name: "the walls",
               note: "the garden's only rule, drawn double: inside, everything is tended; outside, nothing is asked. the model does not build them — a plan's walls are already kept." },
          b: { pos: new THREE.Vector3(1.3, 0.42, -0.85), name: "the beds",
               note: "kept low and squared — the clip before there is much to clip. the hedges stand on the drawing's own lines: the plan is read at full scale." },
          c: { pos: cPos, name: "the volunteer",
               note: "the only uncut thing on the sheet. not planted, not clipped, not in the index; the whole book grows from this speck." },
          d: { pos: new THREE.Vector3(0.35, 0.05, 0.75), name: "the crossing",
               note: "the paths are not drawn; they are what remains when the beds are. the volunteer took the one ground no bed claimed." },
          e: { pos: new THREE.Vector3(-1.2, 0.05, 1.55), name: "the plan",
               note: "the garden from above — the only view in which it is finished. the six plates that follow walk around inside it." },
        },
        views: {
          home: { az: -14, el: 28, dist: 9.2, tg: [0, 0.2, -0.1] },
          a: { az: 28, el: 50, dist: 4.6, tg: [-0.8, 0.1, -0.6] },
          b: { az: -26, el: 40, dist: 3.4, tg: [0.7, 0.25, -0.5] },
          c: { az: -12, el: 14, dist: 2.8, tg: [cPos.x, cPos.y, cPos.z] },
          d: { az: 6, el: 62, dist: 3.8, tg: [0.15, 0.05, 0.5] },
          e: { az: 0, el: 63, dist: 6.4, tg: [0, 0.05, -0.02] },
        },
      };
    },
  };
})());
