# Twico UI — LLM usage guide (llms.txt)

Twico UI is a free, MIT-licensed **React component library**: 62 components and 23 standalone
hooks (plus the `useToast` hook), with dark mode, motion, accessibility, RTL, a density scale, and
design tokens. **Zero runtime dependencies** (peer: `react`/`react-dom` >= 18).

This file is the authoritative guide for writing application code with the **`twico-ui` npm package**.
The component and hook reference below is generated from the library's own TypeScript types and
component data, so every component, prop, and example reflects the shipped API. When you generate
code that uses Twico UI, follow the setup and conventions here, then use the per-component sections
for exact props.

> Not to be confused with `SKILL.md` / `DESIGN-SYSTEM.md`, which are for generating static HTML
> design mockups from the design-system bundle. This guide is for **real React app code**.

## Install & setup (do this once)

```bash
npm install twico-ui
```

Import the stylesheet **once** at your app root — this is the only CSS you import:

```jsx
import "twico-ui/styles.css";
```

Then import components and hooks by name from the package root:

```jsx
import { Button, Input, Dialog, useColorScheme } from "twico-ui";
```

Rules that matter:

- **Do not import any per-component CSS — there is none.** The single `twico-ui/styles.css` carries
  the design tokens, base reset, and self-hosted fonts; each component injects its own scoped CSS at
  runtime. Importing `twico-ui/styles.css` more than once is harmless but unnecessary.
- The package ships a `"use client"` directive, so it works in the **Next.js App Router / React
  Server Components** out of the box — import it into client trees directly.
- **SSR-safe**: components never touch `window`/`document` during render.
- **Peer deps**: `react` and `react-dom` >= 18 (works with React 18 and 19).
- TypeScript types ship with the package; every component's props type is exported (e.g.
  `ButtonProps`).

## Dark mode

Dark mode is a class/attribute on the `<html>` element — add `class="dark"` (or `data-theme="dark"`):

```html
<html class="dark">
```

Or manage it in React with the built-in hook (persists to `localStorage`, syncs across tabs/instances):

```jsx
import { useColorScheme, Button } from "twico-ui";

function ThemeToggle() {
  const { isDark, toggle } = useColorScheme();
  return <Button variant="ghost" onClick={toggle}>{isDark ? "Light" : "Dark"}</Button>;
}
```

Only the semantic color aliases flip in dark mode; the primitive scales stay constant.

## Theming (design tokens)

Everything is styled through CSS custom properties, so you re-skin by overriding tokens at `:root`
(or any scope) — no component props or config needed:

```css
:root {
  --brand-500: #8b5cf6;   /* rebrand: remap the primary scale */
  --radius-md: 8px;        /* tighter corners everywhere */
}
```

Token families: `--color-*` (semantic: `primary`, `success`, `warning`, `danger`, `info`, `bg`,
`surface`, `text`, `border`, …), `--brand-*` / `--indigo-*` (primary scale, 50–950), `--radius-*`,
`--shadow-*`, `--space-*`, `--text-*`, `--font-*`, `--duration-*` / `--ease-*`. The primitive color
scales are also importable as JS objects: `import { indigo, slate } from "twico-ui/colors"`.

- **Density**: set `data-density="compact"` or `"comfortable"` on any ancestor to retune control
  heights for everything inside — no per-component prop.
- **RTL**: set `dir="rtl"` on any ancestor; components use logical properties and mirror automatically.

## Controlled vs uncontrolled (read before using inputs)

Every form component supports both modes:

- **Uncontrolled**: pass `defaultValue`, read changes via `onChange`.
- **Controlled**: pass `value` + `onChange` and own the state.

The `onChange` payload differs by component kind:

- **Composite controls** (Select, MultiSelect, Combobox, Slider, Rating, Tabs, DatePicker,
  DateRangePicker, ColorPicker, …) call **`onChange(value)`** — you receive the value directly.
- **Native input controls** (Input, Textarea, and the toggle family Checkbox / Switch / Radio) call
  **`onChange(event)`** — read `event.target.value` (or `event.target.checked` for the toggles).
- Currency / CurrencyField are specialized money inputs — see their sections for their exact
  `value`/`onChange` shape.

```jsx
// controlled text input (native — event payload)
const [email, setEmail] = useState("");
<Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />

// controlled select (composite — value payload)
const [role, setRole] = useState("editor");
<Select
  value={role}
  onChange={setRole}
  options={[{ value: "admin", label: "Admin" }, { value: "editor", label: "Editor" }]}
/>
```

