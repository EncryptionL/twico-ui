# Charts

Twico UI ships a **dependency-free SVG chart family** — no `apexcharts`, `recharts`, `d3`, or
`chart.js`. Every chart is a self-contained React component that renders inline `<svg>`, styles
itself through design tokens (so dark mode + theming are automatic), and exposes a visually-hidden
data table for screen readers. References for the API/coverage: **ApexCharts** and **MUI X Charts**.

## The two API styles (hybrid)

Following both references, the suite mixes two shapes:

- **`Chart`** — the cartesian family in ONE component (ApexCharts-style `type`): vertical/horizontal
  **bars** (grouped or stacked), **line**, and **area** (straight / smooth / stepped), single or
  multi-series. It stays generic over its series keys (`<Chart series={["sales"]} data={[{ label, sales }]}/>`)
  so data rows are type-checked. `type="column"` is an alias of `"bar"`.
- **Dedicated components** (MUI-X-style, one per shape) for data that doesn't fit the `{label, …series}`
  row model:

  | Component | Shape | Notes |
  | --- | --- | --- |
  | `PieChart` / `DonutChart` | `{label, value, color?}[]` | `DonutChart` = `PieChart` preset with a hole |
  | `Gauge` | `value` (+ optional `series` rings) | radial gauge / radial bars |
  | `Sparkline` | `number[]` | tiny inline line/area/bar, no axes |
  | `ScatterChart` / `BubbleChart` | `{name?, points:[{x,y,z?}]}[]` | `BubbleChart` = scatter with `bubble` on; dots sized by `z` |
  | `RadarChart` | `{label, …series}[]` | spider / multi-axis |
  | `PolarAreaChart` | `{label, value, color?}[]` | Coxcomb / rose — radius encodes value |
  | `Heatmap` | `{x, y, value}[]` | matrix of `color-mix` intensity cells |
  | `FunnelChart` | `{label, value, color?}[]` | descending stages |
  | `Treemap` | `{label, value, color?}[]` | squarified value tiles |
  | `Candlestick` | `{label, open, high, low, close}[]` | OHLC financial |
  | `Boxplot` | `{label, min, q1, median, q3, max, outliers?}[]` | box-and-whisker |
  | `RangeChart` | `{label, min, max}[]` | `type="bar"` timeline/Gantt · `type="area"` range band |

## The shared foundation — `components/data-display/_chart.js`

An **internal** helper module (not exported from the barrel; the same pattern as `_styles.js` /
`_overlay.js`). Every chart imports the pure helpers from here instead of re-deriving them, which is
what keeps the family visually and behaviourally consistent:

- **Palette** — `CHART_PALETTE` (7 theme token colours: brand / sky / emerald / amber / rose / indigo /
  slate) + `paletteAt(colors, i)` (cycles, honours a caller palette).
- **Scales / numbers** — `niceScale(min, max, maxTicks)` → `{min, max, step, ticks[]}`, `niceCeil`,
  `shortNum` (1.2k / 3M), `fmtNumber`, `sum`, `r` (terse SVG rounding).
- **Geometry** — `polarDeg(cx, cy, r, deg)` (0° = 12 o'clock, clockwise), `arcPath` (pie wedge or donut
  ring, auto-clamps a full circle), `linePath({smooth, step})` (Catmull-Rom bézier / staircase),
  `areaPath`, `polygonPath` (radar/polar).
- **Shared CSS + a11y** — `CHART_BASE_CSS` (injected once under the id `twc-chart-base`; the `.twc-chart`
  root, the visually-hidden `.twc-chart__sr` table, the `.twc-chart__legend`, and a
  `prefers-reduced-motion` reset), plus the `ChartTable` and `ChartLegend` render helpers.

## Conventions every chart follows

- **Self-contained** — imports only `react`, `../_styles.js` (`useScopedStyles`), and `./_chart.js`.
  No other component imports, no npm deps, no CDNs.
