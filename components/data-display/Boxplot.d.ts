import * as React from "react";

/**
 * A single box-and-whisker summary: a `label` plus the five-number distribution
 * (`min`, `q1`, `median`, `q3`, `max`) and optional `outliers` drawn as points.
 */
export interface BoxplotDatum {
  /** Category label, rendered under the box and in the hidden data table. */
  label: React.ReactNode;
  /** Lower whisker end (distribution minimum, excluding outliers). */
  min: number;
  /** First quartile — the bottom edge of the box. */
  q1: number;
  /** Median — the bold line inside the box. */
  median: number;
  /** Third quartile — the top edge of the box. */
  q3: number;
  /** Upper whisker end (distribution maximum, excluding outliers). */
  max: number;
  /** Individual outlier values drawn as small circles beyond the whiskers. */
  outliers?: number[];
}

/** Payload passed to `onDataClick` when a box is clicked. */
export interface BoxplotClickPayload {
  /** The clicked box's `label`. */
  label: React.ReactNode;
  /** Lower whisker end (distribution minimum). */
  min: number;
  /** First quartile — the bottom edge of the box. */
  q1: number;
  /** Median — the bold line inside the box. */
  median: number;
  /** Third quartile — the top edge of the box. */
  q3: number;
  /** Upper whisker end (distribution maximum). */
  max: number;
  /** Index of the box in the `data` array. */
  index: number;
}

/**
 * Box-and-whisker chart — one box per category summarising a five-number
 * distribution (min, Q1, median, Q3, max) with whiskers, a bold median line,
 * and optional outlier points. Dependency-free inline SVG, theme-aware via
 * design tokens. For bar/line/area use `Chart`; for other shapes use the
 * dedicated sibling components.
 *
 * @startingPoint section="Charts" subtitle="Box-and-whisker distribution chart" viewport="700x280"
 */
export interface BoxplotProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The boxes to plot, one per category, each a five-number summary. */
  data: BoxplotDatum[];
  /** Box fill/stroke accent (any CSS color). @default "var(--color-primary)" */
  color?: string;
  /** Pixel height. @default 300 */
  height?: number;
  /** Horizontal grid lines at the value ticks. @default true */
  showGrid?: boolean;
  /** Value axis and category labels. @default true */
  showAxis?: boolean;
  /** Enable drag-to-zoom over the category axis: drag an x-range to zoom into those boxes (re-fitting the value scale), shift-drag to pan, mouse-wheel to zoom, plus a Reset button. @default false */
  zoomable?: boolean;
  /** Tooltip/table value formatter. @default toLocaleString */
  valueFormat?: (value: number) => string;
  /** Fires when a box is clicked, with the five-number summary + its index. */
  onDataClick?: (payload: BoxplotClickPayload) => void;
  /** Accessible name for the chart's `<svg role="img">`. Per-box values are exposed via the hidden data table, not this label. @default "box plot" */
  ariaLabel?: string;
  /** Render a visually-hidden data table as an accessible text alternative (WCAG 1.1.1). @default true */
  tableFallback?: boolean;
  /** Caption for the hidden data table; defaults to the chart's accessible label. */
  caption?: React.ReactNode;
}

export function Boxplot(props: BoxplotProps): React.JSX.Element;
