/* TAB. III — THE SPECIALIST, in the room.
 * The sheet lies on the table; the grafted plant pops up from the soil line
 * (py 1300, the hinge). One trunk, two habits: the wild stock's own shoots
 * below the union (large dark leaves, still reaching) and the fine-tuned
 * scion's calm dome above it (small pale leaves). The union collar — the
 * plate's whole figure — stands on the trunk top over its drawn trace.
 * Same seed (73021561), grown in 3D; register on window.HM3D_STATIONS.
 */
"use strict";
window.HM3D_STATIONS.push((() => {
  const E = window.HM3D;
  const SOIL = 1300;
  const SEED = 73021561;

  // plate px → station local (sheet surface = y 0)
  const sx = (x) => (x - 700) * E.U;
  const sz = (y) => (y - 1000) * E.U;
  const HINGE = sz(SOIL); // 1.5
  const elev = (y) => (SOIL - y) * E.U; // drawn height above soil

  // the master's layout constants (tab-03/generate.mjs)
  const TBX = 672;                 // trunk base x
  const UNION = { x: 686, y: 975 };// the graft union, y 945–1010
  const DOME = { x: 700, y: 906 }; // scion crown origin
  const HABIT = { cx: 700, cy: 688, rx: 250, ry: 220 };
  const IN = { cx: 1118, cy: 1320, r: 110 }; // the dissection inset (the door)

  return {
    id: "tab-03", numeral: "III",
    name: "THE SPECIALIST", latin: "Perita codicis / S. domestica",
    technique: "grafting — the union holds",
    texture: "textures/tab-03-living.png",
    soil: SOIL,

    build(E3, THREE) {
      const group = new THREE.Group();
      const specimen = new THREE.Group();
      group.add(specimen);
      const place = E.leafPlacer(THREE);
      const rng3 = E.mulberry32(SEED);
      const { grow3, rr3 } = E.makeGrow3(THREE, rng3);
      const perp3 = (v) => {
        const r = new THREE.Vector3(rng3() * 2 - 1, rng3() * 2 - 1, rng3() * 2 - 1).cross(v);
        return r.lengthSq() < 1e-6 ? new THREE.Vector3(1, 0, 0) : r.normalize();
      };
      const woodMat = new THREE.MeshStandardMaterial({ color: E.INK, roughness: 0.7 });
      const unionMat = new THREE.MeshStandardMaterial({ color: E.INK, roughness: 0.68 });
      const leafGeo = E.makeLeafGeo(THREE);
      // two habits, two leaf registers: the scion's small unfilled-looking
      // leaves (low opacity reads as outline at arm's length) vs the stock's
      // large ink-filled ones — the contrast is the whole story
      const scionLeafMat = new THREE.MeshStandardMaterial({
        color: E.INK, roughness: 0.9, side: THREE.DoubleSide, transparent: true, opacity: 0.66,
      });
      const wildLeafMat = new THREE.MeshStandardMaterial({
        color: E.INK, roughness: 0.9, side: THREE.DoubleSide, transparent: true, opacity: 0.82,
      });

      // ---------- the stock trunk: (672, 1306) up to the union ----------
      // sturdy, near-vertical, gently wandering; drifts toward the union's x
      const trunkTop = new THREE.Vector3();
      {
        const pts = [];
        let x = sx(TBX), y = elev(1306), z = HINGE;
        pts.push(new THREE.Vector3(x, y, z));
        let a = -Math.PI / 2;
        for (let i = 0; i < 5; i++) {
          a += (rng3() - 0.5) * 0.08;
          x += Math.cos(a) * 62 * E.U;
          y += -Math.sin(a) * 62 * E.U; // plate y down → world y up
          z = HINGE + (rng3() - 0.5) * 0.02;
          pts.push(new THREE.Vector3(x, y, z));
        }
        // the drawn trunk ends at the union (686, 975): pull the top onto it
        const top = pts[pts.length - 1];
        const want = new THREE.Vector3(sx(UNION.x), elev(UNION.y + 20), HINGE);
        const fix = want.clone().sub(top);
        pts.forEach((p, i) => p.addScaledVector(fix, (i / (pts.length - 1)) ** 2));
        trunkTop.copy(want);
        const trunk = new THREE.Mesh(E.taperedTube(THREE, pts, 14, 6.3), woodMat);
        trunk.castShadow = true;
        specimen.add(trunk);
      }

      // the pop-up's cut made visible at the trunk foot — ink on the sheet;
      // own rng stream (SEED+41 is the inset's), so the plant keeps its bytes
      {
        const jr = E.mulberry32(SEED + 7);
        const decal = E.makeHingeDecal(THREE, jr);
        decal.position.set(sx(TBX), 0.002, HINGE);
        decal.rotation.z = 0.03 + (jr() - 0.5) * 0.12;
        group.add(decal);
      }

      // ---------- the union made real: a swelling collar ----------
      // ink-dark wood, flaring from the trunk to the scion stem; the diagonal
      // seam rides it as a raised ridge, callus scallops as tiny bumps
      const collar = new THREE.Group();
      collar.position.copy(trunkTop);
      collar.rotation.z = -0.06; // the dogleg's slight lean, echoed in the swelling
      specimen.add(collar);
      const collarR = (y) => {
        // profile radii along the collar's height (y in local units)
        const prof = [
          [-0.11, 0.042], [-0.06, 0.075], [-0.01, 0.115], [0.05, 0.145],
          [0.09, 0.15], [0.14, 0.135], [0.19, 0.10], [0.24, 0.065], [0.29, 0.036],
        ];
        for (let i = 0; i < prof.length - 1; i++) {
          const [y0, r0] = prof[i], [y1, r1] = prof[i + 1];
          if (y <= y1) return r0 + (r1 - r0) * Math.max(0, (y - y0) / (y1 - y0));
        }
        return prof[prof.length - 1][1];
      };
      {
        const prof = [
          new THREE.Vector2(0.001, -0.11), new THREE.Vector2(0.042, -0.11),
          new THREE.Vector2(0.075, -0.06), new THREE.Vector2(0.115, -0.01),
          new THREE.Vector2(0.145, 0.05), new THREE.Vector2(0.15, 0.09),
          new THREE.Vector2(0.135, 0.14), new THREE.Vector2(0.10, 0.19),
          new THREE.Vector2(0.065, 0.24), new THREE.Vector2(0.036, 0.29),
          new THREE.Vector2(0.001, 0.29),
        ];
        const geo = new THREE.LatheGeometry(prof, 28);
        const mesh = new THREE.Mesh(geo, unionMat);
        mesh.castShadow = true;
        collar.add(mesh);
      }
      // the diagonal seam: the cut faces meeting — low at the collar's left,
      // rising across the front to its right (the drawn seam, made a ridge)
      // the seam's ridge dives into the swelling at both ends (the drawn
      // seam stays inside the contours); the middle rides proud
      const seamAt = (s) => {
        const phi = 0.92 * Math.PI - s * 0.84 * Math.PI; // left → right, across the front
        const y = 0.02 + s * 0.20;
        const proud = 0.002 + 0.012 * Math.sqrt(Math.sin(Math.PI * s));
        const r = collarR(y) + proud;
        return new THREE.Vector3(r * Math.cos(phi), y, r * Math.sin(phi));
      };
      {
        const pts = [];
        for (let i = 0; i <= 14; i++) {
          const s = i / 14;
          const p = seamAt(s);
          p.y += Math.sin(s * Math.PI * 2.2) * 0.015; // the drawn wobble
          pts.push(p);
        }
        const seam = new THREE.Mesh(E.taperedTube(THREE, pts, 4.5, 2.8), unionMat);
        seam.castShadow = true;
        collar.add(seam);
        // callus scallops riding the seam's upper side — restrained, tucked
        // toward the front so they don't silhouette as ears from behind
        for (const f of [0.28, 0.55, 0.82]) {
          const p = seamAt(f + (0.5 - f) * 0.22);
          const bump = new THREE.Mesh(
            new THREE.SphereGeometry(0.022 + 0.005 * E.h1(f * 91), 10, 8), unionMat);
          const out = new THREE.Vector3(p.x, 0, p.z).normalize();
          bump.position.copy(p).addScaledVector(out, 0.008);
          bump.position.y = p.y + 0.016;
          bump.castShadow = true;
          collar.add(bump);
        }
      }

      // ---------- the scion stem: the dogleg to the crown origin ----------
      {
        const pts = [
          trunkTop.clone().add(new THREE.Vector3(18 * E.U, 40 * E.U, 0)),
          new THREE.Vector3(sx(696), elev(940), HINGE + 0.01),
          new THREE.Vector3(sx(DOME.x - 2), elev(DOME.y + 8), HINGE),
          new THREE.Vector3(sx(DOME.x), elev(DOME.y), HINGE),
        ];
        const stem = new THREE.Mesh(E.taperedTube(THREE, pts, 8, 3.6), woodMat);
        stem.castShadow = true;
        specimen.add(stem);
      }

      // ---------- the scion: a neat natural dome, never sheared ----------
      // 13 leaders fanned around vertical, lengths solved to the habit
      // ellipse exactly as the master solves them; fine dense twig-work
      const scion = { branches: [], tips: [], leaves: [] };
      const crownO = new THREE.Vector3(sx(DOME.x), elev(DOME.y), HINGE);
      const LEADERS = 13;
      for (let i = 0; i < LEADERS; i++) {
        const f = i / (LEADERS - 1);
        const off = -0.78 + f * 1.56;
        // distance from the crown origin to the habit ellipse along this leader
        const ux = Math.sin(off), uy = -Math.cos(off);
        const dx = (DOME.x - HABIT.cx) / HABIT.rx, dyy = (DOME.y - HABIT.cy) / HABIT.ry;
        const vx = ux / HABIT.rx, vy = uy / HABIT.ry;
        const A = vx * vx + vy * vy, B = 2 * (dx * vx + dyy * vy), C = dx * dx + dyy * dyy - 1;
        const reach = (-B + Math.sqrt(Math.max(0, B * B - 4 * A * C))) / (2 * A);
        const len = Math.max(60, Math.min(175, (reach / 2.67) * rr3(0.9, 1.06))) * E.U;
        const dir = new THREE.Vector3(ux, Math.cos(off), 0)
          .applyAxisAngle(new THREE.Vector3(1, 0, 0), rr3(-0.35, 0.35)); // relief toward the visitor
        grow3(crownO.clone().add(new THREE.Vector3(rr3(-0.05, 0.05), rr3(-0.01, 0.06), rr3(-0.03, 0.03))),
          dir, len, rr3(3.0, 3.6), 4,
          { curl: 0.55, spread: 0.48, decay: 0.68, lateral: 0.34, leafAlong: 0.75, leafScale: 0.52, segs: 5, tri: 0.5, bias: off * 0.04 },
          scion);
      }
      {
        const geoms = scion.branches.map((b) => E.taperedTube(THREE, b.pts, b.w, b.w * 0.55));
        const dome = new THREE.Mesh(E.mergeGeoms(geoms), woodMat);
        dome.castShadow = true;
        specimen.add(dome);
      }

      // ---------- the stock's own shoots (below the union) ----------
      // capability leakage: wilder habit, heavier twigs, large dark leaves;
      // they keep reaching — the station's resident life
      const wild = { branches: [], tips: [], leaves: [] };
      const shootSpecs = [
        { x: TBX - 6, y: 1120, a: -2.88, len: 138, w: 4.6 },  // up-left, the long one
        { x: TBX + 8, y: 1210, a: -0.78, len: 118, w: 4.2 },  // up-right
        { x: TBX - 8, y: 1262, a: -3.05, len: 88, w: 3.8 },   // low left
      ];
      const shootPivots = [];
      const YAXIS = new THREE.Vector3(0, 1, 0);
      shootSpecs.forEach((s, si) => {
        const out = { branches: [], tips: [], leaves: [] };
        const base = new THREE.Vector3(sx(s.x + rr3(-5, 5)), elev(s.y + rr3(-5, 5)), HINGE);
        shootPivots.push(base);
        const aa = s.a + rr3(-0.05, 0.05);
        const dir = new THREE.Vector3(Math.cos(aa), -Math.sin(aa), 0)
          .applyAxisAngle(YAXIS, rr3(-0.25, 0.25)); // lean toward/away from the visitor
        grow3(base, dir, s.len * rr3(0.94, 1.06) * E.U, s.w, 3,
          { curl: 0.32, spread: 0.48, decay: 0.72, lateral: 0.2, leafAlong: 0.85, leafScale: 1.15, segs: 6 },
          out);
        out.shoot = si;
        wild.branches.push(...out.branches.map((b) => ({ ...b, shoot: si })));
        wild.tips.push(...out.tips.map((t) => ({ ...t, shoot: si })));
        wild.leaves.push(...out.leaves.map((l) => ({ ...l, shoot: si })));
      });

      // shoot groups: branches ride a pivot so they can keep reaching
      const shootGroups = [];
      const vines = [];
      shootPivots.forEach((pivot, si) => {
        const g = new THREE.Group();
        g.position.copy(pivot);
        group.add(g);
        shootGroups.push({ group: g, pivot });
        for (const b of wild.branches.filter((bb) => bb.shoot === si)) {
          const pts3 = b.pts.map((p) => p.clone().sub(pivot));
          const geo = E.taperedTube(THREE, pts3, b.w, Math.max(2.2, b.w * 0.45));
          const mesh = new THREE.Mesh(geo, woodMat);
          mesh.castShadow = true;
          g.add(mesh);
          vines.push({ mesh, full: geo.getIndex().count, shoot: si });
        }
      });

      // ---------- leaves ----------
      // scion leaf data: small, pale, calm (no flutter — the trained top)
      const scionLeafData = [];
      scion.leaves.forEach((l, i) => {
        scionLeafData.push({
          rest: l.p, dir: l.d,
          tiltAxis: new THREE.Vector3(l.d.y, -l.d.x, 0).normalize(),
          tilt: 0.55 + 0.65 * E.h1(i * 3 + 2), phase: E.h1(i * 5 + 1) * Math.PI * 2,
          scale: l.s * 1.3 * 12.5 * E.U,
        });
      });
      scion.tips.forEach((t, i) => {
        const n = 2 + (rng3() < 0.4 ? 1 : 0); // the master's tip tuft
        for (let k = 0; k < n; k++) {
          const d = t.d.clone().applyAxisAngle(perp3(t.d), rr3(0.2, 1.4));
          scionLeafData.push({
            rest: t.p.clone().add(new THREE.Vector3(rr3(-0.03, 0.03), rr3(-0.03, 0.03), rr3(-0.02, 0.02))),
            dir: d,
            tiltAxis: new THREE.Vector3(d.y, -d.x, 0).normalize(),
            tilt: 0.55 + 0.65 * E.h1(i * 7 + k * 13 + 4), phase: E.h1(i * 5 + k) * Math.PI * 2,
            scale: rr3(0.36, 0.62) * 1.25 * 12.5 * E.U,
          });
        }
      });
      // the habit skin: the scion's own leafiness filling its natural
      // ellipse — the bench's shell idiom, but no shear made this dome;
      // small pale leaves, tangent to the form, calm like the rest of it
      const SKIN_N = 1600;
      const HC = new THREE.Vector3(sx(HABIT.cx), elev(HABIT.cy), HINGE);
      const RX = HABIT.rx * E.U, RY = HABIT.ry * E.U, RZ = HABIT.rx * 0.55 * E.U;
      for (let i = 0; i < SKIN_N; i++) {
        const z = rr3(-1, 1), az = rr3(0, Math.PI * 2);
        const rr_ = Math.sqrt(1 - z * z);
        const u = new THREE.Vector3(rr_ * Math.cos(az), z, rr_ * Math.sin(az));
        const wob = 1 + 0.03 * Math.sin(3 * az + 1.7) + 0.015 * Math.sin(7 * az + 0.4);
        const p = new THREE.Vector3(u.x * RX, u.y * RY, u.z * RZ)
          .multiplyScalar(rr3(0.88, 1.0) * wob).add(HC);
        const n = new THREE.Vector3(u.x / RX, u.y / RY, u.z / RZ).normalize();
        const tangent = new THREE.Vector3(rr3(-1, 1), rr3(-1, 1), rr3(-1, 1)).cross(n).normalize()
          .applyAxisAngle(n, rr3(0, Math.PI * 2));
        scionLeafData.push({
          rest: p, dir: tangent,
          tiltAxis: new THREE.Vector3().crossVectors(tangent, n).normalize(),
          tilt: 0.5 + 0.6 * E.h1(i * 7 + 2), phase: E.h1(i * 5 + 3) * Math.PI * 2,
          scale: rr3(0.5, 0.7) * 12.5 * E.U,
        });
      }
      const scionLeafMesh = new THREE.InstancedMesh(leafGeo, scionLeafMat, scionLeafData.length);
      scionLeafMesh.castShadow = true;
      scionLeafMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      specimen.add(scionLeafMesh);

      // wild leaf data: large, ink-filled, fluttering, scaling in as the
      // shoots finish their reach
      const wildLeafData = [];
      wild.leaves.forEach((l, i) => {
        wildLeafData.push({
          shoot: l.shoot,
          rest: l.p, dir: l.d,
          tiltAxis: new THREE.Vector3(l.d.y, -l.d.x, 0).normalize(),
          tilt: 0.5 + 0.7 * E.h1(i * 3 + 2), phase: E.h1(i * 5 + 1) * Math.PI * 2,
          scale: l.s * 12.5 * E.U, u: 1,
        });
      });
      wild.tips.forEach((t, i) => {
        const n = 2 + (rng3() < 0.5 ? 1 : 0);
        for (let k = 0; k < n; k++) {
          const d = t.d.clone().applyAxisAngle(perp3(t.d), rr3(0.2, 1.6));
          wildLeafData.push({
            shoot: t.shoot,
            rest: t.p.clone().add(new THREE.Vector3(rr3(-0.045, 0.045), rr3(-0.045, 0.045), rr3(-0.03, 0.03))),
            dir: d,
            tiltAxis: new THREE.Vector3(d.y, -d.x, 0).normalize(),
            tilt: 0.5 + 0.7 * E.h1(i * 7 + k * 13 + 4), phase: E.h1(i * 5 + k) * Math.PI * 2,
            scale: rr3(0.85, 1.35) * 1.15 * 12.5 * E.U, u: 1,
          });
        }
      });
      const wildLeafMesh = new THREE.InstancedMesh(leafGeo, wildLeafMat, wildLeafData.length);
      wildLeafMesh.castShadow = true;
      wildLeafMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      group.add(wildLeafMesh);
      {
        const c = new THREE.Color();
        for (let i = 0; i < scionLeafMesh.count; i++) {
          c.setHex(E.INK).multiplyScalar(0.9 + 0.1 * E.h1(i * 11));
          scionLeafMesh.setColorAt(i, c);
        }
        for (let i = 0; i < wildLeafMesh.count; i++) {
          c.setHex(E.INK).multiplyScalar(0.75 + 0.25 * E.h1(i * 11 + 3));
          wildLeafMesh.setColorAt(i, c);
        }
      }

      // letter anchors ride the growth data (a: leftmost wild tip; c: the
      // scion's leftmost leaf), as they do on the plate
      const aPos = (() => {
        let best = null, bx = 1e9;
        for (const t of wild.tips) if (t.p.x < bx) { bx = t.p.x; best = t.p; }
        return best ? best.clone() : new THREE.Vector3(sx(560), elev(1010), HINGE);
      })();
      const cPos = (() => {
        let best = null, bx = 1e9;
        for (const L of scionLeafData) if (L.rest.x < bx) { bx = L.rest.x; best = L.rest; }
        return best ? best.clone() : new THREE.Vector3(sx(520), elev(700), HINGE);
      })();
      const dPos = trunkTop.clone().add(new THREE.Vector3(0.17, 0.14, 0.12));

      // ---------- per-frame: the shoots keep reaching; the scion is calm ----

      
        // per-frame temps (hoisted — no garbage in the frame loop)

      
        const _specQ = new THREE.Quaternion(), _zero = new THREE.Vector3();

      
        _specQ.setFromEuler(specimen.rotation);
      
      function update(t, reduced, active) {
        _specQ.setFromEuler(specimen.rotation); // refreshed per frame: the sway mutates rotation
        if (!active) {
          if (!reduced) specimen.rotation.set(0.0028 * Math.sin((2 * Math.PI * t) / 8.3), 0, 0.0035 * Math.sin((2 * Math.PI * t) / 11));
          return;
        }
        if (reduced) specimen.rotation.set(0, 0, 0);
        else specimen.rotation.set(0.0028 * Math.sin((2 * Math.PI * t) / 8.3), 0, 0.0035 * Math.sin((2 * Math.PI * t) / 11));
        shootGroups.forEach((sg, si) => {
          if (reduced) { sg.group.quaternion.identity(); return; }
          const vis = E.growthOf(si, t, reduced);
          const amp = Math.min(1, Math.max(0, (vis - 0.82) / 0.18) + 0.35);
          sg.group.rotation.set(
            0.012 * amp * Math.sin((2 * Math.PI * t) / (6.1 + si * 1.3) + si),
            0.006 * amp * Math.sin((2 * Math.PI * t) / (7.2 + si * 1.1) + si * 1.3),
            0.015 * amp * Math.sin((2 * Math.PI * t) / (8.3 + si * 1.7) + si * 2.1));
        });
        for (const v of vines) {
          const vis = E.growthOf(v.shoot, t, reduced);
          v.mesh.geometry.setDrawRange(0, Math.floor((v.full * vis) / 3) * 3);
        }
        
        for (let i = 0; i < scionLeafData.length; i++) {
          // calm: reduced=true into the placer — no flutter, breathing only
          place(scionLeafMesh, i, scionLeafData[i], t, true, _specQ, _zero);
        }
        scionLeafMesh.instanceMatrix.needsUpdate = true;
        for (let i = 0; i < wildLeafData.length; i++) {
          const L = wildLeafData[i], sg = shootGroups[L.shoot];
          const vis = E.growthOf(L.shoot, t, reduced);
          L.u = reduced ? 1 : Math.max(0, Math.min(1, (vis - 0.88) / 0.12));
          place(wildLeafMesh, i, L, t, reduced, sg.group.quaternion, sg.pivot);
        }
        wildLeafMesh.instanceMatrix.needsUpdate = true;
      }

      // ---------- the inset is a door: the union, enlarged, as a room ----------
      // the master's dissection inset (generate.mjs, IN above): two tissue
      // line-systems meeting at a seam — heavy calm stock lines below, fine
      // lively scion lines above. Here that drawing stands as a cylindrical
      // interior under the printed circle, below the sheet (y < 0) — where
      // the inset was always pointing. The wall wraps the master's tissue()
      // chords around: plate t ∈ [-half, half] → θ ∈ [0, 2π), the normal
      // offset + wobble → height; the wobble keeps the master's amp/freq but
      // is quantized to whole cycles so the wrap is seamless. Same offsets,
      // weights, and contrast; its own rng stream off the same seed, so the
      // plant above keeps its bytes.
      const insetC = new THREE.Vector3(sx(IN.cx), 0, sz(IN.cy));
      const insetR = IN.r * E.U;
      const TUBE = { r: 1.3, h: 2.4, top: -0.05 }; // group-local; rim just under the sheet
      {
        const rIn = IN.r - 10, spread = 108; // inset diameter in plate px ↔ full wall height
        const rngI = E.mulberry32(SEED + 41);
        const W = 2048, H = 1024;
        const cnv = document.createElement("canvas"); cnv.width = W; cnv.height = H;
        const g2 = cnv.getContext("2d");
        // the diagram's paper, a step quieter than the sheet; deeper = darker
        g2.fillStyle = "#ede6d4"; g2.fillRect(0, 0, W, H);
        const vgrad = g2.createLinearGradient(0, 0, 0, H);
        vgrad.addColorStop(0, "rgba(96,86,64,0.10)");
        vgrad.addColorStop(0.45, "rgba(96,86,64,0)");
        vgrad.addColorStop(1, "rgba(96,86,64,0.18)");
        g2.fillStyle = vgrad; g2.fillRect(0, 0, W, H);
        const pxPerPlate = H / (2 * spread);
        // the seam membrane: a held wash band at the meeting height
        {
          const band = g2.createLinearGradient(0, H * 0.5 - 15 * pxPerPlate, 0, H * 0.5 + 15 * pxPerPlate);
          band.addColorStop(0, "rgba(43,46,38,0)");
          band.addColorStop(0.5, "rgba(43,46,38,0.17)");
          band.addColorStop(1, "rgba(43,46,38,0)");
          g2.fillStyle = band; g2.fillRect(0, H * 0.5 - 15 * pxPerPlate, W, 30 * pxPerPlate);
        }
        const ringLine = (off, amp, freq, wPx, alpha) => {
          const half = Math.sqrt(Math.max(4, rIn * rIn - (Math.abs(off) + amp + 2) ** 2));
          const cyc = Math.max(1, Math.round((freq * 2 * half) / (2 * Math.PI)));
          const fine = cyc * 2 + 1;
          const ph1 = rngI() * Math.PI * 2, ph2 = rngI() * Math.PI * 2;
          g2.beginPath();
          for (let i = 0; i <= 640; i++) {
            const th = (i / 640) * Math.PI * 2;
            const w = amp * Math.sin(cyc * th + ph1) + amp * 0.3 * Math.sin(fine * th + ph2);
            // canvas y down = the plate's own down: stock (off > 0) sits below
            const y = (0.5 + (off + w) / (2 * spread)) * H;
            const x = (i / 640) * W;
            i ? g2.lineTo(x, y) : g2.moveTo(x, y);
          }
          g2.strokeStyle = "#2b2e26";
          g2.globalAlpha = alpha;
          g2.lineWidth = Math.max(1.2, wPx * pxPerPlate);
          g2.lineCap = "round";
          g2.stroke();
          g2.globalAlpha = 1;
        };
        for (const off of [20, 42, 64, 86]) ringLine(off, 1.6, 0.1, 2.0, 0.92);   // stock: few, heavy, calm
        for (const off of [-12, -23, -34, -45, -56, -67, -78, -88])
          ringLine(off, 4.4, 0.22, 0.75, 0.9);                                   // scion: many, fine, lively
        ringLine(0, 4.2, 0.1, 3.0, 1.0);                                         // the seam itself
        const wallTex = new THREE.CanvasTexture(cnv);
        wallTex.colorSpace = THREE.SRGBColorSpace;
        wallTex.wrapS = THREE.RepeatWrapping;
        wallTex.anisotropy = 4;
        const wall = new THREE.Mesh(
          new THREE.CylinderGeometry(TUBE.r, TUBE.r, TUBE.h, 96, 1, true),
          new THREE.MeshStandardMaterial({ map: wallTex, side: THREE.BackSide, roughness: 0.95 }));
        wall.position.set(insetC.x, TUBE.top - TUBE.h / 2, insetC.z);
        group.add(wall);

        // vascular strands standing off the wall — the two tissues in the
        // round, for parallax: stock strands thick and calm below the seam,
        // scion strands fine and busy above
        const strandMat = new THREE.MeshStandardMaterial({ color: E.INK, roughness: 0.8 });
        const wPerPlate = TUBE.h / (2 * spread); // world per plate px at the wall
        const seamY = TUBE.top - TUBE.h / 2;
        const mkStrand = (stock) => {
          const phi = rngI() * Math.PI * 2;
          const rr_ = TUBE.r * (0.9 + rngI() * 0.06);
          const y0 = stock ? TUBE.top - TUBE.h + 0.15 : seamY + 0.16;
          const y1 = stock ? seamY - 0.2 : TUBE.top - 0.12;
          const amp = (stock ? 1.6 : 4.4) * wPerPlate * (stock ? 1.6 : 0.8);
          const cyc = stock ? 1 : 2 + Math.floor(rngI() * 3);
          const ph = rngI() * Math.PI * 2;
          const lean = (rngI() - 0.5) * 0.1;
          // tangential meander too, else a vertical tube hides its wobble:
          // the scion's strands wander, the stock's barely breathe
          const wobT = (amp / rr_) * (stock ? 1 : 1.1);
          const cycT = stock ? 1 : 2 + Math.floor(rngI() * 2);
          const ph3 = rngI() * Math.PI * 2;
          const pts = [];
          for (let i = 0; i <= 40; i++) {
            const s = i / 40;
            const w = amp * Math.sin(cyc * s * Math.PI * 2 + ph);
            const a = phi + lean * s + wobT * Math.sin(cycT * s * Math.PI * 2 + ph3);
            pts.push(new THREE.Vector3(
              insetC.x + Math.cos(a) * (rr_ + w),
              y0 + (y1 - y0) * s,
              insetC.z + Math.sin(a) * (rr_ + w)));
          }
          // the bench's tapered tube re-samples coarsely at this length —
          // fine scion filaments need a dense plain tube to stay waves
          const geo = stock
            ? E.taperedTube(THREE, pts, 4.2, 2.6)
            : new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, false, "catmullrom", 0.5), 48, 0.004, 5, false);
          group.add(new THREE.Mesh(geo, strandMat));
        };
        for (let i = 0; i < 4; i++) mkStrand(true);
        for (let i = 0; i < 11; i++) mkStrand(false);
      }

      return {
        group, update,
        insets: [{ key: "union", view: "enterUnion", center: insetC, r: insetR }],
        labels: {
          a: { pos: aPos, name: "stock shoots",
               note: "the base model keeps sending its own shoots below the join — wilder habit, larger dark leaves. capability leakage, in leaf; they have not stopped reaching." },
          b: { pos: new THREE.Vector3(sx(1232), 0.05, sz(1442)), name: "the union, enlarged",
               note: "two tissues meeting: heavy calm stock lines below the seam, fine lively scion lines above. the drawing of what the collar on the trunk does in section." },
          c: { pos: cPos, name: "the scion",
               note: "Perita codicis, tidy by nature — no shear anywhere on it. the dome is its own habit: fine twig-work, small pale leaves, trained calm above the join." },
          d: { pos: dPos, name: "the graft",
               note: "the union holds. a cleft graft with a slight dogleg — walk around the collar: the raised seam is where two tissues met, and stayed." },
          e: { pos: new THREE.Vector3(sx(948), 0.05, HINGE + 0.05), name: "the surface",
               note: "the deployment boundary. what shows above is the product; the roots below keep the process." },
        },
        views: {
          home: { az: -14, el: 22, dist: 12, tg: [0, 1.9, 1.0] },
          a: { az: -30, el: 14, dist: 4.6, tg: [aPos.x, aPos.y, aPos.z] },
          b: { az: 12, el: 54, dist: 4.6, tg: [2.3, 0.1, 2.0] },
          c: { az: -20, el: 16, dist: 5.2, tg: [cPos.x, cPos.y, cPos.z] },
          d: { az: -20, el: 16, dist: 3.4, tg: [dPos.x - 0.1, dPos.y - 0.05, HINGE] },
          e: { az: -24, el: 20, dist: 4.8, tg: [1.1, 0.3, 1.5] },
          // inside the diagram: standing in the union, the seam at eye level
          // (tg y is world-frame here — below the table surface, y < 0)
          enterUnion: { az: 24, el: 4, dist: 1.05, tg: [sx(IN.cx), -1.17, sz(IN.cy)] },
        },
      };
    },
  };
})());
