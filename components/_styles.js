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

export function useScopedStyles(id, css) {
  React.useInsertionEffect(() => {
    // React 19 renders the <style> below; nothing to inject imperatively.
    if (SUPPORTS_STYLE_HOIST) return;
    if (typeof document === "undefined" || document.getElementById(id)) return;
    const el = document.createElement("style");
    el.id = id;
    el.textContent = css;
    document.head.appendChild(el);
  }, [id, css]);

  return SUPPORTS_STYLE_HOIST
    ? React.createElement("style", { href: id, precedence: "twc-ui" }, css)
    : null;
}
