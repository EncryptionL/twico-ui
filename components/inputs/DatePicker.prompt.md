Date picker with a calendar popover (month grid + month/year navigation).

```jsx
import { DatePicker } from "./DatePicker";

const [date, setDate] = React.useState(null);
<DatePicker label="Start date" value={date} onChange={setDate}
  min={new Date()} weekStartsOn={1} />
```

Props: `value`/`defaultValue` (Date|null), `min`, `max`, `placeholder`, `clearable`,
`format(date)`, `weekStartsOn` (0/1), `onChange`. Click the header title to switch the calendar
view **days → months → years** (a decade grid); pick a year to drill to its months, a month to
drill to its days. The prev/next arrows step by month, year, or decade to match the active view,
and each grid is arrow-key navigable. Closes on outside-click / Esc.

Set `editable` to render the trigger as a typeable text input with a trailing calendar
button. Typed text commits on Enter/blur via `parse(text) => Date | null` (defaults to a
lenient `Date.parse`); invalid or out-of-range input reverts to the formatted value.

```jsx
<DatePicker editable label="Due date"
  parse={(s) => { const t = Date.parse(s); return Number.isNaN(t) ? null : new Date(t); }} />
```

Set `tone` ("primary" | "success" | "warning" | "danger" | "info" | "neutral", default "primary")
to recolor the control's focus/open border and ring.
