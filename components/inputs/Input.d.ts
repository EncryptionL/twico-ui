import * as React from "react";
import type { Tone } from "../_types";

/**
 * Text input with optional label, hint, error state, and inline icons.
 *
 * @startingPoint section="Inputs" subtitle="Labeled text input with validation" viewport="700x140"
 */
export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  /** Field label rendered above the control. */
  label?: React.ReactNode;
  /** Helper text shown below when there is no error. */
  hint?: React.ReactNode;
  /** Error message — turns the field red and replaces the hint. */
  error?: React.ReactNode;
  /** Marks the field required (adds an asterisk and forwards to the native input). */
  required?: boolean;
  /** Control size. @default "md" */
  size?: "sm" | "md" | "lg";
  /** Color intent for the focus/open accent. @default "primary" */
  tone?: Tone;
  /** Icon node inside the field, leading edge (prefix). */
  leftIcon?: React.ReactNode;
  /** Optional suffix icon/node inside the field, trailing edge. For `type="password"`, omitting this
   *  shows a built-in reveal/hide eye toggle; providing `rightIcon` replaces it. */
  rightIcon?: React.ReactNode;
}

export function Input(props: InputProps): React.JSX.Element;
