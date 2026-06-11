import * as React from "react";

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

/**
 * Date-range picker — calendar with click-start/click-end selection, in-range
 * highlighting, hover preview, and quick presets (Last 7/14/30/90 days).
 *
 * @startingPoint section="Inputs" subtitle="Date range picker with presets" viewport="700x120"
 */
export interface DateRangePickerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> {
  label?: React.ReactNode;
  /** Controlled range. */
  value?: DateRange;
  /** Uncontrolled initial range. @default { start: null, end: null } */
  defaultValue?: DateRange;
  placeholder?: string;
  /** Show the quick-preset column. @default true */
  presets?: boolean;
  /** First day of week: 0 = Sunday, 1 = Monday. @default 0 */
  weekStartsOn?: 0 | 1;
  onChange?: (range: DateRange) => void;
}

export function DateRangePicker(props: DateRangePickerProps): React.JSX.Element;
