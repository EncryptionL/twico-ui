import React from "react";

const CODE_CSS = `
.twc-code {
  font-family: var(--font-mono); font-size: 0.875em;
  background: var(--color-surface-sunken); color: var(--color-text);
  padding: 1px 6px; border-radius: var(--radius-sm);
  border: var(--border-thin) solid var(--color-border);
  white-space: nowrap;
}
`;

/** Inline code with mono font and a subtle token-styled surface. */
export function Code({ as: Tag = "code", className = "", children, ...rest }) {
  React.useInsertionEffect(() => {
    if (document.getElementById("twc-code-styles")) return;
    const el = document.createElement("style");
    el.id = "twc-code-styles";
    el.textContent = CODE_CSS;
    document.head.appendChild(el);
  }, []);
  return (
    <Tag className={`twc-code ${className}`.trim()} {...rest}>
      {children}
    </Tag>
  );
}
