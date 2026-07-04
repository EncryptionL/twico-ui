import * as React from "react";
import type { Tone } from "../_types";

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
  tone?: Tone;
  /** Grow to fit content between `minRows` and `maxRows` (resize handle hidden). @default false */
  autosize?: boolean;
  /** Minimum rows when `autosize` (falls back to `rows`). */
  minRows?: number;
  /** Maximum rows when `autosize`; taller content scrolls. */
  maxRows?: number;
  /** With `maxLength`, render a live `current / max` character counter; danger-toned near the limit. @default false */
  showCount?: boolean;
}

/** Forwards `ref` to the inner `<textarea>`. */
export declare const Textarea: React.ForwardRefExoticComponent<
  TextareaProps & React.RefAttributes<HTMLTextAreaElement>
>;
