import * as React from "react";

/**
 * KPI / metric card — label, big value, optional icon, trend delta, and help text.
 *
 * @startingPoint section="Data display" subtitle="KPI / metric card" viewport="700x160"
 */
export interface StatProps extends React.HTMLAttributes<HTMLDivElement> {
  label: React.ReactNode;
  value: React.ReactNode;
  /** Icon shown top-right in a tinted tile. */
  icon?: React.ReactNode;
  /** Trend value, e.g. "+12.5%" or "-3%". */
  delta?: React.ReactNode;
  /** Force the trend direction/color; otherwise inferred from a leading "-". */
  deltaDirection?: "up" | "down" | "flat";
  /** Muted text after the delta, e.g. "vs last month". */
  helpText?: React.ReactNode;
  /** Drop the card chrome (no border/background/padding). @default false */
  plain?: boolean;
}

export function Stat(props: StatProps): React.JSX.Element;
