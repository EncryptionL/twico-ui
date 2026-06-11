import * as React from "react";

/**
 * Modal dialog with scrim, pop-in animation, Esc-to-close, and backdrop close.
 * Render conditionally and drive with `open` + `onClose`.
 */
export interface DialogProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Whether the dialog is visible. */
  open: boolean;
  /** Called on close (Esc, backdrop, close button). */
  onClose?: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** Footer content, typically action buttons (right-aligned). */
  footer?: React.ReactNode;
  /** `"full"` is a near-fullscreen panel (fills the viewport minus a small margin). @default "md" */
  size?: "sm" | "md" | "lg" | "full";
  /** Keep the header + footer fixed and scroll only the body (for long content). @default false */
  scrollBody?: boolean;
  /** Close when the backdrop is clicked. @default true */
  closeOnBackdrop?: boolean;
  children?: React.ReactNode;
}

export function Dialog(props: DialogProps): React.JSX.Element | null;
