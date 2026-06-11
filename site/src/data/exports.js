import { components } from "./components.js";

// Hooks exported from twico-ui (kept in sync with hooks/index.js).
const HOOKS = [
  "useMediaQuery", "usePrefersReducedMotion", "useColorScheme", "useWindowSize",
  "useDisclosure", "useToggle", "useControllableState", "useLocalStorage", "usePrevious",
  "useEventListener", "useClickOutside", "useKeyPress", "useHover", "useIntersectionObserver", "useScrollLock",
  "useDebouncedValue", "useDebouncedCallback", "useInterval", "useTimeout",
  "useCopyToClipboard", "useId", "useMounted", "useIsomorphicLayoutEffect",
];

// Every named export of "twico-ui" — used to derive the import line when a snippet
// is expanded to its full, runnable form.
export const EXPORT_NAMES = Array.from(
  new Set([
    ...components.flatMap((c) => c.importName.split(",").map((s) => s.trim())),
    ...HOOKS,
  ])
).filter(Boolean);
