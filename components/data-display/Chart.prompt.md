Dependency-free SVG chart — bar or line, single or multi-series, animated.

```jsx
import { Chart } from "./Chart";

<Chart type="bar" data={[
  { label: "Mon", value: 240 }, { label: "Tue", value: 310 }, { label: "Wed", value: 280 },
]} valueFormat={(v) => `$${v}`} />

<Chart type="line" series={["signups", "active"]} showLegend data={[
  { label: "Jan", signups: 120, active: 80 },
  { label: "Feb", signups: 180, active: 140 },
]} />
```

Props: `type` (bar/line), `data` ({label, …series}), `series`, `height`, `showGrid`, `showAxis`,
`showLegend`, `valueFormat`, `tableFallback`/`caption`. The chart is generic over its series keys, so
`data` rows are type-checked against `series`. A visually-hidden data table (`tableFallback`, default on)
gives screen readers the values behind the `role="img"` SVG (WCAG 1.1.1).
