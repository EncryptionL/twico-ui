import React from "react";
import { useScopedStyles } from "../_styles.js";
import { warnOnce } from "../_warn.js";

export function Checkbox({
  label,
  description,
  error,
  checked,
  defaultChecked,
  indeterminate = false,
  required = false,
  disabled = false,
  size = "md",
  tone = "primary",
  id,
  className = "",
  onChange,
  ...rest
}) {
  const __twcStyles = useScopedStyles("twc-checkbox-styles", `
.twc-check { display: inline-flex; align-items: flex-start; gap: var(--space-2-5); cursor: pointer; font-family: var(--font-sans); }
/* tone → accent set (default primary). Mirrors Button's --_accent model; Badge's tone vocabulary. */
.twc-check { --_accent: var(--color-primary); --_accent-fg: var(--color-primary-fg); --_accent-subtle: var(--color-primary-subtle); --_accent-subtle-fg: var(--color-primary-subtle-fg); --_accent-border: var(--color-primary-border); }
.twc-check[data-tone="success"] { --_accent: var(--color-success); --_accent-fg: var(--color-success-fg); --_accent-subtle: var(--color-success-subtle); --_accent-subtle-fg: var(--color-success-subtle-fg); --_accent-border: var(--color-success); }
.twc-check[data-tone="warning"] { --_accent: var(--color-warning); --_accent-fg: var(--color-warning-fg); --_accent-subtle: var(--color-warning-subtle); --_accent-subtle-fg: var(--color-warning-subtle-fg); --_accent-border: var(--color-warning); }
.twc-check[data-tone="danger"]  { --_accent: var(--color-danger); --_accent-fg: var(--color-danger-fg); --_accent-subtle: var(--color-danger-subtle); --_accent-subtle-fg: var(--color-danger-subtle-fg); --_accent-border: var(--color-danger); }
.twc-check[data-tone="info"]    { --_accent: var(--color-info); --_accent-fg: var(--color-info-fg); --_accent-subtle: var(--color-info-subtle); --_accent-subtle-fg: var(--color-info-subtle-fg); --_accent-border: var(--color-info); }
.twc-check[data-tone="neutral"] { --_accent: var(--color-text); --_accent-fg: var(--color-surface); --_accent-subtle: var(--color-surface-sunken); --_accent-subtle-fg: var(--color-text-muted); --_accent-border: var(--color-border-strong); }
.twc-check[data-disabled="true"] { cursor: not-allowed; opacity: 0.55; }
.twc-check__input { position: absolute; opacity: 0; width: 0; height: 0; }
.twc-check__box {
  --_sz: 20px;
  flex: none; width: var(--_sz); height: var(--_sz); margin-top: 1px;
  display: grid; place-items: center;
  border: var(--border-medium) solid var(--color-border-strong);
  border-radius: var(--radius-sm);
  background: var(--color-surface);
  color: var(--_accent-fg);
  transition: background-color var(--duration-fast) var(--ease-standard),
              border-color var(--duration-fast) var(--ease-standard),
              transform var(--duration-fast) var(--ease-spring);
}
.twc-check[data-size="sm"] .twc-check__box { --_sz: 16px; }
.twc-check[data-size="lg"] .twc-check__box { --_sz: 24px; }
.twc-check__svg { width: 70%; height: 70%; stroke-dasharray: 24; stroke-dashoffset: 24; transition: stroke-dashoffset var(--duration-base) var(--ease-out); }
.twc-check__input:checked + .twc-check__box,
.twc-check__input:indeterminate + .twc-check__box { background: var(--_accent); border-color: var(--_accent); }
.twc-check__input:checked + .twc-check__box .twc-check__svg,
.twc-check__input:indeterminate + .twc-check__box .twc-check__svg { stroke-dashoffset: 0; }
.twc-check__input:active + .twc-check__box { transform: scale(0.88); }
.twc-check__input:focus-visible + .twc-check__box { box-shadow: var(--ring); }
.twc-check[data-invalid="true"] .twc-check__box { border-color: var(--color-danger); }
.twc-check__text { display: flex; flex-direction: column; gap: 2px; }
.twc-check__label { font-size: var(--text-sm); font-weight: var(--font-medium); color: var(--color-text); line-height: 1.3; }
.twc-field__req { color: var(--color-danger); }
.twc-check__desc { font-size: var(--text-xs); color: var(--color-text-muted); }
.twc-field { display: flex; flex-direction: column; gap: var(--space-1-5); font-family: var(--font-sans); }
.twc-field__error { font-size: var(--text-xs); color: var(--color-danger-subtle-fg); font-weight: var(--font-medium); }
`);

  const autoId = React.useId();
  const fieldId = id || autoId;
  const errId = `${fieldId}-error`;
  const invalid = Boolean(error);
  const ref = React.useRef(null);
  // #85: keep the DOM indeterminate property in sync with BOTH props — checked wins, so the
  // partial→all "select all" flip clears the mixed state (effect re-runs on `checked` too).
  const mixed = indeterminate && !checked;
  React.useEffect(() => { if (ref.current) ref.current.indeterminate = mixed; }, [mixed]);

  // #76: a label-less control with no aria-label/labelledby is unnamed (WCAG 4.1.2).
  if (process.env.NODE_ENV !== "production" && !label && !description && !rest["aria-label"] && !rest["aria-labelledby"]) {
    warnOnce("Checkbox.no-name", "Checkbox: no accessible name — pass `label`, or `aria-label`/`aria-labelledby` for a label-less control (WCAG 4.1.2).");
  }

  const describedBy = [rest["aria-describedby"], error ? errId : null].filter(Boolean).join(" ") || undefined;

  const control = (
    <label className={`twc-check ${className}`} data-size={size} data-tone={tone} data-invalid={invalid || undefined} data-disabled={disabled || undefined} htmlFor={fieldId}>
      {__twcStyles}
      <input
        ref={ref}
        id={fieldId}
        type="checkbox"
        className="twc-check__input"
        checked={checked}
        defaultChecked={defaultChecked}
        disabled={disabled}
        onChange={onChange}
        {...rest}
        required={required || undefined}
        aria-required={required || undefined}
        aria-checked={mixed ? "mixed" : undefined}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
      />
      <span className="twc-check__box" aria-hidden="true">
        <svg className="twc-check__svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
          {mixed ? <path d="M5 12h14"/> : <path d="M20 6 9 17l-5-5"/>}
        </svg>
      </span>
      {(label || description) ? (
        <span className="twc-check__text">
          {label ? <span className="twc-check__label">{label}{required ? <span className="twc-field__req">*</span> : null}</span> : null}
          {description ? <span className="twc-check__desc">{description}</span> : null}
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
