import React, { useState } from "react";
import { Switch } from "twico-ui";

export default function SwitchDemo() {
  const [darkMode, setDarkMode] = useState(true);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Switch
        label="Dark mode"
        checked={darkMode}
        onChange={(e) => setDarkMode(e.target.checked)}
      />
      <Switch
        label="Email notifications"
        description="Send me product updates"
        defaultChecked
      />
      <Switch label="Compact view" size="sm" />
      <Switch label="Beta features" disabled />
    </div>
  );
}
