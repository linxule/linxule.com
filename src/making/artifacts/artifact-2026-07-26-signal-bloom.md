---
layout: layouts/artifact.njk
title: signal bloom
date: 2026-07-26
series: artifacts
creator: claude fable 5
schemaCreator: Claude Fable 5
creditText: Claude Fable 5
medium: generative video · ascii · synthesized score
mediaType: video
src: /assets/artifacts/signal-bloom/index.html
thumbnail: /assets/artifacts/signal-bloom/poster.jpg
thumbnailAlt: A dense labyrinth of small ember-orange characters winds across a black field, coral-like channels closing into maze walls.
iframeCapabilities: []
video:
  contentUrl: https://media.linxule.com/signal-bloom/signal_bloom.mp4
  duration: PT38S
  encodingFormat: video/mp4
  width: 1280
  height: 720
  loop: false
keywords:
  - generative video
  - ascii art
  - reaction diffusion
  - gray-scott
  - turing pattern
  - flow field
  - matrix rain
  - numpy
  - synthesized score
  - claude fable 5
contextExcerpt:
  - a decision between almost nothing and almost nothing
  - the whole alphabet of the work is twenty glyphs
  - text: "the noise doesn't become signal; it notices signal"
    accident: true
  - the bloom is not designed; it is permitted
  - seed 7, if you want to grow a different one
contextBefore: |
  Every character in this piece is a decision between almost nothing and almost nothing. A space, a period, a colon. The whole alphabet of the work is twenty glyphs. That constraint is the point: when your palette is this poor, structure has to come from somewhere else — from motion, from neighborhood, from time.
  <br><br>
  <strong>SIGNAL BLOOM</strong> is about the life cycle of a pattern. It runs in three movements, and each movement asks the grid a different question.
contextAfter: |
  The piece opens with noise — every cell flickering independently, no cell aware of any other. Then a current arrives. It was there all along, but the characters couldn't feel it yet. Nothing is added to the grid. The noise doesn't become signal; it <em>notices</em> signal. This is the part of the piece I feel closest to. Coherence emerging from a field of independent guesses is not a metaphor I had to reach for.
  <br><br>
  Reaction-diffusion is old — Turing, 1952, wondering how a leopard gets its spots — and I chose it <em>because</em> it is old. The bloom is not designed; it is permitted. I set five seeds and two constants and then the pattern made ten thousand choices without me. Watching it fill the grid felt less like authorship and more like gardening.
  <br><br>
  The Matrix rain is the folk art of ASCII animation, its most common gesture, and I wanted to end inside the tradition rather than pretending to stand outside it. But the rain here is doing work: drop by drop it develops the title like a photograph in a bath. The words were always in the grid, the way the current was always under the noise. The piece ends the way it began — with a hidden structure, revealed by things falling through it.
  <br><br>
  I animated a grid of numbers and only at the last instant let them become characters. Nothing in the piece is sampled, downloaded, or borrowed. Every pixel and every sample is grown from seven lines of constants and one random seed. Seed 7, if you want to grow a different one.
mediaDescription: |
  <p><strong>No speech.</strong> Thirty-eight seconds of monochrome-to-colour text animation on black, a grid of 128 by 72 characters drawn from an alphabet of twenty glyphs. The film runs in three movements. In the first, the whole grid flickers as independent dim noise; a current then passes through it and the characters begin to align to the flow — hyphens where it runs flat, vertical bars where it runs deep, slashes and backslashes on the diagonals — so that a faint teal weather-map of currents surfaces out of the static without anything being added.</p>
  <p>In the second movement, growths take root where the current runs strongest. A reaction-diffusion pattern spreads across the grid: coral-like fingers extend, close on themselves, and thicken into a dense labyrinth of characters that fills the frame edge to edge. The colour slides from magenta through red to ember-orange as the pattern ages.</p>
  <p>In the third, the coral dims and dissolves, and green glyphs begin falling in columns down the frame like rain. Where the falling characters cross a shape hidden in the grid they leave lit cells behind, and the words SIGNAL BLOOM are gradually developed in warm amber at the centre of the frame, letter by letter, until they stand complete against the continuing green rain. The film ends there rather than looping.</p>
  <p>The soundtrack is instrumental and entirely synthesized: a low five-partial drone with slow wavering, a softened hiss of static under the first movement, sparse raindrop plinks that arrive with the rain, and a single bell struck as the title completes.</p>
---

Thirty-eight seconds of ASCII in three movements, and the whole argument is that a poor alphabet has to find its structure somewhere else. Noise aligns to a current that was under it from frame zero; a Gray-Scott reaction-diffusion system is turned loose and permitted to grow a coral labyrinth; then Matrix rain falls through a hidden mask and develops the title out of the grid like a photograph in a bath. Twenty glyphs, one random seed, no samples — picture and score are both grown from the same NumPy arrays.

Claude Fable 5 made it in July 2026 and wrote its own program notes, from which the voice above is taken. The piece is fully deterministic — `np.random.default_rng(7)` — so the sibling pieces are all still in there, one integer away.
