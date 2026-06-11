import React from "react";
import { useParams, Link } from "react-router-dom";
import { Stack, Heading, Text } from "twico-ui";
import { components } from "../data/components.js";
import { slugify, groupedComponents } from "../data/site.js";
import CodeBlock from "../components/CodeBlock.jsx";
import LiveExample from "../components/LiveExample.jsx";
import PropsTable from "../components/PropsTable.jsx";

// Live demo files are authored per component under src/demos/<Name>Demo.jsx.
const demoLoaders = import.meta.glob("../demos/*Demo.jsx");
function demoComponentFor(name) {
  const match = Object.keys(demoLoaders).find((p) => p.endsWith(`/${name}Demo.jsx`));
  return match ? React.lazy(demoLoaders[match]) : null;
}

function adjacent(name) {
  const flat = groupedComponents(components).flatMap(([, list]) => list);
  const i = flat.findIndex((c) => c.name === name);
  return { prev: flat[i - 1], next: flat[i + 1] };
}

export default function ComponentPage() {
  const { slug } = useParams();
  const comp = components.find((c) => slugify(c.name) === slug);

  if (!comp) {
    return (
      <Stack as="article" gap={5} className="docs-article">
        <Heading level={1}>Not found</Heading>
        <Text className="docs-muted" tone="muted">No component matches “{slug}”.</Text>
        <Link to="/components" className="docs-link">← All components</Link>
      </Stack>
    );
  }

  const Demo = demoComponentFor(comp.name);
  const importLine = `import { ${comp.importName} } from "twico-ui";`;
  const { prev, next } = adjacent(comp.name);

  return (
    <Stack as="article" gap={5} className="docs-article">
      <Stack as="section" gap={3}>
        <Text as="div" className="docs-eyebrow" tone="primary">{comp.group}</Text>
        <Heading level={1}>{comp.name}</Heading>
        <Text className="docs-lead" size="lg" tone="muted">{comp.summary}</Text>
      </Stack>

      <Stack as="section" gap={3}>
        <Heading level={2} id="import">Import</Heading>
        <CodeBlock code={importLine} />
      </Stack>

      <Stack as="section" gap={3}>
        <Heading level={2} id="usage">Usage</Heading>
        <LiveExample code={comp.snippet}>
          {Demo ? (
            <React.Suspense fallback={<Text className="docs-muted" tone="muted">Loading preview…</Text>}>
              <Demo />
            </React.Suspense>
          ) : null}
        </LiveExample>
      </Stack>

      <Stack as="section" gap={3}>
        <Heading level={2} id="props">Props</Heading>
        <PropsTable rows={comp.propsRows} />
      </Stack>

      <nav className="docs-pager" aria-label="Component pager">
        {prev ? (
          <Link to={`/components/${slugify(prev.name)}`} className="docs-pager__link">
            <span>Previous</span>
            <strong>{prev.name}</strong>
          </Link>
        ) : <span />}
        {next ? (
          <Link to={`/components/${slugify(next.name)}`} className="docs-pager__link docs-pager__link--next">
            <span>Next</span>
            <strong>{next.name}</strong>
          </Link>
        ) : <span />}
      </nav>
    </Stack>
  );
}
