Dropdown menu with icons, shortcuts, separators, headings, and danger items.

```jsx
import { Menu } from "./Menu";

<Menu
  align="end"
  trigger={<IconButton aria-label="Options" icon={<MoreIcon />} />}
  items={[
    { label: "Account", heading: true },
    { label: "Profile", icon: <UserIcon />, onClick: openProfile, shortcut: "⌘P" },
    { label: "Settings", icon: <SettingsIcon />, onClick: openSettings },
    { separator: true },
    { label: "Sign out", icon: <LogOutIcon />, danger: true, onClick: signOut },
  ]}
/>
```

Item fields: `label`, `icon`, `onClick`, `href` (+ `target`/`rel` — renders the item as a real,
scheme-sanitized `<a role="menuitem">`), `shortcut`, `danger`, `disabled`, `separator`, `heading`.
Extras: `header` (rich node above items), `width`, `align` (start/end), `aria-label` (names the
`role="menu"` popup; a `header` labels it by default). Portaled + keyboard-navigable (↑/↓, Enter,
**Space**, Esc, Home/End, PageUp/PageDown, and type-ahead on printable characters). Keyboard
navigation moves real focus onto the highlighted item (the WAI-ARIA menu-button pattern) and hands
it back to the trigger on close; hovering with a pointer moves the highlight without taking focus.
