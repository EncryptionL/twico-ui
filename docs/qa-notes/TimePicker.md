# QA notes — TimePicker

- **Group:** inputs
- **Status:** clean (new)
- **Added:** 2026-07-10 (#223)

## Why it exists

[#223] The library covered dates (DatePicker/DateRangePicker) but had **no way to pick a
time-of-day** — no appointment start, deadline hour, or shift window. `TimePicker` fills that gap
with a column-spinner popover (the MUI *MultiSectionDigitalClock* pattern): scrollable **hour** and
**minute** columns, an optional **second** column (`granularity="second"`), and a dedicated **AM/PM**
column in `hourCycle={12}` mode.

## Design decisions

- **Emits a `Date`, not a string** — the date part comes from the current value (or `referenceDate`,
  default today), the time part from the columns. This is what lets [DateTimePicker](./DateTimePicker.md)
  compose DatePicker + TimePicker over one `Date`.
- **Column spinners over a flat time list** — a flat 00:00–23:59 list is 288–2880 rows; columns scale
  to seconds and 12/24-hour without an unwieldy list, matching MUI's default TimePicker.
- **min/max compare only the time-of-day** (`h*3600+m*60+s`), so bounds are date-agnostic. An hour is
  disabled only when its whole span is out of range; minutes/seconds check the concrete candidate.
- **Reuses the DatePicker chassis** — same field wrapper (`twc-field`), tone/size/clearable/editable
  API, portal-to-`<body>` + fixed positioning + flip, `useFocusTrap`, outside-click/Esc close. Typed
  entry (`editable`) parses `HH:MM[:SS] [am/pm]` via a built-in matcher (overridable with `parse`).

## Verified OK

- Controlled/uncontrolled (`value`/`defaultValue`/`onChange`); emits a `Date` with the picked time.
- 24-hour (24 options) and 12-hour (12 options + AM/PM column, correct 24h conversion).
- `minuteStep`/`secondStep` shape the columns; `granularity` toggles the minute/second columns.
- `min`/`max` disable out-of-range options; selected option scrolls into view on open.
- Roving keyboard nav (↑/↓ within a column, ←/→ across columns, Home/End); focus trap + restore.
- Clearable ✕; `editable` typed entry commits on Enter/blur and reverts invalid input.
- Tone/size/disabled/required/label/hint/error; SSR-safe (`useScopedStyles`, no module-scope DOM).
- Tests: [`tests/timepicker.test.jsx`](../../tests/timepicker.test.jsx).
