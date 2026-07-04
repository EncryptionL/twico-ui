import * as React from "react";
import type { ToastTone } from "../_types";

/**
 * Transient notification card. Render inside a <ToastViewport> and manage a
 * list in state (push on action, remove on close / timeout).
 */
export interface ToastProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Semantic tone. `"neutral"` is an alias for `"default"` (matches Badge's vocabulary). @default "default" */
  tone?: ToastTone;
  /** Bold heading. */
  title?: React.ReactNode;
  /** Override the tone icon. */
  icon?: React.ReactNode;
  /** Show close button + handle dismissal. */
  onClose?: () => void;
  /** Auto-dismiss after this many ms (paused on hover/focus). `0`/`Infinity` keeps it open. @default 4500 */
  duration?: number;
  children?: React.ReactNode;
}

export function Toast(props: ToastProps): React.JSX.Element;

export interface ToastViewportProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Cap how many toasts are shown at once (keeps the most recent). */
  limit?: number;
  children?: React.ReactNode;
}

/** Fixed bottom-right stack container for toasts. */
export function ToastViewport(props: ToastViewportProps): React.JSX.Element;
