import * as React from "react";

/**
 * Click-triggered floating panel anchored to a trigger element. Renders in a
 * portal (never clipped), auto-flips near the viewport edge, closes on
 * outside-click / Esc. Use for rich content; for plain text use Tooltip.
 */
export interface PopoverProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** The clickable trigger element. */
  trigger: React.ReactNode;
  /** Optional bold title inside the panel. */
  title?: React.ReactNode;
  /** Side to open toward. @default "bottom" */
  placement?: "top" | "bottom" | "left" | "right";
  /** Cross-axis alignment for top/bottom. @default "center" */
  align?: "start" | "center" | "end";
  /** Panel width in px. @default 240 */
  width?: number;
  /** Panel content. */
  children?: React.ReactNode;
  /** Open on first render in uncontrolled mode. @default false */
  defaultOpen?: boolean;
  /** Controlled open state — pair with `onOpenChange`. Omit for internal (uncontrolled) state. */
  open?: boolean;
  /** Called with the requested open state on trigger click, Esc, or outside click. */
  onOpenChange?: (open: boolean) => void;
}

export function Popover(props: PopoverProps): React.JSX.Element;
