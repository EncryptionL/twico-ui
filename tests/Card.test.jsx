import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Card } from "../components/data-display/Card.jsx";

describe("Card header actions slot (#50)", () => {
  it("renders actions inside the header, not the footer", () => {
    const { container } = render(
      <Card title="Report" actions={<button>Export</button>}>body</Card>
    );
    const actions = container.querySelector(".twc-card__actions");
    expect(actions).toHaveTextContent("Export");
    expect(container.querySelector(".twc-card__header")).toContainElement(actions);
    expect(container.querySelector(".twc-card__footer")).toBeNull();
  });

  it("renders the header when only actions are passed", () => {
    const { container } = render(<Card actions={<button>Menu</button>}>body</Card>);
    expect(container.querySelector(".twc-card__header")).not.toBeNull();
    expect(container.querySelector(".twc-card__actions")).toHaveTextContent("Menu");
  });

  it("a title-only card renders no actions element, with the title inside the heading", () => {
    const { container } = render(<Card title="Just a title">body</Card>);
    expect(container.querySelector(".twc-card__actions")).toBeNull();
    expect(container.querySelector(".twc-card__heading .twc-card__title")).toHaveTextContent("Just a title");
  });
});
