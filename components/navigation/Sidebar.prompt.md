Collapsible side navigation with grouped items, icons, badges, and a collapse toggle.

```jsx
import { Sidebar } from "./Sidebar";

<Sidebar
  brand={<>Twico <span style={{color:"var(--color-primary)"}}>UI</span></>}
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
Props: `brand`, `footer`, `collapsed`/`defaultCollapsed`, `collapsible`, `onCollapsedChange`, `navLabel`,
plus the off-canvas set: `overlay`, `open`/`defaultOpen`, `onOpenChange`.
The inner `<nav>` is a named landmark (`navLabel`, default "Main"), items are proper list items grouped
under their section headings, and the collapse toggle exposes `aria-expanded`/`aria-controls`. Give the
sidebar a fixed-height parent; it fills it.

**Mobile off-canvas drawer.** Set `overlay` to render the sidebar as a slide-over drawer instead of an
in-flow rail: a fixed panel behind a dismissable backdrop, portaled to `<body>`, with a focus trap,
Escape-to-close, and body-scroll lock (the same overlay pattern as `Drawer`). Drive it with
`open`/`defaultOpen`/`onOpenChange`:

```jsx
const isMobile = useMediaQuery("(max-width: 720px)");
const [open, setOpen] = useState(false);

<Sidebar overlay={isMobile} open={open} onOpenChange={setOpen} items={items} />
```

Typically the rail shows on desktop and the drawer on mobile (gate `overlay` on a `useMediaQuery`),
with a `Navbar`'s `onMenuClick` calling `() => setOpen(true)`. `AppShell` can wire this for you — see
its `sidebarOpen`/`onSidebarOpenChange` props.
