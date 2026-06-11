import React, { useState } from "react";
import { TreeView } from "twico-ui";

const data = [
  { id: "src", label: "src", children: [
    { id: "app", label: "App.tsx" },
    { id: "comp", label: "components", badge: 2, children: [
      { id: "btn", label: "Button.tsx" },
      { id: "tree", label: "TreeView.tsx" },
    ]},
  ]},
  { id: "pkg", label: "package.json" },
];

export default function TreeViewDemo() {
  const [selectedId, setSelectedId] = useState("app");
  return (
    <TreeView
      data={data}
      defaultExpanded={["src", "comp"]}
      selectedId={selectedId}
      onSelect={(node) => setSelectedId(node.id)}
    />
  );
}
