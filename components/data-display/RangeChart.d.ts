import * as React from "react";

/**
 * One range value: a `label` plus its numeric `min` and `max` bounds. For a
 * range bar this is the start→end of a timeline row; for a range area it is the
 * lower/upper value at that category position.
 */
export interface RangeDatum {
  /** Row/category label — shown on the axis and in the hidden data table. */
  label: React.ReactNode;
  /** Lower bound of the range (bar start / lower band edge). */
  min: number;
  /** Upper bound of the range (bar end / upper band edge). */
  max: number;
  /** Optional per-row bar color (any CSS color); overrides the palette. Applies to `type="bar"` only. */
  color?: string;
}

/**
 * Range chart — horizontal range bars (a timeline / Gantt of one min→max band
 * per row) or a range area (a shaded band between a per-category min line and
 * max line), with a shared value axis, grid, tooltips and an accessible data
 * table. Dependency-free inline SVG. For bars/lines/areas use `Chart`; for other
 * shapes use the dedicated sibling chart components.
 *
 * @startingPoint section="Data display" subtitle="Range bar / range area chart (no deps)" viewport="700x280"
 */
export interface RangeChartProps extends React.HTMLAttributes<HTMLDivElement> {
  /** `"bar"` = horizontal range bars (timeline/Gantt); `"area"` = a band between a min and max line. @default "bar" */
  type?: "bar" | "area";
  /** Range data points, each with a `label`, `min` and `max` (bars run top→bottom; the area runs left→right). */
  data: RangeDatum[];
  /** Pixel height. @default 300 */
  height?: number;
  /** Value grid lines (vertical for bars, horizontal for the area). @default true */
  showGrid?: boolean;
  /** Value axis + category labels. @default true */
  showAxis?: boolean;
  /** Palette for bar fills / the area band, cycled by index. Defaults to the built-in token palette. */
  colors?: string[];
  /** Tooltip value formatter (also formats the hidden data-table cells). @default toLocaleString */
  valueFormat?: (value: number) => string;
  /** Accessible name for the chart's `<svg role="img">`. Defaults to `"range <type> chart"`; also accepts `aria-label`. */
  ariaLabel?: string;
  /** Render a visually-hidden data table as an accessible text alternative (WCAG 1.1.1). @default true */
  tableFallback?: boolean;
  /** Caption for the hidden data table; defaults to the chart's accessible label. */
  caption?: React.ReactNode;
}

export function RangeChart(props: RangeChartProps): React.JSX.Element;
