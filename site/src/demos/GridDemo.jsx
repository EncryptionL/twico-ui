import React from "react";
import { Grid, Card } from "twico-ui";

export default function GridDemo() {
  return (
    <Grid minChildWidth={150} gap={3} style={{ width: "100%" }}>
      {["One", "Two", "Three", "Four", "Five"].map((n) => (
        <Card key={n}>{n}</Card>
      ))}
    </Grid>
  );
}
