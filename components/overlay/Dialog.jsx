import React from "react";
import { createPortal } from "react-dom";

const DIALOG_CSS = `
.twc-dialog__overlay {
  position: fixed; inset: 0; z-index: var(--z-modal);
  display: grid; place-items: center; padding: var(--space-4);
  background: var(--color-overlay); backdrop-filter: blur(3px);
}
.twc-dialog__overlay[data-state="open"] { animation: twico-fade-in var(--duration-base) var(--ease-out); }
.twc-dialog__overlay[data-state="closed"] { animation: twc-dialog-fade-out var(--duration-exit) var(--ease-in) forwards; pointer-events: none; }
.twc-dialog {
  position: relative; width: 100%; max-width: var(--_mw, 480px);
  max-height: calc(100vh - 48px); overflow: auto;
  background: var(--color-surface); color: var(--color-text);
  border: var(--border-thin) solid var(--color-border);
  border-radius: var(--radius-2xl); box-shadow: var(--shadow-xl);
  font-family: var(--font-sans);
}
.twc-dialog[data-state="open"] { animation: twico-pop-in var(--duration-base) var(--ease-spring); }
.twc-dialog[data-state="closed"] { animation: twc-dialog-pop-out var(--duration-exit) var(--ease-in) forwards; }
@keyframes twc-dialog-fade-out { from { opacity: 1; } to { opacity: 0; } }
@keyframes twc-dialog-pop-out { from { opacity: 1; transform: none; } to { opacity: 0; transform: translateY(8px) scale(0.985); } }
@media (prefers-reduced-motion: reduce) {
  .twc-dialog__overlay[data-state], .twc-dialog[data-state] { animation-duration: 1ms; }
}
.twc-dialog[data-size="sm"] { --_mw: 380px; }
.twc-dialog[data-size="lg"] { --_mw: 640px; }
/* Near-fullscreen: fill the overlay's padded area (overlay already pads --space-4 each side). */
.twc-dialog[data-size="full"] {
  --_mw: none;
  width: calc(100vw - var(--space-8));
  height: calc(100vh - var(--space-8));
  max-height: calc(100vh - var(--space-8));
  border-radius: var(--radius-2xl);
}
/* Scroll-body: header + footer stay fixed, only the body scrolls. */
.twc-dialog[data-scroll-body="true"] { display: flex; flex-direction: column; overflow: hidden; }
.twc-dialog[data-scroll-body="true"] .twc-dialog__header { flex: none; }
.twc-dialog[data-scroll-body="true"] .twc-dialog__body { flex: 1 1 auto; min-height: 0; overflow: auto; }
.twc-dialog[data-scroll-body="true"] .twc-dialog__footer { flex: none; }
.twc-dialog__header { display: flex; align-items: flex-start; gap: var(--space-3); padding: var(--space-5) var(--space-5) 0; }
.twc-dialog__titles { flex: 1; min-width: 0; }
.twc-dialog__title { font-size: var(--text-xl); font-weight: var(--font-bold); letter-spacing: -0.01em; }
.twc-dialog__desc { font-size: var(--text-sm); color: var(--color-text-muted); margin-top: 4px; line-height: var(--leading-snug); }
.twc-dialog__close {
  flex: none; display: inline-grid; place-items: center; width: 32px; height: 32px;
  border: none; background: transparent; color: var(--color-text-subtle); cursor: pointer;
  border-radius: var(--radius-md); transition: background-color var(--duration-fast), color var(--duration-fast);
}
.twc-dialog__close:hover { background: var(--color-surface-sunken); color: var(--color-text); }
.twc-dialog__close svg { width: 18px; height: 18px; }
.twc-dialog__body { padding: var(--space-4) var(--space-5); font-size: var(--text-sm); color: var(--color-text-muted); line-height: var(--leading-normal); }
.twc-dialog__footer { display: flex; gap: var(--space-2); justify-content: flex-end; padding: 0 var(--space-5) var(--space-5); }
`;

export function Dialog({
  open,
  onClose,
  title,
  description,
  footer,
  children,
  size = "md",
  scrollBody = false,
  closeOnBackdrop = true,
  className = "",
  ...rest
}) {
  const autoId = React.useId();
  const titleId = `${autoId}-title`;
  const descId = `${autoId}-desc`;
  const dialogRef = React.useRef(null);

  React.useInsertionEffect(() => {
    if (document.getElementById("twc-dialog-styles")) return;
    const el = document.createElement("style");
    el.id = "twc-dialog-styles";
    el.textContent = DIALOG_CSS;
    document.head.appendChild(el);
  }, []);

  // Stay mounted through the exit animation so closing is smooth, then unmount.
  const [mounted, setMounted] = React.useState(open);
  React.useEffect(() => {
    if (open) { setMounted(true); return; }
    const t = setTimeout(() => setMounted(false), 170);
    return () => clearTimeout(t);
  }, [open]);

  // Modal a11y (1/2): move focus into the dialog on open and restore it to the
  // previously-focused element on close. Keyed on `open` only, so an unstable
  // onClose identity can't clobber the saved trigger element.
  React.useEffect(() => {
    if (!open) return;
    const node = dialogRef.current;
    const prevFocused = document.activeElement;
    node?.focus();
    return () => {
      if (prevFocused && typeof prevFocused.focus === "function") prevFocused.focus();
    };
  }, [open]);

  // Modal a11y (2/2): Escape closes; Tab/Shift+Tab are trapped inside the dialog.
  React.useEffect(() => {
    if (!open) return;
    const node = dialogRef.current;
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

  if (!mounted) return null;
  const state = open ? "open" : "closed";

  const overlay = (
    <div className="twc-dialog__overlay" data-state={state} onMouseDown={(e) => { if (closeOnBackdrop && e.target === e.currentTarget) onClose?.(); }}>
      <div ref={dialogRef} className={`twc-dialog ${className}`} data-state={state} data-size={size} data-scroll-body={scrollBody ? "true" : undefined} role="dialog" aria-modal="true" tabIndex={-1} aria-labelledby={title ? titleId : undefined} aria-label={!title ? "Dialog" : undefined} aria-describedby={description ? descId : undefined} {...rest}>
        {(title || description || onClose) ? (
          <div className="twc-dialog__header">
            <div className="twc-dialog__titles">
              {title ? <div className="twc-dialog__title" id={titleId}>{title}</div> : null}
              {description ? <div className="twc-dialog__desc" id={descId}>{description}</div> : null}
            </div>
            {onClose ? (
              <button className="twc-dialog__close" onClick={onClose} aria-label="Close" type="button">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
              </button>
            ) : null}
          </div>
        ) : null}
        {children ? <div className="twc-dialog__body">{children}</div> : null}
        {footer ? <div className="twc-dialog__footer">{footer}</div> : null}
      </div>
    </div>
  );

  // Portal to <body> so the overlay escapes any transformed / backdrop-filtered
  // ancestor that would otherwise become its containing block. SSR renders null:
  // there is no document, and portal output is client-only anyway (no hydration mismatch).
  if (typeof document === "undefined") return null;
  const RD = typeof createPortal === "function" ? createPortal : null;
  return RD ? RD(overlay, document.body) : overlay;
}
