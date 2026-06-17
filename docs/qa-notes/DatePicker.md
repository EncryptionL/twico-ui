# QA notes — DatePicker

- **Group:** inputs
- **Status:** open
- **Reviewed:** 2026-06-17

## Open issues

- [ ] **[P2] Month/year navigation doesn't constrain to current date bounds** — User can navigate calendar forward indefinitely but there's no maxDate prop to prevent selection outside a valid range. Consider adding min/maxDate constraints if the use case requires it. Currently only enforces disabledDates. `DatePicker.jsx`.

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
