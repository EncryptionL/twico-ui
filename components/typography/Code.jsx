import React from "react";
import { useScopedStyles } from "../_styles.js";

const CODE_CSS = `
.twc-code {
  font-family: var(--font-mono); font-size: 0.875em;
  background: var(--color-surface-sunken); color: var(--color-text);
  padding: 1px 6px; border-radius: var(--radius-sm);
  border: var(--border-thin) solid var(--color-border);
  white-space: normal; overflow-wrap: anywhere; word-break: break-word;
}
`;

// Block javascript:/data:/vbscript: URLs (incl. whitespace/control-char obfuscation
// that browsers strip) from reaching a DOM href. Consumer hrefs are a trust boundary.
function safeHref(url) {
  if (url == null) return undefined;
  const s = String(url).replace(/[\x00-\x20]+/g, "").toLowerCase();
  return s.startsWith("javascript:") || s.startsWith("data:") || s.startsWith("vbscript:") ? undefined : url;
}

/** Inline code with mono font and a subtle token-styled surface. */
export function Code({ as: Tag = "code", className = "", children, ...rest }) {
  const __twcStyles = useScopedStyles("twc-code-styles", CODE_CSS);
  if (Tag === "a" && rest.href != null) rest.href = safeHref(rest.href);
  return (
    <Tag className={`twc-code ${className}`.trim()} {...rest}>
      {__twcStyles}
      {children}
    </Tag>
  );
}
