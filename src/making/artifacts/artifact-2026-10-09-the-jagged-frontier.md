---
# Reviewed sandbox exception: the Music Studio REPL uses module loading and localStorage.
# The archived, site-owned player is tested here; downloads preserve the original score.
layout: layouts/artifact.njk
title: the jagged frontier · waiting room
date: 2026-10-09
series: artifacts
creator: claude
medium: strudel · hydra · live classroom performance
description: >-
  A live-coded waiting room for an AI class: house music, reactive typography and questions for the
  room, with playable code and a recorded excerpt.
src: /assets/artifacts/the-jagged-frontier/index.html
thumbnail: /assets/artifacts/the-jagged-frontier/poster.jpg
thumbnailAlt: White cut-out lettering spells The Jagged Frontier over a red and blue audio-reactive field.
iframeCapabilities:
  - allow-scripts
  - allow-same-origin
  - allow-downloads
keywords:
  - live coding
  - strudel
  - hydra
  - generative music
  - creative teaching
  - audio-reactive typography
contextExcerpt:
  - WHO IS PLAYING THIS?
  - IS ANYONE AT THE DECKS?
  - WHAT IF CODE COULD LISTEN?
  - text: THE CODE IS THE SCORE.
    accident: true
contextBefore: >-
  The pre-class screen for The Jagged Frontier: live-coded music and audio-reactive visuals in
  Strudel and Hydra, played through Music Studio while the students arrived.
contextAfter: >-
  The score moves through three musical rooms at 120 BPM. Twenty sections make a 14-minute-56-second
  loop; six typographic treatments change every sixteen seconds, while twenty-two questions rotate
  through the frame.
mediaDescription: >-
  <p><strong>Instrumental music; on-screen text.</strong> House drums, bass, keys, pads and
  arpeggios move through three rooms. Red, blue and other saturated shader fields react to the beat.
  The title shifts between scrambled, mixed-font, giant, outlined, scrolling and displaced letters.
  Questions such as “Who is playing this?” and “What if code could listen?” appear beside the
  classroom countdown.</p><p>The recording is a continuous 5:04 excerpt. Its 1920 × 1080 image is an
  upscale of the player’s 960 × 540 output; the recorded countdown reads “STARTING NOW.”</p>
mediaType: video
video:
  contentUrl: https://media.linxule.com/the-jagged-frontier/waiting-room-5min.mp4
  duration: PT5M4S
  encodingFormat: video/mp4
  width: 1920
  height: 1080
  loop: false
---

Made for the waiting room of my 9 October 2026 AI for Business class at SKEMA. Claude coded the DJ/VJ set: the music, the changing type and the questions addressed to the room. The class could arrive to something already happening.

The live player above carries the complete score. Press **Play**, then **Stage** to watch the visuals, or edit the code and play your version. The recording tab preserves a continuous five-minute excerpt of the original performance. Changing tabs stops the current player.

[Download the original Strudel/Hydra score](/assets/artifacts/the-jagged-frontier/waiting-screen.strudel). This is the 22-question version kept beside the recordings. Its classroom clock remains intact: it selects 09:45 or 15:00 from the viewer’s local time. Samples and the player engine load over the network; the preserved score does not depend on the original temporary share link.
