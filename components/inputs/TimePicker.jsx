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

const TIMEPICKER_CSS = `
.twc-tp { position: relative; font-family: var(--font-sans); display: flex; flex-direction: column; gap: var(--space-1-5); }
.twc-tp__control {
  display: flex; align-items: center; gap: var(--space-2); --_h: var(--control-h-md); height: var(--_h); padding: 0 var(--space-3);
  background: var(--color-surface); border: var(--border-thin) solid var(--color-border); border-radius: var(--radius-md);
  cursor: pointer; transition: border-color var(--duration-fast) var(--ease-standard), box-shadow var(--duration-fast) var(--ease-standard);
}
.twc-tp__control:hover:not([data-open="true"]) { border-color: var(--color-border-strong); }
.twc-tp__control { --_accent: var(--color-primary); --_ring: var(--ring); }
.twc-tp__control[data-size="sm"] { --_h: var(--control-h-sm); }
.twc-tp__control[data-size="lg"] { --_h: var(--control-h-lg); }
.twc-tp__control[data-tone="success"] { --_accent: var(--color-success); --_ring: 0 0 0 var(--ring-width) color-mix(in srgb, var(--color-success) 32%, transparent); }
.twc-tp__control[data-tone="warning"] { --_accent: var(--color-warning); --_ring: 0 0 0 var(--ring-width) color-mix(in srgb, var(--color-warning) 32%, transparent); }
.twc-tp__control[data-tone="danger"]  { --_accent: var(--color-danger);  --_ring: 0 0 0 var(--ring-width) color-mix(in srgb, var(--color-danger) 32%, transparent); }
.twc-tp__control[data-tone="info"]    { --_accent: var(--color-info);    --_ring: 0 0 0 var(--ring-width) color-mix(in srgb, var(--color-info) 32%, transparent); }
.twc-tp__control[data-tone="neutral"] { --_accent: var(--color-border-strong); --_ring: 0 0 0 var(--ring-width) color-mix(in srgb, var(--color-text) 14%, transparent); }
.twc-tp__control[data-open="true"] { border-color: var(--_accent); box-shadow: var(--_ring); }
.twc-tp__control[data-invalid="true"] { border-color: var(--color-danger); }
.twc-tp__control[data-invalid="true"][data-open="true"] { box-shadow: 0 0 0 var(--ring-width) color-mix(in srgb, var(--color-danger) 28%, transparent); }
.twc-tp__control[data-disabled="true"] { background: var(--color-surface-sunken); opacity: 0.7; cursor: not-allowed; }
.twc-tp__field { position: relative; display: flex; flex-direction: column; }
.twc-tp__control[data-has-clear="true"] { padding-inline-end: 34px; }
.twc-tp__ic { flex: none; color: var(--color-text-subtle); display: inline-flex; }
.twc-tp__ic svg { width: 17px; height: 17px; }
.twc-tp__text { flex: 1; font-size: var(--text-sm); color: var(--color-text); font-variant-numeric: tabular-nums; }
.twc-tp__text[data-placeholder="true"] { color: var(--color-text-subtle); font-variant-numeric: normal; }
.twc-tp__clear { position: absolute; inset-inline-end: 10px; top: 50%; transform: translateY(-50%); display: inline-grid; place-items: center; width: 20px; height: 20px; border: none; background: transparent; color: var(--color-text-subtle); cursor: pointer; border-radius: var(--radius-full); }
.twc-tp__clear:hover { background: var(--color-surface-sunken); color: var(--color-text); }
.twc-tp__clear svg { width: 14px; height: 14px; }
.twc-tp__control--editable { cursor: text; gap: 0; padding-inline-end: var(--space-1); }
.twc-tp__input { flex: 1; min-width: 0; height: 100%; border: none; background: transparent; outline: none; padding: 0; font-family: inherit; font-size: var(--text-sm); color: var(--color-text); font-variant-numeric: tabular-nums; }
.twc-tp__input::placeholder { color: var(--color-text-subtle); font-variant-numeric: normal; }
.twc-tp__input:disabled { cursor: not-allowed; }
.twc-tp__clear--inline { position: static; transform: none; flex: none; }
.twc-tp__toggle { flex: none; display: inline-grid; place-items: center; width: 26px; height: 26px; border: none; background: transparent; color: var(--color-text-subtle); cursor: pointer; border-radius: var(--radius-md); transition: background-color var(--duration-fast), color var(--duration-fast); }
.twc-tp__toggle:hover:not(:disabled) { background: var(--color-surface-sunken); color: var(--color-text); }
.twc-tp__toggle:disabled { cursor: not-allowed; }
.twc-tp__toggle svg { width: 17px; height: 17px; }

.twc-tp__pop {
  position: fixed; z-index: var(--z-popover);
  background: var(--color-surface-raised); border: var(--border-thin) solid var(--color-border);
  border-radius: var(--radius-lg); box-shadow: var(--shadow-lg); padding: var(--space-2);
  animation: twico-scale-in var(--duration-fast) var(--ease-spring); transform-origin: top;
}
.twc-tp__cols { display: flex; gap: var(--space-1); max-height: 232px; }
.twc-tp__col { display: flex; flex-direction: column; gap: 2px; overflow-y: auto; scrollbar-width: thin; padding-inline: 2px; scroll-behavior: smooth; }
.twc-tp__col::-webkit-scrollbar { width: 6px; }
.twc-tp__col::-webkit-scrollbar-thumb { background: var(--color-border-strong); border-radius: var(--radius-full); }
.twc-tp__col + .twc-tp__col { border-inline-start: var(--border-thin) solid var(--color-divider); }
.twc-tp__colhead { text-align: center; font-size: 11px; font-weight: var(--font-bold); color: var(--color-text-subtle); text-transform: uppercase; padding: 2px 0 4px; position: sticky; top: 0; background: var(--color-surface-raised); }
.twc-tp__opt { min-width: 46px; padding: 6px 10px; border: none; background: transparent; cursor: pointer; font-family: inherit; font-size: var(--text-sm); color: var(--color-text); border-radius: var(--radius-md); text-align: center; font-variant-numeric: tabular-nums; transition: background-color var(--duration-fast) var(--ease-standard), color var(--duration-fast) var(--ease-standard); }
.twc-tp__opt:hover:not(:disabled):not([data-selected="true"]) { background: var(--color-surface-sunken); }
.twc-tp__opt[data-selected="true"] { background: var(--color-primary); color: var(--color-primary-fg); font-weight: var(--font-bold); }
.twc-tp__opt:disabled { opacity: 0.35; cursor: not-allowed; }
.twc-tp__opt:focus-visible { outline: none; box-shadow: var(--ring); }
`;

