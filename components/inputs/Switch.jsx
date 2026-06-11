import React from "react";

export function Switch({
  label,
  description,
  checked,
  defaultChecked,
  disabled = false,
  size = "md",
  id,
  className = "",
  onChange,
  ...rest
}) {
  React.useInsertionEffect(() => {
    if (document.getElementById("twc-switch-styles")) return;
    const el = document.createElement("style");
    el.id = "twc-switch-styles";
    el.textContent = `
.twc-switch { display: inline-flex; align-items: center; gap: var(--space-3); cursor: pointer; font-family: var(--font-sans); }
.twc-switch[data-disabled="true"] { cursor: not-allowed; opacity: 0.55; }
.twc-switch__input { position: absolute; opacity: 0; width: 0; height: 0; }
.twc-switch__track {
  --_w: 44px; --_h: 24px; --_pad: 3px;
  position: relative; flex: none; width: var(--_w); height: var(--_h);
  background: var(--color-border-strong); border-radius: var(--radius-full);
  transition: background-color var(--duration-base) var(--ease-standard);
}
.twc-switch[data-size="sm"] .twc-switch__track { --_w: 36px; --_h: 20px; }
.twc-switch__thumb {
  position: absolute; top: var(--_pad); left: var(--_pad);
  width: calc(var(--_h) - var(--_pad) * 2); height: calc(var(--_h) - var(--_pad) * 2);
  background: var(--color-primary-fg); border-radius: var(--radius-full); box-shadow: var(--shadow-sm);
  transition: transform var(--duration-base) var(--ease-spring);
}
.twc-switch__input:checked + .twc-switch__track { background: var(--color-primary); }
.twc-switch__input:checked + .twc-switch__track .twc-switch__thumb { transform: translateX(calc(var(--_w) - var(--_h))); }
.twc-switch__input:focus-visible + .twc-switch__track { box-shadow: var(--ring); }
.twc-switch__input:active + .twc-switch__track .twc-switch__thumb { width: calc(var(--_h) - var(--_pad) * 2 + 4px); }
.twc-switch__text { display: flex; flex-direction: column; gap: 2px; }
.twc-switch__label { font-size: var(--text-sm); font-weight: var(--font-medium); color: var(--color-text); line-height: 1.3; }
.twc-switch__desc { font-size: var(--text-xs); color: var(--color-text-muted); }
`;
    document.head.appendChild(el);
  }, []);

  const autoId = React.useId();
  const fieldId = id || autoId;

  return (
    <label className={`twc-switch ${className}`} data-size={size} data-disabled={disabled || undefined} htmlFor={fieldId}>
      <input
        id={fieldId}
        type="checkbox"
        role="switch"
        className="twc-switch__input"
        checked={checked}
        defaultChecked={defaultChecked}
        disabled={disabled}
        onChange={onChange}
        {...rest}
      />
      <span className="twc-switch__track" aria-hidden="true">
        <span className="twc-switch__thumb" />
      </span>
      {(label || description) ? (
        <span className="twc-switch__text">
          {label ? <span className="twc-switch__label">{label}</span> : null}
          {description ? <span className="twc-switch__desc">{description}</span> : null}
        </span>
      ) : null}
    </label>
  );
}
