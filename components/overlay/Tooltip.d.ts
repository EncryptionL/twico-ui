import * as React from "react";

/**
 * Hover/focus tooltip. Wraps a single trigger element. The tooltip is linked to the
 * trigger via aria-describedby while shown, is aria-hidden when closed, and Escape
 * dismisses it (WCAG 1.4.13).
 */
export interface TooltipProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Tooltip text/content. */
  label: React.ReactNode;
  /** @default "top" */
  placement?: "top" | "bottom" | "left" | "right";
  /** Open delay in ms. @default 120 */
  delay?: number;
  /** The trigger element; receives aria-describedby while shown (non-element children are wrapped in a span). */
  children: React.ReactNode;
}

export function Tooltip(props: TooltipProps): React.JSX.Element;
