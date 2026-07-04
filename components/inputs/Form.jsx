import React from "react";
import { useScopedStyles } from "../_styles.js";

const FORM_CSS = `
.twc-form { display: flex; flex-direction: column; gap: var(--space-4); font-family: var(--font-sans); }
.twc-form__fieldset { border: 0; margin: 0; padding: 0; min-width: 0; display: flex; flex-direction: column; gap: inherit; }
`;

/**
 * A real `<form>` — restores submit-on-Enter and native form semantics. `onSubmit`
 * runs after `preventDefault()` (unless `preventDefault={false}`); `loading`/`disabled`
 * wrap children in a `<fieldset disabled>` so every control disables at once.
 */
export const Form = React.forwardRef(function Form({
  onSubmit, preventDefault = true, loading = false, disabled = false, gap, className = "", style, children, ...rest
}, ref) {
  const __twcStyles = useScopedStyles("twc-form-styles", FORM_CSS);
  const handleSubmit = (e) => { if (preventDefault) e.preventDefault(); onSubmit?.(e); };
  return (
    <form
      ref={ref}
      className={`twc-form ${className}`.trim()}
      onSubmit={handleSubmit}
      style={gap != null ? { gap: `var(--space-${gap})`, ...style } : style}
      {...rest}
    >
      {__twcStyles}
      <fieldset className="twc-form__fieldset" disabled={loading || disabled || undefined} aria-busy={loading || undefined}>
        {children}
      </fieldset>
    </form>
  );
});
Form.displayName = "Form";
