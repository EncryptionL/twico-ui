import * as React from "react";
import type { Tone } from "../_types";

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
  /** Earliest selectable date (inclusive); earlier days are disabled. */
  min?: Date;
  /** Latest selectable date (inclusive); later days are disabled. */
  max?: Date;
  /** Predicate to disable arbitrary dates (return true to disable). */
  disabledDate?: (date: Date) => boolean;
  /** Disable all interaction (the popover cannot be opened). @default false */
  disabled?: boolean;
  /** Color intent for the focus/open accent. @default "primary" */
  tone?: Tone;
  /** Render the trigger as a typeable input accepting "start – end"; typed text commits via `parse` on Enter/blur. @default false */
  editable?: boolean;
  /** Parse one side of the typed range into a Date (used when `editable`). Return a `Date` to accept, `null`/invalid to reject. Defaults to a lenient `Date.parse`. */
  parse?: (text: string) => Date | null;
  onChange?: (range: DateRange) => void;
}

export function DateRangePicker(props: DateRangePickerProps): React.JSX.Element;
