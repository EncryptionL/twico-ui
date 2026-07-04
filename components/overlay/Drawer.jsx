import React from "react";
import { useScopedStyles } from "../_styles.js";
import { useFocusTrap, usePortal, useScrollLock, useInertBackground } from "../_overlay.js";

const DRAWER_CSS = `
.twc-drawer__overlay { position: fixed; inset: 0; z-index: var(--z-modal); background: var(--color-overlay); backdrop-filter: blur(2px); }
.twc-drawer__overlay[data-state="open"] { animation: twico-fade-in var(--duration-base) var(--ease-out); }
.twc-drawer__overlay[data-state="closed"] { animation: twc-drawer-fade-out var(--duration-exit) var(--ease-in) forwards; pointer-events: none; }
@keyframes twc-drawer-fade-out { from { opacity: 1; } to { opacity: 0; } }
.twc-drawer {
  position: fixed; z-index: var(--z-modal); background: var(--color-surface); color: var(--color-text);
  display: flex; flex-direction: column; box-shadow: var(--shadow-xl); font-family: var(--font-sans);
}
.twc-drawer[data-side="right"] { top: 0; right: 0; height: 100%; width: var(--_w, 380px); max-width: 92vw; border-left: var(--border-thin) solid var(--color-border); border-top-left-radius: var(--radius-2xl); border-bottom-left-radius: var(--radius-2xl); }
.twc-drawer[data-side="left"] { top: 0; left: 0; height: 100%; width: var(--_w, 380px); max-width: 92vw; border-right: var(--border-thin) solid var(--color-border); border-top-right-radius: var(--radius-2xl); border-bottom-right-radius: var(--radius-2xl); }
.twc-drawer[data-side="bottom"] { left: 0; right: 0; bottom: 0; width: 100%; max-height: 88vh; height: var(--_h, auto); border-top: var(--border-thin) solid var(--color-border); border-top-left-radius: var(--radius-2xl); border-top-right-radius: var(--radius-2xl); }
.twc-drawer[data-side="top"] { left: 0; right: 0; top: 0; width: 100%; max-height: 88vh; height: var(--_h, auto); border-bottom: var(--border-thin) solid var(--color-border); border-bottom-left-radius: var(--radius-2xl); border-bottom-right-radius: var(--radius-2xl); }
/* Logical sides — mirror under dir="rtl". --_off carries the off-screen slide direction. */
.twc-drawer[data-side="end"]   { top: 0; height: 100%; inset-inline-end: 0; width: var(--_w, 380px); max-width: 92vw; border-inline-start: var(--border-thin) solid var(--color-border); border-start-start-radius: var(--radius-2xl); border-end-start-radius: var(--radius-2xl); --_off: 100%; }
.twc-drawer[data-side="start"] { top: 0; height: 100%; inset-inline-start: 0; width: var(--_w, 380px); max-width: 92vw; border-inline-end: var(--border-thin) solid var(--color-border); border-start-end-radius: var(--radius-2xl); border-end-end-radius: var(--radius-2xl); --_off: -100%; }
[dir="rtl"] .twc-drawer[data-side="end"]   { --_off: -100%; }
[dir="rtl"] .twc-drawer[data-side="start"] { --_off: 100%; }
.twc-drawer[data-side="right"][data-state="open"] { animation: twc-drawer-r var(--duration-base) var(--ease-out); }
.twc-drawer[data-side="left"][data-state="open"] { animation: twc-drawer-l var(--duration-base) var(--ease-out); }
.twc-drawer[data-side="bottom"][data-state="open"] { animation: twc-drawer-b var(--duration-base) var(--ease-out); }
.twc-drawer[data-side="top"][data-state="open"] { animation: twc-drawer-t var(--duration-base) var(--ease-out); }
.twc-drawer[data-side="right"][data-state="closed"] { animation: twc-drawer-r-out var(--duration-exit) var(--ease-in) forwards; }
.twc-drawer[data-side="left"][data-state="closed"] { animation: twc-drawer-l-out var(--duration-exit) var(--ease-in) forwards; }
.twc-drawer[data-side="bottom"][data-state="closed"] { animation: twc-drawer-b-out var(--duration-exit) var(--ease-in) forwards; }
.twc-drawer[data-side="top"][data-state="closed"] { animation: twc-drawer-t-out var(--duration-exit) var(--ease-in) forwards; }
@keyframes twc-drawer-r { from { transform: translateX(100%); } to { transform: translateX(0); } }
@keyframes twc-drawer-l { from { transform: translateX(-100%); } to { transform: translateX(0); } }
@keyframes twc-drawer-b { from { transform: translateY(100%); } to { transform: translateY(0); } }
@keyframes twc-drawer-t { from { transform: translateY(-100%); } to { transform: translateY(0); } }
@keyframes twc-drawer-r-out { from { transform: translateX(0); } to { transform: translateX(100%); } }
@keyframes twc-drawer-l-out { from { transform: translateX(0); } to { transform: translateX(-100%); } }
@keyframes twc-drawer-b-out { from { transform: translateY(0); } to { transform: translateY(100%); } }
@keyframes twc-drawer-t-out { from { transform: translateY(0); } to { transform: translateY(-100%); } }
.twc-drawer[data-side="start"][data-state="open"], .twc-drawer[data-side="end"][data-state="open"] { animation: twc-drawer-in-x var(--duration-base) var(--ease-out); }
.twc-drawer[data-side="start"][data-state="closed"], .twc-drawer[data-side="end"][data-state="closed"] { animation: twc-drawer-out-x var(--duration-exit) var(--ease-in) forwards; }
@keyframes twc-drawer-in-x { from { transform: translateX(var(--_off)); } to { transform: translateX(0); } }
@keyframes twc-drawer-out-x { from { transform: translateX(0); } to { transform: translateX(var(--_off)); } }
.twc-drawer__header { display: flex; align-items: flex-start; gap: var(--space-3); padding: var(--space-5) var(--space-5) var(--space-3); }
.twc-drawer__titles { flex: 1; min-width: 0; }
.twc-drawer__title { font-size: var(--text-xl); font-weight: var(--font-bold); letter-spacing: -0.01em; }
.twc-drawer__desc { font-size: var(--text-sm); color: var(--color-text-muted); margin-top: 4px; }
.twc-drawer__close { flex: none; display: inline-grid; place-items: center; width: 32px; height: 32px; border: none; background: transparent; color: var(--color-text-subtle); cursor: pointer; border-radius: var(--radius-md); transition: background-color var(--duration-fast), color var(--duration-fast); }
.twc-drawer__close:hover { background: var(--color-surface-sunken); color: var(--color-text); }
.twc-drawer__close svg { width: 18px; height: 18px; }
.twc-drawer__body { flex: 1; overflow-y: auto; padding: var(--space-2) var(--space-5) var(--space-5); font-size: var(--text-sm); color: var(--color-text-muted); line-height: var(--leading-normal); }
.twc-drawer__footer { display: flex; gap: var(--space-2); justify-content: flex-end; padding: var(--space-4) var(--space-5); border-top: var(--border-thin) solid var(--color-divider); }
@media (prefers-reduced-motion: reduce) {
  .twc-drawer__overlay[data-state], .twc-drawer[data-state] { animation-duration: 1ms; }
}
`;

