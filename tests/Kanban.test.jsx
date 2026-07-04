import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { Kanban } from "../components/data-display/Kanban.jsx";

const columns = [{ id: "todo", title: "To do" }, { id: "done", title: "Done" }];
const cards = [{ id: "c1", column: "todo", title: "Task one" }];

describe("Kanban landmarks (#131)", () => {
  it("board root is a labeled group (default + override)", () => {
    const { container, rerender } = render(<Kanban columns={columns} defaultCards={cards} />);
    const root = container.querySelector(".twc-kanban");
    expect(root).toHaveAttribute("role", "group");
    expect(root).toHaveAttribute("aria-label", "Board");
    rerender(<Kanban columns={columns} defaultCards={cards} aria-label="Sprint 5" />);
    expect(container.querySelector(".twc-kanban")).toHaveAttribute("aria-label", "Sprint 5");
  });

  it("a column with a node title still has an accessible name (id fallback)", () => {
    const { container } = render(<Kanban columns={[{ id: "todo", title: <span>To do</span> }]} defaultCards={[]} />);
    expect(container.querySelector(".twc-kanban__col")).toHaveAttribute("aria-label", "todo");
  });
});

describe("Kanban card names + grab state (#130)", () => {
  it("card aria-label defaults to the string title", () => {
    render(<Kanban columns={columns} defaultCards={cards} />);
    expect(screen.getByRole("button", { name: "Task one" })).toHaveAttribute("data-card-id", "c1");
  });

  it("getCardLabel names a graphical card", () => {
    render(
      <Kanban
        columns={columns}
        defaultCards={[{ id: "c1", column: "todo" }]}
        renderCard={() => <svg />}
        getCardLabel={(c) => `Card ${c.id}`}
      />
    );
    expect(screen.getByRole("button", { name: "Card c1" })).toBeInTheDocument();
  });

  it("Enter toggles the grabbed aria-pressed state", () => {
    render(<Kanban columns={columns} defaultCards={cards} />);
    const card = screen.getByRole("button", { name: "Task one" });
    act(() => card.focus());
    fireEvent.keyDown(card, { key: "Enter" });
    expect(card).toHaveAttribute("aria-pressed", "true");
    fireEvent.keyDown(card, { key: "Enter" });
    expect(card).not.toHaveAttribute("aria-pressed");
  });
});
