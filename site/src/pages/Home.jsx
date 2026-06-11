import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button, Badge } from "twico-ui";
import CodeBlock from "../components/CodeBlock.jsx";
import ErrorBoundary from "../components/ErrorBoundary.jsx";
import { components } from "../data/components.js";

const FEATURES = [
  { title: "53 components", body: "Buttons, inputs, selects, overlays, a full Datatable, and more — everything a web app needs." },
  { title: "Token-themed", body: "Every color, radius, shadow, and font is a CSS variable. Rebrand by overriding a handful of them." },
  { title: "Dark mode", body: "A single `.dark` class on <html> re-themes the whole system, portaled overlays included." },
  { title: "Accessible", body: "ARIA roles, keyboard navigation, focus trapping in modals, and reduced-motion support." },
  { title: "React + Next.js", body: "Ships a \"use client\" boundary, so it drops straight into the Next.js App Router." },
  { title: "Truly free", body: "MIT licensed, no paid tiers, no premium add-ons. Use it anywhere, commercial or not." },
];

export default function Home() {
  const navigate = useNavigate();
  return (
    <div className="home">
      <section className="home-hero">
        <div className="home-hero__badge">Free &amp; open source · MIT</div>
        <h1 className="home-hero__title">
          The free React component library
          <br /> that themes to <span className="home-hero__accent">your</span> brand.
        </h1>
        <p className="home-hero__sub">
          Twico UI is a modern, themeable component library with dark mode, lively motion, and
          accessibility built in — styled entirely with CSS design tokens. No runtime CSS framework required.
        </p>

        <div className="home-hero__install">
          <CodeBlock code="npm install twico-ui" language="bash" />
        </div>

        <div className="home-hero__cta">
          <ErrorBoundary>
            <Button onClick={() => navigate("/docs/installation")}>Get started</Button>
            <Button variant="secondary" onClick={() => navigate("/components")}>
              Browse components
            </Button>
          </ErrorBoundary>
        </div>

        <div className="home-hero__meta">
          Requires React 18+ · {components.length || 53} components ·{" "}
          <Link to="/docs/dark-mode" className="docs-link">dark mode</Link> ·{" "}
          <Link to="/docs/accessibility" className="docs-link">accessible</Link>
        </div>
      </section>

      <section className="home-features">
        {FEATURES.map((f) => (
          <div className="home-feature" key={f.title}>
            <div className="home-feature__title">
              {f.title} {f.title === "53 components" ? <Badge>core</Badge> : null}
            </div>
            <p className="home-feature__body">{f.body}</p>
          </div>
        ))}
      </section>

      <section className="home-cta-band">
        <h2>Dogfooded, not theoretical.</h2>
        <p>
          This entire site is built with Twico UI — every button, badge, and dark-mode toggle you
          see is a component from the library.
        </p>
        <div className="home-cta-band__actions">
          <Button onClick={() => navigate("/components")}>Explore the components</Button>
        </div>
      </section>
    </div>
  );
}
