# QA notes — Tooltip

- **Group:** overlay
- **Reviewed:** 2026-06-17
- **Status:** open

## Open issues

- [ ] **[P2] No viewport clamp; `white-space: nowrap` labels can overflow the edge** — The tooltip is `white-space: nowrap` (`Tooltip.jsx:11`) and positioned by setting its leading edge to the trigger center then visually centering via `translate: -50% 0` (top/bottom) (`Tooltip.jsx:15-16`, `Tooltip.jsx:61`). There is no clamp to the viewport, so a long label on a trigger near the left/right edge (or a top/bottom-placed tooltip wider than twice the trigger's distance to the edge) renders partly off-screen. Tooltips never flip either. _Fix:_ clamp the computed coordinate into `[gap, vw - width - gap]` after measuring the tooltip width, or allow wrapping with a `max-width`. `Tooltip.jsx:55-65`

- [ ] **[P2] Stylesheet `data-place` position rules are dead (overridden by inline style) — confusing, not broken** — `TOOLTIP_CSS` sets `top/bottom/left/right` per `data-place` using `calc(100% + 8px)` (`Tooltip.jsx:15-18`), which presumes a positioned parent. Since the tooltip is portaled to `document.body` and given inline `position: fixed` with explicit `left/right/top/bottom` (including `auto`) (`Tooltip.jsx:116`), the inline values win and the CSS offsets are inert — only the `translate` / `transform-origin` / arrow rules from those selectors actually matter. No visible bug, but the dead CSS is a maintenance trap (someone editing the `calc()` offsets will see no effect). _Fix:_ drop the positional declarations from the `data-place` rules and keep only `translate`/`transform-origin`. `Tooltip.jsx:15-18`

## Verified OK

- Portaled to `document.body` with fixed positioning, so it is never clipped by an overflow/scroll ancestor (`Tooltip.jsx:108`, `Tooltip.jsx:52-54`).
- Stays mounted (opacity 0 + `aria-hidden="true"`) once positioned, so the first reveal animates smoothly and the closed state is removed from the a11y tree (`Tooltip.jsx:114-115`, `Tooltip.jsx:66-68`).
- Hover and focus both open; mouseleave/blur close; open is debounced by `delay` and the timer is cleared on close and on Escape (`Tooltip.jsx:49-50`, `Tooltip.jsx:100-105`).
- WCAG 1.4.13: Escape dismisses; the keydown listener is attached only while shown and cleaned up (`Tooltip.jsx:79-86`).
- `aria-describedby` links trigger → tooltip only while shown, and merges with any existing `aria-describedby` on the child rather than clobbering it (`Tooltip.jsx:89-98`).
- Non-element / Fragment children are wrapped in a `<span>` carrying the describedby, so the association still works (`Tooltip.jsx:91-98`).
- Repositions on scroll (capture) + resize while shown; listeners cleaned up (`Tooltip.jsx:69-76`).
- `pointer-events: none` on the tooltip means it never intercepts pointer events or causes a hover flicker over itself (`Tooltip.jsx:7`).
- `prefers-reduced-motion` drops the scale transform and keeps only a linear opacity fade (`Tooltip.jsx:25`).
- Arrow is decorative and `aria-hidden` (`Tooltip.jsx:119`).
- SSR-safe: `place()` runs in an effect (client-only), so SSR renders no portal and there is no hydration diff (`Tooltip.jsx:66-68`).
- RTL: layout is symmetric (centered translate, side offsets), so mirroring is not required for correctness; placement is explicit and physical by design.
