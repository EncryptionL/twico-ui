import * as React from "react";

/**
 * Indeterminate loading spinner.
 */
export interface SpinnerProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** @default "md" */
  size?: "sm" | "md" | "lg" | "xl";
  /** Color. Wins over `tone` when both are set. @default "current" — inherits currentColor (visible inside buttons, themed). */
  color?: "current" | "primary" | "success" | "warning" | "danger" | "info" | "neutral" | "white";
  /** Color. @deprecated Use `color` instead. @default "current" — inherits currentColor (visible inside buttons, themed). */
  tone?: "current" | "primary" | "success" | "warning" | "danger" | "info" | "neutral" | "white";
  /** Accessible label. @default "Loading" */
  label?: string;
}

export function Spinner(props: SpinnerProps): React.JSX.Element;
