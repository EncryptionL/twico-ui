import React from "react";

const TAG_CSS = `
.twc-tag {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 4px 6px 4px 11px; height: 28px;
  font-family: var(--font-sans); font-size: var(--text-xs); font-weight: var(--font-medium);
  color: var(--color-text); background: var(--color-surface-sunken);
  border: var(--border-thin) solid var(--color-border);
  border-radius: var(--radius-full); white-space: nowrap;
  transition: background-color var(--duration-fast) var(--ease-standard);
}
.twc-tag[data-no-remove="true"] { padding-right: 11px; }
.twc-tag__remove {
  display: inline-grid; place-items: center;
  width: 18px; height: 18px; border: none; padding: 0; margin: 0;
  border-radius: var(--radius-full); background: transparent;
  color: var(--color-text-subtle); cursor: pointer;
  transition: background-color var(--duration-fast) var(--ease-standard), color var(--duration-fast) var(--ease-standard), transform var(--duration-fast) var(--ease-spring);
}
.twc-tag__remove:hover { background: var(--color-danger-subtle); color: var(--color-danger-subtle-fg); }
.twc-tag__remove:active { transform: scale(0.85); }
.twc-tag__remove svg { width: 13px; height: 13px; }
`;

export function Tag({
  children,
  onRemove,
  leftIcon,
  className = "",
  ...rest
}) {
  React.useEffect(() => {
    if (document.getElementById("twc-tag-styles")) return;
    const el = document.createElement("style");
    el.id = "twc-tag-styles";
    el.textContent = TAG_CSS;
    document.head.appendChild(el);
  }, []);

  return (
    <span className={`twc-tag ${className}`} data-no-remove={!onRemove || undefined} {...rest}>
      {leftIcon}
      {children}
      {onRemove ? (
        <button className="twc-tag__remove" onClick={onRemove} aria-label="Remove" type="button">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>
      ) : null}
    </span>
  );
}
