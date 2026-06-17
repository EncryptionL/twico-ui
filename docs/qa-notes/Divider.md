# QA notes — Divider

- **Group:** layout
- **Status:** clean
- **Reviewed:** 2026-06-17

## Open issues
(none)

## Verified OK
- **Two render paths** — unlabeled divider renders `<hr>` with `role="separator"` and `aria-orientation`; labeled divider (children present) renders a `<div>` with `role="separator"` and flex layout for label + pseudo-element lines.
- **CSS injection via useInsertionEffect** — injects `.twc-divider*` styles once on first render via unique ID guard (`document.getElementById("twc-divider-styles")`), preventing style duplication and supporting SSR.
- **Logical align prop** — accepts `"start"/"end"` (logical) or `"left"/"center"/"right"` (physical); `resolve Align()` maps start→left, end→right for internal tracking.
- **RTL support for label alignment** — dedicated `[dir="rtl"]` CSS rules swap flex proportions for ::before and ::after pseudo-elements, ensuring label stays visually at the intended position in RTL layouts.
- **Inset support** — `inset={true}` applies `margin-inline-start: var(--space-4)` to horizontal dividers, indenting from the left (start) for alignment with list content.
- **Vertical divider in flex contexts** — `orientation="vertical"` renders a 1px-wide rule with `align-self: stretch` and `min-height: 1em`; requires parent flex container (expected usage pattern).
- **Pseudo-element lines for labeled variant** — ::before and ::after create the horizontal lines with flex: 1 and flex: 0 0 6px proportions, positioning the label at the specified alignment without additional markup.
- **SSR-safe** — useInsertionEffect is SSR-aware; no window/document at module scope.
