import * as React from "react";

/**
 * A Sparkline data point: either a bare number, or an object with a numeric
 * `value` plus an optional `label` (used only for tooltips / the hidden table).
 */
export type SparklineDatum = number | { value: number; label?: React.ReactNode };

/** Payload passed to `onDataClick` when a point/bar is clicked. */
export interface SparklineClickPayload {
  /** The clicked point's numeric value. */
  value: number;
  /** Index of the clicked point in the `data` array. */
  index: number;
  /** The point's `label` (falls back to its 1-based index). */
  label: React.ReactNode;
}

/**
 * Sparkline — a minimal, word-sized trend chart (line, area, or bars) with no
 * axes, grid, ticks, or legend, meant to sit inline beside text or inside a
 * table cell / stat tile. Dependency-free inline SVG that scales to fill its
 * vertical space, with an optional emphasised trailing dot. For a full chart
 * with axes, tooltips, and a legend use the `Chart` component.
 *
 * @startingPoint section="Charts" subtitle="Tiny inline trend line (no deps)" viewport="700x280"
 */
export interface SparklineProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "color"> {
  /** Data points: bare numbers, or `{ value, label }` objects. */
  data: SparklineDatum[];
  /** Trend style. `"area"` fills below the line; `"bar"` draws thin columns. @default "line" */
  type?: "line" | "area" | "bar";
  /** Shorthand for `type="area"` (fills the region below the line). @default false */
  area?: boolean;
  /** Stroke / fill color (any CSS color). @default "var(--color-primary)" */
  color?: string;
  /** Viewbox width in pixels. @default 120 */
  width?: number;
  /** Pixel height. @default 40 */
  height?: number;
  /** Line stroke width in pixels (ignored for bars). @default 2 */
  strokeWidth?: number;
  /** Line/area interpolation. @default "smooth" */
  curve?: "straight" | "smooth" | "stepped";
  /** Emphasize the last point with a filled dot. @default false */
  showDots?: boolean;
  /** Pin the low end of the value scale (else derived from the data's minimum). */
  min?: number;
  /** Pin the high end of the value scale (else derived from the data's maximum). */
  max?: number;
  /** Value formatter for tooltips + the hidden data table. @default toLocaleString */
  valueFormat?: (value: number) => string;
  /** Fires when a point/bar is clicked with its value, index, and label; the clicked mark also toggles a selection outline. */
  onDataClick?: (payload: SparklineClickPayload) => void;
  /** Accessible name for the `<svg role="img">`; defaults to a spoken summary (point count + first/last/min/max, or +latest when a table is present). Also accepts `aria-label`. */
  ariaLabel?: string;
  /** Render a visually-hidden data table as a text alternative (WCAG 1.1.1); off by default since the summarizing aria-label usually suffices for a sparkline. @default false */
  tableFallback?: boolean;
  /** Caption for the hidden data table; defaults to the accessible label. */
  caption?: React.ReactNode;
}

export function Sparkline(props: SparklineProps): React.JSX.Element;
