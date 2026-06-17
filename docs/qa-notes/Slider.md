# QA notes — Slider

- **Group:** inputs
- **Status:** clean
- **Reviewed:** 2026-06-17

## Open issues

- [x] **[P2] Slider value label color hardcoded to primary** — Line 17 of CSS shows `.twc-slider__value { color: var(--color-primary) }` but should respect tone variant. If tone="danger", the value should display in danger color. _Fix:_ Use `color: var(--_accent)` like other tone-aware components. `Slider.jsx:CSS line 17`. — ✓ fixed 2026-06-17

- [x] **[P2] No validation of min/max/step** — ✓ fixed 2026-06-17 (guarded locals: non-finite min→0, max≤min→min+1, step≤0→1, applied everywhere; valid props unchanged). `Slider.jsx`.

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
