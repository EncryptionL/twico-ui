# QA notes — Accordion

- **Group:** navigation
- **Status:** clean
- **Reviewed:** 2026-06-17

## Open issues

(none)

## Verified OK

- **Disclosure semantics:** trigger is a `<button type="button">` with `aria-expanded` and `aria-controls` pointing at the panel; panel is `role="region"` with `aria-labelledby` back to the trigger. IDs are derived from `React.useId()` so they are stable and SSR-collision-free. `components/navigation/Accordion.jsx:62-73`.
- **Height animation:** uses the `grid-template-rows: 0fr → 1fr` technique with an `overflow:hidden` inner wrapper — animates real content height with no JS measurement, so it works for any content. `components/navigation/Accordion.jsx:21-25`.
- **Visibility timing:** `visibility: hidden` with `transition: …, visibility 0s var(--duration-base)` keeps the closing panel reachable through the collapse, then removes it from the a11y tree and tab order once collapsed; opening flips visibility immediately (`visibility 0s`). Correct on both directions. `components/navigation/Accordion.jsx:21-24`.
- **Controlled/uncontrolled:** `open` (controlled) vs `defaultOpen` (uncontrolled) handled via `openProp !== undefined`; `onOpenChange` always fires with the next `[...set]`. Single vs `multiple` toggle logic is correct (single mode clears the set before adding). `components/navigation/Accordion.jsx:46-56`.
- **Keys:** items keyed by `it.value` (stable), not index. `components/navigation/Accordion.jsx:65`.
- **Chevron:** rotates 180° on open via `data-open`, `aria-hidden`, decorative. Not direction-sensitive, so RTL-safe.
- **RTL:** `text-align: start` on the trigger and `gap`-based layout; no physical-side assumptions.
- **SSR-safe:** style injection in `useInsertionEffect`; no `window`/`document` at module/render scope.
- **Reduced-motion:** transitions are short and token-driven; the global reduced-motion handling in the design system collapses them. No focus-trap or motion-dependent behavior here.
