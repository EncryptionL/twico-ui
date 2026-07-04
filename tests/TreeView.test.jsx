import { describe, it, expect } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { TreeView } from "../components/navigation/TreeView.jsx";

const items = [
  { id: "a", label: "Apple", children: [{ id: "a1", label: "Ant" }, { id: "a2", label: "Acorn" }] },
  { id: "b", label: "Banana" },
  { id: "c", label: "Cherry" },
];

describe("TreeView position semantics (#132)", () => {
  it("sets aria-setsize/aria-posinset per sibling set", () => {
    render(<TreeView items={items} defaultExpanded={["a"]} />);
    const all = screen.getAllByRole("treeitem");
    const roots = all.filter((el) => el.getAttribute("aria-level") === "1");
    expect(roots).toHaveLength(3);
    roots.forEach((el, i) => {
      expect(el).toHaveAttribute("aria-setsize", "3");
      expect(el).toHaveAttribute("aria-posinset", String(i + 1));
    });
    const kids = all.filter((el) => el.getAttribute("aria-level") === "2");
    expect(kids).toHaveLength(2);
    kids.forEach((el, i) => {
      expect(el).toHaveAttribute("aria-setsize", "2");
      expect(el).toHaveAttribute("aria-posinset", String(i + 1));
    });
  });
});

describe("TreeView type-ahead (#133)", () => {
  it("focuses the next node whose string label starts with the typed key", () => {
    render(<TreeView items={items} />);
    const [aRow] = screen.getAllByRole("treeitem");
    act(() => aRow.focus());
    fireEvent.keyDown(aRow, { key: "b" });
    expect(document.activeElement).toBe(screen.getByRole("treeitem", { name: "Banana" }));
  });
});
