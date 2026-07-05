import * as React from "react";

/** A single pie/donut slice: a `label`, its numeric `value`, and an optional override `color`. */
export interface PieChartDatum {
  /** Slice label (shown in the legend, tooltip, and hidden data table). */
  label: React.ReactNode;
  /** Slice magnitude; the share is `value / total`. Negative values are treated as `0`. */
  value: number;
  /** Optional per-slice CSS color; falls back to the cycled token palette. */
  color?: string;
}

/** Payload passed to `onDataClick` when a pie/donut slice is clicked. */
export interface PieChartClickPayload {
  /** The clicked slice's `label`. */
  label: React.ReactNode;
  /** The clicked slice's numeric value (negative inputs are clamped to `0`). */
  value: number;
  /** Index of the slice in the `data` array. */
  index: number;
  /** The slice's share of the total, as a percentage rounded to one decimal. */
  percent: number;
}

/**
 * Pie / donut chart — proportional slices of a whole from a single value series,
 * with per-slice tooltips, an optional legend, optional percentage labels, and a
 * donut center label. Dependency-free inline SVG. For bar/line/area use `Chart`;
 * for other shapes use the dedicated sibling components (gauge, radar, funnel, …).
 *
 * @startingPoint section="Data display" subtitle="Pie / donut chart (no deps)" viewport="700x280"
 */
export interface PieChartProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "color"> {
  /** Slices to plot; each is a `{ label, value, color? }`. Only positive values contribute a slice. */
  data: PieChartDatum[];
  /** Render as a donut (ring) instead of a filled pie, using the default `innerRadius`. @default false */
  donut?: boolean;
  /** Inner-hole radius as a fraction (0..1) of the outer radius. @default 0.6 when `donut`, else 0 */
  innerRadius?: number;
  /** Angle (deg, clockwise from 12 o'clock) where the first slice starts. @default 0 */
  startAngle?: number;
  /** Gap (deg) inserted between adjacent slices. @default 0 */
  padAngle?: number;
  /** Draw a percentage label centered on each non-hairline slice. @default false */
  showLabels?: boolean;
  /** Show the slice legend below the chart. @default true */
  showLegend?: boolean;
  /** Content for a donut's center; defaults to the formatted total when `donut`. Ignored for a solid pie. */
  centerLabel?: React.ReactNode;
  /** Formatter for tooltip and hidden data-table values. @default toLocaleString */
  valueFormat?: (value: number) => string;
  /** Pixel height; the square chart is sized from this. @default 260 */
  height?: number;
  /** Per-slice colors (any CSS color), cycled when shorter than `data`. Defaults to the built-in token palette. */
  colors?: string[];
  /** Fires when a slice is clicked with the slice's label, value, index, and percent share; clicking a slice also toggles a selection outline on it. */
  onDataClick?: (payload: PieChartClickPayload) => void;
  /** Accessible name for the `<svg role="img">`. Per-slice values live in the hidden data table, not this label. Defaults to `"pie chart"`/`"donut chart"`; also accepts `aria-label`. */
  ariaLabel?: string;
  /** Render a visually-hidden data table as an accessible text alternative (WCAG 1.1.1). @default true */
  tableFallback?: boolean;
  /** Caption for the hidden data table; defaults to the chart's accessible label. */
  caption?: React.ReactNode;
}

export function PieChart(props: PieChartProps): React.JSX.Element;
