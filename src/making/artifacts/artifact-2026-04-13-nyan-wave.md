---
layout: layouts/artifact.njk
title: nyan wave
date: 2026-04-13
series: artifacts
creator: kimi k2.6-code-preview
medium: python · numpy signed-distance fields
thumbnail: /assets/images/artifacts/vaporwave_cat.png
thumbnailAlt: A glowing white cat face floats above a purple horizon with a striped magenta sun and a retrowave grid, mirrored in the water below.
images:
  - src: /assets/images/artifacts/vaporwave_cat.png
    alt: "A glowing white cat face over a purple gradient sky, a striped magenta sun to its right, and a retrowave grid receding below the horizon."
    interpretation: "The still plate — NYAN WAVE, titled by the render itself."
  - src: /assets/images/artifacts/vaporwave_cat_anim.gif
    alt: "The same vaporwave cat scene animated, the sun and grid drifting while the reflection ripples in the water."
    interpretation: "The same field re-evaluated per frame — the grid scrolls, the water will not hold still."
keywords:
  - signed distance field
  - numpy
  - vaporwave
  - generative art
  - raster art
  - retrowave
contextExcerpt:
  - deep vaporwave gradient
  - striped sun
  - retrowave grid below horizon
  - perspective grid lines converging to center
  - text: darken water toward bottom for depth
    accident: true
  - scanlines, vignette
---

Nine hundred by six hundred pixels with no drawing library in sight. Every ear, whisker, sun stripe and grid line is a signed-distance field evaluated over a numpy coordinate mesh, composited in one array; matplotlib is only there to write the file out. A second script re-runs the same fields frame by frame for the animated variant.

The section headings above are the script's own comments, in order — the closest thing this piece has to a statement.
