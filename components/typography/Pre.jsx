import React from "react";
import { useScopedStyles } from "../_styles.js";

const PRE_CSS = `
.twc-pre { margin: 0; padding: var(--space-4); overflow-x: auto; max-width: 100%;
  font-family: var(--font-mono); font-size: var(--text-sm); line-height: var(--leading-normal);
  color: var(--color-text); background: var(--color-surface-sunken);
  border: var(--border-thin) solid var(--color-border); border-radius: var(--radius-lg);
  white-space: pre; -webkit-overflow-scrolling: touch; }
`;

/** A scrollable, token-styled monospace block for preformatted text. */
export const Pre = React.forwardRef(function Pre({ className = "", children, ...rest }, ref) {
  const __twcStyles = useScopedStyles("twc-pre-styles", PRE_CSS);
  return (
    <pre ref={ref} className={`twc-pre ${className}`.trim()} {...rest}>
      {__twcStyles}
      {children}
    </pre>
  );
});
Pre.displayName = "Pre";
