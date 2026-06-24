import React from "react";
import { useScopedStyles } from "../_styles.js";

const ALERT_CSS = `
.twc-alert {
  display: flex; gap: var(--space-3); align-items: flex-start;
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-lg); font-family: var(--font-sans);
  border: var(--border-thin) solid transparent;
  animation: twico-slide-down var(--duration-base) var(--ease-out);
}
/* tone → accent set (default info). Mirrors Button's --_accent model + Badge's tones. */
.twc-alert { --_accent: var(--color-info); --_accent-fg: var(--color-info-fg); --_accent-subtle: var(--color-info-subtle); --_accent-subtle-fg: var(--color-info-subtle-fg); }
.twc-alert[data-tone="success"] { --_accent: var(--color-success); --_accent-fg: var(--color-success-fg); --_accent-subtle: var(--color-success-subtle); --_accent-subtle-fg: var(--color-success-subtle-fg); }
.twc-alert[data-tone="warning"] { --_accent: var(--color-warning); --_accent-fg: var(--color-warning-fg); --_accent-subtle: var(--color-warning-subtle); --_accent-subtle-fg: var(--color-warning-subtle-fg); }
.twc-alert[data-tone="danger"]  { --_accent: var(--color-danger); --_accent-fg: var(--color-danger-fg); --_accent-subtle: var(--color-danger-subtle); --_accent-subtle-fg: var(--color-danger-subtle-fg); }
.twc-alert[data-tone="primary"] { --_accent: var(--color-primary); --_accent-fg: var(--color-primary-fg); --_accent-subtle: var(--color-primary-subtle); --_accent-subtle-fg: var(--color-primary-subtle-fg); }
.twc-alert[data-tone="neutral"] { --_accent: var(--color-text); --_accent-fg: var(--color-surface); --_accent-subtle: var(--color-surface-sunken); --_accent-subtle-fg: var(--color-text); }

/* variant = fill (soft default reproduces the original tinted alert) */
.twc-alert[data-variant="soft"]    { background: var(--_accent-subtle); color: var(--_accent-subtle-fg); border-color: color-mix(in srgb, var(--_accent) 30%, transparent); }
.twc-alert[data-variant="solid"]   { background: var(--_accent); color: var(--_accent-fg); border-color: transparent; }
.twc-alert[data-variant="outline"] { background: transparent; color: var(--_accent-subtle-fg); border-color: var(--_accent); }
.twc-alert[data-variant="solid"] .twc-alert__desc { color: var(--_accent-fg); opacity: 0.92; }

.twc-alert__icon { flex: none; margin-top: 1px; }
.twc-alert__icon svg { width: 20px; height: 20px; }
.twc-alert__body { flex: 1; min-width: 0; }
.twc-alert__title { font-weight: var(--font-bold); font-size: var(--text-sm); margin-bottom: 2px; }
.twc-alert__desc { font-size: var(--text-sm); color: var(--color-text-muted); line-height: var(--leading-snug); }
.twc-alert__close {
  flex: none; display: inline-grid; place-items: center; width: 24px; height: 24px;
  border: none; background: transparent; color: currentColor; opacity: 0.6; cursor: pointer;
  border-radius: var(--radius-sm); transition: opacity var(--duration-fast), background-color var(--duration-fast);
}
.twc-alert__close:hover { opacity: 1; background: color-mix(in srgb, currentColor 12%, transparent); }
.twc-alert__close svg { width: 15px; height: 15px; }
`;

const ICONS = {
  info: "M12 16v-4M12 8h.01",
  success: "m9 12 2 2 4-4",
  warning: "M12 9v4M12 17h.01",
  danger: "M15 9l-6 6M9 9l6 6",
  primary: "M12 16v-4M12 8h.01",
  neutral: "M12 16v-4M12 8h.01",
};

export function Alert({
  children,
  tone = "info",
  variant = "soft",
  title,
  icon,
  onClose,
  className = "",
  ...rest
}) {
  const __twcStyles = useScopedStyles("twc-alert-styles", ALERT_CSS);

  return (
    <div className={`twc-alert ${className}`} data-tone={tone} data-variant={variant} role="alert" {...rest}>
      {__twcStyles}
      <span className="twc-alert__icon" aria-hidden="true">
        {icon || (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d={ICONS[tone]} />
          </svg>
        )}
      </span>
      <div className="twc-alert__body">
        {title ? <div className="twc-alert__title">{title}</div> : null}
        {children ? <div className="twc-alert__desc">{children}</div> : null}
      </div>
      {onClose ? (
        <button className="twc-alert__close" onClick={onClose} aria-label="Dismiss" type="button">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>
      ) : null}
    </div>
  );
}
