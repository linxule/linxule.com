// Paper Generator — living paper texture for the book
// Generates a unique seamless paper tile per session from stock parameters + seed.
// Each visit gets fresh paper. Same session = same paper across pages.

(function() {
    'use strict';

    // ── Simplex Noise (2D, seeded, public domain) ──────────────────
    const F2 = 0.5 * (Math.sqrt(3) - 1);
    const G2 = (3 - Math.sqrt(3)) / 6;
    const grad3 = [[1,1],[-1,1],[1,-1],[-1,-1],[1,0],[-1,0],[0,1],[0,-1]];

    function createNoise(seed) {
        function mulberry32(a) {
            return function() {
                a |= 0; a = a + 0x6D2B79F5 | 0;
                var t = Math.imul(a ^ a >>> 15, 1 | a);
                t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
                return ((t ^ t >>> 14) >>> 0) / 4294967296;
            };
        }

        const rng = mulberry32(seed);
        const perm = new Uint8Array(512);
        const permMod8 = new Uint8Array(512);
        const p = new Uint8Array(256);
        for (let i = 0; i < 256; i++) p[i] = i;
        for (let i = 255; i > 0; i--) {
            const j = Math.floor(rng() * (i + 1));
            [p[i], p[j]] = [p[j], p[i]];
        }
        for (let i = 0; i < 512; i++) {
            perm[i] = p[i & 255];
            permMod8[i] = perm[i] % 8;
        }

        function noise2D(xin, yin) {
            let n0, n1, n2;
            const s = (xin + yin) * F2;
            const i = Math.floor(xin + s);
            const j = Math.floor(yin + s);
            const t = (i + j) * G2;
            const x0 = xin - (i - t);
            const y0 = yin - (j - t);
            let i1, j1;
            if (x0 > y0) { i1 = 1; j1 = 0; } else { i1 = 0; j1 = 1; }
            const x1 = x0 - i1 + G2, y1 = y0 - j1 + G2;
            const x2 = x0 - 1 + 2 * G2, y2 = y0 - 1 + 2 * G2;
            const ii = i & 255, jj = j & 255;

            let t0 = 0.5 - x0 * x0 - y0 * y0;
            if (t0 < 0) n0 = 0;
            else { t0 *= t0; const gi = permMod8[ii + perm[jj]]; n0 = t0 * t0 * (grad3[gi][0] * x0 + grad3[gi][1] * y0); }

            let t1 = 0.5 - x1 * x1 - y1 * y1;
            if (t1 < 0) n1 = 0;
            else { t1 *= t1; const gi = permMod8[ii + i1 + perm[jj + j1]]; n1 = t1 * t1 * (grad3[gi][0] * x1 + grad3[gi][1] * y1); }

            let t2 = 0.5 - x2 * x2 - y2 * y2;
            if (t2 < 0) n2 = 0;
            else { t2 *= t2; const gi = permMod8[ii + 1 + perm[jj + 1]]; n2 = t2 * t2 * (grad3[gi][0] * x2 + grad3[gi][1] * y2); }

            return 70 * (n0 + n1 + n2);
        }

        function fbm(x, y, octaves, lacunarity, persistence) {
            let value = 0, amplitude = 1, frequency = 1, maxValue = 0;
            for (let i = 0; i < octaves; i++) {
                value += noise2D(x * frequency, y * frequency) * amplitude;
                maxValue += amplitude;
                amplitude *= persistence;
                frequency *= lacunarity;
            }
            return value / maxValue;
        }

        return { noise2D, fbm };
    }

    function mulberry32(a) {
        return function() {
            a |= 0; a = a + 0x6D2B79F5 | 0;
            var t = Math.imul(a ^ a >>> 15, 1 | a);
            t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
            return ((t ^ t >>> 14) >>> 0) / 4294967296;
        };
    }

    function hslToRgb(h, s, l) {
        let r, g, b;
        if (s === 0) { r = g = b = l; }
        else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1; if (t > 1) t -= 1;
                if (t < 1/6) return p + (q - p) * 6 * t;
                if (t < 1/2) return q;
                if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            };
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }
        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    }

    // ── Paper Stocks ───────────────────────────────────────────────
    // Title: homepage, sparse content, paper has presence
    // Body: writing pages, dense reading, paper disappears
    // Workshop: making/concepts/thinking, moderate presence
    const STOCKS = {
        title: {
            grainScale: 0.035, grainOctaves: 4, grainIntensity: 0.07,
            fiberDensity: 0.35, fiberDirection: 10, fiberSpread: 25, fiberLength: 0.6,
            warmth: 0.65, toneVariation: 0.025, roughness: 0.035,
            opacity: 0.35
        },
        body: {
            grainScale: 0.04, grainOctaves: 4, grainIntensity: 0.03,
            fiberDensity: 0.15, fiberDirection: 15, fiberSpread: 30, fiberLength: 0.4,
            warmth: 0.5, toneVariation: 0.01, roughness: 0.015,
            opacity: 0.25
        },
        workshop: {
            grainScale: 0.05, grainOctaves: 5, grainIntensity: 0.065,
            fiberDensity: 0.4, fiberDirection: -5, fiberSpread: 35, fiberLength: 0.55,
            warmth: 0.35, toneVariation: 0.02, roughness: 0.04,
            opacity: 0.35
        }
    };

    // ── Stock Selection ────────────────────────────────────────────
    // Maps page sections to paper stocks
    function detectStock() {
        const path = window.location.pathname;
        if (path === '/') return 'title';
        if (path.startsWith('/writing/')) return 'body';
        if (path.startsWith('/making/') || path.startsWith('/concepts/') || path.startsWith('/thinking/')) return 'workshop';
        // teaching, talks, cv, search, tag pages → body (reading-like)
        return 'body';
    }

    // ── Tile Generation ────────────────────────────────────────────
    function generateTile(params, seed) {
        const size = 512;
        const noise = createNoise(seed);
        const noise2 = createNoise(seed + 7919);

        const baseH = 37 + (params.warmth - 0.5) * 10;
        const baseS = 0.10 + params.warmth * 0.08;
        const baseL = 0.94;

        const tileCanvas = document.createElement('canvas');
        tileCanvas.width = size;
        tileCanvas.height = size;
        const tileCtx = tileCanvas.getContext('2d');
        if (!tileCtx) return null;
        const imageData = tileCtx.createImageData(size, size);
        const data = imageData.data;

        // Seamless noise sampling with cross-fade blending
        function sampleNoise(x, y) {
            const nx = x / size;
            const ny = y / size;

            const largeTone = noise.fbm(nx * 3, ny * 3, 2, 2.0, 0.5) * params.toneVariation;

            const dirRad = params.fiberDirection * Math.PI / 180;
            const grainX = nx * Math.cos(dirRad) - ny * Math.sin(dirRad);
            const grainY = nx * Math.sin(dirRad) + ny * Math.cos(dirRad);
            const grain = noise.fbm(
                grainX * params.grainScale * size,
                grainY * params.grainScale * size * 0.5,
                params.grainOctaves, 2.0, 0.5
            ) * params.grainIntensity;

            const fine = noise2.noise2D(nx * size * 0.15, ny * size * 0.15) * params.roughness;

            return { largeTone, grain, fine };
        }

        const border = size * 0.25;

        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                const idx = (y * size + x) * 4;

                const wx = x < border ? x / border : (x > size - border ? (size - x) / border : 1);
                const wy = y < border ? y / border : (y > size - border ? (size - y) / border : 1);
                const sx = wx * wx * (3 - 2 * wx);
                const sy = wy * wy * (3 - 2 * wy);

                const s1 = sampleNoise(x, y);
                const s2 = sampleNoise(x + size * 0.5, y + size * 0.5);

                const blend = sx * sy;
                const largeTone = s1.largeTone * blend + s2.largeTone * (1 - blend);
                const grain = s1.grain * blend + s2.grain * (1 - blend);
                const fine = s1.fine * blend + s2.fine * (1 - blend);

                const L = baseL + largeTone + grain + fine;
                const H = baseH + largeTone * 100;

                const rgb = hslToRgb(H / 360, baseS, Math.max(0, Math.min(1, L)));
                data[idx] = rgb[0];
                data[idx + 1] = rgb[1];
                data[idx + 2] = rgb[2];
                data[idx + 3] = 255;
            }
        }

        tileCtx.putImageData(imageData, 0, 0);

        // Fiber lines
        if (params.fiberDensity > 0) {
            const fiberCount = Math.floor(params.fiberDensity * 25000);
            const rng = mulberry32(seed + 42);
            tileCtx.globalCompositeOperation = 'multiply';

            for (let i = 0; i < fiberCount; i++) {
                const fx = rng() * size;
                const fy = rng() * size;
                const angle = (params.fiberDirection + (rng() - 0.5) * params.fiberSpread * 2) * Math.PI / 180;
                const len = (2 + rng() * 6) * params.fiberLength;
                const alpha = 0.02 + rng() * 0.04;
                const fiberL = baseL - 0.05 - rng() * 0.05;
                const fiberRgb = hslToRgb(baseH / 360, baseS * 0.5, fiberL);

                tileCtx.strokeStyle = 'rgba(' + fiberRgb[0] + ',' + fiberRgb[1] + ',' + fiberRgb[2] + ',' + alpha + ')';
                tileCtx.lineWidth = 0.5 + rng() * 0.5;
                tileCtx.beginPath();
                tileCtx.moveTo(fx, fy);
                tileCtx.lineTo(fx + Math.cos(angle) * len, fy + Math.sin(angle) * len);
                tileCtx.stroke();
            }

            tileCtx.globalCompositeOperation = 'source-over';
        }

        return tileCanvas;
    }

    // ── Apply to Page ──────────────────────────────────────────────
    var previousBlobUrl = null;

    function applyPaper() {
        // Respect reduced motion — still generate paper (it's static),
        // but could skip if desired
        // if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        // Session seed: same paper throughout a session, fresh each visit
        var seed;
        try {
            seed = sessionStorage.getItem('paper-seed');
            if (!seed) {
                seed = Math.floor(Math.random() * 100000);
                sessionStorage.setItem('paper-seed', seed);
            }
            seed = parseInt(seed);
        } catch (e) {
            // Private browsing or storage disabled — unique paper each page
            seed = Math.floor(Math.random() * 100000);
        }

        var stockName = detectStock();
        var params = STOCKS[stockName];

        var tile = generateTile(params, seed);
        if (!tile) return;

        // Convert to blob URL and set as body::before background
        tile.toBlob(function(blob) {
            if (!blob) return;

            // Revoke previous blob to prevent memory leak
            if (previousBlobUrl) URL.revokeObjectURL(previousBlobUrl);
            var url = URL.createObjectURL(blob);
            previousBlobUrl = url;

            // Create or update the style that drives body::before
            let style = document.getElementById('paper-texture-style');
            if (!style) {
                style = document.createElement('style');
                style.id = 'paper-texture-style';
                document.head.appendChild(style);
            }
            style.textContent =
                'body::before {' +
                '  background-image: url("' + url + '") !important;' +
                '  background-repeat: repeat;' +
                '  opacity: ' + params.opacity + ' !important;' +
                '}';
        }, 'image/png');
    }

    // ── Init ───────────────────────────────────────────────────────
    // Run after DOM is ready but don't block rendering.
    // The flat --paper color shows first (CSS), then texture appears.
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyPaper);
    } else {
        applyPaper();
    }
})();
