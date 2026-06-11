import React, { useState } from "react";
import { Sidebar } from "twico-ui";

export default function SidebarDemo() {
  const [collapsed, setCollapsed] = useState(false);
  const items = [
    { section: "Main" },
    { label: "Dashboard", active: true },
    { label: "Inbox", badge: 4 },
    { label: "Reports" },
    { section: "Account" },
    { label: "Settings" },
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
