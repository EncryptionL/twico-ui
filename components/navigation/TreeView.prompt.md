Hierarchical tree (file explorer / nested nav) with expand-collapse and selection.

```jsx
import { TreeView } from "./TreeView";

<TreeView
  defaultExpanded={["src"]}
  onSelect={(id) => open(id)}
  items={[
    { id: "src", label: "src", icon: <FolderIcon />, children: [
      { id: "app", label: "App.tsx", icon: <FileIcon /> },
      { id: "comp", label: "components", icon: <FolderIcon />, children: [
        { id: "btn", label: "Button.tsx", icon: <FileIcon /> },
      ]},
    ]},
  ]}
/>
```

Nodes: `{ id, label, icon?, badge?, children? }`. Props: `items`, `defaultExpanded`, `selectedId`,
`onSelect(id, node)` (id-first). Full APG tree keyboard support: arrows/Home/End move, treeitems expose
`aria-posinset`/`aria-setsize`, and type-ahead jumps to a node by typing its (string) label.
