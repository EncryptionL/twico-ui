import React from "react";

const DATEPICKER_CSS = `
.twc-dp { position: relative; font-family: var(--font-sans); display: flex; flex-direction: column; gap: var(--space-1-5); }
.twc-dp__label { font-size: var(--text-sm); font-weight: var(--font-semibold); color: var(--color-text); }
.twc-dp__control {
  display: flex; align-items: center; gap: var(--space-2); height: var(--control-h-md); padding: 0 var(--space-3);
  background: var(--color-surface); border: var(--border-thin) solid var(--color-border); border-radius: var(--radius-md);
  cursor: pointer; transition: border-color var(--duration-fast) var(--ease-standard), box-shadow var(--duration-fast) var(--ease-standard);
}
.twc-dp__control:hover:not([data-open="true"]) { border-color: var(--color-border-strong); }
.twc-dp__control[data-open="true"] { border-color: var(--color-primary); box-shadow: var(--ring); }
.twc-dp__control[data-disabled="true"] { background: var(--color-surface-sunken); opacity: 0.7; cursor: not-allowed; }
.twc-dp__ic { flex: none; color: var(--color-text-subtle); display: inline-flex; }
.twc-dp__ic svg { width: 17px; height: 17px; }
.twc-dp__text { flex: 1; font-size: var(--text-sm); color: var(--color-text); }
.twc-dp__text[data-placeholder="true"] { color: var(--color-text-subtle); }
.twc-dp__clear { flex: none; display: inline-grid; place-items: center; width: 20px; height: 20px; border: none; background: transparent; color: var(--color-text-subtle); cursor: pointer; border-radius: var(--radius-full); }
.twc-dp__clear:hover { background: var(--color-surface-sunken); color: var(--color-text); }
.twc-dp__clear svg { width: 14px; height: 14px; }

.twc-dp__pop {
  position: absolute; z-index: var(--z-popover); top: calc(100% + 6px); left: 0; width: 280px;
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
.twc-dp__day:focus-visible { outline: none; box-shadow: var(--ring); }
.twc-dp__months { display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px; }
.twc-dp__mo { padding: 10px 0; border: none; background: transparent; cursor: pointer; font-family: inherit; font-size: var(--text-sm); color: var(--color-text); border-radius: var(--radius-md); }
.twc-dp__mo:hover { background: var(--color-surface-sunken); }
.twc-dp__mo[data-selected="true"] { background: var(--color-primary); color: var(--color-primary-fg); font-weight: var(--font-bold); }
`;

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DOW = ["Su","Mo","Tu","We","Th","Fr","Sa"];
const sameDay = (a, b) => a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

export function DatePicker({
  label,
  value,
  defaultValue = null,
  placeholder = "Select date",
  min,
  max,
  disabled = false,
  clearable = true,
  format,
  weekStartsOn = 0,
  onChange,
  id,
  className = "",
  ...rest
}) {
  React.useInsertionEffect(() => {
    if (document.getElementById("twc-datepicker-styles")) return;
    const el = document.createElement("style");
    el.id = "twc-datepicker-styles";
    el.textContent = DATEPICKER_CSS;
    document.head.appendChild(el);
  }, []);

  const autoId = React.useId();
  const fieldId = id || autoId;
  const [internal, setInternal] = React.useState(defaultValue);
  const selected = value !== undefined ? value : internal;
  const [open, setOpen] = React.useState(false);
  const [view, setView] = React.useState(selected || new Date());
  const [mode, setMode] = React.useState("days");
  const wrapRef = React.useRef(null);

  React.useEffect(() => {
    if (!open) return;
    setView(selected || new Date());
    setMode("days");
    const onDown = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDown); document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDown); document.removeEventListener("keydown", onKey); };
  }, [open]);

  const fmt = (d) => {
    if (!d) return "";
    if (format) return format(d);
    return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  };
  const pick = (d) => { if (value === undefined) setInternal(d); onChange?.(d); setOpen(false); };

  const y = view.getFullYear(), m = view.getMonth();
  const first = new Date(y, m, 1);
  const startOffset = (first.getDay() - weekStartsOn + 7) % 7;
  const gridStart = new Date(y, m, 1 - startOffset);
  const dows = Array.from({ length: 7 }, (_, i) => DOW[(i + weekStartsOn) % 7]);
  const today = new Date();
  const outOfRange = (d) => (min && d < new Date(min.getFullYear(), min.getMonth(), min.getDate())) || (max && d > new Date(max.getFullYear(), max.getMonth(), max.getDate()));

  return (
    <div className={`twc-dp ${className}`} ref={wrapRef} {...rest}>
      {label ? <label className="twc-dp__label" htmlFor={fieldId}>{label}</label> : null}
      <div className="twc-dp__control" id={fieldId} data-open={open || undefined} data-disabled={disabled || undefined}
        role="button" tabIndex={disabled ? -1 : 0} aria-haspopup="dialog" aria-expanded={open}
        onClick={() => !disabled && setOpen((o) => !o)}
        onKeyDown={(e) => { if ((e.key === "Enter" || e.key === " ") && !disabled) { e.preventDefault(); setOpen((o) => !o); } }}>
        <span className="twc-dp__ic" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
        </span>
        <span className="twc-dp__text" data-placeholder={!selected || undefined}>{selected ? fmt(selected) : placeholder}</span>
        {clearable && selected && !disabled ? (
          <button className="twc-dp__clear" aria-label="Clear" onClick={(e) => { e.stopPropagation(); pick(null); }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        ) : null}
      </div>

      {open ? (
        <div className="twc-dp__pop" role="dialog" aria-label="Choose date">
          <div className="twc-dp__head">
            <button className="twc-dp__nav" aria-label="Previous" onClick={() => setView(mode === "months" ? new Date(y - 1, m, 1) : new Date(y, m - 1, 1))}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <button className="twc-dp__title" onClick={() => setMode(mode === "days" ? "months" : "days")}>
              {mode === "days" ? `${MONTHS[m]} ${y}` : y}
            </button>
            <button className="twc-dp__nav" aria-label="Next" onClick={() => setView(mode === "months" ? new Date(y + 1, m, 1) : new Date(y, m + 1, 1))}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </div>

          {mode === "days" ? (
            <div className="twc-dp__grid">
              {dows.map((d) => <div key={d} className="twc-dp__dow">{d}</div>)}
              {Array.from({ length: 42 }).map((_, i) => {
                const d = new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + i);
                const outside = d.getMonth() !== m;
                return (
                  <button key={i} className="twc-dp__day" disabled={outOfRange(d)}
                    data-outside={outside || undefined} data-today={sameDay(d, today) || undefined} data-selected={sameDay(d, selected) || undefined}
                    aria-label={d.toDateString()} onClick={() => pick(d)}>
                    {d.getDate()}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="twc-dp__months">
              {MONTHS.map((name, i) => (
                <button key={i} className="twc-dp__mo" data-selected={selected && selected.getFullYear() === y && selected.getMonth() === i || undefined}
                  onClick={() => { setView(new Date(y, i, 1)); setMode("days"); }}>
                  {name.slice(0, 3)}
                </button>
              ))}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
