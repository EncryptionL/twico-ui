import React from "react";
import { describe, it, expect, afterEach, vi } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { Popover } from "../components/overlay/Popover.jsx";
import { Menu } from "../components/overlay/Menu.jsx";
import { Button } from "../components/buttons/Button.jsx";
import { Tooltip } from "../components/overlay/Tooltip.jsx";

// #447 — static inspection cannot see through a component type, so <Box>/<Stack> (which render a div)
// slip past triggerIsControl. A dev-only runtime audit names the prop rather than leaving a consumer to
// read dist/index.mjs to discover the trigger is cloned at all.
//
// This lives in its own file on purpose: warnOnce dedupes by key for the lifetime of the module, and
// vitest isolates modules per test file, so each key here fires exactly once and is actually observable.

const items = [{ label: "One", onClick: () => {} }];
afterEach(() => cleanup());

describe("trigger audit warns in development (#447)", () => {
  it("flags a wrapper around a real control as two tab stops", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(<Popover trigger={<div><button>Go</button></div>}>body</Popover>);
    const msg = warn.mock.calls.map((c) => String(c[0])).join(" ");
    expect(msg).toMatch(/twico-ui Popover: `trigger` is a <div> wrapping a focusable control/);
    expect(msg).toMatch(/TWO tab stops/);
    warn.mockRestore();
  });

  it("tells you to put Tooltip OUTSIDE when it is used inside the trigger", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(<Menu trigger={<Tooltip label="hi"><button>Open</button></Tooltip>} items={items} />);
    const msg = warn.mock.calls.map((c) => String(c[0])).join(" ");
    expect(msg).toMatch(/Put Tooltip OUTSIDE/);
    warn.mockRestore();
  });

  it("names the prop for a role-less non-control trigger (the <Box>/<Stack> case)", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    // a component-rendered div: triggerIsControl cannot see through the type, so no role is injected
    const Box = ({ children, ...p }) => <div {...p}>{children}</div>;
    render(<Popover trigger={<Box>Open</Box>}>body</Popover>);
    const msg = warn.mock.calls.map((c) => String(c[0])).join(" ");
    expect(msg).toMatch(/renders <div>, not a button/);
    warn.mockRestore();
  });

  it("stays quiet for a proper Button trigger", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(<Popover trigger={<Button>Open</Button>}>body</Popover>);
    expect(warn.mock.calls.filter((c) => /`trigger`/.test(String(c[0])))).toHaveLength(0);
    warn.mockRestore();
  });
});
