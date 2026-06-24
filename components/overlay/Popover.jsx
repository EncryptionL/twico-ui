import React from "react";
import { useScopedStyles } from "../_styles.js";
import { createPortal } from "react-dom";

const POPOVER_CSS = `
.twc-popover-wrap { position: relative; display: inline-flex; }
.twc-popover {
  position: fixed; z-index: var(--z-popover); min-width: 200px;
  background: var(--color-surface-raised); color: var(--color-text);
  border: var(--border-thin) solid var(--color-border); border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg); font-family: var(--font-sans);
  transform-origin: top;
}
.twc-popover:focus { outline: none; }
.twc-popover[data-state="open"] { animation: twico-scale-in var(--duration-fast) var(--ease-spring); }
.twc-popover[data-state="closed"] { animation: twc-popover-out var(--duration-exit) var(--ease-in) forwards; pointer-events: none; }
@keyframes twc-popover-out { from { opacity: 1; transform: scale(1); } to { opacity: 0; transform: scale(0.96); } }
@media (prefers-reduced-motion: reduce) { .twc-popover[data-state] { animation-duration: 1ms; } }
.twc-popover[data-flip="true"] { transform-origin: bottom; }
.twc-popover__arrow { position: absolute; width: 11px; height: 11px; background: var(--color-surface-raised);
  border-left: var(--border-thin) solid var(--color-border); border-top: var(--border-thin) solid var(--color-border);
  transform: rotate(45deg); }
.twc-popover__inner { padding: var(--space-4); font-size: var(--text-sm); color: var(--color-text-muted); line-height: var(--leading-normal); }
.twc-popover__title { font-size: var(--text-sm); font-weight: var(--font-bold); color: var(--color-text); margin-bottom: 4px; }
`;

