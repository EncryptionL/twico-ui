import { describe, it, expect } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { Select } from "../components/inputs/Select.jsx";
import { Combobox } from "../components/inputs/Combobox.jsx";
import { MultiSelect } from "../components/inputs/MultiSelect.jsx";

const OPTS = Array.from({ length: 500 }, (_, i) => ({ value: `v${i}`, label: `Option ${i}` }));

function openSelect(container) {
  fireEvent.click(container.querySelector(".twc-sel__trigger"));
}

describe("Select virtualization (#92)", () => {
  it("renders every option when not virtualized", () => {
    const { container } = render(<Select options={OPTS} searchable={false} />);
    openSelect(container);
    expect(document.querySelectorAll(".twc-opt").length).toBe(500);
  });

  it("mounts far fewer than 500 buttons when virtualized", () => {
    const { container } = render(<Select options={OPTS} searchable={false} virtualized />);
    openSelect(container);
    const count = document.querySelectorAll(".twc-opt").length;
    expect(count).toBeGreaterThan(0);
    expect(count).toBeLessThan(80); // ~viewport + overscan, nowhere near 500
  });

  it("ArrowDown to an off-screen option scrolls it into view and marks it active", () => {
    const { container } = render(<Select options={OPTS} searchable={false} virtualized />);
    openSelect(container);
    // Option 40 is well past the initial window; step down to it.
    const trigger = container.querySelector(".twc-sel__trigger");
    for (let i = 0; i < 40; i++) fireEvent.keyDown(trigger, { key: "ArrowDown" });
    const activeBtn = document.querySelector('.twc-opt[data-active="true"]');
    expect(activeBtn).toBeTruthy();
    expect(activeBtn.id).toContain("-opt-40");
    expect(activeBtn.querySelector(".twc-opt__label").textContent).toBe("Option 40");
  });
});

describe("Combobox virtualization (#92)", () => {
  it("mounts far fewer than 500 buttons when virtualized", () => {
    const { container } = render(<Combobox options={OPTS} virtualized />);
    fireEvent.focus(container.querySelector(".twc-cb__input"));
    fireEvent.click(container.querySelector(".twc-cb__control"));
    const count = document.querySelectorAll(".twc-opt").length;
    expect(count).toBeGreaterThan(0);
    expect(count).toBeLessThan(80);
  });

  it("ArrowDown to an off-screen option scrolls it into view and marks it active", () => {
    const { container } = render(<Combobox options={OPTS} virtualized />);
    const input = container.querySelector(".twc-cb__input");
    fireEvent.focus(input);
    for (let i = 0; i < 41; i++) fireEvent.keyDown(input, { key: "ArrowDown" });
    const activeBtn = document.querySelector('.twc-opt[data-active="true"]');
    expect(activeBtn).toBeTruthy();
    const n = Number(activeBtn.id.match(/-opt-(\d+)$/)[1]);
    expect(n).toBeGreaterThan(30); // scrolled well past the initial ~15-row window
    expect(activeBtn.querySelector(".twc-opt__label").textContent).toBe(`Option ${n}`);
  });
});

describe("MultiSelect virtualization (#92)", () => {
  it("mounts far fewer than 500 buttons when virtualized", () => {
    const { container } = render(<MultiSelect options={OPTS} virtualized />);
    fireEvent.click(container.querySelector(".twc-ms__control"));
    const count = document.querySelectorAll(".twc-opt").length;
    expect(count).toBeGreaterThan(0);
    expect(count).toBeLessThan(80);
  });

  it("ArrowDown to an off-screen option scrolls it into view and marks it active", () => {
    const { container } = render(<MultiSelect options={OPTS} virtualized />);
    fireEvent.click(container.querySelector(".twc-ms__control"));
    const input = container.querySelector(".twc-ms__input") || container.querySelector(".twc-ms__control");
    for (let i = 0; i < 41; i++) fireEvent.keyDown(input, { key: "ArrowDown" });
    const activeBtn = document.querySelector('.twc-opt[data-active="true"]');
    expect(activeBtn).toBeTruthy();
    const n = Number(activeBtn.id.match(/-opt-(\d+)$/)[1]);
    expect(n).toBeGreaterThan(30);
    expect(activeBtn.querySelector(".twc-opt__label").textContent).toBe(`Option ${n}`);
  });
});
