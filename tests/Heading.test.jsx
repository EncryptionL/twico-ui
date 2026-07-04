import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Heading } from "../components/typography/Heading.jsx";

describe("Heading size (#150)", () => {
  it("size token maps to the font-size var", () => {
    render(<Heading size="6xl">a</Heading>);
    expect(screen.getByText("a").style.fontSize).toBe("var(--text-6xl)");
  });
  it("display renders the display size", () => {
    render(<Heading display>b</Heading>);
    expect(screen.getByText("b").style.fontSize).toBe("var(--text-display)");
  });
  it("level default mapping is unchanged", () => {
    render(<Heading level={1}>c</Heading>);
    expect(screen.getByText("c").style.fontSize).toBe("var(--text-4xl)");
  });
  it("explicit size wins over display", () => {
    render(<Heading size="2xl" display>d</Heading>);
    expect(screen.getByText("d").style.fontSize).toBe("var(--text-2xl)");
  });
});

describe("Heading truncate (#144)", () => {
  it("truncate ellipsis", () => {
    render(<Heading truncate>t</Heading>);
    expect(screen.getByText("t").style.whiteSpace).toBe("nowrap");
  });
});
