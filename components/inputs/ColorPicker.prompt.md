Color picker — saturation/value square, hue slider, hex input, and preset swatches.

```jsx
import { ColorPicker } from "./ColorPicker";

const [color, setColor] = React.useState("#6366F1");
<ColorPicker label="Brand color" value={color} onChange={setColor} />
<ColorPicker defaultValue="#14B8A6" presets={["#6366F1","#14B8A6","#F43F5E"]} />
```

Props: `value`/`defaultValue` (hex), `presets` (hex[]), `onChange(hex)`. Opens a popover; closes on outside-click / Esc. Set `tone` (`"primary" | "success" | "warning" | "danger" | "info" | "neutral"`) to recolor the hex input's focus accent.
