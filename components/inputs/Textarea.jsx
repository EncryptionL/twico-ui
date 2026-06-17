import React from "react";

export function Textarea({
  label,
  hint,
  error,
  required = false,
  size = "md",
  tone = "primary",
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
.twc-textarea__el[data-size="sm"] { padding: var(--space-2) var(--space-2-5); }
.twc-textarea__el[data-size="lg"] { padding: var(--space-3) var(--space-4); }
.twc-textarea__el::placeholder { color: var(--color-text-subtle); }
.twc-textarea__el:hover:not(:focus):not(:disabled) { border-color: var(--color-border-strong); }
/* tone → focus/open accent (default primary; reproduces current look). */
.twc-textarea__el { --_accent: var(--color-primary); --_ring: var(--ring); }
.twc-textarea__el[data-tone="success"] { --_accent: var(--color-success); --_ring: 0 0 0 var(--ring-width) color-mix(in srgb, var(--color-success) 32%, transparent); }
.twc-textarea__el[data-tone="warning"] { --_accent: var(--color-warning); --_ring: 0 0 0 var(--ring-width) color-mix(in srgb, var(--color-warning) 32%, transparent); }
.twc-textarea__el[data-tone="danger"]  { --_accent: var(--color-danger);  --_ring: 0 0 0 var(--ring-width) color-mix(in srgb, var(--color-danger) 32%, transparent); }
.twc-textarea__el[data-tone="info"]    { --_accent: var(--color-info);    --_ring: 0 0 0 var(--ring-width) color-mix(in srgb, var(--color-info) 32%, transparent); }
.twc-textarea__el[data-tone="neutral"] { --_accent: var(--color-border-strong); --_ring: 0 0 0 var(--ring-width) color-mix(in srgb, var(--color-text) 14%, transparent); }
.twc-textarea__el:focus { border-color: var(--_accent); box-shadow: var(--_ring); }
.twc-textarea__el[aria-invalid="true"] { border-color: var(--color-danger); }
.twc-textarea__el:disabled { background: var(--color-surface-sunken); opacity: 0.7; cursor: not-allowed; }
`;
    document.head.appendChild(el);
  }, []);

  const autoId = React.useId();
  const fieldId = id || autoId;
  const descId = `${fieldId}-desc`;
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
        data-size={size}
        data-tone={tone}
        rows={rows}
        disabled={disabled}
        required={required || undefined}
        aria-invalid={invalid || undefined}
        aria-describedby={error || hint ? descId : undefined}
        {...rest}
      />
      {error ? <span id={descId} className="twc-field__error">{error}</span> : hint ? <span id={descId} className="twc-field__hint">{hint}</span> : null}
    </div>
  );
}
