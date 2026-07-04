import React from "react";
import { Link } from "react-router-dom";
import { Stack, Heading, Text, Code } from "twico-ui";
import CodeBlock from "../components/CodeBlock.jsx";

// Each hook: signature, one-line description, and a real, copy-paste usage example.
const GROUPS = [
  {
    id: "state",
    title: "State",
    hooks: [
      {
        sig: "useDisclosure(initial?)",
        desc: "Open/close state for dialogs, drawers, menus, popovers — { open, onOpen, onClose, onToggle, setOpen }.",
        example: `const dialog = useDisclosure();

<Button onClick={dialog.onOpen}>Edit</Button>
<Dialog open={dialog.open} onClose={dialog.onClose} title="Edit">
  …
</Dialog>`,
      },
      {
        sig: "useToggle(initial?)",
        desc: "Boolean state with a stable toggle: toggle() flips, toggle(true) forces a value.",
        example: `const [on, toggle] = useToggle(false);

<Switch checked={on} onChange={() => toggle()} label="Wi-Fi" />`,
      },
      {
        sig: "useControllableState({ value, defaultValue, onChange })",
        desc: "The controlled/uncontrolled pattern every form component needs — works whether or not `value` is passed.",
        example: `function Stars({ value, defaultValue = 0, onChange }) {
  const [val, setVal] = useControllableState({ value, defaultValue, onChange });
  return <button onClick={() => setVal(val + 1)}>{val} ★</button>;
}`,
      },
      {
        sig: "useLocalStorage(key, initial)",
        desc: "State persisted to localStorage (JSON-serialized), SSR-safe — same API as useState.",
        example: `const [name, setName] = useLocalStorage("name", "");

<Input value={name} onChange={(e) => setName(e.target.value)} />`,
      },
      {
        sig: "usePrevious(value)",
        desc: "The value from the previous render (undefined on the first render).",
        example: `const prev = usePrevious(count);
// count just went from \`prev\` → \`count\``,
      },
    ],
  },
  {
    id: "responsive-theme",
    title: "Responsive & theme",
    hooks: [
      {
        sig: "useMediaQuery(query)",
        desc: "Reactively match a media query (SSR-safe — false on the server).",
        example: `const isDesktop = useMediaQuery("(min-width: 1024px)");

return isDesktop ? <Sidebar items={nav} /> : <Drawer>{/* … */}</Drawer>;`,
      },
      {
        sig: "usePrefersReducedMotion()",
        desc: "true when the user has requested reduced motion.",
        example: `const reduce = usePrefersReducedMotion();

<div style={{ transition: reduce ? "none" : "transform .2s" }} />`,
      },
      {
        sig: "useColorScheme(options?)",
        desc: "Light/dark theme synced to .dark on <html> and persisted — { theme, setTheme, toggle, isDark }.",
        example: `const { isDark, toggle } = useColorScheme();

<Button variant="ghost" onClick={toggle}>
  {isDark ? "Light" : "Dark"} mode
</Button>`,
      },
      {
        sig: "useWindowSize()",
        desc: "The current window { width, height } (0×0 on the server).",
        example: `const { width } = useWindowSize();

<Text tone="muted">Viewport is {width}px wide</Text>`,
      },
    ],
  },
  {
    id: "events-dom",
    title: "Events & DOM",
    hooks: [
      {
        sig: "useEventListener(event, handler, target?)",
        desc: "Attach an event listener (window by default, or a ref/element) with automatic cleanup.",
        example: `useEventListener("keydown", (e) => {
  if (e.key === "Escape") close();
});`,
      },
      {
        sig: "useClickOutside(ref, handler)",
        desc: "Call handler when a pointer/touch lands outside the referenced element.",
        example: `const ref = useRef(null);
useClickOutside(ref, () => setOpen(false));

<div ref={ref}>{/* clicking anywhere else closes it */}</div>`,
      },
      {
        sig: "useKeyPress(key, handler, options?)",
        desc: "Run handler on a keydown matching key, with optional { ctrl, meta, shift, alt, preventDefault }.",
        example: `// fire on Escape
useKeyPress("Escape", () => setOpen(false));

// or a shortcut: ⌘K (meta) — set { ctrl: true } for Windows/Linux
useKeyPress("k", openSearch, { meta: true, preventDefault: true });`,
      },
      {
        sig: "useHover(ref)",
        desc: "true while the pointer is over the referenced element.",
        example: `const ref = useRef(null);
const hovered = useHover(ref);

<div ref={ref}>{hovered ? "👋 hi" : "hover me"}</div>`,
      },
      {
        sig: "useIntersectionObserver(ref, options?)",
        desc: "The latest IntersectionObserver entry for the referenced element — for lazy-load / reveal-on-scroll.",
        example: `const ref = useRef(null);
const entry = useIntersectionObserver(ref, { threshold: 0.4 });

<section ref={ref}>{entry?.isIntersecting && <Chart … />}</section>`,
      },
      {
        sig: "useScrollLock(locked?)",
        desc: "Lock body scroll while locked is true (modals/drawers).",
        example: `const dialog = useDisclosure();
useScrollLock(dialog.open); // page can't scroll behind the modal`,
      },
    ],
  },
  {
    id: "timing",
    title: "Timing",
    hooks: [
      {
        sig: "useDebouncedValue(value, delay?)",
        desc: "Debounce a value — updates only after delay ms of no change. Great for search inputs.",
        example: `const [q, setQ] = useState("");
const debounced = useDebouncedValue(q, 300);

useEffect(() => { runSearch(debounced); }, [debounced]);`,
      },
      {
        sig: "useDebouncedCallback(fn, delay?)",
        desc: "A debounced version of a callback (stable identity).",
        example: `const onResize = useDebouncedCallback(() => measure(), 150);
useEventListener("resize", onResize);`,
      },
      {
        sig: "useInterval(fn, delay)",
        desc: "Run fn every delay ms; pass delay = null to pause.",
        example: `const [n, setN] = useState(0);
useInterval(() => setN((v) => v + 1), running ? 1000 : null);`,
      },
      {
        sig: "useTimeout(fn, delay)",
        desc: "Run fn once after delay ms; pass delay = null to cancel.",
        example: `useTimeout(() => setVisible(false), 3000); // auto-hide after 3s`,
      },
    ],
  },
  {
    id: "overlay",
    title: "Overlay",
    hooks: [
      {
        sig: "useFocusTrap(ref, active?, { restoreFocus? })",
        desc: "Trap focus inside a modal region: move focus in on activate, cycle Tab/Shift+Tab within it, restore focus to the trigger on deactivate. Powers Dialog/Drawer/CommandPalette. Escape stays with the component.",
        example: `const ref = useRef(null);
useFocusTrap(ref, open); // focus is trapped while open

<div ref={ref} role="dialog" aria-modal="true">…</div>`,
      },
      {
        sig: "usePortal()",
        desc: "Returns a stable render(node) that portals to document.body (null on the server) — the overlay portal pattern in one hook.",
        example: `const renderPortal = usePortal();
return renderPortal(<div className="overlay">…</div>);`,
      },
    ],
  },
  {
    id: "utilities",
    title: "Utilities",
    hooks: [
      {
        sig: "useCopyToClipboard(timeout?)",
        desc: "Copy text with a copied flag that auto-resets — { copied, copy }.",
        example: `const { copied, copy } = useCopyToClipboard();

<Button onClick={() => copy("npm i twico-ui")}>
  {copied ? "Copied!" : "Copy"}
</Button>`,
      },
      {
        sig: "useId(prefix?)",
        desc: "A stable, SSR-safe unique id — for wiring labels to inputs.",
        example: `const id = useId();

<label htmlFor={id}>Email</label>
<input id={id} type="email" />`,
      },
      {
        sig: "useMounted()",
        desc: "true once mounted on the client — guard client-only UI to avoid hydration mismatches.",
        example: `const mounted = useMounted();
if (!mounted) return null; // render nothing until hydrated`,
      },
      {
        sig: "useIsomorphicLayoutEffect",
        desc: "useLayoutEffect that falls back to useEffect on the server (no SSR warning).",
        example: `useIsomorphicLayoutEffect(() => {
  el.current.style.height = el.current.scrollHeight + "px";
}, [value]);`,
      },
    ],
  },
];

