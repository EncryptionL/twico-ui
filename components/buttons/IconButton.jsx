import React from "react";

const ICONBTN_CSS = `
.twc-iconbtn {
  --_sz: var(--control-h-md);
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--_sz);
  height: var(--_sz);
  padding: 0;
  border: var(--border-thin) solid transparent;
  border-radius: var(--radius-md);
  cursor: pointer;
  color: var(--color-text-muted);
  background: transparent;
  overflow: hidden;
  transition: background-color var(--duration-fast) var(--ease-standard),
              color var(--duration-fast) var(--ease-standard),
              border-color var(--duration-fast) var(--ease-standard),
              box-shadow var(--duration-fast) var(--ease-standard),
              transform var(--duration-fast) var(--ease-spring);
}
.twc-iconbtn[data-round="true"] { border-radius: var(--radius-full); }
.twc-iconbtn[data-size="sm"] { --_sz: var(--control-h-sm); }
.twc-iconbtn[data-size="lg"] { --_sz: var(--control-h-lg); }
.twc-iconbtn:focus-visible { outline: none; box-shadow: var(--ring); }
.twc-iconbtn:active:not(:disabled) { transform: scale(var(--press-scale)); }
.twc-iconbtn:disabled { opacity: 0.5; cursor: not-allowed; }
.twc-iconbtn svg { width: 1.25em; height: 1.25em; }

.twc-iconbtn[data-variant="solid"] { background: var(--color-primary); color: var(--color-primary-fg); }
.twc-iconbtn[data-variant="solid"]:hover:not(:disabled) { background: var(--color-primary-hover); box-shadow: var(--shadow-brand); }
.twc-iconbtn[data-variant="soft"] { background: var(--color-primary-subtle); color: var(--color-primary-subtle-fg); }
.twc-iconbtn[data-variant="outline"] { border-color: var(--color-border-strong); color: var(--color-text); }
.twc-iconbtn[data-variant="outline"]:hover:not(:disabled) { border-color: var(--color-primary); color: var(--color-primary); background: var(--color-surface-sunken); }
.twc-iconbtn[data-variant="ghost"]:hover:not(:disabled) { background: var(--color-surface-sunken); color: var(--color-text); }
`;

export function IconButton({
  children,
  icon,
  variant = "ghost",
  size = "md",
  round = false,
  disabled = false,
  className = "",
  "aria-label": ariaLabel,
  ...rest
}) {
  React.useEffect(() => {
    if (document.getElementById("twc-iconbtn-styles")) return;
    const el = document.createElement("style");
    el.id = "twc-iconbtn-styles";
    el.textContent = ICONBTN_CSS;
    document.head.appendChild(el);
  }, []);

  return (
    <button
      className={`twc-iconbtn ${className}`}
      data-variant={variant}
      data-size={size}
      data-round={round || undefined}
      disabled={disabled}
      aria-label={ariaLabel}
      {...rest}
    >
      {icon || children}
    </button>
  );
}
