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
  /**
   * #494: always render the footer lane, empty when there is nothing to say, so this field is the
   * same height as one that has a `hint`, an `error` or a counter.
   *
   * A row of fields aligned with `align="flex-end"` splits onto two lines the moment ONE of them
   * has a hint: that field grows a footer, the others do not, and the caption ends up moving a
   * *different* control. `align` cannot fix it - `flex-start` lines up the labels instead, so the
   * controls part company as soon as one label wraps at a narrow width.
   *
   * Set it per field, or once on any ancestor for everything inside, which is the safer habit in a
   * row - with a per-field prop alone, adding a field later and forgetting it brings the
   * misalignment straight back:
   *
   * ```jsx
   * <Stack direction="row" align="flex-end" data-reserve-footer>
   *   <Select label="Filter" … />
   *   <Select label="Comparison" hint="Matches the whole value." … />
   *   <Input  label="Value" … />
   * </Stack>
   * ```
   *
   * The lane is held open by generated content, so it matches the real footer by construction -
   * same font metrics, same flex gap - rather than by a height that drifts when a token changes.
   * It adds no text to the accessibility tree.
   *
   * @default false
   */
  reserveFooter?: boolean;
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
