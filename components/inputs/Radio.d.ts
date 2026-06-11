import * as React from "react";

/**
 * Radio button with label and description. Group several with the same `name`.
 */
export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
  label?: React.ReactNode;
  description?: React.ReactNode;
  /** Error message shown below the control; tints the dot red and wires `aria-invalid`/`aria-describedby`. @default undefined */
  error?: React.ReactNode;
  size?: "sm" | "md";
}

export function Radio(props: RadioProps): React.JSX.Element;
