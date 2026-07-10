import React from "react";
import { describe, it, expect } from "vitest";
import { render, act } from "@testing-library/react";
import { ToastProvider, useToast } from "../components/feedback/ToastProvider.jsx";
import { Toast } from "../components/feedback/Toast.jsx";

function Harness({ onReady }) {
  const { toast } = useToast();
  React.useEffect(() => { onReady(toast); }, [onReady, toast]);
  return null;
}

// #209 (WCAG 4.1.3): the provider keeps persistent live regions (created before any toast
// exists) and mirrors each toast's text into them, so screen readers announce reliably.
describe("Toast live-region announcements (#209)", () => {
  it("mirrors polite/assertive text; provider cards are role=group (no double-announce)", () => {
    let api;
    const { container } = render(
      <ToastProvider><Harness onReady={(t) => (api = t)} /></ToastProvider>,
    );
    const polite = container.querySelector('.twc-toast-sr[aria-live="polite"]');
    const assertive = container.querySelector('.twc-toast-sr[aria-live="assertive"]');
    expect(polite).not.toBeNull();
    expect(assertive).not.toBeNull();

    act(() => { api.success("Saved"); });
    expect(polite).toHaveTextContent("Saved");
    expect(assertive).toHaveTextContent(""); // normal toast doesn't hit the assertive region

    act(() => { api.danger("Upload failed"); });
    expect(assertive).toHaveTextContent("Upload failed");

    // The rendered cards carry role="group", not a live role, so they don't double-announce.
    expect(container.querySelector('.twc-toast[role="group"]')).not.toBeNull();
    expect(container.querySelector('.twc-toast[role="alert"]')).toBeNull();
    expect(container.querySelector('.twc-toast[role="status"]')).toBeNull();
  });

  it("standalone <Toast> (no provider) keeps its alert/status role", () => {
    const { container } = render(<Toast tone="danger" title="x" />);
    expect(container.querySelector('.twc-toast[role="alert"]')).not.toBeNull();
    const { container: c2 } = render(<Toast tone="info" title="y" />);
    expect(c2.querySelector('.twc-toast[role="status"]')).not.toBeNull();
  });
});
