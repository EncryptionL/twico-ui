import React from "react";
import { NavLink } from "react-router-dom";
import { components } from "../data/components.js";
import { GETTING_STARTED, groupedComponents, slugify } from "../data/site.js";

export default function Sidebar({ onNavigate }) {
  const groups = groupedComponents(components);
  return (
    <nav className="docs-sidebar-nav" aria-label="Documentation">
      <div className="docs-nav-group">
        <div className="docs-nav-title">Getting started</div>
        {GETTING_STARTED.map((l) => (
          <NavLink key={l.to} to={l.to} className="docs-nav-link" onClick={onNavigate}>
            {l.label}
          </NavLink>
        ))}
        <NavLink to="/components" end className="docs-nav-link" onClick={onNavigate}>
          All components
        </NavLink>
      </div>

      {groups.map(([group, list]) => (
        <div className="docs-nav-group" key={group}>
          <div className="docs-nav-title">{group}</div>
          {list.map((c) => (
            <NavLink
              key={c.name}
              to={`/components/${slugify(c.name)}`}
              className="docs-nav-link"
              onClick={onNavigate}
            >
              {c.name}
            </NavLink>
          ))}
        </div>
      ))}
    </nav>
  );
}
