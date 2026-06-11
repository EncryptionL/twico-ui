import React from "react";
import { Sidebar } from "twico-ui";

const ic = (d) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const HomeIcon = () => ic("M3 12h7V3H3zM14 21h7v-9h-7zM14 3v6h7V3zM3 21h7v-6H3z");
const InboxIcon = () => ic("M4 4h16v16H4zM4 9h16M9 4v5");
const ReportsIcon = () => ic("M3 3v18h18M7 14l4-4 4 4 5-6");
const CogIcon = () => ic("M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8M19 12a7 7 0 0 0-.1-1l2-1.6-2-3.4-2.4 1a7 7 0 0 0-1.7-1L14.5 2h-5l-.3 2.6a7 7 0 0 0-1.7 1l-2.4-1-2 3.4L2.6 11a7 7 0 0 0 0 2l-2 1.6 2 3.4 2.4-1a7 7 0 0 0 1.7 1l.3 2.6h5l.3-2.6a7 7 0 0 0 1.7-1l2.4 1 2-3.4-2-1.6a7 7 0 0 0 .1-1z");

const Brand = () => (
  <>twico<span style={{ color: "var(--color-primary)" }}>UI</span></>
);

const fullItems = [
  { section: "Main" },
  { label: "Dashboard", active: true, icon: <HomeIcon /> },
  { label: "Inbox", badge: 4, icon: <InboxIcon /> },
  { label: "Reports", icon: <ReportsIcon /> },
  { section: "Account" },
  { label: "Settings", icon: <CogIcon /> },
];

const variations = [
  {
    title: "Sections, icons and badges",
    description: "Grouped nav items with icons, an active row, a count badge, and a footer.",
    code: `<Sidebar
  brand={<>twico<span style={{ color: "var(--color-primary)" }}>UI</span></>}
  items={[
    { section: "Main" },
    { label: "Dashboard", active: true, icon: <HomeIcon /> },
    { label: "Inbox", badge: 4, icon: <InboxIcon /> },
    { label: "Reports", icon: <ReportsIcon /> },
    { section: "Account" },
    { label: "Settings", icon: <CogIcon /> },
  ]}
  footer={<span>Jane Doe</span>}
/>`,
    render: () => (
      <div style={{ display: "flex", height: 420 }}>
        <Sidebar
          brand={<Brand />}
          items={fullItems}
          footer={<span>Jane Doe</span>}
        />
      </div>
    ),
  },
  {
    title: "Collapsed by default",
    description: "Uncontrolled icon-only mode via defaultCollapsed — labels, badges and sections hide.",
    code: `<Sidebar
  brand={<>twico<span style={{ color: "var(--color-primary)" }}>UI</span></>}
  items={items}
  footer={<span>Jane Doe</span>}
  defaultCollapsed
/>`,
    render: () => (
      <div style={{ display: "flex", height: 420 }}>
        <Sidebar
          brand={<Brand />}
          items={fullItems}
          footer={<span>Jane Doe</span>}
          defaultCollapsed
        />
      </div>
    ),
  },
  {
    title: "Without collapse toggle",
    description: "Set collapsible={false} to pin the sidebar fully expanded with no toggle button.",
    code: `<Sidebar
  brand={<>twico<span style={{ color: "var(--color-primary)" }}>UI</span></>}
  items={items}
  collapsible={false}
/>`,
    render: () => (
      <div style={{ display: "flex", height: 420 }}>
        <Sidebar
          brand={<Brand />}
          items={fullItems}
          collapsible={false}
        />
      </div>
    ),
  },
  {
    title: "Links with href",
    description: "Items can render as anchors — pass href and they become navigable links.",
    code: `<Sidebar
  brand={<>twico<span style={{ color: "var(--color-primary)" }}>UI</span></>}
  items={[
    { label: "Home", href: "#home", active: true, icon: <HomeIcon /> },
    { label: "Reports", href: "#reports", icon: <ReportsIcon /> },
    { label: "Settings", href: "#settings", icon: <CogIcon /> },
  ]}
/>`,
    render: () => (
      <div style={{ display: "flex", height: 420 }}>
        <Sidebar
          brand={<Brand />}
          items={[
            { label: "Home", href: "#home", active: true, icon: <HomeIcon /> },
            { label: "Reports", href: "#reports", icon: <ReportsIcon /> },
            { label: "Settings", href: "#settings", icon: <CogIcon /> },
          ]}
        />
      </div>
    ),
  },
  {
    title: "Minimal — no brand or footer",
    description: "Just a flat list of nav items, no header or footer chrome.",
    code: `<Sidebar
  items={[
    { label: "Dashboard", active: true, icon: <HomeIcon /> },
    { label: "Inbox", badge: 4, icon: <InboxIcon /> },
    { label: "Reports", icon: <ReportsIcon /> },
  ]}
/>`,
    render: () => (
      <div style={{ display: "flex", height: 420 }}>
        <Sidebar
          items={[
            { label: "Dashboard", active: true, icon: <HomeIcon /> },
            { label: "Inbox", badge: 4, icon: <InboxIcon /> },
            { label: "Reports", icon: <ReportsIcon /> },
          ]}
        />
      </div>
    ),
  },
];

export default variations;
