# QA notes — Stack

- **Group:** layout
- **Status:** clean
- **Reviewed:** 2026-06-17

## Open issues
(none)

## Verified OK
- **Flex direction and wrapping** — `direction` prop controls flex-direction (row/column/row-reverse/column-reverse); `wrap={true}` enables flex-wrap for multi-line layouts.
- **minWidth: 0 for text truncation** — prevents flex items from overflowing on long text; necessary for children with `text-overflow: ellipsis` to work correctly.
- **Display toggle (inline vs block)** — `inline={true}` switches from `display: flex` to `display: inline-flex`; useful for inline stacking without line breaks.
- **Gap token conversion** — numeric `gap` maps to `var(--space-N)`; string CSS lengths pass through unchanged.
- **Alignment props** — `align` (alignItems) and `justify` (justifyContent) control child positioning; demos show center/space-between layouts.
- **Semantic flexibility** — `as` prop renders any tag (e.g. `<nav>`, `<ul>`) while preserving flex layout.
- **XSS protection on href** — `<a>` tags filter javascript:/data:/vbscript: URLs via `safeHref()`.
- **RTL-ready** — flexbox layout is logical by default; row→column reversal handled by browser's text direction.
- **SSR-safe** — no window/document at module/render scope.
