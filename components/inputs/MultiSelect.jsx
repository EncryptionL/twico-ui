import React from "react";
import { createPortal } from "react-dom";

const MULTI_CSS = `
.twc-field { display: flex; flex-direction: column; gap: var(--space-1-5); font-family: var(--font-sans); }
.twc-field__label { font-size: var(--text-sm); font-weight: var(--font-semibold); color: var(--color-text); display: flex; gap: 4px; align-items: center; }
.twc-field__req { color: var(--color-danger); }
.twc-field__hint { font-size: var(--text-xs); color: var(--color-text-muted); }
.twc-field__error { font-size: var(--text-xs); color: var(--color-danger-subtle-fg); font-weight: var(--font-medium); }

.twc-ms { position: relative; font-family: var(--font-sans); }
.twc-ms__control {
  --_h: var(--control-h-md);
  display: flex; align-items: center; flex-wrap: wrap; gap: 5px; width: 100%;
  min-height: var(--_h); padding: 5px var(--space-3); cursor: text;
  background: var(--color-surface); border: var(--border-thin) solid var(--color-border); border-radius: var(--radius-md);
  transition: border-color var(--duration-fast) var(--ease-standard), box-shadow var(--duration-fast) var(--ease-standard);
}
.twc-ms__control[data-size="sm"] { --_h: var(--control-h-sm); }
.twc-ms__control[data-size="lg"] { --_h: var(--control-h-lg); }
.twc-ms__control:hover:not([data-open="true"]) { border-color: var(--color-border-strong); }
/* tone → focus/open accent + selected-chip color (default primary; reproduces current look). */
.twc-ms__control { --_accent: var(--color-primary); --_ring: var(--ring); --_accent-subtle: var(--color-primary-subtle); --_accent-subtle-fg: var(--color-primary-subtle-fg); }
.twc-ms__control[data-tone="success"] { --_accent: var(--color-success); --_ring: 0 0 0 var(--ring-width) color-mix(in srgb, var(--color-success) 32%, transparent); --_accent-subtle: var(--color-success-subtle); --_accent-subtle-fg: var(--color-success-subtle-fg); }
.twc-ms__control[data-tone="warning"] { --_accent: var(--color-warning); --_ring: 0 0 0 var(--ring-width) color-mix(in srgb, var(--color-warning) 32%, transparent); --_accent-subtle: var(--color-warning-subtle); --_accent-subtle-fg: var(--color-warning-subtle-fg); }
.twc-ms__control[data-tone="danger"]  { --_accent: var(--color-danger);  --_ring: 0 0 0 var(--ring-width) color-mix(in srgb, var(--color-danger) 32%, transparent); --_accent-subtle: var(--color-danger-subtle); --_accent-subtle-fg: var(--color-danger-subtle-fg); }
.twc-ms__control[data-tone="info"]    { --_accent: var(--color-info);    --_ring: 0 0 0 var(--ring-width) color-mix(in srgb, var(--color-info) 32%, transparent); --_accent-subtle: var(--color-info-subtle); --_accent-subtle-fg: var(--color-info-subtle-fg); }
.twc-ms__control[data-tone="neutral"] { --_accent: var(--color-border-strong); --_ring: 0 0 0 var(--ring-width) color-mix(in srgb, var(--color-text) 14%, transparent); --_accent-subtle: var(--color-surface-sunken); --_accent-subtle-fg: var(--color-text-muted); }
.twc-ms__control[data-open="true"] { border-color: var(--_accent); box-shadow: var(--_ring); }
.twc-ms__control[data-invalid="true"] { border-color: var(--color-danger); }
.twc-ms__control[data-disabled="true"] { background: var(--color-surface-sunken); opacity: 0.7; cursor: not-allowed; }
.twc-ms__chip {
  display: inline-flex; align-items: center; gap: 5px; padding: 2px 4px 2px 9px; height: 24px;
  background: var(--_accent-subtle); color: var(--_accent-subtle-fg);
  border-radius: var(--radius-full); font-size: var(--text-xs); font-weight: var(--font-semibold);
}
.twc-ms__chip-x { display: inline-grid; place-items: center; width: 16px; height: 16px; border: none; padding: 0; background: transparent; color: inherit; cursor: pointer; border-radius: var(--radius-full); opacity: 0.7; }
.twc-ms__chip-x:hover { opacity: 1; background: color-mix(in srgb, currentColor 18%, transparent); }
.twc-ms__chip-x svg { width: 12px; height: 12px; }
.twc-ms__input { flex: 1; min-width: 70px; border: none; outline: none; background: transparent; font-family: inherit; font-size: var(--text-sm); color: var(--color-text); height: 24px; cursor: text; }
.twc-ms__input:focus, .twc-ms__input:focus-visible { outline: none; box-shadow: none; }
.twc-ms__input::placeholder { color: var(--color-text-subtle); }
.twc-ms__chev { flex: none; display: inline-grid; place-items: center; border: none; background: transparent; color: var(--color-text-subtle); cursor: pointer; padding: 0; transition: transform var(--duration-base) var(--ease-spring); }
.twc-ms__control[data-open="true"] .twc-ms__chev { transform: rotate(180deg); }
.twc-ms__chev svg { width: 16px; height: 16px; }
.twc-ms__clear { flex: none; display: inline-grid; place-items: center; width: 20px; height: 20px; border: none; background: transparent; padding: 0; border-radius: var(--radius-full); color: var(--color-text-subtle); cursor: pointer; }
.twc-ms__clear:hover { background: var(--color-surface-sunken); color: var(--color-text); }
.twc-ms__clear svg { width: 14px; height: 14px; }

.twc-pop {
  position: absolute; z-index: var(--z-dropdown); top: calc(100% + 6px); inset-inline-start: 0; inset-inline-end: 0;
  background: var(--color-surface-raised); border: var(--border-thin) solid var(--color-border);
  border-radius: var(--radius-lg); box-shadow: var(--shadow-lg); overflow: hidden;
  transform-origin: top; animation: twico-scale-in var(--duration-fast) var(--ease-spring);
}
.twc-pop[data-placement="top"] { top: auto; bottom: calc(100% + 6px); transform-origin: bottom; }
.twc-pop__list { max-height: 260px; overflow-y: auto; padding: var(--space-1-5); }
.twc-pop__group { padding: 8px 10px 4px; font-size: var(--text-xs); font-weight: var(--font-bold); letter-spacing: var(--tracking-wide); text-transform: uppercase; color: var(--color-text-subtle); }
.twc-pop__group:not(:first-child) { margin-top: 4px; border-top: var(--border-thin) solid var(--color-divider); padding-top: 10px; }
.twc-opt {
  display: flex; align-items: center; gap: var(--space-2-5); width: 100%; padding: 8px 10px;
  border: none; background: transparent; cursor: pointer; text-align: start;
  font-family: inherit; font-size: var(--text-sm); color: var(--color-text); border-radius: var(--radius-md);
  transition: background-color var(--duration-fast) var(--ease-standard);
}
.twc-opt:hover, .twc-opt[data-active="true"] { background: var(--color-surface-sunken); }
.twc-opt__box {
  flex: none; width: 18px; height: 18px; display: grid; place-items: center;
  border: var(--border-medium) solid var(--color-border-strong); border-radius: var(--radius-sm);
  color: var(--color-primary-fg); transition: background-color var(--duration-fast), border-color var(--duration-fast);
}
.twc-opt[data-selected="true"] .twc-opt__box { background: var(--color-primary); border-color: var(--color-primary); }
.twc-opt__box svg { width: 12px; height: 12px; opacity: 0; }
.twc-opt[data-selected="true"] .twc-opt__box svg { opacity: 1; }
.twc-opt__main { display: flex; flex-direction: column; gap: 1px; min-width: 0; flex: 1; }
.twc-opt__label { line-height: 1.3; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.twc-opt__desc { font-size: var(--text-xs); color: var(--color-text-muted); line-height: 1.3; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.twc-pop__empty { padding: 14px 12px; text-align: center; font-size: var(--text-sm); color: var(--color-text-subtle); }
`;

