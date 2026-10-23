import * as React from "react";
import type { Tone } from "../_types";

/**
 * Multi-line text input with label, hint, and error state.
 */
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
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
  /** Marks the field required (adds an asterisk and forwards to the native textarea). */
  required?: boolean;
  /** Control size — same padding steps as Input. @default "md" */
  size?: "sm" | "md" | "lg";
  /** Color intent for the focus/open accent. @default "primary" */
  tone?: Tone;
  /** Grow to fit content between `minRows` and `maxRows` (resize handle hidden). @default false */
  autosize?: boolean;
  /** Minimum rows when `autosize` (falls back to `rows`). */
  minRows?: number;
  /** Maximum rows when `autosize`; taller content scrolls. */
  maxRows?: number;
  /** With `maxLength`, render a live `current / max` character counter; danger-toned near the limit. @default false */
  showCount?: boolean;
  /** #328: show a trailing clear (X) button (top-inline-end, clear of the resize handle) when non-empty;
   *  clicking it empties the field and fires `onChange` with the empty value. @default false */
  clearable?: boolean;
}

/** Forwards `ref` to the inner `<textarea>`. */
export declare const Textarea: React.ForwardRefExoticComponent<
  TextareaProps & React.RefAttributes<HTMLTextAreaElement>
>;
