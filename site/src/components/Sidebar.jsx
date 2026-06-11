import React from "react";
import { NavLink } from "react-router-dom";
import { Stack, Text } from "twico-ui";
import { components } from "../data/components.js";
import { GETTING_STARTED, groupedComponents, slugify } from "../data/site.js";

const linkStyle = ({ isActive }) => ({
  display: "block",
  padding: "6px 12px",
  borderRadius: "var(--radius-md)",
  fontSize: "var(--text-sm)",
  fontWeight: isActive ? "var(--font-semibold)" : "var(--font-medium)",
  color: isActive ? "var(--color-primary-subtle-fg)" : "var(--color-text-muted)",
  background: isActive ? "var(--color-primary-subtle)" : "transparent",
  textDecoration: "none",
});

const titleStyle = { textTransform: "uppercase", letterSpacing: "0.06em", padding: "0 12px 6px" };

export default function Sidebar({ onNavigate }) {
  const groups = groupedComponents(components);
  return (
    <Stack as="nav" gap={5} aria-label="Documentation">
      <Stack gap="2px">
        <Text as="div" size="xs" tone="subtle" weight="bold" style={titleStyle}>Getting started</Text>
        {GETTING_STARTED.map((l) => (
          <NavLink key={l.to} to={l.to} style={linkStyle} onClick={onNavigate}>{l.label}</NavLink>
        ))}
        <NavLink to="/components" end style={linkStyle} onClick={onNavigate}>All components</NavLink>
      </Stack>

      {groups.map(([group, list]) => (
        <Stack gap="2px" key={group}>
          <Text as="div" size="xs" tone="subtle" weight="bold" style={titleStyle}>{group}</Text>
          {list.map((c) => (
            <NavLink key={c.name} to={`/components/${slugify(c.name)}`} style={linkStyle} onClick={onNavigate}>{c.name}</NavLink>
          ))}
        </Stack>
      ))}
    </Stack>
  );
}
