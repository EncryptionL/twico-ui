import React from "react";
import { useScopedStyles } from "../_styles.js";

const VH_CSS = `
.twc-visually-hidden { position: absolute; width: 1px; height: 1px; margin: -1px; padding: 0; overflow: hidden; clip: rect(0 0 0 0); clip-path: inset(50%); white-space: nowrap; border: 0; }
`;

/** Visually hide content while keeping it available to assistive technology. */
export const VisuallyHidden = React.forwardRef(function VisuallyHidden({ as: Tag = "span", className = "", children, ...rest }, ref) {
  const __twcStyles = useScopedStyles("twc-visually-hidden-styles", VH_CSS);
  return (
    <Tag ref={ref} className={`twc-visually-hidden ${className}`.trim()} {...rest}>
      {__twcStyles}
      {children}
    </Tag>
  );
});
VisuallyHidden.displayName = "VisuallyHidden";
