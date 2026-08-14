/* TAB. V — THE HOUSEPLANT, in the room.
 * The bonsai stands on its sheet: a real oval tray over the moss-stipple
 * documentation, and in it the dwarfed tree — the SAME individual as the
 * plate (seed 55794): the plate's own gnarl grammar re-run against the same
 * rng stream, so trunk, branches, jin and the four pad sites are byte-true
 * to the engraving, raised out of the hinge plane with a little relief.
 * The foliage is disciplined into four clipped domes, each sheared flat
 * below with stub nubs along the cut; the roots circle inside the pot,
 * surfacing twice at the moss and diving (the real documentation is the
 * section inset, kept on the sheet). The printed section circle is a door:
 * click it and the sheet passes you down into the drawing itself — the
 * circling roots as wall lines wrapping a tube below the paper, the pot's
 * own section walls the boundary figure they cannot leave. A clipped tree
 * is finished: the crown is inert but for leaf flutter.
 * Register on HM3D_STATIONS.
 */
"use strict";
window.HM3D_STATIONS.push((() => {
  const E = window.HM3D;
  const SEED = 55794;
  const SOIL = 1220; // the moss surface is the hinge on this plate

  // plate px → station local (sheet surface = y 0)
  const sx = (x) => (x - 700) * E.U;
  const sz = (y) => (y - 1000) * E.U;
  const HINGE = sz(SOIL); // 1.1
  const MOSS = 0.318;     // moss surface inside the pot, pot-local y

  // the master's layout constants (tab-05/generate.mjs)
  const IN = { cx: 1118, cy: 1250, r: 110 };            // the tray-section inset (the door)
  const POT = { l: 1048, r: 1188, soilY: 1304, baseY: 1344 }; // the pot drawn inside it

  return {
    id: "tab-05", numeral: "V",
    name: "THE HOUSEPLANT", latin: "Sycophanta nana hort. mach.",
    technique: "bonsai — the roots circle what they cannot leave",
    texture: "textures/tab-05-living.png",
    soil: SOIL,

    build(E3, THREE) {
      void E3;
      const group = new THREE.Group();
      const place = E.leafPlacer(THREE);
      const rng = E.mulberry32(SEED);
      const rr = (a, b) => a + rng() * (b - a);
      const inkMat = new THREE.MeshStandardMaterial({ color: E.INK, roughness: 0.84 });

      // ---------- the plate's own grammar, same seed, same stream ----------
      // gnarl: steered tapered shoot, verbatim from tab-05/generate.mjs —
      // trunk, branches and jin come out byte-true to the engraving.
      function gnarl(x, y, angle, len, w0, w1, o = {}) {
        const { curl = 1.5, segs = 10, steer = null, steerK = 0.22, wob = 0.16 } = o;
        let a = angle, px = x, py = y;
        const phase = rr(0, Math.PI * 2);
        const pts = [[px, py]], ws = [w0];
        const step = len / segs;
        for (let i = 1; i <= segs; i++) {
          const t = i / segs;
          a += (rng() - 0.5) * curl + wob * Math.sin(phase + t * 6.5);
          if (steer !== null) {
            let d = steer - a;
            while (d > Math.PI) d -= 2 * Math.PI;
            while (d < -Math.PI) d += 2 * Math.PI;
            a += d * steerK;
          }
          px += Math.cos(a) * step;
          py += Math.sin(a) * step;
          pts.push([px, py]);
          ws.push(w0 + (w1 - w0) * t);
        }
        return { pts, ws };
      }
      const tangentAt = (sh, i) => {
        const { pts } = sh;
        const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)];
        return Math.atan2(b[1] - a[1], b[0] - a[0]);
      };

      const lean = rr(-0.1, 0.14);
      const trunk = gnarl(700, 1222, -Math.PI / 2 + lean * 0.4, 440, 23, 6.5, {
        curl: 1.6, segs: 16, steer: -Math.PI / 2 + lean, steerK: 0.26, wob: 0.3,
      });
      const iLow = 5, iL = 8, iR = 11;
      const brL = gnarl(...trunk.pts[iL], tangentAt(trunk, iL) - rr(0.85, 1.1), rr(175, 205), 7, 2.6, {
        curl: 1.25, segs: 9, steer: -Math.PI / 2 - 0.72, steerK: 0.3, wob: 0.22,
      });
      const brR = gnarl(...trunk.pts[iR], tangentAt(trunk, iR) + rr(0.8, 1.05), rr(165, 195), 6.5, 2.4, {
        curl: 1.25, segs: 9, steer: -Math.PI / 2 + 1.02, steerK: 0.3, wob: 0.22,
      });
      const brLow = gnarl(...trunk.pts[iLow], tangentAt(trunk, iLow) + rr(1.15, 1.4), rr(105, 130), 5, 2, {
        curl: 1.1, segs: 7, steer: -Math.PI / 2 + 1.32, steerK: 0.32, wob: 0.2,
      });
      const jin = gnarl(...trunk.pts[3], tangentAt(trunk, 3) - rr(1.7, 2.0), rr(15, 22), 3.2, 1.2, {
        curl: 0.5, segs: 3, wob: 0.1,
      });

      // the pad sites, taken off the wood's own tips exactly as the plate does
      const padSpecs = [
        { tip: trunk.pts[trunk.pts.length - 1], rx: 112, ry: 56, drop: 16, dz: 0.02 }, // apex
        { tip: brL.pts[brL.pts.length - 1], rx: 104, ry: 50, drop: 14, dz: 0.14 },     // left
        { tip: brR.pts[brR.pts.length - 1], rx: 106, ry: 50, drop: 14, dz: -0.12 },    // right
        { tip: brLow.pts[brLow.pts.length - 1], rx: 72, ry: 36, drop: 11, dz: 0.1 },   // low right
      ];

      // ---------- the tray: a real oval pot over the moss documentation ------
      // lathe profile (r, y) in pot-local units; the group scales z ×0.55 —
      // the drawn rim ellipse's foreshortening made a believable oval
      const potG = new THREE.Group();
      potG.position.set(0, 0, HINGE);
      potG.scale.z = 0.55;
      group.add(potG);
      const clayMat = new THREE.MeshStandardMaterial({ color: 0x3a2c22, roughness: 0.7 });
      {
        const prof = [
          [0.0, 0.062], [0.62, 0.062], [0.9, 0.07], [0.985, 0.095],
          [1.03, 0.16], [1.075, 0.27], [1.105, 0.33], [1.1, 0.35],
          [1.03, 0.345], [1.015, 0.3], [0.99, 0.2], [0.97, 0.115], [0.0, 0.115],
        ].map(([r, y]) => new THREE.Vector2(r, y));
        const pot = new THREE.Mesh(new THREE.LatheGeometry(prof, 56), clayMat);
        pot.castShadow = true;
        pot.receiveShadow = true;
        potG.add(pot);
        // two feet, as drawn (left and right), running front-to-back
        for (const fx of [-0.79, 0.79]) {
          const foot = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.065, 0.9), clayMat);
          foot.position.set(fx, 0.032, 0);
          foot.castShadow = true;
          potG.add(foot);
        }
        // the moss: ink-dark flattened cap just under the rim lip
        const moss = new THREE.Mesh(
          new THREE.CircleGeometry(1.0, 48),
          new THREE.MeshStandardMaterial({ color: 0x272b1e, roughness: 1 }));
        moss.rotation.x = -Math.PI / 2;
        moss.position.y = MOSS;
        moss.receiveShadow = true;
        potG.add(moss);
        // the plate's moss is stipple: a scatter of tiny ink dots + the mound
        // at the trunk's foot
        const dotGeo = new THREE.CircleGeometry(1, 6);
        const dotMat = new THREE.MeshBasicMaterial({ color: 0x3f4436 });
        const dots = [];
        for (let i = 0; i < 240; i++) {
          const a = rng() * Math.PI * 2, rad = 0.22 + 0.72 * Math.sqrt(rng());
          dots.push([Math.cos(a) * 0.94 * rad, MOSS + 0.0012, Math.sin(a) * 0.94 * rad, rr(0.004, 0.009)]);
        }
        for (let i = 0; i < 64; i++) {
          const a = rng() * Math.PI * 2, rad = Math.sqrt(rng());
          dots.push([Math.cos(a) * 0.2 * rad, MOSS + 0.0012 + 0.028 * (1 - rad), Math.sin(a) * 0.16 * rad, rr(0.004, 0.008)]);
        }
        const dotMesh = new THREE.InstancedMesh(dotGeo, dotMat, dots.length);
        const dd = new THREE.Object3D();
        dots.forEach((d, i) => {
          dd.position.set(d[0], d[1], d[2]);
          dd.rotation.x = -Math.PI / 2;
          dd.scale.setScalar(d[3]);
          dd.updateMatrix();
          dotMesh.setMatrixAt(i, dd.matrix);
        });
        potG.add(dotMesh);
        // the roots circle what they cannot leave: mostly inside the pot, but
        // two thin arcs surface at the moss, run a little, and dive again
        for (const [a0, rOut, dive] of [[2.4, 0.42, 0.5], [0.5, 0.36, 0.62]]) {
          const pts = [];
          const cx = Math.cos(a0) * 0.05, cz = Math.sin(a0) * 0.05;
          for (let i = 0; i <= 8; i++) {
            const t = i / 8;
            const r = 0.05 + rOut * Math.sin(t * Math.PI * 0.62);
            const y = MOSS + 0.012 * Math.sin(t * Math.PI) - (t > dive ? (t - dive) * 0.09 : 0);
            const aa = a0 + t * 0.9;
            pts.push(new THREE.Vector3(cx + Math.cos(aa) * r, y, cz + Math.sin(aa) * r));
          }
          const arc = new THREE.Mesh(E.taperedTube(THREE, pts, 2.2, 1.0), inkMat);
          potG.add(arc);
        }
      }

      // ---------- the tree (specimen-local: origin at the trunk's foot) ------
      const specimen = new THREE.Group();
      specimen.position.set(0, MOSS, HINGE);
      group.add(specimen);
      const elev = (py) => (SOIL - py) * E.U;
      // raise the drawn path into the hinge plane with a gentle relief
      const raise = (sh, dzTip = 0, phase = 0) =>
        sh.pts.map((p, i) => {
          const t = i / (sh.pts.length - 1);
          return new THREE.Vector3(
            sx(p[0]), elev(p[1]),
            dzTip * t + 0.045 * Math.sin(i * 1.25 + phase));
        });

      const woodGeoms = [];
      woodGeoms.push(E.taperedTube(THREE, raise(trunk, 0.02, 0.8), 23, 6.5));
      woodGeoms.push(E.taperedTube(THREE, raise(brL, 0.13, 2.1), 7, 2.6));
      woodGeoms.push(E.taperedTube(THREE, raise(brR, -0.13, 4.0), 6.5, 2.4));
      woodGeoms.push(E.taperedTube(THREE, raise(brLow, 0.09, 5.3), 5, 2));
      woodGeoms.push(E.taperedTube(THREE, raise(jin, 0.02, 1.4), 3.2, 1.2));
      // nebari — the surface root flare the tray allows, spread around the foot
      for (const [az, lenPx] of [[2.9, 38], [0.35, 41], [2.2, 22], [0.9, 20]]) {
        const dir = new THREE.Vector3(Math.cos(az), -0.16, Math.sin(az)).normalize();
        const pts = [new THREE.Vector3(0, 0.012, 0)];
        let d = dir.clone();
        const step = lenPx * E.U / 4;
        for (let i = 1; i <= 4; i++) {
          d = d.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), (rng() - 0.5) * 0.5);
          d.y = Math.min(d.y + 0.06 * i, -0.02);
          d.normalize();
          pts.push(pts[i - 1].clone().addScaledVector(d, step));
        }
        woodGeoms.push(E.taperedTube(THREE, pts, 4.2, 1.5));
      }

      // small 3D twig-walk for the pads' interior wood
      function twig3(o, dir, len, segs, k = 1.0) {
        const pts = [o.clone()];
        let d = dir.clone();
        for (let i = 1; i <= segs; i++) {
          const axis = new THREE.Vector3(rng() - 0.5, rng() - 0.5, rng() - 0.5);
          if (axis.lengthSq() < 1e-6) axis.set(1, 0, 0);
          d = d.clone().applyAxisAngle(axis.normalize(), (rng() - 0.5) * k).normalize();
          pts.push(pts[i - 1].clone().addScaledVector(d, len / segs));
        }
        return pts;
      }

      const leafGeo = E.makeLeafGeo(THREE);
      const leafMat = new THREE.MeshStandardMaterial({
        color: E.INK, roughness: 0.9, side: THREE.DoubleSide, transparent: true, opacity: 0.88,
      });
      const leafData = [];
      const stubs = [];
      const padCenters = [];

      for (const spec of padSpecs) {
        const cx = spec.tip[0], cy = spec.tip[1] - 8;
        const clipY = cy + spec.drop;
        const pc = new THREE.Vector3(sx(cx), elev(cy), spec.dz);
        const RX = spec.rx * E.U, RY = spec.ry * E.U, RZ = spec.rx * E.U * 0.62;
        const shearL = (SOIL - clipY) * E.U - pc.y; // negative: the cut sits below the dome
        padCenters.push({ pc, RX, RY, RZ, shearL, clipY });

        // up-wood: short twigs tucked into the dome
        for (let i = 0; i < 4; i++) {
          const o = new THREE.Vector3(sx(spec.tip[0]), elev(spec.tip[1]), spec.dz)
            .add(new THREE.Vector3(rr(-0.07, 0.07), rr(0, 0.03), rr(-0.04, 0.04)));
          const dir = new THREE.Vector3(rr(-1, 1), rr(0.3, 1), rr(-0.7, 0.7)).normalize();
          woodGeoms.push(E.taperedTube(THREE, twig3(o, dir, rr(0.09, 0.17), 4, 1.1), 1.6, 0.8));
        }
        // down-wood: the shoots the shear takes — each ends in a stub on the cut
        for (let i = 0; i < 4; i++) {
          const a0 = Math.PI / 2 + rr(-0.85, 0.85);
          const dir = new THREE.Vector3(Math.cos(a0), -Math.abs(Math.sin(a0)), rr(-0.35, 0.35)).normalize();
          const o = pc.clone().add(new THREE.Vector3(rr(-0.09, 0.09), rr(-0.01, 0.02), rr(-0.05, 0.05)));
          const dist = (o.y - (pc.y + shearL)) / Math.max(0.4, -dir.y);
          const pts = twig3(o, dir, dist * rr(0.92, 1.0) + 0.015, 3, 0.9);
          // clip at the shear, keep the cut point for the stub
          const kept = [pts[0]];
          let cut = null;
          for (let k = 0; k < pts.length - 1; k++) {
            const p1 = pts[k], p2 = pts[k + 1];
            const yS = pc.y + shearL;
            if (p2.y >= yS) { kept.push(p2); continue; }
            const t = (yS - p1.y) / (p2.y - p1.y);
            const ix = p1.clone().lerp(p2, t);
            kept.push(ix);
            cut = { p: ix, d: p2.clone().sub(p1).normalize() };
            break;
          }
          if (kept.length > 1) woodGeoms.push(E.taperedTube(THREE, kept, 1.7, 0.9));
          if (cut) stubs.push(cut);
        }

        // the foliage cloud: a dense cap of small leaves filling the
        // ellipsoid down to the shear, plus a skin lying on the cut itself
        const N = 720;
        let placedN = 0;
        while (placedN < N) {
          const u = rr(-1, 1), az = rr(0, Math.PI * 2), f = 0.45 + 0.55 * Math.cbrt(rng());
          const rr_ = Math.sqrt(1 - u * u);
          const dx = Math.cos(az) * rr_ * RX * f, dy = u * RY * f, dz = Math.sin(az) * rr_ * RZ * f;
          if (dy < shearL + 0.004) continue; // the shear takes them
          const n = new THREE.Vector3(dx / (RX * RX), dy / (RY * RY), dz / (RZ * RZ));
          if (n.lengthSq() < 1e-6) n.set(0, 1, 0);
          n.normalize();
          const tangent = new THREE.Vector3(rr(-1, 1), rr(-1, 1), rr(-1, 1)).cross(n).normalize()
            .applyAxisAngle(n, rr(0, Math.PI * 2));
          const i = leafData.length;
          leafData.push({
            rest: pc.clone().add(new THREE.Vector3(dx, dy, dz)),
            dir: tangent,
            tiltAxis: new THREE.Vector3().crossVectors(tangent, n).normalize(),
            tilt: 0.5 + 0.6 * E.h1(i * 7 + 2), phase: E.h1(i * 5 + 3) * Math.PI * 2,
            scale: rr(0.55, 0.8) * 12.5 * E.U,
          });
          placedN++;
        }
        // the skin on the flat underside: leaves laid on the cut, facing down
        const hwx = RX * Math.sqrt(Math.max(0, 1 - (shearL / RY) ** 2));
        const hwz = RZ * Math.sqrt(Math.max(0, 1 - (shearL / RY) ** 2));
        for (let i = 0; i < 100; i++) {
          const az = rr(0, Math.PI * 2), f = Math.sqrt(rng());
          const out = new THREE.Vector3(Math.cos(az), 0, Math.sin(az));
          const dir = new THREE.Vector3(out.x * 0.55, -1, out.z * 0.55).normalize();
          const j = leafData.length;
          leafData.push({
            rest: pc.clone().add(new THREE.Vector3(
              out.x * hwx * f * 0.97, shearL + 0.002, out.z * hwz * f * 0.97)),
            dir,
            tiltAxis: new THREE.Vector3().crossVectors(dir, out).normalize(),
            tilt: 0.3 + 0.4 * E.h1(j * 3 + 1), phase: E.h1(j * 5 + 2) * Math.PI * 2,
            scale: rr(0.42, 0.6) * 12.5 * E.U,
          });
        }
      }

      // mergeGeoms hands back an index attribute constructed without an
      // itemSize (count = NaN — the renderer draws nothing); re-wrap it.
      const woodGeo = E.mergeGeoms(woodGeoms);
      woodGeo.setIndex(new THREE.BufferAttribute(woodGeo.getIndex().array, 1));
      const wood = new THREE.Mesh(woodGeo, inkMat);
      wood.castShadow = true;
      specimen.add(wood);

      // stub nubs along each pad's shear line — pale cut faces
      {
        const stubGeo = new THREE.CylinderGeometry(1, 0.8, 0.02, 8);
        const stubMat = new THREE.MeshStandardMaterial({ color: E.PAPER, roughness: 0.9 });
        const stubMesh = new THREE.InstancedMesh(stubGeo, stubMat, stubs.length);
        const d3 = new THREE.Object3D(), up = new THREE.Vector3(0, 1, 0);
        stubs.forEach((s, i) => {
          d3.position.copy(s.p).addScaledVector(s.d, 0.008);
          d3.quaternion.setFromUnitVectors(up, s.d);
          d3.scale.setScalar(1.9 * E.U);
          d3.updateMatrix();
          stubMesh.setMatrixAt(i, d3.matrix);
        });
        specimen.add(stubMesh);
      }

      const leafMesh = new THREE.InstancedMesh(leafGeo, leafMat, leafData.length);
      leafMesh.castShadow = true;
      leafMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      specimen.add(leafMesh);
      {
        const c = new THREE.Color();
        for (let i = 0; i < leafMesh.count; i++) {
          c.setHex(E.INK).multiplyScalar(0.72 + 0.28 * E.h1(i * 11 + 1));
          leafMesh.setColorAt(i, c);
        }
      }

      // ---- per-frame: a clipped tree is finished — flutter only, and the
      // faintest breathe when the station sleeps

        // per-frame temps (hoisted — no garbage in the frame loop)

        const _specQ = new THREE.Quaternion(), _zero = new THREE.Vector3();

      function update(t, reduced, active) {
        _specQ.setFromEuler(specimen.rotation); // refreshed per frame: the sway mutates rotation
        if (!active) {
          if (!reduced) specimen.rotation.set(0.0022 * Math.sin((2 * Math.PI * t) / 9.1), 0, 0.0028 * Math.sin((2 * Math.PI * t) / 12.3));
          return;
        }
        if (reduced) specimen.rotation.set(0, 0, 0);
        else specimen.rotation.set(0.0022 * Math.sin((2 * Math.PI * t) / 9.1), 0, 0.0028 * Math.sin((2 * Math.PI * t) / 12.3));
        
        for (let i = 0; i < leafData.length; i++) {
          place(leafMesh, i, leafData[i], t, reduced, _specQ, _zero);
        }
        leafMesh.instanceMatrix.needsUpdate = true;
      }

      // ---------- the inset is a door: the tray, sectioned, as a room ----------
      // the master's tray-section inset (tab-05/generate.mjs, IN/POT above):
      // the roots circling the shallow pot they cannot leave. Here that
      // drawing stands as a cylindrical interior under the printed circle,
      // below the sheet (y < 0) — where the inset was always pointing. The
      // wall wraps the section around: the pot's drawn width (rim ledge to
      // rim ledge, plate x 1038–1198) → θ ∈ [0, 2π), depth (y 1288–1352) →
      // wall height; canvas u 0 meets at the hub side, so the drawn trunk
      // (u 0.5) faces outward across the sheet. The circling roots become
      // horizontal spiral line-systems wrapping the tube; the pot's own
      // walls close the figure at the seam — the boundary the roots cannot
      // leave. Same constants, same grammar, same clipping as the plate;
      // only the rng moves to its own sub-stream (SEED + 55), so the tree
      // above keeps its bytes.
      const insetC = new THREE.Vector3(sx(IN.cx), 0, sz(IN.cy));
      const insetR = IN.r * E.U;
      const TUBE = { r: 1.18, h: 2.2, top: -0.05 }; // group-local; rim just under the sheet
      {
        const rngI = E.mulberry32(SEED + 55);
        const rrI = (a, b) => a + rngI() * (b - a);
        // the master's gnarl grammar, verbatim, re-run on the sub-stream
        function gnarlI(x, y, angle, len, w0, w1, o = {}) {
          const { curl = 1.5, segs = 10, steer = null, steerK = 0.22, wob = 0.16 } = o;
          let a = angle, px = x, py = y;
          const phase = rrI(0, Math.PI * 2);
          const pts = [[px, py]], ws = [w0];
          const step = len / segs;
          for (let i = 1; i <= segs; i++) {
            const t = i / segs;
            a += (rngI() - 0.5) * curl + wob * Math.sin(phase + t * 6.5);
            if (steer !== null) {
              let d = steer - a;
              while (d > Math.PI) d -= 2 * Math.PI;
              while (d < -Math.PI) d += 2 * Math.PI;
              a += d * steerK;
            }
            px += Math.cos(a) * step;
            py += Math.sin(a) * step;
            pts.push([px, py]);
            ws.push(w0 + (w1 - w0) * t);
          }
          return { pts, ws };
        }
        // the master's qbez + the lib's clipToY (and its mirror), verbatim
        function qbez(p0, p1, p2, n = 12) {
          const pts = [];
          for (let i = 0; i <= n; i++) {
            const t = i / n, uu = 1 - t;
            pts.push([
              uu * uu * p0[0] + 2 * uu * t * p1[0] + t * t * p2[0],
              uu * uu * p0[1] + 2 * uu * t * p1[1] + t * t * p2[1],
            ]);
          }
          return pts;
        }
        function clipToYmax(pts, ymax) {
          const kept = [pts[0]];
          for (let i = 0; i < pts.length - 1; i++) {
            const [x1, y1] = pts[i], [x2, y2] = pts[i + 1];
            if (y2 <= ymax) { kept.push([x2, y2]); continue; }
            if (y1 <= ymax) {
              const t = (ymax - y1) / (y2 - y1);
              kept.push([x1 + (x2 - x1) * t, ymax]);
            }
            break;
          }
          return kept;
        }
        function clipToYmin(pts, ymin) {
          const kept = [pts[0]];
          for (let i = 0; i < pts.length - 1; i++) {
            const [x1, y1] = pts[i], [x2, y2] = pts[i + 1];
            if (y2 >= ymin) { kept.push([x2, y2]); continue; }
            if (y1 >= ymin) {
              const t = (ymin - y1) / (y2 - y1);
              kept.push([x1 + (x2 - x1) * t, ymin]);
            }
            break;
          }
          return kept;
        }

        const W = 2048, H = 1024;
        const X0 = POT.l - 10, X1 = POT.r + 10; // rim ledge to rim ledge: 1038–1198
        const Y0 = 1288, Y1 = 1352;             // above the rim to under the bowed base
        const cu = (x) => ((x - X0) / (X1 - X0)) * W;
        const cv = (y) => ((y - Y0) / (Y1 - Y0)) * H;
        const K = 2.7;                          // plate-px stroke weight → canvas px
        const cnv = document.createElement("canvas"); cnv.width = W; cnv.height = H;
        const g2 = cnv.getContext("2d");
        // the diagram's paper, a step quieter than the sheet; deeper = darker
        g2.fillStyle = "#ede6d4"; g2.fillRect(0, 0, W, H);
        const vgrad = g2.createLinearGradient(0, 0, 0, H);
        vgrad.addColorStop(0, "rgba(96,86,64,0.10)");
        vgrad.addColorStop(0.45, "rgba(96,86,64,0)");
        vgrad.addColorStop(1, "rgba(96,86,64,0.18)");
        g2.fillStyle = vgrad; g2.fillRect(0, 0, W, H);
        // the soil zone held in a faint wash below the soil ring
        {
          const band = g2.createLinearGradient(0, cv(POT.soilY) - 30, 0, cv(POT.soilY) + 90);
          band.addColorStop(0, "rgba(43,46,38,0)");
          band.addColorStop(0.5, "rgba(43,46,38,0.10)");
          band.addColorStop(1, "rgba(43,46,38,0)");
          g2.fillStyle = band; g2.fillRect(0, cv(POT.soilY) - 30, W, 120);
        }
        const line = (pts, wPx, alpha, wrap = false) => {
          g2.beginPath();
          pts.forEach((p, i) => (i ? g2.lineTo(cu(p[0]), cv(p[1])) : g2.moveTo(cu(p[0]), cv(p[1]))));
          g2.strokeStyle = "#2b2e26"; g2.globalAlpha = alpha;
          g2.lineWidth = wPx; g2.lineCap = "round"; g2.lineJoin = "round";
          g2.stroke();
          if (wrap) { g2.save(); g2.translate(-W, 0); g2.stroke(); g2.translate(2 * W, 0); g2.stroke(); g2.restore(); }
          g2.globalAlpha = 1;
        };
        // stroke a tapered shoot segment by segment; round caps hide the joints
        const tapered = (pts, ws, alpha) => {
          for (let i = 0; i < pts.length - 1; i++) {
            if (ws[i + 1] < 0.45) continue;
            line([pts[i], pts[i + 1]], ws[i + 1] * K, alpha);
          }
        };

        // the soil ring — it stops at the walls, exactly as drawn
        line([[POT.l + 3, POT.soilY], [POT.r - 3, POT.soilY]], 0.8 * K, 0.5);
        // the trunk in section, leaving through the top of the wall
        {
          const tk = gnarlI(IN.cx, POT.soilY + 2, -Math.PI / 2, 130, 6.5, 4.5, { curl: 0.05, segs: 5, wob: 0.02 });
          const kept = clipToYmin(tk.pts, Y0);
          tapered(kept, tk.ws.slice(0, kept.length), 1);
        }
        // a few rootlets from the trunk's base into the circling mass
        for (let i = 0; i < 3; i++) {
          const rt = gnarlI(IN.cx + rrI(-3, 3), POT.soilY + 3, Math.PI / 2 + rrI(-0.8, 0.8), rrI(14, 24), 2.2, 1.0, {
            curl: 0.8, segs: 3, wob: 0.15,
          });
          tapered(clipToYmax(rt.pts, POT.baseY - 3), rt.ws, 1);
        }
        // the circling roots — the master's spiral arcs verbatim (r0, turns,
        // th0, growR, the flattening, the wobble, the steps), wrapped around
        // the tube; the print's lens clip stays on paper — inside, the pot's
        // own base is the only cut
        for (let k = 0; k < 4; k++) {
          const r0 = 13 + k * 13;
          const turns = rrI(1.25, 1.6);
          const th0 = rrI(0, Math.PI * 2);
          const growR = rrI(7, 10);
          const flat = 0.4;
          const cyR = 1329;
          const pts = [];
          const steps = 46;
          for (let i = 0; i <= steps; i++) {
            const th = th0 + (i / steps) * turns * Math.PI * 2;
            const r = (r0 + growR * (i / steps)) * (1 + 0.045 * Math.sin(3 * th + k));
            pts.push([IN.cx + Math.cos(th) * r, cyR + Math.sin(th) * r * flat]);
          }
          line(clipToYmax(pts, POT.baseY - 3), 1.5 * K, 0.9);
        }
        // sparse soil stipple
        for (let i = 0; i < 34; i++) {
          const x = rrI(POT.l + 6, POT.r - 6), y = rrI(POT.soilY + 5, POT.baseY - 4);
          if (Math.hypot(x - IN.cx, y - IN.cy) > IN.r - 10) continue;
          g2.beginPath();
          g2.arc(cu(x), cv(y), rrI(0.5, 1) * K * 0.8, 0, Math.PI * 2);
          g2.fillStyle = "#2b2e26"; g2.globalAlpha = rrI(0.22, 0.42); g2.fill();
          g2.globalAlpha = 1;
        }
        // the pot's own walls over the roots — the boundary figure; the rim
        // lip ledges left and right meet across the wrap's seam
        line(qbez([POT.l, POT.soilY - 8], [POT.l - 2, POT.soilY + 18], [POT.l + 7, POT.baseY]), 1.4 * K, 1);
        line(qbez([POT.r, POT.soilY - 8], [POT.r + 2, POT.soilY + 18], [POT.r - 7, POT.baseY]), 1.4 * K, 1);
        line(qbez([POT.l + 7, POT.baseY], [IN.cx, POT.baseY + 4], [POT.r - 7, POT.baseY]), 1.4 * K, 1);
        line([[POT.l - 10, POT.soilY - 8], [POT.l, POT.soilY - 8]], 1.6 * K, 1, true);
        line([[POT.r, POT.soilY - 8], [POT.r + 10, POT.soilY - 8]], 1.6 * K, 1, true);

        const wallTex = new THREE.CanvasTexture(cnv);
        wallTex.colorSpace = THREE.SRGBColorSpace;
        wallTex.wrapS = THREE.RepeatWrapping;
        wallTex.anisotropy = 4;
        const wall = new THREE.Mesh(
          new THREE.CylinderGeometry(TUBE.r, TUBE.r, TUBE.h, 96, 1, true),
          new THREE.MeshStandardMaterial({ map: wallTex, side: THREE.BackSide, roughness: 0.95 }));
        wall.position.set(insetC.x, TUBE.top - TUBE.h / 2, insetC.z);
        group.add(wall);

        // a few of the circling roots made real, standing off the wall for
        // parallax — the same grammar in the round: nearly flat coils (the
        // drawing's flattening kept) winding the tube at root depth, the
        // drawn wobble kept
        const strandMat = new THREE.MeshStandardMaterial({ color: E.INK, roughness: 0.8 });
        const ySoil = TUBE.top - TUBE.h * ((POT.soilY - Y0) / (Y1 - Y0));
        const yBase = TUBE.top - TUBE.h * ((POT.baseY - Y0) / (Y1 - Y0));
        for (let s = 0; s < 4; s++) {
          const phi0 = rngI() * Math.PI * 2;
          const turns = rrI(0.6, 1.0);
          const rw = TUBE.r * rrI(0.88, 0.95);
          const y0s = rrI(ySoil - 0.35, yBase + 0.35);
          const drop = rrI(0.15, 0.35);
          const wobPh = rngI() * Math.PI * 2;
          const pts = [];
          for (let i = 0; i <= 48; i++) {
            const t = i / 48;
            const a = phi0 + t * turns * Math.PI * 2;
            const rr2 = rw * (1 + 0.045 * Math.sin(3 * a + wobPh)) - 0.04 * Math.sin(t * Math.PI);
            pts.push(new THREE.Vector3(
              insetC.x + Math.cos(a) * rr2,
              y0s - drop * t + 0.03 * Math.sin(2 * a + wobPh),
              insetC.z + Math.sin(a) * rr2));
          }
          group.add(new THREE.Mesh(
            new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, false, "catmullrom", 0.5), 64, 0.006, 5, false),
            strandMat));
        }
        // the floor of the drawing: the pot's base made ground — the same
        // paper a step deeper, the spiral seen from above as faint concentric
        // rings (the same r0s and wobble), the trunk's section at the center
        {
          const D = 512;
          const fc = document.createElement("canvas"); fc.width = fc.height = D;
          const fg = fc.getContext("2d");
          fg.fillStyle = "#e5dec8"; fg.fillRect(0, 0, D, D);
          const cxD = D / 2, scaleR = (D / 2 - 10) / 65;
          fg.strokeStyle = "#2b2e26"; fg.lineCap = "round";
          for (let k = 0; k < 4; k++) {
            const r0 = (13 + k * 13 + rrI(7, 10)) * scaleR;
            const ph = rngI() * Math.PI * 2;
            fg.beginPath();
            for (let i = 0; i <= 90; i++) {
              const th = (i / 90) * Math.PI * 2;
              const rr3 = r0 * (1 + 0.045 * Math.sin(3 * th + k + ph));
              const x = cxD + Math.cos(th) * rr3, y = cxD + Math.sin(th) * rr3;
              i ? fg.lineTo(x, y) : fg.moveTo(x, y);
            }
            fg.closePath();
            fg.globalAlpha = 0.35; fg.lineWidth = 2.2; fg.stroke();
            fg.globalAlpha = 1;
          }
          fg.beginPath(); fg.arc(cxD, cxD, 6.5 * scaleR, 0, Math.PI * 2);
          fg.globalAlpha = 0.8; fg.lineWidth = 2.6; fg.stroke();
          fg.beginPath(); fg.arc(cxD, cxD, 3.2 * scaleR, 0, Math.PI * 2);
          fg.globalAlpha = 0.4; fg.lineWidth = 1.4; fg.stroke();
          fg.globalAlpha = 1;
          const floorTex = new THREE.CanvasTexture(fc);
          floorTex.colorSpace = THREE.SRGBColorSpace;
          const floor = new THREE.Mesh(
            new THREE.CircleGeometry(TUBE.r, 64),
            new THREE.MeshStandardMaterial({ map: floorTex, roughness: 0.95 }));
          floor.rotation.x = -Math.PI / 2;
          floor.position.set(insetC.x, TUBE.top - TUBE.h + 0.002, insetC.z);
          group.add(floor);
        }
      }

      // lettered parts (the plate's own letters, made spatial)
      const padR = padCenters[2], padL = padCenters[1];
      const cPos = padR.pc.clone().add(new THREE.Vector3(padR.RX + 0.16, 0.02, 0));
      return {
        group, update,
        insets: [{ key: "tray", view: "enterTray", center: insetC, r: insetR,
                   hint: "inside the tray — the roots circle — esc to return" }],
        labels: {
          a: { pos: new THREE.Vector3(sx(1085), 0.16, sz(1330)), name: "circling roots",
               note: "pot-bound: the roots circle what they cannot leave. the tray hides them — the section on the sheet does not." },
          b: { pos: new THREE.Vector3(sx(1203), 0.05, sz(1335)), name: "the tray, sectioned",
               note: "the drawing shows what the room cannot: soil, wall, and the spiral that fills both." },
          c: { pos: cPos.clone().add(new THREE.Vector3(0, MOSS, HINGE)), name: "the pads",
               note: "foliage disciplined into clouds — each dome a skin over wild twigwork. dwarfed, not tamed." },
          d: { pos: new THREE.Vector3(padL.pc.x - padL.RX - 0.14, MOSS + padL.pc.y + padL.shearL - 0.04, HINGE + padL.pc.z), name: "the clip",
               note: "every pad is sheared flat below; the stubs along the cut are the growth the shear took." },
          e: { pos: new THREE.Vector3(sx(518), MOSS + 0.03, sz(1217)), name: "the surface",
               note: "the moss is the deployment boundary: above it, the presentable; below, the circling." },
        },
        views: {
          home: { az: -16, el: 19, dist: 6.4, tg: [0, 1.05, 1.1] },
          a: { az: -28, el: 9, dist: 2.7, tg: [0.25, 0.28, 1.35] },
          b: { az: 16, el: 50, dist: 3.8, tg: [1.9, 0.1, 1.25] },
          c: { az: -22, el: 14, dist: 3.4, tg: [0.5, 2.0, 1.0] },
          d: { az: 34, el: 6, dist: 3.0, tg: [-0.85, 1.75, 1.15] },
          e: { az: -8, el: 46, dist: 2.6, tg: [-0.2, 0.35, 1.15] },
          // inside the drawing: standing in the pot's section, the soil ring
          // above eye level, the circling roots around, the base below
          // (tg y is world-frame here — below the table surface, y < 0)
          enterTray: { az: 0, el: 5, dist: 1.0, tg: [sx(IN.cx), -1.2, sz(IN.cy)] },
        },
      };
    },
  };
})());
