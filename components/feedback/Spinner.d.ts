import * as React from "react";
import type { Tone } from "../_types";

/**
 * Indeterminate loading spinner.
 */
export interface SpinnerProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** @default "md" */
  size?: "sm" | "md" | "lg" | "xl";
  /** Colour intent; wins over `color` when both are set. @default "current" — inherits currentColor (visible inside buttons, themed). */
  tone?: "current" | Tone | "white";
  /** Colour intent. @deprecated removed in 2.0 — use `tone` (matches every other tone-driven component). @default "current" */
  color?: "current" | Tone | "white";
  /** Accessible label. @default "Loading" */
  label?: string;
}

export function Spinner(props: SpinnerProps): React.JSX.Element;
