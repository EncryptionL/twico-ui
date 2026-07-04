import * as React from "react";

/**
 * Shared form-field chrome (label, hint, error, required asterisk) that wraps ANY control.
 *
 * `Field` renders the label + your `children` + a single hint/error line, reusing the exact
 * `.twc-field` markup Input/Select inline so every field looks identical. When `children` is a
 * SINGLE element, Field auto-wires it: it sets `aria-describedby` (merged with any the child
 * already has) to the hint/error id (`` `${id}-desc` ``) and `aria-invalid` when `error` is
 * present (never clobbering a child's explicit `aria-invalid`). Multiple/fragment/string children
 * keep manual wiring. `error` replaces `hint` when both are given (error wins).
 *
 * @example
 * <Field label="Email" hint="We never share it." htmlFor="email" id="email-field">
 *   <input id="email" />
 * </Field>
 */
export interface FieldProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "id"> {
  /** Field label rendered above the control. */
  label?: React.ReactNode;
  /** Helper text shown below when there is no error. */
  hint?: React.ReactNode;
  /** Error message — replaces the hint and renders in the danger color. */
  error?: React.ReactNode;
  /** Marks the field required (adds an asterisk after the label). @default false */
  required?: boolean;
  /** Id of the control the `<label>` should bind to (sets the label's `htmlFor`). */
  htmlFor?: string;
  /** Spacing scale, reserved for parity with Input/Select; exposed via `data-size`. @default "md" */
  size?: "sm" | "md" | "lg";
  /** Base id; the hint/error element gets `` `${id}-desc` `` for your `aria-describedby`. Auto-generated via `React.useId` when omitted. */
  id?: string;
  /** Extra class names appended to the `.twc-field` root. */
  className?: string;
  /** The control(s) the field wraps. */
  children?: React.ReactNode;
}

export function Field(props: FieldProps): React.JSX.Element;
