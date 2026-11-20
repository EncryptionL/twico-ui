import React from "react";
import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup, screen } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { Text, Heading, Pre, FieldRow, Input } from "../src/index.ts";

afterEach(cleanup);

const src = (p) => readFileSync(resolve(process.cwd(), p), "utf8");
const TEXT = "components/typography/Text.jsx";
const HEADING = "components/typography/Heading.jsx";
const PRE = "components/typography/Pre.jsx";
const FIELDROW = "components/inputs/FieldRow.jsx";

// =================================================================================================
// #543 — Text and Heading reset their UA margins with an INLINE style, and an inline declaration
// beats every stylesheet rule whatever its specificity. So the reset could not be overridden by
// anything: not a consumer's CSS, not a className, and not the library itself. FieldRow's
// fragment-cell lane (#531) is a `margin-block-end` on the cell's lane-less child, and it was the
// library vetoing itself — a word between two inputs in a range row sat one lane (24px) below its
// siblings' control boxes on the wrapping path, computed margin 0px instead of the calc().
//
// jsdom has no `:has()` and no real cascade for it, so the geometry is proved by .work/probe
// (headless Chromium, 24px -> 0px at 520px, 760px and the default floor, validated by reverting a
// single inline declaration). What is asserted here is the mechanism each side depends on.
// =================================================================================================
describe("typography margin reset is a stylesheet rule, not an inline style (#543)", () => {
  it("Text renders NO inline margin", () => {
    render(<Text>x</Text>);
    const el = screen.getByText("x");
    for (const p of ["margin", "marginTop", "marginRight", "marginBottom", "marginLeft"]) {
      expect(el.style[p], `inline ${p} would be unoverridable`).toBe("");
    }
  });

  it("Heading renders NO inline margin", () => {
    render(<Heading level={3}>y</Heading>);
    const el = screen.getByText("y");
    for (const p of ["margin", "marginTop", "marginRight", "marginBottom", "marginLeft"]) {
      expect(el.style[p], `inline ${p} would be unoverridable`).toBe("");
    }
  });

  it("...and the reset is in each component's own scoped stylesheet instead", () => {
    expect(src(TEXT)).toContain(".twc-text { margin: 0; }");
    expect(src(HEADING)).toContain(".twc-heading { margin: 0; }");
    expect(src(TEXT)).toContain('useScopedStyles("twc-text-styles"');
    expect(src(HEADING)).toContain('useScopedStyles("twc-heading-styles"');
  });

  it("Pre already did it this way - the pattern is in-house, not new", () => {
    expect(src(PRE)).toContain(".twc-pre { margin: 0;");
    expect(src(PRE)).not.toContain("marginBottom: 0");
  });

  it("the rule reaches <head>, so it is not a <style> inside a <p>", () => {
    // React 19 hoists a `<style href precedence>` out of the tree; React 18 injects it and renders
    // nothing. Either way the element itself must not carry a style child, because <style> is
    // metadata content and <p> accepts only phrasing content.
    render(<Text>hoisted</Text>);
    const el = screen.getByText("hoisted");
    expect(el.querySelector("style"), "a <style> inside <p> is invalid HTML").toBeNull();
    const heads = [...document.head.querySelectorAll("style")].map((s) => s.textContent || "").join("\n");
    expect(heads).toContain(".twc-text { margin: 0; }");
  });

  it("one stylesheet for every instance - useScopedStyles dedupes by id", () => {
    render(<div><Text>a</Text><Text>b</Text><Text>c</Text></div>);
    const hits = [...document.head.querySelectorAll("style")]
      .filter((s) => (s.textContent || "").includes(".twc-text { margin: 0; }"));
    expect(hits).toHaveLength(1);
  });

  it("a style prop still wins, so the escape hatch is unchanged", () => {
    render(<Text style={{ marginBottom: 12 }}>spaced</Text>);
    expect(screen.getByText("spaced").style.marginBottom).toBe("12px");
  });

  it("the prop-derived declarations stay inline, because no stylesheet can express them", () => {
    render(<Text size="sm" tone="muted" weight="bold" align="right">v</Text>);
    const el = screen.getByText("v");
    expect(el.style.fontSize).toBe("var(--text-sm)");
    expect(el.style.color).toBe("var(--color-text-muted)");
    expect(el.style.fontWeight).toBe("var(--font-bold)");
    expect(el.style.textAlign).toBe("right");
  });

  // An adversarial review caught the first version of this change claiming that everything left
  // inline "carries prop values" and that "only the constant moved". Both false: Text keeps two
  // constants inline and Heading keeps five, and the claim was written with Text's prop list pasted
  // onto Heading, which has no tone, color or weight prop at all. Those constants are as
  // un-overridable by a stylesheet as the margin was - the same defect class #543 is named after -
  // so the EXACT split is pinned here. If a constant is later moved to the sheet, or a new one is
  // added inline, this fails and the prose has to be updated with it.
  it("pins exactly which constants are STILL inline - the claim this change got wrong", () => {
    const inlineProps = (el) => [...el.style].sort();
    render(<div><Text>t</Text><Heading level={2}>h</Heading></div>);

    // Text: 2 constants + 2 prop-derived defaults (size -> font-size, tone -> color).
    expect(inlineProps(screen.getByText("t"))).toEqual(
      ["color", "font-family", "font-size", "line-height"]);
    // Heading: 5 constants + 1 prop-derived default (level -> font-size).
    expect(inlineProps(screen.getByText("h"))).toEqual(
      ["color", "font-family", "font-size", "font-weight", "letter-spacing", "line-height"]);

    // ...and NONE of them is in the scoped sheet, which carries the margin and nothing else.
    expect(src(TEXT)).toContain(".twc-text { margin: 0; }");
    expect(src(HEADING)).toContain(".twc-heading { margin: 0; }");
    for (const [file, cls] of [[TEXT, "twc-text"], [HEADING, "twc-heading"]]) {
      const css = src(file).slice(src(file).indexOf("." + cls + " {"), src(file).indexOf("`;"));
      for (const p of ["font-family", "line-height", "color", "font-weight", "letter-spacing"]) {
        expect(css, p + " is still inline, so it must not also be in the sheet").not.toContain(p);
      }
    }
  });

  it("Heading has no tone, color or weight prop - the mis-pasted list", () => {
    // The false claim named props Heading does not have. Pinned so the prose cannot drift back.
    const d = src("components/typography/Heading.d.ts");
    for (const p of ["tone?", "weight?"]) {
      expect(d, "Heading must not have a " + p + " prop, or the note needs rewriting").not.toContain(p);
    }
    expect(src("components/typography/Text.d.ts")).toContain("tone?");
  });

  it("the lane that was being vetoed is still a margin-block-end at (0,3,0)", () => {
    // The two halves have to agree: the reset is a single class (0,1,0) and the lane is three, so
    // the lane wins. If the lane ever became a single class, or the reset gained an id or an
    // !important, this would silently go back to 24px out.
    const fr = src(FIELDROW);
    expect(fr).toContain("margin-block-end: calc(var(--space-1-5) + var(--twc-fieldrow-footer-lines, 1)");
    expect(fr, "the lane must not need !important to beat a reset").not.toContain("margin-block-end: calc(var(--space-1-5) + var(--twc-fieldrow-footer-lines, 1) * var(--text-xs) * var(--leading-normal, 1.5)) !important");
    for (const s of [TEXT, HEADING]) {
      expect(src(s), "an !important reset would re-arm the veto").not.toContain("margin: 0 !important");
    }
  });

  it("a range row is still one cell of three children, with the word not a field", () => {
    const Range = () => (<><Input label="from" /><Text size="sm">to</Text><Input label="to" /></>);
    const { container } = render(<FieldRow wrap minChildWidth="15rem"><Range /></FieldRow>);
    const cell = container.querySelector(".twc-fieldrow__cell");
    expect(cell.children).toHaveLength(3);
    expect(cell.children[1].className).toContain("twc-text");
    expect(cell.children[1].style.marginBottom, "nothing inline to veto the lane").toBe("");
  });
});
