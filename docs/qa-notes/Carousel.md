# QA notes — Carousel

- **Group:** data-display
- **Status:** open (1 issue)
- **Reviewed:** 2026-06-17

## Open issues

- [ ] **[P2] Controlled/uncontrolled state clash** — If a parent switches between controlled (`index={page}`) and uncontrolled (no index prop), the carousel will lose internal state. When `indexProp` changes from a value to undefined (or vice versa), React won't preserve the state manager's intent, causing jumps or stalls. _Fix:_ Document that the component must remain either fully controlled or fully uncontrolled; warn in dev if the prop type changes. `Carousel.jsx:53–56`

- [x] **[#452] a consumer `onMouseEnter` killed the autoplay hover-pause** - `{...rest}` was spread after the internal pointer/key handlers, so any same-named consumer prop replaced them. Composed via `components/_compose.js`. `Carousel.jsx:134` - fixed 2026-10-07

- [x] **[#464] keyboard navigation produced NaN - and emitted it - with no slides** - `go` computes `loop ? (i + count) % count : ...` and `loop` defaults to **true**, so at `count === 0` that is `NaN % 0`. The arrows and dots are gated on `count > 1`, but the key handler sits on the always-rendered `role="region"` wrapper and the viewport is `tabIndex={0}`, so `<Carousel>{[]}</Carousel>` (or an async slide list that has not arrived) is reachable: `onIndexChange(NaN)` reached the consumer and the track rendered `translateX(-NaN%)`. `go` now bails at `count <= 0`; the non-loop branch had the same hole with a different symptom, clamping to `-1`. The double modulo also hardens a negative index. `Carousel.jsx:89` - fixed 2026-10-07

## Verified OK

- **Index math (loop vs no-loop):** Loop wraps correctly via (i + count) % count. No-loop clamps to [0, count-1].
- **Autoplay interval logic:** Suppressed on hover/focus, by the pause button, and under
  `prefers-reduced-motion` (WCAG 2.2.2, #154); also stops when count <= 1 or autoPlay is false.
- **Slide visibility (aria-hidden):** Only the active slide has aria-hidden=false; others are hidden from a11y tree.
- **Arrow button disabled state:** Arrows disable at start/end when loop=false. RTL: SVG scales via [dir="rtl"] scaleX(-1).
- **Dot nav:** Animated width expansion (8px → 22px on active). All dots keyboard-accessible (aria-label per dot).
- **Region keyboard nav (#153):** the focusable region (`tabIndex=0` viewport) handles ArrowLeft/ArrowRight
  (step) + Home/End (first/last); the consumer `onKeyDown` runs first and typing in a slide's form control is ignored.
- **Accessible name (#155):** `label` → `aria-label` → `"Carousel"` fallback; `aria-labelledby` suppresses `aria-label`.
- **Live region (#156):** a visually-hidden `aria-live="polite"` node announces "Slide X of N"; it switches to
  `off` while auto-rotating so automatic changes aren't announced.
- **Keyboard accessible:** Dots and arrows are buttons with proper labels.
