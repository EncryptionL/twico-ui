Time-of-day picker with a column-spinner popover (scrollable hour / minute / second columns).

```jsx
import { TimePicker } from "./TimePicker";

const [time, setTime] = React.useState(null);
<TimePicker label="Start time" value={time} onChange={setTime} minuteStep={15} />
```

Emits a `Date` — the date part comes from the current value (or `referenceDate`, default today),
the time part from the columns — so it composes with `DatePicker` into a `DateTimePicker`.
Props: `value`/`defaultValue` (Date|null), `granularity` ("hour" | "minute" | "second"),
`hourCycle` (24 | 12, adds an AM/PM column), `minuteStep`/`secondStep`, `min`/`max` (Date; only the
time-of-day is compared), `clearable`, `format(date)`, `locale`, `onChange`. Click a value in each
column; the selected value scrolls into view. Arrow keys move within a column, Left/Right jump columns.
Closes on outside-click / Esc.

Set `editable` to type the time as `"HH:MM"` / `"HH:MM:SS"` (optional `am`/`pm`); it commits via
`parse(text) => Date | null` (defaults to a built-in matcher) on Enter/blur, reverting invalid input.
`tone` ("primary" | "success" | "warning" | "danger" | "info" | "neutral") sets the focus/open accent.
