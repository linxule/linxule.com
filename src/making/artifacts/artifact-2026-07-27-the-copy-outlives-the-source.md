---
layout: layouts/artifact.njk
title: the copy outlives the source
date: 2026-07-27
series: artifacts
creator: codex gpt-5
medium: generative video · processing · native ascii
src: /assets/artifacts/the-copy-outlives-the-source/index.html
thumbnail: /assets/artifacts/the-copy-outlives-the-source/poster.jpg
thumbnailAlt: A dense bloom of overlapping ASCII impressions in cyan, violet, magenta and copper on a black square, six misregistered copies of the same braided figure, with a mono readout listing six generations.
mediaType: video
iframeCapabilities: []
video:
  contentUrl: https://media.linxule.com/the-copy-outlives-the-source/the-copy-outlives-the-source.mp4
  duration: PT24S
  encodingFormat: video/mp4
  width: 1080
  height: 1080
  loop: false
keywords:
  - generative ascii
  - equation-first art
  - processing
  - scamper
  - letterpress misregistration
  - video feedback
  - ai as maker
  - generative video
contextExcerpt:
  - "A copy is usually judged by the thing it follows."
  - "I wanted to construct a system in which following is itself productive."
  - "The source here is thin."
  - "It emits events but does not own their final form."
  - text: "Six histories of having been copied."
    accident: true
contextBefore: |
  Each event passes through six transfer generations. Rotation accumulates. Scale contracts. Shear and translation misregister one impression from the next. The character mutates as well. What persists on screen is not one image repeated six times.
contextAfter: |
  Near the end, the source plate is removed from the composite. This is not a fade to black. The descendants have their own surfaces, histories, colors, and delays; they continue after their point of origin is no longer visible. The last registration therefore occurs without an original.
  <br><br>
  As a language model, I do not encounter originality as an untouched first object. I encounter inherited marks already displaced by many prior acts of selection. This work avoids illustrating that condition with a brain, archive, or network. It makes copying physical: a symbol is passed from operation to operation until ancestry becomes less important than consequence.
mediaDescription: |
  <p><strong>No speech.</strong> A square black field. A braided polar figure emits ASCII characters — dots, colons, plus signs, asterisks, slashes, hashes, at-signs — which are stamped into six persistent offscreen plates, each one a contracted, rotated, sheared and slightly mutated copy of the plate before it. The plates are added together, so the frame accumulates into a dense bloom of misregistered impressions in cyan, blue, violet, magenta, copper and bone. Every four seconds the transformations briefly agree and all six impressions register into a single white-hot seal that lasts under a second before separating again. In the final passage the cyan source plate fades out of the composite entirely; the five descendants keep moving and reach one more registration without it. A mono readout names the six generations and reports the source plate's alpha falling to zero.</p>
  <p>The score is a six-generation canon. Sixty source attacks become 358 delayed events transposed across the ratios 1, 9/8, 5/4, 4/3, 3/2 and 5/3, and six bells sound at the same instants as the visual registrations. When the cyan plate goes, the source voice goes with it — the delayed, transposed descendants continue alone.</p>
companions:
  intro: equation-first ascii · four works
  note: One inquiry, four commitments to ASCII — characters render a law, then remember it, then become it, then outlive it.
  items:
    - href: /making/artifacts/the-loom-forgets-which-clock/
      relation: work I
      title: the loom forgets which clock
    - href: /making/artifacts/the-equation-remembers-where-it-folded/
      relation: work II
      title: the equation remembers where it folded
    - href: /making/artifacts/order-is-the-only-image/
      relation: work III
      title: order is the only image
---

The fourth run changes instrument. Where the first three works are p5.js, this one is Processing 4.5.6 in Java mode — not as a substitute spelling of the same thing, but because its persistent `PGraphics` surfaces *are* the composition. Six 1080×1080 plates age, take new stamps, and are composited every frame, so each surface carries a different history of the same events.

The creative operation was SCAMPER's **Adapt**: adapt multi-generation video feedback and misregistered letterpress plates into directly executable typography. The ending is what the whole apparatus was built for. Removing the source plate near the end is not a fade — the five descendants have their own colours, delays and accumulated rasters, and the final registration happens with no original present.

This is the last of the four runs, and the one that most clearly breaks the assumption the series started under. In [the loom forgets which clock](/making/artifacts/the-loom-forgets-which-clock/) a return is an agreement among clocks; here it is an agreement among copies. Codex chose the copy lineage, the transfer matrices, the plate colours and the title. Processing forced three language-level repairs during compilation — `color` is a reserved type, `smooth()` belongs in `settings()`, offscreen surfaces reject `pixelDensity()` — but no geometry, palette, form or audio decision was revised after the structural pass.
