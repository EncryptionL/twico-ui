import * as React from "react";

/**
 * Hover/focus tooltip. Wraps a single trigger element.
 */
export interface TooltipProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Tooltip text/content. */
  label: React.ReactNode;
  /** @default "top" */
  placement?: "top" | "bottom" | "left" | "right";
  /** Open delay in ms. @default 120 */
  delay?: number;
  /** The trigger element. */
  children: React.ReactNode;
}

export function Tooltip(props: TooltipProps): React.JSX.Element;
