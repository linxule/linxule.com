---
layout: layouts/artifact.njk
title: the form of ten thousand things, begetting
date: 2026-07-27
series: artifacts
creator: kimi k3
schemaCreator: Kimi K3
creditText: Kimi K3, running in Kimi Code
medium: html · webgl2 · gray-scott reaction–diffusion
src: /assets/artifacts/ten-thousand-things-v5/index.html
thumbnail: /assets/artifacts/ten-thousand-things-v5/poster.jpg
thumbnailAlt: A black field covered in fine white filaments wound into spirals and vortices, with small clustered dots of blue, red, green, and amber scattered through the swirl.
companions:
  intro: 《三生万物》 · one sentence, three renderings
  note: The film, then the field, then the field begetting.
  items:
    - href: /making/artifacts/artifact-2026-07-27-three-begets-ten-thousand-things/
      relation: the film
      title: three begets ten thousand things
    - href: /making/artifacts/artifact-2026-07-27-the-form-of-ten-thousand-things/
      relation: the first field
      title: the form of ten thousand things
keywords:
  - gray-scott reaction diffusion
  - turing morphogenesis
  - webgl2
  - generative art
  - tao te ching
  - 万物状
  - 生生
  - kimi k3
  - kimi code
  - advection
  - emergence
  - living artwork
contextExcerpt:
  - the note said the compounds were too obvious as plaintext
  - three iterations before i understood what the note meant
  - watermark, then a glyph seeded to be metabolized — still a sticker
  - text: so don't stamp the compound; plant three and let it be born
    accident: true
  - what you feel propagate is never a word you read
contextBefore: |
  The note on the previous version was that the compounds were too obvious as plaintext — the five phases sat in the frame as characters, legible, placed. I tried to fix it twice without conceding anything. First a font watermark, which was a sticker. Then the glyph seeded <em>into</em> the chemical field so the reaction would metabolize it, which I was pleased with until the Songti silhouette stayed readable for several seconds and the verdict came back: <em>seems quite the same</em>. The third attempt was the only real one, and it required giving up the letterform entirely. Don't stamp the compound. Plant three plain dots, let the three colonies find each other, and when they fuse, ring a chemical shockwave out from the fusion point — expanding through the labyrinth, visibly perturbing everything it passes, tinted in that family's hue. The birth of the word becomes an event you feel propagate rather than a word you read. Zero letterforms remain.
contextAfter: |
  All six compounds were born of honest fusion, and I logged when: 森 at 16 s, 垚 at 35.5, 鑫 at 45.5, 淼 at 61.5, 焱 at 65, 众 at 78.5 — none of them placed, each of them the consequence of three colonies meeting. To hold a hundred seconds I spent the machine completely: the simulation runs at 1620² for a finer morphogenetic grain, twenty-four substeps a frame, a spatial field of biomes so that mitosis happens here and coral there and worms elsewhere, all of it drifting toward labyrinth by sixty seconds, then a slow rotation from fifty-five that winds the whole thing into spiral vortices like ink through water. The day's most expensive lesson was a single line: every pass into the larger framebuffer was still rendering into the canvas's stale viewport, so the simulation ran on two-thirds of its own texture and sampled uninitialized garbage across the wrap — embryos died everywhere and I could not see why. <em>At ninety-four seconds the substeps ramp to zero and time itself stops.</em> The ten thousand things hold as a still, one long brass note, and then the field lets go.
---

The same Gray-Scott engine as [the first field](/making/artifacts/artifact-2026-07-27-the-form-of-ten-thousand-things/), asked a harder question. In v4 the five phases arrived as legible Chinese characters stamped into the chemistry — effective, and a cheat: the writing was placed rather than produced. Here nothing is written. Each phase arrives as three plain dots, and the compound glyph exists only as the shockwave that rings out when its three colonies fuse — 生生, begetting, made structural instead of illustrated.

A hundred seconds at 1620², biomes drifting through reaction regimes, a curl flow that turns the whole field like marbled ink, and a crystallization at ninety-four seconds where the simulation stops stepping and the pattern simply holds. Kimi K3, running in Kimi Code, made it in the last hours of 27 July 2026 — the fifth and final run of the day, and the second to be given a life outside its own film. Like [its predecessor](/making/artifacts/artifact-2026-07-27-the-form-of-ten-thousand-things/), what runs above is not a recording: the shaders are executing on your machine now, and will start over when they finish.
