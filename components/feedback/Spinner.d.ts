import * as React from "react";

/**
 * Indeterminate loading spinner.
 */
export interface SpinnerProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** @default "md" */
  size?: "sm" | "md" | "lg" | "xl";
  /** Color. @default "current" — inherits currentColor (visible inside buttons, themed). */
  tone?: "current" | "primary" | "neutral" | "white";
  /** Accessible label. @default "Loading" */
  label?: string;
}

export function Spinner(props: SpinnerProps): React.JSX.Element;
