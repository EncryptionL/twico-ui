import React from "react";

const DIALOG_CSS = `
.twc-dialog__overlay {
  position: fixed; inset: 0; z-index: var(--z-modal);
  display: grid; place-items: center; padding: var(--space-4);
  background: var(--color-overlay); backdrop-filter: blur(3px);
  animation: twico-fade-in var(--duration-base) var(--ease-out);
}
.twc-dialog {
  position: relative; width: 100%; max-width: var(--_mw, 480px);
  max-height: calc(100vh - 48px); overflow: auto;
  background: var(--color-surface); color: var(--color-text);
  border: var(--border-thin) solid var(--color-border);
  border-radius: var(--radius-2xl); box-shadow: var(--shadow-xl);
  font-family: var(--font-sans);
  animation: twico-pop-in var(--duration-base) var(--ease-spring);
}
.twc-dialog[data-size="sm"] { --_mw: 380px; }
.twc-dialog[data-size="lg"] { --_mw: 640px; }
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

  if (!open) return null;

  return (
    <div className="twc-dialog__overlay" onMouseDown={(e) => { if (closeOnBackdrop && e.target === e.currentTarget) onClose?.(); }}>
      <div ref={dialogRef} className={`twc-dialog ${className}`} data-size={size} role="dialog" aria-modal="true" tabIndex={-1} aria-labelledby={title ? titleId : undefined} aria-describedby={description ? descId : undefined} {...rest}>
        {(title || description) ? (
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
}
