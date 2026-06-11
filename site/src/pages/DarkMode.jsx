import React from "react";
import { Link } from "react-router-dom";
import { Button, Card } from "twico-ui";
import CodeBlock from "../components/CodeBlock.jsx";
import LiveExample from "../components/LiveExample.jsx";

function DarkDemo() {
  const [dark, setDark] = React.useState(
    typeof document !== "undefined" && document.documentElement.classList.contains("dark")
  );
  const toggle = () => {
    const next = !dark;
    document.documentElement.classList.toggle("dark", next);
    setDark(next);
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-start" }}>
      <Button onClick={toggle}>{dark ? "Switch to light" : "Switch to dark"}</Button>
      <Card>The surfaces, text, borders, and shadows here all flip with the theme.</Card>
    </div>
  );
}

export default function DarkMode() {
  return (
    <article className="docs-article">
      <div className="docs-eyebrow">Getting started</div>
      <h1>Dark mode</h1>
      <p className="docs-lead">
        Dark tokens live on the document root. Add the <code>dark</code> class (or{" "}
        <code>data-theme="dark"</code>) to <code>&lt;html&gt;</code> and the whole system re-themes —
        including portaled menus, popovers, and the command palette.
      </p>

      <h2 id="toggle">Toggle it</h2>
      <CodeBlock code={`document.documentElement.classList.toggle("dark");`} />

      <LiveExample>
        <DarkDemo />
      </LiveExample>

      <h2 id="persist">Persist the choice</h2>
      <p>Read a saved preference (or the system setting) before paint to avoid a flash:</p>
      <CodeBlock
        code={`// in <head>, before your app renders
const saved = localStorage.getItem("theme");
const prefersDark = matchMedia("(prefers-color-scheme: dark)").matches;
if (saved === "dark" || (!saved && prefersDark)) {
  document.documentElement.classList.add("dark");
}`}
        language="js"
      />

      <h2 id="next-app-router">Next.js App Router</h2>
      <p>
        Toggle the class on <code>&lt;html&gt;</code> from a Client Component (e.g. a theme button),
        or set it server-side via the <code>className</code> on <code>&lt;html&gt;</code>.
      </p>

      <p className="docs-next">
        Next: <Link to="/docs/accessibility" className="docs-link">Accessibility →</Link>
      </p>
    </article>
  );
}
