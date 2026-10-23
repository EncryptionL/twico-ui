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
  /** Controlled range. */
  value?: DateRange;
  /** Uncontrolled initial range. @default { start: null, end: null } */
  defaultValue?: DateRange;
  placeholder?: string;
  /** Quick-preset column: `true` for the built-in rolling-day presets (Last 7/14/30/90), `false` to
   *  hide it, or a custom array of `{ label, range }` where `range` is a `DateRange` or a
   *  `() => DateRange` resolved at click time (for calendar-aligned presets like This month / YTD).
   *  @default true */
  presets?: boolean | Array<{ label: string; range: DateRange | (() => DateRange) }>;
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
  /** Control size. @default "md" */
  size?: "sm" | "md" | "lg";
  /** Show a clear (×) button when a range is set; clicking it resets both endpoints. @default true */
  clearable?: boolean;
  /** Custom display formatter for the range (defaults to a localized "start – end"). With `editable`, keep it compatible with `parse` so the text round-trips. */
  format?: (range: DateRange) => string;
  /** Render the trigger as a typeable input accepting "start – end"; typed text commits via `parse` on Enter/blur. @default false */
  editable?: boolean;
  /** Parse one side of the typed range into a Date (used when `editable`). Return a `Date` to accept, `null`/invalid to reject. Defaults to a lenient `Date.parse`. */
  parse?: (text: string) => Date | null;
  onChange?: (range: DateRange) => void;
}

export function DateRangePicker(props: DateRangePickerProps): React.JSX.Element;
