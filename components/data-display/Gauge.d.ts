import * as React from "react";

/** One radial bar in a multi-ring gauge — a value plus an optional label/color. */
export interface GaugeSeries {
  /** The ring's value, mapped through the shared `min`/`max` domain. */
  value: number;
  /** Legend label for this ring. */
  label?: React.ReactNode;
  /** Ring color (any CSS color); defaults to the built-in token palette, cycled. */
  color?: string;
}

/**
 * Radial gauge / radial-bar chart — renders a single `value` as a thick arc that
 * sweeps between `startAngle` and `endAngle`, with the value + an optional caption
 * in the center. Pass `series` to draw multiple concentric rings (radial-bar).
 * Dependency-free inline SVG; every color/size is a design token so dark mode is
 * automatic. For bar/line/area use `Chart`; for slices use `PieChart`/`DonutChart`.
 *
 * @startingPoint section="Data display" subtitle="Radial gauge / radial-bar (no deps)" viewport="700x280"
 */
export interface GaugeProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "color"> {
  /** The value to display, mapped from `min`..`max` onto the arc sweep. @default 0 */
  value?: number;
  /** Lower bound of the value domain (maps to `startAngle`). @default 0 */
  min?: number;
  /** Upper bound of the value domain (maps to `endAngle`). @default 100 */
  max?: number;
  /** Sweep start angle in degrees (0 = top, clockwise). @default -110 */
  startAngle?: number;
  /** Sweep end angle in degrees (0 = top, clockwise). @default 110 */
  endAngle?: number;
  /** Ring stroke width as a fraction of the radius. @default 0.16 */
  thickness?: number;
  /** Show the formatted value in the center (single gauge only). @default true */
  showValue?: boolean;
  /** Small caption rendered under the center value (single gauge only). */
  label?: React.ReactNode;
  /** Formats the center value + hidden-table cells; defaults to a rounded integer. */
  valueFormat?: (value: number) => string;
  /** Value-arc color (any CSS color). @default "var(--color-primary)" */
  color?: string;
  /** Background track color (any CSS color). @default "var(--color-surface-sunken)" */
  trackColor?: string;
  /** SVG width/height in pixels (the gauge is square). @default 200 */
  size?: number;
  /** Multiple concentric radial bars; when set, the single `value`/`label` are ignored. */
  series?: GaugeSeries[];
  /** Show the legend for a multi-ring (`series`) gauge. @default true */
  showLegend?: boolean;
  /** Accessible name for the `<svg role="img">`; defaults to a value summary. Also accepts `aria-label`. */
  ariaLabel?: string;
  /** Render a visually-hidden data table as an accessible text alternative (WCAG 1.1.1). @default true */
  tableFallback?: boolean;
  /** Caption for the hidden data table; defaults to the gauge's accessible label. */
  caption?: React.ReactNode;
}

export function Gauge(props: GaugeProps): React.JSX.Element;
