import * as React from "react";
import type { Tone } from "../_types";

/**
 * Radio button with label and description. Group several with the same `name`.
 */
export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
  label?: React.ReactNode;
  description?: React.ReactNode;
  /** Error message shown below the control; tints the dot red and wires `aria-invalid`/`aria-describedby`. @default undefined */
  error?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  /** Color intent. @default "primary" */
  tone?: Tone;
}

/**
 * #490: forwards `ref` to the native `<input type="radio">`.
 *
 * Declared rather than left to React 19's implicit pass-through: on React 19 `ref` is an ordinary
 * prop, so `{...rest}` would land one on the element anyway, but React 18 strips it and the type
 * denied it on both. `forwardRef` works on both majors — see #488.
 */
export declare const Radio: React.ForwardRefExoticComponent<
  RadioProps & React.RefAttributes<HTMLInputElement>
>;
