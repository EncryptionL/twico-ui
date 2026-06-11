import React from "react";

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

/** Controlled/uncontrolled state — the pattern every form component needs. */
export function useControllableState({ value, defaultValue, onChange } = {}) {
  const isControlled = value !== undefined;
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue);
  const current = isControlled ? value : uncontrolled;
  const ref = React.useRef({ current, isControlled, onChange });
  useIsomorphicLayoutEffect(() => {
    ref.current = { current, isControlled, onChange };
  });
  const setValue = React.useCallback((next) => {
    const { current: cur, isControlled: ctrl, onChange: cb } = ref.current;
    const resolved = typeof next === "function" ? next(cur) : next;
    if (resolved === cur) return;
    if (!ctrl) setUncontrolled(resolved);
    if (cb) cb(resolved);
  }, []);
  return [current, setValue];
}

/** Reactively match a media query (SSR-safe). */
export function useMediaQuery(query) {
  const get = () => (canUseDOM ? window.matchMedia(query).matches : false);
  const [matches, setMatches] = React.useState(get);
  React.useEffect(() => {
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
  const setTheme = React.useCallback(
    (t) => {
      setThemeState(t);
      try {
        if (canUseDOM) window.localStorage.setItem(storageKey, t);
      } catch (e) {}
    },
    [storageKey]
  );
  const toggle = React.useCallback(() => setThemeState((prev) => {
    const next = prev === "dark" ? "light" : "dark";
    try {
      if (canUseDOM) window.localStorage.setItem(storageKey, next);
    } catch (e) {}
    return next;
  }), [storageKey]);
  return { theme, setTheme, toggle, isDark: theme === "dark" };
}

/** Attach an event listener (window by default, or a ref/element) with cleanup. */
export function useEventListener(eventName, handler, element, options) {
  const saved = React.useRef(handler);
  useIsomorphicLayoutEffect(() => {
    saved.current = handler;
  }, [handler]);
  React.useEffect(() => {
    const target = (element && element.current) || element || (canUseDOM ? window : null);
    if (!target || !target.addEventListener) return undefined;
    const listener = (e) => saved.current(e);
    target.addEventListener(eventName, listener, options);
    return () => target.removeEventListener(eventName, listener, options);
  }, [eventName, element, options]);
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
  }, [ref, events]);
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
export function useCopyToClipboard(timeout = 1500) {
  const [copied, setCopied] = React.useState(false);
  const copy = React.useCallback(async (text) => {
    try {
      if (canUseDOM && navigator.clipboard) {
        await navigator.clipboard.writeText(text);
      }
      setCopied(true);
      return true;
    } catch (e) {
      setCopied(false);
      return false;
    }
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

/** Lock body scroll while `locked` is true — for modals/drawers. */
export function useScrollLock(locked = true) {
  useIsomorphicLayoutEffect(() => {
    if (!canUseDOM || !locked) return undefined;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [locked]);
}

/** A stable, SSR-safe unique id (optionally prefixed). */
export function useId(prefix = "twc") {
  const raw = React.useId();
  return prefix ? `${prefix}-${raw.replace(/:/g, "")}` : raw;
}
