import React, { useState } from "react";
import { CommandPalette } from "twico-ui";

const commands = [
  { group: "Navigation", label: "Go to Dashboard", description: "Overview and stats", shortcut: "G D", onSelect: () => alert("Dashboard") },
  { group: "Navigation", label: "Go to Settings", shortcut: "G S", onSelect: () => alert("Settings") },
  { group: "Actions", label: "New project", keywords: "create add", shortcut: "N", onSelect: () => alert("New project") },
  { group: "Actions", label: "Invite teammate", keywords: "user member", onSelect: () => alert("Invite") },
];

export default function CommandPaletteDemo() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
      <button onClick={() => setOpen(true)}>Open command palette (or press the button)</button>
      <CommandPalette
        open={open}
        onClose={() => setOpen(false)}
        commands={commands}
        placeholder="Type a command or search…"
        emptyText="No results found"
      />
    </div>
  );
}
