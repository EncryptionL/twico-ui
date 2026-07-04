import { describe, it, expect } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import { usePortal } from "../hooks/index.js";

function PortalProbe({ label = "ported" }) {
  const renderPortal = usePortal();
  return (
    <div data-testid="host">
      {renderPortal(<div data-testid="content">{label}</div>)}
    </div>
  );
}

describe("usePortal (#177)", () => {
  it("portals the node to document.body, not into the host tree", () => {
    render(<PortalProbe />);
    const content = screen.getByTestId("content");
    expect(content).toBeInTheDocument();
    // Portaled straight to <body>, so its parent is body — not the host div.
    expect(content.parentElement).toBe(document.body);
    expect(screen.getByTestId("host")).not.toContainElement(content);
  });

  it("returns a stable callback across renders", () => {
    const seen = new Set();
    function Probe() {
      const renderPortal = usePortal();
      seen.add(renderPortal);
      return renderPortal(<span data-testid="s" />);
    }
    const { rerender } = render(<Probe />);
    rerender(<Probe />);
    expect(seen.size).toBe(1); // same function identity every render
  });
});
