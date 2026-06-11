import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App.jsx";

// Twico UI's design tokens, reset, and self-hosted fonts (what consumers import as
// "twico-ui/styles.css"). Each component injects its own scoped CSS at runtime.
import "../../styles/twico-ui.css";
import "./docs.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <HashRouter>
    <App />
  </HashRouter>
);
