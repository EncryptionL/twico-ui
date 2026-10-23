import * as React from "react";
import type { Tone } from "../_types";

/**
 * Color picker with a saturation/value square, hue slider, hex input, and
 * preset swatches. Opens in a popover; value is a hex string.
 *
 * @startingPoint section="Inputs" subtitle="Color picker with hue + presets" viewport="700x120"
 */
export interface ColorPickerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> {
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
  /** Controlled hex value, e.g. "#6366F1". */
  value?: string;
  /** Uncontrolled initial hex. @default "#6366F1" */
  defaultValue?: string;
  /** Preset swatches (hex strings). */
  presets?: string[];
  /** Disable all interaction (the popover cannot be opened). @default false */
  disabled?: boolean;
  /** Show an alpha slider and emit 8-digit `#RRGGBBAA`; the hex input then accepts 3/6/8-digit hex. @default false */
  alpha?: boolean;
  /** Color intent for the focus/open accent. @default "primary" */
  tone?: Tone;
  /** Control size. @default "md" */
  size?: "sm" | "md" | "lg";
  onChange?: (hex: string) => void;
}

export function ColorPicker(props: ColorPickerProps): React.JSX.Element;
