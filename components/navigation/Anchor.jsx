import React from "react";
import { useScopedStyles } from "../_styles.js";

const ANCHOR_CSS = `
.twc-anchor { color: var(--color-primary); text-decoration: none; border-radius: var(--radius-sm);
  transition: color var(--duration-fast) var(--ease-standard); }
.twc-anchor:hover { text-decoration: underline; color: var(--color-primary-hover, var(--color-primary)); }
.twc-anchor:focus-visible { outline: none; box-shadow: var(--ring); }
.twc-anchor__ext { display: inline-block; margin-inline-start: 3px; font-size: 0.85em; vertical-align: baseline; }
`;

// Block javascript:/data:/vbscript: URLs from reaching a DOM href (trust boundary).
function safeHref(url) {
  if (url == null) return undefined;
  const s = String(url).replace(/[\x00-\x20]+/g, "").toLowerCase();
  return s.startsWith("javascript:") || s.startsWith("data:") || s.startsWith("vbscript:") ? undefined : url;
}

/** A styled, safe link. `external` opens a new, `noopener` tab; `as` can wrap a router Link. */
export const Anchor = React.forwardRef(function Anchor({ as: Tag = "a", href, external = false, className = "", children, ...rest }, ref) {
  const __twcStyles = useScopedStyles("twc-anchor-styles", ANCHOR_CSS);
  const extra = external ? { target: "_blank", rel: "noopener noreferrer" } : {};
  return (
    <Tag ref={ref} className={`twc-anchor ${className}`.trim()} href={Tag === "a" ? safeHref(href) : href} {...extra} {...rest}>
      {__twcStyles}
      {children}
      {external ? <span className="twc-anchor__ext" aria-hidden="true">↗</span> : null}
    </Tag>
  );
});
Anchor.displayName = "Anchor";
