import * as React from "react";
import type { ToastTone } from "../_types";
import type { ToastViewportProps } from "./Toast";

/** A single toast's options when pushed imperatively. */
export interface ToastOptions {
  /** @default "default" */
  tone?: ToastTone;
  /** Bold heading. */
  title?: React.ReactNode;
  /** Body/description content. */
  description?: React.ReactNode;
  /** Override the tone icon. */
  icon?: React.ReactNode;
  /** Auto-dismiss after this many ms (overrides the provider default); 0/Infinity keeps it open. */
  duration?: number;
}

/** Tone helper signature: pass a title (or a full options object) + optional options. */
type ToastFn = (titleOrOptions: React.ReactNode | ToastOptions, options?: ToastOptions) => number;

/** Imperative toast API returned by useToast(). */
export interface ToastApi {
  /** Push a toast; returns its id. */
  toast: ((options: ToastOptions) => number) & {
    success: ToastFn;
    warning: ToastFn;
    danger: ToastFn;
    /** Alias of `danger`. */
    error: ToastFn;
    info: ToastFn;
    /** Default (neutral) tone. */
    show: ToastFn;
  };
  /** Dismiss a toast by id. */
  dismiss: (id: number) => void;
  /** Remove every toast. */
  clear: () => void;
  /** The current toast list. */
  toasts: Array<{ id: number } & ToastOptions & { children?: React.ReactNode }>;
}

/** Access the imperative toast API. Must be under a <ToastProvider>. */
export function useToast(): ToastApi;

/**
 * #469: extends the viewport's props because ToastProvider collects `...viewportProps` and spreads
 * them onto the <ToastViewport> it renders. Declaring only children/limit/duration meant a TS
 * consumer got TS2322 for `className` / `style` / `aria-label` - the usual way to re-position or
 * restyle the toast stack - on props that have always worked at runtime.
 */
export interface ToastProviderProps extends Omit<ToastViewportProps, "limit" | "children"> {
  children?: React.ReactNode;
  /** Max toasts shown at once (most recent kept). @default 4 */
  limit?: number;
  /** Default auto-dismiss duration in ms for toasts that don't set their own. @default 4500 */
  duration?: number;
}

/** Holds the toast list + renders a ToastViewport; exposes the API via useToast(). */
export function ToastProvider(props: ToastProviderProps): React.JSX.Element;
