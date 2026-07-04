import * as React from "react";
import type { Tone } from "../_types";

/**
 * Indeterminate loading spinner.
 */
export interface SpinnerProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** @default "md" */
  size?: "sm" | "md" | "lg" | "xl";
  /** Color. Wins over `tone` when both are set. @default "current" — inherits currentColor (visible inside buttons, themed). */
  color?: "current" | Tone | "white";
  /** Color. @deprecated since 1.4, removed in 2.0 — use `color`. @default "current" — inherits currentColor (visible inside buttons, themed). */
  tone?: "current" | Tone | "white";
  /** Accessible label. @default "Loading" */
  label?: string;
}

export function Spinner(props: SpinnerProps): React.JSX.Element;
