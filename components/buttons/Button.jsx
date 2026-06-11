import React from "react";

const CSS = `
.twc-btn {
  --_h: var(--control-h-md);
  --_px: var(--space-4);
  --_fs: var(--text-sm);
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  height: var(--_h);
  padding-inline: var(--_px);
  font-family: var(--font-sans);
  font-size: var(--_fs);
  font-weight: var(--font-semibold);
  line-height: 1;
  letter-spacing: -0.01em;
  border: var(--border-thin) solid transparent;
  border-radius: var(--radius-md);
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
  overflow: hidden;
  text-decoration: none;
  transition: background-color var(--duration-fast) var(--ease-standard),
              border-color var(--duration-fast) var(--ease-standard),
              color var(--duration-fast) var(--ease-standard),
              box-shadow var(--duration-fast) var(--ease-standard),
              transform var(--duration-fast) var(--ease-spring);
}
.twc-btn:focus-visible { outline: none; box-shadow: var(--ring); }
.twc-btn:active:not(:disabled) { transform: scale(var(--press-scale)); }
.twc-btn:disabled { opacity: 0.5; cursor: not-allowed; }
/* Hide the label/icons under the centered spinner via visibility on the content
   span — variant rules set \`color\` later in this sheet, so a color-based hide
   would lose the specificity tie and leave the label showing through. */
.twc-btn[data-loading="true"] { cursor: progress; }
.twc-btn[data-loading="true"] .twc-btn__content { visibility: hidden; }
.twc-btn[data-block="true"] { width: 100%; }
.twc-btn__content { display: inline-flex; align-items: center; gap: var(--space-2); min-width: 0; }

.twc-btn[data-size="sm"] { --_h: var(--control-h-sm); --_px: var(--space-3); --_fs: var(--text-xs); }
.twc-btn[data-size="lg"] { --_h: var(--control-h-lg); --_px: var(--space-6); --_fs: var(--text-base); }

/* solid */
.twc-btn[data-variant="solid"] { background: var(--color-primary); color: var(--color-primary-fg); }
.twc-btn[data-variant="solid"]:hover:not(:disabled) { background: var(--color-primary-hover); box-shadow: var(--shadow-brand); }
.twc-btn[data-variant="solid"]:active:not(:disabled) { background: var(--color-primary-active); }
/* soft */
.twc-btn[data-variant="soft"] { background: var(--color-primary-subtle); color: var(--color-primary-subtle-fg); }
.twc-btn[data-variant="soft"]:hover:not(:disabled) { background: var(--color-primary-subtle); filter: brightness(0.97); }
.dark .twc-btn[data-variant="soft"]:hover:not(:disabled) { filter: brightness(1.25); }
/* outline */
.twc-btn[data-variant="outline"] { background: transparent; color: var(--color-text); border-color: var(--color-border-strong); }
.twc-btn[data-variant="outline"]:hover:not(:disabled) { background: var(--color-surface-sunken); border-color: var(--color-primary); color: var(--color-primary); }
/* ghost */
.twc-btn[data-variant="ghost"] { background: transparent; color: var(--color-text-muted); }
.twc-btn[data-variant="ghost"]:hover:not(:disabled) { background: var(--color-surface-sunken); color: var(--color-text); }
/* danger */
.twc-btn[data-variant="danger"] { background: var(--color-danger); color: var(--color-danger-fg); }
.twc-btn[data-variant="danger"]:hover:not(:disabled) { background: var(--color-danger-hover); }

.twc-btn__spinner {
  position: absolute; inset: 0; margin: auto;
  width: 1.1em; height: 1.1em;
  border: 2px solid currentColor; border-right-color: transparent;
  border-radius: var(--radius-full);
  color: var(--color-primary-fg);
  animation: twico-spin 0.6s linear infinite;
}
.twc-btn[data-variant="soft"] .twc-btn__spinner,
.twc-btn[data-variant="outline"] .twc-btn__spinner,
.twc-btn[data-variant="ghost"] .twc-btn__spinner { color: var(--color-primary); }

.twc-ripple {
  position: absolute; border-radius: var(--radius-full);
  background: currentColor; opacity: 0.3;
  transform: scale(0); pointer-events: none;
  animation: twico-ripple var(--duration-slow) var(--ease-out) forwards;
}
`;

// Block javascript:/data:/vbscript: URLs (incl. whitespace/control-char obfuscation
// that browsers strip) from reaching a DOM href. Consumer hrefs are a trust boundary.
function safeHref(url) {
  if (url == null) return undefined;
  const s = String(url).replace(/[\x00-\x20]+/g, "").toLowerCase();
  return s.startsWith("javascript:") || s.startsWith("data:") || s.startsWith("vbscript:") ? undefined : url;
}

function useInjectedStyle(id, css) {
  React.useInsertionEffect(() => {
    if (document.getElementById(id)) return;
    const el = document.createElement("style");
    el.id = id;
    el.textContent = css;
    document.head.appendChild(el);
  }, [id, css]);
}

export function Button({
  children,
  variant = "solid",
  size = "md",
  leftIcon,
  rightIcon,
  loading = false,
  fullWidth = false,
  disabled = false,
  as = "button",
  href,
  className = "",
  onClick,
  ...rest
}) {
  useInjectedStyle("twc-btn-styles", CSS);
  const [ripples, setRipples] = React.useState([]);
  const Tag = as;

  function handleClick(e) {
    if (disabled || loading) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const id = Date.now() + Math.random();
    setRipples((r) => [
      ...r,
      { id, size, x: e.clientX - rect.left - size / 2, y: e.clientY - rect.top - size / 2 },
    ]);
    setTimeout(() => setRipples((r) => r.filter((x) => x.id !== id)), 600);
    onClick?.(e);
  }

  return (
    <Tag
      className={`twc-btn ${className}`}
      data-variant={variant}
      data-size={size}
      data-loading={loading || undefined}
      data-block={fullWidth || undefined}
      disabled={Tag === "button" ? disabled || loading : undefined}
      href={safeHref(href)}
      aria-busy={loading || undefined}
      onClick={handleClick}
      {...rest}
    >
      <span className="twc-btn__content">
        {leftIcon ? <span className="twc-btn__icon" aria-hidden="true">{leftIcon}</span> : null}
        {children}
        {rightIcon ? <span className="twc-btn__icon" aria-hidden="true">{rightIcon}</span> : null}
      </span>
      {loading ? <span className="twc-btn__spinner" aria-hidden="true" /> : null}
      {ripples.map((r) => (
        <span
          key={r.id}
          className="twc-ripple"
          style={{ width: r.size, height: r.size, left: r.x, top: r.y }}
        />
      ))}
    </Tag>
  );
}
