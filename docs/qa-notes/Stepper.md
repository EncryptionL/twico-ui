# QA notes — Stepper

- **Group:** navigation
- **Status:** clean
- **Reviewed:** 2026-06-17

## Open issues

- [x] **[P1] Clickable steps are not keyboard-operable** — When `clickable` is set, the click handler is attached to the step's `<div>` (`onClick={() => onStepClick?.(i)}`) with only a `data-clickable` + `cursor:pointer` style. The element is not focusable (no `tabIndex`), exposes no `role="button"`, and has no `onKeyDown` for Enter/Space, so keyboard and screen-reader users cannot activate steps that mouse users can. _Fix:_ when `isClickable`, render the indicator/step as a `<button type="button">` (or add `role="button"`, `tabIndex={0}`, and an Enter/Space `onKeyDown`). `components/navigation/Stepper.jsx:88-89,102-103`. — ✓ fixed 2026-06-17
- [x] **[P2] No programmatic indication of the current step** — The active step is conveyed only visually (ring + color via `data-state="active"`). There is no `aria-current="step"` (or any text alternative) on the active step, and the check/bang glyphs are `aria-hidden`, so assistive tech cannot tell which step is current or that earlier steps are complete / a step has errored. _Fix:_ add `aria-current="step"` to the active step and a visually-hidden status label (e.g. "completed", "error") so state is announced. `components/navigation/Stepper.jsx:88,102`. — ✓ fixed 2026-06-17

## Verified OK

- **State logic:** `stateOf` resolves error → complete (`i < active`) → active (`i === active`) → upcoming; complete shows a check, error a bang, otherwise the custom icon or 1-based number. `components/navigation/Stepper.jsx:68-73,83`.
- **Tone axis:** 6 tones remap a `--_accent` custom-property family (mirrors Button/Badge); connectors and rings inherit it. Neutral falls back to text/surface. `components/navigation/Stepper.jsx:6-11`.
- **Horizontal connector is RTL-safe:** positioned with `inset-inline-start: calc(50% + 22px)` / `inset-inline-end: calc(-50% + 22px)` (logical), and the last step omits the connector. Vertical connector uses `margin-inline-start`. `components/navigation/Stepper.jsx:36-37`.
- **clickable guard:** only steps with `i <= active` are clickable, so users cannot jump ahead to incomplete steps; `onStepClick` only wired when `isClickable`. `components/navigation/Stepper.jsx:80,89,103`.
- **Indicator stacking:** `z-index: 1` on the indicator keeps it above the absolute horizontal connector. `components/navigation/Stepper.jsx:18`.
- **SSR-safe:** style injection in `useInsertionEffect`; no module/render-scope DOM access.
- **Reduced-motion:** the hover `transform: scale(1.06)` and color transitions are token-timed and collapsed by the global reduced-motion handling.
