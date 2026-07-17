import React from "react";
import { warnOnce } from "../components/_warn.js";
import { useFocusTrap as _useFocusTrap, usePortal as _usePortal, useScrollLock as _useScrollLock } from "../components/_overlay.js";

const canUseDOM = typeof window !== "undefined" && typeof document !== "undefined";

/** SSR-safe `useLayoutEffect` (falls back to `useEffect` on the server). */
export const useIsomorphicLayoutEffect = canUseDOM ? React.useLayoutEffect : React.useEffect;

/** `true` once the component has mounted on the client — for SSR-safe rendering. */
export function useMounted() {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);
  return mounted;
}

/** The value from the previous render. */
export function usePrevious(value) {
  const ref = React.useRef(undefined);
  React.useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

/** Boolean state with a stable toggle. `toggle()` flips; `toggle(true)` sets. */
export function useToggle(initial = false) {
  const [on, setOn] = React.useState(initial);
  const toggle = React.useCallback((next) => {
    setOn((prev) => (typeof next === "boolean" ? next : !prev));
  }, []);
  return [on, toggle, setOn];
}

/** Open/close state for dialogs, drawers, menus, popovers. */
export function useDisclosure(initial = false) {
  const [open, setOpen] = React.useState(initial);
  const onOpen = React.useCallback(() => setOpen(true), []);
  const onClose = React.useCallback(() => setOpen(false), []);
  const onToggle = React.useCallback(() => setOpen((p) => !p), []);
  return { open, onOpen, onClose, onToggle, setOpen };
}

/**
 * Controlled/uncontrolled state — the pattern every form component needs.
 * Returns `[value, setValue, isControlled]`; the third element is additive.
 */
export function useControllableState({ value, defaultValue, onChange } = {}) {
  const isControlled = value !== undefined;
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue);
  const current = isControlled ? value : uncontrolled;
  const ref = React.useRef({ current, isControlled, onChange });
  useIsomorphicLayoutEffect(() => {
    ref.current = { current, isControlled, onChange };
  });
  // Dev-only: warn once if a component flips between controlled and uncontrolled
  // (the classic React footgun). Hook order stays stable — the ref/effect always run.
  const wasControlled = React.useRef(isControlled);
  React.useEffect(() => {
    if (wasControlled.current !== isControlled) {
      warnOnce(
        "useControllableState:switch",
        `useControllableState: a value is switching from ${wasControlled.current ? "controlled" : "uncontrolled"} to ${isControlled ? "controlled" : "uncontrolled"}. Decide between controlled (\`value\`) and uncontrolled (\`defaultValue\`) for the component's lifetime.`
      );
      wasControlled.current = isControlled;
    }
  });
  const setValue = React.useCallback((next) => {
    const { current: cur, isControlled: ctrl, onChange: cb } = ref.current;
    const resolved = typeof next === "function" ? next(cur) : next;
    if (resolved === cur) return;
    if (!ctrl) setUncontrolled(resolved);
    if (cb) cb(resolved);
  }, []);
  return [current, setValue, isControlled];
}

/**
 * Reactively match a media query. Returns `defaultValue` (default `false`) on the
 * server AND on the first client render, then syncs the real value in a
 * layout effect before paint — so hydration never mismatches. Pass
 * `{ initializeWithValue: true }` in a client-only app to read matchMedia eagerly.
 */
