import React from "react";
import { createPortal } from "react-dom";

const SELECT_CSS = `
.twc-field { display: flex; flex-direction: column; gap: var(--space-1-5); font-family: var(--font-sans); }
.twc-field__label { font-size: var(--text-sm); font-weight: var(--font-semibold); color: var(--color-text); display: flex; gap: 4px; align-items: center; }
.twc-field__req { color: var(--color-danger); }
.twc-field__hint { font-size: var(--text-xs); color: var(--color-text-muted); }
.twc-field__error { font-size: var(--text-xs); color: var(--color-danger-subtle-fg); font-weight: var(--font-medium); }

.twc-sel { position: relative; font-family: var(--font-sans); }
.twc-sel__trigger {
  --_h: var(--control-h-md);
  display: flex; align-items: center; gap: var(--space-2); width: 100%;
  min-height: var(--_h); padding: 0 var(--space-3); cursor: pointer;
  background: var(--color-surface); color: var(--color-text); text-align: left;
  border: var(--border-thin) solid var(--color-border); border-radius: var(--radius-md);
  font-family: inherit; font-size: var(--text-sm);
  transition: border-color var(--duration-fast) var(--ease-standard), box-shadow var(--duration-fast) var(--ease-standard);
}
.twc-sel__trigger[data-size="sm"] { --_h: var(--control-h-sm); }
.twc-sel__trigger[data-size="lg"] { --_h: var(--control-h-lg); }
.twc-sel__trigger:hover:not([data-open="true"]):not(:disabled) { border-color: var(--color-border-strong); }
.twc-sel__trigger[data-open="true"] { border-color: var(--color-primary); box-shadow: var(--ring); }
.twc-sel__trigger[data-invalid="true"] { border-color: var(--color-danger); }
.twc-sel__trigger:disabled { background: var(--color-surface-sunken); opacity: 0.7; cursor: not-allowed; }
.twc-sel__value { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.twc-sel__value[data-placeholder="true"] { color: var(--color-text-subtle); }
.twc-sel__chevron { flex: none; color: var(--color-text-subtle); display: inline-flex; transition: transform var(--duration-base) var(--ease-spring); }
.twc-sel__trigger[data-open="true"] .twc-sel__chevron { transform: rotate(180deg); }
.twc-sel__chevron svg { width: 16px; height: 16px; }

.twc-pop {
  position: absolute; z-index: var(--z-dropdown); top: calc(100% + 6px); left: 0; right: 0;
  background: var(--color-surface-raised); border: var(--border-thin) solid var(--color-border);
  border-radius: var(--radius-lg); box-shadow: var(--shadow-lg); overflow: hidden;
  transform-origin: top;
}
.twc-pop[data-state="open"] { animation: twico-scale-in var(--duration-fast) var(--ease-spring); }
.twc-pop[data-state="closed"] { animation: twc-select-out 120ms var(--ease-in) forwards; pointer-events: none; }
@keyframes twc-select-out { from { opacity: 1; transform: scale(1); } to { opacity: 0; transform: scale(0.97); } }
@media (prefers-reduced-motion: reduce) { .twc-pop[data-state] { animation-duration: 1ms; } }
.twc-pop[data-placement="top"] { top: auto; bottom: calc(100% + 6px); transform-origin: bottom; }
.twc-pop__search { display: flex; align-items: center; gap: var(--space-2); padding: var(--space-2) var(--space-3); border-bottom: var(--border-thin) solid var(--color-divider); }
.twc-pop__search svg { width: 15px; height: 15px; color: var(--color-text-subtle); flex: none; }
.twc-pop__search input { flex: 1; min-width: 0; border: none; outline: none; background: transparent; font-family: inherit; font-size: var(--text-sm); color: var(--color-text); -webkit-appearance: none; appearance: none; border-radius: 0; box-shadow: none; padding: 2px 0; }
.twc-pop__search input:focus, .twc-pop__search input:focus-visible { outline: none; box-shadow: none; border: none; }
.twc-pop__search input::placeholder { color: var(--color-text-subtle); }
.twc-pop__list { max-height: 260px; overflow-y: auto; padding: var(--space-1-5); }
.twc-pop__group { padding: 8px 10px 4px; font-size: var(--text-xs); font-weight: var(--font-bold); letter-spacing: var(--tracking-wide); text-transform: uppercase; color: var(--color-text-subtle); }
.twc-pop__group:not(:first-child) { margin-top: 4px; border-top: var(--border-thin) solid var(--color-divider); padding-top: 10px; }
.twc-opt {
  display: flex; align-items: center; gap: var(--space-2-5); width: 100%; padding: 8px 10px;
  border: none; background: transparent; cursor: pointer; text-align: left;
  font-family: inherit; font-size: var(--text-sm); color: var(--color-text); border-radius: var(--radius-md);
  transition: background-color var(--duration-fast) var(--ease-standard);
}
.twc-opt:hover, .twc-opt[data-active="true"] { background: var(--color-surface-sunken); }
.twc-opt[data-selected="true"] .twc-opt__label { color: var(--color-primary); font-weight: var(--font-semibold); }
.twc-opt__main { display: flex; flex-direction: column; gap: 1px; min-width: 0; flex: 1; }
.twc-opt__label { line-height: 1.3; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.twc-opt__desc { font-size: var(--text-xs); color: var(--color-text-muted); line-height: 1.3; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.twc-opt__check { flex: none; color: var(--color-primary); display: inline-flex; }
.twc-opt__check svg { width: 16px; height: 16px; }
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
function ensureVisible(list, el) {
  if (!list || !el) return;
  const top = el.offsetTop, bottom = top + el.offsetHeight;
  if (top < list.scrollTop) list.scrollTop = top - 4;
  else if (bottom > list.scrollTop + list.clientHeight) list.scrollTop = bottom - list.clientHeight + 4;
}

export function Select({
  label, hint, error, required = false, size = "md",
  placeholder = "Select…", searchPlaceholder = "Search…", searchable, options, value, defaultValue = null,
  onChange, disabled = false, placement = "bottom", portal = false, minWidth = 0, id, className = "", ...rest
}) {
  React.useInsertionEffect(() => {
    if (document.getElementById("twc-select-styles")) return;
    const el = document.createElement("style");
    el.id = "twc-select-styles"; el.textContent = SELECT_CSS;
    document.head.appendChild(el);
  }, []);

  const groups = React.useMemo(() => normalizeGroups(options), [options]);
  const flat = React.useMemo(() => groups.flatMap((g) => g.options), [groups]);
  const autoId = React.useId();
  const fieldId = id || autoId;
  const [internal, setInternal] = React.useState(defaultValue);
  const current = value !== undefined ? value : internal;
  const [open, setOpen] = React.useState(false);
  const [render, setRender] = React.useState(false);
  const [active, setActive] = React.useState(0);
  const [coords, setCoords] = React.useState(null);
  const [query, setQuery] = React.useState("");
  const wrapRef = React.useRef(null);
  const triggerRef = React.useRef(null);
  const popRef = React.useRef(null);
  const listRef = React.useRef(null);
  const activeRef = React.useRef(null);
  const searchRef = React.useRef(null);

  // Auto-enable search for longer lists unless the caller forces it on/off.
  const showSearch = searchable === undefined ? flat.length > 5 : searchable;
  const fGroups = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return groups;
    return groups
      .map((g) => ({ group: g.group, options: g.options.filter((o) => o.label.toLowerCase().includes(q) || (o.description && o.description.toLowerCase().includes(q))) }))
      .filter((g) => g.options.length);
  }, [groups, query]);
  const visible = React.useMemo(() => fGroups.flatMap((g) => g.options), [fGroups]);

  const selected = flat.find((o) => o.value === current);

  // Portal mode: measure the trigger and pin the popover with fixed positioning so
  // it escapes any clipping/scrolling ancestor (e.g. a config panel). Auto-flips up
  // when there isn't enough room below.
  const place = React.useCallback(() => {
    const el = triggerRef.current; if (!el) return;
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
    const idx = flat.findIndex((o) => o.value === current);
    setActive(idx >= 0 ? idx : 0);
    setQuery("");
    if (showSearch) { const t = setTimeout(() => searchRef.current?.focus(), 20); }
    const onDown = (e) => {
      if (wrapRef.current && wrapRef.current.contains(e.target)) return;
      if (popRef.current && popRef.current.contains(e.target)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  React.useEffect(() => { setActive(0); }, [query]);

  React.useEffect(() => { if (open) ensureVisible(listRef.current, activeRef.current); }, [active, open]);

  // Keep the listbox mounted through the close animation, then unmount.
  React.useEffect(() => {
    if (open) { setRender(true); return; }
    const t = setTimeout(() => setRender(false), 130);
    return () => clearTimeout(t);
  }, [open]);

  function commit(v) {
    if (value === undefined) setInternal(v);
    onChange?.(v); setOpen(false);
  }
  function onKeyDown(e) {
    if (disabled) return;
    if (!open && (e.key === "Enter" || e.key === " " || e.key === "ArrowDown")) { e.preventDefault(); setOpen(true); return; }
    if (!open) return;
    if (e.key === "Escape") setOpen(false);
    else if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, visible.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    else if (e.key === "Enter") { e.preventDefault(); if (visible[active]) commit(visible[active].value); }
  }

  const listboxId = `${fieldId}-listbox`;
  const optionId = (i) => `${fieldId}-opt-${i}`;
  const activeId = open && visible[active] ? optionId(active) : undefined;

  let counter = -1;
  const popInner = (
    <>
      {showSearch ? (
        <div className="twc-pop__search">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input ref={searchRef} value={query} placeholder={searchPlaceholder} onKeyDown={onKeyDown}
            onChange={(e) => setQuery(e.target.value)} aria-label="Search options"
            role="combobox" aria-expanded={open} aria-controls={listboxId} aria-activedescendant={activeId} />
        </div>
      ) : null}
      <div className="twc-pop__list" ref={listRef}>
        {visible.length === 0 ? <div className="twc-pop__empty">No results found</div> :
          fGroups.map((g, gi) => (
            <React.Fragment key={gi}>
              {g.group ? <div className="twc-pop__group">{g.group}</div> : null}
              {g.options.map((o) => {
                counter += 1; const idx = counter; const isSel = o.value === current;
                return (
                  <button key={o.value} id={optionId(idx)} type="button" className="twc-opt" role="option" aria-selected={isSel}
                    ref={idx === active ? activeRef : null}
                    data-selected={isSel || undefined} data-active={idx === active || undefined}
                    onMouseEnter={() => setActive(idx)} onClick={() => commit(o.value)}>
                    <span className="twc-opt__main">
                      <span className="twc-opt__label">{o.label}</span>
                      {o.description ? <span className="twc-opt__desc">{o.description}</span> : null}
                    </span>
                    {isSel ? <span className="twc-opt__check" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg></span> : null}
                  </button>
                );
              })}
            </React.Fragment>
          ))}
      </div>
    </>
  );

  const RD = { createPortal: (typeof createPortal === "function" ? createPortal : (typeof window !== "undefined" && window.ReactDOM && window.ReactDOM.createPortal)) };
  const canPortal = portal && RD && RD.createPortal;

  const popState = open ? "open" : "closed";
  let popEl = null;
  if (render) {
    if (canPortal && coords) {
      popEl = RD.createPortal(
        <div className="twc-pop twc-pop--portal" id={listboxId} role="listbox" ref={popRef}
          data-state={popState} data-placement={coords.flip ? "top" : undefined}
          style={{ position: "fixed", left: coords.left, top: coords.top, bottom: coords.bottom, width: coords.width, right: "auto", zIndex: "var(--z-tooltip)" }}>
          {popInner}
        </div>, document.body);
    } else if (!portal) {
      popEl = (
        <div className="twc-pop" id={listboxId} role="listbox" ref={popRef} data-state={popState} data-placement={placement === "top" ? "top" : undefined}>
          {popInner}
        </div>
      );
    }
  }

  return (
    <div className={`twc-field ${className}`} ref={wrapRef}>
      {label ? (<label className="twc-field__label" htmlFor={fieldId}>{label}{required ? <span className="twc-field__req">*</span> : null}</label>) : null}
      <div className="twc-sel">
        <button type="button" id={fieldId} ref={triggerRef} className="twc-sel__trigger" data-size={size}
          data-open={open || undefined} data-invalid={Boolean(error) || undefined} disabled={disabled}
          aria-haspopup="listbox" aria-expanded={open} aria-controls={open ? listboxId : undefined} aria-activedescendant={activeId}
          onClick={() => setOpen((o) => !o)} onKeyDown={onKeyDown} {...rest}>
          <span className="twc-sel__value" data-placeholder={!selected || undefined}>{selected ? selected.label : placeholder}</span>
          <span className="twc-sel__chevron" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
          </span>
        </button>
        {popEl}
      </div>
      {error ? <span className="twc-field__error">{error}</span> : hint ? <span className="twc-field__hint">{hint}</span> : null}
    </div>
  );
}
