Dependency-free SVG radial gauge / radial-bar — a value as a thick arc between two
angles with a centered readout, or several concentric rings via `series`.

```jsx
import { Gauge } from "./Gauge";

<Gauge value={72} label="CPU" valueFormat={(n) => `${Math.round(n)}%`} />

<Gauge value={4.6} min={0} max={5} startAngle={-90} endAngle={90} label="Rating" />

<Gauge size={220} series={[
  { value: 82, label: "Complete", color: "var(--emerald-500)" },
  { value: 54, label: "In review" },
  { value: 23, label: "Blocked" },
]} />
```

Props: `value` (+ `min`/`max`, default 0..100), `startAngle`/`endAngle` (deg, 0 = top,
clockwise; default -110..110), `thickness` (stroke as a fraction of radius), `showValue`,
`label`, `valueFormat` (default rounds to an integer — pass your own to add `%`/units),
`color`, `trackColor`, `size` (px, square). Pass `series` ({value, label?, color?}) to draw
concentric radial bars, each its own track+value, with a `showLegend` legend — the single
`value` is then ignored. A visually-hidden data table (`tableFallback`, default on) plus a
`role="img"` `aria-label` give screen readers the underlying numbers (WCAG 1.1.1).

For bar/line/area use **Chart**; for slices use **PieChart**/**DonutChart**; for a tiny inline
trend use **Sparkline**.