export function useMediaQuery(query, { defaultValue = false, initializeWithValue = false } = {}) {
  const get = () => (canUseDOM ? window.matchMedia(query).matches : defaultValue);
  const [matches, setMatches] = React.useState(initializeWithValue ? get : defaultValue);
  useIsomorphicLayoutEffect(() => {
    if (!canUseDOM) return undefined;
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);
  return matches;
}

/** `true` when the user requests reduced motion. */
export function usePrefersReducedMotion() {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

/**
 * Light/dark theme state synced to a class (default `.dark`) on `<html>` and
 * persisted to localStorage — the contract Twico UI's tokens key off.
 */
export function useColorScheme({ storageKey = "twico-theme", attribute = "class", element, disableTransitionsOnChange = true } = {}) {
  const getTarget = () => element || (canUseDOM ? document.documentElement : null);
  const firstApply = React.useRef(true);
  const read = () => {
    if (!canUseDOM) return "light";
    try {
      const stored = window.localStorage.getItem(storageKey);
      if (stored === "light" || stored === "dark") return stored;
    } catch (e) {}
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  };
  const [theme, setThemeState] = React.useState(read);
  const apply = React.useCallback(
    (t) => {
      const target = getTarget();
      if (!target) return;
      // Re-theme the whole UI at once. Without this, every element animates its
      // color transition on its own duration, so the switch looks like it ripples
      // component-by-component. Disable transitions for the flip, force a reflow,
      // then restore — but never on the first (mount) apply, so we don't suppress
      // initial entrance animations.
      const skip = firstApply.current || !disableTransitionsOnChange || !canUseDOM;
      firstApply.current = false;
      let css;
      if (!skip) {
        css = document.createElement("style");
        css.appendChild(document.createTextNode("*,*::before,*::after{transition:none!important}"));
        document.head.appendChild(css);
      }
      if (attribute === "class") target.classList.toggle("dark", t === "dark");
      else target.setAttribute(attribute, t);
      if (css) {
        // Force the browser to apply the change without transitions, then restore.
        window.getComputedStyle(document.body);
        setTimeout(() => { if (css.parentNode) css.parentNode.removeChild(css); }, 1);
      }
    },
    [attribute, element, disableTransitionsOnChange]
  );
  useIsomorphicLayoutEffect(() => {
    apply(theme);
  }, [theme, apply]);
  const themeRef = React.useRef(theme);
  useIsomorphicLayoutEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  const setTheme = React.useCallback(
    (t) => {
      setThemeState(t);
      try {
        if (canUseDOM) window.localStorage.setItem(storageKey, t);
      } catch (e) {}
      // Notify every other useColorScheme instance (e.g. a page toggle + the navbar).
      if (canUseDOM) window.dispatchEvent(new Event("twico:colorscheme"));
    },
    [storageKey]
  );
  const toggle = React.useCallback(() => {
    setTheme(themeRef.current === "dark" ? "light" : "dark");
  }, [setTheme]);

  // Keep every instance — and other tabs — in sync with the active theme.
  React.useEffect(() => {
    if (!canUseDOM) return undefined;
    const sync = () => setThemeState(read());
    const onStorage = (e) => {
      if (e.key === storageKey) sync();
    };
    window.addEventListener("twico:colorscheme", sync);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("twico:colorscheme", sync);
      window.removeEventListener("storage", onStorage);
    };
  }, [storageKey]);

  return { theme, setTheme, toggle, isDark: theme === "dark" };
}

/** Attach an event listener (window by default, or a ref/element) with cleanup. */
export function useEventListener(eventName, handler, element, options) {
  const saved = React.useRef(handler);
  useIsomorphicLayoutEffect(() => {
    saved.current = handler;
  }, [handler]);
  // Destructure to primitives so an inline `options` object/boolean doesn't re-bind every render.
  const capture = typeof options === "boolean" ? options : (options && options.capture);
  const passive = typeof options === "object" && options ? options.passive : undefined;
  const once = typeof options === "object" && options ? options.once : undefined;
  React.useEffect(() => {
    const target = (element && element.current) || element || (canUseDOM ? window : null);
    if (!target || !target.addEventListener) return undefined;
    const opts = typeof options === "boolean" ? options : { capture, passive, once };
    const listener = (e) => saved.current(e);
    target.addEventListener(eventName, listener, opts);
    return () => target.removeEventListener(eventName, listener, opts);
  }, [eventName, element, capture, passive, once]);
}

/** Call `handler` when a pointer/touch event lands outside `ref`. */
export function useClickOutside(ref, handler, events = ["mousedown", "touchstart"]) {
  const saved = React.useRef(handler);
  useIsomorphicLayoutEffect(() => {
    saved.current = handler;
  }, [handler]);
  React.useEffect(() => {
    if (!canUseDOM) return undefined;
    const listener = (e) => {
      const el = ref && ref.current;
      if (!el || el.contains(e.target)) return;
      saved.current(e);
    };
    events.forEach((ev) => document.addEventListener(ev, listener, true));
    return () => events.forEach((ev) => document.removeEventListener(ev, listener, true));
  }, [ref, events.join(",")]);
}

/** Run `handler` on a keydown matching `key`, with optional modifier requirements. */
export function useKeyPress(key, handler, options = {}) {
  const { ctrl, meta, shift, alt, preventDefault } = options;
  useEventListener("keydown", (e) => {
    const keys = Array.isArray(key) ? key : [key];
    const match = keys.some((k) => k.toLowerCase() === String(e.key).toLowerCase());
    if (!match) return;
    if (ctrl && !e.ctrlKey) return;
    if (meta && !e.metaKey) return;
    if (shift && !e.shiftKey) return;
    if (alt && !e.altKey) return;
    if (preventDefault) e.preventDefault();
    handler(e);
  });
}

/** State persisted to localStorage (JSON-serialized), SSR-safe. */
export function useLocalStorage(key, initialValue) {
  const read = () => {
    if (!canUseDOM) return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (e) {
      return initialValue;
    }
  };
  const [stored, setStored] = React.useState(read);
  const setValue = React.useCallback(
    (value) => {
      setStored((prev) => {
        const next = typeof value === "function" ? value(prev) : value;
        try {
          if (canUseDOM) window.localStorage.setItem(key, JSON.stringify(next));
        } catch (e) {}
        return next;
      });
    },
    [key]
  );
  return [stored, setValue];
}

/** Copy text to the clipboard with a `copied` flag that auto-resets. */
// #255: legacy `document.execCommand("copy")` fallback via a hidden, selected <textarea> — the async
// Clipboard API is exposed ONLY in a secure context (HTTPS or localhost/127.0.0.1), so over plain HTTP
// on a LAN IP (common on-prem/dev) it's undefined and copy would otherwise silently fail. Restores the
// user's prior selection. Client-only (callers invoke `copy` from an event handler).
function legacyCopy(text) {
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    // Off-screen but selectable — no scroll jump, no visible flash.
    ta.style.cssText = "position:fixed;top:0;left:0;width:1px;height:1px;padding:0;border:none;opacity:0;pointer-events:none;";
    document.body.appendChild(ta);
    const sel = document.getSelection();
    const prev = sel && sel.rangeCount > 0 ? sel.getRangeAt(0) : null;
    ta.focus();
    ta.select();
    ta.setSelectionRange(0, ta.value.length);
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    if (prev && sel) { sel.removeAllRanges(); sel.addRange(prev); }
    return ok;
  } catch {
    return false;
  }
}

