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
.twc-code[data-block="true"] {
  display: block; position: relative; white-space: pre; overflow-x: auto;
  padding: 12px 14px; padding-inline-end: 40px; line-height: 1.6; font-size: 0.8125em;
  overflow-wrap: normal; word-break: normal;
}
.twc-code__copy {
  position: absolute; top: 6px; inset-inline-end: 6px; display: inline-grid; place-items: center;
  width: 26px; height: 26px; border: none; border-radius: var(--radius-sm);
  background: var(--color-surface); color: var(--color-text-subtle); cursor: pointer;
  transition: color var(--duration-fast), background-color var(--duration-fast);
}
.twc-code__copy:hover { color: var(--color-text); }
.twc-code__copy:focus-visible { outline: none; box-shadow: var(--ring); }
.twc-code__copy svg { width: 15px; height: 15px; display: block; }
`;

// Block javascript:/data:/vbscript: URLs (incl. whitespace/control-char obfuscation
// that browsers strip) from reaching a DOM href. Consumer hrefs are a trust boundary.
function safeHref(url) {
  if (url == null) return undefined;
  const s = String(url).replace(/[\x00-\x20]+/g, "").toLowerCase();
  return s.startsWith("javascript:") || s.startsWith("data:") || s.startsWith("vbscript:") ? undefined : url;
}

/** Inline code, or a scrollable multi-line block with an optional copy button. */
export function Code({
  as,
  block = false,
  copyable = false,
  copyLabel = "Copy code",
  copiedLabel = "Copied",
  className = "",
  children,
  ...rest
}) {
  const __twcStyles = useScopedStyles("twc-code-styles", CODE_CSS);
  const Tag = as ?? (block ? "pre" : "code");
  if (Tag === "a" && rest.href != null) rest.href = safeHref(rest.href);

  // Self-contained copy affordance (components don't import hooks/): a self-resetting
  // `copied` flag, guarded for SSR/older browsers.
  const rootRef = React.useRef(null);
  const [copied, setCopied] = React.useState(false);
  const timerRef = React.useRef(null);
  React.useEffect(() => () => clearTimeout(timerRef.current), []);
  const doCopy = () => {
    if (typeof navigator === "undefined" || !navigator.clipboard) return;
    const text = typeof children === "string" ? children : rootRef.current?.textContent ?? "";
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCopied(false), 2000);
    }).catch(() => {});
  };

  return (
    <Tag ref={rootRef} className={`twc-code ${className}`.trim()} data-block={block || undefined} {...rest}>
      {__twcStyles}
      {copyable ? (
        <button type="button" className="twc-code__copy" aria-label={copied ? copiedLabel : copyLabel} onClick={doCopy}>
          {copied ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="m20 6-11 11-5-5"/></svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
          )}
        </button>
      ) : null}
      {children}
    </Tag>
  );
}
