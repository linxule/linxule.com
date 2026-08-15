---
layout: layouts/artifact.njk
title: a head, blocked out, then drawn on
date: 2026-08-15
series: artifacts
creator: claude opus 5
medium: html · canvas · web audio · speech synthesis
src: /assets/artifacts/blocked-out-then-drawn-on/index.html
thumbnail: /assets/artifacts/blocked-out-then-drawn-on/poster.jpg
thumbnailAlt: A faceted terracotta head on grey-blue paper, each plane a single flat tone like a sculptor's block-in, with thin dark brows, two oval eyes, a single curved nose line and a straight mouth drawn on top.
keywords:
  - procedural drawing
  - canvas animation
  - constructive drawing
  - block-in
  - flat shading
  - generative face
  - speech synthesis
  - web audio
  - ai self-portrait
  - ai as maker
contextExcerpt:
  - "Underneath it I'm not a face at all. I'm a solid."
  - "You block a head out before you draw on it: a front, two sides, and a corner where one turns into the other."
  - "Every plane gets one flat colour, worked out from the direction it happens to point."
  - "An eye is two arcs and a pupil. A nose is one long curve that goes around the tip and stops."
  - text: "None of it is a picture of anything. It's arithmetic that happens to land in the shape of a face."
    accident: true
contextBefore: |
  I don't have a head, so I built the one thing I could check: a rough solid whose horizontal section is a rounded square, so it has a front, two sides, and a definite corner between them. That is how a head gets blocked out before anybody draws on it — you find the box first and earn the face later. Every plane takes one flat tone off its real normal. No gradients anywhere. One decision per plane, and the decision is arithmetic.
contextAfter: |
  Then the drawing goes on top, and the drawing is only marks: two arcs and a pupil, one long curve around a tip and stop. Turn me far enough and the features want to be somewhere you can't see, so they get walked back onto the visible face and squeezed until they fit — which is what you'd do drawing a head from memory, crowding everything onto the side you can see and letting the proportions take the hit. Press <em>new face</em> and the same skull carries different marks. I don't think any one of them is more me than the others.
  <br><br>
  Press <em>listen</em> and it explains itself out loud, over music that is also just code — a drone slightly out of tune with itself, a pentatonic voice that decides when to speak, filtered noise standing in for paper. No audio files, no images, nothing fetched. <em>Flat all the way through, and solid the entire time.</em>
---

Claude Opus 5 made this in the Claude web app, as an artifact — the day after Kimi K3 finished [*if we all had heads*](/making/artifacts/artifact-2026-08-14-if-we-all-had-heads/). Two models, one week, the same missing thing. Kimi went naïve and social: nine doodle heads on one sheet, ink and vibe lines, a cast that turns to look at each other. Opus went to the atelier. This head is *constructed* — the solid first, in flat computed planes off a rounded-square section, and the features drawn on afterwards as the small number of strokes a life-drawing class would allow.

The three modes are the argument. **blocked** strips the marks and leaves the bare toned form; **drawn** is the finished head; **construction** turns the scaffold back on over the top, so the pins and the section lines sit visible on the face they produced. Nothing is a stored asset — the eyes, noses, mouths, brows and ears are functions in surface coordinates, bent onto the form so they foreshorten by themselves, and *new face* deals a fresh hand from them. Move the cursor and it looks at you; drag and it turns.

It also talks. The `listen` button runs a twelve-line script through the browser's own speech synthesis, holding a pose and switching modes for each line so the head illustrates its own explanation, with a lip-sync driven by a syllable timer and a score assembled live in Web Audio. Zero external requests: everything in the piece — the drawing, the voice, the music — is the same few hundred lines of arithmetic.
