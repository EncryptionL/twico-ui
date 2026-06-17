# QA notes — Rating

- **Group:** inputs
- **Status:** open
- **Reviewed:** 2026-06-17

## Open issues

- [ ] **[P2] Keyboard interaction only works if a star has focus** — Roving tabindex set to tabStar (line 86) but if user tabs away and tabs back, focus may not restore to the last star. No explicit focus management on tab back-in. _Fix:_ Consider storing focused star in state and restoring focus on mount if component regains focus. `Rating.jsx:86`.

## Verified OK

- Controlled/uncontrolled value (value/defaultValue/onChange)
- Count prop determines number of stars rendered
- Hover shows preview of rating before click
- Click toggles rating on/off (click same star again = unset)
- Keyboard: ArrowRight/Left/Up/Down adjust; Home/End jump
- All tone variants render star color correctly (primary/success/warning/danger/info/neutral)
- Size variants (sm/md/lg) scale star width/height
- readOnly mode disables interaction but shows value
- Disabled state reduces opacity and prevents interaction
- showValue displays decimal rating (e.g., "4.5")
- Custom color prop overrides tone (CSS variable --_c)
- role="radiogroup" and role="radio" on buttons
- aria-checked reflects star selection state
- aria-label describes each star count
- aria-disabled on group when disabled
- Roving tabindex pattern: only tabStar has tabIndex=0
- SSR-safe: useInsertionEffect
