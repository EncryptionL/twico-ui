import { components } from "./components.js";

// Hooks exported from twico-ui. GENERATED from hooks/index.js by
// scripts/gen-exports.mjs — run `npm run gen:exports` after adding a hook.
const HOOKS = [
  "useIsomorphicLayoutEffect", "useMounted", "usePrevious", "useToggle",
  "useDisclosure", "useControllableState", "useMediaQuery", "usePrefersReducedMotion",
  "useColorScheme", "useEventListener", "useClickOutside", "useKeyPress",
  "useLocalStorage", "useCopyToClipboard", "useDebouncedValue", "useDebouncedCallback",
  "useInterval", "useTimeout", "useWindowSize", "useHover",
  "useIntersectionObserver", "useScrollLock", "useId",
];

// Every named export of "twico-ui" — used to derive the import line when a snippet
// is expanded to its full, runnable form.
export const EXPORT_NAMES = Array.from(
  new Set([
    ...components.flatMap((c) => c.importName.split(",").map((s) => s.trim())),
    ...HOOKS,
  ])
).filter(Boolean);
