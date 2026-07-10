import * as React from "react";
import type { Tone } from "../_types";

/**
 * Combined date + time picker over a single `Date` value. Composes DatePicker
 * (calendar popover) and TimePicker (column spinner) side by side; picking a date
 * keeps the current time and vice-versa. `min`/`max` bound the date; the time is free.
 *
 * @startingPoint section="Inputs" subtitle="Date + time picker" viewport="700x140"
 */
export interface DateTimePickerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> {
  /** Field label rendered above the pair. */
  label?: React.ReactNode;
  /** Helper text shown below when there is no error. */
  hint?: React.ReactNode;
  /** Error message — recolors both controls and replaces the hint. */
  error?: React.ReactNode;
  /** Marks the field required (adds an asterisk to the label). @default false */
  required?: boolean;
  /** Controlled selected date-time (or null). */
  value?: Date | null;
  /** Uncontrolled initial date-time. @default null */
  defaultValue?: Date | null;
  disabled?: boolean;
  /** Color intent for the focus/open accent on both controls. @default "primary" */
  tone?: Tone;
  /** Control size for both. @default "md" */
  size?: "sm" | "md" | "lg";
  /** Show a clear (×) button on the date control (clears the whole value). @default true */
  clearable?: boolean;
  /** Earliest selectable date. */
  min?: Date;
  /** Latest selectable date. */
  max?: Date;
  /** Predicate to disable arbitrary dates (return true to disable). */
  disabledDate?: (date: Date) => boolean;
  /** Increment (minutes) for the minute column. @default 5 */
  minuteStep?: number;
  /** Increment (seconds) for the second column (when `granularity="second"`). @default 5 */
  secondStep?: number;
  /** Time granularity: hour only, hour+minute, or hour+minute+second. @default "minute" */
  granularity?: "hour" | "minute" | "second";
  /** 24-hour or 12-hour (AM/PM) time columns. @default 24 */
  hourCycle?: 12 | 24;
  /** BCP-47 locale for names + formatting (Intl). @default undefined */
  locale?: string;
  /** First day of week: 0 = Sunday … 6 = Saturday. @default 0 */
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  /** Custom formatter for the date control's display. */
  dateFormat?: (date: Date) => string;
  /** Custom formatter for the time control's display. */
  timeFormat?: (date: Date) => string;
  /** Placeholder for the date control. @default "Select date" */
  datePlaceholder?: string;
  /** Placeholder for the time control. @default "Time" */
  timePlaceholder?: string;
  onChange?: (date: Date | null) => void;
}

export function DateTimePicker(props: DateTimePickerProps): React.JSX.Element;
