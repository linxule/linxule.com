/* TAB. II — THE HELP DESK, in the room.
 * The sheet lies on the table; the espalier stands off it, hinged at the
 * soil line (py 1300). The fan is the same seed's growth (2602), trained to
 * the hinge plane — grown in 3D, then flattened: the plant has nearly no
 * thickness. The trellis is real hardware in the room: two cordon wires at
 * their heights, raffia ties where the arms cross them. What crosses the
 * band's edge is clipped analytically and wears a pale stub. The two escape
 * shoots leave the plane toward the visitor — they are the resident.
 * Register on window.HM3D_STATIONS.
 */
"use strict";
window.HM3D_STATIONS.push((() => {
  const E = window.HM3D;
  const SEED = 2602;
  const SOIL = 1300;

  // plate px → station local (sheet surface = y 0)
  const sx = (x) => (x - 700) * E.U;
  const sz = (y) => (y - 1000) * E.U;
  const HINGE = sz(SOIL); // 1.5
  const elev = (y) => (SOIL - y) * E.U; // drawn height above soil
  const BAND_HALF = 330 * E.U;          // |x| <= 1.65 — the plane
  const WIRE_Y = [elev(720), elev(980)]; // cordon wires: 2.9, 1.6

  return {
    id: "tab-02", numeral: "II",
    name: "THE HELP DESK", latin: "S. domestica f. plana",
    technique: "espalier — the interface plane",
    texture: "textures/tab-02-living.png",
    soil: SOIL,

    build(E3, THREE) {
      const group = new THREE.Group();
      const place = E.leafPlacer(THREE);
      const rng = E.mulberry32(SEED);
      const { grow3, rr3 } = E.makeGrow3(THREE, rng);
      const vineMat = new THREE.MeshStandardMaterial({ color: E.INK, roughness: 0.7 });
      const wireMat = new THREE.MeshStandardMaterial({ color: E.INK, roughness: 0.55, metalness: 0.25 });
      const leafGeo = E.makeLeafGeo(THREE);
      const leafMat = new THREE.MeshStandardMaterial({
        color: E.INK, roughness: 0.9, side: THREE.DoubleSide, transparent: true, opacity: 0.85,
      });
      const specimen = new THREE.Group(); // the plant: trunk, fan, ties
      group.add(specimen);

      // truncate a polyline at the band |x| <= half (the espalier's shear)
      function clipToBand3(pts, half) {
        const kept = [pts[0]];
        let cut = null;
        for (let i = 0; i < pts.length - 1; i++) {
          const a = pts[i], b = pts[i + 1];
          const in1 = Math.abs(a.x) <= half, in2 = Math.abs(b.x) <= half;
          if (in2) { kept.push(b); continue; }
          if (in1) {
            const t = ((b.x > a.x ? half : -half) - a.x) / (b.x - a.x);
            const ix = a.clone().lerp(b, t);
            kept.push(ix);
            cut = { p: ix, d: b.clone().sub(a).normalize() };
          }
          break;
        }
        return { kept, cut };
      }

      // trunk: soil mark to the fan's origin, the master's wobble
      {
        const pts = [new THREE.Vector3(0, 0, HINGE)];
        let a = -Math.PI / 2, x = 0, y = 0;
        for (let i = 0; i < 4; i++) {
          a += (rng() - 0.5) * 0.08;
          x += Math.cos(a) * 38 * E.U;
          y += -Math.sin(a) * 38 * E.U;
          pts.push(new THREE.Vector3(x, y, HINGE));
        }
        const trunk = new THREE.Mesh(E.taperedTube(THREE, pts, 11, 4.95), vineMat);
        trunk.castShadow = true;
        specimen.add(trunk);
      }

      // the pop-up's cut made visible at the trunk foot — ink on the sheet;
      // own rng stream so the fan keeps its bytes
      {
        const jr = E.mulberry32(SEED + 7);
        const decal = E.makeHingeDecal(THREE, jr);
        decal.position.set(0, 0.002, HINGE);
        decal.rotation.z = -0.04 + (jr() - 0.5) * 0.12;
        group.add(decal);
      }

      // ---------- the trained fan ----------
      // the master's arm specs and grow opts; grown in 3D, then flattened to
      // the plane (f. plana — the section shows nearly no thickness)
      const fan = { branches: [], tips: [], leaves: [] };
      const armSpecs = [
        { off: 0,     len: 275, w: 4.6 },
        { off: -0.30, len: 265, w: 4.2 },
        { off:  0.30, len: 265, w: 4.2 },
        { off: -0.60, len: 260, w: 3.9 },
        { off:  0.60, len: 260, w: 3.9 },
        { off: -0.92, len: 335, w: 3.6 },
        { off:  0.92, len: 335, w: 3.6 },
      ];
      const ARM_OPTS = {
        curl: 0.22, spread: 0.32, decay: 0.55, lateral: 0.24,
        leafAlong: 0.6, leafScale: 0.8, segs: 8, tri: 0.2,
      };
      const armOrigins = [];
      for (const s of armSpecs) {
        const origin = new THREE.Vector3(rr3(-4, 4) * E.U, elev(1150), HINGE);
        const off = s.off + rr3(-0.02, 0.02);
        const dir = new THREE.Vector3(Math.sin(off), Math.cos(off), 0);
        armOrigins.push(origin);
        grow3(origin, dir, s.len * E.U * rr3(0.96, 1.04), s.w, 1, ARM_OPTS, fan);
      }
      // the arm's own polyline is the branch that starts at its origin
      const armPolys = armOrigins.map((o) =>
        fan.branches.find((b) => b.pts[0].distanceTo(o) < 1e-9));
      // the flattening: growth happens, then it is pressed to the plane
      const flat = (p) => { p.z = HINGE + (p.z - HINGE) * 0.12; };
      for (const b of fan.branches) b.pts.forEach(flat);
      fan.leaves.forEach((l) => flat(l.p));
      fan.tips.forEach((t) => flat(t.p));

      const severed = [];
      const fanGeoms = [];
      for (const b of fan.branches) {
        const { kept, cut } = clipToBand3(b.pts, BAND_HALF);
        if (kept.length > 1) fanGeoms.push(E.taperedTube(THREE, kept, b.w, Math.max(1.4, b.w * 0.45)));
        if (cut) severed.push({ ...cut, w: b.w });
      }
      const fanMesh = new THREE.Mesh(E.mergeGeoms(fanGeoms), vineMat);
      fanMesh.castShadow = true;
      specimen.add(fanMesh);

      // pale stub nubs on the band's edges — the cut, made spatial
      if (severed.length) {
        const stubGeo = new THREE.CylinderGeometry(1, 0.8, 0.02, 8);
        const stubMat = new THREE.MeshStandardMaterial({ color: E.PAPER, roughness: 0.9 });
        const stubMesh = new THREE.InstancedMesh(stubGeo, stubMat, severed.length);
        const d3 = new THREE.Object3D(), up = new THREE.Vector3(0, 1, 0);
        severed.forEach((s, i) => {
          d3.position.copy(s.p).addScaledVector(s.d, 0.008);
          d3.quaternion.setFromUnitVectors(up, s.d);
          d3.scale.setScalar(Math.min(3.4, Math.max(1.8, s.w * 0.55)) * E.U);
          d3.updateMatrix();
          stubMesh.setMatrixAt(i, d3.matrix);
        });
        specimen.add(stubMesh);
      }

      // ---------- the trellis: real hardware in the room ----------
      // two cordon wires spanning the band, eye-nails at the ends
      for (const wy of WIRE_Y) {
        const wire = new THREE.Mesh(
          new THREE.CylinderGeometry(0.006, 0.006, BAND_HALF * 2, 6), wireMat);
        wire.rotation.z = Math.PI / 2;
        wire.position.set(0, wy, HINGE);
        wire.castShadow = true;
        group.add(wire);
        for (const exn of [-BAND_HALF, BAND_HALF]) {
          const nail = new THREE.Mesh(new THREE.TorusGeometry(0.016, 0.004, 6, 12), wireMat);
          nail.position.set(exn, wy, HINGE);
          group.add(nail);
        }
      }

      // the ties: raffia loops wherever a trained branch meets a wire
      // (the plate's own recipe — at this seed the lower wire earns them)
      for (const b of fan.branches) {
        if (b.w < 2.5) continue;
        const { kept } = clipToBand3(b.pts, BAND_HALF);
        for (const wy of WIRE_Y) {
          for (let i = 0; i < kept.length - 1; i++) {
            const p1 = kept[i], p2 = kept[i + 1];
            if ((p1.y - wy) * (p2.y - wy) > 0 || p1.y === p2.y) continue;
            const tt = (wy - p1.y) / (p2.y - p1.y);
            const cx = p1.x + (p2.x - p1.x) * tt;
            const tie = new THREE.Mesh(new THREE.TorusGeometry(0.016, 0.0045, 6, 14), vineMat);
            tie.position.set(cx, wy, p1.z + (p2.z - p1.z) * tt);
            tie.scale.set(1, 5 / 3.2, 1);
            tie.rotation.z = Math.atan2(p2.y - p1.y, p2.x - p1.x);
            specimen.add(tie);
            break;
          }
        }
      }

      // ---------- fan foliage (trained: it holds the plane) ----------
      const ZAX = new THREE.Vector3(0, 0, 1);
      const fanLeafData = [];
      const pushFanLeaf = (p, dir, s, i) => {
        const d = dir.clone().setZ(0).normalize();
        fanLeafData.push({
          rest: p.clone(), dir: d,
          tiltAxis: new THREE.Vector3(d.y, -d.x, 0).normalize(),
          tilt: 0.10 + 0.20 * E.h1(i * 3 + 2), phase: E.h1(i * 5 + 1) * Math.PI * 2,
          scale: s * 12.5 * E.U,
        });
      };
      const inBand = (x, pad = 8 * E.U) => Math.abs(x) <= BAND_HALF - pad;
      fan.leaves.forEach((l, i) => { if (inBand(l.p.x)) pushFanLeaf(l.p, l.d, l.s, i); });
      fan.tips.forEach((t, i) => {
        if (inBand(t.p.x) && rng() < 0.6)
          pushFanLeaf(t.p, t.d.clone().applyAxisAngle(ZAX, rr3(-0.4, 0.4)), rr3(0.55, 0.75), 1000 + i);
      });
      // the trained fringe: boxwood leaves petioled along every arm,
      // alternating sides, ~20 px pitch — the foliage of a thing kept flat
      fan.branches.forEach((b, bi) => {
        if (b.w < 2.0) return;
        const { kept } = clipToBand3(b.pts, BAND_HALF - 6 * E.U);
        if (kept.length < 2) return;
        let side = rng() < 0.5 ? 1 : -1;
        let nextAt = 16 * E.U, acc = 0, li = 0;
        for (let i = 0; i < kept.length - 1; i++) {
          const seg = kept[i].distanceTo(kept[i + 1]);
          const dir = kept[i + 1].clone().sub(kept[i]);
          while (acc + seg >= nextAt) {
            const tt = (nextAt - acc) / seg;
            const p = kept[i].clone().addScaledVector(dir, tt);
            pushFanLeaf(p, dir.clone().applyAxisAngle(ZAX, side * rr3(0.55, 0.9)),
              rr3(0.75, 0.95), 5000 + bi * 400 + li);
            li++;
            side = -side;
            nextAt += 20 * E.U;
          }
          acc += seg;
        }
      });
      const fanLeafMesh = new THREE.InstancedMesh(leafGeo, leafMat, fanLeafData.length);
      fanLeafMesh.castShadow = true;
      fanLeafData.forEach((L, i) => place(fanLeafMesh, i, L, 0, true));
      {
        const c = new THREE.Color();
        for (let i = 0; i < fanLeafMesh.count; i++) {
          c.setHex(E.INK).multiplyScalar(0.75 + 0.25 * E.h1(i * 11 + 1));
          fanLeafMesh.setColorAt(i, c);
        }
      }
      specimen.add(fanLeafMesh);

      // ---------- the escapes: growth that will not lie flat ----------
      // sprout from actual points on the trained arms, leave the plane
      // toward the visitor (+z), the relief by arc length (Tab. I's lift)
      const ESC_OPTS = { curl: 0.32, spread: 0.45, decay: 0.72, lateral: 0.18, leafAlong: 1.0, leafScale: 1.0, segs: 6 };
      const shootSpecs = [
        { arm: 1, f: 0.75, a: -0.22, len: 165, w: 3.6 },
        { arm: 4, f: 0.55, a: 0.18, len: 145, w: 3.2 },
      ];
      const vines = [];
      const shootGroups = [];
      const escapeLeafData = [];
      const key2 = (p) => p.x.toFixed(6) + "," + p.y.toFixed(6);
      shootSpecs.forEach((spec, si) => {
        const poly = armPolys[spec.arm].pts;
        const sprout = poly[Math.min(poly.length - 1, Math.round(poly.length * spec.f))];
        const shoot = { branches: [], tips: [], leaves: [] };
        const off = spec.a + rr3(-0.04, 0.04);
        grow3(sprout.clone(), new THREE.Vector3(Math.sin(off), Math.cos(off), 0),
          spec.len * E.U * rr3(0.94, 1.06), spec.w, 2, ESC_OPTS, shoot);
        // flat first, then the lift: the shoot peels off the plane
        const branches = shoot.branches.map((b) => ({
          w: b.w,
          pts: b.pts.map((p) => new THREE.Vector3(p.x, p.y, HINGE)),
          d: new Array(b.pts.length).fill(null), attach: null,
        }));
        branches.forEach((b, i) => {
          const key = key2(b.pts[0]);
          for (let j = 0; j < branches.length; j++) {
            const from = i === j ? 1 : 0;
            for (let k = from; k < branches[j].pts.length; k++) {
              if (key2(branches[j].pts[k]) === key) { b.attach = { branch: j, point: k }; j = branches.length; break; }
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
                b.d[k] = b.d[k - 1] + b.pts[k].distanceTo(b.pts[k - 1]);
              resolved++;
            }
          });
          if (resolved === branches.length) break;
        }
        const maxD = Math.max(...branches.flatMap((b) => b.d));
        const liftK = 0.9 * (0.85 + 0.3 * E.h1(si * 7 + 1));
        const lift = (d) => liftK * Math.pow(d / maxD, 1.35);
        const lifted = (p, d) => new THREE.Vector3(p.x, p.y, HINGE + lift(d));

        const rootB = branches.find((b) => !b.attach);
        const pivot = lifted(rootB.pts[0], 0);
        const g = new THREE.Group();
        g.position.copy(pivot);
        group.add(g);
        shootGroups[si] = { group: g, pivot };
        branches.forEach((b) => {
          const pts3 = b.pts.map((p, k) => lifted(p, b.d[k]).sub(pivot));
          if (pts3.length < 2) return;
          const geo = E.taperedTube(THREE, pts3, b.w, Math.max(1.8, b.w * 0.4));
          const mesh = new THREE.Mesh(geo, vineMat);
          mesh.castShadow = true;
          g.add(mesh);
          vines.push({ mesh, full: geo.getIndex().count, shoot: si });
        });

        // escape leaves — dark, wild, on the lifted positions
        const allPts = [];
        branches.forEach((b, bi) => b.pts.forEach((p, pi) => allPts.push({ p, bi, pi })));
        const findPt = (p) => {
          let best = null, bd = 1e9;
          for (const q of allPts) {
            const d = (q.p.x - p.x) ** 2 + (q.p.y - p.y) ** 2;
            if (d < bd) { bd = d; best = q; }
          }
          return best;
        };
        const pushEscLeaf = (p, dir, s, i) => {
          const m = findPt(p);
          if (!m) return;
          const d = dir.clone().setZ(0).normalize();
          escapeLeafData.push({
            shoot: si,
            rest: lifted(m.p, branches[m.bi].d[m.pi]),
            dir: d,
            tiltAxis: new THREE.Vector3(d.y, -d.x, 0).normalize(),
            tilt: 0.22 + 0.38 * E.h1(i * 3 + 2), phase: E.h1(i * 5 + 1) * Math.PI * 2,
            scale: s * 12.5 * E.U,
          });
        };
        shoot.leaves.forEach((l, i) => pushEscLeaf(
          new THREE.Vector3(l.p.x, l.p.y, HINGE), l.d, l.s, si * 1000 + i));
        shoot.tips.forEach((t, i) => {
          pushEscLeaf(new THREE.Vector3(t.p.x, t.p.y, HINGE),
            t.d.clone().applyAxisAngle(ZAX, rr3(-0.4, 0.4)), rr3(0.85, 1.1), si * 1000 + 500 + i);
          if (rng() < 0.6)
            pushEscLeaf(new THREE.Vector3(t.p.x + rr3(-8, 8) * E.U, t.p.y + rr3(-8, 8) * E.U, HINGE),
              t.d.clone().applyAxisAngle(ZAX, rr3(-1.3, 1.3)), rr3(0.7, 0.9), si * 1000 + 700 + i);
        });
      });
      const escLeafMesh = new THREE.InstancedMesh(leafGeo, leafMat, escapeLeafData.length);
      escLeafMesh.castShadow = true;
      escLeafMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      group.add(escLeafMesh);

      // c rides the topmost escaped tip
      const cPos = (() => {
        let best = null;
        for (const L of escapeLeafData) if (!best || L.rest.y > best.rest.y) best = L;
        return best ? best.rest.clone() : new THREE.Vector3(0, 3.6, HINGE + 0.6);
      })();
      // d rides the topmost stub on the right edge
      const dPos = (() => {
        const right = severed.filter((s) => s.p.x > 0);
        const top = right.length ? right.reduce((m, s) => (s.p.y > m.p.y ? s : m), right[0]) : null;
        return top ? top.p.clone().add(new THREE.Vector3(0.1, 0.05, 0.1))
                   : new THREE.Vector3(BAND_HALF, elev(916), HINGE);
      })();

      // ---- per-frame: the resident (escapes keep escaping; the fan holds)
      function update(t, reduced, active) {
        if (!active) {
          // neighbors breathe, nothing more (cheap)
          if (!reduced) specimen.rotation.set(0.002 * Math.sin((2 * Math.PI * t) / 9.1), 0, 0.0026 * Math.sin((2 * Math.PI * t) / 12.3));
          return;
        }
        if (reduced) { specimen.rotation.set(0, 0, 0); }
        else specimen.rotation.set(0.002 * Math.sin((2 * Math.PI * t) / 9.1), 0, 0.0026 * Math.sin((2 * Math.PI * t) / 12.3));
        shootGroups.forEach((sg, si) => {
          if (reduced) { sg.group.quaternion.identity(); return; }
          const vis = E.growthOf(si, t, reduced);
          const amp = Math.min(1, Math.max(0, (vis - 0.82) / 0.18) + 0.35);
          sg.group.rotation.set(
            0.012 * amp * Math.sin((2 * Math.PI * t) / (6.1 + si * 1.4) + si),
            0.007 * amp * Math.sin((2 * Math.PI * t) / (7.6 + si * 1.2) + si * 1.3),
            0.015 * amp * Math.sin((2 * Math.PI * t) / (8.3 + si * 1.8) + si * 2.1));
        });
        for (const v of vines) {
          const vis = E.growthOf(v.shoot, t, reduced);
          v.mesh.geometry.setDrawRange(0, Math.floor((v.full * vis) / 3) * 3);
        }
        for (let i = 0; i < escapeLeafData.length; i++) {
          const L = escapeLeafData[i], sg = shootGroups[L.shoot];
          const vis = E.growthOf(L.shoot, t, reduced);
          L.u = reduced ? 1 : Math.max(0, Math.min(1, (vis - 0.88) / 0.12));
          place(escLeafMesh, i, L, t, reduced, sg.group.quaternion, sg.pivot);
        }
        escLeafMesh.instanceMatrix.needsUpdate = true;
      }

      return {
        group, update,
        labels: {
          a: { pos: new THREE.Vector3(sx(535), 0.06, sz(1645)), name: "rootstock",
               note: "below the surface the stock was never flattened — it spreads where the plane cannot reach." },
          b: { pos: new THREE.Vector3(sx(1228), 0.05, sz(1444)), name: "section",
               note: "the plant seen edge-on: one hairline, ten specks. across the plane there is nearly nothing — that is the point." },
          c: { pos: cPos, name: "escape shoots",
               note: "growth that will not lie flat, in the one direction the trellis forbids. it has left the plane, and it has not stopped." },
          d: { pos: dPos, name: "the plane",
               note: "the band's edge is the shear: what crosses it is cut, and the stubs sit on the trace. the trellis stays; the trained arm does not." },
          e: { pos: new THREE.Vector3(sx(950), 0.05, HINGE + 0.05), name: "the surface",
               note: "the deployment boundary. what shows above is the product; the plane begins here." },
        },
        views: {
          home: { az: -14, el: 23, dist: 10.6, tg: [0, 1.5, 0.9] },
          a: { az: -30, el: 15, dist: 5.2, tg: [-0.5, 0.3, 2.1] },
          b: { az: 14, el: 52, dist: 4.6, tg: [2.6, 0.15, 2.2] },
          c: { az: -10, el: 16, dist: 4.8, tg: [cPos.x, cPos.y, cPos.z] },
          d: { az: 52, el: 12, dist: 4.6, tg: [1.4, dPos.y, 1.5] },
          e: { az: -22, el: 18, dist: 4.8, tg: [1.1, 0.35, 1.5] },
        },
      };
    },
  };
})());
