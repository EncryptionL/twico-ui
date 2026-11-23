import React from "react";
import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { DiffTable } from "../src/index.ts";

afterEach(cleanup);

const key = (r) => r.id;

// Every property actually SET on the style attribute, read off the declaration rather than probed by
// name. See docs/development.md - a hand-written list of property names leaves a hole the size of
// every spelling it did not think of.
const inline = (el) => [...el.style].sort();

// =================================================================================================
// #555 — the last inline font-family #551 left behind. base.css supplies --font-sans by inheritance,
// so this re-declared it; and being inline it beat a container font a consumer set on an ancestor,
// which is the override #551 exists to let through. It also applied on ONE branch, so a labelled
// DiffTable and a bare one answered differently.
// =================================================================================================
describe("DiffTable — the last redundant font-family (#555)", () => {
  const from = [{ id: 1, sku: "A-1", qty: 2 }];
  const to = [{ id: 1, sku: "A-1", qty: 5 }];
  const dcols = [{ field: "sku" }, { field: "qty" }];

  it("the labelled wrapper carries no inline font-family", () => {
    const { container } = render(
      <DiffTable from={from} to={to} rowKey={key} columns={dcols} label="Changes" className="wrap" />);
    const wrap = container.querySelector(".wrap");
    expect(wrap, "the labelled branch renders a wrapper").not.toBeNull();
    expect(inline(wrap).filter((p) => p.includes("font")),
      "an inline font-family would veto a consumer's container font").toEqual([]);
  });

  it("...and nothing else moved: the wrapper still lays itself out", () => {
    const { container } = render(
      <DiffTable from={from} to={to} rowKey={key} columns={dcols} label="Changes" className="wrap" />);
    // jsdom expands the `gap` shorthand into its longhands, which is the whole reason this
    // enumerates the declaration instead of probing names it chose in advance.
    expect(inline(container.querySelector(".wrap")))
      .toEqual(["column-gap", "display", "flex-direction", "row-gap"]);
  });

  it("the label's own div keeps its token styles, and still names no font", () => {
    const { container } = render(
      <DiffTable from={from} to={to} rowKey={key} columns={dcols} label="Changes" className="wrap" />);
    const label = container.querySelector(".wrap > div");
    expect(label.textContent).toBe("Changes");
    expect(inline(label), "the asymmetry inside one return is what made this hard to see")
      .toEqual(["color", "font-size", "font-weight"]);
  });

  it("a consumer's own style prop composes with the wrapper's, rather than being dropped", () => {
    // The component's style object was written AFTER {...rest}, so it replaced the consumer's
    // `style` outright - the same shape of defect as the font-family, in the same expression.
    const { container } = render(
      <DiffTable from={from} to={to} rowKey={key} columns={dcols} label="Changes" className="wrap"
        style={{ marginBlockStart: "8px", fontFamily: "Georgia, serif" }} />);
    const wrap = container.querySelector(".wrap");
    expect(wrap.style.marginBlockStart).toBe("8px");
    expect(wrap.style.fontFamily, "and a consumer MAY set the font - it is the library that must not")
      .toBe("Georgia, serif");
    expect(wrap.style.display, "while the wrapper still lays itself out").toBe("flex");
  });

  it("...and on the bare branch too, where it reaches the grid", () => {
    const { container } = render(
      <DiffTable from={from} to={to} rowKey={key} columns={dcols} className="bare"
        style={{ marginBlockStart: "8px" }} />);
    expect(container.querySelector(".bare").style.marginBlockStart).toBe("8px");
  });

  it("the two branches now answer the same question the same way", () => {
    const { container: withLabel } = render(
      <DiffTable from={from} to={to} rowKey={key} columns={dcols} label="Changes" className="wrap" />);
    const { container: bare } = render(
      <DiffTable from={from} to={to} rowKey={key} columns={dcols} className="bare" />);
    const fonts = (root) => [...root.querySelectorAll("*")]
      .filter((el) => [...el.style].some((p) => p === "font-family")).map((el) => el.className);
    expect(fonts(withLabel), "labelled").toEqual([]);
    expect(fonts(bare), "bare").toEqual([]);
  });
});
