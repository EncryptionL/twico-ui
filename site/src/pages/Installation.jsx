import React from "react";
import { Link } from "react-router-dom";
import CodeBlock from "../components/CodeBlock.jsx";

export default function Installation() {
  return (
    <article className="docs-article">
      <div className="docs-eyebrow">Getting started</div>
      <h1>Installation</h1>
      <p className="docs-lead">
        Twico UI works in any React 18+ app. Install the package, import the stylesheet once, and
        start using components.
      </p>

      <h2 id="install">Install</h2>
      <CodeBlock code="npm install twico-ui" language="bash" />
      <p className="docs-muted">
        <code>react</code> and <code>react-dom</code> are peer dependencies (React 18 or newer).
      </p>

      <h2 id="react">React (Vite / CRA)</h2>
      <p>Import the stylesheet once at your entry, then use components anywhere:</p>
      <CodeBlock
        code={`// main.jsx
import "twico-ui/styles.css";`}
      />
      <CodeBlock
        code={`// App.jsx
import { Button, Datatable, Input } from "twico-ui";

export default function App() {
  return (
    <div>
      <Input label="Email" placeholder="you@example.com" />
      <Button>Save changes</Button>
    </div>
  );
}`}
      />

      <h2 id="next-app">Next.js — App Router</h2>
      <p>
        Import the CSS once in the root layout. Every component ships a <code>"use client"</code>{" "}
        boundary, so it drops straight into Server Components without extra wrapping.
      </p>
      <CodeBlock
        code={`// app/layout.tsx
import "twico-ui/styles.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}`}
      />
      <CodeBlock
        code={`// app/page.tsx — a Server Component, no "use client" needed
import { Stat, Button } from "twico-ui";

export default function Page() {
  return (
    <main>
      <Stat label="Revenue" value="$48,200" delta="+12.5%" />
      <Button>Get started</Button>
    </main>
  );
}`}
      />

      <h2 id="next-pages">Next.js — Pages Router</h2>
      <CodeBlock
        code={`// pages/_app.tsx
import "twico-ui/styles.css";

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}`}
      />

      <h2 id="ssr">SSR &amp; hydration</h2>
      <ul className="docs-list">
        <li>Components are <strong>SSR-safe</strong> — nothing touches <code>window</code>/<code>document</code> during render; all browser access is inside effects and handlers.</li>
        <li>The global stylesheet provides tokens, the reset, and self-hosted fonts at first paint.</li>
        <li>Overlays (Menu, Popover, Select, Dialog, Drawer, CommandPalette) render through portals only while open, so they never run on the server.</li>
      </ul>

      <p className="docs-next">
        Next: <Link to="/docs/theming" className="docs-link">Theming →</Link>
      </p>
    </article>
  );
}
