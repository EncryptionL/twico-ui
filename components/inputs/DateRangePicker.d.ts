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
  /** Field label rendered above the control. */
  label?: React.ReactNode;
  /** Helper text shown below when there is no error. */
  hint?: React.ReactNode;
  /** Error message — turns the field red and replaces the hint. */
  error?: React.ReactNode;
  /** Marks the field required (adds an asterisk to the label). @default false */
  required?: boolean;
  /** Controlled range. */
  value?: DateRange;
  /** Uncontrolled initial range. @default { start: null, end: null } */
  defaultValue?: DateRange;
  placeholder?: string;
  /** Show the quick-preset column. @default true */
  presets?: boolean;
  /** BCP-47 locale for month/weekday names + date formatting (Intl). Omit for the runtime default. @default undefined */
  locale?: string;
  /** First day of week: 0 = Sunday … 6 = Saturday. @default 0 */
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  /** Disable all interaction (the popover cannot be opened). @default false */
  disabled?: boolean;
  /** Color intent for the focus/open accent. @default "primary" */
  tone?: "primary" | "success" | "warning" | "danger" | "info" | "neutral";
  onChange?: (range: DateRange) => void;
}

export function DateRangePicker(props: DateRangePickerProps): React.JSX.Element;
