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

const RANGE_CSS = `
.twc-drp { position: relative; font-family: var(--font-sans); display: flex; flex-direction: column; gap: var(--space-1-5); }
.twc-drp__label { font-size: var(--text-sm); font-weight: var(--font-semibold); color: var(--color-text); }
.twc-drp__control { display: flex; align-items: center; gap: var(--space-2); height: var(--control-h-md); padding: 0 var(--space-3);
  background: var(--color-surface); border: var(--border-thin) solid var(--color-border); border-radius: var(--radius-md); cursor: pointer;
  transition: border-color var(--duration-fast) var(--ease-standard), box-shadow var(--duration-fast) var(--ease-standard); }
.twc-drp__control:hover:not([data-open="true"]):not([data-disabled="true"]) { border-color: var(--color-border-strong); }
/* tone → focus/open accent (default primary; reproduces current look). */
.twc-drp__control { --_accent: var(--color-primary); --_ring: var(--ring); }
.twc-drp__control[data-tone="success"] { --_accent: var(--color-success); --_ring: 0 0 0 var(--ring-width) color-mix(in srgb, var(--color-success) 32%, transparent); }
.twc-drp__control[data-tone="warning"] { --_accent: var(--color-warning); --_ring: 0 0 0 var(--ring-width) color-mix(in srgb, var(--color-warning) 32%, transparent); }
.twc-drp__control[data-tone="danger"]  { --_accent: var(--color-danger);  --_ring: 0 0 0 var(--ring-width) color-mix(in srgb, var(--color-danger) 32%, transparent); }
.twc-drp__control[data-tone="info"]    { --_accent: var(--color-info);    --_ring: 0 0 0 var(--ring-width) color-mix(in srgb, var(--color-info) 32%, transparent); }
.twc-drp__control[data-tone="neutral"] { --_accent: var(--color-border-strong); --_ring: 0 0 0 var(--ring-width) color-mix(in srgb, var(--color-text) 14%, transparent); }
.twc-drp__control[data-open="true"] { border-color: var(--_accent); box-shadow: var(--_ring); }
.twc-drp__control[data-invalid="true"] { border-color: var(--color-danger); }
.twc-drp__control[data-invalid="true"][data-open="true"] { box-shadow: 0 0 0 var(--ring-width) color-mix(in srgb, var(--color-danger) 28%, transparent); }
.twc-drp__control[data-disabled="true"] { background: var(--color-surface-sunken); opacity: 0.7; cursor: not-allowed; }
.twc-drp__ic { flex: none; color: var(--color-text-subtle); display: inline-flex; }
.twc-drp__ic svg { width: 17px; height: 17px; }
.twc-drp__text { flex: 1; font-size: var(--text-sm); color: var(--color-text); white-space: nowrap; }
.twc-drp__text[data-placeholder="true"] { color: var(--color-text-subtle); }
/* #105: editable (typed entry) variant. */
.twc-drp__control--editable { cursor: text; gap: 0; padding-inline-end: var(--space-1); }
.twc-drp__input { flex: 1; min-width: 0; height: 100%; border: none; background: transparent; outline: none; padding: 0;
  font-family: inherit; font-size: var(--text-sm); color: var(--color-text); }
.twc-drp__input::placeholder { color: var(--color-text-subtle); }
.twc-drp__input:disabled { cursor: not-allowed; }
.twc-drp__toggle { flex: none; display: inline-grid; place-items: center; width: 26px; height: 26px; border: none; background: transparent;
  color: var(--color-text-subtle); cursor: pointer; border-radius: var(--radius-md); transition: background-color var(--duration-fast), color var(--duration-fast); }
.twc-drp__toggle:hover:not(:disabled) { background: var(--color-surface-sunken); color: var(--color-text); }
.twc-drp__toggle:disabled { cursor: not-allowed; }
.twc-drp__toggle svg { width: 17px; height: 17px; }
.twc-drp__pop { position: fixed; z-index: var(--z-popover); display: flex;
  background: var(--color-surface-raised); border: var(--border-thin) solid var(--color-border); border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg); animation: twico-scale-in var(--duration-fast) var(--ease-spring); transform-origin: top; }
.twc-drp__presets { display: flex; flex-direction: column; gap: 2px; padding: var(--space-3); border-inline-end: var(--border-thin) solid var(--color-divider); min-width: 130px; }
.twc-drp__preset { border: none; background: none; text-align: start; font-family: inherit; font-size: var(--text-sm); color: var(--color-text);
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
.twc-drp__sr { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0; }
[dir="rtl"] .twc-drp__nav svg { transform: scaleX(-1); }
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
  min,
  max,
  disabledDate,
  disabled = false,
  tone = "primary",
  editable = false,
  parse,
  onChange,
  className = "",
  ...rest
}) {
  const __twcStyles0 = useScopedStyles("twc-field-styles", FIELD_CSS);
  const __twcStyles1 = useScopedStyles("twc-drp-styles", RANGE_CSS);

  const [internal, setInternal] = React.useState(defaultValue);
  const range = value !== undefined ? value : internal;
  const [open, setOpen] = React.useState(false);
  const [view, setView] = React.useState(range.start || new Date());
  const [hover, setHover] = React.useState(null);
  const [focusDate, setFocusDate] = React.useState(null); // #100: roving day focus
  const [editText, setEditText] = React.useState(null); // #105: raw typed text (null = show formatted range)
  const [coords, setCoords] = React.useState(null);
  const wrapRef = React.useRef(null);
  const triggerRef = React.useRef(null);
  const popRef = React.useRef(null);
  const gridRef = React.useRef(null);
  const labelId = React.useId();
  const descId = `${labelId}-desc`;
  const invalid = Boolean(error);

  // close the popover if the picker becomes disabled while open
  React.useEffect(() => { if (disabled) setOpen(false); }, [disabled]);

  // Portal the calendar to <body> with fixed positioning so it escapes any clipping
  // or scrolling ancestor; flips up when there isn't room below.
  const POP_W = 420;
  const place = React.useCallback(() => {
    const el = triggerRef.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const vh = window.innerHeight;
    const below = vh - r.bottom;
    const flip = below < 380 && r.top > below;
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
    const onDown = (e) => {
      if (wrapRef.current && wrapRef.current.contains(e.target)) return;
      if (popRef.current && popRef.current.contains(e.target)) return;
      setOpen(false);
    };
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDown); document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDown); document.removeEventListener("keydown", onKey); };
  }, [open]);

  const set = (r) => { if (value === undefined) setInternal(r); onChange?.(r); };

  // #105: typed range entry. Split on the `–`/`to`/`..` separator, parse each side with
  // `parse` (or a lenient Date.parse fallback), normalize start ≤ end, and commit on
  // Enter/blur. A part left blank clears that side; anything unparseable/out-of-range reverts.
  const parseOne = (s) => {
    const str = s.trim();
    if (str === "") return null;
    if (parse) { const d = parse(str); return d instanceof Date && !Number.isNaN(d.getTime()) ? d : undefined; }
    const t = Date.parse(str);
    return Number.isNaN(t) ? undefined : new Date(t);
  };
  const commitText = () => {
    if (editText == null) return;
    const raw = editText.trim();
    if (raw === "") { setEditText(null); if (range.start || range.end) set({ start: null, end: null }); return; }
    // Split only on en/em dash, "to", or ".." — never a bare hyphen (ISO dates contain it).
    const parts = raw.split(/\s*(?:–|—|\bto\b|\.\.+)\s*/i).map((p) => p.trim());
    let a = parseOne(parts[0] || "");
    let b = parts.length > 1 ? parseOne(parts[1] || "") : null;
    if (a === undefined || b === undefined || (a && outOfRange(a)) || (b && outOfRange(b))) { setEditText(null); return; }
    if (a && b && ymd(b) < ymd(a)) { const t = a; a = b; b = t; }
    set({ start: a || null, end: b || null });
    setEditText(null);
    setOpen(false);
  };

  // #108: trap Tab within the popover + restore focus to the trigger on close (was missing).
  useFocusTrap(popRef, open && !!coords, { initialFocus: () => gridRef.current?.querySelector('[tabindex="0"]') });

  // #101: bounds parity with DatePicker.
  const outOfRange = (d) => (min && ymd(d) < ymd(min)) || (max && ymd(d) > ymd(max)) || Boolean(disabledDate && disabledDate(d));

  // #100: day-grid keyboard navigation (mirrors DatePicker). Reset roving focus on open/close.
  const sameDay = (a, b) => a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  const keyOf = (d) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
  const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
  const addMonths = (d, n) => { const last = new Date(d.getFullYear(), d.getMonth() + n + 1, 0); return new Date(last.getFullYear(), last.getMonth(), Math.min(d.getDate(), last.getDate())); };
  React.useEffect(() => { if (!open) { setFocusDate(null); setHover(null); } }, [open]);
  React.useEffect(() => {
    if (!open || !focusDate) return;
    gridRef.current?.querySelector(`[data-key="${keyOf(focusDate)}"]`)?.focus();
  }, [focusDate, open]);
  const onGridKeyDown = (e) => {
    const btn = e.target.closest && e.target.closest("[data-key]");
    if (!btn) return;
    const [fy, fm, fd] = btn.getAttribute("data-key").split("-").map(Number);
    const cur = new Date(fy, fm, fd);
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
    let next = step(cur), guard = 0;
    while (outOfRange(next) && guard < 366) { next = step(next); guard += 1; }
    if (outOfRange(next)) return;
    setFocusDate(next);
    setHover(next); // keep the in-range preview following keyboard focus
    if (next.getFullYear() !== view.getFullYear() || next.getMonth() !== view.getMonth()) setView(new Date(next.getFullYear(), next.getMonth(), 1));
  };
  // The tabbable day: roving focus, else the range start, else today, else the 1st.
  const tabbableDate = focusDate || range.start || (new Date());

  const clickDay = (d) => {
    if (outOfRange(d)) return;
    if (!range.start || (range.start && range.end)) { set({ start: d, end: null }); }
    else {
      // second pick: normalize so the committed range always has start <= end (swap if before the first pick).
      const [start, end] = ymd(d) < ymd(range.start) ? [d, range.start] : [range.start, d];
      set({ start, end });
      setOpen(false);
    }
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
      {__twcStyles0}
      {__twcStyles1}
      {label ? (
        <span className="twc-field__label" id={labelId}>
          {label}{required ? <span className="twc-field__req">*</span> : null}
        </span>
      ) : null}
      {editable ? (
        // #105: typed entry — a text input accepting "start – end"; commits via `parse` on Enter/blur.
        <div className="twc-drp__control twc-drp__control--editable" data-open={open || undefined} data-disabled={disabled || undefined} data-invalid={invalid || undefined} data-tone={tone}>
          <input ref={triggerRef} className="twc-drp__input" type="text" autoComplete="off" disabled={disabled} placeholder={placeholder}
            value={editText != null ? editText : text}
            aria-haspopup="dialog" aria-expanded={open} aria-labelledby={label ? labelId : undefined}
            aria-invalid={invalid || undefined} aria-describedby={error || hint ? descId : undefined}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") { e.preventDefault(); commitText(); }
              else if (e.key === "ArrowDown" && (e.altKey || !open)) { e.preventDefault(); setOpen(true); }
              else if (e.key === "Escape" && open) setOpen(false);
            }}
            onBlur={(e) => { if (popRef.current && popRef.current.contains(e.relatedTarget)) return; commitText(); }} />
          <button type="button" className="twc-drp__toggle" aria-label="Open calendar" tabIndex={-1} disabled={disabled}
            onClick={() => !disabled && setOpen((o) => !o)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
          </button>
        </div>
      ) : (
        <div ref={triggerRef} className="twc-drp__control" data-open={open || undefined} data-disabled={disabled || undefined} data-invalid={invalid || undefined} data-tone={tone} role="button" tabIndex={disabled ? -1 : 0}
          aria-haspopup="dialog" aria-expanded={open} aria-disabled={disabled || undefined} aria-labelledby={label ? labelId : undefined}
          aria-invalid={invalid || undefined} aria-describedby={error || hint ? descId : undefined}
          onClick={() => !disabled && setOpen((o) => !o)} onKeyDown={(e) => { if (!disabled && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); setOpen((o) => !o); } }}>
          <span className="twc-drp__ic" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg></span>
          <span className="twc-drp__text" data-placeholder={!range.start || undefined}>{range.start ? text : placeholder}</span>
        </div>
      )}

      {open && coords ? createPortal(
        <div className="twc-drp__pop" ref={popRef} role="dialog" aria-modal="true" aria-label="Choose date range"
          style={{ position: "fixed", left: coords.left, right: "auto", top: coords.top, bottom: coords.bottom, zIndex: "var(--z-tooltip)" }}>
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
              <span className="twc-drp__sr" aria-live="polite">{months[m]} {y}</span>
              <button type="button" className="twc-drp__nav" aria-label="Next month" onClick={() => setView(new Date(y, m + 1, 1))}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg></button>
            </div>
            <div className="twc-drp__grid" ref={gridRef} onKeyDown={onGridKeyDown} role="grid">
              {dows.map((d, i) => <div key={i} className="twc-drp__dow">{d}</div>)}
              {Array.from({ length: 42 }).map((_, i) => {
                const d = new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + i);
                const t = ymd(d), outside = d.getMonth() !== m;
                return (
                  <button key={i} type="button" className="twc-drp__day" data-outside={outside || undefined}
                    disabled={outOfRange(d) || undefined}
                    data-key={keyOf(d)} tabIndex={sameDay(d, tabbableDate) ? 0 : -1}
                    data-in={inRange(t) || undefined} data-edge={edgeOf(t) || undefined}
                    aria-pressed={!!edgeOf(t)}
                    aria-label={locale === undefined ? d.toDateString() : d.toLocaleDateString(locale, { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                    onMouseEnter={() => setHover(d)} onClick={() => clickDay(d)}>
                    {d.getDate()}
                  </button>
                );
              })}
            </div>
          </div>
        </div>, document.body
      ) : null}
      {error ? <span id={descId} className="twc-field__error">{error}</span> : hint ? <span id={descId} className="twc-field__hint">{hint}</span> : null}
    </div>
  );
}
