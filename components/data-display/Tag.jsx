import React from "react";

const TAG_CSS = `
.twc-tag {
  display: inline-flex; align-items: center; gap: 6px;
  padding-block: 4px; padding-inline: 11px 6px; height: 28px;
  font-family: var(--font-sans); font-size: var(--text-xs); font-weight: var(--font-medium);
  border: var(--border-thin) solid transparent;
  border-radius: var(--radius-full); white-space: nowrap;
  transition: background-color var(--duration-fast) var(--ease-standard);
}
.twc-tag[data-no-remove="true"] { padding-inline-end: 11px; }

/* tone → accent set (default neutral; mirrors Badge's tone vocabulary). neutral's
   subtle-fg is full --color-text and its border is --color-border so the default
   soft+neutral tag reproduces the original bordered chip exactly. */
.twc-tag { --_accent: var(--color-text); --_accent-fg: var(--color-surface); --_accent-subtle: var(--color-surface-sunken); --_accent-subtle-fg: var(--color-text); --_accent-border: var(--color-border); }
.twc-tag[data-tone="primary"] { --_accent: var(--color-primary); --_accent-fg: var(--color-primary-fg); --_accent-subtle: var(--color-primary-subtle); --_accent-subtle-fg: var(--color-primary-subtle-fg); --_accent-border: var(--color-primary-border); }
.twc-tag[data-tone="success"] { --_accent: var(--color-success); --_accent-fg: var(--color-success-fg); --_accent-subtle: var(--color-success-subtle); --_accent-subtle-fg: var(--color-success-subtle-fg); --_accent-border: var(--color-success); }
.twc-tag[data-tone="warning"] { --_accent: var(--color-warning); --_accent-fg: var(--color-warning-fg); --_accent-subtle: var(--color-warning-subtle); --_accent-subtle-fg: var(--color-warning-subtle-fg); --_accent-border: var(--color-warning); }
.twc-tag[data-tone="danger"]  { --_accent: var(--color-danger); --_accent-fg: var(--color-danger-fg); --_accent-subtle: var(--color-danger-subtle); --_accent-subtle-fg: var(--color-danger-subtle-fg); --_accent-border: var(--color-danger); }
.twc-tag[data-tone="info"]    { --_accent: var(--color-info); --_accent-fg: var(--color-info-fg); --_accent-subtle: var(--color-info-subtle); --_accent-subtle-fg: var(--color-info-subtle-fg); --_accent-border: var(--color-info); }

.twc-tag[data-variant="soft"]    { background: var(--_accent-subtle); color: var(--_accent-subtle-fg); border-color: var(--_accent-border); }
.twc-tag[data-variant="solid"]   { background: var(--_accent); color: var(--_accent-fg); border-color: transparent; }
.twc-tag[data-variant="outline"] { background: transparent; color: var(--_accent-subtle-fg); border-color: var(--_accent-border); }
.twc-tag__remove {
  display: inline-grid; place-items: center;
  width: 18px; height: 18px; border: none; padding: 0; margin: 0;
  border-radius: var(--radius-full); background: transparent;
  color: var(--color-text-subtle); cursor: pointer;
  transition: background-color var(--duration-fast) var(--ease-standard), color var(--duration-fast) var(--ease-standard), transform var(--duration-fast) var(--ease-spring);
}
/* Intentionally danger-tinted regardless of tone: this signals the destructive REMOVE
   action, not the tag's color (matches the per-item destructive-affordance convention). */
.twc-tag__remove:hover { background: var(--color-danger-subtle); color: var(--color-danger-subtle-fg); }
.twc-tag__remove:active { transform: scale(0.85); }
.twc-tag__remove svg { width: 13px; height: 13px; }
`;

export function Tag({
  children,
  onRemove,
  leftIcon,
  tone = "neutral",
  variant = "soft",
  className = "",
  ...rest
}) {
  React.useInsertionEffect(() => {
    if (document.getElementById("twc-tag-styles")) return;
    const el = document.createElement("style");
    el.id = "twc-tag-styles";
    el.textContent = TAG_CSS;
    document.head.appendChild(el);
  }, []);

  return (
    <span className={`twc-tag ${className}`} data-tone={tone} data-variant={variant} data-no-remove={!onRemove || undefined} {...rest}>
      {leftIcon}
      {children}
      {onRemove ? (
        <button className="twc-tag__remove" onClick={(e) => { e.stopPropagation(); onRemove(e); }} aria-label="Remove" type="button">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>
      ) : null}
    </span>
  );
}
