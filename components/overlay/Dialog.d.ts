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
  /** Keep the header + footer fixed and scroll only the body when content exceeds the viewport — so the
   *  action buttons never scroll off-screen (#371). Set `false` for a panel that should scroll as one block
   *  (rare; note a non-portaled child that deliberately overflows the panel would be clipped). @default true */
  scrollBody?: boolean;
  /** Draw a rule between header/body and body/footer. Suppressed automatically where the region is empty
   *  (no footer; a header with only a close button and no title/description). Set `false` for a panel that
   *  should read as one continuous surface. @default true */
  dividers?: boolean;
  /** Close when the backdrop is clicked. @default true */
  closeOnBackdrop?: boolean;
  children?: React.ReactNode;
}

export function Dialog(props: DialogProps): React.JSX.Element | null;
