import React, { useState } from "react";
import { Button, CommandPalette } from "twico-ui";

const commands = [
  { group: "Navigation", label: "Go to Dashboard", description: "Overview and stats", shortcut: "G D", onSelect: () => {} },
  { group: "Navigation", label: "Go to Settings", shortcut: "G S", onSelect: () => {} },
  { group: "Actions", label: "New project", keywords: "create add", shortcut: "N", onSelect: () => {} },
  { group: "Actions", label: "Invite teammate", keywords: "user member", onSelect: () => {} },
];

export default function CommandPaletteDemo() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
      <Button variant="soft" onClick={() => setOpen(true)}>Open command palette (or press ⌘K)</Button>
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
