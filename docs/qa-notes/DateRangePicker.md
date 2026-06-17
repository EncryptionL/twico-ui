# QA notes — DateRangePicker

- **Group:** inputs
- **Status:** open
- **Reviewed:** 2026-06-17

## Open issues

- [ ] **[P2] Selection logic doesn't prevent end < start** — User can select end date before start date; component doesn't enforce start <= end constraint. Current code likely just stores them but renders range selection logic might be fragile. _Fix:_ Add a callback or internal logic to ensure start <= end; swap if needed. `DateRangePicker.jsx`.

- [ ] **[P1] Preset buttons not keyboard accessible** — Line 40 renders preset buttons but they lack tabIndex=0 or aria-label, making them hard to discover via keyboard. _Fix:_ Add tabIndex={0} and descriptive aria-label to each preset button. `DateRangePicker.jsx:~line-preset-rendering`.

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
