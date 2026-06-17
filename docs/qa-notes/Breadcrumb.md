# QA notes — Breadcrumb

- **Group:** navigation
- **Status:** open
- **Reviewed:** 2026-06-17

## Open issues

- [ ] **[P2] Custom non-icon separator is not announced and may mis-flip in RTL** — The RTL mirror rule targets `[dir="rtl"] .twc-breadcrumb__sep svg` only, so it applies to the default chevron and any SVG a consumer passes as `separator`, but a text separator (e.g. `/` or `›`) gets no RTL handling. Conversely, a directional SVG separator the consumer intends to keep fixed will be force-flipped. The separator wrapper is `aria-hidden` (correct), so this is purely visual. _Fix:_ document that custom separators should be RTL-neutral, or scope the flip to the built-in chevron only (e.g. a `data-default-sep` marker). `components/navigation/Breadcrumb.jsx:11,83`.

## Verified OK

- **Current page semantics:** the last item renders as a non-link `<span aria-current="page">` (cursor:default, no hover), earlier items as `<a>`. Root is `<nav aria-label="Breadcrumb">`. `components/navigation/Breadcrumb.jsx:57,64-72`.
- **safeHref sanitization:** `javascript:`/`data:`/`vbscript:` (incl. control-char obfuscation) stripped before the DOM href; non-last items fall back to `"#"` only when no href, but they are genuine links so this is acceptable. `components/navigation/Breadcrumb.jsx:18-22,76`.
- **Collapse logic:** past `maxItems`, keeps first 1 + last `(maxItems-1)` with a `{ ellipsis: true }` marker; the ellipsis is a real `<button type="button" aria-label="Show more">` that expands on click. `maxItems = 0` disables collapsing. Edge cases (`maxItems = 1`, `items.length <= maxItems`) degrade sensibly. `components/navigation/Breadcrumb.jsx:46-54,62-63`.
- **Separator RTL (default):** the default chevron flips under `dir="rtl"` via `transform: scaleX(-1)`, and the separator wrapper is `aria-hidden`. `components/navigation/Breadcrumb.jsx:9-11,83`.
- **Icons:** per-item leading icon wrapped in an `aria-hidden` inline-flex span. `components/navigation/Breadcrumb.jsx:70-71,79`.
- **Wrapping:** `flex-wrap: wrap` so long trails wrap rather than overflow. `components/navigation/Breadcrumb.jsx:4`.
- **SSR-safe:** style injection in `useInsertionEffect`; no module/render-scope DOM access.
- **Note (not a bug):** `display.map((it, i) => key={i})` uses index keys, but `display` is recomputed each render and the list is small/static; acceptable here.
