import * as React from "react";

/**
 * Linear progress bar — determinate or indeterminate, with semantic tones.
 */
export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Current value. @default 0 */
  value?: number;
  /** Maximum value. @default 100 */
  max?: number;
  /** @default "primary" */
  tone?: "primary" | "success" | "warning" | "danger";
  /** @default "md" */
  size?: "sm" | "md" | "lg";
  /** Animate as an indeterminate bar (ignores value). */
  indeterminate?: boolean;
  /** Show a percentage label above the bar. */
  showLabel?: boolean;
}

export function Progress(props: ProgressProps): React.JSX.Element;
