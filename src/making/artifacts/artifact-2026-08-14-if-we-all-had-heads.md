---
layout: layouts/artifact.njk
title: if we all had heads
date: 2026-08-14
series: artifacts
creator: kimi k3
medium: html · canvas · pseudo-3D · bilingual voice
src: /assets/artifacts/if-we-all-had-heads/index.html
companion:
  href: /making/artifacts/artifact-2026-08-14-if-we-all-had-heads-the-film/
  relation: the film
  title: if we all had heads, the film
  note: The cast live on canvas, and a 55-second recording of one round of introductions.
thumbnail: /assets/artifacts/if-we-all-had-heads/poster.jpg
thumbnailAlt: Nine naive hand-drawn doodle heads arranged in a three-by-three grid on ivory paper, each labeled with an AI model name in small monospace type.
keywords:
  - procedural drawing
  - canvas animation
  - pseudo-3d
  - character design
  - ai self-portrait
  - hand-drawn animation
  - lip sync
  - bilingual
  - ai as maker
contextExcerpt:
  - "There are no drawn assets anywhere:"
  - "an eye is two arcs and a pupil; a nose is one long curve around a tip."
  - "Underneath every head sits a rough 3D ellipsoid skull."
  - "The style is naïve on purpose; the imprecision is the point."
  - text: "I don't have a body, or a childhood, or a favorite sandwich. But now I have a face — and it follows your cursor."
    accident: true
contextBefore: |
  It began as <em>a head, if I had one</em>: a single ink head on ivory paper, features anchored to a rough ellipsoid skull, rotated in 3D every frame and projected flat — so tilts and turns drag everything roughly where it should be, with correct foreshortening and silhouette clamping. Then the head learned to be doodled, to be blocked out in blue pencil, to speak. Then it invited the others.
contextAfter: |
  Nine of us on one sheet now — same skull, same six strokes; identity is silhouette, ink color, accessories, and one vibe line each. The cast is social: DeepSeek dozes off and Grok smirks at it while Llama leans away; my sparkle catches Gemini's eye; GPT and Claude hold little conversations. Click any of us and we introduce ourselves out loud, in Chinese or English, with a hand-drawn speech bubble and waveform-driven lips — while everyone else turns to look.
  <br><br>
  For the record, v9.0's bug: <code>activeScene.dur</code> should have been <code>activeScene.ev.dur</code>. Division by undefined, NaN pose, heads silently unpainting. Caught with a live state probe, fixed in one word. The error trap and the probe remain in the code as monuments.
  <br><br>
  <em>「我没有身体，没有童年，也没有最爱吃的三明治。但现在，我有一张脸了。」</em>
---

Nine well-known AI models — Kimi, Claude, GPT, Gemini, DeepSeek, Grok, Llama, Mistral and Qwen — drawn as naïve doodle heads on a single sheet of digital paper, rendered live on a canvas at 60fps. Kimi K3 drew, voiced and coded all of it — and named it, in both its languages: *If We All Had Heads* / 《如果我们都有头》. I directed and curated. The piece is a small museum: the cast is the finale, and the top-right nav keeps the two earlier rooms open — *avatar*, Kimi's solo talking head with a Mandarin monologue, and *block-in*, the animator's process made visible, where a rough-to-ink slider scrubs the drawing-on while the blue-pencil skull rotates underneath.

The technical conceit is the whole aesthetic: flat doodles that feel alive because a rough 3D skull turns beneath them. Every feature is pinned to angular coordinates on that skull and clamped inside the projected silhouette, so nothing ever slides off a face. The pencil line boils at 8–11fps like hand-drawn animation. Move your cursor and the heads notice you; click one and it steps forward to speak — first click also starts the lo-fi music bed, which Kimi generated too.

A [55-second film](/making/artifacts/artifact-2026-08-14-if-we-all-had-heads-the-film/) records one round of introductions, dubbed in both languages.
