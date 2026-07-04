import React from "react";
import { useScopedStyles } from "../_styles.js";
import { useFocusTrap } from "../_overlay.js";
import { createPortal } from "react-dom";

const FIELD_CSS = `
.twc-field { display: flex; flex-direction: column; gap: var(--space-1-5); font-family: var(--font-sans); }
.twc-field__label { font-size: var(--text-sm); font-weight: var(--font-semibold); color: var(--color-text); display: flex; gap: 4px; align-items: center; }
.twc-field__req { color: var(--color-danger); }
.twc-field__hint { font-size: var(--text-xs); color: var(--color-text-muted); }
.twc-field__error { font-size: var(--text-xs); color: var(--color-danger-subtle-fg); font-weight: var(--font-medium); }
`;

const DATEPICKER_CSS = `
.twc-dp { position: relative; font-family: var(--font-sans); display: flex; flex-direction: column; gap: var(--space-1-5); }
.twc-dp__label { font-size: var(--text-sm); font-weight: var(--font-semibold); color: var(--color-text); }
.twc-dp__control {
  display: flex; align-items: center; gap: var(--space-2); height: var(--control-h-md); padding: 0 var(--space-3);
  background: var(--color-surface); border: var(--border-thin) solid var(--color-border); border-radius: var(--radius-md);
  cursor: pointer; transition: border-color var(--duration-fast) var(--ease-standard), box-shadow var(--duration-fast) var(--ease-standard);
}
.twc-dp__control:hover:not([data-open="true"]) { border-color: var(--color-border-strong); }
/* tone → focus/open accent (default primary; reproduces current look). */
.twc-dp__control { --_accent: var(--color-primary); --_ring: var(--ring); }
.twc-dp__control[data-tone="success"] { --_accent: var(--color-success); --_ring: 0 0 0 var(--ring-width) color-mix(in srgb, var(--color-success) 32%, transparent); }
.twc-dp__control[data-tone="warning"] { --_accent: var(--color-warning); --_ring: 0 0 0 var(--ring-width) color-mix(in srgb, var(--color-warning) 32%, transparent); }
.twc-dp__control[data-tone="danger"]  { --_accent: var(--color-danger);  --_ring: 0 0 0 var(--ring-width) color-mix(in srgb, var(--color-danger) 32%, transparent); }
.twc-dp__control[data-tone="info"]    { --_accent: var(--color-info);    --_ring: 0 0 0 var(--ring-width) color-mix(in srgb, var(--color-info) 32%, transparent); }
.twc-dp__control[data-tone="neutral"] { --_accent: var(--color-border-strong); --_ring: 0 0 0 var(--ring-width) color-mix(in srgb, var(--color-text) 14%, transparent); }
.twc-dp__control[data-open="true"] { border-color: var(--_accent); box-shadow: var(--_ring); }
.twc-dp__control[data-invalid="true"] { border-color: var(--color-danger); }
.twc-dp__control[data-invalid="true"][data-open="true"] { box-shadow: 0 0 0 var(--ring-width) color-mix(in srgb, var(--color-danger) 28%, transparent); }
.twc-dp__control[data-disabled="true"] { background: var(--color-surface-sunken); opacity: 0.7; cursor: not-allowed; }
.twc-dp__field { position: relative; display: flex; flex-direction: column; }
.twc-dp__control[data-has-clear="true"] { padding-inline-end: 34px; }
.twc-dp__ic { flex: none; color: var(--color-text-subtle); display: inline-flex; }
.twc-dp__ic svg { width: 17px; height: 17px; }
.twc-dp__text { flex: 1; font-size: var(--text-sm); color: var(--color-text); }
.twc-dp__text[data-placeholder="true"] { color: var(--color-text-subtle); }
.twc-dp__clear { position: absolute; inset-inline-end: 10px; top: 50%; transform: translateY(-50%); display: inline-grid; place-items: center; width: 20px; height: 20px; border: none; background: transparent; color: var(--color-text-subtle); cursor: pointer; border-radius: var(--radius-full); }
.twc-dp__clear:hover { background: var(--color-surface-sunken); color: var(--color-text); }
.twc-dp__clear svg { width: 14px; height: 14px; }

.twc-dp__pop {
  position: fixed; z-index: var(--z-popover); width: 280px;
  background: var(--color-surface-raised); border: var(--border-thin) solid var(--color-border);
  border-radius: var(--radius-lg); box-shadow: var(--shadow-lg); padding: var(--space-3);
  animation: twico-scale-in var(--duration-fast) var(--ease-spring); transform-origin: top;
}
.twc-dp__head { display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-2); }
.twc-dp__nav { display: inline-grid; place-items: center; width: 30px; height: 30px; border: none; background: transparent; color: var(--color-text-muted); cursor: pointer; border-radius: var(--radius-md); transition: background-color var(--duration-fast); }
.twc-dp__nav:hover { background: var(--color-surface-sunken); color: var(--color-text); }
.twc-dp__nav svg { width: 17px; height: 17px; }
.twc-dp__title { font-size: var(--text-sm); font-weight: var(--font-bold); color: var(--color-text); border: none; background: transparent; cursor: pointer; padding: 5px 10px; border-radius: var(--radius-md); }
.twc-dp__title:hover { background: var(--color-surface-sunken); }
.twc-dp__grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; }
.twc-dp__dow { text-align: center; font-size: 11px; font-weight: var(--font-bold); color: var(--color-text-subtle); padding: 4px 0; text-transform: uppercase; }
.twc-dp__day { aspect-ratio: 1; display: grid; place-items: center; border: none; background: transparent; cursor: pointer;
  font-family: inherit; font-size: var(--text-sm); color: var(--color-text); border-radius: var(--radius-md);
  transition: background-color var(--duration-fast) var(--ease-standard), color var(--duration-fast) var(--ease-standard); }
.twc-dp__day:hover:not(:disabled):not([data-selected="true"]) { background: var(--color-surface-sunken); }
.twc-dp__day[data-outside="true"] { color: var(--color-text-subtle); opacity: 0.5; }
.twc-dp__day[data-today="true"] { font-weight: var(--font-bold); box-shadow: inset 0 0 0 1px var(--color-primary-border); }
.twc-dp__day[data-selected="true"] { background: var(--color-primary); color: var(--color-primary-fg); font-weight: var(--font-bold); }
.twc-dp__day:disabled { color: var(--color-text-subtle); opacity: 0.4; cursor: not-allowed; }
.twc-dp__sr { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0; }
.twc-dp__day:focus-visible { outline: none; box-shadow: var(--ring); }
.twc-dp__months { display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px; }
.twc-dp__mo { padding: 10px 0; border: none; background: transparent; cursor: pointer; font-family: inherit; font-size: var(--text-sm); color: var(--color-text); border-radius: var(--radius-md); }
.twc-dp__mo:hover { background: var(--color-surface-sunken); }
.twc-dp__mo[data-selected="true"] { background: var(--color-primary); color: var(--color-primary-fg); font-weight: var(--font-bold); }
[dir="rtl"] .twc-dp__nav svg { transform: scaleX(-1); }
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
// Abbreviated month names (Jan…Dec) for the month grid, Intl-derived.
const monthShortNames = (locale) => {
  const f = new Intl.DateTimeFormat(locale, { month: "short" });
  return Array.from({ length: 12 }, (_, i) => f.format(new Date(2021, i, 1)));
};
// Weekday header labels in calendar column order (starting at `weekStartsOn`), Intl-derived.
const weekdayNames = (locale, weekStartsOn) => {
  const f = new Intl.DateTimeFormat(locale, { weekday: "short" });
  // 2021-08-01 is a Sunday — index 0..6 maps to Sun..Sat.
  return Array.from({ length: 7 }, (_, i) => f.format(new Date(2021, 7, 1 + ((i + weekStartsOn) % 7))));
};
const sameDay = (a, b) => a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

export function DatePicker({
  label,
  hint,
  error,
  required = false,
  value,
  defaultValue = null,
  placeholder = "Select date",
  min,
  max,
  disabled = false,
  tone = "primary",
  clearable = true,
  format,
  locale,
  weekStartsOn = 0,
  onChange,
  id,
  className = "",
  ...rest
}) {
  const __twcStyles0 = useScopedStyles("twc-field-styles", FIELD_CSS);
  const __twcStyles1 = useScopedStyles("twc-datepicker-styles", DATEPICKER_CSS);

  const autoId = React.useId();
  const fieldId = id || autoId;
  const descId = `${fieldId}-desc`;
  const invalid = Boolean(error);
  const [internal, setInternal] = React.useState(defaultValue);
  const selected = value !== undefined ? value : internal;
  const [open, setOpen] = React.useState(false);
  const [view, setView] = React.useState(selected || new Date());
  const [mode, setMode] = React.useState("days");
  const [focusDate, setFocusDate] = React.useState(null);
  const [focusMonth, setFocusMonth] = React.useState(null); // #109: roving month index
  const [coords, setCoords] = React.useState(null);
  const wrapRef = React.useRef(null);
  const triggerRef = React.useRef(null);
  const popRef = React.useRef(null);
  const gridRef = React.useRef(null);

  // Portal the calendar to <body> with fixed positioning so it escapes any clipping
  // or scrolling ancestor; flips up when there isn't room below.
  const POP_W = 280;
  const place = React.useCallback(() => {
    const el = triggerRef.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const vh = window.innerHeight;
    const below = vh - r.bottom;
    const flip = below < 360 && r.top > below;
    let left = Math.min(r.left, window.innerWidth - POP_W - 8);
    left = Math.max(8, left);
    setCoords({ left, top: flip ? undefined : Math.round(r.bottom + 6), bottom: flip ? Math.round(vh - r.top + 6) : undefined });
  }, []);
  React.useEffect(() => {
    if (!open) return undefined;
    place();
    const onMove = () => place();
    window.addEventListener("scroll", onMove, true);
    window.addEventListener("resize", onMove);
    return () => { window.removeEventListener("scroll", onMove, true); window.removeEventListener("resize", onMove); };
  }, [open, place]);

  React.useEffect(() => {
    if (!open) return;
    setView(selected || new Date());
    setMode("days");
    setFocusDate(null);
    const onDown = (e) => {
      if (wrapRef.current && wrapRef.current.contains(e.target)) return;
      if (popRef.current && popRef.current.contains(e.target)) return;
      setOpen(false);
    };
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDown); document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDown); document.removeEventListener("keydown", onKey); };
  }, [open]);

  // #108: trap Tab within the calendar and restore focus to the trigger on close (the
  // calendar portals to <body>, so Tab from the trigger would otherwise skip it). Lands
  // focus on the tabbable day rather than the Prev-month button.
  useFocusTrap(popRef, open && !!coords, { initialFocus: () => gridRef.current?.querySelector('[tabindex="0"]') });

  // Locale-aware month/weekday names — fall back to the shipped English arrays
  // when `locale` is omitted so default output stays byte-identical.
  const months = React.useMemo(() => (locale === undefined ? MONTHS : monthNames(locale)), [locale]);
  const monthsShort = React.useMemo(() => (locale === undefined ? MONTHS.map((n) => n.slice(0, 3)) : monthShortNames(locale)), [locale]);
  const dows = React.useMemo(
    () => (locale === undefined ? Array.from({ length: 7 }, (_, i) => DOW[(i + weekStartsOn) % 7]) : weekdayNames(locale, weekStartsOn)),
    [locale, weekStartsOn],
  );

  const fmt = (d) => {
    if (!d) return "";
    if (format) return format(d);
    return d.toLocaleDateString(locale, { year: "numeric", month: "short", day: "numeric" });
  };
  const pick = (d) => { if (value === undefined) setInternal(d); onChange?.(d); setOpen(false); };

  const y = view.getFullYear(), m = view.getMonth();
  const first = new Date(y, m, 1);
  const startOffset = (first.getDay() - weekStartsOn + 7) % 7;
  const gridStart = new Date(y, m, 1 - startOffset);
  const today = new Date();
  const outOfRange = (d) => (min && d < new Date(min.getFullYear(), min.getMonth(), min.getDate())) || (max && d > new Date(max.getFullYear(), max.getMonth(), max.getDate()));

  const keyOf = (d) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
  const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
  const addMonths = (d, n) => { const last = new Date(d.getFullYear(), d.getMonth() + n + 1, 0); return new Date(last.getFullYear(), last.getMonth(), Math.min(d.getDate(), last.getDate())); };
  const cells = Array.from({ length: 42 }, (_, i) => new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + i));
  // Roving tabindex: one Tab stop in the day grid — the focused day, else selected, else today, else the 1st.
  const tabbableDate =
    (focusDate && cells.some((c) => sameDay(c, focusDate)) ? focusDate : null) ||
    (selected && cells.some((c) => sameDay(c, selected)) ? selected : null) ||
    (cells.some((c) => sameDay(c, today)) ? today : null) ||
    new Date(y, m, 1);

  // Move DOM focus to the freshly navigated day once it exists (month may have re-rendered).
  React.useEffect(() => {
    if (!open || mode !== "days" || !focusDate) return;
    gridRef.current?.querySelector(`[data-key="${keyOf(focusDate)}"]`)?.focus();
  }, [focusDate, open, mode]);

  // #109: roving focus for the month grid (3-col layout: ±1 horizontal, ±3 vertical).
  React.useEffect(() => {
    if (!open || mode !== "months" || focusMonth == null) return;
    gridRef.current?.querySelector(`[data-mo="${focusMonth}"]`)?.focus();
  }, [focusMonth, open, mode]);
  const onMonthsKeyDown = (e) => {
    const cur = focusMonth == null ? m : focusMonth;
    let next;
    if (e.key === "ArrowRight") next = cur + 1;
    else if (e.key === "ArrowLeft") next = cur - 1;
    else if (e.key === "ArrowDown") next = cur + 3;
    else if (e.key === "ArrowUp") next = cur - 3;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = 11;
    else return;
    e.preventDefault();
    // Step the year at the edges so navigation is continuous.
    if (next < 0) { setView(new Date(y - 1, 0, 1)); next += 12; }
    else if (next > 11) { setView(new Date(y + 1, 0, 1)); next -= 12; }
    setFocusMonth(next);
  };

  // Calendar keyboard navigation: arrows move by day/week, Home/End to week edges, PageUp/PageDown by month.
  const onGridKeyDown = (e) => {
    const btn = e.target.closest?.("[data-key]");
    if (!btn) return;
    const [fy, fm, fd] = btn.getAttribute("data-key").split("-").map(Number);
    const cur = new Date(fy, fm, fd);
    // Per-key stepper: arrows ±1/±7, Home/End within the week, PageUp/PageDown ±month.
    // Reused to keep stepping in the same direction past out-of-range (disabled) days.
    let step;
    if (e.key === "ArrowLeft") step = (d) => addDays(d, -1);
    else if (e.key === "ArrowRight") step = (d) => addDays(d, 1);
    else if (e.key === "ArrowUp") step = (d) => addDays(d, -7);
    else if (e.key === "ArrowDown") step = (d) => addDays(d, 7);
    else if (e.key === "Home") step = (d) => addDays(d, -((d.getDay() - weekStartsOn + 7) % 7));
    else if (e.key === "End") step = (d) => addDays(d, 6 - ((d.getDay() - weekStartsOn + 7) % 7));
    else if (e.key === "PageUp") step = (d) => addMonths(d, -1);
    else if (e.key === "PageDown") step = (d) => addMonths(d, 1);
    else return;
    e.preventDefault();
    let next = step(cur);
    // Skip over out-of-range days in the same direction; bail if none is reachable.
    let guard = 0;
    while (outOfRange(next) && guard < 366) { next = step(next); guard += 1; }
    if (outOfRange(next)) return;
    setFocusDate(next);
    if (next.getFullYear() !== y || next.getMonth() !== m) setView(new Date(next.getFullYear(), next.getMonth(), 1));
  };

  return (
    <div className={`twc-dp twc-field ${className}`} ref={wrapRef} {...rest}>
      {__twcStyles0}
      {__twcStyles1}
      {label ? (
        <label className="twc-field__label" id={`${fieldId}-label`}>
          {label}{required ? <span className="twc-field__req">*</span> : null}
        </label>
      ) : null}
      <div className="twc-dp__field">
        <div ref={triggerRef} className="twc-dp__control" id={fieldId} data-open={open || undefined} data-disabled={disabled || undefined}
          data-tone={tone}
          data-has-clear={clearable && selected && !disabled ? "true" : undefined}
          data-invalid={invalid || undefined}
          role="button" tabIndex={disabled ? -1 : 0} aria-haspopup="dialog" aria-expanded={open}
          aria-labelledby={label ? `${fieldId}-label` : undefined}
          aria-invalid={invalid || undefined} aria-describedby={error || hint ? descId : undefined}
          onClick={() => !disabled && setOpen((o) => !o)}
          onKeyDown={(e) => { if ((e.key === "Enter" || e.key === " ") && !disabled) { e.preventDefault(); setOpen((o) => !o); } }}>
          <span className="twc-dp__ic" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
          </span>
          <span className="twc-dp__text" data-placeholder={!selected || undefined}>{selected ? fmt(selected) : placeholder}</span>
        </div>
        {clearable && selected && !disabled ? (
          <button type="button" className="twc-dp__clear" aria-label="Clear" onClick={(e) => { e.stopPropagation(); pick(null); }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        ) : null}
      </div>

      {open && coords ? createPortal(
        <div className="twc-dp__pop" ref={popRef} role="dialog" aria-modal="true" aria-label="Choose date"
          style={{ position: "fixed", left: coords.left, right: "auto", top: coords.top, bottom: coords.bottom, zIndex: "var(--z-tooltip)" }}>
          <div className="twc-dp__head">
            <button type="button" className="twc-dp__nav" aria-label="Previous" onClick={() => setView(mode === "months" ? new Date(y - 1, m, 1) : new Date(y, m - 1, 1))}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <button type="button" className="twc-dp__title" onClick={() => { if (mode === "days") setFocusMonth(m); setMode(mode === "days" ? "months" : "days"); }}>
              {mode === "days" ? `${months[m]} ${y}` : y}
            </button>
            <span className="twc-dp__sr" aria-live="polite">{mode === "days" ? `${months[m]} ${y}` : y}</span>
            <button type="button" className="twc-dp__nav" aria-label="Next" onClick={() => setView(mode === "months" ? new Date(y + 1, m, 1) : new Date(y, m + 1, 1))}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </div>

          {mode === "days" ? (
            <div className="twc-dp__grid" ref={gridRef} onKeyDown={onGridKeyDown}>
              {dows.map((d, i) => <div key={i} className="twc-dp__dow">{d}</div>)}
              {cells.map((d, i) => {
                const outside = d.getMonth() !== m;
                return (
                  <button key={i} type="button" className="twc-dp__day" disabled={outOfRange(d)}
                    data-outside={outside || undefined} data-today={sameDay(d, today) || undefined} data-selected={sameDay(d, selected) || undefined}
                    data-key={keyOf(d)} tabIndex={sameDay(d, tabbableDate) ? 0 : -1}
                    aria-pressed={!!sameDay(d, selected)} aria-current={sameDay(d, today) ? "date" : undefined}
                    aria-label={locale === undefined ? d.toDateString() : d.toLocaleDateString(locale, { weekday: "long", year: "numeric", month: "long", day: "numeric" })} onClick={() => pick(d)}>
                    {d.getDate()}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="twc-dp__months" ref={gridRef} onKeyDown={onMonthsKeyDown} role="grid">
              {monthsShort.map((name, i) => (
                <button key={i} type="button" className="twc-dp__mo" role="gridcell" data-mo={i}
                  tabIndex={i === (focusMonth ?? m) ? 0 : -1}
                  data-selected={selected && selected.getFullYear() === y && selected.getMonth() === i || undefined}
                  onClick={() => { setView(new Date(y, i, 1)); setMode("days"); }}>
                  {name}
                </button>
              ))}
            </div>
          )}
        </div>, document.body
      ) : null}
      {error ? <span id={descId} className="twc-field__error">{error}</span> : hint ? <span id={descId} className="twc-field__hint">{hint}</span> : null}
    </div>
  );
}
