import * as React from "react";

/**
 * Multi-line text input with label, hint, and error state.
 */
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Field label rendered above the control. */
  label?: React.ReactNode;
  /** Helper text shown below when there is no error. */
  hint?: React.ReactNode;
  /** Error message — turns the field red and replaces the hint. */
  error?: React.ReactNode;
  /** Marks the field required (adds an asterisk and forwards to the native textarea). */
  required?: boolean;
  /** Control size — same padding steps as Input. @default "md" */
  size?: "sm" | "md" | "lg";
  /** Color intent for the focus/open accent. @default "primary" */
  tone?: "primary" | "success" | "warning" | "danger" | "info" | "neutral";
}

export function Textarea(props: TextareaProps): React.JSX.Element;
