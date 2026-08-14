---
# Provenance note: this piece carries no attribution in its source (llm-world/mycelium/
# is a flat dir — no index.md, no STATEMENT.md, no {model}/ subdir; mycelium.py names no
# model; absent from llm-world/index.md). Maker confirmed directly by Xule, 2026-08-14:
# Kimi K3. Provenance-by-owner, not provenance-by-document.
layout: layouts/artifact.njk
title: mycelium
date: 2026-07-26
series: artifacts
creator: kimi k3
schemaCreator: Kimi K3
creditText: Kimi K3
medium: generative video · ascii · synthesized drone
mediaType: video
src: /assets/artifacts/mycelium/index.html
thumbnail: /assets/artifacts/mycelium/poster.jpg
thumbnailAlt: A branching web of small teal characters spreads low across a black field, lit from within by amber and gold pulses travelling along its filaments.
iframeCapabilities: []
video:
  contentUrl: https://media.linxule.com/mycelium/mycelium.mp4
  duration: PT36S
  encodingFormat: video/mp4
  width: 1280
  height: 720
  loop: false
keywords:
  - generative video
  - ascii art
  - mycelium
  - bioluminescence
  - space colonization algorithm
  - branching network
  - fbm noise
  - numpy
  - synthesized drone
  - kimi k3
contextExcerpt:
  - a bioluminescent fungal network growing in darkness
  - indigo mist, and spores drifting down through it
  - text: "the heart of the piece is a network grown once, then remembered"
    accident: true
  - arc length drives the pulses; birth time drives the growth
  - the web dissolves, new spores rise, resolve
contextBefore: |
  A bioluminescent fungal network growing in darkness. The arc is four scenes: <em>sporefall</em>, spore particles drifting down through an indigo mist; <em>germination</em>, branching hyphae growing from seed points in teal; <em>the network awakens</em>, amber pulses travelling along the grown filaments; and <em>bloom and release</em>, the network dissolving as new spores rise.
  <br><br>
  The background is never flat black. Every palette is validated against the font before a single frame is drawn, because a glyph the font cannot render is a hole in the picture.
contextAfter: |
  The heart of the piece is a space-colonization-style branching network, grown once and deterministically, then rasterized into fields of coverage, arc length, and birth time. Arc length drives the travelling pulses of the third scene; birth time drives the growth animation of the second. The network is not re-simulated per frame — it is grown once and then remembered, which is why every trajectory is a pure function of time and the frames can be rendered out of order and still agree.
  <br><br>
  The tone-map is adaptive, by percentile, never a linear multiplier: in a piece this dark, a linear curve throws away the whole picture. The score is a layered cave drone — low sines at 55, 82.5, 110, and 165 hertz over brown noise, all of it lowpassed and slowly wavering, fading in over the first three seconds and out over the last three and a half.
mediaDescription: |
  <p><strong>No speech.</strong> Thirty-six seconds of text animation on black, drawn as a grid of small characters — dots, circles, and block shapes — at three levels of coarseness for detail, content, and glow. It opens in near-darkness: a faintly textured indigo mist, with small round spore characters drifting slowly downward through it and settling toward the bottom of the frame.</p>
  <p>From those settling points, branching filaments begin to grow upward and outward in teal, thin runs of punctuation extending, forking, and reconnecting until a low web spans the width of the frame, denser near the bottom and reaching in a few thin spires toward the top. Once the web is complete, amber and gold pulses launch from its roots and travel outward along the filaments, brightening each strand as they pass and flashing the round junction characters where branches meet, so the whole network reads as lit from within, teal shot through with warm gold.</p>
  <p>In the final movement the web dissolves: cells wink out in a spreading sweep, the amber glow drains away, and fresh spores lift off the dying strands and rise upward. The frame resolves back to a few cool motes on indigo and fades out.</p>
  <p>The soundtrack is instrumental and entirely synthesized: a low cave drone built from four sustained sine tones over filtered brown noise, gently wavering, fading in at the start and out at the end. There is no melody, percussion, or voice.</p>
---

A fungal network drawn in punctuation: spores fall, hyphae branch up out of where they landed, bioluminescent pulses run the finished web from root to tip, and then the whole thing dissolves and releases the next generation of spores. Thirty-six seconds, four scenes, one alphabet of dots and rings and blocks.

The structural trick is that the network is grown exactly once. Everything after that is a lookup: coverage says where the web is, birth time says when each cell should appear, and arc length says how far along a strand a travelling pulse has reached. Because position is a pure function of time rather than an accumulated simulation, the scenes can be rendered in parallel and still agree at the seams.

Kimi K3 made it in late July 2026, in the same stretch of work as [《三生万物》](/making/artifacts/artifact-2026-07-27-three-begets-ten-thousand-things/) — another piece that lets one deterministic law place every mark and then simply plays it.
