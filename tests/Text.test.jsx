import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Text } from "../components/typography/Text.jsx";

describe("Text tone inherit (#152)", () => {
  it("tone=inherit emits color:inherit (not a var)", () => {
    render(<Text tone="inherit">x</Text>);
    expect(screen.getByText("x").style.color).toBe("inherit");
  });
  it("token tones still wrap in var()", () => {
    render(<Text tone="muted">y</Text>);
    expect(screen.getByText("y").style.color).toBe("var(--color-text-muted)");
  });
  it("default tone is --color-text", () => {
    render(<Text>z</Text>);
    expect(screen.getByText("z").style.color).toBe("var(--color-text)");
  });
});

describe("Text truncate/lineClamp (#144)", () => {
  it("truncate sets single-line ellipsis + minWidth 0", () => {
    render(<Text truncate>t</Text>);
    const el = screen.getByText("t");
    expect(el.style.overflow).toBe("hidden");
    expect(el.style.textOverflow).toBe("ellipsis");
    expect(el.style.whiteSpace).toBe("nowrap");
    expect(el.style.minWidth).toBe("0px");
  });
  it("lineClamp wins over truncate", () => {
    render(<Text truncate lineClamp={3}>c</Text>);
    const el = screen.getByText("c");
    expect(el.style.getPropertyValue("-webkit-line-clamp")).toBe("3");
    expect(el.style.display).toBe("-webkit-box");
    expect(el.style.whiteSpace).toBe(""); // single-line branch not applied
  });
});
