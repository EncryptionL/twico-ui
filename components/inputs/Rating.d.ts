import * as React from "react";
import type { Tone } from "../_types";

/**
 * Star rating — interactive (click/hover) or read-only display.
 *
 * @startingPoint section="Inputs" subtitle="Star rating" viewport="700x90"
 */
export interface RatingProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue" | "color"> {
  /** Controlled value (0…count; 0 means "no rating"). A fractional value renders a partial
   *  star fill (display) — interactive click/keyboard selection is integer-only. */
  value?: number;
  /** Uncontrolled initial value (0 means "no rating"). @default 0 */
  defaultValue?: number;
  /** Number of stars. @default 5 */
  count?: number;
  /** @default "md" */
  size?: "sm" | "md" | "lg";
  /** Color intent for filled stars. @default "warning" */
  tone?: Tone;
  /** Explicit filled-star color; overrides `tone` when set. */
  color?: string;
  /** Display only — renders a single static value as `role="img"` named "<value> out of <count> stars"
   *  (overridable via `aria-label`), not a radiogroup of radios. @default false */
  readOnly?: boolean;
  /** Disable all interaction and dim the control. @default false */
  disabled?: boolean;
  /** Show the numeric value beside the stars (clean integer, or one decimal for fractional). @default false */
  showValue?: boolean;
  /** Allow clearing back to 0 — clicking the selected star, or pressing Delete/Backspace, resets to "no rating". @default true */
  clearable?: boolean;
  /** Custom formatter for the `showValue` badge and the read-only accessible label. Defaults to a clean integer, or one decimal for fractional values. */
  format?: (value: number) => React.ReactNode;
  onChange?: (value: number) => void;
}

export function Rating(props: RatingProps): React.JSX.Element;
