import React from "react";
import { useParams, Link } from "react-router-dom";
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
      <article className="docs-article">
        <h1>Not found</h1>
        <p className="docs-muted">No component matches “{slug}”.</p>
        <Link to="/components" className="docs-link">← All components</Link>
      </article>
    );
  }

  const Demo = demoComponentFor(comp.name);
  const importLine = `import { ${comp.importName} } from "twico-ui";`;
  const { prev, next } = adjacent(comp.name);

  return (
    <article className="docs-article">
      <div className="docs-eyebrow">{comp.group}</div>
      <h1>{comp.name}</h1>
      <p className="docs-lead">{comp.summary}</p>

      <h2 id="import">Import</h2>
      <CodeBlock code={importLine} />

      <h2 id="usage">Usage</h2>
      <LiveExample code={comp.snippet}>
        {Demo ? (
          <React.Suspense fallback={<div className="docs-muted">Loading preview…</div>}>
            <Demo />
          </React.Suspense>
        ) : null}
      </LiveExample>

      <h2 id="props">Props</h2>
      <PropsTable rows={comp.propsRows} />

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
    </article>
  );
}
