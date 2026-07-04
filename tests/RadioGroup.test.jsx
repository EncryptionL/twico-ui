import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { RadioGroup } from "../components/inputs/RadioGroup.jsx";
import { Radio } from "../components/inputs/Radio.jsx";

const options = [
  { value: "free", label: "Free" },
  { value: "pro", label: "Pro" },
  { value: "ent", label: "Enterprise" },
];

describe("RadioGroup (#77)", () => {
  it("renders a labelled radiogroup of radios sharing one name", () => {
    render(<RadioGroup label="Plan" options={options} />);
    const group = screen.getByRole("radiogroup", { name: "Plan" });
    const radios = within(group).getAllByRole("radio");
    expect(radios).toHaveLength(3);
    const names = new Set(radios.map((r) => r.getAttribute("name")));
    expect(names.size).toBe(1);
  });

  it("controlled: clicking an option fires onChange with the value", () => {
    const onChange = vi.fn();
    render(<RadioGroup label="Plan" value="free" onChange={onChange} options={options} />);
    fireEvent.click(screen.getByRole("radio", { name: "Pro" }));
    expect(onChange).toHaveBeenCalledWith("pro");
  });

  it("uncontrolled: selection updates the checked radio", () => {
    render(<RadioGroup label="Plan" defaultValue="free" options={options} />);
    fireEvent.click(screen.getByRole("radio", { name: "Pro" }));
    expect(screen.getByRole("radio", { name: "Pro" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "Free" })).not.toBeChecked();
  });

  it("hoists a single error and sets aria-invalid + aria-describedby", () => {
    const { container } = render(<RadioGroup id="g" label="Plan" error="Pick one" options={options} />);
    const group = screen.getByRole("radiogroup");
    expect(group).toHaveAttribute("aria-invalid", "true");
    expect(group).toHaveAttribute("aria-describedby", "g-desc");
    expect(container.querySelectorAll(".twc-field__error")).toHaveLength(1);
    expect(container.querySelector("#g-desc")).toHaveTextContent("Pick one");
  });

  it("accepts <Radio> children, injecting the shared name/checked", () => {
    render(
      <RadioGroup label="Size" defaultValue="m">
        <Radio value="s" label="Small" />
        <Radio value="m" label="Medium" />
      </RadioGroup>
    );
    expect(screen.getByRole("radio", { name: "Medium" })).toBeChecked();
    const names = screen.getAllByRole("radio").map((r) => r.getAttribute("name"));
    expect(new Set(names).size).toBe(1);
  });

  it("required propagates the native attribute to the radios", () => {
    render(<RadioGroup label="Plan" required options={options} />);
    screen.getAllByRole("radio").forEach((r) => expect(r).toBeRequired());
  });
});
