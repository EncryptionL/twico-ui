import React from "react";
import { useScopedStyles } from "../_styles.js";
import { compose } from "../_compose.js";
import { createPortal } from "react-dom";
import { useLayer, triggerIsControl, useTriggerAudit } from "../_overlay.js";

const MENU_CSS = `
.twc-menu-wrap { position: relative; display: inline-flex; }
.twc-menu {
  position: fixed; z-index: var(--z-popover); min-width: 200px;
  padding: var(--space-1-5); background: var(--color-surface-raised);
  border: var(--border-thin) solid var(--color-border); border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg); font-family: var(--font-sans);
  transform-origin: top; overflow-y: auto;
}
.twc-menu[data-state="open"] { animation: twico-scale-in var(--duration-fast) var(--ease-spring); }
.twc-menu[data-state="closed"] { animation: twc-menu-out var(--duration-exit) var(--ease-in) forwards; pointer-events: none; }
@keyframes twc-menu-out { from { opacity: 1; transform: scale(1); } to { opacity: 0; transform: scale(0.96); } }
@media (prefers-reduced-motion: reduce) { .twc-menu[data-state] { animation-duration: 1ms; } }
.twc-menu[data-flip="true"] { transform-origin: bottom; }
.twc-menu__header { display: flex; align-items: center; gap: var(--space-2-5); padding: 8px 10px 10px; margin-bottom: var(--space-1-5); border-bottom: var(--border-thin) solid var(--color-divider); }
.twc-menu__header-main { min-width: 0; display: flex; flex-direction: column; }
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
/* #462 (review): text-MUTED. This text sits inside an element that takes a sunken or tinted fill,
   and a child's own color declaration beats the parent's, so it does not follow the row. Subtle on
   either fill is 4.26-4.34:1 in light - the pairing the token rules forbid. */
.twc-menu__shortcut { margin-inline-start: auto; padding-inline-start: var(--space-3); font-size: var(--text-xs); color: var(--color-text-muted); font-family: var(--font-mono); }
`;

// Block javascript:/data:/vbscript: URLs from reaching an anchor href (consumer hrefs are untrusted).
const safeHref = (url) => {
  if (url == null) return undefined;
  const s = String(url).replace(/[\x00-\x20]+/g, "").toLowerCase();
  return s.startsWith("javascript:") || s.startsWith("data:") || s.startsWith("vbscript:") ? undefined : url;
};

