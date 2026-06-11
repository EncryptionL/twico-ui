import React from "react";

function getInitial() {
  if (typeof document === "undefined") return false;
  return document.documentElement.classList.contains("dark");
}

// Drives `.dark` on <html> — the contract the whole token system keys off, so the
// entire docs site (and every Twico UI component, including portaled overlays) re-themes.
export default function ThemeToggle() {
  const [dark, setDark] = React.useState(getInitial);

  React.useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", dark);
    try {
      localStorage.setItem("twico-theme", dark ? "dark" : "light");
    } catch (e) {}
  }, [dark]);

  return (
    <button
      type="button"
      className="docs-iconbtn"
      onClick={() => setDark((d) => !d)}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={dark}
      title={dark ? "Light mode" : "Dark mode"}
    >
      {dark ? (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
        </svg>
      )}
    </button>
  );
}
