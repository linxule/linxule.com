// Reveal dispatcher. Single source of truth for the v0.3 reveal-token map.
//
// Background: render/matrix.js#applyReveal and views/walkthrough.js both
// used to hardcode which tokens drove which effects (forward/backward
// transfer visibility, overlay visibility, cross-region highlight). Adding
// a new reveal channel meant editing two files plus reasoning about the
// cumulative precedence in prose. This module factors the token → effect
// map into one table and a small dispatcher that unions effects across all
// present tokens.
//
// Token vocabulary lives in schemas/tsm-scene.schema.json. This table must
// stay in sync with the tokens scenes actually emit; unknown tokens are
// silently skipped (forward-compat: the schema permits arbitrary strings,
// so a token added to the schema but not yet wired here is a no-op rather
// than an error).
//
// Cumulative precedence (a higher-tier token implies lower reveal) is
// encoded by listing the cascading flags on the higher token. For example,
// `overlay:module-border` carries `showForward + showBackward + showOverlays`
// because the legacy enum projection always showed both transfer directions
// once module borders were visible. Adding a new reveal token: add a single
// entry below.

export const TOKEN_EFFECTS = {
  "diagonal": {},
  "transfer:directed:forward": { showForward: true },
  "transfer:directed:backward": { showForward: true, showBackward: true },
  // `transfer:signal` is the v0.3 reserved token for kanban-style `s`
  // marks. Signal marks only live above the diagonal, so the effect
  // mirrors `transfer:directed:backward` (cumulative: forward shown
  // alongside, since signals never make narrative sense without the
  // forward production line they overlay).
  "transfer:signal": { showForward: true, showBackward: true },
  "overlay:module-border": { showForward: true, showBackward: true, showOverlays: true },
  // `overlay:firm-boundary` is mostly a no-op flag — render/overlays.js
  // always renders the firm boundary when present. The token is here so
  // a scene can mention it in `reveal.include` for documentation
  // purposes without the dispatcher treating it as unknown.
  "overlay:firm-boundary": {},
  "highlight:cross-region": { showForward: true, showBackward: true, showOverlays: true, highlightCross: true },
};

const DEFAULT_EFFECTS = {
  showForward: false,
  showBackward: false,
  showOverlays: false,
  highlightCross: false,
};

/**
 * Union the effects of all present tokens. Unknown tokens are silently
 * skipped (forward-compat: schema permits arbitrary strings, see
 * schemas/tsm-scene.schema.json). Falsy effect flags from one token never
 * override truthy flags from another — the union is monotone.
 *
 * @param {string[]} tokens
 * @returns {{ showForward: boolean, showBackward: boolean, showOverlays: boolean, highlightCross: boolean }}
 */
export function resolveReveal(tokens) {
  const result = { ...DEFAULT_EFFECTS };
  for (const t of tokens) {
    const eff = TOKEN_EFFECTS[t];
    if (!eff) continue;
    for (const key of Object.keys(eff)) {
      if (eff[key]) result[key] = true;
    }
  }
  return result;
}
