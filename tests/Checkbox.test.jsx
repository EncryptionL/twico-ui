import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { Checkbox } from "../components/inputs/Checkbox.jsx";

describe("Checkbox accessible-name warning (#76)", () => {
  // NOTE: warnOnce dedupes by key module-globally, so this must be the first label-less render.
  it("warns once when there is no accessible name", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(<Checkbox />);
    expect(warn).toHaveBeenCalledTimes(1);
    expect(String(warn.mock.calls[0][0])).toMatch(/accessible name/i);
    warn.mockRestore();
  });

  it("does not warn when named by label / aria-label / description", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(<Checkbox label="Agree" />);
    render(<Checkbox aria-label="Select all" />);
    render(<Checkbox description="Opt in" />);
    expect(warn).not.toHaveBeenCalled();
    warn.mockRestore();
  });

  it("a consumer aria-label becomes the accessible name", () => {
    render(<Checkbox aria-label="Select all" />);
    expect(screen.getByRole("checkbox", { name: "Select all" })).toBeInTheDocument();
  });
});

describe("Checkbox native required (#74)", () => {
  it("sets the native required attribute and aria-required", () => {
    render(<Checkbox required label="Terms" />);
    const cb = screen.getByRole("checkbox");
    expect(cb).toBeRequired();
    expect(cb).toHaveAttribute("aria-required", "true");
  });
  it("blocks native form validity when unchecked", () => {
    const { container } = render(
      <form><Checkbox required label="Terms" /></form>
    );
    expect(container.querySelector("form").checkValidity()).toBe(false);
  });
});

describe("Checkbox indeterminate sync (#85)", () => {
  it("renders mixed state with aria-checked and the dash glyph", () => {
    const { container } = render(<Checkbox indeterminate label="All" />);
    const cb = container.querySelector("input");
    expect(cb.indeterminate).toBe(true);
    expect(cb).toHaveAttribute("aria-checked", "mixed");
    expect(container.querySelector('path[d="M5 12h14"]')).not.toBeNull();
  });

  it("checked wins: flipping checked true clears the mixed state (#85 bug)", () => {
    const { container, rerender } = render(<Checkbox indeterminate checked={false} label="All" onChange={() => {}} />);
    expect(container.querySelector("input").indeterminate).toBe(true);
    rerender(<Checkbox indeterminate checked={true} label="All" onChange={() => {}} />);
    const cb = container.querySelector("input");
    expect(cb.indeterminate).toBe(false);
    expect(cb).not.toHaveAttribute("aria-checked", "mixed");
    expect(container.querySelector('path[d="M20 6 9 17l-5-5"]')).not.toBeNull();
  });

  it("aria-checked='mixed' survives SSR (the DOM property cannot serialize)", () => {
    const html = renderToStaticMarkup(<Checkbox indeterminate label="All" />);
    expect(html).toContain('aria-checked="mixed"');
  });
});
