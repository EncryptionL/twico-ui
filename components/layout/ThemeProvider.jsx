import React from "react";
import { useScopedStyles } from "../_styles.js";

// Friendly token group → CSS-variable prefix. `createTheme({ colors: { primary: "#..." } })`
// becomes `{ "--color-primary": "#..." }`.
const GROUPS = { colors: "color", space: "space", radius: "radius", font: "font", shadow: "shadow", motion: "" };

/**
 * Map a friendly, partial token object onto a `--*` CSS-variable style object. Unknown
 * groups are ignored; a group of `{}` contributes nothing. The result is spread as inline
 * custom properties (or a scoped rule) by ThemeProvider.
 */
export function createTheme(partial = {}) {
  const vars = {};
  for (const [group, prefix] of Object.entries(GROUPS)) {
    const obj = partial[group];
    if (!obj || typeof obj !== "object") continue;
    for (const [key, value] of Object.entries(obj)) {
      if (value == null) continue;
      vars[`--${prefix ? `${prefix}-` : ""}${key}`] = String(value);
    }
  }
  return vars;
}

function toVars(theme) {
  if (!theme) return {};
  // Accept either a createTheme() output (has `--` keys) or a raw partial token object.
  return Object.keys(theme).some((k) => k.startsWith("--")) ? theme : createTheme(theme);
}

/**
 * Scope token overrides to a subtree. `theme` is a `createTheme()` result (or a raw partial
 * token object). Nested providers compose — a child's variables win via the CSS cascade.
 * `mode="inline"` (default) sets the vars inline (SSR-safe, no injection); `mode="stylesheet"`
 * injects a scoped rule via useScopedStyles (nonce-aware) for strict-CSP setups.
 */
export function ThemeProvider({ theme, mode = "inline", className = "", style, children, ...rest }) {
  const vars = React.useMemo(() => toVars(theme), [theme]);
  const uid = React.useId();
  const scopeId = `twc-theme-${uid.replace(/[^a-zA-Z0-9]/g, "")}`;
  const css = mode === "stylesheet"
    ? `[data-twc-theme="${scopeId}"] { ${Object.entries(vars).map(([k, v]) => `${k}: ${v};`).join(" ")} }`
    : "";
  const __twcStyles = useScopedStyles(mode === "stylesheet" ? scopeId : "twc-theme-noop", css);

  return (
    <div
      className={`twc-theme ${className}`.trim()}
      data-twc-theme={mode === "stylesheet" ? scopeId : undefined}
      style={mode === "stylesheet" ? style : { ...vars, ...style }}
      {...rest}
    >
      {mode === "stylesheet" ? __twcStyles : null}
      {children}
    </div>
  );
}
