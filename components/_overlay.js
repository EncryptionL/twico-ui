import React from "react";
import { createPortal } from "react-dom";

// Shared modal-overlay primitives, hand-rolled by Dialog/Drawer/CommandPalette
// before this existed. Re-exported publicly as useFocusTrap / usePortal from
// hooks/index.js. Kept as an internal component helper (like _styles.js / _warn.js)
// so the overlays can import it without depending on the public hooks barrel.

const canUseDOM = typeof window !== "undefined" && typeof document !== "undefined";
const useIsoLayoutEffect = canUseDOM ? React.useLayoutEffect : React.useEffect;

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

// #116: one refcounted body scroll-lock shared by every overlay, with scrollbar-gutter
// compensation applied only on the 0→1 transition (so nested/out-of-order opens don't
// double-apply or restore early). Re-exported publicly as useScrollLock from hooks/index.js.
let __scrollLockCount = 0;
let __scrollLockSaved = { overflow: "", paddingRight: "" };
export function useScrollLock(locked = true) {
  useIsoLayoutEffect(() => {
    if (!canUseDOM || !locked) return undefined;
    if (__scrollLockCount === 0) {
      const b = document.body;
      __scrollLockSaved = { overflow: b.style.overflow, paddingRight: b.style.paddingRight };
      const gutter = window.innerWidth - document.documentElement.clientWidth;
      b.style.overflow = "hidden";
      if (gutter > 0) b.style.paddingRight = `${(parseFloat(getComputedStyle(b).paddingRight) || 0) + gutter}px`;
    }
    __scrollLockCount += 1;
    return () => {
      __scrollLockCount -= 1;
      if (__scrollLockCount === 0) {
        document.body.style.overflow = __scrollLockSaved.overflow;
        document.body.style.paddingRight = __scrollLockSaved.paddingRight;
      }
    };
  }, [locked]);
}

/**
 * #115: while `active`, mark every sibling of the overlay's portal subtree `inert` +
 * `aria-hidden` so a screen-reader virtual cursor / mobile swipe can't reach the page
 * behind the modal. `ref` is any node inside the portal (the panel); its containing
 * top-level element is excluded. Restores exactly what it changed on cleanup.
 */
export function useInertBackground(ref, active) {
  React.useEffect(() => {
    if (!active || !canUseDOM) return undefined;
    const node = ref.current;
    if (!node) return undefined;
    const changed = [];
    Array.from(document.body.children).forEach((el) => {
      if (el.contains(node) || el.hasAttribute("aria-hidden") || el.inert) return;
      el.inert = true;
      el.setAttribute("aria-hidden", "true");
      changed.push(el);
    });
    return () => {
      changed.forEach((el) => { el.inert = false; el.removeAttribute("aria-hidden"); });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);
}
