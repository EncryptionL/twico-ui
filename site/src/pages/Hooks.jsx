import React from "react";
import { Link } from "react-router-dom";
import { Stack, Heading, Text, Table, Code } from "twico-ui";
import CodeBlock from "../components/CodeBlock.jsx";

const GROUPS = [
  {
    id: "state",
    title: "State",
    rows: [
      ["useDisclosure(initial?)", "Open/close state for dialogs, drawers, menus — { open, onOpen, onClose, onToggle, setOpen }."],
      ["useToggle(initial?)", "Boolean state with a stable toggle: toggle() flips, toggle(true) sets."],
      ["useControllableState({ value, defaultValue, onChange })", "The controlled/uncontrolled pattern every form component needs."],
      ["useLocalStorage(key, initial)", "State persisted to localStorage (JSON-serialized), SSR-safe."],
      ["usePrevious(value)", "The value from the previous render."],
    ],
  },
  {
    id: "responsive-theme",
    title: "Responsive & theme",
    rows: [
      ["useMediaQuery(query)", "Reactively match a media query (SSR-safe)."],
      ["usePrefersReducedMotion()", "true when the user requests reduced motion."],
      ["useColorScheme(options?)", "Light/dark theme synced to .dark on <html> + persisted to localStorage."],
      ["useWindowSize()", "The current window { width, height } (0×0 on the server)."],
    ],
  },
  {
    id: "events-dom",
    title: "Events & DOM",
    rows: [
      ["useEventListener(event, handler, target?)", "Attach an event listener (window by default) with cleanup."],
      ["useClickOutside(ref, handler)", "Call handler when a pointer/touch lands outside ref."],
      ["useKeyPress(key, handler, options?)", "Run handler on a keydown matching key, with optional modifiers."],
      ["useHover(ref)", "true while the pointer is over the referenced element."],
      ["useIntersectionObserver(ref, options?)", "The latest IntersectionObserver entry for the referenced element."],
      ["useScrollLock(locked?)", "Lock body scroll while locked is true (for modals/drawers)."],
    ],
  },
  {
    id: "timing",
    title: "Timing",
    rows: [
      ["useDebouncedValue(value, delay?)", "Debounce a value — updates after delay ms of no change."],
      ["useDebouncedCallback(fn, delay?)", "A debounced version of a callback."],
      ["useInterval(fn, delay)", "Run fn every delay ms; pass null to pause."],
      ["useTimeout(fn, delay)", "Run fn once after delay ms; pass null to cancel."],
    ],
  },
  {
    id: "utilities",
    title: "Utilities",
    rows: [
      ["useCopyToClipboard(timeout?)", "Copy text with a copied flag that auto-resets — { copied, copy }."],
      ["useId(prefix?)", "A stable, SSR-safe unique id."],
      ["useMounted()", "true once mounted on the client — for SSR-safe rendering."],
      ["useIsomorphicLayoutEffect", "useLayoutEffect that falls back to useEffect on the server."],
    ],
  },
];

const columns = [
  { key: "hook", header: "Hook", render: (_v, r) => <Code>{r.hook}</Code> },
  { key: "desc", header: "What it does" },
];

export default function Hooks() {
  return (
    <Stack as="article" gap={5}>
      <Stack as="section" gap={3}>
        <Text as="div" tone="primary" size="xs" weight="bold" style={{ textTransform: "uppercase", letterSpacing: "0.08em" }}>Getting started</Text>
        <Heading level={1}>Hooks</Heading>
        <Text size="lg" tone="muted">
          The same React hooks Twico UI&apos;s components and this site are built on — importable from{" "}
          <Code>twico-ui</Code>. All are SSR-safe and fully typed.
        </Text>
      </Stack>

      <Stack as="section" gap={3}>
        <Heading level={2} id="usage">Usage</Heading>
        <Text tone="muted">Import any hook directly from the package:</Text>
        <CodeBlock
          code={'import { useMediaQuery, useDisclosure, useColorScheme } from "twico-ui";\n\nfunction Example() {\n  const isDesktop = useMediaQuery("(min-width: 1024px)");\n  const dialog = useDisclosure();\n  const { isDark, toggle } = useColorScheme();\n  // ...\n}'}
        />
      </Stack>

      {GROUPS.map((g) => (
        <Stack as="section" gap={3} key={g.id}>
          <Heading level={2} id={g.id}>{g.title}</Heading>
          <Table columns={columns} data={g.rows.map(([hook, desc]) => ({ hook, desc }))} rowKey={(r) => r.hook} striped hover={false} />
        </Stack>
      ))}

      <Text style={{ marginTop: "var(--space-4)", fontWeight: "var(--font-semibold)" }}>
        Next:{" "}
        <Link to="/components" style={{ color: "var(--color-primary)", fontWeight: "var(--font-semibold)", textDecoration: "none" }}>
          Browse all components →
        </Link>
      </Text>
    </Stack>
  );
}
