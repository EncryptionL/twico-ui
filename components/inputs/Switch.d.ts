import * as React from "react";
import type { Tone } from "../_types";

/**
 * Toggle switch with a springy thumb. Use for instant on/off settings.
 *
 * @startingPoint section="Toggles" subtitle="On/off toggle switch" viewport="700x120"
 */
export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
  label?: React.ReactNode;
  description?: React.ReactNode;
  /** Error message shown below the control; tints the track red and wires `aria-invalid`/`aria-describedby`. @default undefined */
  error?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  /** Color intent. @default "primary" */
  tone?: Tone;
}

export function Switch(props: SwitchProps): React.JSX.Element;
