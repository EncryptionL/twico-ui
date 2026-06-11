import React, { useState } from "react";
import { AvatarMenu } from "twico-ui";

export default function AvatarMenuDemo() {
  const [last, setLast] = useState("");
  const items = [
    { label: "Profile", onClick: () => setLast("Profile") },
    { label: "Settings", shortcut: "⌘,", onClick: () => setLast("Settings") },
    { separator: true },
    { label: "Sign out", danger: true, onClick: () => setLast("Sign out") },
  ];
  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
      <AvatarMenu name="Ada Park" status="online" items={items} />
      <AvatarMenu
        name="Ada Park"
        email="ada@twico.dev"
        status="online"
        showName
        items={items}
      />
      <span>Last action: {last || "none"}</span>
    </div>
  );
}
