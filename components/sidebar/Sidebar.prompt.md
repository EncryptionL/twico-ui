Collapsible side navigation with grouped items, icons, badges, and a collapse toggle.

```jsx
import { Sidebar } from "./Sidebar";

<Sidebar
  brand={<>twico<span style={{color:"var(--color-primary)"}}>UI</span></>}
  items={[
    { section: "Main" },
    { label: "Dashboard", icon: <HomeIcon />, active: true },
    { label: "Inbox", icon: <MailIcon />, badge: 4 },
    { section: "Account" },
    { label: "Settings", icon: <CogIcon /> },
  ]}
  footer={<UserRow />}
/>
```

Items: `{ label, icon?, href?, active?, onClick?, badge? }` or `{ section }`.
Props: `brand`, `footer`, `collapsed`/`defaultCollapsed`, `collapsible`, `onCollapsedChange`.
Give the sidebar a fixed-height parent; it fills it.
