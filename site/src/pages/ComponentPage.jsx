import React from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { Stack, Heading, Text } from "twico-ui";
import { components } from "../data/components.js";
import { slugify, groupedComponents } from "../data/site.js";
import CodeBlock from "../components/CodeBlock.jsx";
import LiveExample from "../components/LiveExample.jsx";
import PropsTable from "../components/PropsTable.jsx";
import Variations from "../components/Variations.jsx";
import AnchorHeading from "../components/AnchorHeading.jsx";

// Live demo files are authored per component under src/demos/<Name>Demo.jsx.
const demoLoaders = import.meta.glob("../demos/*Demo.jsx");
// Cache one lazy component per name at module scope. Recreating React.lazy on
// every render makes the demo re-suspend forever under router transitions, which
// stalls client-side navigation (the page only updates after a manual refresh).
const demoCache = {};
function demoComponentFor(name) {
  if (name in demoCache) return demoCache[name];
  const match = Object.keys(demoLoaders).find((p) => p.endsWith(`/${name}Demo.jsx`));
  demoCache[name] = match ? React.lazy(demoLoaders[match]) : null;
  return demoCache[name];
}

function adjacent(name) {
  const flat = groupedComponents(components).flatMap(([, list]) => list);
  const i = flat.findIndex((c) => c.name === name);
  return { prev: flat[i - 1], next: flat[i + 1] };
}

function PagerLink({ to, dir, name }) {
  const [hover, setHover] = React.useState(false);
  const next = dir === "next";
  return (
    <Link
      to={to}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        flex: 1,
        maxWidth: 300,
        display: "flex",
        flexDirection: "column",
        gap: 4,
        padding: "12px 18px",
        border: `1px solid ${hover ? "var(--color-primary)" : "var(--color-border)"}`,
        borderRadius: "var(--radius-lg)",
        background: hover ? "var(--color-surface-sunken)" : "transparent",
        textDecoration: "none",
        textAlign: next ? "right" : "left",
        transition: "border-color var(--duration-fast) var(--ease-standard), background var(--duration-fast) var(--ease-standard)",
      }}
    >
      <Text as="span" size="xs" tone="subtle">{next ? "Next" : "Previous"}</Text>
      <Text as="span" weight="bold" style={{ color: hover ? "var(--color-primary)" : "var(--color-text)" }}>
        {next ? `${name} →` : `← ${name}`}
      </Text>
    </Link>
  );
}

export default function ComponentPage() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const comp = components.find((c) => slugify(c.name) === slug);

  // Deep link: ?s=<section> scrolls to that anchor (waiting for lazy sections).
  React.useEffect(() => {
    const s = searchParams.get("s");
    if (!s) return undefined;
    const t = setTimeout(() => {
      const el = document.getElementById(s);
      if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 84, behavior: "smooth" });
    }, 250);
    return () => clearTimeout(t);
  }, [searchParams, slug]);

  if (!comp) {
    return (
      <Stack as="article" gap={5}>
        <Heading level={1}>Not found</Heading>
        <Text tone="muted">No component matches “{slug}”.</Text>
        <Link to="/components" style={{ color: "var(--color-primary)", fontWeight: "var(--font-semibold)", textDecoration: "none" }}>← All components</Link>
      </Stack>
    );
  }

  const Demo = demoComponentFor(comp.name);
  const importLine = `import { ${comp.importName} } from "twico-ui";`;
  const importLineTs = `${importLine}\nimport type { ${comp.name}Props } from "twico-ui";`;
  const { prev, next } = adjacent(comp.name);

  return (
    <Stack as="article" gap={5}>
      <Stack as="section" gap={3}>
        <Text as="div" tone="primary" size="xs" weight="bold" style={{ textTransform: "uppercase", letterSpacing: "0.08em" }}>{comp.group}</Text>
        <AnchorHeading level={1} slug={slug}>{comp.name}</AnchorHeading>
        <Text size="lg" tone="muted">{comp.tagline}</Text>
      </Stack>

      <Stack as="section" gap={3}>
        <AnchorHeading slug={slug} section="import">Import</AnchorHeading>
        <CodeBlock code={importLine} tsCode={importLineTs} />
      </Stack>

      <Stack as="section" gap={3}>
        <AnchorHeading slug={slug} section="usage">Usage</AnchorHeading>
        <LiveExample code={comp.snippet}>
          {Demo ? (
            <React.Suspense fallback={<Text tone="muted">Loading preview…</Text>}>
              <Demo />
            </React.Suspense>
          ) : null}
        </LiveExample>
      </Stack>

      <Variations name={comp.name} slug={slug} />

      <Stack as="section" gap={3}>
        <AnchorHeading slug={slug} section="props">Props</AnchorHeading>
        <PropsTable rows={comp.propsRows} />
      </Stack>

      <Stack
        as="nav"
        direction="row"
        justify="space-between"
        gap={4}
        aria-label="Component pager"
        style={{ marginTop: "var(--space-10)", borderTop: "1px solid var(--color-border)", paddingTop: "var(--space-6)" }}
      >
        {prev ? <PagerLink to={`/components/${slugify(prev.name)}`} dir="prev" name={prev.name} /> : <span style={{ flex: 1 }} />}
        {next ? <PagerLink to={`/components/${slugify(next.name)}`} dir="next" name={next.name} /> : <span style={{ flex: 1 }} />}
      </Stack>
    </Stack>
  );
}
