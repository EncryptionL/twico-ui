import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { Toast, ToastViewport } from "../components/feedback/Toast.jsx";

describe("Toast auto-dismiss + viewport limit", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("calls onClose after `duration` ms", () => {
    const onClose = vi.fn();
    render(
      <Toast duration={1000} onClose={onClose} title="Hi">
        body
      </Toast>
    );
    expect(onClose).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(1100));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("duration=0 keeps the toast open (no auto-dismiss)", () => {
    const onClose = vi.fn();
    render(
      <Toast duration={0} onClose={onClose} title="Hi">
        body
      </Toast>
    );
    act(() => vi.advanceTimersByTime(10000));
    expect(onClose).not.toHaveBeenCalled();
  });

  it("ToastViewport limit shows only the most recent N toasts", () => {
    render(
      <ToastViewport limit={2}>
        <Toast title="a" duration={0}>1</Toast>
        <Toast title="b" duration={0}>2</Toast>
        <Toast title="c" duration={0}>3</Toast>
      </ToastViewport>
    );
    expect(screen.queryByText("a")).toBeNull();
    expect(screen.getByText("b")).toBeInTheDocument();
    expect(screen.getByText("c")).toBeInTheDocument();
  });
});
