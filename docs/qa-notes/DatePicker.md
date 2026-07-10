# QA notes — DatePicker

- **Group:** inputs
- **Status:** clean
- **Reviewed:** 2026-06-17

## Open issues

- [x] **[P2] Month/year navigation doesn't constrain to current date bounds** — User can navigate calendar forward indefinitely but there's no maxDate prop to prevent selection outside a valid range. Consider adding min/maxDate constraints if the use case requires it. Currently only enforces disabledDates. `DatePicker.jsx`. — ✓ fixed 2026-06-17

## Enhancements

- **[#105] Optional typed date entry** — `editable` renders the trigger as a real text `<input>`
  with a trailing calendar toggle button. Typed text commits on Enter/blur via `parse(text) => Date | null`
  (defaults to a lenient `Date.parse`); invalid or out-of-range input reverts to the formatted value,
  an empty string clears. Off by default (zero change for existing consumers). — added 2026-07-04

- **[#206] Year/decade view tier** — the header title now cycles a **3-tier** view machine
  (`mode`: `days → months → years`). The years tier is a 12-cell decade grid (`Math.floor(y/10)*10`,
  padded ±1); picking a year drills to that year's months, picking a month drills to its days. Prev/next
  arrows step by decade in years view (±10y), and their `aria-label` reflects the active view
  ("Previous/Next decade|year|month"). Each grid has roving-tabindex arrow-key nav (`onYearsKeyDown`,
  ±1 horizontal / ±3 vertical / Home–End to the decade edges). — added 2026-07-10

## Verified OK

- Controlled/uncontrolled date (value/defaultValue/onChange)
- Portal mode with fixed positioning and viewport flip
- Calendar grid renders correctly with proper day layout
- Month/year navigation buttons functional
- Today highlighted with border indicator
- Selected date highlighted with accent background
- Locale-aware month/day names via Intl API (lines 77-91)
- weekStartsOn prop allows Sunday/Monday as first column (line 90)
- Format options (locale, format string support)
- Disabled state reduces opacity and prevents interaction
- Required asterisk and error message support
- Label, hint, error rendering conditional
- Clear button appears when value selected
- Keyboard navigation through calendar
- aria-label and role="dialog" on popover
- SSR-safe: useInsertionEffect guards styles
