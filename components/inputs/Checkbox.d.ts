import * as React from "react";

/**
 * Checkbox with animated checkmark, label, description, and indeterminate state.
 */
export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
  label?: React.ReactNode;
  description?: React.ReactNode;
  /** Error message shown below the control; tints the box red and wires `aria-invalid`/`aria-describedby`. @default undefined */
  error?: React.ReactNode;
  /** Render the dash (mixed) state. */
  indeterminate?: boolean;
  size?: "sm" | "md";
}

export function Checkbox(props: CheckboxProps): React.JSX.Element;
