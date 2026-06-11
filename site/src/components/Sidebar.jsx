import React from "react";
import { NavLink } from "react-router-dom";
import { Stack, Text } from "twico-ui";
import { components } from "../data/components.js";
import { GETTING_STARTED, groupedComponents, slugify } from "../data/site.js";

export default function Sidebar({ onNavigate }) {
  const groups = groupedComponents(components);
  return (
    <Stack as="nav" gap={5} className="docs-sidebar-nav" aria-label="Documentation">
      <Stack gap={"2px"} className="docs-nav-group">
        <Text as="div" size="xs" tone="subtle" weight="bold" className="docs-nav-title">Getting started</Text>
        {GETTING_STARTED.map((l) => (
          <NavLink key={l.to} to={l.to} className="docs-nav-link" onClick={onNavigate}>
            {l.label}
          </NavLink>
        ))}
        <NavLink to="/components" end className="docs-nav-link" onClick={onNavigate}>
          All components
        </NavLink>
      </Stack>

      {groups.map(([group, list]) => (
        <Stack gap={"2px"} className="docs-nav-group" key={group}>
          <Text as="div" size="xs" tone="subtle" weight="bold" className="docs-nav-title">{group}</Text>
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
        </Stack>
      ))}
    </Stack>
  );
}
