import React from "react";
import { createPortal } from "react-dom";

// Shared modal-overlay primitives, hand-rolled by Dialog/Drawer/CommandPalette
// before this existed. Re-exported publicly as useFocusTrap / usePortal from
// hooks/index.js. Kept as an internal component helper (like _styles.js / _warn.js)
// so the overlays can import it without depending on the public hooks barrel.

const canUseDOM = typeof window !== "undefined" && typeof document !== "undefined";

// Strict focusable selector — every clause excludes tabindex="-1" (CommandPalette's
// stricter form, a no-op for Dialog/Drawer). Single source of truth for all overlays.
const FOCUSABLE =
  'a[href]:not([tabindex="-1"]), button:not([disabled]):not([tabindex="-1"]), textarea:not([disabled]):not([tabindex="-1"]), input:not([disabled]):not([tabindex="-1"]), select:not([disabled]):not([tabindex="-1"]), [tabindex]:not([tabindex="-1"])';

/**
 * Focus management for a modal region referenced by `ref`. While `active`, move
 * focus inside on activate, trap Tab/Shift+Tab within it, and (by default) restore
 * focus to the previously-focused element on deactivate. Escape is intentionally
 * NOT handled here (it's component-specific). SSR-safe.
 */
export function useFocusTrap(ref, active = true, { restoreFocus = true } = {}) {
  // Move focus in on activate; restore on deactivate. A PASSIVE effect (not layout):
  // React restores focus to the pre-commit active element during the commit's layout
  // phase, so restoring here in the layout phase gets clobbered — the passive phase wins.
  React.useEffect(() => {
    if (!active || !canUseDOM) return undefined;
    const node = ref.current;
    if (!node) return undefined;
    const prevFocused = document.activeElement;
    const first = node.querySelector(FOCUSABLE);
    (first || node).focus();
    return () => {
      if (restoreFocus && prevFocused && typeof prevFocused.focus === "function") prevFocused.focus();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  // Trap Tab / Shift+Tab within the region.
  React.useEffect(() => {
    if (!active || !canUseDOM) return undefined;
    const node = ref.current;
    const onKey = (e) => {
      if (e.key !== "Tab" || !node) return;
      const f = Array.from(node.querySelectorAll(FOCUSABLE)).filter((el) => el.offsetParent !== null);
      if (!f.length) { e.preventDefault(); node.focus(); return; }
      const first = f[0], last = f[f.length - 1], ae = document.activeElement;
      if (e.shiftKey) {
        if (ae === first || ae === node || !node.contains(ae)) { e.preventDefault(); last.focus(); }
      } else if (ae === last || !node.contains(ae)) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);
}

/**
 * Returns a stable `render(node)` that portals to document.body (returns null on the
 * server, where there is no document). Centralizes the createPortal derivation the
 * overlays each repeated. Portal output is client-only, so there is no hydration mismatch.
 */
export function usePortal() {
  return React.useCallback((node) => {
    if (typeof document === "undefined") return null;
    return typeof createPortal === "function" ? createPortal(node, document.body) : node;
  }, []);
}
