import * as React from "react";

/**
 * Range slider with a filled track, draggable thumb, value bubble, optional
 * ticks, and full keyboard support (arrows / Home / End).
 *
 * @startingPoint section="Inputs" subtitle="Range slider with value bubble" viewport="700x110"
 */
export interface SliderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> {
  /** Label shown above the track. */
  label?: React.ReactNode;
  /** Helper text shown below the track when there is no error. */
  hint?: React.ReactNode;
  /** Error message shown below the track — turns it red (sets `aria-invalid`) and replaces the hint. */
  error?: React.ReactNode;
  /** Controlled value. */
  value?: number;
  /** Uncontrolled initial value. @default 0 */
  defaultValue?: number;
  /** @default 0 */
  min?: number;
  /** @default 100 */
  max?: number;
  /** @default 1 */
  step?: number;
  disabled?: boolean;
  /** Show the current value at the top-right. @default true */
  showValue?: boolean;
  /** Render step ticks along the rail. @default false */
  showTicks?: boolean;
  /** Format the displayed value (label + bubble). */
  formatValue?: (value: number) => React.ReactNode;
  onChange?: (value: number) => void;
}

export function Slider(props: SliderProps): React.JSX.Element;
