import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Stack } from "../components/layout/Stack.jsx";

describe("Stack padding (#145)", () => {
  it("p sets all four longhands", () => {
    const { container } = render(<Stack p={4}>x</Stack>);
    const el = container.querySelector(".twc-stack");
    expect(el.style.paddingTop).toBe("var(--space-4)");
    expect(el.style.paddingRight).toBe("var(--space-4)");
    expect(el.style.paddingBottom).toBe("var(--space-4)");
    expect(el.style.paddingLeft).toBe("var(--space-4)");
  });
  it("most-specific wins (pt over py over p)", () => {
    const { container } = render(<Stack px={2} pt={6}>x</Stack>);
    const el = container.querySelector(".twc-stack");
    expect(el.style.paddingTop).toBe("var(--space-6)");
    expect(el.style.paddingLeft).toBe("var(--space-2)");
    expect(el.style.paddingRight).toBe("var(--space-2)");
  });
});

describe("Stack divider (#145)", () => {
  it("interleaves a divider between children only", () => {
    const { container } = render(
      <Stack divider={<hr />}>
        <span>a</span>
        <span>b</span>
        <span>c</span>
      </Stack>
    );
    expect(container.querySelectorAll("hr")).toHaveLength(2);
  });
  it("single child has no divider", () => {
    const { container } = render(
      <Stack divider={<hr />}>
        <span>only</span>
      </Stack>
    );
    expect(container.querySelectorAll("hr")).toHaveLength(0);
  });
});