function toOpt(o) { return typeof o === "string" ? { value: o, label: o } : o; }
function normalizeGroups(options) {
  const groups = []; let cur = null;
  (options || []).forEach((o) => {
    if (o && typeof o === "object" && Array.isArray(o.options)) {
      groups.push({ group: o.group, options: o.options.map(toOpt) }); cur = null;
    } else {
      if (!cur) { cur = { group: null, options: [] }; groups.push(cur); }
      cur.options.push(toOpt(o));
    }
  });
  return groups;
}
function matches(o, q) {
  if (!q) return true;
  const s = q.toLowerCase();
  return o.label.toLowerCase().includes(s) || (o.description && o.description.toLowerCase().includes(s));
}
function ensureVisible(list, el) {
  if (!list || !el) return;
  const top = el.offsetTop, bottom = top + el.offsetHeight;
  if (top < list.scrollTop) list.scrollTop = top - 4;
  else if (bottom > list.scrollTop + list.clientHeight) list.scrollTop = bottom - list.clientHeight + 4;
}

export function MultiSelect({
  label, hint, error, required = false, size = "md", tone = "primary",
  placeholder = "Select…", options, value, defaultValue = [],
  onChange, clearable = false, disabled = false, placement = "bottom", portal = false, minWidth = 0,
  id, className = "", onFocus, onKeyDown, ...rest
}) {
  React.useInsertionEffect(() => {
    if (document.getElementById("twc-ms-styles")) return;
    const el = document.createElement("style");
    el.id = "twc-ms-styles"; el.textContent = MULTI_CSS;
    document.head.appendChild(el);
  }, []);

  const groups = React.useMemo(() => normalizeGroups(options), [options]);
  const flat = React.useMemo(() => groups.flatMap((g) => g.options), [groups]);
  const autoId = React.useId();
  const fieldId = id || autoId;
  const [internal, setInternal] = React.useState(defaultValue);
  const selected = value !== undefined ? value : internal;

  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [active, setActive] = React.useState(0);
  const [coords, setCoords] = React.useState(null);
  const wrapRef = React.useRef(null);
  const controlRef = React.useRef(null);
  const inputRef = React.useRef(null);
  const popRef = React.useRef(null);
  const listRef = React.useRef(null);
  const activeRef = React.useRef(null);

  const fGroups = React.useMemo(
    () => groups.map((g) => ({ group: g.group, options: g.options.filter((o) => matches(o, query.trim())) })).filter((g) => g.options.length),
    [groups, query]
  );
  const visible = React.useMemo(() => fGroups.flatMap((g) => g.options), [fGroups]);

  // Portal mode: measure the control and pin the popover with fixed positioning so
  // it escapes any clipping/scrolling ancestor. Auto-flips up when there isn't
  // enough room below (same logic as Select).
  const place = React.useCallback(() => {
    const el = controlRef.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const vh = window.innerHeight;
    const below = vh - r.bottom;
    const flip = placement === "top" || (below < 260 && r.top > below);
    setCoords({ left: r.left, width: Math.max(r.width, minWidth),
      top: flip ? undefined : Math.round(r.bottom + 6),
      bottom: flip ? Math.round(vh - r.top + 6) : undefined, flip });
  }, [placement, minWidth]);

  React.useEffect(() => {
    if (!open || !portal) return;
    place();
    const onMove = () => place();
    window.addEventListener("scroll", onMove, true);
    window.addEventListener("resize", onMove);
    return () => { window.removeEventListener("scroll", onMove, true); window.removeEventListener("resize", onMove); };
  }, [open, portal, place]);

  React.useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (wrapRef.current && wrapRef.current.contains(e.target)) return;
      if (popRef.current && popRef.current.contains(e.target)) return;
      setOpen(false); setQuery("");
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);
  React.useEffect(() => { setActive(0); }, [query]);
  React.useEffect(() => { if (open) ensureVisible(listRef.current, activeRef.current); }, [active, open]);

  function commit(next) {
    if (value === undefined) setInternal(next);
    onChange?.(next);
  }
  function toggle(v) {
    commit(selected.includes(v) ? selected.filter((x) => x !== v) : [...selected, v]);
    setQuery("");
    inputRef.current?.focus();
  }
  function handleKeyDown(e) {
    if (e.key === "ArrowDown") { e.preventDefault(); if (!open) setOpen(true); else setActive((a) => Math.min(a + 1, visible.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    else if (e.key === "Enter") { e.preventDefault(); if (open && visible[active]) toggle(visible[active].value); }
    else if (e.key === "Escape") { setOpen(false); setQuery(""); }
    else if (e.key === "Backspace" && !query && selected.length) { commit(selected.slice(0, -1)); }
  }

  const selectedOpts = flat.filter((o) => selected.includes(o.value));
  const listboxId = `${fieldId}-listbox`;
  const optionId = (i) => `${fieldId}-opt-${i}`;
  const activeId = open && visible[active] ? optionId(active) : undefined;
  const descId = `${fieldId}-desc`;
  const describedBy = error || hint ? descId : undefined;
  let counter = -1;

  const popInner = (
    <div className="twc-pop__list" id={listboxId} ref={listRef} role="listbox" aria-multiselectable="true">
      {visible.length === 0 ? <div className="twc-pop__empty">No results found</div> :
        fGroups.map((g, gi) => (
          <React.Fragment key={gi}>
            {g.group ? <div className="twc-pop__group">{g.group}</div> : null}
            {g.options.map((o) => {
              counter += 1; const idx = counter; const isSel = selected.includes(o.value);
              return (
                <button key={o.value} id={optionId(idx)} type="button" className="twc-opt" role="option" aria-selected={isSel}
                  ref={idx === active ? activeRef : null}
                  data-selected={isSel || undefined} data-active={idx === active || undefined}
                  onMouseEnter={() => setActive(idx)} onMouseDown={(e) => e.preventDefault()} onClick={() => toggle(o.value)}>
                  <span className="twc-opt__box" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg></span>
                  <span className="twc-opt__main">
                    <span className="twc-opt__label">{o.label}</span>
                    {o.description ? <span className="twc-opt__desc">{o.description}</span> : null}
                  </span>
                </button>
              );
            })}
          </React.Fragment>
        ))}
    </div>
  );

  const RD = { createPortal: (typeof createPortal === "function" ? createPortal : (typeof window !== "undefined" && window.ReactDOM && window.ReactDOM.createPortal)) };
  const canPortal = portal && RD && RD.createPortal;

  let popEl = null;
  if (open) {
    if (canPortal && coords) {
      popEl = RD.createPortal(
        <div className="twc-pop twc-pop--portal" ref={popRef}
          data-placement={coords.flip ? "top" : undefined}
          style={{ position: "fixed", left: coords.left, top: coords.top, bottom: coords.bottom, width: coords.width, right: "auto", zIndex: "var(--z-tooltip)" }}>
          {popInner}
        </div>, document.body);
    } else if (!portal) {
      popEl = (
        <div className="twc-pop" ref={popRef} data-placement={placement === "top" ? "top" : undefined}>
          {popInner}
        </div>
      );
    }
  }

  return (
    <div className={`twc-field ${className}`} ref={wrapRef}>
      {label ? (<label className="twc-field__label" htmlFor={fieldId}>{label}{required ? <span className="twc-field__req">*</span> : null}</label>) : null}
      <div className="twc-ms">
        <div className="twc-ms__control" ref={controlRef} data-size={size} data-tone={tone} data-open={open || undefined} data-invalid={Boolean(error) || undefined} data-disabled={disabled || undefined}
             onClick={() => { if (!disabled) { inputRef.current?.focus(); setOpen(true); } }}>
          {selectedOpts.map((o) => (
            <span className="twc-ms__chip" key={o.value}>
              {o.label}
              <button type="button" className="twc-ms__chip-x" aria-label={`Remove ${o.label}`} onClick={(e) => { e.stopPropagation(); toggle(o.value); }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
              </button>
            </span>
          ))}
          <input ref={inputRef} id={fieldId} className="twc-ms__input" role="combobox" aria-expanded={open} aria-autocomplete="list"
                 aria-controls={open ? listboxId : undefined} aria-activedescendant={activeId}
                 aria-invalid={Boolean(error) || undefined} aria-describedby={describedBy}
                 placeholder={selectedOpts.length ? "" : placeholder} value={query} disabled={disabled}
                 onFocus={(e) => { onFocus?.(e); setOpen(true); }}
                 onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
                 onKeyDown={(e) => { onKeyDown?.(e); if (!e.defaultPrevented) handleKeyDown(e); }} {...rest} />
          {clearable && selected.length > 0 && !disabled ? (
            <button type="button" className="twc-ms__clear" aria-label="Clear all" onClick={(e) => { e.stopPropagation(); commit([]); setQuery(""); }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
          ) : null}
          <button type="button" className="twc-ms__chev" aria-label="Toggle" tabIndex={-1}
                  onClick={(e) => { e.stopPropagation(); setOpen((o) => !o); inputRef.current?.focus(); }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
          </button>
        </div>

        {popEl}
      </div>
      {error ? <span id={descId} className="twc-field__error">{error}</span> : hint ? <span id={descId} className="twc-field__hint">{hint}</span> : null}
    </div>
  );
}
