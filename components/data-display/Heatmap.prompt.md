Dependency-free SVG heatmap — a matrix of colored cells keyed by (x, y), each
shaded by a single-hue intensity scale between `min` and `max`.

```jsx
import { Heatmap } from "./Heatmap";

<Heatmap
  xLabel="Hour"
  yLabel="Day"
  data={[
    { x: "9a", y: "Mon", value: 12 }, { x: "12p", y: "Mon", value: 48 }, { x: "3p", y: "Mon", value: 30 },
    { x: "9a", y: "Tue", value: 20 }, { x: "12p", y: "Tue", value: 62 }, { x: "3p", y: "Tue", value: 41 },
  ]}
/>

<Heatmap showValues colorScale="var(--emerald-500)" valueFormat={(v) => `${v}%`} data={cells} />
```

Props: `data` (`{ x, y, value }[]` — X columns and Y rows are derived in first-seen order),
`min`/`max` (color-scale bounds; default the data range), `colorScale` (base token color for the
high end, default `var(--brand-500)`), `showValues`, `cellGap` (px, default 2), `radius`
(cell corner radius, default 2), `xLabel`/`yLabel`, `showLegend` (gradient scale bar, default on),
`valueFormat`, `height` (default 300), `ariaLabel`, `tableFallback`/`caption`. Cell fill is a
`color-mix` of `colorScale` over transparent by intensity, so dark mode flips automatically; missing
(x, y) cells render faint. Each cell carries a `<title>` tooltip and a visually-hidden data table
(one row per Y, one column per X) backs the `role="img"` SVG for screen readers (WCAG 1.1.1).

For other shapes use the dedicated sibling components: **Chart** (bar/line/area), **PieChart**,
**Gauge**, **Sparkline**, **ScatterChart**, **RadarChart**, **FunnelChart**, **Treemap**.
