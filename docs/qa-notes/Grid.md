# QA notes — Grid

- **Group:** layout
- **Status:** clean
- **Reviewed:** 2026-06-17

## Open issues
(none)

## Verified OK
- **Responsive auto-fill grid** — `minChildWidth` uses `repeat(auto-fill, minmax(min(size, 100%), 1fr))`, which reflows columns dynamically as container width changes; the `min(size, 100%)` prevents overflow on tiny screens.
- **Fixed-column fallback** — when `minChildWidth` is not set, `columns` prop creates a fixed `repeat(N, minmax(0, 1fr))` layout with equal-width columns.
- **Gap token conversion** — numeric `gap` maps to `var(--space-N)`; string CSS lengths like `"2rem"` pass through.
- **Alignment props** — `align` (alignItems) and `justify` (justifyItems) control cell positioning within tracks; works as expected in variations demo.
- **Semantic flexibility** — `as` prop renders any tag (e.g. `<ul>`) while preserving grid layout.
- **XSS protection on href** — `<a>` tags filter javascript:/data:/vbscript: URLs via `safeHref()`.
- **RTL-ready** — CSS Grid's logical auto-fill behavior respects text direction automatically.
- **SSR-safe** — no window/document at module/render scope.
- **minmax(0, 1fr) safety** — prevents flex/grid items from overflowing their container on content overflow.
