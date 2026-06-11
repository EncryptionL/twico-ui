import React from "react";

const BADGE_CSS = `
.twc-badge {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 2px 9px; height: 22px;
  font-family: var(--font-sans); font-size: var(--text-xs); font-weight: var(--font-semibold);
  line-height: 1; letter-spacing: 0.01em; border-radius: var(--radius-full);
  border: var(--border-thin) solid transparent; white-space: nowrap;
}
.twc-badge[data-size="lg"] { height: 26px; font-size: var(--text-sm); padding: 3px 12px; }
.twc-badge__dot { width: 6px; height: 6px; border-radius: var(--radius-full); background: currentColor; }

/* soft (default) */
.twc-badge[data-variant="soft"][data-tone="primary"] { background: var(--color-primary-subtle); color: var(--color-primary-subtle-fg); }
.twc-badge[data-variant="soft"][data-tone="success"] { background: var(--color-success-subtle); color: var(--color-success-subtle-fg); }
.twc-badge[data-variant="soft"][data-tone="warning"] { background: var(--color-warning-subtle); color: var(--color-warning-subtle-fg); }
.twc-badge[data-variant="soft"][data-tone="danger"]  { background: var(--color-danger-subtle); color: var(--color-danger-subtle-fg); }
.twc-badge[data-variant="soft"][data-tone="info"]    { background: var(--color-info-subtle); color: var(--color-info-subtle-fg); }
.twc-badge[data-variant="soft"][data-tone="neutral"] { background: var(--color-surface-sunken); color: var(--color-text-muted); }

/* solid */
.twc-badge[data-variant="solid"][data-tone="primary"] { background: var(--color-primary); color: var(--color-primary-fg); }
.twc-badge[data-variant="solid"][data-tone="success"] { background: var(--color-success); color: var(--color-success-fg); }
.twc-badge[data-variant="solid"][data-tone="warning"] { background: var(--color-warning); color: var(--color-warning-fg); }
.twc-badge[data-variant="solid"][data-tone="danger"]  { background: var(--color-danger); color: var(--color-danger-fg); }
.twc-badge[data-variant="solid"][data-tone="info"]    { background: var(--color-info); color: var(--color-info-fg); }
.twc-badge[data-variant="solid"][data-tone="neutral"] { background: var(--color-text); color: var(--color-surface); }

/* outline */
.twc-badge[data-variant="outline"] { background: transparent; }
.twc-badge[data-variant="outline"][data-tone="primary"] { color: var(--color-primary); border-color: var(--color-primary-border); }
.twc-badge[data-variant="outline"][data-tone="success"] { color: var(--color-success-subtle-fg); border-color: var(--color-success); }
.twc-badge[data-variant="outline"][data-tone="warning"] { color: var(--color-warning-subtle-fg); border-color: var(--color-warning); }
.twc-badge[data-variant="outline"][data-tone="danger"]  { color: var(--color-danger-subtle-fg); border-color: var(--color-danger); }
.twc-badge[data-variant="outline"][data-tone="info"]    { color: var(--color-info-subtle-fg); border-color: var(--color-info); }
.twc-badge[data-variant="outline"][data-tone="neutral"] { color: var(--color-text-muted); border-color: var(--color-border-strong); }
`;

export function Badge({
  children,
  tone = "primary",
  variant = "soft",
  size = "md",
  dot = false,
  className = "",
  ...rest
}) {
  React.useInsertionEffect(() => {
    if (document.getElementById("twc-badge-styles")) return;
    const el = document.createElement("style");
    el.id = "twc-badge-styles";
    el.textContent = BADGE_CSS;
    document.head.appendChild(el);
  }, []);

  return (
    <span className={`twc-badge ${className}`} data-tone={tone} data-variant={variant} data-size={size} {...rest}>
      {dot ? <span className="twc-badge__dot" /> : null}
      {children}
    </span>
  );
}
