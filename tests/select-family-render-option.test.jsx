import React from "react";
import { describe, it, expect } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { Combobox } from "../components/inputs/Combobox.jsx";
import { Select } from "../components/inputs/Select.jsx";
import { MultiSelect } from "../components/inputs/MultiSelect.jsx";

// #326 — richer options: renderOption (custom row body, twico keeps checkmark/checkbox + aria) and the
// lightweight Option.icon (leading) / Option.hint (trailing) fields, across Combobox / Select / MultiSelect.
const opts = [
  { value: "a", label: "Apple", icon: <span data-testid="ic-a">A</span>, hint: "fruit" },
  { value: "b", label: "Beet", description: "root" },
];

describe("Combobox/Select/MultiSelect richer options (#326)", () => {
  it("Combobox: option.icon + option.hint render in the row", () => {
    const { container, getByTestId } = render(<Combobox portal={false} options={opts} label="x" />);
    fireEvent.focus(container.querySelector('input[role="combobox"]'));
    expect(container.querySelector(".twc-opt__icon")).toBeTruthy();
    expect(getByTestId("ic-a")).toBeTruthy();
    expect(container.querySelector(".twc-opt__hint").textContent).toBe("fruit");
  });

  it("Combobox: renderOption replaces the option body (icon/hint path not used)", () => {
    const { container } = render(<Combobox portal={false} options={opts} label="x"
      renderOption={(o, s) => <span data-testid={`ro-${o.value}`}>{o.label.toUpperCase()}{s.selected ? "*" : ""}</span>} />);
    fireEvent.focus(container.querySelector('input[role="combobox"]'));
    expect(container.querySelector('[data-testid="ro-a"]').textContent).toBe("APPLE");
    expect(container.querySelector(".twc-opt__icon")).toBeNull(); // custom body owns everything
  });

  it("Select: renderOption renders a custom body", () => {
    const { container } = render(<Select portal={false} options={opts} label="x"
      renderOption={(o) => <b data-testid={`so-${o.value}`}>{o.label}</b>} />);
    fireEvent.click(container.querySelector(".twc-sel__trigger"));
    expect(container.querySelector('[data-testid="so-a"]')).toBeTruthy();
  });

  it("MultiSelect: renderOption renders a custom body and keeps the checkbox", () => {
    const { container } = render(<MultiSelect portal={false} options={opts} label="x"
      renderOption={(o) => <em data-testid={`mo-${o.value}`}>{o.label}</em>} />);
    fireEvent.click(container.querySelector(".twc-ms__control"));
    expect(container.querySelector('[data-testid="mo-a"]')).toBeTruthy();
    expect(container.querySelector(".twc-opt__box")).toBeTruthy(); // selection checkbox retained
  });
});
