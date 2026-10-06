import * as React from "react";

/**
 * Click-triggered floating panel anchored to a trigger element. Renders in a
 * portal (never clipped), auto-flips near the viewport edge, closes on
 * outside-click / Esc. Use for rich content; for plain text use Tooltip.
 */
export interface PopoverProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** The clickable trigger. **Pass a single focusable control** (a `Button`/`IconButton`, or any element
   *  that is already a button/link). A passed element is CLONED to carry `tabIndex`, `aria-expanded`,
   *  `aria-haspopup`, `aria-controls` and the open handler, and those are only valid on a control:
   *  `aria-expanded` is prohibited on a plain `div`'s implicit `role="generic"` (#447). A non-control
   *  element still works - it is given `role="button"` and Enter/Space - but wrapping the real button in
   *  a `Box`/`Stack` to overlay a badge produces TWO tab stops for one control, so put the decoration
   *  outside the trigger instead. An explicit `role` you set is always preserved. A wrapping `Tooltip`
   *  must go OUTSIDE this component, not inside `trigger` - see docs/overlays.md. */
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
