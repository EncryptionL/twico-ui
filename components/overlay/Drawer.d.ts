import * as React from "react";

/**
 * Slide-in panel anchored to any screen edge, with scrim, Esc-to-close, and a
 * header/body/footer layout. Drive with `open` + `onClose`.
 */
export interface DrawerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  open: boolean;
  onClose?: () => void;
  /** Edge the panel slides from. `left`/`right`/`top`/`bottom` are physical; `start`/`end`
   *  are logical (inline-start/inline-end) and mirror under `dir="rtl"`. @default "right" */
  side?: "left" | "right" | "top" | "bottom" | "start" | "end";
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** Footer content, typically action buttons (right-aligned). */
  footer?: React.ReactNode;
  /** Panel width for `side="left"`/`"right"` — preset "sm" (320px) / "md" (380px) / "lg" (480px), a number (px), or a CSS length. Ignored for top/bottom. @default "md" */
  width?: "sm" | "md" | "lg" | number | string;
  /** Panel height for `side="top"`/`"bottom"` — preset "sm" / "md" / "lg", a number (px), or a CSS length. Ignored for left/right. @default "md" */
  height?: "sm" | "md" | "lg" | number | string;
  /** Close when the backdrop is clicked. @default true */
  closeOnBackdrop?: boolean;
  /** Draw a rule between header/body and body/footer (matches `Dialog`). Suppressed automatically where the
   *  region is empty (no footer; a header with only a close button and no title/description). Set `false` for a
   *  panel that should read as one continuous surface. @default true */
  dividers?: boolean;
  children?: React.ReactNode;
}

export function Drawer(props: DrawerProps): React.JSX.Element | null;
