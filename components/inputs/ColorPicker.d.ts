import * as React from "react";

/**
 * Color picker with a saturation/value square, hue slider, hex input, and
 * preset swatches. Opens in a popover; value is a hex string.
 *
 * @startingPoint section="Inputs" subtitle="Color picker with hue + presets" viewport="700x120"
 */
export interface ColorPickerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> {
  label?: React.ReactNode;
  /** Controlled hex value, e.g. "#6366F1". */
  value?: string;
  /** Uncontrolled initial hex. @default "#6366F1" */
  defaultValue?: string;
  /** Preset swatches (hex strings). */
  presets?: string[];
  /** Disable all interaction (the popover cannot be opened). @default false */
  disabled?: boolean;
  onChange?: (hex: string) => void;
}

export function ColorPicker(props: ColorPickerProps): React.JSX.Element;
