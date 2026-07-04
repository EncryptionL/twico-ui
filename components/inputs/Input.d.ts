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
  /** Icon-only node inside the field, leading edge — for a bordered text addon use `leftAddon`. */
  leftIcon?: React.ReactNode;
  /** Optional suffix icon/node inside the field, trailing edge. For `type="password"`, omitting this
   *  shows a built-in reveal/hide eye toggle; providing `rightIcon` replaces it. Icon-only — for a
   *  bordered text addon use `rightAddon`. */
  rightIcon?: React.ReactNode;
  /** Bordered text addon flush against the leading edge (e.g. `https://`, `@`) — distinct from the inline `leftIcon`. */
  leftAddon?: React.ReactNode;
  /** Bordered text addon flush against the trailing edge (e.g. `.00`, `kg`, `%`). */
  rightAddon?: React.ReactNode;
  /** With `maxLength`, render a live `current / max` character counter on the hint/error line; danger-toned near the limit. @default false */
  showCount?: boolean;
}

export function Input(props: InputProps): React.JSX.Element;
