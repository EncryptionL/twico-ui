import * as React from "react";

/**
 * One heatmap cell: an `x` (column) and `y` (row) coordinate plus a numeric
 * `value` that drives the cell's color intensity. Missing (x, y) combinations
 * render as faint empty cells.
 */
export interface HeatmapDatum {
  /** Column key. Column order follows first appearance in `data`. */
  x: string | number;
  /** Row key. Row order follows first appearance in `data`. */
  y: string | number;
  /** Numeric magnitude mapped onto the `min`…`max` color scale. */
  value: number;
}

/**
 * Heatmap — a matrix of colored cells keyed by (x, y), each shaded by a
 * single-hue intensity scale between `min` and `max`. Ordered X columns and Y
 * rows are derived from the data in first-seen order; absent cells render faint.
 * Dependency-free inline SVG, with per-cell tooltips, a gradient scale legend,
 * and a visually-hidden data table. Dark mode is automatic through tokens.
 *
 * @startingPoint section="Data display" subtitle="Matrix heatmap (no deps)" viewport="700x280"
 */
export interface HeatmapProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Cells to plot. X columns and Y rows are derived from these in first-seen order. */
  data: HeatmapDatum[];
  /** Low end of the color scale. Defaults to the minimum value in `data`. */
  min?: number;
  /** High end of the color scale. Defaults to the maximum value in `data`. */
  max?: number;
  /** Base token color for the high end; cells mix it over transparent by intensity. @default "var(--brand-500)" */
  colorScale?: string;
  /** Print each cell's formatted value at its center. @default false */
  showValues?: boolean;
  /** Gap in pixels between adjacent cells. @default 2 */
  cellGap?: number;
  /** Cell corner radius in pixels. @default 2 */
  radius?: number;
  /** Optional title rendered beneath the X-axis category labels. */
  xLabel?: React.ReactNode;
  /** Optional title rendered rotated alongside the Y-axis category labels. */
  yLabel?: React.ReactNode;
  /** Show the low→high gradient scale legend below the grid. @default true */
  showLegend?: boolean;
  /** Value formatter for tooltips, printed cell values, and the hidden table. @default fmtNumber */
  valueFormat?: (value: number) => string;
  /** Pixel height of the chart. @default 300 */
  height?: number;
  /** Accessible name for the chart's `<svg role="img">`. Per-cell values are exposed via the hidden data table, not this label. Defaults to `"heatmap"`; also accepts `aria-label`. */
  ariaLabel?: string;
  /** Render a visually-hidden data table as an accessible text alternative (WCAG 1.1.1). @default true */
  tableFallback?: boolean;
  /** Caption for the hidden data table; defaults to the chart's accessible label. */
  caption?: React.ReactNode;
}

export function Heatmap(props: HeatmapProps): React.JSX.Element;
