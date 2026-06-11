import React from "react";

const DIVIDER_CSS = `
.twc-divider { border: none; background: var(--color-divider); }
.twc-divider[data-orientation="horizontal"] { width: 100%; height: 1px; margin: var(--space-4) 0; }
.twc-divider[data-orientation="vertical"] { width: 1px; align-self: stretch; min-height: 1em; margin: 0 var(--space-3); }
.twc-divider[data-inset="true"][data-orientation="horizontal"] { margin-left: var(--space-4); }
/* Labeled divider */
.twc-divider-label { display: flex; align-items: center; gap: var(--space-3); margin: var(--space-4) 0; font-family: var(--font-sans); color: var(--color-text-muted); font-size: var(--text-xs); font-weight: var(--font-semibold); letter-spacing: var(--tracking-wide); text-transform: uppercase; }
.twc-divider-label::before, .twc-divider-label::after { content: ""; height: 1px; background: var(--color-divider); flex: 1; }
.twc-divider-label[data-align="left"]::before { flex: 0 0 var(--space-6); }
.twc-divider-label[data-align="right"]::after { flex: 0 0 var(--space-6); }
`;

export function Divider({
  orientation = "horizontal",
  inset = false,
  children,
  align = "center",
  className = "",
  ...rest
}) {
  React.useEffect(() => {
    if (document.getElementById("twc-divider-styles")) return;
    const el = document.createElement("style");
    el.id = "twc-divider-styles";
    el.textContent = DIVIDER_CSS;
    document.head.appendChild(el);
  }, []);

  if (children) {
    return (
      <div className={`twc-divider-label ${className}`} data-align={align} role="separator" {...rest}>
        {children}
      </div>
    );
  }
  return (
    <hr
      className={`twc-divider ${className}`}
      data-orientation={orientation}
      data-inset={inset || undefined}
      role="separator"
      aria-orientation={orientation}
      {...rest}
    />
  );
}
