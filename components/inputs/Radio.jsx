import React from "react";

export function Radio({
  label,
  description,
  error,
  checked,
  defaultChecked,
  disabled = false,
  size = "md",
  id,
  name,
  value,
  className = "",
  onChange,
  ...rest
}) {
  React.useInsertionEffect(() => {
    if (document.getElementById("twc-radio-styles")) return;
    const el = document.createElement("style");
    el.id = "twc-radio-styles";
    el.textContent = `
.twc-radio { display: inline-flex; align-items: flex-start; gap: var(--space-2-5); cursor: pointer; font-family: var(--font-sans); }
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
.twc-radio__dot::after {
  content: ""; width: 50%; height: 50%; border-radius: var(--radius-full);
  background: var(--color-primary); transform: scale(0);
  transition: transform var(--duration-base) var(--ease-spring);
}
.twc-radio__input:checked + .twc-radio__dot { border-color: var(--color-primary); }
.twc-radio__input:checked + .twc-radio__dot::after { transform: scale(1); }
.twc-radio__input:active + .twc-radio__dot { transform: scale(0.88); }
.twc-radio__input:focus-visible + .twc-radio__dot { box-shadow: var(--ring); }
.twc-radio[data-invalid="true"] .twc-radio__dot { border-color: var(--color-danger); }
.twc-radio__text { display: flex; flex-direction: column; gap: 2px; }
.twc-radio__label { font-size: var(--text-sm); font-weight: var(--font-medium); color: var(--color-text); line-height: 1.3; }
.twc-radio__desc { font-size: var(--text-xs); color: var(--color-text-muted); }
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
    <label className={`twc-radio ${className}`} data-size={size} data-invalid={invalid || undefined} data-disabled={disabled || undefined} htmlFor={fieldId}>
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
