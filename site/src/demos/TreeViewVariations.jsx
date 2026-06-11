import React from "react";
import { TreeView } from "twico-ui";

const FolderIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 5a2 2 0 0 1 2-2h3l2 2h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5Z" /></svg>
);

const FileIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 3v5h5" /><path d="M6 21V5a2 2 0 0 1 2-2h6l5 5v13a0 0 0 0 1 0 0H8a2 2 0 0 1-2-2Z" /></svg>
);

function SelectableTree() {
  const [selectedId, setSelectedId] = React.useState("app");
  return (
    <TreeView
      data={[
        { id: "src", label: "src", children: [
          { id: "app", label: "App.tsx" },
          { id: "index", label: "index.ts" },
        ]},
        { id: "pkg", label: "package.json" },
      ]}
      defaultExpanded={["src"]}
      selectedId={selectedId}
      onSelect={(node) => setSelectedId(node.id)}
    />
  );
}

const variations = [
  {
    title: "File explorer",
    description: "Nested folders with icons. Carets expand and collapse groups.",
    code: `<TreeView
  defaultExpanded={["src", "comp"]}
  data={[
    { id: "src", label: "src", icon: <FolderIcon />, children: [
      { id: "app", label: "App.tsx", icon: <FileIcon /> },
      { id: "comp", label: "components", icon: <FolderIcon />, children: [
        { id: "btn", label: "Button.tsx", icon: <FileIcon /> },
        { id: "tree", label: "TreeView.tsx", icon: <FileIcon /> },
      ]},
    ]},
    { id: "pkg", label: "package.json", icon: <FileIcon /> },
  ]}
/>`,
    render: () => (
      <div style={{ width: 280, maxWidth: "100%" }}>
        <TreeView
          defaultExpanded={["src", "comp"]}
          data={[
            { id: "src", label: "src", icon: <FolderIcon />, children: [
              { id: "app", label: "App.tsx", icon: <FileIcon /> },
              { id: "comp", label: "components", icon: <FolderIcon />, children: [
                { id: "btn", label: "Button.tsx", icon: <FileIcon /> },
                { id: "tree", label: "TreeView.tsx", icon: <FileIcon /> },
              ]},
            ]},
            { id: "pkg", label: "package.json", icon: <FileIcon /> },
          ]}
        />
      </div>
    ),
  },
  {
    title: "With badges",
    description: "Trailing meta on a node — counts, file sizes, or statuses.",
    code: `<TreeView
  defaultExpanded={["inbox"]}
  data={[
    { id: "inbox", label: "Inbox", badge: 12, children: [
      { id: "work", label: "Work", badge: 5 },
      { id: "social", label: "Social", badge: 7 },
    ]},
    { id: "drafts", label: "Drafts", badge: 2 },
    { id: "sent", label: "Sent" },
  ]}
/>`,
    render: () => (
      <div style={{ width: 280, maxWidth: "100%" }}>
        <TreeView
          defaultExpanded={["inbox"]}
          data={[
            { id: "inbox", label: "Inbox", badge: 12, children: [
              { id: "work", label: "Work", badge: 5 },
              { id: "social", label: "Social", badge: 7 },
            ]},
            { id: "drafts", label: "Drafts", badge: 2 },
            { id: "sent", label: "Sent" },
          ]}
        />
      </div>
    ),
  },
  {
    title: "Collapsed by default",
    description: "Omit defaultExpanded to start fully collapsed — only top-level rows show.",
    code: `<TreeView
  data={[
    { id: "docs", label: "Documentation", children: [
      { id: "start", label: "Getting started" },
      { id: "api", label: "API reference" },
    ]},
    { id: "guides", label: "Guides", children: [
      { id: "theming", label: "Theming" },
    ]},
  ]}
/>`,
    render: () => (
      <div style={{ width: 280, maxWidth: "100%" }}>
        <TreeView
          data={[
            { id: "docs", label: "Documentation", children: [
              { id: "start", label: "Getting started" },
              { id: "api", label: "API reference" },
            ]},
            { id: "guides", label: "Guides", children: [
              { id: "theming", label: "Theming" },
            ]},
          ]}
        />
      </div>
    ),
  },
  {
    title: "Controlled selection",
    description: "Drive the highlighted row from state via selectedId + onSelect.",
    code: `function SelectableTree() {
  const [selectedId, setSelectedId] = React.useState("app");
  return (
    <TreeView
      data={[
        { id: "src", label: "src", children: [
          { id: "app", label: "App.tsx" },
          { id: "index", label: "index.ts" },
        ]},
        { id: "pkg", label: "package.json" },
      ]}
      defaultExpanded={["src"]}
      selectedId={selectedId}
      onSelect={(node) => setSelectedId(node.id)}
    />
  );
}`,
    render: () => (
      <div style={{ width: 280, maxWidth: "100%" }}>
        <SelectableTree />
      </div>
    ),
  },
];

export default variations;
