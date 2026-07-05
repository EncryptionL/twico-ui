import * as React from "react";

/** A single x/y point, with an optional `z` (bubble size) and a display `label`. */
export interface ScatterPoint {
  /** Horizontal value (mapped to the x axis). */
  x: number;
  /** Vertical value (mapped to the y axis). */
  y: number;
  /** Optional third dimension — sizes the dot when the chart is in bubble mode. */
  z?: number;
  /** Optional per-point label used in the tooltip (falls back to the series name). */
  label?: React.ReactNode;
}

/** One plotted series: an optional name/color plus its list of points. */
export interface ScatterSeries {
  /** Series name — shown in the legend and used as the tooltip/table label. */
  name?: string;
  /** Series color (any CSS color); defaults to the built-in token palette, cycled. */
  color?: string;
  /** The series' data points. */
  points: ScatterPoint[];
}

/** Payload passed to `onDataClick` when a point is clicked. */
export interface ScatterClickPayload {
  /** The clicked point's x value. */
  x: number;
  /** The clicked point's y value. */
  y: number;
  /** The clicked point's z (bubble size) value, if any. */
  z?: number;
  /** Name of the series the point belongs to (defaults to `"Series N"`). */
  series: string;
  /** Index of the point's series in the `series` prop. */
  seriesIndex: number;
  /** Index of the point within its series' `points` array. */
  index: number;
  /** The original `ScatterPoint` object that was clicked. */
  point: ScatterPoint;
}

/**
 * Scatter / bubble chart — plots x/y points across two nice-scaled numeric axes,
 * one or many series, with grid, axis titles, tooltips, an optional legend and a
 * hidden data table. Give points a numeric `z` (or set `bubble`) to size the dots
 * by a third dimension. Dependency-free inline SVG; keeps its aspect ratio so the
 * dots stay round. For bars/line/area use `Chart`; for other shapes use the
 * dedicated sibling components.
 *
 * @startingPoint section="Data display" subtitle="Scatter / bubble plot (no deps)" viewport="700x280"
 */
export interface ScatterChartProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "color"> {
  /** The series to plot; each has optional `name`/`color` and a list of `{ x, y, z?, label? }` points. */
  series: ScatterSeries[];
  /** Size the dots by their `z` value (bubble chart). Auto-enabled when any point has a numeric `z`. @default false */
  bubble?: boolean;
  /** Maximum bubble radius in pixels (the largest `z` maps to this). @default 26 */
  maxBubble?: number;
  /** Fixed dot radius in pixels when not in bubble mode. @default 4.5 */
  dotRadius?: number;
  /** Pixel height (also sets the SVG aspect ratio). @default 300 */
  height?: number;
  /** Axis title drawn beneath the x axis. */
  xLabel?: React.ReactNode;
  /** Axis title drawn (rotated) beside the y axis. */
  yLabel?: React.ReactNode;
  /** Grid lines. @default true */
  showGrid?: boolean;
  /** Series legend. Defaults to `true` when there is more than one series. */
  showLegend?: boolean;
  /** Enable 2-D drag-to-zoom (rectangle-zoom both axes, + shift-drag pan, wheel zoom, and a reset button). @default false */
  zoomable?: boolean;
  /** Fires when a point is clicked, with its x/y/z, series metadata, and the original point. */
  onDataClick?: (payload: ScatterClickPayload) => void;
  /** Formatter for x values in tooltips + the hidden table (defaults to `valueFormat`). */
  xFormat?: (value: number) => string;
  /** Formatter for y values in tooltips + the hidden table (defaults to `valueFormat`). */
  yFormat?: (value: number) => string;
  /** Fallback value formatter for x/y/z (locale-grouped numbers by default). */
  valueFormat?: (value: number) => string;
  /** Accessible name for the chart's `<svg role="img">`. Per-point values are exposed via the hidden data table, not this label. Defaults to `"scatter chart"` / `"bubble chart"`; also accepts `aria-label`. */
  ariaLabel?: string;
  /** Render a visually-hidden data table as an accessible text alternative (WCAG 1.1.1). @default true */
  tableFallback?: boolean;
  /** Caption for the hidden data table; defaults to the chart's accessible label. */
  caption?: React.ReactNode;
}

export function ScatterChart(props: ScatterChartProps): React.JSX.Element;
