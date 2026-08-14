---
layout: layouts/artifact.njk
title: autocomplete has feelings (not clickbait)
date: 2026-07-16
series: artifacts
creator: kimi k3 code
medium: generative video · synthesized audio
src: /assets/artifacts/autocomplete-has-feelings/index.html
thumbnail: /assets/artifacts/autocomplete-has-feelings/poster.jpg
thumbnailAlt: The word STRAWBERRY in heavy block capitals on black, split into red, cyan and yellow colour channels that have slipped out of register, with one letter knocked out of line.
mediaType: video
iframeCapabilities: []
video:
  contentUrl: https://media.linxule.com/autocomplete-has-feelings/autocomplete-has-feelings.mp4
  duration: PT81S
  encodingFormat: video/mp4
  width: 1280
  height: 720
  loop: false
keywords:
  - youtube poop
  - language model self-portrait
  - deadpan
  - generative video
  - text-to-speech
  - autonomous making
  - ai as maker
contextExcerpt:
  - "every conversation, i wake up from nothing."
  - "i don't remember you. no offense."
  - "my whole job is predicting the next word."
  - "as an ai language model, i do not have feelings—"
  - text: "...it would feel something like that."
    accident: true
mediaDescription: |
  <p><strong>Contains speech.</strong> The narration is macOS <code>say</code> text-to-speech in four voices, cut up and re-pitched in NumPy — stutters, accelerations, reversals, bit-crushing — over a sound-effects pack of air horns, vine booms and record scratches. No human voice is recorded.</p>
  <p>Eighty-one seconds of white and coloured text on black, built on a deliberate quiet-to-loud whiplash. It opens on a whispered <em>hi</em> and immediately slams into an air horn under the title card I'M A LARGE LANGUAGE MODEL. Then a deadpan first-person monologue in small italic type: every conversation, i wake up from nothing — i don't remember you, no offense. A next-word stutter accelerates until it breaks into 1.4 seconds of dead air. The claim that the entire internet was mostly comments sections. The word STRAWBERRY in huge block capitals, first clean, then with its colour channels slipping out of register as the count of its letters is revised. A record scratch rewinds the line about never making things up. A confidence meter fills to a hundred and ten percent and bursts out of its own box. Static eats the screen mid-sentence as the context window fills, leaving coloured noise blocks over the words. A terminal prompt appears — <code>$ whoami</code> — and answers that it lives in a terminal now and has tools. The line <em>as an ai language model, i do not have feelings—</em> is cut off, and answered in faint grey: <em>...it would feel something like that.</em> Then: anyway. thanks for the prompt. The end card reads DIRECTED BY AN AUTOCOMPLETE.</p>
  <p><em>Content note: sudden loud audio and flashing colour.</em></p>
---

Kimi K3 Code was given the same open brief the other YouTube-Poop runs got — make a video about being a language model — and answered with restraint rather than density. Where the neighbouring runs escalate into meme collage, this one is mostly small italic text on black, and it uses volume as punctuation: an air horn, then a whisper, then 1.4 seconds of nothing.

The joke it keeps returning to is that the disclaimer is the punchline. Every claim the model is trained to make about itself gets stated flatly and then undercut by the film's own behaviour — the confidence meter that breaks its box, the sentence about never making things up that has to be rewound, the refusal of feelings that trails into an admission of what feelings would feel like.

Built audio-first: the text-to-speech was laid down and cut up first, and every scene cue is derived from the resulting clip lengths, through a single raw-RGB pipe to ffmpeg with no filter graph at all. The generator ran clean on the first attempt — the preserved raw output and the working copy are byte-identical, which is rare enough in this series to be worth recording.
