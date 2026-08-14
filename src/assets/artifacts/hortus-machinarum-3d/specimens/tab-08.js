/* TAB. VIII — THE HOTHOUSE, in the room.
 * The sheet lies on the table; the glasshouse stands on it for real, hinged
 * at the soil line (py 1300): front and back elevations carried into depth
 * (220 px), ink-dark joinery, one transparent shell of panes. Inside, the
 * stock — Tab. I's clipped ball at ~0.33 scale, the same seed's 3D
 * biography — rises from the bed, inert and finished. The rain is the
 * resident: it runs down the OUTSIDE of the glass at the master's slant and
 * a few drops fall past the house and land on the paper. It has never
 * rained inside. Register on window.HM3D_STATIONS.
 */
"use strict";
window.HM3D_STATIONS.push((() => {
  const E = window.HM3D;
  const SEED = 81600808;
  const SOIL = 1300;

  // plate px → station local (sheet surface = y 0)
  const sx = (x) => (x - 700) * E.U;
  const sz = (y) => (y - 1000) * E.U;
  const HINGE = sz(SOIL); // 1.5
  const elev = (y) => (SOIL - y) * E.U; // drawn height above soil

  // the house (the engraving's front elevation, carried into depth):
  // walls x 480–920, y 980–1300; pitched roof, apex (700,860)
  const HX = sx(920), WALL_Y = elev(980), APEX_Y = elev(860); // 1.1, 1.6, 2.2
  const DEPTH = 220 * E.U;                                   // 1.1
  const ZF = HINGE + DEPTH / 2, ZB = HINGE - DEPTH / 2;      // 2.05, 0.95
  const MULLIONS = [590, 700, 810].map(sx);                  // −0.55, 0, 0.55
  const TRANSOMS = [1086, 1193].map(elev);                   // 1.07, 0.535
  const DOOR = { x0: sx(668), x1: sx(732), top: elev(1130) };// ±0.16, 0.85
  const GABLE_T = { y: elev(940), x: sx(846.7) };            // y 1.8, ±0.733

  // the stock: ball c (600,1125) r 95, crown (600,1208), bed at y 1288
  const BALL = { x: sx(600), y: elev(1125), r: 95 * E.U };
  const CROWN_Y = elev(1208);

  // the rain's slant (plate coords): ~19° off vertical, drifting down-right
  const SLANT = { u: 0.3256, v: 0.9455 };

  return {
    id: "tab-08", numeral: "VIII",
    name: "THE HOTHOUSE", latin: "Sycophanta vitrea hort. mach.",
    technique: "the eval sandbox — it has never rained here",
    texture: "textures/tab-08-living.png",
    soil: SOIL,

    build(E3, THREE) {
      const group = new THREE.Group();
      const place = E.leafPlacer(THREE);
      const rng = E.mulberry32(SEED);
      const { grow3, rr3 } = E.makeGrow3(THREE, rng);
      const vineMat = new THREE.MeshStandardMaterial({ color: E.INK, roughness: 0.7 });
      const frameMat = new THREE.MeshStandardMaterial({ color: E.INK, roughness: 0.5, metalness: 0.3 });
      const leafGeo = E.makeLeafGeo(THREE);
      const leafMat = new THREE.MeshStandardMaterial({
        color: E.INK, roughness: 0.9, side: THREE.DoubleSide, transparent: true, opacity: 0.85,
      });
      void E3;

      // ---------- the frame: joinery, machine-true ----------
      // constant-section members (the burin's swell is for growth, not for
      // glazing bars); diameter twice the drawn weight — outline 1.5, bars 1.0
      const bars = [];
      const UPV = new THREE.Vector3(0, 1, 0);
      function bar(ax, ay, az, bx, by, bz, w) {
        const a = new THREE.Vector3(ax, ay, az), b = new THREE.Vector3(bx, by, bz);
        const len = a.distanceTo(b);
        const g = new THREE.CylinderGeometry(w * E.U, w * E.U, len, 6);
        g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(UPV, b.clone().sub(a).normalize()));
        const mid = a.add(b).multiplyScalar(0.5);
        g.translate(mid.x, mid.y, mid.z);
        bars.push(g);
      }
      const OUTLINE = 1.5, BAR = 1.0;
      for (const z of [ZF, ZB]) {
        // the pentagon outline (floor included — the case's base rail)
        bar(-HX, 0, z, -HX, WALL_Y, z, OUTLINE);
        bar(-HX, WALL_Y, z, 0, APEX_Y, z, OUTLINE);
        bar(0, APEX_Y, z, HX, WALL_Y, z, OUTLINE);
        bar(HX, WALL_Y, z, HX, 0, z, OUTLINE);
        bar(-HX, 0, z, HX, 0, z, OUTLINE);
        // mullions, carried up the gable to the slopes
        for (const mx of MULLIONS) {
          bar(mx, 0, z, mx, WALL_Y, z, BAR);
          const gy = mx <= 0
            ? WALL_Y + (mx + HX) * (APEX_Y - WALL_Y) / HX
            : APEX_Y - mx * (APEX_Y - WALL_Y) / HX;
          bar(mx, WALL_Y, z, mx, gy, z, BAR);
        }
        // transoms — the lower yields to the door on the front face only
        bar(-HX, TRANSOMS[0], z, HX, TRANSOMS[0], z, BAR);
        if (z === ZF) {
          bar(-HX, TRANSOMS[1], z, DOOR.x0, TRANSOMS[1], z, BAR);
          bar(DOOR.x1, TRANSOMS[1], z, HX, TRANSOMS[1], z, BAR);
        } else bar(-HX, TRANSOMS[1], z, HX, TRANSOMS[1], z, BAR);
        // the gable transom, slope to slope
        bar(-GABLE_T.x, GABLE_T.y, z, GABLE_T.x, GABLE_T.y, z, BAR);
      }
      // the glazed door: a thin seam at center front (center mullion is the stile)
      bar(DOOR.x0, 0, ZF, DOOR.x0, DOOR.top, ZF, BAR);
      bar(DOOR.x1, 0, ZF, DOOR.x1, DOOR.top, ZF, BAR);
      bar(DOOR.x0, DOOR.top, ZF, DOOR.x1, DOOR.top, ZF, BAR);
      // depth members: ridge beam, eave rails, base rails
      bar(0, APEX_Y, ZB, 0, APEX_Y, ZF, OUTLINE);
      for (const mx of [-HX, HX]) {
        bar(mx, WALL_Y, ZB, mx, WALL_Y, ZF, OUTLINE);
        bar(mx, 0, ZB, mx, 0, ZF, OUTLINE);
      }
      // mergeGeoms re-wraps the index with the source geometry's attribute
      // class; in this three build that yields itemSize undefined (count NaN,
      // draws nothing) and cylinders carry stale groups. Re-wrap explicitly.
      const fixMerged = (g) => {
        g.clearGroups();
        g.setIndex(new THREE.BufferAttribute(g.getIndex().array, 1));
        return g;
      };
      const frame = new THREE.Mesh(fixMerged(E.mergeGeoms(bars)), frameMat);
      frame.castShadow = true;
      group.add(frame);

      // ---------- the panes: one transparent shell ----------
      {
        const shape = new THREE.Shape();
        shape.moveTo(-HX, 0); shape.lineTo(-HX, WALL_Y); shape.lineTo(0, APEX_Y);
        shape.lineTo(HX, WALL_Y); shape.lineTo(HX, 0); shape.closePath();
        const glass = new THREE.Mesh(
          new THREE.ExtrudeGeometry(shape, { depth: DEPTH, bevelEnabled: false }),
          new THREE.MeshBasicMaterial({
            color: 0xdfe6e2, transparent: true, opacity: 0.06,
            depthWrite: false, side: THREE.FrontSide,
          }));
        glass.position.z = ZB;
        glass.renderOrder = 2; // after the stock, before the rain
        group.add(glass);
      }

      // ---------- the stock: the clipped ball, small and kept ----------
      const SCv = new THREE.Vector3(BALL.x, BALL.y, HINGE);
      const R = BALL.r;
      const specimen = new THREE.Group();
      group.add(specimen);
      {
        // trunk: bed up into the crown
        const tp = [new THREE.Vector3(BALL.x, elev(1288), HINGE)];
        let px = BALL.x, py = elev(1288), pz = HINGE;
        for (let i = 0; i < 5; i++) {
          px += (rng() - 0.5) * 0.032; pz += (rng() - 0.5) * 0.024; py += 16 * E.U;
          tp.push(new THREE.Vector3(px, py, pz));
        }
        const trunk = new THREE.Mesh(E.taperedTube(THREE, tp, 4.5, 2.2), vineMat);
        trunk.castShadow = true;
        specimen.add(trunk);
      }
      const tangle = { branches: [], tips: [], leaves: [] };
      const OPTS = {
        curl: 1.15, spread: 0.7, decay: 0.68, lateral: 0.13,
        leafAlong: 0.12, leafScale: 0.45, segs: 5, tri: 0.25,
      };
      const crownO = new THREE.Vector3(BALL.x, CROWN_Y, HINGE);
      for (let i = 0; i < 7; i++) {
        const az = (i / 7) * Math.PI * 2 + rr3(-0.15, 0.15);
        const pol = rr3(0.5, 2.4);
        const dir = new THREE.Vector3(Math.sin(pol) * Math.cos(az), Math.cos(pol), Math.sin(pol) * Math.sin(az));
        grow3(crownO.clone().add(new THREE.Vector3(rr3(-0.045, 0.045), rr3(-0.03, 0.02), rr3(-0.03, 0.03))),
          dir, rr3(58, 92) * E.U, rr3(1.7, 2.1), 3, OPTS, tangle);
      }
      for (const pol of [0.33, 0.42]) { // two leaders for the crown (−1.9, −1.2 on paper)
        const az = rr3(0, Math.PI * 2);
        const dir = new THREE.Vector3(Math.sin(pol) * Math.cos(az), Math.cos(pol), Math.sin(pol) * Math.sin(az));
        grow3(crownO.clone().add(new THREE.Vector3(rr3(-0.025, 0.025), rr3(-0.015, 0.015), rr3(-0.015, 0.015))),
          dir, rr3(85, 115) * E.U, rr3(1.6, 2), 3,
          { ...OPTS, curl: 1.05, spread: 0.65, segs: 6 }, tangle);
      }
      const stubs = [];
      const crownGeoms = [];
      for (const b of tangle.branches) {
        const { kept, cut } = E.clipToSphere(THREE, b.pts, SCv, R);
        if (kept.length > 1) crownGeoms.push(E.taperedTube(THREE, kept, b.w, b.w * 0.55));
        if (cut) stubs.push({ ...cut, w: b.w });
      }
      if (crownGeoms.length) {
        const crown = new THREE.Mesh(fixMerged(E.mergeGeoms(crownGeoms)), vineMat);
        crown.castShadow = true;
        specimen.add(crown);
      }
      // stub nubs on the little shear surface
      if (stubs.length) {
        const stubGeo = new THREE.CylinderGeometry(1, 0.8, 0.02, 8);
        const stubMat = new THREE.MeshStandardMaterial({ color: E.PAPER, roughness: 0.9 });
        const stubMesh = new THREE.InstancedMesh(stubGeo, stubMat, stubs.length);
        const d3 = new THREE.Object3D();
        stubs.forEach((s, i) => {
          d3.position.copy(s.p).addScaledVector(s.d, 0.008);
          d3.quaternion.setFromUnitVectors(UPV, s.d);
          d3.scale.setScalar(Math.min(3.4, Math.max(1.8, s.w * 0.55)) * E.U);
          d3.updateMatrix();
          stubMesh.setMatrixAt(i, d3.matrix);
        });
        specimen.add(stubMesh);
      }
      // interior leaves, plus the tipped ones — only what lies inside the shear
      const tangleLeafData = [];
      tangle.leaves.forEach((l, i) => {
        if (l.p.distanceTo(SCv) > R - 4 * E.U) return;
        tangleLeafData.push({
          rest: l.p, dir: l.d,
          tiltAxis: new THREE.Vector3(l.d.y, -l.d.x, 0).normalize(),
          tilt: 0.6 + 0.7 * E.h1(i * 3 + 2), phase: E.h1(i * 5 + 1) * Math.PI * 2,
          scale: l.s * 12.5 * E.U,
        });
      });
      tangle.tips.forEach((tp2, i) => {
        if (tp2.p.distanceTo(SCv) > R - 2 * E.U || rng() >= 0.5) return;
        tangleLeafData.push({
          rest: tp2.p.clone(), dir: tp2.d.clone(),
          tiltAxis: new THREE.Vector3(tp2.d.y, -tp2.d.x, 0).normalize(),
          tilt: 0.6 + 0.7 * E.h1(i * 3 + 41), phase: E.h1(i * 5 + 17) * Math.PI * 2,
          scale: rr3(0.4, 0.55) * 12.5 * E.U,
        });
      });
      const tangleLeafMesh = new THREE.InstancedMesh(leafGeo, leafMat, Math.max(1, tangleLeafData.length));
      tangleLeafMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      specimen.add(tangleLeafMesh);
      // the clipped surface — 300 leaflets on the shear, the engraving's wobble
      // the clipped surface — leaflets on the shear, the engraving's wobble.
      // The paper packs 300 into the disc's projection; a sphere needs ~4×
      // that for the same dark read (half the skin always faces away)
      const SKIN_N = 1400;
      const skinData = [];
      for (let i = 0; i < SKIN_N; i++) {
        const z = rr3(-1, 1), az = rr3(0, Math.PI * 2);
        const rr_ = Math.sqrt(1 - z * z);
        const u = new THREE.Vector3(rr_ * Math.cos(az), z, rr_ * Math.sin(az));
        const wob = 1 + 0.02 * Math.sin(3 * az + 1.7) + 0.01 * Math.sin(7 * az + 0.4);
        const rad = R * rr3(0.93, 1.0) * wob;
        const tangent = new THREE.Vector3(rr3(-1, 1), rr3(-1, 1), rr3(-1, 1)).cross(u).normalize()
          .applyAxisAngle(u, rr3(0, Math.PI * 2));
        skinData.push({
          rest: SCv.clone().addScaledVector(u, rad),
          dir: tangent,
          tiltAxis: new THREE.Vector3().crossVectors(tangent, u).normalize(),
          tilt: 0.18 + 0.25 * E.h1(i * 7 + 2), phase: E.h1(i * 5 + 3) * Math.PI * 2,
          scale: rr3(0.5, 0.68) * 12.5 * E.U,
        });
      }
      const skinMesh = new THREE.InstancedMesh(leafGeo, leafMat, skinData.length);
      skinMesh.castShadow = true;
      skinMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      specimen.add(skinMesh);
      {
        const c = new THREE.Color();
        [tangleLeafMesh, skinMesh].forEach((mesh, mi) => {
          for (let i = 0; i < mesh.count; i++) {
            c.setHex(E.INK).multiplyScalar(0.75 + 0.25 * E.h1(i * 11 + mi));
            mesh.setColorAt(i, c);
          }
        });
      }

      // ---------- the rain: the resident, outside the glass only ----------
      // face-local frames; every dash slides along the slant and wraps inside
      // its rectangle — closed form in t, no accumulation
      const mkFace = (O, u, v, ext) => ({ O, u, v, ext });
      const slopeL = new THREE.Vector3(HX, APEX_Y - WALL_Y, 0).normalize();
      const slopeR = new THREE.Vector3(-HX, APEX_Y - WALL_Y, 0).normalize();
      const normL = new THREE.Vector3(-(APEX_Y - WALL_Y), HX, 0).normalize();
      const normR = new THREE.Vector3(APEX_Y - WALL_Y, HX, 0).normalize();
      const XA = HX - 0.04, YA = WALL_Y - 0.04, ZA0 = ZB + 0.05, ZA1 = ZF - 0.05;
      const FACES = [
        // front and back walls (the gable's small panes stay dry-marked: the
        // wall rectangle carries the front's weather)
        { f: mkFace(new THREE.Vector3(0, 0, ZF + 0.006), new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 1, 0), [-XA, XA, 0.04, YA]), n: 12, slant: SLANT },
        { f: mkFace(new THREE.Vector3(0, 0, ZB - 0.006), new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 1, 0), [-XA, XA, 0.04, YA]), n: 7, slant: SLANT },
        // side walls
        { f: mkFace(new THREE.Vector3(-HX - 0.006, 0, 0), new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 1, 0), [ZA0, ZA1, 0.04, YA]), n: 7, slant: SLANT },
        { f: mkFace(new THREE.Vector3(HX + 0.006, 0, 0), new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 1, 0), [ZA0, ZA1, 0.04, YA]), n: 7, slant: SLANT },
        // roof slopes: the run is down-slope, the slant leans along the ridge
        { f: mkFace(new THREE.Vector3(-HX, WALL_Y, 0).addScaledVector(normL, 0.006), new THREE.Vector3(0, 0, 1), slopeL, [ZA0, ZA1, 0.03, 1.21]), n: 4, slant: { u: 0.28, v: 0.9455 } },
        { f: mkFace(new THREE.Vector3(HX, WALL_Y, 0).addScaledVector(normR, 0.006), new THREE.Vector3(0, 0, 1), slopeR, [ZA0, ZA1, 0.03, 1.21]), n: 4, slant: { u: 0.28, v: 0.9455 } },
      ];
      const travel = (ua, va, ext, du, dv) => {
        let T = Infinity;
        if (du > 1e-9) T = Math.min(T, (ext[1] - ua) / du);
        else if (du < -1e-9) T = Math.min(T, (ext[0] - ua) / du);
        if (dv > 1e-9) T = Math.min(T, (ext[3] - va) / dv);
        else if (dv < -1e-9) T = Math.min(T, (ext[2] - va) / dv);
        return T;
      };
      const rainDashes = [];
      for (const { f, n, slant } of FACES) {
        const du = slant.u, dv = -slant.v; // v points up the face; rain runs down
        const fall3 = f.u.clone().multiplyScalar(du).addScaledVector(f.v, dv).normalize();
        const q = new THREE.Quaternion().setFromUnitVectors(UPV, fall3.clone().negate());
        for (let k = 0; k < n; k++) {
          const len = rr3(30, 58) * E.U;
          let ua = 0, va = 0, T = 0;
          for (let tries = 0; tries < 40; tries++) {
            ua = rr3(f.ext[0], f.ext[1]); va = rr3(f.ext[2], f.ext[3]);
            T = travel(ua, va, f.ext, du, dv);
            if (T > len + 0.06) break;
          }
          rainDashes.push({ face: f, ua, va, du, dv, T, q, len,
            speed: rr3(0.5, 0.95), phase: rng() });
        }
      }
      // a few drops past the house, landing on the paper
      for (let k = 0; k < 7; k++) {
        let x0, z0;
        if (rng() < 0.5) { x0 = rr3(-2.3, 2.3); z0 = rr3(ZF + 0.25, 3.8); }
        else { x0 = (rng() < 0.5 ? -1 : 1) * rr3(HX + 0.25, 2.3); z0 = rr3(0.6, ZF); }
        const y0 = rr3(1.5, 3.2);
        rainDashes.push({
          air: true, x0, y0, z0, T: y0 / SLANT.v,
          q: new THREE.Quaternion().setFromUnitVectors(UPV,
            new THREE.Vector3(-SLANT.u, SLANT.v, 0)),
          len: rr3(30, 58) * E.U, speed: rr3(0.55, 1.0), phase: rng(),
        });
      }
      const dashGeo = new THREE.BoxGeometry(0.009, 1, 0.009);
      dashGeo.translate(0, 0.5, 0); // trails behind the running front point
      const rainMat = new THREE.MeshBasicMaterial({
        color: 0xbfc9c4, transparent: true, opacity: 0.5, depthWrite: false,
      });
      const rainMesh = new THREE.InstancedMesh(dashGeo, rainMat, rainDashes.length);
      rainMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      rainMesh.renderOrder = 3; // in front of the glass it runs down
      {
        const c = new THREE.Color();
        for (let i = 0; i < rainDashes.length; i++) {
          c.setHex(0xffffff).multiplyScalar(0.55 + 0.45 * E.h1(i * 13 + 5));
          rainMesh.setColorAt(i, c);
        }
      }
      group.add(rainMesh);

      // ---------- per-frame: the crown is inert; only rain and leaf-flutter ----------
      const dummy = new THREE.Object3D();
      function placeRain(tt) {
        for (let i = 0; i < rainDashes.length; i++) {
          const d = rainDashes[i];
          const s = (tt * d.speed + d.phase * d.T) % d.T;
          if (d.air) dummy.position.set(d.x0 + SLANT.u * s, d.y0 - SLANT.v * s, d.z0);
          else dummy.position.copy(d.face.O)
            .addScaledVector(d.face.u, d.ua + d.du * s)
            .addScaledVector(d.face.v, d.va + d.dv * s);
          dummy.quaternion.copy(d.q);
          dummy.scale.set(1, d.len, 1);
          dummy.updateMatrix();
          rainMesh.setMatrixAt(i, dummy.matrix);
        }
        rainMesh.instanceMatrix.needsUpdate = true;
      }
      function placeLeaves(tt, still) {
        for (let i = 0; i < tangleLeafData.length; i++) place(tangleLeafMesh, i, tangleLeafData[i], tt, still, null, null);
        tangleLeafMesh.instanceMatrix.needsUpdate = true;
        for (let i = 0; i < skinData.length; i++) place(skinMesh, i, skinData[i], tt, still, null, null);
        skinMesh.instanceMatrix.needsUpdate = true;
      }
      let placedStatic = false;
      function update(t, reduced, active) {
        if (reduced || !active) { // cheap: hang the weather still, once
          if (!placedStatic) { placeRain(0); placeLeaves(0, true); placedStatic = true; }
          return;
        }
        placedStatic = false;
        placeRain(t);
        placeLeaves(t, false);
      }

      return {
        group, update,
        labels: {
          a: { pos: new THREE.Vector3(BALL.x - 0.28, BALL.y + 0.1, ZF + 0.12), name: "the stock",
               note: "the same clipping, kept under glass: it rises from the bed, sheared to its little sphere, and it does not leave. the tangle goes on inside the skin." },
          b: { pos: new THREE.Vector3(0.62, 1.12, ZF + 0.1), name: "the pane",
               note: "weather on one side, none on the other. put your eye along the wall: the section in the drawing is a pane you can touch now." },
          c: { pos: new THREE.Vector3(1.95, 1.35, 2.75), name: "the rain",
               note: "one weather system for the whole plate. every drop stops at the glass; a few fall past the house and land on the paper. it has never rained here." },
          d: { pos: new THREE.Vector3(HX + 0.06, WALL_Y + 0.05, ZF), name: "the frame",
               note: "joinery, not growth — ruled, machine-true, constant weight. the house is the one thing here that was made, never grown." },
          e: { pos: new THREE.Vector3(0.6, 0.06, sz(1288)), name: "the surface",
               note: "the deployment boundary, moved indoors: a shallow bed flanking the path, pressed on the paper. nothing marks the soil outdoors — the surface is inside only." },
        },
        views: {
          home: { az: -16, el: 20, dist: 7.6, tg: [0, 1.1, 1.5] },
          a: { az: -12, el: 12, dist: 4.4, tg: [BALL.x, BALL.y, 1.5] },
          b: { az: 40, el: 12, dist: 4.6, tg: [0.45, 1.1, 1.7] },
          c: { az: -26, el: 10, dist: 4.4, tg: [0.9, 0.85, 1.9] },
          d: { az: 22, el: 9, dist: 3.8, tg: [0.85, 1.55, 1.95] },
          e: { az: -8, el: 44, dist: 4.6, tg: [0, 0.35, 1.45] },
        },
      };
    },
  };
})());
