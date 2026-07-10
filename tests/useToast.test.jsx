import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { ToastProvider, useToast } from "../components/feedback/ToastProvider.jsx";

function Trigger() {
  const { toast } = useToast();
  return (
    <>
      <button onClick={() => toast.success("Saved")}>ok</button>
      <button onClick={() => toast.error({ title: "Nope", description: "failed" })}>err</button>
    </>
  );
}

describe("useToast / ToastProvider", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("pushes a toast imperatively and auto-dismisses it", () => {
    render(
      <ToastProvider duration={1000}>
        <Trigger />
      </ToastProvider>
    );
    act(() => screen.getByText("ok").click());
    // Scope to the toast card: #209's persistent live-region mirror also holds the text.
    expect(screen.getByText("Saved", { selector: ".twc-toast__title" })).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(1200));
    expect(screen.queryByText("Saved", { selector: ".twc-toast__title" })).toBeNull();
  });

  it("supports an options object (title + description + tone)", () => {
    render(
      <ToastProvider duration={0}>
        <Trigger />
      </ToastProvider>
    );
    act(() => screen.getByText("err").click());
    expect(screen.getByText("Nope")).toBeInTheDocument();
    expect(screen.getByText("failed")).toBeInTheDocument();
    expect(document.querySelector('.twc-toast[data-tone="danger"]')).toBeTruthy();
  });

  it("throws if used outside a provider", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    function Bare() {
      useToast();
      return null;
    }
    expect(() => render(<Bare />)).toThrow(/ToastProvider/);
    spy.mockRestore();
  });
});
