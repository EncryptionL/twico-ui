import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App.jsx";

// Twico UI's design tokens, reset, and self-hosted fonts (what consumers import as
// "twico-ui/styles.css"). Each component injects its own scoped CSS at runtime.
// No site-specific CSS — the docs site is styled solely by Twico UI components.
import "../../styles/twico-ui.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <HashRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
    <App />
  </HashRouter>
);