The `Field` component is a shared label/hint/error/required wrapper for any control. The
`useControllableState` hook implements this exact controlled/uncontrolled pattern if you build your own.

## Overlays (Dialog, Drawer, Menu, Popover, CommandPalette, Tooltip)

- **Modal overlays — Dialog and Drawer — are driven by `open` + `onClose`:**

```jsx
const [open, setOpen] = useState(false);
<Button onClick={() => setOpen(true)}>Open</Button>
<Dialog open={open} onClose={() => setOpen(false)} title="Confirm" description="Are you sure?">
  …body…
</Dialog>
```

- **Anchored overlays — Menu and Popover — take a `trigger` node** and use `open` / `defaultOpen` +
  `onOpenChange` (uncontrolled by default — just pass `trigger` and `items`).
- All portal to `document.body`, animate in **and** out, and dismiss on backdrop click / Escape;
  `prefers-reduced-motion` is respected.
- The `useDisclosure` hook is a convenient open/close state helper for driving these.

## Toasts

Wrap your app **once** in `ToastProvider`, then call the imperative `useToast` hook anywhere beneath
it. `useToast()` returns an object — **destructure `toast`**:

```jsx
import { ToastProvider, useToast, Button } from "twico-ui";

function App() {
  return (
    <ToastProvider limit={4}>
      <Page />
    </ToastProvider>
  );
}

function Page() {
  const { toast } = useToast();
  // toast.success / .error / .warning / .info / .danger(title, options?)
  return <Button onClick={() => toast.success("Saved")}>Save</Button>;
}
```

## Icons

Components take icons as **React nodes** via props like `leftIcon`, `rightIcon`, `icon`, `header` —
bring any icon (inline SVG, or any icon library). Icons inherit `currentColor` and the control's size.

For convenience, **`twico-ui/icons` re-exports the full [Lucide](https://lucide.dev) icon set** (the
visual language Twico UI is built on) **plus 31 curated brand icons** Lucide omits. Lucide icons need
the **optional peer** `lucide-react` (`npm install lucide-react`) and are tree-shakeable; the brand
icons (`GithubIcon`, `VercelIcon`, `FigmaIcon`, `XTwitterIcon`, …) are zero-dependency inline SVG
built in — **no peer needed**. The core `twico-ui` package itself stays zero-dependency. All icons
are plain SVG components (no hooks), so they work in Server Components too. Names use the `*Icon`
suffix; icons take `size` (default 24) and `color` (default `currentColor`).

```jsx
import { HomeIcon, SearchIcon } from "twico-ui/icons"; // Lucide — needs the optional `lucide-react` peer
import { GithubIcon } from "twico-ui/icons";           // brand — no peer needed
<Button leftIcon={<HomeIcon size={16} />}>Home</Button>
<Button variant="outline" leftIcon={<GithubIcon size={16} />}>Star</Button>

// …or pass your own inline SVG (no peer needed):
<Button leftIcon={<svg width="16" height="16" viewBox="0 0 24 24" /* … */ />}>Add item</Button>
```

## Shared prop vocabulary

- `size`: `"sm" | "md" | "lg"` (default `"md"`); a few components add `"xs"`/`"full"`.
- `tone`: semantic color. Status components expose `"primary" | "neutral" | "success" | "warning" |
  "danger" | "info"`; action components (Button, IconButton) expose `"primary" | "danger"`.
- `variant`: fill style — commonly `"solid" | "soft" | "outline" | "ghost"` (the exact set varies per
  component; see each section).
- `value` / `defaultValue` / `onChange`: the controlled/uncontrolled triad.
- `items` / `options`: array-driven content.
- `label` / `hint` / `error` / `required`: form labelling (or use the `Field` wrapper).

**Every component also accepts the standard DOM attributes for its root element** (`className`, `id`,
`style`, `data-*`, `aria-*`) and forwards remaining props and event handlers via `...rest`. To keep
this guide focused, the per-component "Props" lists below show only the **component-specific** props
(the generic DOM passthrough is omitted).

## How to read the reference below

For each component: a one-line summary, its import, the component-specific props as
`` `name` `` — type · *required* or default — what it does, and a copy-paste example. Object-shaped
types referenced in props (e.g. `SelectOption`, `AccordionItem`, `DatatableColumn`) are illustrated
in the examples.
