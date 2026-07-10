# QA notes — DateRangePicker

- **Group:** inputs
- **Status:** clean
- **Reviewed:** 2026-06-17

## Open issues

- [x] **[P2] Selection logic doesn't prevent end < start** — User can select end date before start date; component doesn't enforce start <= end constraint. Current code likely just stores them but renders range selection logic might be fragile. _Fix:_ Add a callback or internal logic to ensure start <= end; swap if needed. `DateRangePicker.jsx`. — ✓ fixed 2026-06-17

- [x] **[P1] Preset buttons not keyboard accessible** — Not a defect (false positive): the presets are native `<button type="button">` elements (`DateRangePicker.jsx:224`), which are inherently focusable and Enter/Space-activatable; their visible text is their accessible name. No tabIndex/aria-label needed.

## Enhancements

- **[#105] Optional typed range entry** — `editable` renders the trigger as a text `<input>` accepting
  `"start – end"`. The string is split on `–`/`—`/`to`/`..` (never a bare hyphen, so ISO dates survive);
  each side parses via `parse(text) => Date | null` (defaults to `Date.parse`) and commits on Enter/blur,
  normalized so start ≤ end. Off by default. — added 2026-07-04

- **[#207/#206] Interactive header with month + year tiers** — the previously static
  `.twc-drp__title` is now a button that cycles a **3-tier** view machine (`mode`: `days → months →
  years`), mirroring DatePicker. Months view is a 12-cell short-name grid; years view is a 12-cell
  decade grid (padded ±1). A month/year is highlighted `data-selected` when either range endpoint
  falls in it. Prev/next arrows step by month/year/decade to match the view (labels update too), and
  both grids are arrow-key navigable via roving tabindex (`onMonthsKeyDown`/`onYearsKeyDown`). Min/max
  bounds gray out fully out-of-range months/years. — added 2026-07-10

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
