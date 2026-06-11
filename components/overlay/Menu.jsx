import React from "react";
import { createPortal } from "react-dom";

const MENU_CSS = `
.twc-menu-wrap { position: relative; display: inline-flex; }
.twc-menu {
  position: fixed; z-index: var(--z-dropdown); min-width: 200px;
  padding: var(--space-1-5); background: var(--color-surface-raised);
  border: var(--border-thin) solid var(--color-border); border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg); font-family: var(--font-sans);
  transform-origin: top;
}
.twc-menu[data-state="open"] { animation: twico-scale-in var(--duration-fast) var(--ease-spring); }
.twc-menu[data-state="closed"] { animation: twc-menu-out var(--duration-exit) var(--ease-in) forwards; pointer-events: none; }
@keyframes twc-menu-out { from { opacity: 1; transform: scale(1); } to { opacity: 0; transform: scale(0.96); } }
@media (prefers-reduced-motion: reduce) { .twc-menu[data-state] { animation-duration: 1ms; } }
.twc-menu[data-flip="true"] { transform-origin: bottom; }
.twc-menu__header { display: flex; align-items: center; gap: var(--space-2-5); padding: 8px 10px 10px; margin-bottom: var(--space-1-5); border-bottom: var(--border-thin) solid var(--color-divider); }
.twc-menu__header-main { min-width: 0; }
.twc-menu__header-title { font-size: var(--text-sm); font-weight: var(--font-bold); color: var(--color-text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.twc-menu__header-sub { font-size: var(--text-xs); color: var(--color-text-subtle); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.twc-menu__label { padding: 6px 10px 4px; font-size: var(--text-xs); font-weight: var(--font-semibold); letter-spacing: var(--tracking-wide); text-transform: uppercase; color: var(--color-text-subtle); }
.twc-menu__sep { height: 1px; background: var(--color-divider); margin: var(--space-1-5) 0; }
.twc-menu__item {
  display: flex; align-items: center; gap: var(--space-2-5); width: 100%;
  padding: 8px 10px; border: none; background: transparent; cursor: pointer;
  font-family: inherit; font-size: var(--text-sm); font-weight: var(--font-medium);
  color: var(--color-text); text-align: start; border-radius: var(--radius-md);
  transition: background-color var(--duration-fast) var(--ease-standard);
}
.twc-menu__item:hover:not(:disabled), .twc-menu__item[data-active="true"]:not(:disabled) { background: var(--color-surface-sunken); }
.twc-menu__item:focus-visible { outline: none; box-shadow: var(--ring); }
.twc-menu__item:disabled { opacity: 0.45; cursor: not-allowed; }
.twc-menu__item[data-danger="true"] { color: var(--color-danger-subtle-fg); }
.twc-menu__item[data-danger="true"]:hover:not(:disabled), .twc-menu__item[data-danger="true"][data-active="true"]:not(:disabled) { background: var(--color-danger-subtle); }
.twc-menu__item svg { width: 16px; height: 16px; flex: none; }
.twc-menu__item-label { flex: 1 1 auto; min-width: 0; }
.twc-menu__shortcut { margin-inline-start: auto; padding-inline-start: var(--space-3); font-size: var(--text-xs); color: var(--color-text-subtle); font-family: var(--font-mono); }
`;

