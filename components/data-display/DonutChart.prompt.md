Donut chart — a `PieChart` preset with a hollow center (a ring). Same API as PieChart; `donut` is on by default.

```jsx
import { DonutChart } from "./DonutChart";

<DonutChart
  data={[
    { label: "Direct", value: 42 },
    { label: "Referral", value: 28 },
    { label: "Social", value: 30 },
  ]}
  centerLabel="Traffic"
  showLegend
/>
```

Takes every `PieChart` prop — `data` ({label, value, color?}), `innerRadius` (0..1 hole size, default 0.6),
`startAngle`, `padAngle`, `showLabels`, `showLegend`, `centerLabel`, `valueFormat`, `colors`, `height`,
`tableFallback`/`caption`. Pass `donut={false}` to fall back to a solid pie. A visually-hidden data table
(default on) exposes the slice values behind the `role="img"` SVG.
