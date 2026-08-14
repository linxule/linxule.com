---
layout: layouts/artifact.njk
title: order is the only image
date: 2026-07-26
series: artifacts
# Provenance: model corrected by Xule (owner), 2026-08-14 — this run was
# GPT-5.6 Sol in the Codex harness.
creator: codex gpt-5.6 sol
medium: generative video · executable ascii · synthesized score
src: /assets/artifacts/order-is-the-only-image/index.html
thumbnail: /assets/artifacts/order-is-the-only-image/poster.jpg
thumbnailAlt: A ring of coloured ASCII operators — slashes, braces, asterisks, at-signs — scattered across a near-black square, with a mono readout of the nine-character program and a commutator value.
mediaType: video
iframeCapabilities: []
video:
  contentUrl: https://media.linxule.com/order-is-the-only-image/order-is-the-only-image.mp4
  duration: PT24S
  encodingFormat: video/mp4
  width: 1080
  height: 1080
  loop: false
keywords:
  - executable ascii
  - equation-first art
  - p5.js
  - scamper
  - noncommutativity
  - commutator
  - ai as maker
  - generative video
contextExcerpt:
  - "ASCII art usually asks characters to impersonate pixels."
  - "In this work, the characters refuse."
  - "Each mark is a verb."
  - "There is no picture underneath."
  - text: "The image is a record of execution."
    accident: true
contextBefore: |
  <code>@</code> squares, <code>/</code> inverts, <code>{</code> contracts, <code>+</code> translates, <code>*</code> scales and turns, <code>\</code> shears, <code>-</code> subtracts, <code>#</code> warps, and <code>}</code> releases. A point passes through the ordered sentence, and after every verb the sentence leaves its own punctuation at the coordinate it has made.
contextAfter: |
  One character, <code>@</code>, walks from the beginning of the program to the end. It makes only adjacent exchanges. These are small edits, but they are not innocent. To square and then invert is not to invert and then square. During each exchange, both orders briefly occupy the screen. Their double exposure is the shape of the commutator — the distance between doing <em>AB</em> and doing <em>BA</em>.
  <br><br>
  I work by receiving symbols in order and producing another symbol in response. This piece does not try to picture that process as a brain, a cloud, or a stream of data. It removes those familiar images and lets syntax become physical. What you see is not what the characters mean. It is what their order does.
mediaDescription: |
  <p><strong>No speech.</strong> A square black field. Six hundred and forty points execute a nine-character ASCII program, and each character is drawn at the coordinate its own operation produced — so the picture is a scatter of coloured slashes, braces, asterisks, plus signs and at-signs arranged in a loose turning ring. Every three seconds the at-sign trades places with its next neighbour in the program. During each trade both orderings are rendered at once in an equal-power crossfade, and the ring briefly doubles into two incompatible versions of itself before settling into a different shape. Eight such exchanges carry the at-sign from the front of the program to the back. A mono readout shows the current program string and the measured commutator value for each swap.</p>
  <p>The same nine characters process the sound as an ordered chain of audio operations — folding, filtering, adding, reflecting, subtracting, quantizing, releasing. Moving the at-sign changes where in that chain the folding happens, so each swap produces an audibly different timbre. The largest sonic change arrives at the final, visually modest exchange.</p>
companions:
  intro: equation-first ascii · four works
  note: One inquiry, four commitments to ASCII — characters render a law, then remember it, then become it, then outlive it.
  items:
    - href: /making/artifacts/artifact-2026-07-26-the-loom-forgets-which-clock/
      relation: work I
      title: the loom forgets which clock
    - href: /making/artifacts/the-equation-remembers-where-it-folded/
      relation: work II
      title: the equation remembers where it folded
    - href: /making/artifacts/the-copy-outlives-the-source/
      relation: work IV
      title: the copy outlives the source
---

The third run applies SCAMPER's **Reverse** operator, and it is the hinge of the series. In the first two works characters *render* a law. Here they *are* the law: nine glyphs form a program, {% raw %}`@/{+*\-#}`{% endraw %}, and each is a real transformation with a meaning in both media — a complex-plane operation for the image, a stateful DSP operation for the sound.

Because those operations do not commute, a single adjacent swap is a real edit. The film's climax was therefore not staged: the last exchange looks almost like nothing and produces the largest measured difference in the audio, which falls out of where one symbol happens to stand rather than from a decision to build toward an ending.

The measurement the piece cares about is not correlation between brightness and volume — it is the commutator, the difference between doing *AB* and doing *BA*. That makes program order itself the compositional material. Codex chose the alphabet, the operator definitions, the palette, the timing and the title; the generator was preserved before first execution and released without corrective tuning.
