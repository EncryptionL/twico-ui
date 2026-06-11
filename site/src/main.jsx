import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App.jsx";
import { CodeLangProvider } from "./components/CodeLang.jsx";

// Twico UI's design tokens, reset, and self-hosted fonts (what consumers import as
// "twico-ui/styles.css"). Each component injects its own scoped CSS at runtime.
// No site-specific CSS — the docs site is styled solely by Twico UI components.
import "../../styles/twico-ui.css";

// Smooth in-page scrolling (TOC clicks, heading anchors, deep links) — unless the
// reader prefers reduced motion. Scoped to the docs site, not the shipped library.
try {
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.documentElement.style.scrollBehavior = "smooth";
  }
} catch (e) {}

ReactDOM.createRoot(document.getElementById("root")).render(
  <HashRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
    <CodeLangProvider>
      <App />
    </CodeLangProvider>
  </HashRouter>
);
