import React from "react";
import { IconButton, useColorScheme } from "twico-ui";

const SunIcon = (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
);
const MoonIcon = (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
  </svg>
);

// Dark mode is just the `.dark` class on <html> — Twico UI's useColorScheme hook
// manages that class + localStorage persistence, and every component (portaled
// overlays included) re-themes off it.
export default function ThemeToggle() {
  const { isDark, toggle } = useColorScheme();
  return (
    <IconButton
      variant="ghost"
      icon={isDark ? SunIcon : MoonIcon}
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={isDark}
    />
  );
}
