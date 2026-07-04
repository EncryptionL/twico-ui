import React from "react";
import { useScopedStyles } from "../_styles.js";
import { warnOnce } from "../_warn.js";

export function Radio({
  label,
  description,
  error,
  checked,
  defaultChecked,
  required = false,
  disabled = false,
  size = "md",
  tone = "primary",
  id,
  name,
  value,
  className = "",
  onChange,
  ...rest
}) {
  const __twcStyles = useScopedStyles("twc-radio-styles", `
.twc-radio { display: inline-flex; align-items: flex-start; gap: var(--space-2-5); cursor: pointer; font-family: var(--font-sans); }
/* tone → accent set (default primary). Mirrors Button's --_accent model; Badge's tone vocabulary. */
.twc-radio { --_accent: var(--color-primary); --_accent-fg: var(--color-primary-fg); --_accent-subtle: var(--color-primary-subtle); --_accent-subtle-fg: var(--color-primary-subtle-fg); --_accent-border: var(--color-primary-border); }
.twc-radio[data-tone="success"] { --_accent: var(--color-success); --_accent-fg: var(--color-success-fg); --_accent-subtle: var(--color-success-subtle); --_accent-subtle-fg: var(--color-success-subtle-fg); --_accent-border: var(--color-success); }
.twc-radio[data-tone="warning"] { --_accent: var(--color-warning); --_accent-fg: var(--color-warning-fg); --_accent-subtle: var(--color-warning-subtle); --_accent-subtle-fg: var(--color-warning-subtle-fg); --_accent-border: var(--color-warning); }
.twc-radio[data-tone="danger"]  { --_accent: var(--color-danger); --_accent-fg: var(--color-danger-fg); --_accent-subtle: var(--color-danger-subtle); --_accent-subtle-fg: var(--color-danger-subtle-fg); --_accent-border: var(--color-danger); }
.twc-radio[data-tone="info"]    { --_accent: var(--color-info); --_accent-fg: var(--color-info-fg); --_accent-subtle: var(--color-info-subtle); --_accent-subtle-fg: var(--color-info-subtle-fg); --_accent-border: var(--color-info); }
.twc-radio[data-tone="neutral"] { --_accent: var(--color-text); --_accent-fg: var(--color-surface); --_accent-subtle: var(--color-surface-sunken); --_accent-subtle-fg: var(--color-text-muted); --_accent-border: var(--color-border-strong); }
.twc-radio[data-disabled="true"] { cursor: not-allowed; opacity: 0.55; }
.twc-radio__input { position: absolute; opacity: 0; width: 0; height: 0; }
.twc-radio__dot {
  --_sz: 20px;
  flex: none; width: var(--_sz); height: var(--_sz); margin-top: 1px;
  display: grid; place-items: center;
  border: var(--border-medium) solid var(--color-border-strong);
  border-radius: var(--radius-full);
  background: var(--color-surface);
  transition: border-color var(--duration-fast) var(--ease-standard), transform var(--duration-fast) var(--ease-spring);
}
.twc-radio[data-size="sm"] .twc-radio__dot { --_sz: 16px; }
.twc-radio[data-size="lg"] .twc-radio__dot { --_sz: 25px; }
.twc-radio__dot::after {
  content: ""; width: 50%; height: 50%; border-radius: var(--radius-full);
  background: var(--_accent); transform: scale(0);
  transition: transform var(--duration-base) var(--ease-spring);
}
.twc-radio__input:checked + .twc-radio__dot { border-color: var(--_accent); }
.twc-radio__input:checked + .twc-radio__dot::after { transform: scale(1); }
.twc-radio__input:active + .twc-radio__dot { transform: scale(0.88); }
.twc-radio__input:focus-visible + .twc-radio__dot { box-shadow: var(--ring); }
.twc-radio[data-invalid="true"] .twc-radio__dot { border-color: var(--color-danger); }
.twc-radio__text { display: flex; flex-direction: column; gap: 2px; }
.twc-radio__label { font-size: var(--text-sm); font-weight: var(--font-medium); color: var(--color-text); line-height: 1.3; }
.twc-radio__desc { font-size: var(--text-xs); color: var(--color-text-muted); }
.twc-field { display: flex; flex-direction: column; gap: var(--space-1-5); font-family: var(--font-sans); }
.twc-field__error { font-size: var(--text-xs); color: var(--color-danger-subtle-fg); font-weight: var(--font-medium); }
`);

  const autoId = React.useId();
  const fieldId = id || autoId;
  const errId = `${fieldId}-error`;
  const invalid = Boolean(error);

  // #76: a label-less control with no aria-label/labelledby is unnamed (WCAG 4.1.2).
  if (process.env.NODE_ENV !== "production" && !label && !description && !rest["aria-label"] && !rest["aria-labelledby"]) {
    warnOnce("Radio.no-name", "Radio: no accessible name — pass `label`, or `aria-label`/`aria-labelledby` for a label-less control (WCAG 4.1.2).");
  }

  const describedBy = [rest["aria-describedby"], error ? errId : null].filter(Boolean).join(" ") || undefined;

  const control = (
    <label className={`twc-radio ${className}`} data-size={size} data-tone={tone} data-invalid={invalid || undefined} data-disabled={disabled || undefined} htmlFor={fieldId}>
      {__twcStyles}
      <input
        id={fieldId}
        type="radio"
        className="twc-radio__input"
        name={name}
        value={value}
        checked={checked}
        defaultChecked={defaultChecked}
        disabled={disabled}
        onChange={onChange}
        {...rest}
        required={required || undefined}
        aria-required={required || undefined}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
      />
      <span className="twc-radio__dot" aria-hidden="true" />
      {(label || description) ? (
        <span className="twc-radio__text">
          {label ? <span className="twc-radio__label">{label}</span> : null}
          {description ? <span className="twc-radio__desc">{description}</span> : null}
        </span>
      ) : null}
    </label>
  );

  if (!error) return control;
  return (
    <div className="twc-field">
      {control}
      <span id={errId} className="twc-field__error">{error}</span>
    </div>
  );
}
