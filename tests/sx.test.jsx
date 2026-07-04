import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { Box } from "../components/layout/Box.jsx";
import { Card } from "../components/data-display/Card.jsx";
import { compileSx } from "../components/_sx.js";

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
