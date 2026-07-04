import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Rating } from "../components/inputs/Rating.jsx";

describe("Rating read-only semantics (#78)", () => {
  it("readOnly renders a static role=img with a value label, no radios", () => {
    render(<Rating value={4} readOnly />);
    expect(screen.getByRole("img", { name: "4 out of 5 stars" })).toBeInTheDocument();
    expect(screen.queryAllByRole("radio")).toHaveLength(0);
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("interactive (default) is a radiogroup with count radios and one checked", () => {
    render(<Rating value={3} onChange={() => {}} />);
    expect(screen.getByRole("radiogroup")).toBeInTheDocument();
    expect(screen.getAllByRole("radio")).toHaveLength(5);
    expect(screen.getByRole("radio", { name: "3 stars" })).toBeChecked();
  });

  it("disabled stays a radiogroup with aria-disabled", () => {
    render(<Rating value={2} disabled />);
    expect(screen.getByRole("radiogroup")).toHaveAttribute("aria-disabled", "true");
  });

  it("a forwarded aria-label overrides the read-only value label", () => {
    render(<Rating value={4} readOnly aria-label="Overall score" />);
    expect(screen.getByRole("img", { name: "Overall score" })).toBeInTheDocument();
  });
});

describe("Rating fractional fill (#79)", () => {
  it("value=3.5 half-fills the 4th star and labels 3.5", () => {
    const { container } = render(<Rating value={3.5} readOnly />);
    const stars = container.querySelectorAll(".twc-rating__star");
    expect(stars[0].style.getPropertyValue("--twc-fill")).toBe("100%");
    expect(stars[3].style.getPropertyValue("--twc-fill")).toBe("50%");
    expect(stars[4].style.getPropertyValue("--twc-fill")).toBe("0%");
    expect(screen.getByRole("img", { name: "3.5 out of 5 stars" })).toBeInTheDocument();
  });

  it("warns once when an interactive Rating gets a fractional value", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(<Rating value={3.5} onChange={() => {}} />);
    expect(warn).toHaveBeenCalledTimes(1);
    expect(String(warn.mock.calls[0][0])).toMatch(/integer-only/i);
    warn.mockRestore();
  });
});

describe("Rating clearable + keyboard clear (#83)", () => {
  it("Delete/Backspace clears to 0 when clearable", () => {
    const onChange = vi.fn();
    render(<Rating value={3} onChange={onChange} />);
    const group = screen.getByRole("radiogroup").querySelector(".twc-rating__stars");
    fireEvent.keyDown(group, { key: "Delete" });
    expect(onChange).toHaveBeenLastCalledWith(0);
    fireEvent.keyDown(group, { key: "Backspace" });
    expect(onChange).toHaveBeenLastCalledWith(0);
  });

  it("clearable=false: Delete is a no-op and clicking the selected star keeps it", () => {
    const onChange = vi.fn();
    render(<Rating value={3} clearable={false} onChange={onChange} />);
    const group = screen.getByRole("radiogroup").querySelector(".twc-rating__stars");
    fireEvent.keyDown(group, { key: "Delete" });
    fireEvent.click(screen.getByRole("radio", { name: "3 stars" }));
    expect(onChange).not.toHaveBeenCalledWith(0);
  });

  it("ArrowLeft from 1 stays at 1", () => {
    const onChange = vi.fn();
    render(<Rating value={1} onChange={onChange} />);
    fireEvent.keyDown(screen.getByRole("radiogroup").querySelector(".twc-rating__stars"), { key: "ArrowLeft" });
    expect(onChange).toHaveBeenLastCalledWith(1);
  });
});

describe("Rating form submission (#82)", () => {
  it("renders a hidden input carrying the value in FormData", () => {
    const { container } = render(
      <form><Rating name="score" value={4} onChange={() => {}} /></form>
    );
    expect(new FormData(container.querySelector("form")).get("score")).toBe("4");
  });
  it("no hidden input without a name", () => {
    const { container } = render(<Rating value={4} onChange={() => {}} />);
    expect(container.querySelector('input[type="hidden"]')).toBeNull();
  });
});

describe("Rating value formatting (#87)", () => {
  it("integers render without a trailing .0", () => {
    const { rerender } = render(<Rating value={4} showValue readOnly />);
    expect(document.querySelector(".twc-rating__value").textContent).toBe("4");
    rerender(<Rating value={3.5} showValue readOnly />);
    expect(document.querySelector(".twc-rating__value").textContent).toBe("3.5");
    rerender(<Rating value={0} showValue readOnly />);
    expect(document.querySelector(".twc-rating__value").textContent).toBe("0");
  });

  it("format overrides the badge and the read-only label", () => {
    render(<Rating value={4} showValue readOnly format={(v) => `${v}/5`} />);
    expect(document.querySelector(".twc-rating__value").textContent).toBe("4/5");
  });
});
