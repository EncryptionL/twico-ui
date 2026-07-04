import React from "react";
import { useScopedStyles } from "../_styles.js";

// SSR-safe layout effect (the typeof guard touches no document at render/module eval).
const useIso = typeof document !== "undefined" ? React.useLayoutEffect : React.useEffect;

const TEXTAREA_CSS = `
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
.twc-textarea__el[data-readonly] { background: var(--color-surface-sunken); }
.twc-textarea__el[data-autosize="true"] { resize: none; overflow: hidden; }
.twc-field__footer { display: flex; align-items: center; gap: var(--space-2); }
.twc-field__count { margin-inline-start: auto; font-size: var(--text-xs); color: var(--color-text-muted); font-variant-numeric: tabular-nums; flex: none; }
.twc-field__count[data-danger="true"] { color: var(--color-danger-subtle-fg); }
`;

export const Textarea = React.forwardRef(function Textarea({
  label,
  hint,
  error,
  required = false,
  size = "md",
  tone = "primary",
  rows = 4,
  autosize = false,
  minRows,
  maxRows,
  showCount = false,
  disabled = false,
  id,
  className = "",
  ...rest
}, ref) {
  const __twcStyles = useScopedStyles("twc-textarea-styles", TEXTAREA_CSS);
  const autoId = React.useId();
  const fieldId = id || autoId;
  const descId = `${fieldId}-desc`;
  const countId = `${fieldId}-count`;
  const invalid = Boolean(error);

  // #68: forward the ref to the inner <textarea> while keeping our own handle for autosize.
  const innerRef = React.useRef(null);
  const setRef = (el) => { innerRef.current = el; if (typeof ref === "function") ref(el); else if (ref) ref.current = el; };

  // #69: character counter (hand-rolled controlled/uncontrolled length — no hook import).
  const countControlled = rest.value !== undefined;
  const [len, setLen] = React.useState(() => String(rest.defaultValue ?? "").length);
  const count = countControlled ? String(rest.value ?? "").length : len;
  const max = rest.maxLength;
  const showCounter = showCount && max != null;
  const near = showCounter && count >= Math.floor(max * 0.9);

  // #68: grow the textarea to its content between minRows and maxRows.
  const resize = () => {
    const el = innerRef.current;
    if (!el) return;
    el.style.height = "auto";
    const cs = getComputedStyle(el);
    const line = parseFloat(cs.lineHeight) || 20;
    const vPad = (parseFloat(cs.paddingTop) || 0) + (parseFloat(cs.paddingBottom) || 0);
    const vBorder = (parseFloat(cs.borderTopWidth) || 0) + (parseFloat(cs.borderBottomWidth) || 0);
    const min = (minRows ?? rows) * line + vPad + vBorder;
    const maxH = maxRows ? maxRows * line + vPad + vBorder : Infinity;
    const next = Math.min(Math.max(el.scrollHeight + vBorder, min), maxH);
    el.style.height = `${next}px`;
    el.style.overflowY = el.scrollHeight + vBorder > maxH ? "auto" : "hidden";
  };
  useIso(() => {
    if (autosize && innerRef.current) resize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autosize, rest.value, minRows, maxRows, rows]);

  const handleInput = (e) => { rest.onInput?.(e); if (autosize) resize(); };
  const handleChange = (e) => { rest.onChange?.(e); if (showCount && !countControlled) setLen(e.target.value.length); };

  // #72: error forces aria-invalid=true (visual+SR in sync); aria-describedby merges the
  // message id, counter id, and any consumer-supplied id — all applied after {...rest}.
  const ariaInvalid = invalid ? true : (rest["aria-invalid"] ?? undefined);
  const describedBy = [error || hint ? descId : null, showCounter ? countId : null, rest["aria-describedby"]]
    .filter(Boolean).join(" ") || undefined;

  return (
    <div className={`twc-field ${className}`}>
      {__twcStyles}
      {label ? (
        <label className="twc-field__label" htmlFor={fieldId}>
          {label}{required ? <span className="twc-field__req">*</span> : null}
        </label>
      ) : null}
      <textarea
        ref={setRef}
        id={fieldId}
        className="twc-textarea__el"
        data-size={size}
        data-tone={tone}
        data-autosize={autosize || undefined}
        data-readonly={rest.readOnly || undefined}
        rows={autosize ? (minRows ?? rows) : rows}
        disabled={disabled}
        required={required || undefined}
        aria-required={required || undefined}
        {...rest}
        onInput={handleInput}
        onChange={handleChange}
        aria-invalid={ariaInvalid}
        aria-describedby={describedBy}
      />
      {(error || hint || showCounter) ? (
        <div className="twc-field__footer">
          {error ? <span id={descId} className="twc-field__error">{error}</span> : hint ? <span id={descId} className="twc-field__hint">{hint}</span> : null}
          {showCounter ? <span id={countId} className="twc-field__count" data-danger={near || undefined} aria-live="polite">{count} / {max}</span> : null}
        </div>
      ) : null}
    </div>
  );
});
