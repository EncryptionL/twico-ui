import React, { useState } from "react";
import { Sidebar } from "twico-ui";

const ic = (d) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

export default function SidebarDemo() {
  const [collapsed, setCollapsed] = useState(false);
  const items = [
    { section: "Main" },
    { label: "Dashboard", active: true, icon: ic("M3 12h7V3H3zM14 21h7v-9h-7zM14 3v6h7V3zM3 21h7v-6H3z") },
    { label: "Inbox", badge: 4, icon: ic("M4 4h16v16H4zM4 9h16M9 4v5") },
    { label: "Reports", icon: ic("M3 3v18h18M7 14l4-4 4 4 5-6") },
    { section: "Account" },
    { label: "Settings", icon: ic("M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8M19 12a7 7 0 0 0-.1-1l2-1.6-2-3.4-2.4 1a7 7 0 0 0-1.7-1L14.5 2h-5l-.3 2.6a7 7 0 0 0-1.7 1l-2.4-1-2 3.4L2.6 11a7 7 0 0 0 0 2l-2 1.6 2 3.4 2.4-1a7 7 0 0 0 1.7 1l.3 2.6h5l.3-2.6a7 7 0 0 0 1.7-1l2.4 1 2-3.4-2-1.6a7 7 0 0 0 .1-1z") },
  ];
  return (
    <div style={{ display: "flex", height: 420 }}>
      <Sidebar
        brand={<>twico<span style={{ color: "var(--color-primary)" }}>UI</span></>}
        items={items}
        footer={<span>Jane Doe</span>}
        collapsed={collapsed}
        onCollapsedChange={setCollapsed}
      />
    </div>
  );
}
