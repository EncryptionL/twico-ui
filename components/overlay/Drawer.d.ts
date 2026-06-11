import * as React from "react";

/**
 * Slide-in panel anchored to any screen edge, with scrim, Esc-to-close, and a
 * header/body/footer layout. Drive with `open` + `onClose`.
 */
export interface DrawerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  open: boolean;
  onClose?: () => void;
  /** Edge the panel slides from. @default "right" */
  side?: "left" | "right" | "top" | "bottom";
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** Footer content, typically action buttons (right-aligned). */
  footer?: React.ReactNode;
  /** Panel width (left/right) or height (top/bottom) — preset "sm" (320px) / "md" (380px) / "lg" (480px), number (px), or CSS value. */
  size?: "sm" | "md" | "lg" | number | string;
  /** Close when the backdrop is clicked. @default true */
  closeOnBackdrop?: boolean;
  children?: React.ReactNode;
}

export function Drawer(props: DrawerProps): React.JSX.Element | null;
