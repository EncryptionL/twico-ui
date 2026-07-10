import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, fireEvent, within } from "@testing-library/react";
import { FilterBar } from "../components/inputs/FilterBar.jsx";

const MODELS = [{ value: "m1", label: "Model 1" }, { value: "m2", label: "Model 2" }];

// #203 — FilterBar: schema-driven controls -> normalized [{ field, op, value }].
describe("FilterBar (#203)", () => {
  it("renders one labelled control per schema field", () => {
    const { container } = render(
      <FilterBar fields={[
        { field: "model", label: "Model", type: "multiselect", options: MODELS },
        { field: "createdAt", label: "Created", type: "daterange" },
        { field: "q", label: "Query", type: "search" },
      ]} />,
    );
    const labels = Array.from(container.querySelectorAll(".twc-fbar__label")).map((l) => l.textContent);
    expect(labels).toEqual(["Model", "Created", "Query"]);
    expect(container.querySelectorAll(".twc-fbar__field").length).toBe(3);
  });

  it("emits a `contains` clause for a search field", () => {
    const onChange = vi.fn();
    const { container } = render(
      <FilterBar value={[]} onChange={onChange} fields={[{ field: "q", label: "Query", type: "search" }]} />,
    );
    fireEvent.change(container.querySelector('[data-type="search"] input'), { target: { value: "hello" } });
    expect(onChange).toHaveBeenCalledWith([{ field: "q", op: "contains", value: "hello" }]);
  });

  it("emits an `=` clause with a numeric value for a number field", () => {
    const onChange = vi.fn();
    const { container } = render(
      <FilterBar value={[]} onChange={onChange} fields={[{ field: "amount", label: "Amount", type: "number" }]} />,
    );
    fireEvent.change(container.querySelector('[data-type="number"] input'), { target: { value: "5" } });
    expect(onChange).toHaveBeenCalledWith([{ field: "amount", op: "=", value: 5 }]);
  });

  it("shows a per-field clear ✕ on active fields and clears just that field", () => {
    const onChange = vi.fn();
    const { container } = render(
      <FilterBar onChange={onChange} value={[{ field: "q", op: "contains", value: "abc" }]}
        fields={[{ field: "q", label: "Query", type: "search" }]} />,
    );
    const field = container.querySelector('[data-type="search"]');
    const clear = within(field).getByRole("button", { name: "Clear Query" });
    fireEvent.click(clear);
    expect(onChange).toHaveBeenCalledWith([]);
  });

  it("renders 'Clear all (N)' with the active count and clears everything", () => {
    const onChange = vi.fn();
    const { getByRole } = render(
      <FilterBar showClearAll onChange={onChange}
        value={[{ field: "q", op: "contains", value: "abc" }, { field: "amount", op: "=", value: 3 }]}
        fields={[{ field: "q", label: "Query", type: "search" }, { field: "amount", label: "Amount", type: "number" }]} />,
    );
    const clearAll = getByRole("button", { name: /Clear all/ });
    expect(clearAll.textContent).toContain("Clear all (2)");
    fireEvent.click(clearAll);
    expect(onChange).toHaveBeenCalledWith([]);
  });

  it("disables 'Clear all' when nothing is active", () => {
    const { getByRole } = render(
      <FilterBar showClearAll value={[]} fields={[{ field: "q", label: "Query", type: "search" }]} />,
    );
    expect(getByRole("button", { name: /Clear all/ })).toBeDisabled();
  });

  it("splits a daterange into `>=` and `<` clauses (controlled round-trip stays active)", () => {
    const onChange = vi.fn();
    const { container } = render(
      <FilterBar onChange={onChange}
        value={[{ field: "createdAt", op: ">=", value: new Date(2024, 0, 1) }, { field: "createdAt", op: "<", value: new Date(2024, 1, 1) }]}
        fields={[{ field: "createdAt", label: "Created", type: "daterange" }]} />,
    );
    // Two clauses hydrate one active daterange -> its per-field ✕ is present.
    const field = container.querySelector('[data-type="daterange"]');
    const clear = within(field).getByRole("button", { name: "Clear Created" });
    fireEvent.click(clear);
    expect(onChange).toHaveBeenCalledWith([]);
  });

  it("resolves dependent/cascading options as a function of the current values", () => {
    const articleOptions = vi.fn(() => [{ value: "a1", label: "Article 1" }]);
    render(
      <FilterBar value={[{ field: "model", op: "isAnyOf", value: ["m1"] }]}
        fields={[
          { field: "model", label: "Model", type: "multiselect", options: MODELS },
          { field: "article", label: "Article", type: "multiselect", options: articleOptions },
        ]} />,
    );
    expect(articleOptions).toHaveBeenCalledWith(expect.objectContaining({ model: ["m1"] }));
  });
});