export function Menu({
  trigger,
  items,
  align = "start",
  header,
  width,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledby,
  "aria-describedby": ariaDescribedby,
  className = "",
  ...rest
}) {
  const __twcStyles = useScopedStyles("twc-menu-styles", MENU_CSS);
  // #420: don't open from a disabled trigger (keyboard OR click) — mirrors a native disabled control.
  const _tp = React.isValidElement(trigger) ? trigger.props : {};
  const triggerDisabled = _tp.disabled === true || _tp["aria-disabled"] === true || _tp["aria-disabled"] === "true";

  const [openState, setOpenState] = React.useState(defaultOpen);
  const [render, setRender] = React.useState(false);
  const [pos, setPos] = React.useState(null);
  const [active, setActive] = React.useState(-1);
  const wrapRef = React.useRef(null);
  useTriggerAudit(wrapRef, "Menu"); // #447: dev-only trigger contract check
  const menuRef = React.useRef(null);
  const typeBufRef = React.useRef("");
  const typeTimerRef = React.useRef(null);
  const menuId = React.useId();
  const headerId = `${menuId}-header`;

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
    // Vertical room for the chosen placement, so a long menu scrolls instead of overflowing.
    const avail = (flip ? r.top : vh - r.bottom) - gap - M;
    setPos({ top, bottom, left, width: w, flip, maxHeight: Math.max(120, avail) });
  }, [align, width]);

  const isTop = useLayer(open && render); // #389: dismissable-layer stack
  React.useEffect(() => {
    if (!open) return;
    place();
    const onMove = () => place();
    const onDown = (e) => {
      if (wrapRef.current?.contains(e.target)) return;
      if (menuRef.current?.contains(e.target)) return;
      if (!isTop()) return; // #389: only the topmost layer dismisses on an outside pointer (a menu over a dialog)
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
  }, [open, place, isTop]);

  // #459: aria-activedescendant is not a permitted attribute on role="button", so the highlight the
  // trigger used to advertise was discarded by assistive tech - for a keyboard user the active item
  // was announced not at all. Follow the APG instead and move real DOM focus onto the highlighted
  // item. Only for keyboard-driven changes (kbdRef): hovering the menu must not steal focus, which
  // is why the highlight and the focus are tracked separately.
  const kbdRef = React.useRef(false);
  React.useEffect(() => {
    if (!open || !render || active < 0 || !kbdRef.current) return;
    kbdRef.current = false;
    const el = document.getElementById(`${menuId}-item-${active}`);
    if (el) el.focus();
  }, [open, render, active, menuId]);

  const focusTrigger = React.useCallback(() => {
    const t = wrapRef.current && wrapRef.current.querySelector('button, a[href], [role="button"], [tabindex]');
    if (t) t.focus();
  }, []);

  // ...and hand it back to the trigger on close, so Escape/Tab/activation never drop focus to <body>.
  React.useEffect(() => {
    if (open) return;
    // #459 (review): clear the keyboard flag on close. It is set unconditionally at the top of
    // onKeyDown, and Escape/Tab/Enter all close the menu BEFORE the focus effect reaches its clear -
    // so it was left true with `active` still pointing at the old index. A controlled reopen from
    // somewhere else (<Menu open={o}> driven by another button) then satisfied the focus effect
    // immediately and yanked focus to that stale item instead of leaving it on the trigger.
    kbdRef.current = false;
    // #459 (review 2): and drop the highlight. `toggle()` resets it, but a CONTROLLED close (the host
    // setting open=false, or Escape/Tab/activation) left `active` pointing at the old index - so a
    // controlled reopen from elsewhere came up with an item already highlighted, which Enter would
    // then activate. Opening by keyboard sets it again; opening by mouse should start at -1.
    setActive(-1);
    const m = menuRef.current;
    if (!m || typeof document === "undefined" || !m.contains(document.activeElement)) return;
    focusTrigger();
  }, [open, focusTrigger]);

  // Keep the menu mounted through the close animation, then unmount.
  React.useEffect(() => {
    if (open) { setRender(true); return; }
    const t = setTimeout(() => setRender(false), 170);
    return () => clearTimeout(t);
  }, [open]);

  const toggle = () => { if (triggerDisabled && !open) return; setOpen((o) => !o); setActive(-1); }; // #420: no open from a disabled trigger

  const NAV_KEYS = "|Enter| |ArrowDown|ArrowUp|Home|End|PageDown|PageUp|";
  function onKeyDown(e) {
    // #459 (review 2): armed only for keys that actually move or open the highlight, plus the
    // type-ahead characters. Arming it on EVERY keydown meant a stray keystroke on a CLOSED trigger
    // (Shift while tabbing through, a modifier, a parent's shortcut) left it true, so the next
    // highlight change - even one driven by the mouse - pulled focus. The flag means "focus should
    // follow this highlight", so only the keys that cause one may set it.
    if (NAV_KEYS.indexOf("|" + e.key + "|") >= 0 || (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey)) {
      kbdRef.current = true;
    }
    // #410: a parent (e.g. a Datatable widget-nav cell) may claim this key in the capture phase and
    // preventDefault it — respect that and don't also open the menu (mirrors Select's trigger guard).
    if (e.defaultPrevented) return;
    if (!open) {
      if (triggerDisabled) return; // #420: a disabled trigger doesn't OPEN (but an already-open menu can still Escape/navigate)
      // #118: opening by keyboard highlights the first interactive item (APG); mouse-open stays at -1.
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") { e.preventDefault(); setOpen(true); setActive(interactiveIdx[0] ?? -1); }
      return;
    }
    if (e.key === "Escape") { e.preventDefault(); setOpen(false); return; }
    // APG: Tab closes the menu and lets focus move on naturally (the items stay out of the tab
    // order at tabIndex={-1}; the highlighted one is focused programmatically).
    if (e.key === "Tab") {
      // #459 (review): restore focus to the trigger BEFORE this event reaches an ancestor focus trap.
      // With focus parked on a portaled item, a Dialog/Drawer trap sees activeElement outside its own
      // region and yanks focus to its FIRST focusable (_overlay.js useFocusTrap) - so tabbing out of a
      // menu inside a dialog jumped to the top of the dialog instead of continuing past the trigger.
      // React's handler runs before the trap's document-level listener, so restoring here leaves both
      // the trap and the browser's native Tab to behave exactly as they did before the menu opened.
      focusTrigger();
      setOpen(false);
      return;
    }
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const list = interactiveIdx;
      const curPos = list.indexOf(active);
      let next = e.key === "ArrowDown" ? curPos + 1 : curPos - 1;
      if (next < 0) next = list.length - 1; if (next >= list.length) next = 0;
      setActive(list[next]);
    } else if (e.key === "PageDown" || e.key === "PageUp") {
      // #118: jump ~5 interactive items (WAI-ARIA menu pattern).
      e.preventDefault();
      const list = interactiveIdx;
      if (list.length) {
        const curPos = Math.max(0, list.indexOf(active));
        const next = Math.min(list.length - 1, Math.max(0, curPos + (e.key === "PageDown" ? 5 : -5)));
        setActive(list[next]);
      }
      // #457: space is EXCLUDED from type-ahead. It satisfies length === 1, and this branch precedes
      // the activation branch below, so Space was swallowed here and could never activate the
      // highlighted item - which the WAI-ARIA APG lists alongside Enter for a menuitem.
    } else if (e.key.length === 1 && e.key !== " " && !e.ctrlKey && !e.metaKey && !e.altKey) {
      // #118: type-ahead — jump to the next interactive item whose label starts with the buffer.
      typeBufRef.current += e.key.toLowerCase();
      clearTimeout(typeTimerRef.current);
      typeTimerRef.current = setTimeout(() => { typeBufRef.current = ""; }, 500);
      const b = typeBufRef.current;
      const labelOf = (i) => String(items[i]?.label ?? "").toLowerCase();
      const hit = interactiveIdx.find((i) => labelOf(i).startsWith(b));
      if (hit != null) setActive(hit);
    } else if (e.key === "Home" || e.key === "End") {
      e.preventDefault();
      const list = interactiveIdx;
      if (list.length) setActive(e.key === "Home" ? list[0] : list[list.length - 1]);
    } else if ((e.key === "Enter" || e.key === " ") && active >= 0) {
      e.preventDefault();
      const it = items[active];
      if (it && !it.disabled) {
        // Activate explicitly rather than leaning on the native key behaviour: the highlight can
        // have been set by hover (no DOM focus on the item at all), and preventDefault above has
        // already suppressed the browser's own Enter/Space click, so this is the single activation.
        const el = typeof document !== "undefined" ? document.getElementById(`${menuId}-item-${active}`) : null;
        if (el && el.tagName === "A") el.click();
        else { it.onClick?.(); setOpen(false); }
      }
    }
  }

  const menu = render && pos ? (
    <div className="twc-menu" id={menuId} ref={menuRef} data-state={open ? "open" : "closed"} data-align={align} data-flip={pos.flip || undefined} role="menu" aria-orientation="vertical"
      aria-label={ariaLabel} aria-labelledby={ariaLabelledby ?? (ariaLabel ? undefined : (header ? headerId : undefined))}
      style={{ top: pos.top, bottom: pos.bottom, left: pos.left, minWidth: pos.width, width: pos.width, maxHeight: pos.maxHeight }}>
      {__twcStyles}
      {header ? <div className="twc-menu__header" id={headerId} role="presentation">{header}</div> : null}
      {items.map((it, i) => {
        if (it.separator) return <div key={`s${i}`} className="twc-menu__sep" role="separator" />;
        if (it.label && it.heading) return <div key={`h${i}`} className="twc-menu__label">{it.label}</div>;
        const href = !it.disabled ? safeHref(it.href) : undefined;
        const Tag = href ? "a" : "button";
        return (
          <Tag
            key={i}
            id={`${menuId}-item-${i}`}
            className="twc-menu__item"
            role="menuitem"
            tabIndex={-1}
            data-danger={it.danger || undefined}
            data-active={active === i || undefined}
            onMouseEnter={() => { kbdRef.current = false; setActive(i); }}
            onClick={() => { it.onClick?.(); setOpen(false); }}
            {...(Tag === "button" ? { type: "button", disabled: it.disabled } : { href, target: it.target, rel: it.rel })}
          >
            {it.icon}
            <span className="twc-menu__item-label">{it.label}</span>
            {it.shortcut ? <span className="twc-menu__shortcut">{it.shortcut}</span> : null}
          </Tag>
        );
      })}
    </div>
  ) : null;

  // Make the trigger a proper, focusable menu button that announces its popup +
  // open state. Clone a passed element (so a <button>/IconButton keeps its own
  // semantics) or wrap a non-element trigger in a focusable role="button" span.
  // #459: the trigger no longer carries aria-activedescendant - the attribute is illegal on
  // role="button" and the highlight is announced by real focus on the item instead.
  // #447: a cloned non-control trigger needs role="button" so the injected aria-expanded is legal
  // (it is prohibited on a div's implicit role="generic"). Keyboard activation already works for
  // every trigger shape - span.twc-menu-wrap below carries onKeyDown, which Enter/Space/ArrowDown
  // bubble up to - so, unlike Popover, no handler is added here.
  const fix = React.isValidElement(trigger) && !triggerIsControl(trigger) ? { role: "button" } : null;
  const triggerEl = React.isValidElement(trigger)
    ? React.cloneElement(trigger, {
        onClick: (e) => { trigger.props.onClick?.(e); toggle(); },
        tabIndex: trigger.props.tabIndex ?? 0,
        "aria-haspopup": "menu",
        "aria-expanded": open,
        "aria-controls": open ? menuId : undefined,
        // #420: forward an incoming aria-describedby (e.g. from a wrapping Tooltip) to the focusable trigger,
        // not the wrapper span, so the description is announced on focus.
        "aria-describedby": [trigger.props["aria-describedby"], ariaDescribedby].filter(Boolean).join(" ") || undefined,
        ...fix,
      })
    : (
        <span role="button" tabIndex={0} aria-haspopup="menu" aria-expanded={open}
          aria-controls={open ? menuId : undefined} aria-describedby={ariaDescribedby} onClick={toggle}>
          {trigger}
        </span>
      );

  return (
    <span className={`twc-menu-wrap ${className}`} ref={wrapRef} {...rest} onKeyDown={compose(rest.onKeyDown, onKeyDown)}>
      {triggerEl}
      {menu && RD && RD.createPortal ? RD.createPortal(menu, document.body) : menu}
    </span>
  );
}
