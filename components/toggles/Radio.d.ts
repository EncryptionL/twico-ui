import * as React from "react";

/**
 * Radio button with label and description. Group several with the same `name`.
 */
export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
  label?: React.ReactNode;
  description?: React.ReactNode;
  size?: "sm" | "md";
}

export function Radio(props: RadioProps): React.JSX.Element;