export function Menu({
  trigger,
  items,
  align = "start",
  header,
  width,
  open: openProp,
  onOpenChange,
  className = "",
  ...rest
}) {
  React.useInsertionEffect(() => {
    if (document.getElementById("twc-menu-styles")) return;
    const el = document.createElement("style");
    el.id = "twc-menu-styles";
    el.textContent = MENU_CSS;
    document.head.appendChild(el);
  }, []);

  const [openState, setOpenState] = React.useState(false);
  const [render, setRender] = React.useState(false);
  const [pos, setPos] = React.useState(null);
  const [active, setActive] = React.useState(-1);
  const wrapRef = React.useRef(null);
  const menuRef = React.useRef(null);
  const menuId = React.useId();

  // Controlled when an `open` prop is passed; uncontrolled (internal state) otherwise.
  // Every internal open/close request goes through setOpen so `onOpenChange` always fires.
  const controlled = openProp !== undefined;
  const open = controlled ? !!openProp : openState;
  const openRef = React.useRef(open);
  openRef.current = open;
  const controlledRef = React.useRef(controlled);
  controlledRef.current = controlled;
  const onOpenChangeRef = React.useRef(onOpenChange);
  onOpenChangeRef.current = onOpenChange;
  const setOpen = React.useCallback((next) => {
    const value = typeof next === "function" ? next(openRef.current) : next;
    if (value === openRef.current) return;
    if (!controlledRef.current) setOpenState(value);
    onOpenChangeRef.current?.(value);
  }, []);
  const RD = { createPortal: (typeof createPortal === "function" ? createPortal : (typeof window !== "undefined" && window.ReactDOM && window.ReactDOM.createPortal)) };

  const interactiveIdx = items.map((it, i) => (!it.separator && !it.heading ? i : -1)).filter((i) => i >= 0);

  const place = React.useCallback(() => {
    const t = wrapRef.current; if (!t) return;
    const r = t.getBoundingClientRect();
    const w = width || Math.max(200, r.width);
    const gap = 6, M = 8, vw = window.innerWidth, vh = window.innerHeight;
    const estH = menuRef.current ? menuRef.current.offsetHeight : 220;
    const flip = vh - r.bottom < estH + gap && r.top > vh - r.bottom;
    const top = flip ? undefined : r.bottom + gap;
    const bottom = flip ? vh - r.top + gap : undefined;
    let left = align === "end" ? r.right - w : r.left;
    left = Math.max(M, Math.min(left, vw - w - M));
    setPos({ top, bottom, left, width: w, flip });
  }, [align, width]);

  React.useEffect(() => {
    if (!open) return;
    place();
    const onMove = () => place();
    const onDown = (e) => {
      if (wrapRef.current?.contains(e.target)) return;
      if (menuRef.current?.contains(e.target)) return;
      setOpen(false);
    };
    window.addEventListener("scroll", onMove, true);
    window.addEventListener("resize", onMove);
    document.addEventListener("mousedown", onDown);
    return () => {
      window.removeEventListener("scroll", onMove, true);
      window.removeEventListener("resize", onMove);
      document.removeEventListener("mousedown", onDown);
    };
  }, [open, place]);

  // Keep the menu mounted through the close animation, then unmount.
  React.useEffect(() => {
    if (open) { setRender(true); return; }
    const t = setTimeout(() => setRender(false), 170);
    return () => clearTimeout(t);
  }, [open]);

  const toggle = () => { setOpen((o) => !o); setActive(-1); };

  function onKeyDown(e) {
    if (!open) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") { e.preventDefault(); setOpen(true); setActive(-1); }
      return;
    }
    if (e.key === "Escape") { e.preventDefault(); setOpen(false); return; }
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const list = interactiveIdx;
      const curPos = list.indexOf(active);
      let next = e.key === "ArrowDown" ? curPos + 1 : curPos - 1;
      if (next < 0) next = list.length - 1; if (next >= list.length) next = 0;
      setActive(list[next]);
    } else if (e.key === "Home" || e.key === "End") {
      e.preventDefault();
      const list = interactiveIdx;
      if (list.length) setActive(e.key === "Home" ? list[0] : list[list.length - 1]);
    } else if ((e.key === "Enter" || e.key === " ") && active >= 0) {
      e.preventDefault();
      const it = items[active];
      if (it && !it.disabled) { it.onClick?.(); setOpen(false); }
    }
  }

  const menu = render && pos ? (
    <div className="twc-menu" id={menuId} ref={menuRef} data-state={open ? "open" : "closed"} data-align={align} data-flip={pos.flip || undefined} role="menu"
      style={{ top: pos.top, bottom: pos.bottom, left: pos.left, minWidth: pos.width }}>
      {header ? <div className="twc-menu__header">{header}</div> : null}
      {items.map((it, i) => {
        if (it.separator) return <div key={`s${i}`} className="twc-menu__sep" role="separator" />;
        if (it.label && it.heading) return <div key={`h${i}`} className="twc-menu__label">{it.label}</div>;
        return (
          <button
            key={i}
            type="button"
            id={`${menuId}-item-${i}`}
            className="twc-menu__item"
            role="menuitem"
            data-danger={it.danger || undefined}
            data-active={active === i || undefined}
            disabled={it.disabled}
            onMouseEnter={() => setActive(i)}
            onClick={() => { it.onClick?.(); setOpen(false); }}
          >
            {it.icon}
            <span className="twc-menu__item-label">{it.label}</span>
            {it.shortcut ? <span className="twc-menu__shortcut">{it.shortcut}</span> : null}
          </button>
        );
      })}
    </div>
  ) : null;

  // Make the trigger a proper, focusable menu button that announces its popup +
  // open state. Clone a passed element (so a <button>/IconButton keeps its own
  // semantics) or wrap a non-element trigger in a focusable role="button" span.
  // aria-activedescendant mirrors the highlighted item for screen readers while
  // DOM focus stays on the trigger.
  const activeDescId = open && active >= 0 ? `${menuId}-item-${active}` : undefined;
  const triggerEl = React.isValidElement(trigger)
    ? React.cloneElement(trigger, {
        onClick: (e) => { trigger.props.onClick?.(e); toggle(); },
        tabIndex: trigger.props.tabIndex ?? 0,
        "aria-haspopup": "menu",
        "aria-expanded": open,
        "aria-controls": open ? menuId : undefined,
        "aria-activedescendant": activeDescId,
      })
    : (
        <span role="button" tabIndex={0} aria-haspopup="menu" aria-expanded={open}
          aria-controls={open ? menuId : undefined} aria-activedescendant={activeDescId} onClick={toggle}>
          {trigger}
        </span>
      );

  return (
    <span className={`twc-menu-wrap ${className}`} ref={wrapRef} onKeyDown={onKeyDown} {...rest}>
      {triggerEl}
      {menu && RD && RD.createPortal ? RD.createPortal(menu, document.body) : menu}
    </span>
  );
}
