import React from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { Box, Stack, Heading, Text, Code } from "twico-ui";
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

const pagerLinkStyle = {
  display: "flex",
  flexDirection: "column",
  gap: 2,
  padding: "var(--space-3) var(--space-4)",
  border: "1px solid var(--color-border)",
  borderRadius: "var(--radius-lg)",
  textDecoration: "none",
};

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
        gap={3}
        aria-label="Component pager"
        style={{ marginTop: "var(--space-10)", borderTop: "1px solid var(--color-border)", paddingTop: "var(--space-5)" }}
      >
        {prev ? (
          <Link to={`/components/${slugify(prev.name)}`} style={pagerLinkStyle}>
            <Text as="span" size="xs" tone="subtle">Previous</Text>
            <Text as="strong" weight="bold">{prev.name}</Text>
          </Link>
        ) : <span />}
        {next ? (
          <Link to={`/components/${slugify(next.name)}`} style={{ ...pagerLinkStyle, textAlign: "right", alignItems: "flex-end" }}>
            <Text as="span" size="xs" tone="subtle">Next</Text>
            <Text as="strong" weight="bold">{next.name}</Text>
          </Link>
        ) : <span />}
      </Stack>
    </Stack>
  );
}