// Preset sizes ("md" matches the CSS fallback width); numbers are px, other strings pass through.
const DRAWER_SIZES = { sm: "320px", md: "380px", lg: "480px" };

export function Drawer({
  open,
  onClose,
  side = "right",
  title,
  description,
  footer,
  width,
  height,
  closeOnBackdrop = true,
  children,
  className = "",
  style,
  ...rest
}) {
  const autoId = React.useId();
  const titleId = `${autoId}-title`;
  const descId = `${autoId}-desc`;
  const panelRef = React.useRef(null);

  const __twcStyles = useScopedStyles("twc-drawer-styles", DRAWER_CSS);
  const renderPortal = usePortal();

  // Stay mounted through the slide-out animation so closing is smooth, then unmount.
  const [mounted, setMounted] = React.useState(open);
  React.useEffect(() => {
    if (open) { setMounted(true); return; }
    const t = setTimeout(() => setMounted(false), 170);
    return () => clearTimeout(t);
  }, [open]);

  // Lock body scroll (shared refcounted lock, #116) and mark the background inert (#115).
  useScrollLock(open);
  useInertBackground(panelRef, open && mounted);

  // Modal a11y (1/2): move focus into the drawer on open, trap Tab/Shift+Tab inside
  // it, and restore focus to the trigger on close. Gate on `mounted` too — the panel
  // renders one render after `open` flips, so panelRef only exists once mounted.
  useFocusTrap(panelRef, open && mounted);

  // Modal a11y (2/2): Escape closes. Kept here (not in useFocusTrap) because closing
  // is component-specific; the trap owns only Tab/Shift+Tab.
  React.useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") { e.preventDefault(); onClose?.(); }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!mounted) return null;
  const state = open ? "open" : "closed";
  const isHorizontal = side === "left" || side === "right" || side === "start" || side === "end";
  // The panel's cross-axis size is `width` for left/right, `height` for top/bottom — only the one
  // matching the side applies. Each accepts a preset ("sm"/"md"/"lg"), a number (px), or a CSS length.
  const raw = isHorizontal ? width : height;
  const dim = DRAWER_SIZES[raw] || (typeof raw === "number" ? `${raw}px` : raw);
  const sizeVar = isHorizontal ? { "--_w": dim } : { "--_h": dim };

  const overlay = (
    <div className="twc-drawer__overlay" data-state={state} onMouseDown={(e) => { if (closeOnBackdrop && e.target === e.currentTarget) onClose?.(); }}>
      {__twcStyles}
      <div ref={panelRef} className={`twc-drawer ${className}`} data-side={side} data-state={state} role="dialog" aria-modal="true" tabIndex={-1} aria-labelledby={title ? titleId : undefined} aria-label={!title ? "Drawer" : undefined} aria-describedby={description ? descId : undefined} style={{ ...(dim ? sizeVar : null), ...style }} {...rest}>
        {(title || description || onClose) ? (
          <div className="twc-drawer__header">
            <div className="twc-drawer__titles">
              {title ? <div className="twc-drawer__title" id={titleId}>{title}</div> : null}
              {description ? <div className="twc-drawer__desc" id={descId}>{description}</div> : null}
            </div>
            {onClose ? (
              <button className="twc-drawer__close" onClick={onClose} aria-label="Close" type="button">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
              </button>
            ) : null}
          </div>
        ) : null}
        <div className="twc-drawer__body">{children}</div>
        {footer ? <div className="twc-drawer__footer">{footer}</div> : null}
      </div>
    </div>
  );

  // Portal to <body> so the overlay escapes any transformed / backdrop-filtered
  // ancestor that would otherwise become its containing block. usePortal renders
  // null on the server (no document); portal output is client-only (no hydration mismatch).
  return renderPortal(overlay);
}
