import React from "react";
import { Link } from "react-router-dom";
import { Card, Stack, Grid, Heading, Text } from "twico-ui";
import { components } from "../data/components.js";
import { groupedComponents, slugify } from "../data/site.js";

export default function ComponentsIndex() {
  const groups = groupedComponents(components);
  const total = components.length;
  return (
    <Stack as="article" gap={5}>
      <Text tone="primary" size="xs" weight="bold" style={{ textTransform: "uppercase", letterSpacing: "0.08em" }}>Components</Text>
      <Heading level={1}>All components</Heading>
      <Text size="lg" tone="muted">
        {total ? `${total} ` : ""}components, each with live examples and a full props reference. Click any to dive in.
      </Text>

      {groups.map(([group, list]) => (
        <Stack as="section" gap={3} key={group}>
          <Heading level={2} id={slugify(group)}>{group}</Heading>
          <Grid minChildWidth={220} gap={3}>
            {list.map((c) => (
              <Link key={c.name} to={`/components/${slugify(c.name)}`} style={{ display: "block" }}>
                <Card interactive>
                  <Text as="div" weight="bold">{c.name}</Text>
                  <Text as="div" size="sm" tone="muted">{c.summary}</Text>
                </Card>
              </Link>
            ))}
          </Grid>
        </Stack>
      ))}

      {!total ? <Text tone="muted">Component reference is being generated.</Text> : null}
    </Stack>
  );
}
