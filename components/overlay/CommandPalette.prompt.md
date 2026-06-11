⌘K command palette — searchable, grouped, keyboard-navigable command menu.

```jsx
import { CommandPalette } from "./CommandPalette";

const [open, setOpen] = React.useState(false);
React.useEffect(() => {
  const h = (e) => { if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setOpen(true); } };
  window.addEventListener("keydown", h); return () => window.removeEventListener("keydown", h);
}, []);

<CommandPalette open={open} onClose={() => setOpen(false)} commands={[
  { group: "Navigation", label: "Go to Dashboard", icon: <HomeIcon />, shortcut: "G D", onSelect: goDash },
  { group: "Actions", label: "New project", icon: <PlusIcon />, keywords: "create add", onSelect: create },
]} />
```

Commands: `{ label, description?, icon?, shortcut?, group?, keywords?, onSelect }`. Keyboard: ↑/↓, Enter, Esc.
