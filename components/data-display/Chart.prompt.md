Dependency-free SVG cartesian chart — vertical/horizontal bars (grouped or stacked),
line, and area (straight / smooth / stepped), single or multi-series.

```jsx
import { Chart } from "./Chart";

<Chart type="bar" data={[
  { label: "Mon", value: 240 }, { label: "Tue", value: 310 }, { label: "Wed", value: 280 },
]} valueFormat={(v) => `$${v}`} />

<Chart type="area" smooth series={["signups", "active"]} showLegend stacked data={[
  { label: "Jan", signups: 120, active: 80 },
  { label: "Feb", signups: 180, active: 140 },
]} />

<Chart type="bar" horizontal series={["a", "b"]} stacked data={[{ label: "Q1", a: 12, b: 8 }]} />
```

Props: `type` (`bar` | `column` | `line` | `area`; `column` = `bar`), `data` ({label, …series}), `series`,
`stacked`, `horizontal` (bars), `curve` (`straight`/`smooth`/`stepped`) or `smooth`, `showDots`, `height`,
`showGrid`, `showAxis`, `showLegend`, `colors`, `valueFormat`, `tableFallback`/`caption`. The chart is generic
over its series keys, so `data` rows are type-checked against `series`. A visually-hidden data table
(`tableFallback`, default on) gives screen readers the values behind the `role="img"` SVG (WCAG 1.1.1).

For non-cartesian shapes use the dedicated sibling components: **PieChart**/**DonutChart**, **Gauge**,
**Sparkline**, **ScatterChart**/**BubbleChart**, **RadarChart**, **PolarAreaChart**, **Heatmap**,
**FunnelChart**, **Treemap**, **Candlestick**, **Boxplot**, **RangeChart**.
