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
  /** Color. @deprecated Use `color` instead. @default "current" — inherits currentColor (visible inside buttons, themed). */
  tone?: "current" | Tone | "white";
  /** Accessible label. @default "Loading" */
  label?: string;
}

export function Spinner(props: SpinnerProps): React.JSX.Element;
