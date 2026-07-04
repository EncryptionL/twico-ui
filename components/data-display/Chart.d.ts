import * as React from "react";

/**
 * A chart data point: a `label` plus one numeric field per series key `K`
 * (default key `"value"`). `K` is normally inferred from the `series` prop.
 */
export type ChartDatum<K extends string = "value"> = { label: React.ReactNode } & { [P in K]: number };

/**
 * Lightweight, dependency-free SVG chart — bar or line, single or multi-series,
 * with grid, axes, animated entrance, tooltips, and optional legend. Generic over
 * the series keys `K` so the data rows are type-checked (e.g.
 * `<Chart series={["sales"]} data={[{ label, sales: 12 }]} />`).
 *
 * @startingPoint section="Data display" subtitle="Bar / line chart (no deps)" viewport="700x280"
 */
export interface ChartProps<K extends string = "value"> extends React.HTMLAttributes<HTMLDivElement> {
  /** @default "bar" */
  type?: "bar" | "line";
  /** Data points. Each has a `label` + one numeric field per series key. (`K` is inferred from `series`, not from `data`.) */
  data: ChartDatum<NoInfer<K>>[];
  /** Series field names (defaults to `["value"]`). Multiple = grouped bars / multi-line. */
  series?: K[];
  /** Pixel height. @default 220 */
  height?: number;
  /** Horizontal grid lines. @default true */
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
