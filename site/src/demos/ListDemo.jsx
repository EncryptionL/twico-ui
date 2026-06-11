import React, { useState } from "react";
import { List } from "twico-ui";

export default function ListDemo() {
  const [selected, setSelected] = useState("Ada Park");
  const people = [
    { name: "Ada Park", email: "ada@twico.dev" },
    { name: "Liam Cho", email: "liam@twico.dev" },
    { name: "Mira Sato", email: "mira@twico.dev" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 360 }}>
      <List
        items={people.map((p) => ({
          title: p.name,
          description: p.email,
          trailing: selected === p.name ? "Selected" : "",
          active: selected === p.name,
          onClick: () => setSelected(p.name),
        }))}
      />
      <List
        plain
        items={[
          { title: "report.pdf", description: "2.4 MB", trailing: "Today" },
          { title: "notes.txt", description: "12 KB", trailing: "Yesterday" },
        ]}
      />
    </div>
  );
}
