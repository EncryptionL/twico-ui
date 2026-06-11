import React from "react";

// Currency metadata (symbol, code, decimal precision). Inlined so the bundler ships it.
export const CURRENCIES = {
  USD: { code: "USD", symbol: "$", precision: 2, label: "US Dollar" },
  EUR: { code: "EUR", symbol: "€", precision: 2, label: "Euro" },
  GBP: { code: "GBP", symbol: "£", precision: 2, label: "British Pound" },
  JPY: { code: "JPY", symbol: "¥", precision: 0, label: "Japanese Yen" },
  IDR: { code: "IDR", symbol: "Rp", precision: 2, label: "Indonesian Rupiah" },
  CNY: { code: "CNY", symbol: "¥", precision: 2, label: "Chinese Yuan" },
  INR: { code: "INR", symbol: "₹", precision: 2, label: "Indian Rupee" },
  SGD: { code: "SGD", symbol: "S$", precision: 2, label: "Singapore Dollar" },
  AUD: { code: "AUD", symbol: "A$", precision: 2, label: "Australian Dollar" },
  CAD: { code: "CAD", symbol: "C$", precision: 2, label: "Canadian Dollar" },
  CHF: { code: "CHF", symbol: "Fr", precision: 2, label: "Swiss Franc" },
  KRW: { code: "KRW", symbol: "₩", precision: 0, label: "South Korean Won" },
  BRL: { code: "BRL", symbol: "R$", precision: 2, label: "Brazilian Real" },
  MYR: { code: "MYR", symbol: "RM", precision: 2, label: "Malaysian Ringgit" },
  THB: { code: "THB", symbol: "฿", precision: 2, label: "Thai Baht" },
};

export const CURRENCY_OPTIONS = Object.values(CURRENCIES).map((c) => ({
  value: c.code, label: `${c.code} — ${c.label}`,
}));

// Clamp a raw input string to the allowed precision (e.g. precision 2 → "2.259" → "2.25").
export function clampPrecision(str, precision) {
  if (str == null) return "";
  let s = String(str).replace(/[^0-9.\-]/g, "");
  s = s.replace(/(?!^)-/g, "");
  const firstDot = s.indexOf(".");
  if (firstDot !== -1) s = s.slice(0, firstDot + 1) + s.slice(firstDot + 1).replace(/\./g, "");
  if (precision <= 0) return s.split(".")[0];
  const [int, dec] = s.split(".");
  if (dec == null) return s;
  return int + "." + dec.slice(0, precision);
}

const CUR_CSS = `
.twc-field { display: flex; flex-direction: column; gap: var(--space-1-5); font-family: var(--font-sans); }
.twc-field__label { font-size: var(--text-sm); font-weight: var(--font-semibold); color: var(--color-text); display: flex; gap: 4px; align-items: center; }
.twc-field__req { color: var(--color-danger); }
.twc-field__hint { font-size: var(--text-xs); color: var(--color-text-muted); }
.twc-field__error { font-size: var(--text-xs); color: var(--color-danger-subtle-fg); font-weight: var(--font-medium); }
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
.twc-cur:focus-within { border-color: var(--color-primary); box-shadow: var(--ring); }
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
`;

function useCurStyles() {
  React.useInsertionEffect(() => {
    if (document.getElementById("twc-cur-styles")) return;
    const el = document.createElement("style");
    el.id = "twc-cur-styles"; el.textContent = CUR_CSS;
    document.head.appendChild(el);
  }, []);
}

/**
 * Currency input with a fixed currency (defined in code via `currency`).
 * Shows the symbol as a prefix and the currency code as a suffix, and enforces
 * the currency's decimal precision (e.g. 2 → rejects a 3rd decimal).
 */
export function Currency({
  label, hint, error, required = false, size = "md",
  currency = "USD", precision, symbol, code,
  value, defaultValue = "", onChange, onValueChange,
  disabled = false, id, placeholder = "0.00", className = "", ...rest
}) {
  useCurStyles();
  const meta = CURRENCIES[currency] || CURRENCIES.USD;
  const prec = precision != null ? precision : meta.precision;
  const sym = symbol != null ? symbol : meta.symbol;
  const cur = code != null ? code : meta.code;

  const autoId = React.useId();
  const fieldId = id || autoId;
  const invalid = Boolean(error);
  const controlled = value !== undefined;
  const [internal, setInternal] = React.useState(() => clampPrecision(String(defaultValue ?? ""), prec));
  const shown = controlled ? clampPrecision(String(value ?? ""), prec) : internal;

  // Link hint/error text to the input for screen readers (merged with any consumer-supplied ids).
  const describedBy = [error ? `${fieldId}-error` : hint ? `${fieldId}-hint` : null, rest["aria-describedby"]]
    .filter(Boolean).join(" ") || undefined;

  function handleChange(e) {
    const next = clampPrecision(e.target.value, prec);
    if (!controlled) setInternal(next);
    onChange?.(e);
    onValueChange?.(next === "" ? null : Number(next), next);
  }
  function handleBlur(e) {
    rest.onBlur?.(e); // consumer handler first, so it fires even when the value is empty/NaN
    if (shown === "" || shown == null) return;
    const n = Number(shown);
    if (Number.isNaN(n)) return;
    const fixed = n.toFixed(prec);
    if (!controlled) setInternal(fixed);
    onValueChange?.(Number(fixed), fixed);
  }

  return (
    <div className={`twc-field ${className}`}>
      {label ? (<label className="twc-field__label" htmlFor={fieldId}>{label}{required ? <span className="twc-field__req">*</span> : null}</label>) : null}
      <div className="twc-cur" data-size={size} data-invalid={invalid || undefined} data-disabled={disabled || undefined}>
        <span className="twc-cur__sym" aria-hidden="true">{sym}</span>
        <input
          id={fieldId} className="twc-cur__el" inputMode="decimal" type="text"
          value={shown} placeholder={placeholder} disabled={disabled} required={required || undefined}
          aria-invalid={invalid || undefined}
          {...rest}
          onChange={handleChange} onBlur={handleBlur} aria-describedby={describedBy}
        />
        <span className="twc-cur__code">{cur}</span>
      </div>
      {error ? <span id={`${fieldId}-error`} className="twc-field__error">{error}</span> : hint ? <span id={`${fieldId}-hint`} className="twc-field__hint">{hint}</span> : null}
    </div>
  );
}
