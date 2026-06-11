import React from "react";

export function Textarea({
  label,
  hint,
  error,
  required = false,
  rows = 4,
  disabled = false,
  id,
  className = "",
  ...rest
}) {
  React.useInsertionEffect(() => {
    if (document.getElementById("twc-textarea-styles")) return;
    const el = document.createElement("style");
    el.id = "twc-textarea-styles";
    el.textContent = `
.twc-field { display: flex; flex-direction: column; gap: var(--space-1-5); font-family: var(--font-sans); }
.twc-field__label { font-size: var(--text-sm); font-weight: var(--font-semibold); color: var(--color-text); display: flex; gap: 4px; align-items: center; }
.twc-field__req { color: var(--color-danger); }
.twc-field__hint { font-size: var(--text-xs); color: var(--color-text-muted); }
.twc-field__error { font-size: var(--text-xs); color: var(--color-danger-subtle-fg); font-weight: var(--font-medium); }
.twc-textarea__el {
  width: 100%; resize: vertical; min-height: 80px;
  padding: var(--space-2-5) var(--space-3);
  font-family: var(--font-sans); font-size: var(--text-sm); line-height: var(--leading-normal);
  color: var(--color-text); background: var(--color-surface);
  border: var(--border-thin) solid var(--color-border); border-radius: var(--radius-md);
  outline: none;
  transition: border-color var(--duration-fast) var(--ease-standard), box-shadow var(--duration-fast) var(--ease-standard);
}
.twc-textarea__el::placeholder { color: var(--color-text-subtle); }
.twc-textarea__el:hover:not(:focus):not(:disabled) { border-color: var(--color-border-strong); }
.twc-textarea__el:focus { border-color: var(--color-primary); box-shadow: var(--ring); }
.twc-textarea__el[aria-invalid="true"] { border-color: var(--color-danger); }
.twc-textarea__el:disabled { background: var(--color-surface-sunken); opacity: 0.7; cursor: not-allowed; }
`;
    document.head.appendChild(el);
  }, []);

  const autoId = React.useId();
  const fieldId = id || autoId;
  const invalid = Boolean(error);

  return (
    <div className={`twc-field ${className}`}>
      {label ? (
        <label className="twc-field__label" htmlFor={fieldId}>
          {label}{required ? <span className="twc-field__req">*</span> : null}
        </label>
      ) : null}
      <textarea
        id={fieldId}
        className="twc-textarea__el"
        rows={rows}
        disabled={disabled}
        aria-invalid={invalid || undefined}
        {...rest}
      />
      {error ? <span className="twc-field__error">{error}</span> : hint ? <span className="twc-field__hint">{hint}</span> : null}
    </div>
  );
}
