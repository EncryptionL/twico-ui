import * as React from "react";

/**
 * Modal dialog with scrim, pop-in animation, Esc-to-close, and backdrop close.
 * Render conditionally and drive with `open` + `onClose`.
 */
export interface DialogProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Whether the dialog is visible. */
  open: boolean;
  /** Called on close (Esc, backdrop, close button). */
  onClose?: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** Footer content, typically action buttons (right-aligned). */
  footer?: React.ReactNode;
  /** @default "md" */
  size?: "sm" | "md" | "lg";
  /** Close when the backdrop is clicked. @default true */
  closeOnBackdrop?: boolean;
  children?: React.ReactNode;
}

export function Dialog(props: DialogProps): React.JSX.Element | null;
