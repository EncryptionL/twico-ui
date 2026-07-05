import * as React from "react";

/** A single polar-area slice: a `label`, its numeric `value`, and an optional override `color`. */
export interface PolarAreaDatum {
  /** Category label — shown in the legend, the per-slice tooltip, and the hidden data table. */
  label: React.ReactNode;
  /** The value this slice encodes; its radius scales with the square root so the slice's area is proportional. */
  value: number;
  /** Optional fixed CSS color for this slice (overrides the cycled palette color). */
  color?: string;
}

/** Payload passed to `onDataClick` when a slice is clicked. */
export interface PolarAreaClickPayload {
  /** The clicked slice's `label`. */
  label: React.ReactNode;
  /** The clicked slice's numeric `value`. */
  value: number;
  /** Index of the slice in the `data` array. */
  index: number;
}

/**
 * Polar-area (Coxcomb / Nightingale rose) chart — equal-angle slices whose
 * *radius* encodes each value, laid over concentric value rings. Radius scales
 * with `√value` so a slice's **area** is proportional to its value (the
 * statistically honest encoding). Dependency-free inline SVG, with per-slice
 * tooltips, click + selection (`onDataClick`), a legend whose entries
 * hover-focus their slice, and a visually-hidden data table. For plain
 * proportional wedges use `PieChart` / `DonutChart`; for a spoked multi-axis
 * shape use `RadarChart`.
 *
 * @startingPoint section="Charts" subtitle="Polar-area / rose chart (no deps)" viewport="700x280"
 */
export interface PolarAreaChartProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Data points — one equal-angle slice each, in order clockwise from `startAngle`. */
  data: PolarAreaDatum[];
  /** Radial maximum (the value at the outer ring). Defaults to a "nice" ceiling of the largest value. */
  max?: number;
  /** Number of concentric grid rings (and value tick labels). @default 4 */
  levels?: number;
  /** Angle in degrees of the first slice's leading edge, clockwise from 12 o'clock. @default 0 */
  startAngle?: number;
  /** Show the per-slice legend. @default true */
  showLegend?: boolean;
  /** Tooltip value formatter (also formats the hidden data-table cells). @default fmtNumber */
  valueFormat?: (value: number) => string;
  /** Pixel height; the square plotting area is centered within the full-width container. @default 280 */
  height?: number;
  /** Per-slice colors (any CSS color), cycled across slices. Defaults to the built-in token palette. */
  colors?: string[];
  /** Fires when a slice is clicked with its `label`, `value`, and `index`; the clicked slice also toggles a selected outline. */
  onDataClick?: (payload: PolarAreaClickPayload) => void;
  /** Accessible name for the chart's `<svg role="img">`. Defaults to `"polar area chart"`; also accepts `aria-label`. */
  ariaLabel?: string;
  /** Render a visually-hidden data table as an accessible text alternative (WCAG 1.1.1). @default true */
  tableFallback?: boolean;
  /** Caption for the hidden data table; defaults to the chart's accessible label. */
  caption?: React.ReactNode;
}

export function PolarAreaChart(props: PolarAreaChartProps): React.JSX.Element;
