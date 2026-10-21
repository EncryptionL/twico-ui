import * as React from "react";
import type { Tone } from "../_types";

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
  size?: "sm" | "md" | "lg";
  /** Color intent. @default "primary" */
  tone?: Tone;
}

/**
 * #490: forwards `ref` to the native `<input type="checkbox">`, merged with the internal ref that drives `indeterminate`.
 *
 * Declared rather than left to React 19's implicit pass-through: on React 19 `ref` is an ordinary
 * prop, so `{...rest}` would land one on the element anyway, but React 18 strips it and the type
 * denied it on both. `forwardRef` works on both majors — see #488.
 */
export declare const Checkbox: React.ForwardRefExoticComponent<
  CheckboxProps & React.RefAttributes<HTMLInputElement>
>;
