import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Combobox } from "../components/inputs/Combobox.jsx";
import { MultiSelect } from "../components/inputs/MultiSelect.jsx";
import { FileUpload } from "../components/inputs/FileUpload.jsx";

// #342: a `disabled` control must never expose a value-clearing affordance. The clear/remove "✕" must
// not be rendered, and no code path may fire onChange while disabled — disabling a control to build a
// read-only view must not let the value be wiped. Select/DatePicker/Input already guarded; these three
// (Combobox clear, MultiSelect per-chip remove + chevron-open, FileUpload per-file remove) did not.

const options = [
  { value: "a", label: "Apple" },
  { value: "b", label: "Banana" },
  { value: "c", label: "Cherry" },
];

describe("Combobox: disabled suppresses the clear ✕ (#342)", () => {
  it("renders the clear ✕ when enabled + clearable + selected", () => {
    const { container } = render(<Combobox options={options} value="a" clearable onChange={() => {}} />);
    expect(container.querySelector(".twc-cb__clear")).toBeInTheDocument();
  });
  it("does NOT render the clear ✕ when disabled", () => {
    const { container } = render(<Combobox options={options} value="a" clearable disabled onChange={() => {}} />);
    expect(container.querySelector(".twc-cb__clear")).toBeNull();
  });
});

describe("MultiSelect: disabled suppresses removal affordances (#342)", () => {
  it("renders per-chip remove ✕ when enabled", () => {
    const { container } = render(<MultiSelect options={options} value={["a", "c"]} onChange={() => {}} />);
    expect(container.querySelectorAll(".twc-ms__chip-x").length).toBe(2);
  });
  it("does NOT render per-chip remove ✕ (nor Clear-all) when disabled, but still shows the chips", () => {
    const { container } = render(<MultiSelect options={options} value={["a", "c"]} clearable disabled onChange={() => {}} />);
    expect(container.querySelectorAll(".twc-ms__chip").length).toBe(2); // values still shown (read-only)
    expect(container.querySelector(".twc-ms__chip-x")).toBeNull();
    expect(container.querySelector(".twc-ms__clear")).toBeNull();
  });
  it("chevron does NOT open the popover when disabled (no add/remove via option clicks)", () => {
    const { container } = render(<MultiSelect options={options} value={["a"]} disabled onChange={() => {}} />);
    fireEvent.click(container.querySelector(".twc-ms__chev"));
    expect(screen.queryAllByRole("option").length).toBe(0);
  });
  it("chevron DOES open the popover when enabled (control)", () => {
    const { container } = render(<MultiSelect options={options} value={["a"]} onChange={() => {}} />);
    fireEvent.click(container.querySelector(".twc-ms__chev"));
    expect(screen.queryAllByRole("option").length).toBeGreaterThan(0);
  });
});

describe("FileUpload: disabled suppresses the per-file remove ✕ (#342)", () => {
  const mkFile = (name) => new File(["x"], name, { type: "text/plain" });

  it("renders a remove ✕ per file when enabled", () => {
    const { container } = render(<FileUpload multiple defaultValue={[mkFile("a.txt"), mkFile("b.txt")]} onChange={() => {}} />);
    expect(container.querySelectorAll(".twc-upload__file-x").length).toBe(2);
  });
  it("does NOT render the remove ✕ when disabled, but still lists the files", () => {
    const onChange = vi.fn();
    const { container } = render(<FileUpload multiple disabled defaultValue={[mkFile("a.txt")]} onChange={onChange} />);
    expect(container.querySelector(".twc-upload__file-name")).toHaveTextContent("a.txt"); // file still shown
    expect(container.querySelector(".twc-upload__file-x")).toBeNull();
    expect(onChange).not.toHaveBeenCalled();
  });
});
