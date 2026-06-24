import React from "react";
import { IconButton, useColorScheme } from "twico-ui";
import { SunIcon, MoonIcon } from "twico-ui/icons";

// Dark mode is just the `.dark` class on <html> — Twico UI's useColorScheme hook
// manages that class + localStorage persistence, and every component (portaled
// overlays included) re-themes off it.
export default function ThemeToggle() {
  const { isDark, toggle } = useColorScheme();
  return (
    <IconButton
      variant="ghost"
      icon={isDark ? <SunIcon size={18} /> : <MoonIcon size={18} />}
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={isDark}
    />
  );
}
