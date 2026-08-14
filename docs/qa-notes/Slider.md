# QA notes — Slider

- **Group:** inputs
- **Status:** clean
- **Reviewed:** 2026-06-17

## Open issues

- [x] **[P2] Slider value label color hardcoded to primary** — Line 17 of CSS shows `.twc-slider__value { color: var(--color-primary) }` but should respect tone variant. If tone="danger", the value should display in danger color. _Fix:_ Use `color: var(--_accent)` like other tone-aware components. `Slider.jsx:CSS line 17`. — ✓ fixed 2026-06-17

- [x] **[P2] No validation of min/max/step** — ✓ fixed 2026-06-17 (guarded locals: non-finite min→0, max≤min→min+1, step≤0→1, applied everywhere; valid props unchanged). `Slider.jsx`.

## Enhancements

- **[#351] `editable` — typed numeric inputs, synced with the thumbs** — opt-in `editable` renders a numeric
  input in the header (two inputs in range mode) so users can enter an exact value by hand, in addition to
  dragging. Uses `typed[i]` to hold the raw uncommitted string while focused (so partial entry isn't clamped
  mid-keystroke); commits on blur/Enter through the shared `setThumb` (clamp → snap to `step` → cross-clamp
  `start ≤ end` → `commit`), ArrowUp/Down step, and a blank/invalid entry reverts. Shows the RAW number (not
  `formatValue`, which could be non-parseable like `"$200"`). Name-based form submission still uses the
  existing hidden inputs (the editable inputs are UI-only). 6 tests in `tests/Slider.test.jsx`; site
  variations "Dual-thumb range" + "Editable — type an exact value". — added 2026-08-14

## Verified OK

- Controlled/uncontrolled value (value/defaultValue/onChange)
- min/max range constraints enforced (line 82)
- step snapping works correctly (line 81)
- Clamping prevents out-of-range values
- Pointer down/move/up event handling (lines 92-99)
- Percentage calculation correct (line 78)
- Fill bar renders from 0 to current value position
- Thumb renders at correct position with transform
- Label and value display with conditional showValue (line 55)
- Hint and error messages support
- All tone variants apply to fill bar and thumb border
- Size variants: standard, no size prop (fixed dimensions)
- Disabled state reduces opacity and prevents interaction
- Ticks render when showTicks=true (positions calculated)
- Value bubble shows on drag (line 41)
- formatValue callback allows custom display format
- Track area fully clickable to jump to position
- RTL-safe: left/right absolute positioning works logically
- Touch-action: none prevents pan during drag
- SSR-safe: useInsertionEffect
