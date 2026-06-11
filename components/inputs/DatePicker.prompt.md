Date picker with a calendar popover (month grid + month/year navigation).

```jsx
import { DatePicker } from "./DatePicker";

const [date, setDate] = React.useState(null);
<DatePicker label="Start date" value={date} onChange={setDate}
  min={new Date()} weekStartsOn={1} />
```

Props: `value`/`defaultValue` (Date|null), `min`, `max`, `placeholder`, `clearable`,
`format(date)`, `weekStartsOn` (0/1), `onChange`. Click the month/year title to jump months;
closes on outside-click / Esc.
