Date-range picker with click-start/click-end selection, in-range highlight, and quick presets.

```jsx
import { DateRangePicker } from "./DateRangePicker";

const [range, setRange] = React.useState({ start: null, end: null });
<DateRangePicker label="Reporting period" value={range} onChange={setRange} weekStartsOn={1} />
```

Props: `value`/`defaultValue` ({start,end}), `presets`, `weekStartsOn` (0/1), `placeholder`, `onChange`,
`min`/`max` (Date) and `disabledDate(date) => boolean` to bound the selectable range (parity with DatePicker).
Click a start day, then an end day; presets fill common ranges. Click the header title to switch the
calendar view **days → months → years** (a decade grid) for fast jumps across time — pick a year to
drill to its months, a month to drill to its days; the prev/next arrows step by month/year/decade to
match the active view. Closes on outside-click / Esc; the visible month is announced to screen readers
via a live region.
`tone` ("primary" | "success" | "warning" | "danger" | "info" | "neutral") sets the control's focus/open accent color.

Set `editable` to type the range as `"start – end"` (split on `–`/`to`/`..`); each side parses via
`parse(text) => Date | null` (defaults to `Date.parse`) and commits on Enter/blur, normalized so start ≤ end.
