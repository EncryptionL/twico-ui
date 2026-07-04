Dependency-free SVG pie / donut chart — proportional slices of a whole from a single
value series, with per-slice tooltips, an optional legend, and a donut center label.

```jsx
import { PieChart } from "./PieChart";

<PieChart data={[
  { label: "Direct", value: 340 },
  { label: "Referral", value: 210 },
  { label: "Social", value: 120 },
]} />

<PieChart donut showLabels data={[
  { label: "Done", value: 62, color: "var(--emerald-500)" },
  { label: "In progress", value: 28 },
  { label: "Blocked", value: 10 },
]} centerLabel="100%" />
```

Props: `data` ({label, value, color?}), `donut` or `innerRadius` (0..1 fraction of the outer
radius), `startAngle` (deg from 12 o'clock), `padAngle` (gap between slices), `showLabels`
(percent labels), `showLegend`, `centerLabel` (donut center; defaults to the formatted total),
`valueFormat`, `height`, `colors`, `ariaLabel`, `tableFallback`/`caption`. Only positive values
contribute a slice; a zero total renders an empty state. A visually-hidden data table
(`tableFallback`, default on) exposes each slice's value and share behind the `role="img"` SVG
(WCAG 1.1.1). For bar/line/area use **Chart**; for other shapes use the dedicated siblings.
