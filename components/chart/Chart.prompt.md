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

Props: `type` (bar/line), `data` ({label, …series}), `series`, `height`, `showGrid`, `showAxis`, `showLegend`, `valueFormat`.
