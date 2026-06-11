import React from "react";
import { Menu, Button } from "twico-ui";

export default function MenuDemo() {
  const items = [
    { label: "Account", heading: true },
    { label: "Profile", onClick: () => {}, shortcut: "⌘P" },
    { label: "Settings", onClick: () => {} },
    { label: "Billing", disabled: true },
    { separator: true },
    { label: "Sign out", danger: true, onClick: () => {} },
  ];
  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
      <Menu align="end" trigger={<Button>Options</Button>} items={items} />
    </div>
  );
}
