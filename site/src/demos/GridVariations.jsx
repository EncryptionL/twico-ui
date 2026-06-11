import React from "react";
import { Grid, Card } from "twico-ui";

const variations = [
  {
    title: "Responsive auto-fill",
    description:
      "Columns auto-fill at a minimum child width — they reflow as the container resizes.",
    code: `<Grid minChildWidth={160} gap={3}>
  <Card>One</Card>
  <Card>Two</Card>
  <Card>Three</Card>
  <Card>Four</Card>
</Grid>`,
    render: () => (
      <div style={{ width: "100%" }}>
        <Grid minChildWidth={160} gap={3}>
          <Card>One</Card>
          <Card>Two</Card>
          <Card>Three</Card>
          <Card>Four</Card>
        </Grid>
      </div>
    ),
  },
  {
    title: "Fixed columns",
    description: "A set number of equal-width columns.",
    code: `<Grid columns={3} gap={3}>
  <Card>1</Card>
  <Card>2</Card>
  <Card>3</Card>
  <Card>4</Card>
  <Card>5</Card>
  <Card>6</Card>
</Grid>`,
    render: () => (
      <div style={{ width: "100%" }}>
        <Grid columns={3} gap={3}>
          <Card>1</Card>
          <Card>2</Card>
          <Card>3</Card>
          <Card>4</Card>
          <Card>5</Card>
          <Card>6</Card>
        </Grid>
      </div>
    ),
  },
  {
    title: "Gap sizes",
    description: "Spacing between cells via the spacing scale (number) or any CSS length.",
    code: `<Grid columns={2} gap={2}>
  <Card>Tight</Card>
  <Card>Tight</Card>
</Grid>
<Grid columns={2} gap={6}>
  <Card>Loose</Card>
  <Card>Loose</Card>
</Grid>`,
    render: () => (
      <div style={{ width: "100%", display: "grid", gap: 16 }}>
        <Grid columns={2} gap={2}>
          <Card>Tight</Card>
          <Card>Tight</Card>
        </Grid>
        <Grid columns={2} gap={6}>
          <Card>Loose</Card>
          <Card>Loose</Card>
        </Grid>
      </div>
    ),
  },
  {
    title: "Aligned items",
    description:
      "Use align (alignItems) and justify (justifyItems) to position cells within their tracks.",
    code: `<Grid columns={3} gap={3} align="center" justify="center">
  <Card>A</Card>
  <Card padding="lg">Taller</Card>
  <Card>C</Card>
</Grid>`,
    render: () => (
      <div style={{ width: "100%" }}>
        <Grid columns={3} gap={3} align="center" justify="center">
          <Card>A</Card>
          <Card padding="lg">Taller</Card>
          <Card>C</Card>
        </Grid>
      </div>
    ),
  },
  {
    title: "Semantic tag",
    description: "Render as a different element with the `as` prop.",
    code: `<Grid as="ul" columns={2} gap={3} style={{ listStyle: "none", margin: 0, padding: 0 }}>
  <Card>First</Card>
  <Card>Second</Card>
</Grid>`,
    render: () => (
      <div style={{ width: "100%" }}>
        <Grid as="ul" columns={2} gap={3} style={{ listStyle: "none", margin: 0, padding: 0 }}>
          <Card>First</Card>
          <Card>Second</Card>
        </Grid>
      </div>
    ),
  },
];

export default variations;
