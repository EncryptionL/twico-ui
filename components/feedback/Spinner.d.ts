import * as React from "react";

/**
 * Indeterminate loading spinner.
 */
export interface SpinnerProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** @default "md" */
  size?: "sm" | "md" | "lg" | "xl";
  /** @default "primary" — use "white" on colored backgrounds. */
  tone?: "primary" | "neutral" | "white";
  /** Accessible label. @default "Loading" */
  label?: string;
}

export function Spinner(props: SpinnerProps): React.JSX.Element;
