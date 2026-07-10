import React from "react";
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Grid } from "../components/layout/Grid.jsx";
import { Stack } from "../components/layout/Stack.jsx";

// #216 — the `justify` prop means different CSS axes on Grid vs Stack. Grid gains an explicit,
// correctly-named `justifyItems`; `justify` stays a backward-compatible alias for it.
describe("Grid/Stack justify semantics (#216)", () => {
  it("Grid.justify maps to justify-items (unchanged / backward-compatible)", () => {
    const { container } = render(<Grid justify="center">x</Grid>);
    expect(container.firstChild.style.justifyItems).toBe("center");
  });
  it("Grid.justifyItems is the explicit prop and wins over justify", () => {
    const { container } = render(<Grid justify="start" justifyItems="end">x</Grid>);
    expect(container.firstChild.style.justifyItems).toBe("end");
  });
  it("Stack.justify maps to justify-content", () => {
    const { container } = render(<Stack justify="space-between">x</Stack>);
    expect(container.firstChild.style.justifyContent).toBe("space-between");
  });
});
