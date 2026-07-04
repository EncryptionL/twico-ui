import * as React from "react";

export interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  /** Submit handler — runs after `preventDefault()` (unless `preventDefault={false}`). */
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  /** Call `event.preventDefault()` before `onSubmit`. @default true */
  preventDefault?: boolean;
  /** Disable every control (via a `<fieldset disabled>`) and set `aria-busy`. @default false */
  loading?: boolean;
  /** Disable every control (via a `<fieldset disabled>`). @default false */
  disabled?: boolean;
  /** Vertical gap between children as a spacing-scale step (e.g. 4 → var(--space-4)). */
  gap?: number;
}

export declare const Form: React.ForwardRefExoticComponent<FormProps & React.RefAttributes<HTMLFormElement>>;
