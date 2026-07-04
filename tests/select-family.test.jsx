import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, act, within } from "@testing-library/react";
import { Select } from "../components/inputs/Select.jsx";
import { Combobox } from "../components/inputs/Combobox.jsx";
import { MultiSelect } from "../components/inputs/MultiSelect.jsx";

const options = [
  { value: "a", label: "Apple" },
  { value: "b", label: "Banana", disabled: true },
  { value: "c", label: "Cherry" },
];

function openSelect() {
  const trigger = screen.getByRole("button", { name: /Pick|Apple|Banana|Cherry|Select/ }) || screen.getAllByRole("button")[0];
  act(() => trigger.focus());
  act(() => trigger.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true })));
  return trigger;
}

describe("Select family: per-option disabled (#90)", () => {
  it("Select renders a disabled option that can't be selected", () => {
    const onChange = vi.fn();
    render(<Select options={options} searchable={false} placeholder="Pick" onChange={onChange} portal={false} />);
    openSelect();
    const banana = screen.getByRole("option", { name: "Banana" });
    expect(banana).toBeDisabled();
    fireEvent.click(banana);
    expect(onChange).not.toHaveBeenCalled();
  });
});

describe("Select family: name → hidden input (#91)", () => {
  it("Select submits its value via a hidden input", () => {
    const { container } = render(
      <form><Select options={options} value="c" name="fruit" onChange={() => {}} /></form>
    );
    expect(new FormData(container.querySelector("form")).get("fruit")).toBe("c");
  });
  it("MultiSelect submits one hidden input per value", () => {
    const { container } = render(
      <form><MultiSelect options={options} value={["a", "c"]} name="fruits" onChange={() => {}} /></form>
    );
    expect(new FormData(container.querySelector("form")).getAll("fruits")).toEqual(["a", "c"]);
  });
});

describe("Select family: emptyText (#96)", () => {
  it("MultiSelect shows a custom empty message", () => {
    render(<MultiSelect options={[]} emptyText="Nothing here" onChange={() => {}} />);
    fireEvent.focus(screen.getByRole("combobox"));
    expect(screen.getByText("Nothing here")).toBeInTheDocument();
  });
});

describe("Select family: loading (#89)", () => {
  it("Combobox shows a loading row", () => {
    render(<Combobox options={[]} loading onChange={() => {}} />);
    fireEvent.focus(screen.getByRole("combobox"));
    expect(screen.getByRole("status")).toHaveTextContent(/Loading/);
  });
});

describe("Combobox: async + correctness (#88/#94/#95)", () => {
  it("onInputChange fires with the raw query and filter=false keeps all options", () => {
    const onInputChange = vi.fn();
    render(<Combobox options={options} filter={false} onInputChange={onInputChange} onChange={() => {}} />);
    const input = screen.getByRole("combobox");
    fireEvent.change(input, { target: { value: "zzz" } });
    expect(onInputChange).toHaveBeenCalledWith("zzz");
    // filter=false → all options still visible despite the non-matching query
    expect(screen.getAllByRole("option")).toHaveLength(3);
  });

  it("Backspace on an empty input clears the selection (#94)", () => {
    const onChange = vi.fn();
    render(<Combobox options={options} value="a" onChange={onChange} />);
    const input = screen.getByRole("combobox");
    fireEvent.focus(input);
    fireEvent.keyDown(input, { key: "Backspace" });
    expect(onChange).toHaveBeenCalledWith(null);
  });

  it("opening with a value highlights the selected option (#95)", () => {
    render(<Combobox options={options} value="c" onChange={() => {}} />);
    fireEvent.focus(screen.getByRole("combobox"));
    expect(screen.getByRole("option", { name: "Cherry" })).toHaveAttribute("data-active", "true");
  });
});

describe("MultiSelect: max + maxTagCount + chip tabindex (#98/#99)", () => {
  const many = [
    { value: "a", label: "A" }, { value: "b", label: "B" },
    { value: "c", label: "C" }, { value: "d", label: "D" },
  ];
  it("max disables unselected options once the cap is reached", () => {
    render(<MultiSelect options={many} value={["a", "b"]} max={2} onChange={() => {}} />);
    fireEvent.focus(screen.getByRole("combobox"));
    expect(screen.getByRole("option", { name: "C" })).toBeDisabled();
    // a selected option stays enabled (removable)
    expect(screen.getByRole("option", { name: "A" })).not.toBeDisabled();
  });
  it("maxTagCount collapses extra chips into a +N more pill", () => {
    const { container } = render(<MultiSelect options={many} value={["a", "b", "c"]} maxTagCount={1} onChange={() => {}} />);
    expect(container.querySelector(".twc-ms__more")).toHaveTextContent("+2 more");
  });
  it("chip remove buttons are out of the tab order", () => {
    const { container } = render(<MultiSelect options={many} value={["a"]} onChange={() => {}} />);
    expect(container.querySelector(".twc-ms__chip-x")).toHaveAttribute("tabindex", "-1");
  });
});
