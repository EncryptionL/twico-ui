import React from "react";
import { createPortal } from "react-dom";

const POPOVER_CSS = `
.twc-popover-wrap { position: relative; display: inline-flex; }
.twc-popover {
  position: fixed; z-index: var(--z-popover); min-width: 200px;
  background: var(--color-surface-raised); color: var(--color-text);
  border: var(--border-thin) solid var(--color-border); border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg); font-family: var(--font-sans);
  animation: twico-scale-in var(--duration-fast) var(--ease-spring); transform-origin: top;
}
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
  className = "",
  ...rest
}) {
  React.useInsertionEffect(() => {
    if (document.getElementById("twc-popover-styles")) return;
    const el = document.createElement("style");
    el.id = "twc-popover-styles";
    el.textContent = POPOVER_CSS;
    document.head.appendChild(el);
  }, []);

  const [open, setOpen] = React.useState(false);
  const [pos, setPos] = React.useState(null);
  const wrapRef = React.useRef(null);
  const popRef = React.useRef(null);
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
    // left / right
    const onRight = placement === "right";
    left = onRight ? r.right + gap : r.left - w - gap;
    let tp = r.top + r.height / 2;
    top = Math.max(M, Math.min(tp - 40, vh - 80));
    arrow = { top: tp - top - 5.5, [onRight ? "left" : "right"]: -6 };
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

  const pop = open && pos ? (
    <div className="twc-popover" ref={popRef} data-flip={pos.flip || undefined} role="dialog"
      style={{ top: pos.top, bottom: pos.bottom, left: pos.left, width: pos.width }}>
      <span className="twc-popover__arrow" style={pos.arrow} aria-hidden="true" />
      <div className="twc-popover__inner">
        {title ? <div className="twc-popover__title">{title}</div> : null}
        {children}
      </div>
    </div>
  ) : null;

  return (
    <span className={`twc-popover-wrap ${className}`} ref={wrapRef} {...rest}>
      <span onClick={() => setOpen((o) => !o)}>{trigger}</span>
      {pop && RD && RD.createPortal ? RD.createPortal(pop, document.body) : pop}
    </span>
  );
}
