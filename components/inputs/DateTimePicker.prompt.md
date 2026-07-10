Combined date + time picker over a single `Date` — a DatePicker and a TimePicker side by side.

```jsx
import { DateTimePicker } from "./DateTimePicker";

const [when, setWhen] = React.useState(null);
<DateTimePicker label="Shift start" value={when} onChange={setWhen} hourCycle={12} minuteStep={15} />
```

Holds one `Date`: picking a day keeps the current time, picking a time keeps the current day. Composes
the two sibling pickers (calendar popover + time columns), so it inherits their behavior.
Props: `value`/`defaultValue` (Date|null), `min`/`max` + `disabledDate` (bound the **date**; the time
is free), `granularity` ("hour" | "minute" | "second"), `hourCycle` (24 | 12), `minuteStep`/`secondStep`,
`weekStartsOn`, `locale`, `clearable` (the date control's ✕ clears the whole value), `dateFormat`/
`timeFormat`, `datePlaceholder`/`timePlaceholder`, `onChange`. `tone` sets the accent on both controls;
`error` recolors both and shows the message once on the wrapper.
