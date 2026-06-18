import React from "react";
import { Button, CommandPalette } from "twico-ui";

const HomeIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V21h14V9.5" /></svg>
);
const SettingsIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7 1.1V21a2 2 0 1 1-4 0v-.1A1.6 1.6 0 0 0 6 19.4l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0-1.1-2.7H2a2 2 0 1 1 0-4h.1A1.6 1.6 0 0 0 3.6 6l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A1.6 1.6 0 0 0 9 3.6V2a2 2 0 1 1 4 0v.1A1.6 1.6 0 0 0 18 3.6l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0 1.1 2.7H22a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1Z" /></svg>
);
const PlusIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
);
const TrashIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M8 6V4h8v2" /><path d="M19 6l-1 14H6L5 6" /></svg>
);

function GroupedExample() {
  const [open, setOpen] = React.useState(false);
  const commands = [
    { group: "Navigation", label: "Go to Dashboard", description: "Overview and stats", icon: <HomeIcon />, shortcut: "G D", onSelect: () => {} },
    { group: "Navigation", label: "Go to Settings", icon: <SettingsIcon />, shortcut: "G S", onSelect: () => {} },
    { group: "Actions", label: "New project", icon: <PlusIcon />, keywords: "create add", shortcut: "N", onSelect: () => {} },
    { group: "Actions", label: "Invite teammate", keywords: "user member", onSelect: () => {} },
  ];
  return (
    <>
      <Button variant="soft" onClick={() => setOpen(true)}>Open command palette</Button>
      <CommandPalette
        open={open}
        onClose={() => setOpen(false)}
        commands={commands}
        placeholder="Type a command or search…"
        emptyText="No results found"
      />
    </>
  );
}

function FlatExample() {
  const [open, setOpen] = React.useState(false);
  const commands = [
    { label: "Copy link", shortcut: "⌘C", onSelect: () => {} },
    { label: "Duplicate", shortcut: "⌘D", onSelect: () => {} },
    { label: "Rename", onSelect: () => {} },
    { label: "Delete", keywords: "remove trash", onSelect: () => {} },
  ];
  return (
    <>
      <Button onClick={() => setOpen(true)}>Quick actions</Button>
      <CommandPalette
        open={open}
        onClose={() => setOpen(false)}
        commands={commands}
        placeholder="Search actions…"
      />
    </>
  );
}

function HotkeyExample() {
  const [open, setOpen] = React.useState(false);
  React.useEffect(() => {
    const h = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);
  const commands = [
    { group: "Pages", label: "Home", icon: <HomeIcon />, onSelect: () => {} },
    { group: "Pages", label: "Settings", icon: <SettingsIcon />, onSelect: () => {} },
  ];
  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>Press ⌘K / Ctrl+K</Button>
      <CommandPalette
        open={open}
        onClose={() => setOpen(false)}
        commands={commands}
        placeholder="Where would you like to go?"
      />
    </>
  );
}

function EmptyStateExample() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button variant="ghost" onClick={() => setOpen(true)}>Open (empty)</Button>
      <CommandPalette
        open={open}
        onClose={() => setOpen(false)}
        commands={[]}
        placeholder="Nothing here yet…"
        emptyText="No commands available — try syncing your workspace."
      />
    </>
  );
}

function CommandPaletteAllProps() {
  const [open, setOpen] = React.useState(false);
  const commands = [
    {
      id: "go-dashboard",                 // Command.id — stable React key
      group: "Navigation",                // Command.group — heading this item sits under
      label: "Go to Dashboard",           // Command.label — visible primary text (required)
      description: "Overview and stats",  // Command.description — secondary line
      icon: <HomeIcon />,                 // Command.icon — leading SVG
      shortcut: "G D",                    // Command.shortcut — right-aligned hint
      keywords: "home overview metrics",  // Command.keywords — extra search terms
      onSelect: () => {},                 // Command.onSelect — runs on Enter/click, palette closes
    },
    {
      id: "open-settings",
      group: "Navigation",
      label: "Open Settings",
      icon: <SettingsIcon />,
      shortcut: "G S",
      keywords: "preferences config",
      onClick: () => {},                  // Command.onClick — alias used when onSelect is absent
    },
    {
      id: "new-project",
      group: "Actions",
      label: "New project",
      description: "Create a fresh workspace",
      icon: <PlusIcon />,
      shortcut: "N",
      keywords: "create add",
      onSelect: () => {},
    },
    {
      id: "delete-project",
      group: "Actions",
      label: "Delete project",
      icon: <TrashIcon />,
      keywords: "remove trash",
      onSelect: () => {},
    },
  ];
  return (
    <>
      <Button variant="soft" onClick={() => setOpen(true)}>Open (all props)</Button>
      <CommandPalette
        open={open}                       // controlled visibility (drive it yourself)
        onClose={() => setOpen(false)}    // Esc / backdrop / after-select close handler
        commands={commands}              // the searchable command list
        placeholder="Type a command or search…"
        emptyText="No matching commands"
      />
    </>
  );
}

