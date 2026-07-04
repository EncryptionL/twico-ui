import React from "react";
import { useScopedStyles } from "../_styles.js";

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
/* tone → focus/open accent (default primary; reproduces current look). */
.twc-input { --_accent: var(--color-primary); --_ring: var(--ring); }
.twc-input[data-tone="success"] { --_accent: var(--color-success); --_ring: 0 0 0 var(--ring-width) color-mix(in srgb, var(--color-success) 32%, transparent); }
.twc-input[data-tone="warning"] { --_accent: var(--color-warning); --_ring: 0 0 0 var(--ring-width) color-mix(in srgb, var(--color-warning) 32%, transparent); }
.twc-input[data-tone="danger"]  { --_accent: var(--color-danger);  --_ring: 0 0 0 var(--ring-width) color-mix(in srgb, var(--color-danger) 32%, transparent); }
.twc-input[data-tone="info"]    { --_accent: var(--color-info);    --_ring: 0 0 0 var(--ring-width) color-mix(in srgb, var(--color-info) 32%, transparent); }
.twc-input[data-tone="neutral"] { --_accent: var(--color-border-strong); --_ring: 0 0 0 var(--ring-width) color-mix(in srgb, var(--color-text) 14%, transparent); }
.twc-input:focus-within { border-color: var(--_accent); box-shadow: var(--_ring); }
.twc-input[data-invalid="true"] { border-color: var(--color-danger); }
.twc-input[data-invalid="true"]:focus-within { box-shadow: 0 0 0 var(--ring-width) color-mix(in srgb, var(--color-danger) 28%, transparent); }
.twc-input[data-disabled] { background: var(--color-surface-sunken); opacity: 0.7; cursor: not-allowed; }
.twc-input[data-readonly] { background: var(--color-surface-sunken); }
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

// Separate scoped block for the #69 counter + #70 bordered addons. Kept out of the shared
// `twc-field-styles` id (whose content differs per input-family component and dedupes by id).
const INPUT_EXTRA_CSS = `
.twc-input { overflow: hidden; }
.twc-input__addon { align-self: stretch; display: inline-flex; align-items: center; padding-inline: var(--space-3);
  background: var(--color-surface-sunken); color: var(--color-text-muted); font-size: var(--text-sm);
  font-weight: var(--font-semibold); white-space: nowrap; flex: none; }
.twc-input__addon--start { border-inline-end: var(--border-thin) solid var(--color-border); margin-inline-start: calc(-1 * var(--space-3)); }
.twc-input__addon--end { border-inline-start: var(--border-thin) solid var(--color-border); margin-inline-end: calc(-1 * var(--space-3)); }
.twc-field__footer { display: flex; align-items: center; gap: var(--space-2); }
.twc-field__count { margin-inline-start: auto; font-size: var(--text-xs); color: var(--color-text-muted); font-variant-numeric: tabular-nums; flex: none; }
.twc-field__count[data-danger="true"] { color: var(--color-danger-subtle-fg); }
`;

export function Input({
  label,
  hint,
  error,
  required = false,
  size = "md",
  tone = "primary",
  leftIcon,
  rightIcon,
  leftAddon,
  rightAddon,
  showCount = false,
  type = "text",
  disabled = false,
  id,
  className = "",
  ...rest
}) {
  const __twcStyles = useScopedStyles("twc-field-styles", FIELD_CSS);
  const __twcExtra = useScopedStyles("twc-input-extra-styles", INPUT_EXTRA_CSS);
  const autoId = React.useId();
  const fieldId = id || autoId;
  const descId = `${fieldId}-desc`;
  const countId = `${fieldId}-count`;
  const invalid = Boolean(error);

  // #69: character counter. Hand-rolled controlled/uncontrolled length (no hook import).
  const countControlled = rest.value !== undefined;
  const [len, setLen] = React.useState(() => String(rest.defaultValue ?? "").length);
  const count = countControlled ? String(rest.value ?? "").length : len;
  const max = rest.maxLength;
  const showCounter = showCount && max != null;
  const near = showCounter && count >= Math.floor(max * 0.9);
  const handleChange = (e) => { rest.onChange?.(e); if (showCount && !countControlled) setLen(e.target.value.length); };

  // #72: aria-invalid forced true on error (visual+SR in sync); consumer value wins otherwise.
  // aria-describedby merges the message id, the counter id, and any consumer-supplied id.
  const ariaInvalid = invalid ? true : (rest["aria-invalid"] ?? undefined);
  const describedBy = [error || hint ? descId : null, showCounter ? countId : null, rest["aria-describedby"]]
    .filter(Boolean).join(" ") || undefined;
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
      {__twcStyles}
      {__twcExtra}
      {label ? (
        <label className="twc-field__label" htmlFor={fieldId}>
          {label}{required ? <span className="twc-field__req">*</span> : null}
        </label>
      ) : null}
      <div className="twc-input" data-size={size} data-tone={tone} data-invalid={invalid || undefined} data-disabled={disabled || undefined} data-readonly={rest.readOnly || undefined}>
        {leftAddon != null ? <span className="twc-input__addon twc-input__addon--start">{leftAddon}</span> : null}
        {leftIcon ? <span className="twc-input__affix">{leftIcon}</span> : null}
        <input
          id={fieldId}
          className="twc-input__el"
          type={effectiveType}
          disabled={disabled}
          required={required || undefined}
          aria-required={required || undefined}
          {...rest}
          onChange={handleChange}
          aria-invalid={ariaInvalid}
          aria-describedby={describedBy}
        />
        {suffix}
        {rightAddon != null ? <span className="twc-input__addon twc-input__addon--end">{rightAddon}</span> : null}
      </div>
      {(error || hint || showCounter) ? (
        <div className="twc-field__footer">
          {error ? <span id={descId} className="twc-field__error">{error}</span> : hint ? <span id={descId} className="twc-field__hint">{hint}</span> : null}
          {showCounter ? <span id={countId} className="twc-field__count" data-danger={near || undefined} aria-live="polite">{count} / {max}</span> : null}
        </div>
      ) : null}
    </div>
  );
}
