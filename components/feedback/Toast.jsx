import React from "react";

const TOAST_CSS = `
.twc-toast {
  position: relative; display: flex; gap: var(--space-3); align-items: flex-start;
  width: 360px; max-width: calc(100vw - 32px);
  padding: var(--space-3) var(--space-4);
  background: var(--color-surface-raised); color: var(--color-text);
  border: var(--border-thin) solid var(--color-border);
  border-radius: var(--radius-lg); box-shadow: var(--shadow-lg);
  font-family: var(--font-sans); overflow: hidden;
  animation: twc-toast-slide-in var(--duration-base) var(--ease-spring);
}
/* Slides in from the inline-end edge. LTR behaviour matches the previous translateX(24px); */
/* the [dir="rtl"] override flips the offset so RTL toasts enter from the left as expected. */
@keyframes twc-toast-slide-in {
  from { opacity: 0; transform: translateX(24px); }
  to   { opacity: 1; transform: translateX(0); }
}
[dir="rtl"] .twc-toast { animation-name: twc-toast-slide-in-rtl; }
@keyframes twc-toast-slide-in-rtl {
  from { opacity: 0; transform: translateX(-24px); }
  to   { opacity: 1; transform: translateX(0); }
}
.twc-toast::before { content: ""; position: absolute; inset-inline-start: 0; top: 0; bottom: 0; width: 4px; background: var(--_accent, var(--color-primary)); }
.twc-toast[data-tone="success"] { --_accent: var(--color-success); }
.twc-toast[data-tone="warning"] { --_accent: var(--color-warning); }
.twc-toast[data-tone="danger"]  { --_accent: var(--color-danger); }
.twc-toast[data-tone="info"]    { --_accent: var(--color-info); }
.twc-toast__icon { flex: none; margin-top: 1px; color: var(--_accent, var(--color-primary)); }
.twc-toast__icon svg { width: 20px; height: 20px; }
.twc-toast__body { flex: 1; min-width: 0; }
.twc-toast__title { font-weight: var(--font-bold); font-size: var(--text-sm); }
.twc-toast__desc { font-size: var(--text-sm); color: var(--color-text-muted); margin-top: 2px; line-height: var(--leading-snug); }
.twc-toast__close {
  flex: none; display: inline-grid; place-items: center; width: 24px; height: 24px;
  border: none; background: transparent; color: var(--color-text-subtle); cursor: pointer;
  border-radius: var(--radius-sm); transition: background-color var(--duration-fast), color var(--duration-fast);
}
.twc-toast__close:hover { background: var(--color-surface-sunken); color: var(--color-text); }
.twc-toast__close svg { width: 15px; height: 15px; }
.twc-toast-viewport {
  position: fixed; z-index: var(--z-toast); display: flex; flex-direction: column; gap: 12px;
  bottom: 20px; inset-inline-end: 20px;
}
`;

const TOAST_ICONS = {
  default: "M12 8v4m0 4h.01",
  success: "m9 12 2 2 4-4",
  warning: "M12 9v4M12 17h.01",
  danger: "M15 9l-6 6M9 9l6 6",
  info: "M12 16v-4M12 8h.01",
};

export function Toast({
  tone = "default",
  title,
  children,
  icon,
  onClose,
  duration = 4500,
  className = "",
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  ...rest
}) {
  // "neutral" is accepted as an alias for "default" (matches Badge's tone vocabulary).
  const resolvedTone = tone === "neutral" ? "default" : tone;
  React.useInsertionEffect(() => {
    if (document.getElementById("twc-toast-styles")) return;
    const el = document.createElement("style");
    el.id = "twc-toast-styles";
    el.textContent = TOAST_CSS;
    document.head.appendChild(el);
  }, []);

  // Auto-dismiss after `duration` ms (paused while hovered/focused). 0/Infinity keeps it open.
  // onClose is read through a ref so an inline handler doesn't reset the timer every render.
  const onCloseRef = React.useRef(onClose);
  React.useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);
  const timer = React.useRef();
  const stop = React.useCallback(() => clearTimeout(timer.current), []);
  const start = React.useCallback(() => {
    stop();
    if (duration && duration !== Infinity && onCloseRef.current) {
      timer.current = setTimeout(() => onCloseRef.current && onCloseRef.current(), duration);
    }
  }, [duration, stop]);
  React.useEffect(() => {
    start();
    return stop;
  }, [start, stop]);

  return (
    <div
      className={`twc-toast ${className}`}
      data-tone={resolvedTone}
      role="status"
      {...rest}
      onMouseEnter={(e) => { onMouseEnter?.(e); stop(); }}
      onMouseLeave={(e) => { onMouseLeave?.(e); start(); }}
      onFocus={(e) => { onFocus?.(e); stop(); }}
      onBlur={(e) => { onBlur?.(e); start(); }}
    >
      <span className="twc-toast__icon" aria-hidden="true">
        {icon || (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><path d={TOAST_ICONS[resolvedTone] || TOAST_ICONS.default} />
          </svg>
        )}
      </span>
      <div className="twc-toast__body">
        {title ? <div className="twc-toast__title">{title}</div> : null}
        {children ? <div className="twc-toast__desc">{children}</div> : null}
      </div>
      {onClose ? (
        <button className="twc-toast__close" onClick={onClose} aria-label="Dismiss" type="button">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>
      ) : null}
    </div>
  );
}

/** Fixed-position stack container for toasts. Pass `limit` to cap how many show at once. */
export function ToastViewport({ children, limit, className = "", ...rest }) {
  React.useInsertionEffect(() => {
    if (document.getElementById("twc-toast-styles")) return;
    const el = document.createElement("style");
    el.id = "twc-toast-styles";
    el.textContent = TOAST_CSS;
    document.head.appendChild(el);
  }, []);
  const shown = limit && limit > 0 ? React.Children.toArray(children).slice(-limit) : children;
  return <div className={`twc-toast-viewport ${className}`} {...rest}>{shown}</div>;
}
