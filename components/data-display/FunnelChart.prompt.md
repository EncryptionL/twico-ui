Dependency-free SVG funnel chart — descending stages drawn as centered trapezoids
that taper from each stage's value to the next (conversion / drop-off flows).

```jsx
import { FunnelChart } from "./FunnelChart";

<FunnelChart data={[
  { label: "Visits", value: 8200 },
  { label: "Signups", value: 4100 },
  { label: "Trials", value: 1600 },
  { label: "Paid", value: 540 },
]} valueFormat={(v) => v.toLocaleString()} />

<FunnelChart horizontal showPercent={false} height={220} data={[
  { label: "Leads", value: 500, color: "var(--sky-500)" },
  { label: "Qualified", value: 320 },
  { label: "Won", value: 90 },
]} />
```

Props: `data` ({label, value, color?}, ordered widest→narrowest), `showValues` (default on),
`showPercent` (share of the top stage, default on), `horizontal` (left→right instead of top→bottom),
`gap` (px between stages, default 2), `height` (default 300), `colors` (cycled token palette),
`valueFormat`, `ariaLabel`, `tableFallback`/`caption`. Each band scales to the largest stage; the top
stage is the 100% baseline. Per-band `<title>` tooltips plus a visually-hidden data table
(`tableFallback`, default on) give screen readers the values behind the `role="img"` SVG (WCAG 1.1.1).
