import * as React from "react";

/**
 * One OHLC period: a `label` plus the `open`, `high`, `low` and `close` prices.
 * The body spans open→close and the wick spans low→high.
 */
export interface CandlestickDatum {
  /** Period label shown on the x axis (and in the hidden data table). */
  label: React.ReactNode;
  /** Opening price for the period. */
  open: number;
  /** Highest price reached in the period (top of the wick). */
  high: number;
  /** Lowest price reached in the period (bottom of the wick). */
  low: number;
  /** Closing price for the period; `close >= open` renders an up (green) candle. */
  close: number;
}

/**
 * Candlestick (OHLC) chart — one candle per period with a high→low wick and an
 * open→close body, colored by direction (up vs. down), plus a shared value axis,
 * grid, per-candle tooltips and an accessible data table. Dependency-free inline
 * SVG. For bars/lines/areas use `Chart`; for other shapes use the dedicated
 * sibling chart components.
 *
 * @startingPoint section="Data display" subtitle="OHLC candlestick chart (no deps)" viewport="700x280"
 */
export interface CandlestickProps extends React.HTMLAttributes<HTMLDivElement> {
  /** OHLC data points, one candle each, in chronological order. */
  data: CandlestickDatum[];
  /** Color for up candles (`close >= open`), any CSS color. @default "var(--color-success)" */
  upColor?: string;
  /** Color for down candles (`close < open`), any CSS color. @default "var(--color-danger)" */
  downColor?: string;
  /** Pixel height. @default 300 */
  height?: number;
  /** Horizontal value grid lines. @default true */
  showGrid?: boolean;
  /** Value axis + category labels. @default true */
  showAxis?: boolean;
  /** Tooltip value formatter (also formats the hidden data-table cells). @default toLocaleString */
  valueFormat?: (value: number) => string;
  /** Accessible name for the chart's `<svg role="img">`. Defaults to `"candlestick chart"`; also accepts `aria-label`. */
  ariaLabel?: string;
  /** Render a visually-hidden data table as an accessible text alternative (WCAG 1.1.1). @default true */
  tableFallback?: boolean;
  /** Caption for the hidden data table; defaults to the chart's accessible label. */
  caption?: React.ReactNode;
}

export function Candlestick(props: CandlestickProps): React.JSX.Element;
