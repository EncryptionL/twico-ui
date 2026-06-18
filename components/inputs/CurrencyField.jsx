import React from "react";
import { CURRENCIES, CURRENCY_OPTIONS, clampPrecision } from "./Currency.jsx";
import { Select } from "./Select.jsx";

const CURF_CSS = `
/* Shared input shell (self-contained — CurrencyField must not depend on the
   Currency component being rendered on the same page to get these styles). */
.twc-cur {
  --_h: var(--control-h-md);
  display: flex; align-items: stretch; height: var(--_h);
  background: var(--color-surface); border: var(--border-thin) solid var(--color-border);
  border-radius: var(--radius-md); overflow: hidden;
  transition: border-color var(--duration-fast) var(--ease-standard), box-shadow var(--duration-fast) var(--ease-standard);
}
.twc-cur[data-size="sm"] { --_h: var(--control-h-sm); }
.twc-cur[data-size="lg"] { --_h: var(--control-h-lg); }
.twc-cur:hover:not(:focus-within) { border-color: var(--color-border-strong); }
/* tone → focus/open accent (default primary; reproduces current look). */
.twc-cur { --_accent: var(--color-primary); --_ring: var(--ring); }
.twc-cur[data-tone="success"] { --_accent: var(--color-success); --_ring: 0 0 0 var(--ring-width) color-mix(in srgb, var(--color-success) 32%, transparent); }
.twc-cur[data-tone="warning"] { --_accent: var(--color-warning); --_ring: 0 0 0 var(--ring-width) color-mix(in srgb, var(--color-warning) 32%, transparent); }
.twc-cur[data-tone="danger"]  { --_accent: var(--color-danger);  --_ring: 0 0 0 var(--ring-width) color-mix(in srgb, var(--color-danger) 32%, transparent); }
.twc-cur[data-tone="info"]    { --_accent: var(--color-info);    --_ring: 0 0 0 var(--ring-width) color-mix(in srgb, var(--color-info) 32%, transparent); }
.twc-cur[data-tone="neutral"] { --_accent: var(--color-border-strong); --_ring: 0 0 0 var(--ring-width) color-mix(in srgb, var(--color-text) 14%, transparent); }
.twc-cur:focus-within { border-color: var(--_accent); box-shadow: var(--_ring); }
.twc-cur[data-invalid="true"] { border-color: var(--color-danger); }
.twc-cur[data-invalid="true"]:focus-within { box-shadow: 0 0 0 var(--ring-width) color-mix(in srgb, var(--color-danger) 28%, transparent); }
.twc-cur[data-disabled="true"] { background: var(--color-surface-sunken); opacity: 0.7; }
.twc-cur__sym, .twc-cur__code {
  display: inline-flex; align-items: center; padding: 0 var(--space-3);
  background: var(--color-surface-sunken); color: var(--color-text-muted);
  font-size: var(--text-sm); font-weight: var(--font-semibold); white-space: nowrap; flex: none;
}
.twc-cur__sym { border-inline-end: var(--border-thin) solid var(--color-border); }
.twc-cur__code { border-inline-start: var(--border-thin) solid var(--color-border); font-variant-numeric: tabular-nums; letter-spacing: 0.02em; }
.twc-cur__el {
  flex: 1; min-width: 0; border: none; outline: none; background: transparent;
  font-family: inherit; font-size: var(--text-sm); color: var(--color-text);
  text-align: end; padding: 0 var(--space-3); font-variant-numeric: tabular-nums;
}
.twc-cur__el:focus, .twc-cur__el:focus-visible { outline: none; box-shadow: none; }
.twc-cur__el::placeholder { color: var(--color-text-subtle); }
.twc-cur__el::-webkit-outer-spin-button, .twc-cur__el::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
.twc-curf__pick { flex: none; display: flex; align-items: stretch; border-inline-end: var(--border-thin) solid var(--color-border); }
.twc-curf__pick .twc-field { width: 132px; }
.twc-curf__pick .twc-sel__trigger { height: 100%; border: none; border-radius: 0; background: var(--color-surface-sunken); box-shadow: none; }
.twc-curf__pick .twc-sel__trigger:focus-visible { box-shadow: var(--ring); }
.twc-curf__pick .twc-sel__value { font-weight: var(--font-semibold); color: var(--color-text-muted); }
`;

