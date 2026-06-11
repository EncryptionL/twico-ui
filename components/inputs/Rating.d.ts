import * as React from "react";

/**
 * Star rating — interactive (click/hover) or read-only display.
 *
 * @startingPoint section="Inputs" subtitle="Star rating" viewport="700x90"
 */
export interface RatingProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue" | "color"> {
  /** Controlled value (0…count). */
  value?: number;
  /** Uncontrolled initial value. @default 0 */
  defaultValue?: number;
  /** Number of stars. @default 5 */
  count?: number;
  /** @default "md" */
  size?: "sm" | "md" | "lg";
  /** Filled-star color (defaults to the warning/amber token). */
  color?: string;
  /** Display only, no interaction. @default false */
  readOnly?: boolean;
  /** Show the numeric value beside the stars. @default false */
  showValue?: boolean;
  onChange?: (value: number) => void;
}

export function Rating(props: RatingProps): React.JSX.Element;
