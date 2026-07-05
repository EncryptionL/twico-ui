Dependency-free SVG polar-area (Coxcomb / Nightingale rose) chart — equal-angle slices
whose radius encodes each value, over concentric value rings. Radius scales with `√value`
so slice **area** is proportional (the statistically honest rose encoding).

```jsx
import { PolarAreaChart } from "./PolarAreaChart";

<PolarAreaChart data={[
  { label: "Mon", value: 12 },
  { label: "Tue", value: 30 },
  { label: "Wed", value: 22 },
  { label: "Thu", value: 41 },
  { label: "Fri", value: 18, color: "var(--rose-500)" },
]} valueFormat={(v) => `${v}h`} />

<PolarAreaChart max={100} levels={5} startAngle={-90} showLegend={false} data={[
  { label: "N", value: 40 }, { label: "E", value: 65 }, { label: "S", value: 25 }, { label: "W", value: 80 },
]} />
```

Props: `data` ({label, value, color?}), `max` (radial max at the outer ring; default a nice ceiling
of the largest value), `levels` (grid rings + value ticks; default 4), `startAngle` (deg, clockwise
from top; default 0), `showLegend` (default true), `valueFormat`, `height` (default 280), `colors`,
`ariaLabel`, `tableFallback`/`caption`. Each slice gets a `<title>` tooltip (`label: value`) and a
visually-hidden data table backs the `role="img"` SVG for screen readers (WCAG 1.1.1). Values are
clamped to `[0, max]`, so negatives collapse to the center and never throw.

For plain proportional wedges use **PieChart**/**DonutChart**; for a spoked multi-axis shape use **RadarChart**.
