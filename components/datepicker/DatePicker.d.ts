import * as React from "react";

/**
 * Date picker with a calendar popover — month/year navigation, a month grid,
 * today highlight, min/max bounds, clearable value, and custom formatting.
 *
 * @startingPoint section="Inputs" subtitle="Calendar date picker" viewport="700x120"
 */
export interface DatePickerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> {
  label?: React.ReactNode;
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
  /** Show a clear (×) button when a date is set. @default true */
  clearable?: boolean;
  /** Custom display formatter (defaults to a localized medium date). */
  format?: (date: Date) => string;
  /** First day of week: 0 = Sunday, 1 = Monday. @default 0 */
  weekStartsOn?: 0 | 1;
  onChange?: (date: Date | null) => void;
}

export function DatePicker(props: DatePickerProps): React.JSX.Element;
