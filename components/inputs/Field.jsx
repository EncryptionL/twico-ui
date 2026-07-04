import React from "react";
import { useScopedStyles } from "../_styles.js";

// Shared form-field chrome (label + hint/error). Mirrors the exact markup Input.jsx and
// Select.jsx inline so any control wrapped in <Field> looks and behaves identically.
const FIELD_CSS = `
.twc-field { display: flex; flex-direction: column; gap: var(--space-1-5); font-family: var(--font-sans); }
.twc-field__label { font-size: var(--text-sm); font-weight: var(--font-semibold); color: var(--color-text); display: flex; gap: 4px; align-items: center; }
.twc-field__req { color: var(--color-danger); }
.twc-field__hint { font-size: var(--text-xs); color: var(--color-text-muted); }
.twc-field__error { font-size: var(--text-xs); color: var(--color-danger-subtle-fg); font-weight: var(--font-medium); }
`;

export function Field({
  label,
  hint,
  error,
  required = false,
  htmlFor,
  size = "md",
  id,
  className = "",
  children,
  ...rest
}) {
  const __twcStyles = useScopedStyles("twc-field-styles", FIELD_CSS);
  const autoId = React.useId();
  const fieldId = id || autoId;
  // Stable id for the hint/error element so the consumer can point their control's
  // aria-describedby at it. Same `${id}-desc` convention Input/Select use internally.
  const descId = `${fieldId}-desc`;

  // #71: auto-wire aria-describedby (merged) + aria-invalid onto a single element child, so a
  // Field error isn't visual-only. Multi-element/fragment/string children keep manual wiring.
  const hasMsg = Boolean(error || hint);
  const control = React.isValidElement(children)
    ? React.cloneElement(children, {
        "aria-describedby": [children.props["aria-describedby"], hasMsg ? descId : null].filter(Boolean).join(" ") || undefined,
        "aria-invalid": children.props["aria-invalid"] !== undefined ? children.props["aria-invalid"] : (error ? true : undefined),
      })
    : children;

  return (
    <div className={`twc-field ${className}`} data-size={size} {...rest}>
      {__twcStyles}
      {label ? (
        <label className="twc-field__label" htmlFor={htmlFor}>
          {label}{required ? <span className="twc-field__req">*</span> : null}
        </label>
      ) : null}
      {control}
      {error
        ? <span id={descId} className="twc-field__error">{error}</span>
        : hint ? <span id={descId} className="twc-field__hint">{hint}</span> : null}
    </div>
  );
}
