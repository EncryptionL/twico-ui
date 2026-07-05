Dependency-free SVG candlestick (OHLC) chart — one candle per period with a
high→low wick and an open→close body, colored green/red by direction.

```jsx
import { Candlestick } from "./Candlestick";

<Candlestick
  valueFormat={(v) => `$${v}`}
  data={[
    { label: "Mon", open: 132, high: 138, low: 130, close: 136 },
    { label: "Tue", open: 136, high: 141, low: 134, close: 135 },
    { label: "Wed", open: 135, high: 137, low: 128, close: 129 },
    { label: "Thu", open: 129, high: 133, low: 127, close: 132 },
  ]}
/>
```

Props: `data` ({label, open, high, low, close}), `upColor`/`downColor` (candle colors,
default token success/danger), `height`, `showGrid`, `showAxis`, `valueFormat` (tooltip +
table values), `tableFallback`/`caption`, `ariaLabel`. The value axis spans the full
low→high range (candlesticks don't start at zero); x labels thin out automatically when
dense; a doji keeps a ~1px body. Each candle carries an `O H L C` `<title>` tooltip, and a
visually-hidden data table (`tableFallback`, default on) gives screen readers the values
behind the `role="img"` SVG (WCAG 1.1.1).
