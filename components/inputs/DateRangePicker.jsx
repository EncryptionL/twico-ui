import React from "react";

const FIELD_CSS = `
.twc-field { display: flex; flex-direction: column; gap: var(--space-1-5); font-family: var(--font-sans); }
.twc-field__label { font-size: var(--text-sm); font-weight: var(--font-semibold); color: var(--color-text); display: flex; gap: 4px; align-items: center; }
.twc-field__req { color: var(--color-danger); }
.twc-field__hint { font-size: var(--text-xs); color: var(--color-text-muted); }
.twc-field__error { font-size: var(--text-xs); color: var(--color-danger-subtle-fg); font-weight: var(--font-medium); }
`;

const RANGE_CSS = `
.twc-drp { position: relative; font-family: var(--font-sans); display: flex; flex-direction: column; gap: var(--space-1-5); }
.twc-drp__label { font-size: var(--text-sm); font-weight: var(--font-semibold); color: var(--color-text); }
.twc-drp__control { display: flex; align-items: center; gap: var(--space-2); height: var(--control-h-md); padding: 0 var(--space-3);
  background: var(--color-surface); border: var(--border-thin) solid var(--color-border); border-radius: var(--radius-md); cursor: pointer;
  transition: border-color var(--duration-fast) var(--ease-standard), box-shadow var(--duration-fast) var(--ease-standard); }
.twc-drp__control:hover:not([data-open="true"]):not([data-disabled="true"]) { border-color: var(--color-border-strong); }
.twc-drp__control[data-open="true"] { border-color: var(--color-primary); box-shadow: var(--ring); }
.twc-drp__control[data-invalid="true"] { border-color: var(--color-danger); }
.twc-drp__control[data-invalid="true"][data-open="true"] { box-shadow: 0 0 0 var(--ring-width) color-mix(in srgb, var(--color-danger) 28%, transparent); }
.twc-drp__control[data-disabled="true"] { background: var(--color-surface-sunken); opacity: 0.7; cursor: not-allowed; }
.twc-drp__ic { flex: none; color: var(--color-text-subtle); display: inline-flex; }
.twc-drp__ic svg { width: 17px; height: 17px; }
.twc-drp__text { flex: 1; font-size: var(--text-sm); color: var(--color-text); white-space: nowrap; }
.twc-drp__text[data-placeholder="true"] { color: var(--color-text-subtle); }
.twc-drp__pop { position: absolute; z-index: var(--z-popover); top: calc(100% + 6px); left: 0; display: flex;
  background: var(--color-surface-raised); border: var(--border-thin) solid var(--color-border); border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg); animation: twico-scale-in var(--duration-fast) var(--ease-spring); transform-origin: top; }
.twc-drp__presets { display: flex; flex-direction: column; gap: 2px; padding: var(--space-3); border-right: var(--border-thin) solid var(--color-divider); min-width: 130px; }
.twc-drp__preset { border: none; background: none; text-align: left; font-family: inherit; font-size: var(--text-sm); color: var(--color-text);
  padding: 7px 10px; border-radius: var(--radius-md); cursor: pointer; white-space: nowrap; }
.twc-drp__preset:hover { background: var(--color-surface-sunken); }
.twc-drp__cal { padding: var(--space-3); width: 268px; }
.twc-drp__head { display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-2); }
.twc-drp__nav { display: inline-grid; place-items: center; width: 30px; height: 30px; border: none; background: transparent; color: var(--color-text-muted); cursor: pointer; border-radius: var(--radius-md); }
.twc-drp__nav:hover { background: var(--color-surface-sunken); color: var(--color-text); }
.twc-drp__nav svg { width: 17px; height: 17px; }
.twc-drp__title { font-size: var(--text-sm); font-weight: var(--font-bold); }
.twc-drp__grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 1px; }
.twc-drp__dow { text-align: center; font-size: 11px; font-weight: var(--font-bold); color: var(--color-text-subtle); padding: 4px 0; }
.twc-drp__day { aspect-ratio: 1; border: none; background: transparent; cursor: pointer; font-family: inherit; font-size: var(--text-sm); color: var(--color-text); display: grid; place-items: center; position: relative; }
.twc-drp__day[data-outside="true"] { color: var(--color-text-subtle); opacity: 0.45; }
.twc-drp__day:hover:not(:disabled) { background: var(--color-surface-sunken); border-radius: var(--radius-md); }
.twc-drp__day[data-in="true"] { background: var(--color-primary-subtle); border-radius: 0; }
.twc-drp__day[data-edge="start"] { background: var(--color-primary); color: var(--color-primary-fg); border-radius: var(--radius-md) 0 0 var(--radius-md); font-weight: var(--font-bold); }
.twc-drp__day[data-edge="end"] { background: var(--color-primary); color: var(--color-primary-fg); border-radius: 0 var(--radius-md) var(--radius-md) 0; font-weight: var(--font-bold); }
.twc-drp__day[data-edge="both"] { background: var(--color-primary); color: var(--color-primary-fg); border-radius: var(--radius-md); font-weight: var(--font-bold); }
.twc-drp__day:disabled { opacity: 0.3; cursor: not-allowed; }
`;

