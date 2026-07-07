import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { Box } from "../components/layout/Box.jsx";
import { Card } from "../components/data-display/Card.jsx";
import { Container } from "../components/layout/Container.jsx";
import { Text } from "../components/typography/Text.jsx";
import { Heading } from "../components/typography/Heading.jsx";
import { compileSx, buildSx } from "../components/_sx.js";

// #53: the `sx` escape hatch. Flat declarations go inline (winning over the base
// style); nested selector/at-rule keys compile to a scoped <style>.

describe("compileSx (compiler rules)", () => {
  it("kebab-cases props and appends px to numbers (unitless allowlist excepted)", () => {
    const css = compileSx({ marginTop: 8, zIndex: 5, opacity: 1, lineHeight: 1.5 }, "[data-x]");
    expect(css).toContain("margin-top: 8px");
    expect(css).toContain("z-index: 5;"); // unitless
    expect(css).toContain("opacity: 1;"); // unitless
    expect(css).toContain("line-height: 1.5;"); // unitless
  });

  it("leaves custom properties and string values untouched", () => {
    const css = compileSx({ "--gap": 4, color: "var(--color-primary)" }, "[data-x]");
    expect(css).toContain("--gap: 4;");
    expect(css).toContain("color: var(--color-primary);");
  });

  it("resolves &, pseudo, descendant, and @-rule keys against the scope", () => {
    const css = compileSx(
      {
        "&:hover": { color: "red" },
        ":focus-visible": { outline: "2px solid" },
        "& > span": { fontWeight: 700 },
        "@media (min-width: 600px)": { display: "none" },
      },
      "[data-x]",
    );
    expect(css).toContain("[data-x]:hover { color: red; }");
    expect(css).toContain("[data-x]:focus-visible {");
    expect(css).toContain("[data-x] > span {");
    expect(css).toMatch(/@media \(min-width: 600px\) \{ \[data-x\] \{ display: none; \} \}/);
  });
});

describe("Box sx (runtime)", () => {
  it("flat sx lands as inline style and overrides the base style prop", () => {
    const { container } = render(<Box p={2} sx={{ paddingTop: 30 }} />);
    const el = container.querySelector(".twc-box");
    // Base p={2} sets paddingTop to a token; sx paddingTop merges last and wins.
    expect(el.style.paddingTop).toBe("30px");
  });

  it("nested sx sets data-twc-sx and emits a scoped stylesheet", () => {
    const { container } = render(<Box sx={{ "&:hover": { color: "rgb(255, 0, 0)" } }} />);
    const el = container.querySelector(".twc-box");
    const uid = el.getAttribute("data-twc-sx");
    expect(uid).toBeTruthy();
    const styles = Array.from(document.querySelectorAll("style")).map((s) => s.textContent).join("\n");
    expect(styles).toContain(`[data-twc-sx="${uid}"]:hover`);
    expect(styles).toContain("color: rgb(255, 0, 0)");
  });

  it("does not set data-twc-sx when sx has only flat declarations", () => {
    const { container } = render(<Box sx={{ margin: 4 }} />);
    expect(container.querySelector(".twc-box").getAttribute("data-twc-sx")).toBeNull();
  });

  it("wraps @media blocks", () => {
    const { container } = render(<Box sx={{ "@media (min-width: 600px)": { display: "none" } }} />);
    const uid = container.querySelector(".twc-box").getAttribute("data-twc-sx");
    const styles = Array.from(document.querySelectorAll("style")).map((s) => s.textContent).join("\n");
    expect(styles).toContain("@media (min-width: 600px)");
    expect(styles).toContain(`[data-twc-sx="${uid}"] { display: none; }`);
  });
});

describe("Card sx", () => {
  it("threads sx (flat inline + scoped nested)", () => {
    const { container } = render(<Card sx={{ maxWidth: 320, "&:hover": { color: "blue" } }}>x</Card>);
    const el = container.querySelector(".twc-card");
    expect(el.style.maxWidth).toBe("320px");
    const uid = el.getAttribute("data-twc-sx");
    const styles = Array.from(document.querySelectorAll("style")).map((s) => s.textContent).join("\n");
    expect(styles).toContain(`[data-twc-sx="${uid}"]:hover`);
  });
});

describe("sx SSR (React 19, no FOUC)", () => {
  it("includes the scoped <style> in the server-rendered markup", () => {
    const html = renderToStaticMarkup(<Box sx={{ "&:hover": { color: "green" } }} />);
    expect(html).toContain("data-twc-sx=");
    expect(html).toContain("<style");
    expect(html).toContain(":hover");
  });
});

