import React from "react";
import { NonceContext } from "./_styles.js";
import { DefaultsContext, useStableDefaults, warnUnknownDefaults } from "./_defaults.js";

/**
 * App-level provider for Twico UI.
 *
 * - `nonce` (#57) — a CSP nonce that every component's injected `<style>` stamps, so the library works
 *   under a strict `style-src 'nonce-…'` policy without `unsafe-inline`.
 * - `defaults` (#554) — app-wide component defaults, merged **under** each component's own props so a
 *   call site always wins: built-in < provider default < prop. Lets a design system standardise a prop
 *   once instead of sweeping every call site and hoping the next one remembers.
 */
export function TwicoProvider({ nonce, defaults, children }) {
  // Dev-only, deduped: a defaults key that reaches no component would otherwise do nothing silently.
  warnUnknownDefaults(defaults);
  const value = useStableDefaults(defaults);
  return React.createElement(
    NonceContext.Provider,
    { value: nonce },
    React.createElement(DefaultsContext.Provider, { value }, children),
  );
}