// Default-locale fallbacks — preserve the exact strings the component shipped with
// so output is byte-identical when `locale` is omitted (Intl short weekdays are 3-letter).
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DOW = ["Su","Mo","Tu","We","Th","Fr","Sa"];
// Full month names (January…December), Intl-derived for the given locale.
const monthNames = (locale) => {
  const f = new Intl.DateTimeFormat(locale, { month: "long" });
  return Array.from({ length: 12 }, (_, i) => f.format(new Date(2021, i, 1)));
};
// Weekday header labels in calendar column order (starting at `weekStartsOn`), Intl-derived.
const weekdayNames = (locale, weekStartsOn) => {
  const f = new Intl.DateTimeFormat(locale, { weekday: "short" });
  // 2021-08-01 is a Sunday — index 0..6 maps to Sun..Sat.
  return Array.from({ length: 7 }, (_, i) => f.format(new Date(2021, 7, 1 + ((i + weekStartsOn) % 7))));
};
const ymd = (d) => d ? new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime() : null;
const fmtD = (d, locale) => d ? d.toLocaleDateString(locale, { month: "short", day: "numeric", year: "numeric" }) : "";

export function DateRangePicker({
  label,
  hint,
  error,
  required = false,
  value,
  defaultValue = { start: null, end: null },
  placeholder = "Select date range",
  presets = true,
  locale,
  weekStartsOn = 0,
  disabled = false,
  onChange,
  className = "",
  ...rest
}) {
  React.useInsertionEffect(() => {
    if (!document.getElementById("twc-field-styles")) {
      const fel = document.createElement("style");
      fel.id = "twc-field-styles";
      fel.textContent = FIELD_CSS;
      document.head.appendChild(fel);
    }
    if (document.getElementById("twc-drp-styles")) return;
    const el = document.createElement("style");
    el.id = "twc-drp-styles";
    el.textContent = RANGE_CSS;
    document.head.appendChild(el);
  }, []);

  const [internal, setInternal] = React.useState(defaultValue);
  const range = value !== undefined ? value : internal;
  const [open, setOpen] = React.useState(false);
  const [view, setView] = React.useState(range.start || new Date());
  const [hover, setHover] = React.useState(null);
  const wrapRef = React.useRef(null);
  const labelId = React.useId();
  const descId = `${labelId}-desc`;
  const invalid = Boolean(error);

  // close the popover if the picker becomes disabled while open
  React.useEffect(() => { if (disabled) setOpen(false); }, [disabled]);

  React.useEffect(() => {
    if (!open) return;
    const onDown = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDown); document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDown); document.removeEventListener("keydown", onKey); };
  }, [open]);

  const set = (r) => { if (value === undefined) setInternal(r); onChange?.(r); };

  const clickDay = (d) => {
    if (!range.start || (range.start && range.end)) { set({ start: d, end: null }); }
    else { if (ymd(d) < ymd(range.start)) set({ start: d, end: range.start }); else set({ start: range.start, end: d }); setOpen(false); }
  };

  const applyPreset = (days) => {
    const end = new Date(); const start = new Date(); start.setDate(end.getDate() - days + 1);
    set({ start, end }); setView(start); setOpen(false);
  };

  // Locale-aware month/weekday names — fall back to the shipped English arrays
  // when `locale` is omitted so default output stays byte-identical.
  const months = React.useMemo(() => (locale === undefined ? MONTHS : monthNames(locale)), [locale]);
  const dows = React.useMemo(
    () => (locale === undefined ? Array.from({ length: 7 }, (_, i) => DOW[(i + weekStartsOn) % 7]) : weekdayNames(locale, weekStartsOn)),
    [locale, weekStartsOn],
  );

  const y = view.getFullYear(), m = view.getMonth();
  const startOffset = (new Date(y, m, 1).getDay() - weekStartsOn + 7) % 7;
  const gridStart = new Date(y, m, 1 - startOffset);

  const edgeOf = (t) => {
    const s = ymd(range.start), e = ymd(range.end) || (range.start && hover ? ymd(hover) : null);
    const lo = s != null && e != null ? Math.min(s, e) : s, hi = s != null && e != null ? Math.max(s, e) : s;
    if (s != null && hi === lo && t === s) return "both";
    if (t === lo) return "start"; if (t === hi) return "end"; return null;
  };
  const inRange = (t) => {
    const s = ymd(range.start); let e = ymd(range.end);
    if (s != null && e == null && hover) e = ymd(hover);
    if (s == null || e == null) return false;
    return t > Math.min(s, e) && t < Math.max(s, e);
  };

  const text = range.start ? `${fmtD(range.start, locale)} – ${range.end ? fmtD(range.end, locale) : "…"}` : "";

  return (
    <div className={`twc-drp twc-field ${className}`} ref={wrapRef} {...rest}>
      {label ? (
        <span className="twc-field__label" id={labelId}>
          {label}{required ? <span className="twc-field__req">*</span> : null}
        </span>
      ) : null}
      <div className="twc-drp__control" data-open={open || undefined} data-disabled={disabled || undefined} data-invalid={invalid || undefined} role="button" tabIndex={disabled ? -1 : 0}
        aria-haspopup="dialog" aria-expanded={open} aria-disabled={disabled || undefined} aria-labelledby={label ? labelId : undefined}
        aria-invalid={invalid || undefined} aria-describedby={error || hint ? descId : undefined}
        onClick={() => !disabled && setOpen((o) => !o)} onKeyDown={(e) => { if (!disabled && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); setOpen((o) => !o); } }}>
        <span className="twc-drp__ic" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg></span>
        <span className="twc-drp__text" data-placeholder={!range.start || undefined}>{range.start ? text : placeholder}</span>
      </div>

      {open ? (
        <div className="twc-drp__pop" role="dialog" aria-label="Choose date range">
          {presets ? (
            <div className="twc-drp__presets">
              {[["Last 7 days", 7], ["Last 14 days", 14], ["Last 30 days", 30], ["Last 90 days", 90]].map(([lbl, n]) => (
                <button key={n} type="button" className="twc-drp__preset" onClick={() => applyPreset(n)}>{lbl}</button>
              ))}
            </div>
          ) : null}
          <div className="twc-drp__cal">
            <div className="twc-drp__head">
              <button type="button" className="twc-drp__nav" aria-label="Previous month" onClick={() => setView(new Date(y, m - 1, 1))}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg></button>
              <span className="twc-drp__title">{months[m]} {y}</span>
              <button type="button" className="twc-drp__nav" aria-label="Next month" onClick={() => setView(new Date(y, m + 1, 1))}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg></button>
            </div>
            <div className="twc-drp__grid">
              {dows.map((d, i) => <div key={i} className="twc-drp__dow">{d}</div>)}
              {Array.from({ length: 42 }).map((_, i) => {
                const d = new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + i);
                const t = ymd(d), outside = d.getMonth() !== m;
                return (
                  <button key={i} type="button" className="twc-drp__day" data-outside={outside || undefined}
                    data-in={inRange(t) || undefined} data-edge={edgeOf(t) || undefined}
                    onMouseEnter={() => setHover(d)} onClick={() => clickDay(d)}>
                    {d.getDate()}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}
      {error ? <span id={descId} className="twc-field__error">{error}</span> : hint ? <span id={descId} className="twc-field__hint">{hint}</span> : null}
    </div>
  );
}
