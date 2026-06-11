import React from "react";
import { CURRENCIES, CURRENCY_OPTIONS, clampPrecision } from "./Currency.jsx";
import { Select } from "../selects/Select.jsx";

const CURF_CSS = `
.twc-curf__pick { flex: none; display: flex; align-items: stretch; border-right: var(--border-thin) solid var(--color-border); }
.twc-curf__pick .twc-field { width: 132px; }
.twc-curf__pick .twc-sel__trigger { height: 100%; border: none; border-radius: 0; background: var(--color-surface-sunken); box-shadow: none; }
.twc-curf__pick .twc-sel__trigger:focus-visible { box-shadow: var(--ring); }
.twc-curf__pick .twc-sel__value { font-weight: var(--font-semibold); color: var(--color-text-muted); }
`;

function useCurfStyles() {
  React.useEffect(() => {
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
  label, hint, error, required = false, size = "md",
  currency, defaultCurrency = "USD", onCurrencyChange, currencies,
  value, defaultValue = "", onValueChange,
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

  const options = React.useMemo(() => {
    if (!currencies) return CURRENCY_OPTIONS;
    return currencies.map((c) => (typeof c === "string" ? { value: c, label: `${c} — ${(CURRENCIES[c] || {}).label || c}` } : c));
  }, [currencies]);

  function setCurrency(next) {
    if (!curControlled) setCurInternal(next);
    onCurrencyChange?.(next);
    // re-clamp current value to the new currency's precision
    const reclamped = clampPrecision(shown, (CURRENCIES[next] || CURRENCIES.USD).precision);
    if (!valControlled) setValInternal(reclamped);
  }
  function handleChange(e) {
    const next = clampPrecision(e.target.value, prec);
    if (!valControlled) setValInternal(next);
    onValueChange?.(next === "" ? null : Number(next), next, cur);
  }
  function handleBlur() {
    if (shown === "" || shown == null) return;
    const n = Number(shown); if (Number.isNaN(n)) return;
    const fixed = n.toFixed(prec);
    if (!valControlled) setValInternal(fixed);
    onValueChange?.(Number(fixed), fixed, cur);
  }

  return (
    <div className={`twc-field ${className}`}>
      {label ? (<label className="twc-field__label" htmlFor={fieldId}>{label}{required ? <span className="twc-field__req">*</span> : null}</label>) : null}
      <div className="twc-cur" data-size={size} data-invalid={invalid || undefined} data-disabled={disabled || undefined}>
        <span className="twc-curf__pick">
          <Select size={size} value={cur} options={options} disabled={disabled} searchable portal minWidth={260}
            aria-label="Currency" onChange={setCurrency} />
        </span>
        <span className="twc-cur__sym" aria-hidden="true">{meta.symbol}</span>
        <input
          id={fieldId} className="twc-cur__el" inputMode="decimal" type="text"
          value={shown} placeholder={placeholder} disabled={disabled}
          aria-invalid={invalid || undefined}
          {...rest}
          onChange={handleChange} onBlur={handleBlur}
        />
        <span className="twc-cur__code">{meta.code}</span>
      </div>
      {error ? <span className="twc-field__error">{error}</span> : hint ? <span className="twc-field__hint">{hint}</span> : null}
    </div>
  );
}
