Date-range picker with click-start/click-end selection, in-range highlight, and quick presets.

```jsx
import { DateRangePicker } from "./DateRangePicker";

const [range, setRange] = React.useState({ start: null, end: null });
<DateRangePicker label="Reporting period" value={range} onChange={setRange} weekStartsOn={1} />
```

Props: `value`/`defaultValue` ({start,end}), `presets`, `weekStartsOn` (0/1), `placeholder`, `onChange`.
Click a start day, then an end day; presets fill common ranges. Closes on outside-click / Esc.