export function useCopyToClipboard(timeout = 1500) {
  const [copied, setCopied] = React.useState(false);
  const copy = React.useCallback(async (text) => {
    // SSR / no DOM at all → report failure rather than a false success.
    if (!canUseDOM) { setCopied(false); return false; }
    // Prefer the async Clipboard API (secure contexts only).
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        return true;
      } catch {
        // Permission denied / transient failure → fall through to the legacy path.
      }
    }
    // Fallback for insecure (HTTP-on-IP) contexts + older browsers.
    const ok = legacyCopy(String(text ?? ""));
    setCopied(ok);
    return ok;
  }, []);
  React.useEffect(() => {
    if (!copied) return undefined;
    const t = setTimeout(() => setCopied(false), timeout);
    return () => clearTimeout(t);
  }, [copied, timeout]);
  return { copied, copy };
}

/** Debounce a value — updates only after `delay` ms of no change. */
export function useDebouncedValue(value, delay = 200) {
  const [debounced, setDebounced] = React.useState(value);
  React.useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

/** A debounced version of a callback. */
export function useDebouncedCallback(callback, delay = 200) {
  const saved = React.useRef(callback);
  const timer = React.useRef(null);
  useIsomorphicLayoutEffect(() => {
    saved.current = callback;
  }, [callback]);
  React.useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);
  return React.useCallback(
    (...args) => {
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => saved.current(...args), delay);
    },
    [delay]
  );
}

