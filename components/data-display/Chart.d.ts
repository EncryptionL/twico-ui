import * as React from "react";

export interface ChartDatum {
  /** X-axis label. */
  label: React.ReactNode;
  /** One numeric field per series key (default key is "value"). */
  [key: string]: any;
}

/**
 * Lightweight, dependency-free SVG chart — bar or line, single or multi-series,
 * with grid, axes, animated entrance, tooltips, and optional legend.
 *
 * @startingPoint section="Data display" subtitle="Bar / line chart (no deps)" viewport="700x280"
 */
export interface ChartProps extends React.HTMLAttributes<HTMLDivElement> {
  /** @default "bar" */
  type?: "bar" | "line";
  /** Data points. Each has a `label` + one numeric field per series. */
  data: ChartDatum[];
  /** Series field names (defaults to ["value"]). Multiple = grouped bars / multi-line. */
  series?: string[];
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
  /** Tooltip value formatter. */
  valueFormat?: (value: number) => string;
}

export function Chart(props: ChartProps): React.JSX.Element;
