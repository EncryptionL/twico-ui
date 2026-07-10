import * as React from "react";
import type { Tone } from "../_types";

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
  /** Controlled value. A `[number, number]` tuple enables dual-thumb range mode. Clamped into [min, max]. */
  value?: number | [number, number];
  /** Uncontrolled initial value (a tuple enables range mode). Clamped into [min, max]. @default 0 */
  defaultValue?: number | [number, number];
  /** Force dual-thumb range mode even without a tuple value (defaults the range to [min, max]). @default false */
  range?: boolean;
  /** Control size — scales the track, rail, and thumb. @default "md" */
  size?: "sm" | "md" | "lg";
  /** @default 0 */
  min?: number;
  /** @default 100 */
  max?: number;
  /** @default 1 */
  step?: number;
  /** Large-step increment for PageUp/PageDown. @default Math.max(step, (max - min) / 10) */
  pageStep?: number;
  /** Decimal places for the default display + aria value; derived from `step` when unset. */
  precision?: number;
  disabled?: boolean;
  /** Show the current value at the top-right. @default true */
  showValue?: boolean;
  /** Render step ticks along the rail. @default false */
  showTicks?: boolean;
  /** Color intent. @default "primary" */
  tone?: Tone;
  /** Format the displayed value (label + bubble). If it returns a node, pair it with `getAriaValueText`. */
  formatValue?: (value: number) => React.ReactNode;
  /** Human-readable value for assistive tech (`aria-valuetext`) — use when `formatValue` returns a node. */
  getAriaValueText?: (value: number) => string;
  /** Name for hidden form field(s) so the value participates in native form submission. */
  name?: string;
  onChange?: (value: number | [number, number]) => void;
}

export function Slider(props: SliderProps): React.JSX.Element;
