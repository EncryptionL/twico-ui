import React from "react";
import { createPortal } from "react-dom";
import { warnOnce } from "./_warn.js";

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

// #447: Popover/Menu clone their `trigger` to inject widget semantics (tabIndex, aria-expanded,
// aria-haspopup, aria-controls). Those are only CORRECT on something already interactive:
// aria-expanded is not a global ARIA attribute, so on a div's implicit role="generic" it is
// disallowed (axe aria-allowed-attr) and the element becomes a nameless tab stop. This decides
// whether the clone needs role="button" bolted on. An explicit consumer role wins (AvatarMenu
// ships its own span role="button"), and a component type we cannot see through is trusted to
// render its own control (Button/IconButton default to as="button").
const CONTROL_TAGS = "|button|a|summary|input|select|textarea|";
export function triggerIsControl(el) {
  const p = (el && el.props) || {};
  if (typeof p.role === "string" && p.role) return true;
  const t = typeof el.type === "string" ? el.type : (typeof p.as === "string" ? p.as : "");
  return !t || CONTROL_TAGS.indexOf("|" + t + "|") >= 0;
}

// #447: dev-only runtime check on the trigger contract. Static inspection cannot see through a
// component type, so `<Box>`/`<Stack>` (which render a div) slip past triggerIsControl. Note the role
// this module injects is ALREADY on the element by the time this runs, so the useful signals are:
// a Tooltip used as the trigger, a focusable control nested inside it (two tab stops for one control),
// and an element that is neither a native control nor carrying any role at all.
const NATIVE_CONTROL = "button,a[href],summary,input,select,textarea";
export function useTriggerAudit(ref, name) {
  React.useEffect(() => {
    const el = ref.current && ref.current.firstElementChild;
    if (!el) return;
    if (el.classList.contains("twc-tooltip-wrap")) {
      warnOnce(name + ".trigger-tooltip", "twico-ui " + name + ": `trigger` is a <Tooltip>, so the injected tabIndex/aria-expanded land on the tooltip wrapper instead of your control, and the tooltip stops being announced on focus. Put Tooltip OUTSIDE: <Tooltip ...><" + name + " trigger={<IconButton .../>} /></Tooltip>.");
    } else if (!el.matches(NATIVE_CONTROL)) {
      if (el.querySelector(FOCUSABLE)) {
        warnOnce(name + ".trigger-nested", "twico-ui " + name + ": `trigger` is a <" + el.tagName.toLowerCase() + "> wrapping a focusable control, which gives TWO tab stops for one control. Pass the control itself as `trigger` and move the wrapper (badge, positioning) outside " + name + ".");
      } else if (!el.matches("[role]")) {
        warnOnce(name + ".trigger-role", "twico-ui " + name + ": `trigger` renders <" + el.tagName.toLowerCase() + ">, not a button, so the injected aria-expanded is not valid on it. Pass a Button/IconButton, or set `role` yourself so the element owns its semantics.");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

/**
 * Focus management for a modal region referenced by `ref`. While `active`, move
 * focus inside on activate, trap Tab/Shift+Tab within it, and (by default) restore
 * focus to the previously-focused element on deactivate. Escape is intentionally
 * NOT handled here (it's component-specific). SSR-safe.
 */
export function useFocusTrap(ref, active = true, { restoreFocus = true, initialFocus } = {}) {
  // Move focus in on activate; restore on deactivate. A PASSIVE effect (not layout):
  // React restores focus to the pre-commit active element during the commit's layout
  // phase, so restoring here in the layout phase gets clobbered — the passive phase wins.
  React.useEffect(() => {
    if (!active || !canUseDOM) return undefined;
    const node = ref.current;
    if (!node) return undefined;
    const prevFocused = document.activeElement;
    // `initialFocus` (a ref or a () => Element) overrides the default "first focusable"
    // landing — e.g. a calendar day grid or a color area rather than the Prev-month button.
    const target = (typeof initialFocus === "function" ? initialFocus() : initialFocus && initialFocus.current) || node.querySelector(FOCUSABLE);
    (target || node).focus();
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

// #389: a lightweight dismissable-layer stack. Every open overlay (Dialog/Drawer/CommandPalette/Popover/
// Menu/Tooltip) registers while it is `active`; the returned `isTop()` reports whether this layer is the
// topmost open one. Escape and outside-pointer handlers gate on it so those events reach only the layer on
// top (a nested Menu/Popover/Dialog consumes them instead of also closing its parent). Registration order is
// mount order; the highest sequence number is the topmost. Cleanup runs after commit, so within one Escape/
// pointer event the just-closed child is still registered and its parent correctly yields.
let __layerSeq = 0;
const __openLayers = new Set();
export function useLayer(active) {
  const depth = React.useRef(0);
  React.useEffect(() => {
    if (!active) return undefined;
    const d = ++__layerSeq;
    depth.current = d;
    __openLayers.add(d);
    return () => { __openLayers.delete(d); };
  }, [active]);
  // Stable: reads the live module-level set/ref, so it never needs to change identity.
  return React.useCallback(() => __openLayers.size === 0 || depth.current === Math.max(...__openLayers), []);
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