// #188: flat box-model shorthands normalize to leaf longhands so React never sees a
// shorthand + its longhands on the same node (which warns on rerender). Assert on the pure
// buildSx().flatStyle — jsdom's CSSOM reconstitutes shorthands and simplifies calc() on
// read, so the DOM `.style` getters are lossy; the flat-style object is the real signal.
describe("sx box-model shorthand normalization (#188)", () => {
  const flat = (sx) => buildSx(sx, "x").flatStyle;

  it("expands a numeric `padding` to four longhands, kept numeric so React adds px", () => {
    expect(flat({ padding: 20 })).toEqual({
      paddingTop: 20, paddingRight: 20, paddingBottom: 20, paddingLeft: 20,
    });
  });

  it("expands a 2-value `margin` string as [block, inline]", () => {
    expect(flat({ margin: "0.5rem 0" })).toEqual({
      marginTop: "0.5rem", marginRight: "0", marginBottom: "0.5rem", marginLeft: "0",
    });
  });

  it("expands 4-value shorthands per CSS TRBL order", () => {
    expect(flat({ padding: "1px 2px 3px 4px" })).toEqual({
      paddingTop: "1px", paddingRight: "2px", paddingBottom: "3px", paddingLeft: "4px",
    });
  });

  it("expands 3-value shorthands as [top, inline, bottom]", () => {
    expect(flat({ padding: "1px 2px 3px" })).toEqual({
      paddingTop: "1px", paddingRight: "2px", paddingBottom: "3px", paddingLeft: "2px",
    });
  });

  it("expands `inset` to top/right/bottom/left", () => {
    expect(flat({ inset: "0 auto" })).toEqual({ top: "0", right: "auto", bottom: "0", left: "auto" });
  });

  it("expands logical block/inline shorthands to start/end longhands", () => {
    expect(flat({ paddingInline: "1rem", marginBlock: "2px 4px" })).toEqual({
      paddingInlineStart: "1rem", paddingInlineEnd: "1rem",
      marginBlockStart: "2px", marginBlockEnd: "4px",
    });
  });

  it("does not split whitespace inside calc()/var()", () => {
    expect(flat({ padding: "calc(1px + 2px) var(--space-2)" })).toEqual({
      paddingTop: "calc(1px + 2px)", paddingRight: "var(--space-2)",
      paddingBottom: "calc(1px + 2px)", paddingLeft: "var(--space-2)",
    });
  });

  it("lets an explicit longhand written after the shorthand win (source order)", () => {
    expect(flat({ padding: 8, paddingTop: 30 })).toEqual({
      paddingTop: 30, paddingRight: 8, paddingBottom: 8, paddingLeft: 8,
    });
  });

  it("leaves non-box properties untouched", () => {
    expect(flat({ gap: 12, color: "rgb(1, 2, 3)" })).toEqual({ gap: 12, color: "rgb(1, 2, 3)" });
  });

  it("actually renders the longhand on the element (runtime smoke)", () => {
    const { container } = render(<Box sx={{ padding: 20 }} />);
    expect(container.querySelector(".twc-box").style.paddingTop).toBe("20px");
  });
});

// #188 (regression): the warning only stays gone if NO box shorthand survives on the node.
// Primitives whose base style used a box shorthand (Container marginInline/paddingInline,
// Text/Heading margin) now emit longhands too, so an sx-expanded longhand never coexists with
// a base shorthand. Assert React logs no shorthand/longhand collision across an sx add/remove.
describe("sx box shorthands never trip React's shorthand/longhand warning on rerender (#188)", () => {
  const cases = [
    ["Box (base longhands)", Box, { padding: 20 }],
    ["Container (base inline shorthands) + sx paddingInline", Container, { paddingInline: "2rem" }],
    ["Container + sx margin", Container, { margin: 8 }],
    ["Text (base margin) + sx margin", Text, { margin: 8 }],
    ["Heading (base margin) + sx marginBlock", Heading, { marginBlock: "1rem" }],
  ];
  it.each(cases)("%s: no collision warning across sx add/remove", (_name, Comp, sx) => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const { rerender } = render(<Comp sx={sx}>x</Comp>);
    rerender(<Comp>x</Comp>);         // drop sx -> its longhands are removed on the node
    rerender(<Comp sx={sx}>x</Comp>); // add them back
    const collisions = spy.mock.calls.filter((a) =>
      String(a[0] ?? "").includes("Removing a style property during rerender"),
    );
    spy.mockRestore();
    expect(collisions).toEqual([]);
  });
});
