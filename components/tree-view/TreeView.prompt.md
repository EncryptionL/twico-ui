Hierarchical tree (file explorer / nested nav) with expand-collapse and selection.

```jsx
import { TreeView } from "./TreeView";

<TreeView
  defaultExpanded={["src"]}
  onSelect={(node) => open(node.id)}
  data={[
    { id: "src", label: "src", icon: <FolderIcon />, children: [
      { id: "app", label: "App.tsx", icon: <FileIcon /> },
      { id: "comp", label: "components", icon: <FolderIcon />, children: [
        { id: "btn", label: "Button.tsx", icon: <FileIcon /> },
      ]},
    ]},
  ]}
/>
```

Nodes: `{ id, label, icon?, badge?, children? }`. Props: `data`, `defaultExpanded`, `selectedId`, `onSelect`.
