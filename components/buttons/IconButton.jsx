import React from "react";
import { useScopedStyles } from "../_styles.js";

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
/* xs: ~26px square — composed from space tokens (no global control-h-xs token). */
.twc-iconbtn[data-size="xs"] { --_sz: calc(var(--space-6) + var(--space-0-5)); }
.twc-iconbtn[data-size="sm"] { --_sz: var(--control-h-sm); }
.twc-iconbtn[data-size="lg"] { --_sz: var(--control-h-lg); }
.twc-iconbtn:focus-visible { outline: none; box-shadow: var(--ring); }
.twc-iconbtn:active:not(:disabled) { transform: scale(var(--press-scale)); }
.twc-iconbtn:disabled { opacity: 0.5; cursor: not-allowed; }
/* #342: disabled state for the anchor form (as="a") — :disabled doesn't apply to <a>. */
.twc-iconbtn[aria-disabled="true"] { opacity: 0.5; cursor: not-allowed; pointer-events: none; }
.twc-iconbtn svg { width: 1.25em; height: 1.25em; }

/* tone supplies the accent set; variant decides how it's applied — mirrors Button. Default tone
   primary; danger reuses its (active-less) hover for the pressed state. */
.twc-iconbtn { --_accent: var(--color-primary); --_accent-hover: var(--color-primary-hover);
  --_accent-fg: var(--color-primary-fg); --_accent-subtle: var(--color-primary-subtle); --_accent-subtle-fg: var(--color-primary-subtle-fg); }
.twc-iconbtn[data-tone="danger"] { --_accent: var(--color-danger); --_accent-hover: var(--color-danger-hover);
  --_accent-fg: var(--color-danger-fg); --_accent-subtle: var(--color-danger-subtle); --_accent-subtle-fg: var(--color-danger-subtle-fg); }
.twc-iconbtn[data-variant="solid"] { background: var(--_accent); color: var(--_accent-fg); }
.twc-iconbtn[data-variant="solid"]:hover:not(:disabled) { background: var(--_accent-hover); box-shadow: var(--shadow-brand); }
.twc-iconbtn[data-variant="solid"]:active:not(:disabled) { filter: brightness(0.92); }
.twc-iconbtn[data-variant="soft"] { background: var(--_accent-subtle); color: var(--_accent-subtle-fg); }
.twc-iconbtn[data-variant="soft"]:hover:not(:disabled) { background: var(--_accent-subtle); filter: brightness(0.97); }
.dark .twc-iconbtn[data-variant="soft"]:hover:not(:disabled) { filter: brightness(1.25); }
.twc-iconbtn[data-variant="outline"] { border-color: var(--color-border-strong); color: var(--color-text); }
.twc-iconbtn[data-variant="outline"]:hover:not(:disabled) { border-color: var(--_accent); color: var(--_accent); background: var(--color-surface-sunken); }
.twc-iconbtn[data-variant="ghost"]:hover:not(:disabled) { background: var(--color-surface-sunken); color: var(--_accent); }
`;

// #342: block javascript:/data:/vbscript: URLs (incl. whitespace/control-char obfuscation browsers strip)
// from reaching a DOM href. Consumer hrefs are a trust boundary. Mirrors Button/nav components.
function safeHref(url) {
  if (url == null) return undefined;
  const s = String(url).replace(/[\x00-\x20]+/g, "").toLowerCase();
  return s.startsWith("javascript:") || s.startsWith("data:") || s.startsWith("vbscript:") ? undefined : url;
}

export function IconButton({
  children,
  icon,
  variant = "ghost",
  tone = "primary",
  size = "md",
  round = false,
  disabled = false,
  as = "button",
  href,
  className = "",
  "aria-label": ariaLabel,
  ...rest
}) {
  const __twcStyles = useScopedStyles("twc-iconbtn-styles", ICONBTN_CSS);
  // #342: render as an anchor for an icon LINK (GitHub icon, external nav, …) — navigation should be a real
  // link, not a button. `target`/`rel` flow through `...rest`. An inert (disabled) anchor drops its href.
  const Tag = as;
  const inert = Tag === "a" && disabled;

  return (
    <Tag
      className={`twc-iconbtn ${className}`}
      data-variant={variant}
      data-tone={tone}
      data-size={size}
      data-round={round || undefined}
      disabled={Tag === "button" ? disabled : undefined}
      type={Tag === "button" ? "button" : undefined}
      href={Tag === "a" && !inert ? safeHref(href) : undefined}
      aria-disabled={inert || undefined}
      tabIndex={inert ? -1 : undefined}
      aria-label={ariaLabel}
      {...rest}
    >
      {__twcStyles}
      {icon || children}
    </Tag>
  );
}
