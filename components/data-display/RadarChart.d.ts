import * as React from "react";

/**
 * A radar-chart row: each row is one **axis** (category), carrying a `label`
 * plus one numeric field per series key `K`. `K` is normally inferred from the
 * `series` prop (e.g. `{ label: "Speed", team: 80, rival: 65 }`).
 */
export type RadarDatum<K extends string = "value"> = { label: React.ReactNode } & { [P in K]: number };

/** Payload passed to `onDataClick` when a series vertex dot is clicked. */
export interface RadarClickPayload<K extends string = string> {
  /** The clicked vertex's axis `label`. */
  label: React.ReactNode;
  /** The series (polygon) key that was clicked. */
  series: K;
  /** The clicked value. */
  value: number;
  /** Index of the axis (row) in the `data` array. */
  index: number;
}

/**
 * Radar / spider chart — one or more series drawn as closed polygons over a
 * shared set of categorical axes radiating from a center, with concentric grid
 * rings, spokes, per-axis labels, tooltips, and an optional legend. Dependency-free
 * inline SVG. Generic over the series keys `K` so the data rows are type-checked
 * (e.g. `<RadarChart series={["team"]} data={[{ label: "Speed", team: 80 }]} />`).
 * For cartesian bars/lines/areas use `Chart`; for other shapes use the dedicated
 * sibling components.
 *
 * @startingPoint section="Charts" subtitle="Radar / spider chart (no deps)" viewport="700x280"
 */
export interface RadarChartProps<K extends string = "value"> extends React.HTMLAttributes<HTMLDivElement> {
  /** Data rows — one per **axis**. Each has a `label` + one numeric field per series key. (`K` is inferred from `series`, not from `data`.) */
  data: RadarDatum<NoInfer<K>>[];
  /** Series field names to plot as polygons (defaults to `["value"]`). Multiple = several overlaid polygons. */
  series?: K[];
  /** Radial maximum (the value at the outer ring). Defaults to a "nice" ceiling of the largest datum. */
  max?: number;
  /** Number of concentric grid rings. @default 4 */
  levels?: number;
  /** Fill each polygon at low opacity (in addition to its stroke). @default true */
  fill?: boolean;
  /** Series legend. Defaults to `true` when more than one series is plotted, else `false`. */
  showLegend?: boolean;
  /** Draw a marker dot at each polygon vertex. @default true */
  showDots?: boolean;
  /** Per-series colors (any CSS color), cycled when shorter than `series`. Defaults to the built-in token palette. */
  colors?: string[];
  /** Tooltip value formatter (also formats the hidden data-table cells). */
  valueFormat?: (value: number) => string;
  /** Pixel height; the chart uses a square canvas of this size. @default 300 */
  height?: number;
  /** Fires when a series vertex dot is clicked, with the axis label, series key, value, and axis index. */
  onDataClick?: (payload: RadarClickPayload<NoInfer<K>>) => void;
  /** Accessible name for the chart's `<svg role="img">`. Per-point values are exposed via the hidden data table, not this label. Defaults to `"radar chart"`; also accepts `aria-label`. */
  ariaLabel?: string;
  /** Render a visually-hidden data table as an accessible text alternative (WCAG 1.1.1). @default true */
  tableFallback?: boolean;
  /** Caption for the hidden data table; defaults to the chart's accessible label. */
  caption?: React.ReactNode;
}

export function RadarChart<K extends string = "value">(props: RadarChartProps<K>): React.JSX.Element;