function useCurfStyles() {
  React.useInsertionEffect(() => {
    if (document.getElementById("twc-curf-styles")) return;
    const el = document.createElement("style");
    el.id = "twc-curf-styles"; el.textContent = CURF_CSS;
    document.head.appendChild(el);
  }, []);
}

/**
 * Currency input where the USER picks the currency from a dropdown. The chosen
 * currency drives the prefix symbol, suffix code, and the enforced precision.
 */
export function CurrencyField({
  label, hint, error, required = false, size = "md", tone = "primary",
  currency, defaultCurrency = "USD", onCurrencyChange, currencies,
  value, defaultValue = "", onChange, onValueChange,
  disabled = false, id, placeholder = "0.00", className = "", ...rest
}) {
  useCurfStyles();
  const autoId = React.useId();
  const fieldId = id || autoId;
  const invalid = Boolean(error);

  const curControlled = currency !== undefined;
  const [curInternal, setCurInternal] = React.useState(defaultCurrency);
  const cur = curControlled ? currency : curInternal;
  const meta = CURRENCIES[cur] || CURRENCIES.USD;
  const prec = meta.precision;

  const valControlled = value !== undefined;
  const [valInternal, setValInternal] = React.useState(() => clampPrecision(String(defaultValue ?? ""), prec));
  const shown = valControlled ? clampPrecision(String(value ?? ""), prec) : valInternal;

  // Link hint/error text to the input for screen readers (merged with any consumer-supplied ids).
  const describedBy = [error ? `${fieldId}-error` : hint ? `${fieldId}-hint` : null, rest["aria-describedby"]]
    .filter(Boolean).join(" ") || undefined;

  const options = React.useMemo(() => {
    if (!currencies) return CURRENCY_OPTIONS;
    return currencies.map((c) => (typeof c === "string" ? { value: c, label: `${c} — ${(CURRENCIES[c] || {}).label || c}` } : c));
  }, [currencies]);

  function setCurrency(next) {
    if (!curControlled) setCurInternal(next);
    onCurrencyChange?.(next);
    // re-clamp current value to the new currency's precision, and notify the consumer
    // so a controlled value (and any formatted display) stays in sync with what's shown.
    const reclamped = clampPrecision(shown, (CURRENCIES[next] || CURRENCIES.USD).precision);
    if (!valControlled) setValInternal(reclamped);
    onValueChange?.(reclamped === "" ? null : Number(reclamped), reclamped, next);
  }
  function handleChange(e) {
    onChange?.(e); // consumer handler first, then internal clamping/state
    const next = clampPrecision(e.target.value, prec);
    if (!valControlled) setValInternal(next);
    onValueChange?.(next === "" ? null : Number(next), next, cur);
  }
  function handleBlur(e) {
    rest.onBlur?.(e); // consumer handler first, so it fires even when the value is empty/NaN
    if (shown === "" || shown == null) return;
    const n = Number(shown); if (Number.isNaN(n)) return;
    const fixed = n.toFixed(prec);
    if (!valControlled) setValInternal(fixed);
    onValueChange?.(Number(fixed), fixed, cur);
  }

  return (
    <div className={`twc-field ${className}`}>
      {label ? (<label className="twc-field__label" htmlFor={fieldId}>{label}{required ? <span className="twc-field__req">*</span> : null}</label>) : null}
      <div className="twc-cur" data-size={size} data-tone={tone} data-invalid={invalid || undefined} data-disabled={disabled || undefined}>
        <span className="twc-curf__pick">
          <Select size={size} value={cur} options={options} disabled={disabled} searchable portal minWidth={260}
            aria-label="Currency" onChange={setCurrency} />
        </span>
        <span className="twc-cur__sym" aria-hidden="true">{meta.symbol}</span>
        <input
          id={fieldId} className="twc-cur__el" inputMode="decimal" type="text"
          value={shown} placeholder={placeholder} disabled={disabled} required={required || undefined}
          aria-invalid={invalid || undefined}
          {...rest}
          onChange={handleChange} onBlur={handleBlur} aria-describedby={describedBy}
        />
        <span className="twc-cur__code">{meta.code}</span>
      </div>
      {error ? <span id={`${fieldId}-error`} className="twc-field__error">{error}</span> : hint ? <span id={`${fieldId}-hint`} className="twc-field__hint">{hint}</span> : null}
    </div>
  );
}
