import React from "react";

const FIELD_CSS = `
.twc-field { display: flex; flex-direction: column; gap: var(--space-1-5); font-family: var(--font-sans); }
.twc-field__label { font-size: var(--text-sm); font-weight: var(--font-semibold); color: var(--color-text); display: flex; gap: 4px; align-items: center; }
.twc-field__req { color: var(--color-danger); }
.twc-field__hint { font-size: var(--text-xs); color: var(--color-text-muted); }
.twc-field__error { font-size: var(--text-xs); color: var(--color-danger-subtle-fg); font-weight: var(--font-medium); }

.twc-input {
  --_h: var(--control-h-md);
  display: flex; align-items: center; gap: var(--space-2);
  height: var(--_h);
  padding-inline: var(--space-3);
  background: var(--color-surface);
  border: var(--border-thin) solid var(--color-border);
  border-radius: var(--radius-md);
  transition: border-color var(--duration-fast) var(--ease-standard),
              box-shadow var(--duration-fast) var(--ease-standard),
              background-color var(--duration-fast) var(--ease-standard);
}
.twc-input[data-size="sm"] { --_h: var(--control-h-sm); padding-inline: var(--space-2-5); }
.twc-input[data-size="lg"] { --_h: var(--control-h-lg); padding-inline: var(--space-4); }
.twc-input:hover:not([data-disabled]):not(:focus-within) { border-color: var(--color-border-strong); }
.twc-input:focus-within { border-color: var(--color-primary); box-shadow: var(--ring); }
.twc-input[data-invalid="true"] { border-color: var(--color-danger); }
.twc-input[data-invalid="true"]:focus-within { box-shadow: 0 0 0 var(--ring-width) color-mix(in srgb, var(--color-danger) 28%, transparent); }
.twc-input[data-disabled] { background: var(--color-surface-sunken); opacity: 0.7; cursor: not-allowed; }
.twc-input__el {
  flex: 1; min-width: 0; border: none; outline: none; background: transparent;
  font-family: inherit; font-size: var(--text-sm); color: var(--color-text); height: 100%;
}
.twc-input__el:focus, .twc-input__el:focus-visible { outline: none; box-shadow: none; }
.twc-input__el::placeholder { color: var(--color-text-subtle); }
.twc-input__el:disabled { cursor: not-allowed; }
.twc-input__affix { display: inline-flex; color: var(--color-text-subtle); flex: none; }
.twc-input__reveal { display: inline-grid; place-items: center; width: 24px; height: 24px; padding: 0; border: none;
  background: transparent; color: var(--color-text-subtle); cursor: pointer; border-radius: var(--radius-sm);
  transition: background-color var(--duration-fast) var(--ease-standard), color var(--duration-fast) var(--ease-standard); }
.twc-input__reveal:hover { background: var(--color-surface-sunken); color: var(--color-text); }
.twc-input__reveal:focus-visible { outline: none; box-shadow: var(--ring); }
.twc-input__reveal svg { width: 17px; height: 17px; }
`;

function useFieldStyles() {
  React.useInsertionEffect(() => {
    if (document.getElementById("twc-field-styles")) return;
    const el = document.createElement("style");
    el.id = "twc-field-styles";
    el.textContent = FIELD_CSS;
    document.head.appendChild(el);
  }, []);
}

export function Input({
  label,
  hint,
  error,
  required = false,
  size = "md",
  leftIcon,
  rightIcon,
  type = "text",
  disabled = false,
  id,
  className = "",
  ...rest
}) {
  useFieldStyles();
  const autoId = React.useId();
  const fieldId = id || autoId;
  const descId = `${fieldId}-desc`;
  const invalid = Boolean(error);
  const isPassword = type === "password";
  const [revealed, setRevealed] = React.useState(false);
  const effectiveType = isPassword && revealed ? "text" : type;

  // Password fields get a built-in reveal/hide eye toggle unless the caller supplies their own rightIcon.
  const suffix = rightIcon
    ? <span className="twc-input__affix">{rightIcon}</span>
    : isPassword
      ? (
        <button type="button" className="twc-input__reveal" disabled={disabled}
          aria-label={revealed ? "Hide password" : "Show password"} aria-pressed={revealed}
          onClick={() => setRevealed((v) => !v)} tabIndex={disabled ? -1 : 0}>
          {revealed ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 0 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><path d="m2 2 20 20"/></svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
          )}
        </button>
      )
      : null;

  return (
    <div className={`twc-field ${className}`}>
      {label ? (
        <label className="twc-field__label" htmlFor={fieldId}>
          {label}{required ? <span className="twc-field__req">*</span> : null}
        </label>
      ) : null}
      <div className="twc-input" data-size={size} data-invalid={invalid || undefined} data-disabled={disabled || undefined}>
        {leftIcon ? <span className="twc-input__affix">{leftIcon}</span> : null}
        <input
          id={fieldId}
          className="twc-input__el"
          type={effectiveType}
          disabled={disabled}
          required={required || undefined}
          aria-invalid={invalid || undefined}
          aria-describedby={error || hint ? descId : undefined}
          {...rest}
        />
        {suffix}
      </div>
      {error ? <span id={descId} className="twc-field__error">{error}</span> : hint ? <span id={descId} className="twc-field__hint">{hint}</span> : null}
    </div>
  );
}
