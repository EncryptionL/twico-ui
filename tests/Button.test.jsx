import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "../components/buttons/Button.jsx";

describe("Button", () => {
  it("renders children and fires onClick", () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Save</Button>);
    const btn = screen.getByRole("button", { name: "Save" });
    btn.click();
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("does not fire onClick while loading and marks aria-busy", () => {
    const onClick = vi.fn();
    render(<Button loading onClick={onClick}>Save</Button>);
    const btn = screen.getByRole("button");
    expect(btn).toHaveAttribute("aria-busy", "true");
    btn.click();
    expect(onClick).not.toHaveBeenCalled();
  });

  it("merges consumer className and reflects variant/tone/size as data-attributes", () => {
    render(<Button className="mine" variant="soft" tone="danger" size="lg">X</Button>);
    const btn = screen.getByRole("button");
    expect(btn).toHaveClass("twc-btn", "mine");
    expect(btn).toHaveAttribute("data-variant", "soft");
    expect(btn).toHaveAttribute("data-tone", "danger");
    expect(btn).toHaveAttribute("data-size", "lg");
  });

  it('as="a" sanitizes a javascript: href out of the DOM', () => {
    render(
      <Button as="a" href="javascript:alert(1)">
        link
      </Button>
    );
    const link = screen.getByText("link").closest("a");
    expect(link).not.toHaveAttribute("href");
  });

  it('as="a" keeps a safe http href', () => {
    render(
      <Button as="a" href="https://example.com">
        link
      </Button>
    );
    expect(screen.getByText("link").closest("a")).toHaveAttribute("href", "https://example.com");
  });
});
