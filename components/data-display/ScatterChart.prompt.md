Dependency-free SVG scatter / bubble chart — plots x/y points across two
nice-scaled numeric axes, one or many series. Give points a `z` (or set `bubble`)
to size the dots by a third dimension.

```jsx
import { ScatterChart } from "./ScatterChart";

<ScatterChart series={[
  { name: "Group A", points: [{ x: 12, y: 30 }, { x: 20, y: 45, label: "peak" }] },
  { name: "Group B", points: [{ x: 15, y: 22 }, { x: 28, y: 38 }] },
]} xLabel="Weight" yLabel="Score" />

// Bubble chart — a numeric z auto-enables sizing (or pass bubble)
<ScatterChart maxBubble={32} series={[
  { name: "Markets", points: [
    { x: 40, y: 12, z: 900, label: "US" },
    { x: 22, y: 30, z: 400, label: "EU" },
  ] },
]} valueFormat={(v) => v.toLocaleString()} />
```

Props: `series` (`{ name?, color?, points: { x, y, z?, label? }[] }[]`), `bubble` (size dots by `z`;
auto-on when any point has a numeric `z`), `maxBubble` (max bubble radius px, default 26), `dotRadius`
(fixed radius when not bubbling, default 4.5), `height`, `xLabel`/`yLabel` (axis titles), `showGrid`,
`showLegend` (defaults on for >1 series), `xFormat`/`yFormat`/`valueFormat`, `ariaLabel`,
`tableFallback`/`caption`. Bubble area scales with `z` (radius ∝ √z). Each dot carries a `<title>`
tooltip and the whole chart mirrors into a visually-hidden data table (one row per point, columns
`x`/`y`(/`z`)) so screen readers get the values behind the `role="img"` SVG (WCAG 1.1.1). Empty,
single-point and identical-coordinate data are all handled without dividing by zero.

For bars/line/area use **Chart**; for other shapes use **PieChart**/**DonutChart**, **Gauge**,
**Sparkline**, **RadarChart**, **PolarAreaChart**, **Heatmap**, **FunnelChart**, **Treemap**,
**Candlestick**, **Boxplot**, **RangeChart**.
