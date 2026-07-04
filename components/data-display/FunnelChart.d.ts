import * as React from "react";

/** A funnel stage: a `label`, its numeric `value`, and an optional override `color`. */
export interface FunnelDatum {
  /** Stage name, rendered centered on the band and in the hidden data table. */
  label: React.ReactNode;
  /** Stage magnitude. Band width (or height, when horizontal) is scaled to the largest stage. */
  value: number;
  /** Optional fill for this stage (any CSS color); defaults to the cycled token palette. */
  color?: string;
}

/**
 * Funnel chart — descending stages drawn as centered trapezoids that taper from
 * each stage's value to the next, for conversion / drop-off flows. Each band is
 * scaled to the largest stage, with the top stage as the 100% baseline for the
 * per-stage percentage. Dependency-free inline SVG with per-band `<title>` tooltips
 * and a visually-hidden data table. For bars/lines/areas use `Chart`; for part-of-whole
 * shares use `PieChart`.
 *
 * @startingPoint section="Data display" subtitle="Descending funnel stages (no deps)" viewport="700x280"
 */
export interface FunnelChartProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Funnel stages, ordered from the widest/top stage to the narrowest. */
  data: FunnelDatum[];
  /** Print each stage's formatted value in its centered caption. @default true */
  showValues?: boolean;
  /** Print each stage's percentage of the first (top) stage in its caption. @default true */
  showPercent?: boolean;
  /** Lay the funnel out left→right (tapering vertically) instead of top→bottom. @default false */
  horizontal?: boolean;
  /** Pixel gap between adjacent stages. @default 2 */
  gap?: number;
  /** Pixel height of the chart. @default 300 */
  height?: number;
  /** Per-stage colors (any CSS color), cycled when shorter than `data`. Defaults to the token palette. */
  colors?: string[];
  /** Value formatter for captions, tooltips, and the hidden data-table cells. @default toLocaleString */
  valueFormat?: (value: number) => string;
  /** Accessible name for the chart's `<svg role="img">`; per-stage values live in the hidden table. Defaults to `"funnel chart"`; also accepts `aria-label`. */
  ariaLabel?: string;
  /** Render a visually-hidden data table as an accessible text alternative (WCAG 1.1.1). @default true */
  tableFallback?: boolean;
  /** Caption for the hidden data table; defaults to the chart's accessible label. */
  caption?: React.ReactNode;
}

export function FunnelChart(props: FunnelChartProps): React.JSX.Element;
