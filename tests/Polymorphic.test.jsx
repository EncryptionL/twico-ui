import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { Box } from "../components/layout/Box.jsx";
import { Stack } from "../components/layout/Stack.jsx";
import { Text } from "../components/typography/Text.jsx";

// Lock-in for #143: the polymorphic `as` accepts a React component (not just a tag
// name), rendering through it and forwarding arbitrary props via `{...rest}`.
const Anchor = React.forwardRef(function Anchor({ children, ...rest }, ref) {
  return (
    <a ref={ref} data-testid="anchor" {...rest}>
      {children}
    </a>
  );
});

describe("polymorphic `as` accepts React components (#143)", () => {
  it("Box renders through a component and forwards props", () => {
    render(
      <Box as={Anchor} href="/next" data-role="cta">
        Go
      </Box>
    );
    const el = screen.getByTestId("anchor");
    expect(el.tagName).toBe("A");
    expect(el).toHaveAttribute("href", "/next");
    expect(el).toHaveAttribute("data-role", "cta");
    expect(el).toHaveTextContent("Go");
  });

  it("Text renders through a component and forwards href", () => {
    render(
      <Text as={Anchor} href="/read">
        Read more
      </Text>
    );
    expect(screen.getByTestId("anchor")).toHaveAttribute("href", "/read");
  });

  it("Stack renders through a component", () => {
    render(<Stack as={Anchor}>row</Stack>);
    expect(screen.getByTestId("anchor")).toHaveTextContent("row");
  });
});
