import React, { useState } from "react";
import { Tabs } from "twico-ui";

export default function TabsDemo() {
  const [value, setValue] = useState("overview");
  const items = [
    { value: "overview", label: "Overview", content: <p>Project overview and key metrics.</p> },
    { value: "activity", label: "Activity", count: 12, content: <p>Recent activity feed.</p> },
    { value: "settings", label: "Settings", content: <p>Workspace settings.</p> },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Tabs variant="line" value={value} onChange={setValue} items={items} />
      <Tabs variant="pill" defaultValue="activity" items={items} />
    </div>
  );
}
