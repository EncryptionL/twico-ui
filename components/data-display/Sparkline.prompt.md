A minimal, word-sized trend chart — line, area, or bars, with no axes, grid, or
legend. Dependency-free inline SVG that scales to fill its vertical space.

```jsx
import { Sparkline } from "./Sparkline";

<Sparkline data={[3, 5, 4, 8, 6, 9, 7, 12]} showDots />

<Sparkline area color="var(--emerald-500)" data={[
  { value: 120, label: "Jan" }, { value: 180, label: "Feb" }, { value: 140, label: "Mar" },
]} />

<Sparkline type="bar" height={28} data={[4, 6, 2, 8, 5, 7]} />
```

Props: `data` (bare numbers or `{ value, label }`), `type` (`line` | `area` | `bar`) or the
`area` shorthand, `color`, `width` (default 120), `height` (default 40), `strokeWidth`,
`curve` (`straight`/`smooth`/`stepped`, default `smooth`), `showDots` (emphasize the last
point), `min`/`max` (pin the value scale, else derived from the data), `valueFormat`,
`ariaLabel`, `tableFallback`/`caption`. Empty/flat/degenerate data is guarded — it never
throws or divides by zero. The `<svg role="img">` gets a summarizing aria-label
(point count + first/last/min/max); a hidden data table (`tableFallback`) is off by default
since a sparkline is tiny — turn it on when the exact values must be readable (WCAG 1.1.1).

For a full chart with axes, tooltips, and a legend use **Chart**; for other shapes see
**PieChart**, **Gauge**, **RadarChart**, **Heatmap**, and the rest of the chart family.
