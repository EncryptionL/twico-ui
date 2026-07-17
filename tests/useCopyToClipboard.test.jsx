import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, act } from "@testing-library/react";
import React from "react";
import { useCopyToClipboard } from "../hooks/index.js";

// Drive the hook and expose its `copy` so a test can await it.
let api;
function Probe() {
  api = useCopyToClipboard();
  return <span data-testid="copied">{String(api.copied)}</span>;
}

// #255 — copy must work off a secure origin (plain HTTP on a LAN IP), where `navigator.clipboard`
// is undefined, via a legacy execCommand fallback — while still preferring the Clipboard API.
describe("useCopyToClipboard fallback (#255)", () => {
  let origClipboard, origExec;
  beforeEach(() => {
    render(<Probe />);
    origClipboard = navigator.clipboard;
    origExec = document.execCommand;
  });
  afterEach(() => {
    Object.defineProperty(navigator, "clipboard", { value: origClipboard, configurable: true });
    document.execCommand = origExec;
    vi.restoreAllMocks();
  });

  const setClipboard = (v) => Object.defineProperty(navigator, "clipboard", { value: v, configurable: true });

  it("uses the async Clipboard API when available (secure context)", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    setClipboard({ writeText });
    document.execCommand = vi.fn(() => true);
    let result;
    await act(async () => { result = await api.copy("hello"); });
    expect(writeText).toHaveBeenCalledWith("hello");
    expect(document.execCommand).not.toHaveBeenCalled(); // no fallback needed
    expect(result).toBe(true);
  });

  it("falls back to execCommand when navigator.clipboard is undefined (HTTP-on-IP)", async () => {
    setClipboard(undefined);
    const exec = vi.fn(() => true);
    document.execCommand = exec;
    let result;
    await act(async () => { result = await api.copy("codes-123") ; });
    expect(exec).toHaveBeenCalledWith("copy");
    expect(result).toBe(true);
    expect(api.copied).toBe(true);
  });

  it("falls back to execCommand when writeText rejects (permission/transient)", async () => {
    const writeText = vi.fn().mockRejectedValue(new Error("denied"));
    setClipboard({ writeText });
    const exec = vi.fn(() => true);
    document.execCommand = exec;
    let result;
    await act(async () => { result = await api.copy("x"); });
    expect(writeText).toHaveBeenCalled();
    expect(exec).toHaveBeenCalledWith("copy"); // fell through
    expect(result).toBe(true);
  });

  it("reports failure when both paths fail", async () => {
    setClipboard(undefined);
    document.execCommand = vi.fn(() => false);
    let result;
    await act(async () => { result = await api.copy("x"); });
    expect(result).toBe(false);
    expect(api.copied).toBe(false);
  });

  it("leaves no stray textarea in the DOM after the fallback", async () => {
    setClipboard(undefined);
    document.execCommand = vi.fn(() => true);
    await act(async () => { await api.copy("x"); });
    expect(document.querySelectorAll("textarea").length).toBe(0);
  });
});
