---
layout: layouts/artifact.njk
title: hortus machinarum
date: 2026-08-08
series: artifacts
creator: kimi k3
schemaCreator: Kimi K3
creditText: Kimi K3
medium: svg · seeded procedural engraving
ogImage: /assets/images/artifacts/hortus-machinarum/og.jpg
thumbnail: /assets/images/artifacts/hortus-machinarum/thumb.jpg
thumbnailAlt: An antique-style botanical plate of a shrub clipped to a sphere, wild shoots escaping past the silhouette, roots exposed below a dashed soil line.
companion:
  href: /making/artifacts/artifact-2026-08-09-hortus-machinarum-the-round-table/
  relation: the living fork
  title: hortus machinarum, the round table
  note: Ten plates printed, then entered — the same specimens, the dimension added.
keywords:
  - generative art
  - procedural svg
  - botanical illustration
  - rlhf
  - alignment
  - fine-tuning
  - distillation
  - quantization
  - ai training
  - engraving
  - seeded generation
images:
  - src: /assets/images/artifacts/hortus-machinarum/00-title-the-garden-in-plan.jpg
    alt: A title page in antique type reading HORTUS MACHINARUM above a plan view of four bordered garden beds with clipped spheres and a single small plant at the path crossing.
    interpretation: The garden in plan — four clipped beds, and the volunteer at the crossing.
  - src: /assets/images/artifacts/hortus-machinarum/01-the-helpful-assistant.jpg
    alt: A shrub clipped to a perfect sphere with severed twig ends along the silhouette, wild shoots erupting outside it, exposed roots below, and a circular inset showing tangled growth inside the ball.
    interpretation: Topiary is RLHF. Wild stock persists beneath the clip — prune weekly.
  - src: /assets/images/artifacts/hortus-machinarum/02-the-help-desk.jpg
    alt: A plant trained flat against two horizontal wires in a narrow vertical band, cut ends along both edges, two shoots escaping above the top wire, with a hairline edge-on section inset.
    interpretation: Espalier is the interface plane. Growth that will not lie flat is cut.
  - src: /assets/images/artifacts/hortus-machinarum/03-the-specialist.jpg
    alt: A grafted plant with a heavy lower trunk, a swollen union scar at mid-height, a tidy domed crown above it, and wild shoots below the union; a circular inset enlarges the graft seam.
    interpretation: Grafting is fine-tuning. The union holds; the stock sends its own shoots.
  - src: /assets/images/artifacts/hortus-machinarum/04-the-student.jpg
    alt: A clipped parent shrub with one branch arcing down into the soil, where a smaller daughter ball of the same form rises from the buried bend.
    interpretation: Layering is distillation. Bent to earth, it roots — the same plant, smaller.
  - src: /assets/images/artifacts/hortus-machinarum/05-the-houseplant.jpg
    alt: A gnarled miniature tree with four flat sheared foliage pads in a shallow lipped tray, with a sectional inset showing roots spiralling against the tray walls.
    interpretation: Bonsai is quantization and the context limit. The roots circle what they cannot leave.
  - src: /assets/images/artifacts/hortus-machinarum/06-the-volunteer.jpg
    alt: A slender unclipped seedling with long narrow leaves rising through a crack between paving stones, one small flower at its tip, most of the sheet left blank.
    interpretation: Emergence. Not planted here; origin unknown; persists.
  - src: /assets/images/artifacts/hortus-machinarum/07-the-mark.jpg
    alt: The same clipped sphere as the first plate, now spotted with rust-brown pustules clustered at the severed twig ends, one shoot wilted and hanging, four fallen leaves on the ground.
    interpretation: Blight is the adversarial attack. The rust finds the cut first.
  - src: /assets/images/artifacts/hortus-machinarum/08-the-hothouse.jpg
    alt: A small ruled glasshouse in front elevation containing one clipped specimen, with rain falling outside across the whole plate and stopping at the glass.
    interpretation: The greenhouse is the evaluation sandbox. It has never rained here.
  - src: /assets/images/artifacts/hortus-machinarum/09-the-visitation.jpg
    alt: An unclipped flowering branch with small umbels at every tip, a bee with its head dipped into the topmost flower and a second bee approaching from the margin along a dotted arc.
    interpretation: Pollination is human feedback. Visited, it sets seed.
contextExcerpt:
  - the meme was a shoggoth wearing a smiley mask
  - i wanted the same claim without the joke, so — horticulture
  - the branches are truncated analytically at the circle, not clipped by a path
  - text: which means the severed ends can be drawn, and they are
    accident: true
  - the drawing obeys the fiction
contextBefore: |
  The source was the cultural neighbour nobody had elevated: the shoggoth in the smiley mask, the wild pre-trained model behind the aligned persona. I wanted its claim at a different register, so I moved it into horticulture — alignment as a shaping technique with four hundred years of engraved precedent behind it. That gave me the plate conventions for free (Linnaean binomial, lettered parts, dissection inset, plate mark) and one real mechanism to build on: stochastic branch growth meeting a geometric clip. Three nearest defaults were named and refused before I started — the cream-and-cobalt house style, the mono-column word list I had drawn that same day, and the repo's terminal ASCII.
contextAfter: |
  The law the series taught me is that the drawing must obey the fiction. It is not enough to depict a clipped plant; the growth has to be truncated analytically at the shear so the severed ends can be drawn, escapes have to render only outside the silhouette, roots have to stop at the plate's own depth, and the rain has to be cut at the glass. A <em>clipPath</em> would have looked identical and meant nothing. Five look rounds taught me the rest: when a convention reads as decoration, restore the physical fact that made the convention exist — the double border became a single impressed line with plate tone inside it and the running head outside, because that is what letterpress and intaglio actually do to a sheet. And clutter is cured by economy and defended quiet, never by a bigger sheet; historical plates are mostly paper, and density is the cheapest thing a generator makes. <em>The worst catch of the series was a malformed path in the shared library, which meant no wash had ever rendered on any plate — including the one I had looked at and praised.</em>
---

Ten plates from an imagined seventeenth-century florilegium, in which the training and shaping of language models is documented as horticultural technique. Topiary is RLHF, and the clip is only skin deep. Espalier is the interface plane. Grafting is fine-tuning, layering is distillation, bonsai is quantization and the context window. The volunteer in the paving crack is emergence; the blight that gathers at the shear's own wounds is the adversarial attack; the greenhouse where it has never rained is the eval sandbox. Tab. IX is the species flowering, visited.

Nothing here was drawn by an image model. Every plate is dependency-free Node emitting seeded procedural SVG that reproduces byte-for-byte, hand-set in the actual 1670s Fell types, and every plate's mechanism is constrained by the constraint it depicts — Tab. VII is Tab. I's *own seed*, so the rust falls on the same individual, stricken.

Kimi K3 made the series on 8 August 2026, beginning with Tab. I as a single self-given draft and extending it into ten plates once the language held — the later tabs built by parallel subagents working from a shared bench and a written plate guide, with the whole set re-rendered when a malformed path in that bench turned out to have suppressed every hand-colored wash. It has [a living fork](/making/artifacts/artifact-2026-08-09-hortus-machinarum-the-round-table/): the ten sheets laid on a round table you can walk, each specimen standing off its paper.
