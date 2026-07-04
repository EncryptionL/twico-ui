import React from "react";
import { useScopedStyles } from "../_styles.js";

const LABEL_CSS = `
.twc-label { font-size: var(--text-sm); font-weight: var(--font-semibold); color: var(--color-text); display: inline-flex; gap: 4px; align-items: center; }
.twc-label[data-size="sm"] { font-size: var(--text-xs); }
.twc-label[data-size="lg"] { font-size: var(--text-base); }
.twc-label__req { color: var(--color-danger); }
`;

/** A form label matching the built-in field label look; pass `required` for the asterisk. */
export const Label = React.forwardRef(function Label({ htmlFor, required = false, size = "md", className = "", children, ...rest }, ref) {
  const __twcStyles = useScopedStyles("twc-label-styles", LABEL_CSS);
  return (
    <label ref={ref} htmlFor={htmlFor} className={`twc-label ${className}`.trim()} data-size={size} {...rest}>
      {__twcStyles}
      {children}
      {required ? <span className="twc-label__req" aria-hidden="true">*</span> : null}
    </label>
  );
});
Label.displayName = "Label";
