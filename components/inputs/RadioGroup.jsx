import React from "react";
import { useScopedStyles } from "../_styles.js";
import { Radio } from "./Radio.jsx";

const RADIO_GROUP_CSS = `
.twc-field { display: flex; flex-direction: column; gap: var(--space-1-5); font-family: var(--font-sans); }
.twc-field__label { font-size: var(--text-sm); font-weight: var(--font-semibold); color: var(--color-text); display: flex; gap: 4px; align-items: center; }
.twc-field__req { color: var(--color-danger); }
.twc-field__hint { font-size: var(--text-xs); color: var(--color-text-muted); }
.twc-field__error { font-size: var(--text-xs); color: var(--color-danger-subtle-fg); font-weight: var(--font-medium); }
.twc-radio-group__items { display: flex; flex-direction: column; gap: var(--space-2-5); }
.twc-radio-group__items[data-orientation="horizontal"] { flex-direction: row; flex-wrap: wrap; gap: var(--space-4); }
`;

/**
 * Grouped radios with one controlled value, a role="radiogroup" container, a hoisted
 * group label/error, and a shared `name`. Because the children are real
 * `<input type="radio">` sharing a name, the browser provides roving tabindex +
 * Arrow-key selection natively — no custom key handling needed.
 */
export function RadioGroup({
  name,
  value,
  defaultValue,
  onChange,
  options,
  children,
  label,
  hint,
  error,
  orientation = "vertical",
  disabled = false,
  required = false,
  size = "md",
  tone = "primary",
  id,
  className = "",
  ...rest
}) {
  const __twcStyles = useScopedStyles("twc-radio-group-styles", RADIO_GROUP_CSS);
  const autoId = React.useId();
  const fieldId = id || autoId;
  const labelId = `${fieldId}-label`;
  const descId = `${fieldId}-desc`;
  const groupName = name || `${fieldId}-name`;
  const invalid = Boolean(error);

  // Hand-rolled controlled/uncontrolled (no hook import), passing the VALUE not the event.
  const [internal, setInternal] = React.useState(defaultValue);
  const current = value !== undefined ? value : internal;
  const select = (v) => { if (value === undefined) setInternal(v); onChange?.(v); };

  const radios = options
    ? options.map((o) => (
        <Radio
          key={o.value}
          name={groupName}
          value={o.value}
          label={o.label}
          description={o.description}
          checked={current === o.value}
          onChange={() => select(o.value)}
          disabled={disabled || o.disabled}
          required={required}
          size={size}
          tone={tone}
        />
      ))
    : React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;
        const v = child.props.value;
        return React.cloneElement(child, {
          name: child.props.name ?? groupName,
          checked: child.props.checked ?? (current === v),
          onChange: child.props.onChange ?? (() => select(v)),
          disabled: child.props.disabled ?? disabled,
          required: child.props.required ?? required,
          size: child.props.size ?? size,
          tone: child.props.tone ?? tone,
        });
      });

  return (
    <div
      className={`twc-field ${className}`}
      role="radiogroup"
      aria-labelledby={label ? labelId : undefined}
      aria-describedby={(error || hint) ? descId : undefined}
      aria-invalid={invalid || undefined}
      aria-required={required || undefined}
      data-orientation={orientation}
      {...rest}
    >
      {__twcStyles}
      {label ? (
        <span id={labelId} className="twc-field__label">{label}{required ? <span className="twc-field__req">*</span> : null}</span>
      ) : null}
      <div className="twc-radio-group__items" data-orientation={orientation === "horizontal" ? "horizontal" : undefined}>
        {radios}
      </div>
      {error ? <span id={descId} className="twc-field__error">{error}</span> : hint ? <span id={descId} className="twc-field__hint">{hint}</span> : null}
    </div>
  );
}
