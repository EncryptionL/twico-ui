Dependency-free SVG range chart — horizontal range bars (a timeline / Gantt of
one min→max band per row) or a range area (a shaded band between a per-category
min and max line). Covers ApexCharts rangeBar + rangeArea.

```jsx
import { RangeChart } from "./RangeChart";

// Timeline / Gantt: one min→max bar per row
<RangeChart type="bar" data={[
  { label: "Design", min: 0, max: 4 },
  { label: "Build", min: 3, max: 9, color: "var(--sky-500)" },
  { label: "Launch", min: 8, max: 12 },
]} valueFormat={(v) => `wk ${v}`} />

// Range area: a band between a min line and a max line across categories
<RangeChart type="area" data={[
  { label: "Mon", min: 12, max: 20 },
  { label: "Tue", min: 14, max: 24 },
  { label: "Wed", min: 11, max: 19 },
]} />
```

Props: `type` (`bar` = horizontal timeline/Gantt, `area` = shaded min→max band; default `bar`),
`data` ({label, min, max, color?}), `height`, `showGrid`, `showAxis`, `colors`, `valueFormat`,
`ariaLabel`, `tableFallback`/`caption`. The value axis auto-scales to span every min and max (ranges
aren't anchored at 0) and is negative-safe. Bars carry an optional per-row `color`; the area band uses
the first palette color. Each shape gets a `${label}: ${min} – ${max}` tooltip, and a visually-hidden
`min`/`max` data table (`tableFallback`, default on) backs the `role="img"` SVG for screen readers (WCAG 1.1.1).
