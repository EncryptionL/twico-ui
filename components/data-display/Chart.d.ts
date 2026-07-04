import * as React from "react";

/**
 * A chart data point: a `label` plus one numeric field per series key `K`
 * (default key `"value"`). `K` is normally inferred from the `series` prop.
 */
export type ChartDatum<K extends string = "value"> = { label: React.ReactNode } & { [P in K]: number };

/**
 * Cartesian chart — vertical/horizontal bars (grouped or stacked), line, and area
 * (straight / smooth / stepped), single or multi-series, with grid, axes, tooltips,
 * and an optional legend. Dependency-free inline SVG. Generic over the series keys
 * `K` so the data rows are type-checked (e.g.
 * `<Chart series={["sales"]} data={[{ label, sales: 12 }]} />`). For pie/donut,
 * scatter/bubble, radar, heatmap, gauge, funnel, treemap, candlestick, boxplot and
 * range charts use the dedicated sibling components.
 *
 * @startingPoint section="Data display" subtitle="Bar / line / area chart (no deps)" viewport="700x280"
 */
export interface ChartProps<K extends string = "value"> extends React.HTMLAttributes<HTMLDivElement> {
  /** Chart type. `"column"` is an alias of `"bar"` (vertical bars). @default "bar" */
  type?: "bar" | "column" | "line" | "area";
  /** Data points. Each has a `label` + one numeric field per series key. (`K` is inferred from `series`, not from `data`.) */
  data: ChartDatum<NoInfer<K>>[];
  /** Series field names (defaults to `["value"]`). Multiple = grouped bars / multi-line / stacked. */
  series?: K[];
  /** Pixel height. @default 220 */
  height?: number;
  /** Stack multi-series bars/areas instead of grouping them side by side. @default false */
  stacked?: boolean;
  /** Render bars horizontally (value axis along the bottom). Ignored for line/area. @default false */
  horizontal?: boolean;
  /** Line/area interpolation. @default "straight" */
  curve?: "straight" | "smooth" | "stepped";
  /** Shorthand for `curve="smooth"`. @default false */
  smooth?: boolean;
  /** Show point markers on line charts. @default true */
  showDots?: boolean;
  /** Grid lines. @default true */
  showGrid?: boolean;
  /** Axis labels. @default true */
  showAxis?: boolean;
  /** Series legend (multi-series). @default false */
  showLegend?: boolean;
  /** Per-series colors (any CSS color), cycled when shorter than `series`. Defaults to the built-in token palette. */
  colors?: string[];
  /** Tooltip value formatter (also formats the hidden data-table cells). */
  valueFormat?: (value: number) => string;
  /** Accessible name for the chart's `<svg role="img">`. Per-point values are exposed via the hidden data table, not this label. Defaults to `"<type> chart"`; also accepts `aria-label`. */
  ariaLabel?: string;
  /** Render a visually-hidden data table as an accessible text alternative (WCAG 1.1.1). @default true */
  tableFallback?: boolean;
  /** Caption for the hidden data table; defaults to the chart's accessible label. */
  caption?: React.ReactNode;
}

export function Chart<K extends string = "value">(props: ChartProps<K>): React.JSX.Element;
