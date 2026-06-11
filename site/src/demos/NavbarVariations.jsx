import React from "react";
import { Navbar, Button, IconButton, Avatar } from "twico-ui";

const HomeIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V21h14V9.5" /></svg>
);
const FolderIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" /></svg>
);
const UsersIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="8" r="3" /><path d="M3 20a6 6 0 0 1 12 0" /><path d="M16 5.5a3 3 0 0 1 0 5M21 20a6 6 0 0 0-4-5.6" /></svg>
);
const BellIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6Z" /><path d="M10 20a2 2 0 0 0 4 0" /></svg>
);

// Active link state is driven by onClick, so this lives in a small local component.
function ActiveLinksExample() {
  const [active, setActive] = React.useState("Dashboard");
  const items = ["Dashboard", "Projects", "Team"];
  return (
    <Navbar
      brand={<>twico<span style={{ color: "var(--color-primary)" }}>UI</span></>}
      links={items.map((label) => ({
        label,
        active: active === label,
        onClick: () => setActive(label),
      }))}
      actions={<Button size="sm">Sign in</Button>}
    />
  );
}

const variations = [
  {
    title: "Brand, links, and actions",
    description: "The full layout: brand on the left, nav links in the middle, actions on the right.",
    code: `<Navbar
  brand={<>twico<span style={{ color: "var(--color-primary)" }}>UI</span></>}
  links={[
    { label: "Dashboard", active: true },
    { label: "Projects" },
    { label: "Team" },
  ]}
  actions={<Button size="sm">Sign in</Button>}
/>`,
    render: () => (
      <Navbar
        brand={<>twico<span style={{ color: "var(--color-primary)" }}>UI</span></>}
        links={[
          { label: "Dashboard", active: true },
          { label: "Projects" },
          { label: "Team" },
        ]}
        actions={<Button size="sm">Sign in</Button>}
      />
    ),
  },
  {
    title: "Selectable links",
    description: "Use active + onClick to drive the highlighted link from your own state.",
    code: `function ActiveLinksExample() {
  const [active, setActive] = React.useState("Dashboard");
  const items = ["Dashboard", "Projects", "Team"];
  return (
    <Navbar
      brand={<>twico<span style={{ color: "var(--color-primary)" }}>UI</span></>}
      links={items.map((label) => ({
        label,
        active: active === label,
        onClick: () => setActive(label),
      }))}
      actions={<Button size="sm">Sign in</Button>}
    />
  );
}`,
    render: () => <ActiveLinksExample />,
  },
  {
    title: "Links with icons",
    description: "Each link accepts an optional icon node rendered before its label.",
    code: `<Navbar
  brand="Acme"
  links={[
    { label: "Home", icon: <HomeIcon />, active: true },
    { label: "Files", icon: <FolderIcon /> },
    { label: "Team", icon: <UsersIcon /> },
  ]}
/>`,
    render: () => (
      <Navbar
        brand="Acme"
        links={[
          { label: "Home", icon: <HomeIcon />, active: true },
          { label: "Files", icon: <FolderIcon /> },
          { label: "Team", icon: <UsersIcon /> },
        ]}
      />
    ),
  },
  {
    title: "Rich actions slot",
    description: "Drop any nodes into actions — here an icon button plus an avatar.",
    code: `<Navbar
  brand={<>twico<span style={{ color: "var(--color-primary)" }}>UI</span></>}
  links={[
    { label: "Overview", active: true },
    { label: "Reports" },
  ]}
  actions={<>
    <IconButton aria-label="Notifications" icon={<BellIcon />} />
    <Avatar name="Ada Park" size="sm" />
  </>}
/>`,
    render: () => (
      <Navbar
        brand={<>twico<span style={{ color: "var(--color-primary)" }}>UI</span></>}
        links={[
          { label: "Overview", active: true },
          { label: "Reports" },
        ]}
        actions={
          <>
            <IconButton aria-label="Notifications" icon={<BellIcon />} />
            <Avatar name="Ada Park" size="sm" />
          </>
        }
      />
    ),
  },
  {
    title: "Non-sticky bar",
    description: "Set sticky={false} to opt out of the translucent, blurred sticky top bar.",
    code: `<Navbar
  sticky={false}
  brand="Docs"
  links={[
    { label: "Guide", active: true },
    { label: "API" },
  ]}
  actions={<Button size="sm" variant="outline">GitHub</Button>}
/>`,
    render: () => (
      <Navbar
        sticky={false}
        brand="Docs"
        links={[
          { label: "Guide", active: true },
          { label: "API" },
        ]}
        actions={<Button size="sm" variant="outline">GitHub</Button>}
      />
    ),
  },
];

export default variations;
