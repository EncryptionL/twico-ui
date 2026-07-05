import * as React from "react";

/** One treemap tile: a `label`, its numeric `value` (relative area), and an optional override `color`. */
export interface TreemapDatum {
  /** Tile label — rendered inside the tile when it fits and as the data-table row header. */
  label: React.ReactNode;
  /** Non-negative magnitude; the tile's area is this value as a share of the total (negatives are clamped to 0). */
  value: number;
  /** Optional per-tile fill (any CSS color); overrides the cycled palette color for this tile. */
  color?: string;
}

/** Payload passed to `onDataClick` when a treemap tile is clicked. */
export interface TreemapClickPayload {
  /** The clicked tile's `label`. */
  label: React.ReactNode;
  /** The clicked tile's (non-negative) value. */
  value: number;
  /** Index of the tile in the original `data` array. */
  index: number;
  /** The tile's fraction of the total, `0`–`1` (`0` when the total is `0`). */
  share: number;
}

/**
 * Treemap — a squarified partition of a rectangle into tiles sized in proportion
 * to a flat list of values (Bruls/Huizing/van Wijk squarified layout), packed to
 * keep tile aspect ratios near 1:1. Dependency-free inline SVG with per-tile
 * labels, hover tooltips, and a visually-hidden data table. Good for showing the
 * relative weight of parts within a whole (spend by category, storage by bucket).
 *
 * @startingPoint section="Charts" subtitle="Squarified treemap (no deps)" viewport="700x280"
 */
export interface TreemapProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Tiles to lay out. Each has a `label`, a non-negative `value`, and an optional `color`. */
  data: TreemapDatum[];
  /** Draw the value under the label inside tiles tall enough to fit both lines. @default true */
  showValues?: boolean;
  /** Formatter for the tooltip, in-tile value, and data-table cells. @default toLocaleString */
  valueFormat?: (value: number) => string;
  /** Pixel height (also sets the SVG's aspect ratio; width fills the container). @default 300 */
  height?: number;
  /** Tile colors (any CSS color), cycled by index. Defaults to the built-in token palette; a datum's `color` wins. */
  colors?: string[];
  /** Gap in px inset between adjacent tiles. @default 2 */
  gap?: number;
  /** Fires when a tile is clicked with the tile's label, value, index, and share; the clicked tile also toggles a selection outline. */
  onDataClick?: (payload: TreemapClickPayload) => void;
  /** Accessible name for the chart's `<svg role="img">`. Per-tile values are exposed via the hidden data table, not this label. Defaults to `"treemap"`; also accepts `aria-label`. */
  ariaLabel?: string;
  /** Render a visually-hidden data table (value + share) as an accessible text alternative (WCAG 1.1.1). @default true */
  tableFallback?: boolean;
  /** Caption for the hidden data table; defaults to the chart's accessible label. */
  caption?: React.ReactNode;
}

export function Treemap(props: TreemapProps): React.JSX.Element;
