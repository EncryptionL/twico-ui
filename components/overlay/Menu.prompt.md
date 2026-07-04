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
`role="menu"` popup; a `header` labels it by default). Portaled + keyboard-navigable (↑/↓, Enter, Esc).
