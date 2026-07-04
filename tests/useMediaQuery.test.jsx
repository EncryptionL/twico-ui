import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { useMediaQuery } from "../hooks/index.js";

function Probe({ options }) {
  const matches = useMediaQuery("(min-width: 600px)", options);
  return <span data-testid="v">{String(matches)}</span>;
}

describe("useMediaQuery (#175 — no SSR hydration mismatch)", () => {
  let mmSpy;
  let original;
  beforeEach(() => {
    original = window.matchMedia;
    mmSpy = vi.fn((query) => ({
      matches: true,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
    window.matchMedia = mmSpy;
  });
  afterEach(() => {
    window.matchMedia = original;
  });

  it("default: does NOT read matchMedia in the initializer (starts at defaultValue), then syncs after mount", () => {
    render(<Probe />);
    // Only the layout effect touches matchMedia; the first render returned false.
    expect(mmSpy).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId("v")).toHaveTextContent("true");
  });

  it("initializeWithValue: reads matchMedia eagerly (initializer + effect)", () => {
    render(<Probe options={{ initializeWithValue: true }} />);
    expect(mmSpy).toHaveBeenCalledTimes(2);
    expect(screen.getByTestId("v")).toHaveTextContent("true");
  });

  it("defaultValue overrides the pre-mount value", () => {
    // No matchMedia read before the effect, so the first paint uses defaultValue.
    let firstRender;
    function Capture() {
      const m = useMediaQuery("(min-width: 600px)", { defaultValue: true });
      if (firstRender === undefined) firstRender = m;
      return <span>{String(m)}</span>;
    }
    render(<Capture />);
    expect(firstRender).toBe(true);
  });
});
