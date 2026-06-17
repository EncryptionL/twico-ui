import React from "react";

export function Switch({
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
  className = "",
  onChange,
  ...rest
}) {
  React.useInsertionEffect(() => {
    if (document.getElementById("twc-switch-styles")) return;
    const el = document.createElement("style");
    el.id = "twc-switch-styles";
    el.textContent = `
/* tone → accent set (default primary). Mirrors Button's --_accent model; Badge's tone vocabulary. */
.twc-switch { --_accent: var(--color-primary); --_accent-fg: var(--color-primary-fg); --_accent-subtle: var(--color-primary-subtle); --_accent-subtle-fg: var(--color-primary-subtle-fg); --_accent-border: var(--color-primary-border); }
.twc-switch[data-tone="success"] { --_accent: var(--color-success); --_accent-fg: var(--color-success-fg); --_accent-subtle: var(--color-success-subtle); --_accent-subtle-fg: var(--color-success-subtle-fg); --_accent-border: var(--color-success); }
.twc-switch[data-tone="warning"] { --_accent: var(--color-warning); --_accent-fg: var(--color-warning-fg); --_accent-subtle: var(--color-warning-subtle); --_accent-subtle-fg: var(--color-warning-subtle-fg); --_accent-border: var(--color-warning); }
.twc-switch[data-tone="danger"]  { --_accent: var(--color-danger); --_accent-fg: var(--color-danger-fg); --_accent-subtle: var(--color-danger-subtle); --_accent-subtle-fg: var(--color-danger-subtle-fg); --_accent-border: var(--color-danger); }
.twc-switch[data-tone="info"]    { --_accent: var(--color-info); --_accent-fg: var(--color-info-fg); --_accent-subtle: var(--color-info-subtle); --_accent-subtle-fg: var(--color-info-subtle-fg); --_accent-border: var(--color-info); }
.twc-switch[data-tone="neutral"] { --_accent: var(--color-text); --_accent-fg: var(--color-surface); --_accent-subtle: var(--color-surface-sunken); --_accent-subtle-fg: var(--color-text-muted); --_accent-border: var(--color-border-strong); }
.twc-switch { display: inline-flex; align-items: center; gap: var(--space-3); cursor: pointer; font-family: var(--font-sans); }
.twc-switch[data-disabled="true"] { cursor: not-allowed; opacity: 0.55; }
.twc-switch__input { position: absolute; opacity: 0; width: 0; height: 0; }
.twc-switch__track {
  --_w: 44px; --_h: 24px; --_pad: 3px;
  position: relative; flex: none; width: var(--_w); height: var(--_h);
  background: var(--color-border-strong); border-radius: var(--radius-full);
  transition: background-color var(--duration-base) var(--ease-standard);
}
.twc-switch[data-size="sm"] .twc-switch__track { --_w: 36px; --_h: 20px; }
.twc-switch__thumb {
  position: absolute; top: var(--_pad); left: var(--_pad);
  width: calc(var(--_h) - var(--_pad) * 2); height: calc(var(--_h) - var(--_pad) * 2);
  background: var(--_accent-fg); border-radius: var(--radius-full); box-shadow: var(--shadow-sm);
  transition: transform var(--duration-base) var(--ease-spring);
}
.twc-switch__input:checked + .twc-switch__track { background: var(--_accent); }
.twc-switch__input:checked + .twc-switch__track .twc-switch__thumb { transform: translateX(calc(var(--_w) - var(--_h))); }
.twc-switch__input:focus-visible + .twc-switch__track { box-shadow: var(--ring); }
.twc-switch__input:active + .twc-switch__track .twc-switch__thumb { width: calc(var(--_h) - var(--_pad) * 2 + 4px); }
.twc-switch[data-invalid="true"] .twc-switch__track { box-shadow: inset 0 0 0 var(--border-medium) var(--color-danger); }
.twc-switch__text { display: flex; flex-direction: column; gap: 2px; }
.twc-switch__label { font-size: var(--text-sm); font-weight: var(--font-medium); color: var(--color-text); line-height: 1.3; }
.twc-switch__desc { font-size: var(--text-xs); color: var(--color-text-muted); }
.twc-field { display: flex; flex-direction: column; gap: var(--space-1-5); font-family: var(--font-sans); }
.twc-field__error { font-size: var(--text-xs); color: var(--color-danger-subtle-fg); font-weight: var(--font-medium); }
`;
    document.head.appendChild(el);
  }, []);

  const autoId = React.useId();
  const fieldId = id || autoId;
  const errId = `${fieldId}-error`;
  const invalid = Boolean(error);

  const describedBy = [rest["aria-describedby"], error ? errId : null].filter(Boolean).join(" ") || undefined;

  const control = (
    <label className={`twc-switch ${className}`} data-size={size} data-tone={tone} data-invalid={invalid || undefined} data-disabled={disabled || undefined} htmlFor={fieldId}>
      <input
        id={fieldId}
        type="checkbox"
        role="switch"
        className="twc-switch__input"
        checked={checked}
        defaultChecked={defaultChecked}
        disabled={disabled}
        onChange={onChange}
        {...rest}
        aria-required={required || undefined}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
      />
      <span className="twc-switch__track" aria-hidden="true">
        <span className="twc-switch__thumb" />
      </span>
      {(label || description) ? (
        <span className="twc-switch__text">
          {label ? <span className="twc-switch__label">{label}</span> : null}
          {description ? <span className="twc-switch__desc">{description}</span> : null}
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
