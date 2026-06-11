import React from "react";

export function Checkbox({
  label,
  description,
  error,
  checked,
  defaultChecked,
  indeterminate = false,
  disabled = false,
  size = "md",
  id,
  className = "",
  onChange,
  ...rest
}) {
  React.useInsertionEffect(() => {
    if (document.getElementById("twc-checkbox-styles")) return;
    const el = document.createElement("style");
    el.id = "twc-checkbox-styles";
    el.textContent = `
.twc-check { display: inline-flex; align-items: flex-start; gap: var(--space-2-5); cursor: pointer; font-family: var(--font-sans); }
.twc-check[data-disabled="true"] { cursor: not-allowed; opacity: 0.55; }
.twc-check__input { position: absolute; opacity: 0; width: 0; height: 0; }
.twc-check__box {
  --_sz: 20px;
  flex: none; width: var(--_sz); height: var(--_sz); margin-top: 1px;
  display: grid; place-items: center;
  border: var(--border-medium) solid var(--color-border-strong);
  border-radius: var(--radius-sm);
  background: var(--color-surface);
  color: var(--color-primary-fg);
  transition: background-color var(--duration-fast) var(--ease-standard),
              border-color var(--duration-fast) var(--ease-standard),
              transform var(--duration-fast) var(--ease-spring);
}
.twc-check[data-size="sm"] .twc-check__box { --_sz: 16px; }
.twc-check__svg { width: 70%; height: 70%; stroke-dasharray: 24; stroke-dashoffset: 24; transition: stroke-dashoffset var(--duration-base) var(--ease-out); }
.twc-check__input:checked + .twc-check__box,
.twc-check__input:indeterminate + .twc-check__box { background: var(--color-primary); border-color: var(--color-primary); }
.twc-check__input:checked + .twc-check__box .twc-check__svg,
.twc-check__input:indeterminate + .twc-check__box .twc-check__svg { stroke-dashoffset: 0; }
.twc-check__input:active + .twc-check__box { transform: scale(0.88); }
.twc-check__input:focus-visible + .twc-check__box { box-shadow: var(--ring); }
.twc-check[data-invalid="true"] .twc-check__box { border-color: var(--color-danger); }
.twc-check__text { display: flex; flex-direction: column; gap: 2px; }
.twc-check__label { font-size: var(--text-sm); font-weight: var(--font-medium); color: var(--color-text); line-height: 1.3; }
.twc-check__desc { font-size: var(--text-xs); color: var(--color-text-muted); }
.twc-field { display: flex; flex-direction: column; gap: var(--space-1-5); font-family: var(--font-sans); }
.twc-field__error { font-size: var(--text-xs); color: var(--color-danger-subtle-fg); font-weight: var(--font-medium); }
`;
    document.head.appendChild(el);
  }, []);

  const autoId = React.useId();
  const fieldId = id || autoId;
  const errId = `${fieldId}-error`;
  const invalid = Boolean(error);
  const ref = React.useRef(null);
  React.useEffect(() => { if (ref.current) ref.current.indeterminate = indeterminate; }, [indeterminate]);

  const describedBy = [rest["aria-describedby"], error ? errId : null].filter(Boolean).join(" ") || undefined;

  const control = (
    <label className={`twc-check ${className}`} data-size={size} data-invalid={invalid || undefined} data-disabled={disabled || undefined} htmlFor={fieldId}>
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
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
      />
      <span className="twc-check__box" aria-hidden="true">
        <svg className="twc-check__svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
          {indeterminate ? <path d="M5 12h14"/> : <path d="M20 6 9 17l-5-5"/>}
        </svg>
      </span>
      {(label || description) ? (
        <span className="twc-check__text">
          {label ? <span className="twc-check__label">{label}</span> : null}
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
