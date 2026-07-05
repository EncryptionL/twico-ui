Dependency-free SVG radar / spider chart — each data row is one axis, and each
series is drawn as a closed polygon over the shared axes.

```jsx
import { RadarChart } from "./RadarChart";

<RadarChart series={["team", "rival"]} showLegend data={[
  { label: "Speed",   team: 80, rival: 65 },
  { label: "Power",   team: 60, rival: 90 },
  { label: "Range",   team: 70, rival: 55 },
  { label: "Defense", team: 85, rival: 60 },
  { label: "Control", team: 50, rival: 75 },
]} />

<RadarChart series={["score"]} max={100} levels={5} data={[
  { label: "Design", score: 92 }, { label: "Perf", score: 74 }, { label: "A11y", score: 88 },
]} />
```

Props: `data` (rows, each one axis: `{label, …series}`), `series` (numeric field
names plotted as polygons), `max` (radial max; default a nice ceiling of the data),
`levels` (grid rings, default 4), `fill` (low-opacity polygon fill, default on),
`showDots`, `showLegend` (defaults on for multi-series), `colors`, `valueFormat`,
`height` (square canvas, default 300), `tableFallback`/`caption`. The chart is
generic over its series keys, so `data` rows are type-checked against `series`. A
visually-hidden data table (`tableFallback`, default on) gives screen readers the
values behind the `role="img"` SVG (WCAG 1.1.1).