export default function Hooks() {
  return (
    <Stack as="article" gap={5}>
      <Stack as="section" gap={3}>
        <Text as="div" tone="primary" size="xs" weight="bold" style={{ textTransform: "uppercase", letterSpacing: "0.08em" }}>Getting started</Text>
        <Heading level={1}>Hooks</Heading>
        <Text size="lg" tone="muted">
          The same React hooks Twico UI&apos;s components and this site are built on — importable from{" "}
          <Code>twico-ui</Code>. All are SSR-safe and fully typed. Each hook below includes a usage example.
        </Text>
      </Stack>

      <Stack as="section" gap={3}>
        <Heading level={2} id="import">Import</Heading>
        <Text tone="muted">Import any hook directly from the package:</Text>
        <CodeBlock
          code={'import { useDisclosure, useMediaQuery, useColorScheme } from "twico-ui";'}
        />
      </Stack>

      {GROUPS.map((g) => (
        <Stack as="section" gap={4} key={g.id}>
          <Heading level={2} id={g.id}>{g.title}</Heading>
          {g.hooks.map((h) => (
            <Stack gap={2} key={h.sig} style={{ paddingBottom: "var(--space-2)" }}>
              <Code style={{ fontSize: "var(--text-sm)", fontWeight: "var(--font-semibold)", alignSelf: "flex-start" }}>{h.sig}</Code>
              <Text tone="muted" size="sm">{h.desc}</Text>
              <CodeBlock code={h.example} />
            </Stack>
          ))}
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