- **Styling** — inline `<svg>`; scoped CSS via `useScopedStyles("twc-<name>-styles", CSS)` **plus** the
  shared `useScopedStyles("twc-chart-base", CHART_BASE_CSS)`. Every colour/size is a token
  (`var(--color-*)`, `var(--brand-500)`, `var(--space-*)`, …) — no hardcoded hex, so dark mode just works.
- **SSR-safe** — pure render; no `window`/`document` at module or render scope.
- **Accessible** — the `<svg>` is `role="img"` with an `aria-label`; a visually-hidden `<table>`
  (`tableFallback`, default on except `Sparkline`) gives assistive tech the underlying values
  (WCAG 1.1.1). Per-point `<title>` elements are native SVG tooltips.
- **Robust** — every chart guards empty / degenerate data (no rows, total 0, `min === max`) instead of
  throwing or dividing by zero.

## Interactivity

All charts share one interaction layer (in `_chart.js`) so behavior is consistent:

- **Floating tooltip** — `useChartTooltip()` + `<ChartTooltip>` render a cursor-following card
  (colour swatch + label + value). Positioned from the pointer event, so it works regardless of
  `preserveAspectRatio`. Replaces native `<title>` tooltips.
- **Hover emphasis** — a `[data-mark]` + `[data-active]` + root `[data-hovering]` convention lets a
  chart fade every mark except the hovered/focused one (used by the slice charts and legend focus).
- **Legend** — `<ChartLegend>` supports `onToggle`/`hidden` (click a series to hide it) and
  `onFocus`/`onBlur` (hover a legend entry to spotlight that series and dim the rest).
- **Click + selection** — every chart takes an **`onDataClick`** callback that fires with the clicked
  datum + metadata (each component documents its payload; `Chart` exports `ChartClickPayload`). The
  clicked mark also toggles a persistent `data-selected` outline (`[data-mark][data-selected]`).
- **Crosshair** (`Chart`) — a vertical guide line follows the hovered category on line/area/vertical-bar
  charts (`crosshair`, default on).
- **Zoom & pan** — opt-in **`zoomable`** on `Chart`, `Candlestick`, and `RangeChart` (categorical
  x-window) and `ScatterChart` (continuous 2-D region). A transparent full-plot overlay handles
  drag-to-select-a-range, **shift-drag to pan**, and a non-passive `wheel` listener zooms about the
  cursor; a **Reset** button appears while zoomed. All layout-derived coordinates are guarded so a
  zero-size (pre-layout / test) container never throws.
- **Entrance animations** — bars grow, lines draw (`stroke-dashoffset`), arcs/areas/cells fade; all
  disabled under `prefers-reduced-motion`.

## Accessibility model

A chart is an image with a text alternative. Rather than making the SVG a screen-reader-navigable tree,
each chart renders the data twice: the visible `<svg role="img" aria-label>` for sighted users, and a
`.twc-chart__sr` `<table>` (built by the shared `ChartTable`) that the SVG points at via
`aria-describedby`. `valueFormat` formats both the tooltips and the table cells so they always agree.

## Adding a new chart type

1. If it fits the `{label, …series}` cartesian model, extend `Chart` (a new `type` branch); otherwise add
   a dedicated `components/data-display/<Name>.jsx` (+ `.d.ts` + `.prompt.md`).
2. Import the geometry/scale/palette helpers from `./_chart.js` — don't re-implement scales or arcs.
3. Give it `role="img"` + `aria-label`, a `ChartTable` fallback, `<title>` tooltips, and token-only styling.
4. Export it (value + types) from `src/index.ts`, add a `tests/` render + degenerate-data case, a
   `site/src/data/components.js` entry (+ `Demo`/`Variations`), and run `gen:ds-bundle` / `gen:llms`.

## Verification

- `tests/chart-foundation.test.js` — the `_chart.js` scale + geometry helpers.
- `tests/Chart.test.jsx` — the cartesian family (bar/column/line/area, stacked, horizontal, curves) +
  the hidden-table a11y contract.
- `tests/charts.test.jsx` — smoke-renders all 14 dedicated components, asserts each is an accessible
  `role="img"` SVG, and checks each survives empty/degenerate input.
- `tests/types/charts-types.tsx` — compile-time prop-type guards.