/** Run `callback` every `delay` ms; pass `delay = null` to pause. */
export function useInterval(callback, delay) {
  const saved = React.useRef(callback);
  useIsomorphicLayoutEffect(() => {
    saved.current = callback;
  }, [callback]);
  React.useEffect(() => {
    if (delay == null) return undefined;
    const id = setInterval(() => saved.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
}

/** Run `callback` once after `delay` ms; pass `delay = null` to cancel. */
export function useTimeout(callback, delay) {
  const saved = React.useRef(callback);
  useIsomorphicLayoutEffect(() => {
    saved.current = callback;
  }, [callback]);
  React.useEffect(() => {
    if (delay == null) return undefined;
    const id = setTimeout(() => saved.current(), delay);
    return () => clearTimeout(id);
  }, [delay]);
}

/** The current window dimensions (0×0 on the server). */
export function useWindowSize() {
  const [size, setSize] = React.useState(() => ({
    width: canUseDOM ? window.innerWidth : 0,
    height: canUseDOM ? window.innerHeight : 0,
  }));
  React.useEffect(() => {
    if (!canUseDOM) return undefined;
    const onResize = () => setSize({ width: window.innerWidth, height: window.innerHeight });
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return size;
}

/** `true` while the pointer is over the element referenced by `ref`. */
export function useHover(ref) {
  const [hovered, setHovered] = React.useState(false);
  React.useEffect(() => {
    const el = ref && ref.current;
    if (!el) return undefined;
    const on = () => setHovered(true);
    const off = () => setHovered(false);
    el.addEventListener("mouseenter", on);
    el.addEventListener("mouseleave", off);
    return () => {
      el.removeEventListener("mouseenter", on);
      el.removeEventListener("mouseleave", off);
    };
  }, [ref]);
  return hovered;
}

/** The latest IntersectionObserver entry for the element referenced by `ref`. */
export function useIntersectionObserver(ref, options = {}) {
  const { root = null, rootMargin = "0px", threshold = 0 } = options;
  const [entry, setEntry] = React.useState(null);
  React.useEffect(() => {
    const el = ref && ref.current;
    if (!canUseDOM || !el || typeof IntersectionObserver === "undefined") return undefined;
    const obs = new IntersectionObserver(([e]) => setEntry(e), { root, rootMargin, threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref, root, rootMargin, JSON.stringify(threshold)]);
  return entry;
}

/** A stable, SSR-safe unique id (optionally prefixed). */
export function useId(prefix = "twc") {
  const raw = React.useId();
  return prefix ? `${prefix}-${raw.replace(/:/g, "")}` : raw;
}

/**
 * Trap focus inside a modal region: move focus in on activate, cycle Tab/Shift+Tab
 * within it, and restore focus to the trigger on deactivate. Implemented in
 * components/_overlay.js so Dialog/Drawer/CommandPalette can share it without
 * importing this public barrel (CLAUDE.md §5); re-exported here as public API.
 */
export const useFocusTrap = _useFocusTrap;

/** A stable `render(node)` that portals to `document.body` (null on the server). */
export const usePortal = _usePortal;

/** Lock body scroll while `locked` is true — refcounted, with scrollbar-gutter compensation
 *  (implemented in components/_overlay.js so overlays can share it without the hooks barrel). */
export const useScrollLock = _useScrollLock;
