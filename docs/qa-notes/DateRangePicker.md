# QA notes — DateRangePicker

- **Group:** inputs
- **Status:** clean
- **Reviewed:** 2026-06-17

## Open issues

- [x] **[P2] Selection logic doesn't prevent end < start** — User can select end date before start date; component doesn't enforce start <= end constraint. Current code likely just stores them but renders range selection logic might be fragile. _Fix:_ Add a callback or internal logic to ensure start <= end; swap if needed. `DateRangePicker.jsx`. — ✓ fixed 2026-06-17

- [x] **[P1] Preset buttons not keyboard accessible** — Not a defect (false positive): the presets are native `<button type="button">` elements (`DateRangePicker.jsx:224`), which are inherently focusable and Enter/Space-activatable; their visible text is their accessible name. No tabIndex/aria-label needed.

## Verified OK

- Controlled/uncontrolled date range (value/defaultValue/onChange)
- Portal mode with fixed positioning and viewport flip
- Two-calendar side-by-side layout (presets on left, calendars on right)
- Month/year navigation on right calendar (left locked to current month)
- Preset shortcuts (Last 7 days, Last 30 days, etc.)
- Start/end date highlighting with different styles (line 52-55)
- In-range dates highlighted with primary-subtle background
- Start/end edges rounded correctly (line 53-55)
- Locale and weekStartsOn support (inherited from DatePicker)
- Clear functionality to reset range
- Format display shows "Jan 1 - Dec 31, 2026" style
- Required asterisk and error message support
- Label, hint, error rendering conditional
- Disabled state reduces opacity
- SSR-safe: useInsertionEffect
