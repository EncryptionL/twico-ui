import React from "react";
import { Link } from "react-router-dom";
import { components } from "../data/components.js";
import { groupedComponents, slugify } from "../data/site.js";

export default function ComponentsIndex() {
  const groups = groupedComponents(components);
  const total = components.length;
  return (
    <article className="docs-article">
      <div className="docs-eyebrow">Components</div>
      <h1>All components</h1>
      <p className="docs-lead">
        {total ? `${total} ` : ""}components, each with live examples and a full props reference. Click any to dive in.
      </p>

      {groups.map(([group, list]) => (
        <section key={group} className="comp-index-group">
          <h2 id={slugify(group)}>{group}</h2>
          <div className="comp-grid">
            {list.map((c) => (
              <Link key={c.name} to={`/components/${slugify(c.name)}`} className="comp-card">
                <div className="comp-card__name">{c.name}</div>
                <div className="comp-card__summary">{c.summary}</div>
              </Link>
            ))}
          </div>
        </section>
      ))}

      {!total ? <p className="docs-muted">Component reference is being generated.</p> : null}
    </article>
  );
}
