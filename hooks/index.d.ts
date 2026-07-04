import * as React from "react";

/** SSR-safe `useLayoutEffect` (falls back to `useEffect` on the server). */
export const useIsomorphicLayoutEffect: typeof React.useLayoutEffect;

/** `true` once the component has mounted on the client — for SSR-safe rendering. */
export function useMounted(): boolean;

/** The value from the previous render. */
export function usePrevious<T>(value: T): T | undefined;

/** Boolean state with a stable toggle. `toggle()` flips; `toggle(true)` sets. */
export function useToggle(
  initial?: boolean
): [boolean, (next?: boolean) => void, React.Dispatch<React.SetStateAction<boolean>>];

/** Open/close state for dialogs, drawers, menus, popovers. */
export function useDisclosure(initial?: boolean): {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  onToggle: () => void;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

/**
 * Controlled/uncontrolled state — the pattern every form component needs.
 * Returns `[value, setValue, isControlled]`; the third element reports whether a
 * `value` prop is currently driving the state. In development it warns once if a
 * component switches between controlled and uncontrolled.
 */
export function useControllableState<T>(options?: {
  value?: T;
  defaultValue?: T;
  onChange?: (value: T) => void;
}): [T, (next: T | ((prev: T) => T)) => void, boolean];

export interface UseMediaQueryOptions {
  /** Value on the server and first client render (before the after-mount sync). @default false */
  defaultValue?: boolean;
  /** Read `matchMedia` eagerly in the initializer — client-only apps with no SSR. @default false */
  initializeWithValue?: boolean;
}

/**
 * Reactively match a media query. Returns `defaultValue` on the server and the
 * first client render, then syncs after mount — so hydration never mismatches.
 */
export function useMediaQuery(query: string, options?: UseMediaQueryOptions): boolean;

/** `true` when the user requests reduced motion. */
export function usePrefersReducedMotion(): boolean;

export interface UseColorSchemeOptions {
  /** localStorage key. @default "twico-theme" */
  storageKey?: string;
  /** "class" toggles `.dark`; any other string is set as an attribute. @default "class" */
  attribute?: string;
  /** Element to theme. @default document.documentElement */
  element?: HTMLElement | null;
  /** Disable CSS transitions during the switch so the UI re-themes instantly. @default true */
  disableTransitionsOnChange?: boolean;
}

/** Light/dark theme state synced to `<html>` and persisted to localStorage. */
export function useColorScheme(options?: UseColorSchemeOptions): {
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
  toggle: () => void;
  isDark: boolean;
};

/** Attach an event listener (window by default, or a ref/element) with cleanup. */
export function useEventListener(
  eventName: string,
  handler: (event: any) => void,
  element?: React.RefObject<any | null> | EventTarget | null,
  options?: boolean | AddEventListenerOptions
): void;

/** Call `handler` when a pointer/touch event lands outside `ref`. */
export function useClickOutside<T extends HTMLElement = HTMLElement>(
  ref: React.RefObject<T | null>,
  handler: (event: Event) => void,
  events?: string[]
): void;

export interface UseKeyPressOptions {
  ctrl?: boolean;
  meta?: boolean;
  shift?: boolean;
  alt?: boolean;
  preventDefault?: boolean;
}

/** Run `handler` on a keydown matching `key`, with optional modifier requirements. */
export function useKeyPress(
  key: string | string[],
  handler: (event: KeyboardEvent) => void,
  options?: UseKeyPressOptions
): void;

/** State persisted to localStorage (JSON-serialized), SSR-safe. */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void];

/** Copy text to the clipboard with a `copied` flag that auto-resets. */
export function useCopyToClipboard(timeout?: number): {
  copied: boolean;
  copy: (text: string) => Promise<boolean>;
};

/** Debounce a value — updates only after `delay` ms of no change. */
export function useDebouncedValue<T>(value: T, delay?: number): T;

/** A debounced version of a callback. */
export function useDebouncedCallback<A extends any[]>(
  callback: (...args: A) => void,
  delay?: number
): (...args: A) => void;

/** Run `callback` every `delay` ms; pass `delay = null` to pause. */
export function useInterval(callback: () => void, delay: number | null): void;

/** Run `callback` once after `delay` ms; pass `delay = null` to cancel. */
export function useTimeout(callback: () => void, delay: number | null): void;

/** The current window dimensions (0×0 on the server). */
export function useWindowSize(): { width: number; height: number };

/** `true` while the pointer is over the element referenced by `ref`. */
export function useHover<T extends HTMLElement = HTMLElement>(ref: React.RefObject<T | null>): boolean;

/** The latest IntersectionObserver entry for the element referenced by `ref`. */
export function useIntersectionObserver<T extends HTMLElement = HTMLElement>(
  ref: React.RefObject<T | null>,
  options?: IntersectionObserverInit
): IntersectionObserverEntry | null;

/** Lock body scroll while `locked` is true — for modals/drawers. */
export function useScrollLock(locked?: boolean): void;

/** A stable, SSR-safe unique id (optionally prefixed). */
export function useId(prefix?: string): string;
