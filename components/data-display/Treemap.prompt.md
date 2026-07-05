Dependency-free SVG treemap — a squarified partition where each tile's area is
proportional to its value, packed to keep tiles close to square.

```jsx
import { Treemap } from "./Treemap";

<Treemap
  height={300}
  ariaLabel="Cloud spend by service"
  valueFormat={(v) => `$${v.toLocaleString()}`}
  data={[
    { label: "Compute", value: 4200 },
    { label: "Storage", value: 2600 },
    { label: "Network", value: 1800 },
    { label: "Database", value: 1500 },
    { label: "Other", value: 700, color: "var(--slate-500)" },
  ]}
/>
```

Props: `data` ({label, value, color?}), `showValues` (label + value inside tiles that fit,
default on), `valueFormat`, `height` (default 300; also sets the SVG aspect ratio), `colors`
(cycled palette), `gap` (px between tiles, default 2), `ariaLabel`, `tableFallback`/`caption`.
Negative values are clamped to 0 and an empty or zero-total dataset renders a "No data" tile.
Tiles too small for text still show a hover `<title>`; a visually-hidden data table (value +
share) backs the `role="img"` SVG for screen readers (WCAG 1.1.1).

For other proportion/size views use the dedicated sibling components: **PieChart**/**DonutChart**,
**FunnelChart**, or the cartesian **Chart** (bar / line / area).
