Range slider with filled track, value bubble while dragging, optional ticks, and keyboard support.

```jsx
import { Slider } from "./Slider";

const [vol, setVol] = React.useState(40);
<Slider label="Volume" value={vol} onChange={setVol} />
<Slider label="Price" min={0} max={1000} step={50} showTicks
  formatValue={(v) => `$${v}`} defaultValue={250} />
```

Props: `value`/`defaultValue`, `min`, `max`, `step`, `showValue`, `showTicks`, `formatValue`, `disabled`.
`tone` sets the color intent (primary · success · warning · danger · info · neutral, default primary).
Keyboard: ←/→/↑/↓ step, Home/End to ends.
