Dependency-free SVG box-and-whisker chart — one box per category summarising a
five-number distribution (min, Q1, median, Q3, max) with whiskers and optional outliers.

```jsx
import { Boxplot } from "./Boxplot";

<Boxplot data={[
  { label: "Group A", min: 12, q1: 24, median: 33, q3: 42, max: 58, outliers: [72] },
  { label: "Group B", min: 18, q1: 30, median: 41, q3: 52, max: 66 },
  { label: "Group C", min: 8,  q1: 20, median: 27, q3: 38, max: 49, outliers: [2, 63] },
]} valueFormat={(v) => `${v}ms`} />
```

Props: `data` (`{ label, min, q1, median, q3, max, outliers? }[]`), `color` (box fill/stroke
accent, default `var(--color-primary)`), `height` (default `300`), `showGrid`, `showAxis`,
`valueFormat` (tooltip + table values), `ariaLabel`, `tableFallback`/`caption`, plus `className`
and any `div` attributes. The value axis auto-scales across every stat and outlier; each box gets
a `<title>` tooltip and the visually-hidden data table (`tableFallback`, default on) exposes the
five-number summary to screen readers behind the `role="img"` SVG (WCAG 1.1.1).

For bar/line/area use **Chart**; for other shapes use the dedicated sibling components.
