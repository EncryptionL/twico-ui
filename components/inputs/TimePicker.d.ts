import * as React from "react";
import type { Tone } from "../_types";

/**
 * Time-of-day picker with a column-spinner popover — scrollable hour/minute
 * (optional second) columns plus an AM/PM column in 12-hour mode. Emits a `Date`
 * (date part from `referenceDate`/the current value, time part from the selection)
 * so it composes with DatePicker into a DateTimePicker. Min/max bound the
 * time-of-day; clearable value, optional typed entry, custom formatting.
 *
 * @startingPoint section="Inputs" subtitle="Time-of-day picker" viewport="700x120"
 */
export interface TimePickerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> {
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
  /** Controlled selected time as a Date (or null). */
  value?: Date | null;
  /** Uncontrolled initial time. @default null */
  defaultValue?: Date | null;
  placeholder?: string;
  /** Earliest selectable time-of-day (only H:M:S are compared). */
  min?: Date;
  /** Latest selectable time-of-day (only H:M:S are compared). */
  max?: Date;
  /** Increment (minutes) for the minute column. @default 5 */
  minuteStep?: number;
  /** Increment (seconds) for the second column (when `granularity="second"`). @default 5 */
  secondStep?: number;
  /** Which columns show: hour only, hour+minute, or hour+minute+second. @default "minute" */
  granularity?: "hour" | "minute" | "second";
  /** 24-hour columns or 12-hour columns with an AM/PM column. @default 24 */
  hourCycle?: 12 | 24;
  /** Date whose Y/M/D is used for the emitted Date when no value is set yet. @default today */
  referenceDate?: Date;
  disabled?: boolean;
  /** Color intent for the focus/open accent. @default "primary" */
  tone?: Tone;
  /** Control size. @default "md" */
  size?: "sm" | "md" | "lg";
  /** Show a clear (×) button when a time is set. @default true */
  clearable?: boolean;
  /** Render the trigger as a typeable text input with a trailing toggle; typed text commits via `parse` on Enter/blur. @default false */
  editable?: boolean;
  /** Parse typed text into a Date (used when `editable`). Return a `Date` to commit, `null`/invalid to revert. Defaults to an `HH:MM[:SS] [am/pm]` matcher. */
  parse?: (text: string) => Date | null;
  /** Custom display formatter (defaults to a localized time honoring `hourCycle`/`granularity`). */
  format?: (date: Date) => string;
  /** BCP-47 locale for time formatting (Intl). Omit for the runtime default. @default undefined */
  locale?: string;
  onChange?: (date: Date | null) => void;
}

export function TimePicker(props: TimePickerProps): React.JSX.Element;
