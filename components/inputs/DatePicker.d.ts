import * as React from "react";
import type { Tone } from "../_types";

/**
 * Date picker with a calendar popover — month/year navigation, a month grid,
 * today highlight, min/max bounds, clearable value, and custom formatting.
 *
 * @startingPoint section="Inputs" subtitle="Calendar date picker" viewport="700x120"
 */
export interface DatePickerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> {
  /** Field label rendered above the control. */
  label?: React.ReactNode;
  /** Helper text shown below when there is no error. */
  hint?: React.ReactNode;
  /** Error message — turns the field red and replaces the hint. */
  error?: React.ReactNode;
  /** Marks the field required (adds an asterisk to the label). @default false */
  required?: boolean;
  /** Controlled selected date (or null). */
  value?: Date | null;
  /** Uncontrolled initial date. @default null */
  defaultValue?: Date | null;
  placeholder?: string;
  /** Earliest selectable date. */
  min?: Date;
  /** Latest selectable date. */
  max?: Date;
  disabled?: boolean;
  /** Color intent for the focus/open accent. @default "primary" */
  tone?: Tone;
  /** Show a clear (×) button when a date is set. @default true */
  clearable?: boolean;
  /** Custom display formatter (defaults to a localized medium date). */
  format?: (date: Date) => string;
  /** BCP-47 locale for month/weekday names + date formatting (Intl). Omit for the runtime default. @default undefined */
  locale?: string;
  /** First day of week: 0 = Sunday … 6 = Saturday. @default 0 */
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  onChange?: (date: Date | null) => void;
}

export function DatePicker(props: DatePickerProps): React.JSX.Element;
