Range slider with filled track, value bubble while dragging, optional ticks, and keyboard support.

```jsx
import { Slider } from "./Slider";

const [vol, setVol] = React.useState(40);
<Slider label="Volume" value={vol} onChange={setVol} />
<Slider label="Price" min={0} max={1000} step={50} showTicks
  formatValue={(v) => `$${v}`} defaultValue={250} />

{/* dual-thumb range: a tuple value (or range) enables two thumbs; onChange emits [lo, hi] */}
<Slider label="Budget" value={[200, 800]} min={0} max={1000} step={50} onChange={setRange} />
```

Props: `value`/`defaultValue` (a `[number, number]` tuple — or `range` — enables **dual-thumb range mode**),
`min`, `max`, `step`, `pageStep`, `precision`, `showValue`, `showTicks`, `formatValue`, `getAriaValueText`
(announce a node `formatValue` to AT), `name` (hidden form field), `disabled`.
`tone` sets the color intent (primary · success · warning · danger · info · neutral, default primary).
Values are clamped into `[min, max]`. Keyboard: ←/→/↑/↓ step, PageUp/PageDown large-step, Home/End to ends.
