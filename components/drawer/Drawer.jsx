import React from "react";

const DRAWER_CSS = `
.twc-drawer__overlay { position: fixed; inset: 0; z-index: var(--z-modal); background: var(--color-overlay); backdrop-filter: blur(2px); animation: twico-fade-in var(--duration-base) var(--ease-out); }
.twc-drawer {
  position: fixed; z-index: var(--z-modal); background: var(--color-surface); color: var(--color-text);
  display: flex; flex-direction: column; box-shadow: var(--shadow-xl); font-family: var(--font-sans);
}
.twc-drawer[data-side="right"] { top: 0; right: 0; height: 100%; width: var(--_w, 380px); max-width: 92vw; border-left: var(--border-thin) solid var(--color-border); border-top-left-radius: var(--radius-2xl); border-bottom-left-radius: var(--radius-2xl); animation: twc-drawer-r var(--duration-base) var(--ease-out); }
.twc-drawer[data-side="left"] { top: 0; left: 0; height: 100%; width: var(--_w, 380px); max-width: 92vw; border-right: var(--border-thin) solid var(--color-border); border-top-right-radius: var(--radius-2xl); border-bottom-right-radius: var(--radius-2xl); animation: twc-drawer-l var(--duration-base) var(--ease-out); }
.twc-drawer[data-side="bottom"] { left: 0; right: 0; bottom: 0; width: 100%; max-height: 88vh; height: var(--_h, auto); border-top: var(--border-thin) solid var(--color-border); border-top-left-radius: var(--radius-2xl); border-top-right-radius: var(--radius-2xl); animation: twc-drawer-b var(--duration-base) var(--ease-out); }
.twc-drawer[data-side="top"] { left: 0; right: 0; top: 0; width: 100%; max-height: 88vh; height: var(--_h, auto); border-bottom: var(--border-thin) solid var(--color-border); border-bottom-left-radius: var(--radius-2xl); border-bottom-right-radius: var(--radius-2xl); animation: twc-drawer-t var(--duration-base) var(--ease-out); }
@keyframes twc-drawer-r { from { transform: translateX(100%); } to { transform: translateX(0); } }
@keyframes twc-drawer-l { from { transform: translateX(-100%); } to { transform: translateX(0); } }
@keyframes twc-drawer-b { from { transform: translateY(100%); } to { transform: translateY(0); } }
@keyframes twc-drawer-t { from { transform: translateY(-100%); } to { transform: translateY(0); } }
.twc-drawer__header { display: flex; align-items: flex-start; gap: var(--space-3); padding: var(--space-5) var(--space-5) var(--space-3); }
.twc-drawer__titles { flex: 1; min-width: 0; }
.twc-drawer__title { font-size: var(--text-xl); font-weight: var(--font-bold); letter-spacing: -0.01em; }
.twc-drawer__desc { font-size: var(--text-sm); color: var(--color-text-muted); margin-top: 4px; }
.twc-drawer__close { flex: none; display: inline-grid; place-items: center; width: 32px; height: 32px; border: none; background: transparent; color: var(--color-text-subtle); cursor: pointer; border-radius: var(--radius-md); transition: background-color var(--duration-fast), color var(--duration-fast); }
.twc-drawer__close:hover { background: var(--color-surface-sunken); color: var(--color-text); }
.twc-drawer__close svg { width: 18px; height: 18px; }
.twc-drawer__body { flex: 1; overflow-y: auto; padding: var(--space-2) var(--space-5) var(--space-5); font-size: var(--text-sm); color: var(--color-text-muted); line-height: var(--leading-normal); }
.twc-drawer__footer { display: flex; gap: var(--space-2); justify-content: flex-end; padding: var(--space-4) var(--space-5); border-top: var(--border-thin) solid var(--color-divider); }
`;

export function Drawer({
  open,
  onClose,
  side = "right",
  title,
  description,
  footer,
  size,
  closeOnBackdrop = true,
  children,
  className = "",
  ...rest
}) {
  const autoId = React.useId();
  const titleId = `${autoId}-title`;
  const descId = `${autoId}-desc`;
  const panelRef = React.useRef(null);

  React.useEffect(() => {
    if (document.getElementById("twc-drawer-styles")) return;
    const el = document.createElement("style");
    el.id = "twc-drawer-styles";
    el.textContent = DRAWER_CSS;
    document.head.appendChild(el);
  }, []);

  // Modal a11y (1/2): move focus into the drawer on open and restore it to the
  // previously-focused element on close. Keyed on `open` only, so an unstable
  // onClose identity can't clobber the saved trigger element.
  React.useEffect(() => {
    if (!open) return;
    const node = panelRef.current;
    const prevFocused = document.activeElement;
    node?.focus();
    return () => {
      if (prevFocused && typeof prevFocused.focus === "function") prevFocused.focus();
    };
  }, [open]);

  // Modal a11y (2/2): Escape closes; Tab/Shift+Tab are trapped inside the drawer.
  React.useEffect(() => {
    if (!open) return;
    const node = panelRef.current;
    const focusables = () =>
      node
        ? Array.from(
            node.querySelectorAll(
              'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
            )
          ).filter((el) => el.offsetParent !== null)
        : [];
    const onKey = (e) => {
      if (e.key === "Escape") { e.preventDefault(); onClose?.(); return; }
      if (e.key !== "Tab") return;
      const f = focusables();
      if (!f.length) { e.preventDefault(); node?.focus(); return; }
      const first = f[0], last = f[f.length - 1], ae = document.activeElement;
      if (e.shiftKey) {
        if (ae === first || ae === node || !node.contains(ae)) { e.preventDefault(); last.focus(); }
      } else if (ae === last || !node.contains(ae)) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  const sizeVar = side === "left" || side === "right" ? { "--_w": typeof size === "number" ? `${size}px` : size } : { "--_h": typeof size === "number" ? `${size}px` : size };

  return (
    <div className="twc-drawer__overlay" onMouseDown={(e) => { if (closeOnBackdrop && e.target === e.currentTarget) onClose?.(); }}>
      <div ref={panelRef} className={`twc-drawer ${className}`} data-side={side} role="dialog" aria-modal="true" tabIndex={-1} aria-labelledby={title ? titleId : undefined} aria-describedby={description ? descId : undefined} style={size ? sizeVar : undefined} {...rest}>
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
}
