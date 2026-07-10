# QA notes — DateTimePicker

- **Group:** inputs
- **Status:** clean (new)
- **Added:** 2026-07-10 (#223)

## Why it exists

[#223] Scheduling/production records need a **date *and* a time** (shift windows, deadline hours).
`DateTimePicker` holds a single `Date` and edits both halves: picking a day keeps the current time,
picking a time keeps the current day.

## Design decisions

- **Composite, not a re-implementation** — it renders a [DatePicker](./DatePicker.md) and a
  [TimePicker](./TimePicker.md) side by side (§5 composite exception, like `AvatarMenu → Menu`). No
  calendar or time-column logic is duplicated; both halves inherit their siblings' behavior and a11y.
- **Single `Date` value** — `onDateChange` merges the new Y/M/D with the existing time (midnight when
  none yet); `onTimeChange` merges the new time with the existing date (the time's own date when none).
  The inner TimePicker takes `referenceDate={value}` so a time-first pick lands on the right day.
- **`min`/`max`/`disabledDate` bound the DATE** (via the inner DatePicker); the time is unbounded —
  documented, keeps the composition simple. A future enhancement could clamp the time on the boundary day.
- **Error styling without duplication** — on `error`, both controls get `tone="danger"` (red
  border/ring) while the message renders once on the wrapper (no doubled error string).
- **Clear** — the date control's ✕ clears the whole value (`clearable`); the inner TimePicker is
  `clearable={false}` so time can't be cleared independently of the date.

## Verified OK

- Controlled/uncontrolled (`value`/`defaultValue`/`onChange`); emits one merged `Date`.
- Date pick preserves time; time pick preserves date; time-first pick uses today's date.
- `granularity`/`hourCycle`/`minuteStep`/`secondStep` forwarded to the time half; `weekStartsOn`/
  `locale`/`min`/`max`/`disabledDate` to the date half.
- Tone/size/disabled/required/label/hint/error; group semantics (`role="group"` + `aria-labelledby`).
- SSR-safe; className-free layout via `useScopedStyles`.
- Tests: [`tests/timepicker.test.jsx`](../../tests/timepicker.test.jsx) (DateTimePicker block).
