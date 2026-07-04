import { describe, it, expect } from "vitest";
import React from "react";
import { render } from "@testing-library/react";
import { Box } from "../components/layout/Box.jsx";
import { Stack } from "../components/layout/Stack.jsx";
import { Grid } from "../components/layout/Grid.jsx";
import { Container } from "../components/layout/Container.jsx";
import { Text } from "../components/typography/Text.jsx";
import { Heading } from "../components/typography/Heading.jsx";

describe("polymorphic primitives forward ref (#54)", () => {
  const cases = [
    ["Box", Box, "DIV"],
    ["Stack", Stack, "DIV"],
    ["Grid", Grid, "DIV"],
    ["Container", Container, "DIV"],
    ["Text", Text, "P"],
    ["Heading", Heading, "H2"],
  ];
  cases.forEach(([name, C, tag]) => {
    it(`${name} forwards ref to its DOM node`, () => {
      const ref = React.createRef();
      render(<C ref={ref}>x</C>);
      expect(ref.current).not.toBeNull();
      expect(ref.current.tagName).toBe(tag);
    });
  });

  it("ref points at the `as` element when overridden", () => {
    const ref = React.createRef();
    render(<Box as="section" ref={ref}>x</Box>);
    expect(ref.current.tagName).toBe("SECTION");
  });
});