export function Popover({
  trigger,
  children,
  title,
  placement = "bottom",
  align = "center",
  width,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  className = "",
  ...rest
}) {
  const __twcStyles = useScopedStyles("twc-popover-styles", POPOVER_CSS);

  const [openState, setOpenState] = React.useState(defaultOpen);
  const [render, setRender] = React.useState(false);
  const [pos, setPos] = React.useState(null);
  const wrapRef = React.useRef(null);
  const popRef = React.useRef(null);
  const popId = React.useId();

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
  const toggle = () => setOpen((o) => !o);
  const RD = { createPortal: (typeof createPortal === "function" ? createPortal : (typeof window !== "undefined" && window.ReactDOM && window.ReactDOM.createPortal)) };

  const place = React.useCallback(() => {
    const t = wrapRef.current; if (!t) return;
    const r = t.getBoundingClientRect();
    const w = width || 240;
    const gap = 10;
    const vw = window.innerWidth, vh = window.innerHeight, M = 8;
    let top, left, flip = false, arrow = {};
    const vertical = placement === "top" || placement === "bottom";
    if (vertical) {
      flip = placement === "top" || (placement === "bottom" && vh - r.bottom < 180 && r.top > vh - r.bottom);
      top = flip ? undefined : r.bottom + gap;
      const bottom = flip ? vh - r.top + gap : undefined;
      let l = align === "start" ? r.left : align === "end" ? r.right - w : r.left + r.width / 2 - w / 2;
      l = Math.max(M, Math.min(l, vw - w - M));
      left = l;
      arrow = { left: Math.min(Math.max(r.left + r.width / 2 - l - 5.5, 10), w - 20), [flip ? "bottom" : "top"]: -6 };
      return setPos({ top, bottom, left, width: w, flip, arrow });
    }
    // left / right — center on the trigger using the REAL panel height, flip to the
    // other side when there isn't room, and clamp within the viewport.
    const ph = popRef.current ? popRef.current.offsetHeight : 120;
    let onRight = placement === "right";
    const spaceRight = vw - r.right - gap, spaceLeft = r.left - gap;
    if (onRight && spaceRight < w + M && spaceLeft > spaceRight) onRight = false;
    else if (!onRight && spaceLeft < w + M && spaceRight > spaceLeft) onRight = true;
    left = onRight ? r.right + gap : r.left - w - gap;
    left = Math.max(M, Math.min(left, vw - w - M));
    const cy = r.top + r.height / 2;
    top = Math.max(M, Math.min(cy - ph / 2, vh - ph - M));
    arrow = { top: Math.min(Math.max(cy - top - 5.5, 8), ph - 18), [onRight ? "left" : "right"]: -6 };
    setPos({ top, left, width: w, flip: false, arrow });
  }, [placement, align, width]);

  React.useEffect(() => {
    if (!open) return;
    place();
    const onMove = () => place();
    const onDown = (e) => {
      if (wrapRef.current?.contains(e.target)) return;
      if (popRef.current?.contains(e.target)) return;
      setOpen(false);
    };
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("scroll", onMove, true);
    window.addEventListener("resize", onMove);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("scroll", onMove, true);
      window.removeEventListener("resize", onMove);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, place]);

  // Keep the popover mounted through the close animation, then unmount.
  React.useEffect(() => {
    if (open) { setRender(true); return; }
    const t = setTimeout(() => setRender(false), 170);
    return () => clearTimeout(t);
  }, [open]);

  // Re-measure once the panel is in the DOM so left/right placement centers on the
  // real panel height (the first place() runs before the panel mounts).
  React.useEffect(() => { if (render && open) place(); }, [render, place]);

  // Remember what to restore focus to on open; restore it on close, but only if
  // focus is still inside the panel (don't steal focus after an outside click).
  const restoreRef = React.useRef(null);
  const needFocusRef = React.useRef(false);
  React.useEffect(() => {
    if (open) {
      restoreRef.current = document.activeElement;
      needFocusRef.current = true;
      return;
    }
    const prev = restoreRef.current;
    restoreRef.current = null;
    needFocusRef.current = false;
    if (prev && typeof prev.focus === "function" && popRef.current?.contains(document.activeElement)) prev.focus();
  }, [open]);

  // Move focus into the panel once it has mounted and been positioned.
  React.useEffect(() => {
    if (open && render && pos && needFocusRef.current) {
      needFocusRef.current = false;
      popRef.current?.focus({ preventScroll: true });
    }
  }, [open, render, pos]);

  const pop = render && pos ? (
    <div className="twc-popover" id={popId} ref={popRef} tabIndex={-1} data-state={open ? "open" : "closed"} data-flip={pos.flip || undefined} role="dialog"
      aria-labelledby={title ? `${popId}-title` : undefined}
      style={{ top: pos.top, bottom: pos.bottom, left: pos.left, width: pos.width }}>
      {__twcStyles}
      <span className="twc-popover__arrow" style={pos.arrow} aria-hidden="true" />
      <div className="twc-popover__inner">
        {title ? <div className="twc-popover__title" id={`${popId}-title`}>{title}</div> : null}
        {children}
      </div>
    </div>
  ) : null;

  // Make the trigger a proper, focusable disclosure button that announces its
  // popup + open state. Clone a passed element (so a <button>/IconButton keeps
  // its own semantics) or wrap a non-element trigger in a focusable
  // role="button" span with Enter/Space activation.
  const triggerEl = React.isValidElement(trigger)
    ? React.cloneElement(trigger, {
        onClick: (e) => { trigger.props.onClick?.(e); toggle(); },
        tabIndex: trigger.props.tabIndex ?? 0,
        "aria-haspopup": "dialog",
        "aria-expanded": open,
        "aria-controls": open ? popId : undefined,
      })
    : (
        <span role="button" tabIndex={0} aria-haspopup="dialog" aria-expanded={open}
          aria-controls={open ? popId : undefined} onClick={toggle}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); } }}>
          {trigger}
        </span>
      );

  return (
    <span className={`twc-popover-wrap ${className}`} ref={wrapRef} {...rest}>
      {triggerEl}
      {pop && RD && RD.createPortal ? RD.createPortal(pop, document.body) : pop}
    </span>
  );
}
