import React from "react";
import { useScopedStyles } from "../_styles.js";

const KBD_CSS = `
.twc-kbd { display: inline-flex; align-items: center; justify-content: center; min-width: 20px; padding: 2px 6px;
  font-family: var(--font-mono); font-size: 11px; font-weight: var(--font-semibold); line-height: 1; color: var(--color-text-muted);
  background: var(--color-surface-sunken); border: var(--border-thin) solid var(--color-border);
  border-bottom-width: 2px; border-radius: var(--radius-sm); }
`;

/** A keyboard key cap, e.g. <Kbd>⌘</Kbd> <Kbd>K</Kbd>. */
export const Kbd = React.forwardRef(function Kbd({ className = "", children, ...rest }, ref) {
  const __twcStyles = useScopedStyles("twc-kbd-styles", KBD_CSS);
  return (
    <kbd ref={ref} className={`twc-kbd ${className}`.trim()} {...rest}>
      {__twcStyles}
      {children}
    </kbd>
  );
});
Kbd.displayName = "Kbd";
