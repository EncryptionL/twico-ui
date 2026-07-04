import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { List } from "../components/data-display/List.jsx";

const items = [
  { title: "Home", href: "/" },
  { title: "Inbox", onClick: () => {} },
  { title: "Plain row" },
];

describe("List roles (#123)", () => {
  it("exposes an explicit list + listitem roles", () => {
    render(<List items={items} />);
    expect(screen.getByRole("list")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
  });

  it("a consumer role override wins over the default role='list'", () => {
    render(<List items={items} role="menu" />);
    expect(screen.queryByRole("list")).toBeNull();
    expect(screen.getByRole("menu")).toBeInTheDocument();
  });
});

describe("List active row (#124)", () => {
  it("sets aria-current='page' on the active interactive row only", () => {
    const { container } = render(
      <List items={[{ title: "A", href: "/a", active: true }, { title: "B", href: "/b" }]} />
    );
    const links = container.querySelectorAll("a.twc-list__item");
    expect(links[0]).toHaveAttribute("aria-current", "page");
    expect(links[1]).not.toHaveAttribute("aria-current");
  });
});

describe("List empty state (#125)", () => {
  it("renders the default empty message and no listitems when items is empty", () => {
    const { container } = render(<List items={[]} />);
    expect(container.querySelector(".twc-list__empty")).toHaveTextContent("Nothing here yet");
    expect(screen.queryAllByRole("listitem")).toHaveLength(0);
  });

  it("renders a custom emptyMessage node", () => {
    const { container } = render(<List items={[]} emptyMessage={<span>No results</span>} />);
    expect(container.querySelector(".twc-list__empty")).toHaveTextContent("No results");
  });

  it("a non-empty list renders no empty slot", () => {
    const { container } = render(<List items={items} />);
    expect(container.querySelector(".twc-list__empty")).toBeNull();
  });
});
