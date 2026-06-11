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

Item fields: `label`, `icon`, `onClick`, `shortcut`, `danger`, `disabled`, `separator`, `heading`.
Extras: `header` (rich node above items), `width`, `align` (start/end). Portaled + keyboard-navigable (↑/↓, Enter, Esc).
