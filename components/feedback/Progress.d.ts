import * as React from "react";
import type { BarTone } from "../_types";

/**
 * Linear progress bar — determinate or indeterminate, with semantic tones.
 * `className` and all extra HTML attributes (`style`, `id`, handlers, …) land on the
 * root wrapper; `role="progressbar"` + `aria-value*` live on the inner track.
 */
export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Current value. @default 0 */
  value?: number;
  /** Maximum value. @default 100 */
  max?: number;
  /** @default "primary" */
  tone?: BarTone;
  /** @default "md" */
  size?: "sm" | "md" | "lg";
  /** Animate as an indeterminate bar (ignores value). */
  indeterminate?: boolean;
  /** Show a percentage label above the bar. */
  showLabel?: boolean;
}

export function Progress(props: ProgressProps): React.JSX.Element;
