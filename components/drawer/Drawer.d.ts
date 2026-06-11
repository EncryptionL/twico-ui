import * as React from "react";

/**
 * Slide-in panel anchored to any screen edge, with scrim, Esc-to-close, and a
 * header/body/footer layout. Drive with `open` + `onClose`.
 */
export interface DrawerProps extends React.HTMLAttributes<HTMLDivElement> {
  open: boolean;
  onClose?: () => void;
  /** Edge the panel slides from. @default "right" */
  side?: "left" | "right" | "top" | "bottom";
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** Footer content, typically action buttons (right-aligned). */
  footer?: React.ReactNode;
  /** Panel width (left/right) or height (top/bottom) — number (px) or CSS value. */
  size?: number | string;
  /** Close when the backdrop is clicked. @default true */
  closeOnBackdrop?: boolean;
  children?: React.ReactNode;
}

export function Drawer(props: DrawerProps): React.JSX.Element | null;
