import * as React from "react";

// ---------------------------------------------------------------------------
// Scoped-style injection — SSR-safe, cross-version.
//
// React 19+: returns a hoistable `<style href precedence>` element. React
//   deduplicates it by `href`, hoists it to <head>, and — crucially — includes
//   it in the server-rendered HTML, so there is no flash of unstyled component
//   (FOUC) before hydration.
// React 18:  falls back to the original client-only `useInsertionEffect`
//   injection (deduped by element id) and returns null — same behavior as
//   before (no SSR styles, but no regression for React 18 consumers).
//
// Each component calls this once per stylesheet with a stable id + its CSS, and
// renders the returned node inside its root:
//   const styles = useScopedStyles("twc-card-styles", CARD_CSS);
//   return <div className="twc-card">{styles}{children}</div>;
// ---------------------------------------------------------------------------

const SUPPORTS_STYLE_HOIST = parseInt(String(React.version), 10) >= 19;

// #57: a CSP nonce provided by the app so injected <style> tags are allowed under a
// strict `style-src 'nonce-…'` policy (no `unsafe-inline`). Undefined by default.
export const NonceContext = React.createContext(undefined);

export function useScopedStyles(id, css) {
  const nonce = React.useContext(NonceContext);
  React.useInsertionEffect(() => {
    // React 19 renders the <style> below; nothing to inject imperatively.
    if (SUPPORTS_STYLE_HOIST) return;
    if (typeof document === "undefined") return;
    // Skip empty stylesheets — per-instance callers (e.g. useSx) pass "" when there is
    // nothing to inject, and we must not litter <head> with empty <style> tags.
    if (!css) return;
    let el = document.getElementById(id);
    if (!el) {
      el = document.createElement("style");
      el.id = id;
      if (nonce) { el.setAttribute("nonce", nonce); el.nonce = nonce; }
      document.head.appendChild(el);
    }
    // Update in place so dynamic per-instance CSS (a changing `sx`) stays current on
    // React 18 too. Components that share an id always pass identical CSS, so this is
    // idempotent for them.
    if (el.textContent !== css) el.textContent = css;
  }, [id, css, nonce]);

  return SUPPORTS_STYLE_HOIST && css
    ? React.createElement("style", { href: id, precedence: "twc-ui", nonce }, css)
    : null;
}
