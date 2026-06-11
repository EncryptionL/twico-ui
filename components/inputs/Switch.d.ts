import * as React from "react";

/**
 * Toggle switch with a springy thumb. Use for instant on/off settings.
 *
 * @startingPoint section="Toggles" subtitle="On/off toggle switch" viewport="700x120"
 */
export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
  label?: React.ReactNode;
  description?: React.ReactNode;
  size?: "sm" | "md";
}

export function Switch(props: SwitchProps): React.JSX.Element;