const pad = (n) => String(n).padStart(2, "0");
const range = (start, end, step) => { const out = []; for (let i = start; i < end; i += step) out.push(i); return out; };
// A time-of-day expressed in seconds since midnight — the comparison unit for min/max bounds.
const tod = (h, m, s) => h * 3600 + m * 60 + s;
// 12-hour display hour (1..12) + meridiem → 24-hour hour.
const to24 = (dh, mer) => (mer === "PM" ? (dh === 12 ? 12 : dh + 12) : dh === 12 ? 0 : dh);

export function TimePicker({
  label,
  hint,
  error,
  required = false,
  value,
  defaultValue = null,
  placeholder = "Select time",
  min,
  max,
  minuteStep = 5,
  secondStep = 5,
  granularity = "minute", // "hour" | "minute" | "second"
  hourCycle = 24, // 24 | 12
  referenceDate,
  disabled = false,
  tone = "primary",
  size = "md",
  clearable = true,
  editable = false,
  parse,
  format,
  locale,
  onChange,
  id,
  className = "",
  ...rest
}) {
  const __twcStyles0 = useScopedStyles("twc-field-styles", FIELD_CSS);
  const __twcStyles1 = useScopedStyles("twc-timepicker-styles", TIMEPICKER_CSS);

  const autoId = React.useId();
  const fieldId = id || autoId;
  const descId = `${fieldId}-desc`;
  const invalid = Boolean(error);
  const [internal, setInternal] = React.useState(defaultValue);
  const selected = value !== undefined ? value : internal;
  const [open, setOpen] = React.useState(false);
  const [editText, setEditText] = React.useState(null);
  const [coords, setCoords] = React.useState(null);
  const wrapRef = React.useRef(null);
  const triggerRef = React.useRef(null);
  const popRef = React.useRef(null);

  // Portal to <body> with fixed positioning so the popover escapes any clipping/scrolling
  // ancestor; flips up when there isn't room below.
  const place = React.useCallback(() => {
    const el = triggerRef.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const vh = window.innerHeight, POP_W = 220;
    const below = vh - r.bottom;
    const flip = below < 300 && r.top > below;
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
    if (!open) return undefined;
    const onDown = (e) => {
      if (wrapRef.current && wrapRef.current.contains(e.target)) return;
      if (popRef.current && popRef.current.contains(e.target)) return;
      setOpen(false);
    };
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDown); document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDown); document.removeEventListener("keydown", onKey); };
  }, [open]);

  // Trap Tab within the popover and restore focus to the trigger on close; land on the
  // selected option, else the first tabbable option.
  useFocusTrap(popRef, open && !!coords, {
    initialFocus: () => popRef.current?.querySelector('.twc-tp__opt[data-selected="true"]') || popRef.current?.querySelector('.twc-tp__opt[tabindex="0"]'),
  });

  // Scroll the selected option in each column into view when the popover opens.
  React.useEffect(() => {
    if (!open || !coords) return;
    popRef.current?.querySelectorAll('.twc-tp__opt[data-selected="true"]').forEach((el) => el.scrollIntoView({ block: "center" }));
  }, [open, coords]);

  const refBase = referenceDate || new Date();
  const minTod = min ? tod(min.getHours(), min.getMinutes(), min.getSeconds()) : null;
  const maxTod = max ? tod(max.getHours(), max.getMinutes(), max.getSeconds()) : null;
  const outOfRange = (h, m, s) => (minTod != null && tod(h, m, s) < minTod) || (maxTod != null && tod(h, m, s) > maxTod);

  const curH = selected ? selected.getHours() : null;
  const curM = selected ? selected.getMinutes() : null;
  const curS = selected ? selected.getSeconds() : null;
  const curMer = curH == null ? "AM" : curH < 12 ? "AM" : "PM";

  const fmt = (d) => {
    if (!d) return "";
    if (format) return format(d);
    const opts = { hour: hourCycle === 12 ? "numeric" : "2-digit", minute: "2-digit", hour12: hourCycle === 12 };
    if (granularity === "second") opts.second = "2-digit";
    if (granularity === "hour") delete opts.minute;
    return d.toLocaleTimeString(locale, opts);
  };

  const commit = (h, m, s) => {
    const b = selected || refBase;
    const d = new Date(b.getFullYear(), b.getMonth(), b.getDate(), h, m, s, 0);
    if (value === undefined) setInternal(d);
    onChange?.(d);
    setEditText(null);
  };
  const pickHour = (h) => commit(h, granularity === "hour" ? 0 : (curM ?? 0), granularity === "second" ? (curS ?? 0) : 0);
  const pickMinute = (m) => commit(curH ?? refBase.getHours(), m, granularity === "second" ? (curS ?? 0) : 0);
  const pickSecond = (s) => commit(curH ?? refBase.getHours(), curM ?? 0, s);
  const pickMeridiem = (mer) => { const dh = curH == null ? 0 : curH % 12 === 0 ? 12 : curH % 12; commit(to24(dh, mer), curM ?? 0, granularity === "second" ? (curS ?? 0) : 0); };
  const clear = () => { if (value === undefined) setInternal(null); onChange?.(null); setEditText(null); };

  // #223: typed entry — "HH:MM" / "HH:MM:SS", optional am/pm. `parse` overrides the default.
  const parseTyped = (str) => {
    const s = str.trim();
    if (s === "") return null;
    if (parse) { const d = parse(s); return d instanceof Date && !Number.isNaN(d.getTime()) ? d : undefined; }
    const mm = s.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*([ap]m)?$/i);
    if (!mm) return undefined;
    let h = +mm[1]; const mi = +mm[2]; const se = mm[3] ? +mm[3] : 0; const mer = mm[4] && mm[4].toLowerCase();
    if (mer === "pm" && h < 12) h += 12; else if (mer === "am" && h === 12) h = 0;
    if (h > 23 || mi > 59 || se > 59) return undefined;
    const b = selected || refBase;
    return new Date(b.getFullYear(), b.getMonth(), b.getDate(), h, mi, se, 0);
  };
  const commitText = () => {
    if (editText == null) return;
    const parsed = parseTyped(editText);
    if (parsed === null) { setEditText(null); if (selected) clear(); return; }
    if (parsed === undefined || outOfRange(parsed.getHours(), parsed.getMinutes(), parsed.getSeconds())) { setEditText(null); return; }
    commit(parsed.getHours(), parsed.getMinutes(), parsed.getSeconds());
    setOpen(false);
  };

  // Build the visible columns from the granularity + hour cycle.
  const hourVals = hourCycle === 12 ? [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] : range(0, 24, 1);
  const columns = [
    {
      key: "h", head: "hr", aria: "Hour",
      items: hourVals.map((hv) => {
        const h24 = hourCycle === 12 ? to24(hv, curMer) : hv;
        return { val: hv, text: hourCycle === 12 ? String(hv) : pad(hv),
          selected: curH != null && h24 === curH,
          disabled: outOfRange(h24, 0, 0) && outOfRange(h24, 59, 59),
          onSelect: () => pickHour(h24) };
      }),
    },
  ];
  if (granularity !== "hour") {
    const h = curH ?? refBase.getHours();
    columns.push({ key: "m", head: "min", aria: "Minute", items: range(0, 60, minuteStep).map((mv) => ({
      val: mv, text: pad(mv), selected: curM != null && mv === curM,
      disabled: outOfRange(h, mv, 0) && outOfRange(h, mv, 59), onSelect: () => pickMinute(mv) })) });
  }
  if (granularity === "second") {
    const h = curH ?? refBase.getHours(), m = curM ?? 0;
    columns.push({ key: "s", head: "sec", aria: "Second", items: range(0, 60, secondStep).map((sv) => ({
      val: sv, text: pad(sv), selected: curS != null && sv === curS,
      disabled: outOfRange(h, m, sv), onSelect: () => pickSecond(sv) })) });
  }
  if (hourCycle === 12) {
    columns.push({ key: "mer", head: "", aria: "AM or PM", items: ["AM", "PM"].map((mer) => ({
      val: mer, text: mer, selected: curH != null && curMer === mer,
      disabled: [...Array(12)].every((_, i) => { const hh = mer === "AM" ? i : i + 12; return outOfRange(hh, 0, 0) && outOfRange(hh, 59, 59); }),
      onSelect: () => pickMeridiem(mer) })) });
  }

  // Roving keyboard nav across the columns (pure DOM: arrows within/between columns).
  const onOptKey = (e) => {
    const btn = e.target;
    const col = btn.closest("[data-col]"); if (!col) return;
    const opts = Array.from(col.querySelectorAll(".twc-tp__opt:not(:disabled)"));
    const i = opts.indexOf(btn);
    let target;
    if (e.key === "ArrowDown") target = opts[Math.min(i + 1, opts.length - 1)];
    else if (e.key === "ArrowUp") target = opts[Math.max(i - 1, 0)];
    else if (e.key === "Home") target = opts[0];
    else if (e.key === "End") target = opts[opts.length - 1];
    else if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      const cols = Array.from(popRef.current.querySelectorAll("[data-col]"));
      const nextCol = cols[cols.indexOf(col) + (e.key === "ArrowRight" ? 1 : -1)];
      if (nextCol) {
        const nopts = Array.from(nextCol.querySelectorAll(".twc-tp__opt:not(:disabled)"));
        target = nextCol.querySelector('.twc-tp__opt[data-selected="true"]') || nopts[Math.min(i, nopts.length - 1)] || nopts[0];
      }
    } else return;
    e.preventDefault();
    target?.focus();
  };

  const clockIcon = (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
  );

  return (
    <div className={`twc-tp twc-field ${className}`} ref={wrapRef} {...rest}>
      {__twcStyles0}
      {__twcStyles1}
      {label ? (
        <label className="twc-field__label" id={`${fieldId}-label`}>
          {label}{required ? <span className="twc-field__req">*</span> : null}
        </label>
      ) : null}
      <div className="twc-tp__field">
        {editable ? (
          <div className="twc-tp__control twc-tp__control--editable" data-open={open || undefined} data-disabled={disabled || undefined}
            data-tone={tone} data-invalid={invalid || undefined} data-size={size}>
            <input ref={triggerRef} className="twc-tp__input" id={fieldId} type="text" inputMode="numeric" autoComplete="off"
              disabled={disabled} placeholder={placeholder}
              value={editText != null ? editText : (selected ? fmt(selected) : "")}
              aria-haspopup="dialog" aria-expanded={open}
              aria-labelledby={label ? `${fieldId}-label` : undefined}
              aria-invalid={invalid || undefined} aria-describedby={error || hint ? descId : undefined}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") { e.preventDefault(); commitText(); }
                else if (e.key === "ArrowDown" && (e.altKey || !open)) { e.preventDefault(); setOpen(true); }
                else if (e.key === "Escape" && open) setOpen(false);
              }}
              onBlur={(e) => { if (popRef.current && popRef.current.contains(e.relatedTarget)) return; commitText(); }} />
            {clearable && selected && !disabled ? (
              <button type="button" className="twc-tp__clear twc-tp__clear--inline" aria-label="Clear" tabIndex={-1}
                onMouseDown={(e) => e.preventDefault()} onClick={clear}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
              </button>
            ) : null}
            <button type="button" className="twc-tp__toggle" aria-label="Open time list" tabIndex={-1} disabled={disabled}
              onClick={() => !disabled && setOpen((o) => !o)}>{clockIcon}</button>
          </div>
        ) : (
          <>
            <div ref={triggerRef} className="twc-tp__control" id={fieldId} data-open={open || undefined} data-disabled={disabled || undefined} data-size={size}
              data-tone={tone} data-has-clear={clearable && selected && !disabled ? "true" : undefined} data-invalid={invalid || undefined}
              role="button" tabIndex={disabled ? -1 : 0} aria-haspopup="dialog" aria-expanded={open}
              aria-labelledby={label ? `${fieldId}-label` : undefined}
              aria-invalid={invalid || undefined} aria-describedby={error || hint ? descId : undefined}
              onClick={() => !disabled && setOpen((o) => !o)}
              onKeyDown={(e) => { if ((e.key === "Enter" || e.key === " ") && !disabled) { e.preventDefault(); setOpen((o) => !o); } }}>
              <span className="twc-tp__ic" aria-hidden="true">{clockIcon}</span>
              <span className="twc-tp__text" data-placeholder={!selected || undefined}>{selected ? fmt(selected) : placeholder}</span>
            </div>
            {clearable && selected && !disabled ? (
              <button type="button" className="twc-tp__clear" aria-label="Clear" onClick={(e) => { e.stopPropagation(); clear(); }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
              </button>
            ) : null}
          </>
        )}
      </div>

      {open && coords ? createPortal(
        <div className="twc-tp__pop" ref={popRef} role="dialog" aria-modal="true" aria-label="Choose time"
          style={{ position: "fixed", left: coords.left, right: "auto", top: coords.top, bottom: coords.bottom, zIndex: "var(--z-tooltip)" }}>
          <div className="twc-tp__cols">
            {columns.map((col) => {
              const firstTab = col.items.find((it) => it.selected) || col.items.find((it) => !it.disabled);
              return (
                <div key={col.key} className="twc-tp__col" role="listbox" aria-label={col.aria} data-col={col.key}>
                  {col.head ? <div className="twc-tp__colhead" aria-hidden="true">{col.head}</div> : null}
                  {col.items.map((it) => (
                    <button key={it.val} type="button" className="twc-tp__opt" role="option"
                      aria-selected={it.selected || false} data-selected={it.selected || undefined} data-val={it.val}
                      disabled={it.disabled || undefined} tabIndex={it === firstTab ? 0 : -1}
                      onClick={it.onSelect} onKeyDown={onOptKey}>
                      {it.text}
                    </button>
                  ))}
                </div>
              );
            })}
          </div>
        </div>, document.body,
      ) : null}
      {error ? <span id={descId} className="twc-field__error">{error}</span> : hint ? <span id={descId} className="twc-field__hint">{hint}</span> : null}
    </div>
  );
}
