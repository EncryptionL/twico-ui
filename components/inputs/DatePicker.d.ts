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
  /**
   * #494: always render the footer lane, empty when there is nothing to say, so this field is the
   * same height as one that has a `hint`, an `error` or a counter.
   *
   * A row of fields aligned with `align="flex-end"` splits onto two lines the moment ONE of them
   * has a hint: that field grows a footer, the others do not, and the caption ends up moving a
   * *different* control. `align` cannot fix it - `flex-start` lines up the labels instead, so the
   * controls part company as soon as one label wraps at a narrow width.
   *
   * Set it per field, or once on any ancestor for everything inside, which is the safer habit in a
   * row - with a per-field prop alone, adding a field later and forgetting it brings the
   * misalignment straight back:
   *
   * ```jsx
   * <Stack direction="row" align="flex-end" data-reserve-footer>
   *   <Select label="Filter" … />
   *   <Select label="Comparison" hint="Matches the whole value." … />
   *   <Input  label="Value" … />
   * </Stack>
   * ```
   *
   * The lane is held open by generated content, so it matches the real footer by construction -
   * same font metrics, same flex gap - rather than by a height that drifts when a token changes.
   * It adds no text to the accessibility tree.
   *
   * @default false
   */
  reserveFooter?: boolean;
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
  /** Predicate to disable arbitrary dates (return true to disable). Composes with `min`/`max`. */
  disabledDate?: (date: Date) => boolean;
  disabled?: boolean;
  /** Color intent for the focus/open accent. @default "primary" */
  tone?: Tone;
  /** Control size. @default "md" */
  size?: "sm" | "md" | "lg";
  /** Show a clear (×) button when a date is set. @default true */
  clearable?: boolean;
  /** Render the trigger as a typeable text input with a trailing calendar toggle; typed text commits via `parse` on Enter/blur. @default false */
  editable?: boolean;
  /** Parse typed text into a Date (used when `editable`). Return a `Date` to commit, `null`/invalid to revert. Defaults to a lenient `Date.parse`. */
  parse?: (text: string) => Date | null;
  /** Custom display formatter (defaults to a localized medium date). */
  format?: (date: Date) => string;
  /** BCP-47 locale for month/weekday names + date formatting (Intl). Omit for the runtime default. @default undefined */
  locale?: string;
  /** First day of week: 0 = Sunday … 6 = Saturday. @default 0 */
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  onChange?: (date: Date | null) => void;
}

export function DatePicker(props: DatePickerProps): React.JSX.Element;
