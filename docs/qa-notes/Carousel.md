# QA notes — Carousel

- **Group:** data-display
- **Status:** open (1 issue)
- **Reviewed:** 2026-06-17

## Open issues

- [ ] **[P2] Controlled/uncontrolled state clash** — If a parent switches between controlled (`index={page}`) and uncontrolled (no index prop), the carousel will lose internal state. When `indexProp` changes from a value to undefined (or vice versa), React won't preserve the state manager's intent, causing jumps or stalls. _Fix:_ Document that the component must remain either fully controlled or fully uncontrolled; warn in dev if the prop type changes. `Carousel.jsx:53–56`

## Verified OK

- **Index math (loop vs no-loop):** Loop wraps correctly via (i + count) % count. No-loop clamps to [0, count-1].
- **Autoplay interval logic:** Respects paused state (on hover). Correctly stops when count <= 1 or autoPlay is false.
- **Slide visibility (aria-hidden):** Only the active slide has aria-hidden=false; others are hidden from a11y tree.
- **Arrow button disabled state:** Arrows disable at start/end when loop=false. RTL: SVG scales via [dir="rtl"] scaleX(-1).
- **Dot nav:** Animated width expansion (8px → 22px on active). All dots keyboard-accessible (aria-label per dot).
- **Pause on hover:** onMouseEnter/Leave pauses autoplay as UX best practice.
- **Keyboard accessible:** Dots and arrows are buttons with proper labels.
