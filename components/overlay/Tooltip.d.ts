import * as React from "react";

/**
 * Hover/focus tooltip. Wraps a single trigger element. The tooltip is linked to the
 * trigger via aria-describedby while shown, is aria-hidden when closed, and Escape
 * dismisses it (WCAG 1.4.13).
 *
 * **Anchored mode** (advanced): pass an `anchor` element and control visibility with `open`
 * to position one tooltip against an arbitrary element instead of wrapping a trigger — e.g. a
 * data grid driving a single tooltip for whichever truncated cell is hovered. In this mode the
 * component renders only the portaled bubble (no wrapper), and the parent owns show/hide + Escape.
 */
export interface TooltipProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Tooltip text/content. */
  label: React.ReactNode;
  /** @default "top" */
  placement?: "top" | "bottom" | "left" | "right";
  /** Open delay in ms (hover/focus mode only). @default 120 */
  delay?: number;
  /** The trigger element; receives aria-describedby while shown (non-element children are wrapped in a span). Omitted in anchored mode. */
  children?: React.ReactNode;
  /** Anchored mode: the element to position the tooltip against (instead of wrapping a trigger). */
  anchor?: Element | null;
  /** Anchored mode: controlled visibility. Only used when `anchor` is provided. */
  open?: boolean;
}

export function Tooltip(props: TooltipProps): React.JSX.Element;