const variations = [
  {
    title: "Grouped with icons & shortcuts",
    description: "Commands organized under group headings, each with a leading icon and a right-aligned shortcut hint.",
    code: `const commands = [
  { group: "Navigation", label: "Go to Dashboard", description: "Overview and stats", icon: <HomeIcon />, shortcut: "G D", onSelect: () => {} },
  { group: "Navigation", label: "Go to Settings", icon: <SettingsIcon />, shortcut: "G S", onSelect: () => {} },
  { group: "Actions", label: "New project", icon: <PlusIcon />, keywords: "create add", shortcut: "N", onSelect: () => {} },
  { group: "Actions", label: "Invite teammate", keywords: "user member", onSelect: () => {} },
];

<CommandPalette
  open={open}
  onClose={() => setOpen(false)}
  commands={commands}
  placeholder="Type a command or search…"
  emptyText="No results found"
/>`,
    render: () => <GroupedExample />,
  },
  {
    title: "Flat list",
    description: "Ungrouped commands (no group key) render as a single plain list.",
    code: `const commands = [
  { label: "Copy link", shortcut: "⌘C", onSelect: () => {} },
  { label: "Duplicate", shortcut: "⌘D", onSelect: () => {} },
  { label: "Rename", onSelect: () => {} },
  { label: "Delete", keywords: "remove trash", onSelect: () => {} },
];

<CommandPalette
  open={open}
  onClose={() => setOpen(false)}
  commands={commands}
  placeholder="Search actions…"
/>`,
    render: () => <FlatExample />,
  },
  {
    title: "Open with ⌘K / Ctrl+K",
    description: "Drive `open` yourself from a global keydown listener for the classic ⌘K launch.",
    code: `const [open, setOpen] = React.useState(false);
React.useEffect(() => {
  const h = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      setOpen(true);
    }
  };
  window.addEventListener("keydown", h);
  return () => window.removeEventListener("keydown", h);
}, []);

<CommandPalette
  open={open}
  onClose={() => setOpen(false)}
  commands={commands}
  placeholder="Where would you like to go?"
/>`,
    render: () => <HotkeyExample />,
  },
  {
    title: "Empty state",
    description: "When `commands` is empty (or nothing matches the query) the `emptyText` message is shown.",
    code: `<CommandPalette
  open={open}
  onClose={() => setOpen(false)}
  commands={[]}
  placeholder="Nothing here yet…"
  emptyText="No commands available — try syncing your workspace."
/>`,
    render: () => <EmptyStateExample />,
  },
  {
    title: "All props",
    description:
      "Every CommandPalette prop and every Command field in one place: controlled open/onClose, commands, placeholder and emptyText — with each command using id, group, label, description, icon, shortcut, keywords and onSelect (plus onClick, the alias used when onSelect is absent).",
    code: `const [open, setOpen] = React.useState(false);

const commands = [
  {
    id: "go-dashboard",                 // Command.id — stable React key
    group: "Navigation",                // Command.group — heading this item sits under
    label: "Go to Dashboard",           // Command.label — visible primary text (required)
    description: "Overview and stats",  // Command.description — secondary line
    icon: <HomeIcon />,                 // Command.icon — leading SVG
    shortcut: "G D",                    // Command.shortcut — right-aligned hint
    keywords: "home overview metrics",  // Command.keywords — extra search terms
    onSelect: () => {},                 // Command.onSelect — runs on Enter/click, palette closes
  },
  {
    id: "open-settings",
    group: "Navigation",
    label: "Open Settings",
    icon: <SettingsIcon />,
    shortcut: "G S",
    keywords: "preferences config",
    onClick: () => {},                  // Command.onClick — alias used when onSelect is absent
  },
  {
    id: "new-project",
    group: "Actions",
    label: "New project",
    description: "Create a fresh workspace",
    icon: <PlusIcon />,
    shortcut: "N",
    keywords: "create add",
    onSelect: () => {},
  },
  {
    id: "delete-project",
    group: "Actions",
    label: "Delete project",
    icon: <TrashIcon />,
    keywords: "remove trash",
    onSelect: () => {},
  },
];

<CommandPalette
  open={open}                       // controlled visibility (drive it yourself)
  onClose={() => setOpen(false)}    // Esc / backdrop / after-select close handler
  commands={commands}              // the searchable command list
  placeholder="Type a command or search…"
  emptyText="No matching commands"
/>`,
    render: () => <CommandPaletteAllProps />,
  },
];

export default variations;
