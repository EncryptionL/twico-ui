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
// Every margin property actually SET on the style attribute, read off the declaration itself
// rather than probed by name.
//
// The first three versions of these tests listed the five PHYSICAL longhands
// (margin/marginTop/marginRight/marginBottom/marginLeft) and asked for each to be "". That has a
// hole, found by injecting the regression rather than by reading the test: `style={{ marginBlock:
// 0 }}` sets margin-block-start/-end, which no physical longhand reflects, so the inline reset
// came back and all three tests still passed. Logical properties are not an exotic case here -
// the library is written in them throughout (CLAUDE.md §5, RTL), so they are the spelling a
// regression would most plausibly use. Enumerating the declaration catches every spelling,
// including shorthands this list would never have thought to name.
const inlineMargins = (el) => Array.from(el.style).filter((p) => p.includes("margin"));

describe("typography margin reset is a stylesheet rule, not an inline style (#543)", () => {
  it("Text renders NO inline margin", () => {
    render(<Text>x</Text>);
    const el = screen.getByText("x");
    expect(inlineMargins(el), "an inline margin would be unoverridable").toEqual([]);
  });

  it("Heading renders NO inline margin", () => {
    render(<Heading level={3}>y</Heading>);
    const el = screen.getByText("y");
    expect(inlineMargins(el), "an inline margin would be unoverridable").toEqual([]);
  });

  it("...and every CONSTANT is in each component's own scoped stylesheet instead", () => {
    // #547 completed what #543 started: the margin was the one case where the library vetoed
    // itself, but every other constant was equally un-overridable. All seven moved.
    expect(src(TEXT)).toContain(".twc-text { margin: 0; line-height: var(--leading-body, 1.6); }");
    expect(src(HEADING)).toContain(".twc-heading { margin: 0; font-weight: var(--font-bold);");
    expect(src(HEADING)).toContain("color: var(--color-text); line-height: var(--leading-tight, 1.2);");
    expect(src(HEADING)).toContain("letter-spacing: var(--tracking-heading, -0.02em); }");
    // #547: font-family is DELETED, not relocated. base.css sets it on `body`, so it reaches every
    // `as` tag by inheritance - and an inherited value loses to ANY matching rule, where a class
    // rule at (0,1,0) would block an ancestor font. Measured: with the class rule a consumer's
    // `.content { font-family: Georgia }` is blocked; without it, Georgia wins. Identical with no
    // stylesheet loaded either way, because an undefined var() is invalid at computed-value time and
    // font-family inherits regardless.
    for (const f of [TEXT, HEADING]) {
      expect(src(f), "font-family must be deleted, not moved to the class").not.toContain("font-family: var(--font-sans)");
    }
    // Every token reference carries a fallback, or a consumer without the stylesheet gets `normal`.
    expect(src(TEXT)).toContain("var(--leading-body, 1.6)");
    expect(src(HEADING)).toContain("var(--leading-tight, 1.2)");
    expect(src(HEADING)).toContain("var(--tracking-heading, -0.02em)");
    expect(src(TEXT)).toContain('useScopedStyles("twc-text-styles"');
    expect(src(HEADING)).toContain('useScopedStyles("twc-heading-styles"');
  });

  it("Pre already did it this way - the pattern is in-house, not new", () => {
    // Pre is the precedent this whole issue appeals to, and the claim was asserted only by
    // grepping its source for one spelling of the reset. That passes even if Pre moves the reset
    // back INLINE under a different spelling (`margin: 0` in a style object, or marginBlock), which
    // is precisely the regression #543 was about. The behavioural assertion its Text and Heading
    // siblings get was missing here, and the unused `Pre` import was the evidence - it is what
    // CodeQL alert 61 (js/unused-local-variable) was pointing at.
    const { container } = render(<Pre>preformatted</Pre>);
    const el = container.querySelector(".twc-pre");
    expect(el, "Pre must render a .twc-pre element").not.toBeNull();
    expect(inlineMargins(el), "an inline margin would be unoverridable").toEqual([]);
    // Same hoisting contract as Text/Heading: <style> is metadata content, and `pre` takes
    // phrasing content, so a <style> child would be invalid HTML.
    expect(el.querySelector("style"), "a <style> inside <pre> is invalid HTML").toBeNull();
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
    expect(heads).toContain(".twc-text { margin: 0; line-height: var(--leading-body, 1.6); }");
  });

  it("one stylesheet for every instance - useScopedStyles dedupes by id", () => {
    render(<div><Text>a</Text><Text>b</Text><Text>c</Text></div>);
    const hits = [...document.head.querySelectorAll("style")]
      .filter((s) => (s.textContent || "").includes(".twc-text { margin: 0;"));
    expect(hits).toHaveLength(1);
  });

  it("the base sheet renders BEFORE the sx sheet, which is what makes sx's promise true", () => {
    // docs/sx.md promises nested sx rules beat the component's own class rules. Both are (0,1,0) -
    // sx scopes its nested blocks to [data-twc-sx="uid"], an attribute selector, which is
    // class-grade - so the winner is SOURCE ORDER inside the shared twc-ui precedence group.
    // Measured: base-then-sx gives line-height 48px (sx wins); sx-then-base gives 25.6px (sx
    // loses). So the order of these two nodes in the JSX is load-bearing, not cosmetic.
    for (const f of [TEXT, HEADING]) {
      const body = src(f);
      const base = body.indexOf("{__twcStyles}");
      const sx = body.indexOf("{styleNode}");
      expect(base, "__twcStyles must be rendered").toBeGreaterThan(-1);
      expect(sx, "styleNode must be rendered").toBeGreaterThan(-1);
      expect(base, "the base sheet must come FIRST or nested sx stops overriding it").toBeLessThan(sx);
    }
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
  it("pins exactly what is left inline - ONLY prop-derived declarations (#547)", () => {
    const inlineProps = (el) => [...el.style].sort();
    render(<div><Text>t</Text><Heading level={2}>h</Heading></div>);

    // Text: font-size from `size`, color from `tone`. Nothing else.
    expect(inlineProps(screen.getByText("t"))).toEqual(["color", "font-size"]);
    // Heading: font-size from `level`/`size`/`display`. Nothing else.
    expect(inlineProps(screen.getByText("h"))).toEqual(["font-size"]);
  });

  it("every remaining inline declaration really does follow a prop", () => {
    // That is what makes it prop-derived rather than a constant hiding in the style attribute.
    render(<div><Text size="xl" tone="danger">t2</Text><Heading level={5}>h2</Heading></div>);
    expect(screen.getByText("t2").style.fontSize).toBe("var(--text-xl)");
    expect(screen.getByText("t2").style.color).toBe("var(--color-danger)");
    expect(screen.getByText("h2").style.fontSize).toBe("var(--text-base)");
  });

  it("no constant is left in the style attribute, and none is in both channels", () => {
    render(<div><Text>t</Text><Heading level={2}>h</Heading></div>);
    for (const el of [screen.getByText("t"), screen.getByText("h")]) {
      for (const p of ["margin", "marginBottom", "fontFamily", "lineHeight", "letterSpacing"]) {
        expect(el.style[p], p + " must live in the sheet, not inline").toBe("");
      }
    }
    // font-weight and color are prop-derived for Text but constants for Heading, which is the one
    // pair that must legitimately differ between the two components.
    expect(screen.getByText("h").style.fontWeight, "Heading's bold is a constant -> sheet").toBe("");
    expect(screen.getByText("h").style.color, "Heading has no tone prop -> sheet").toBe("");
    expect(screen.getByText("t").style.color, "Text's color comes from tone -> inline").not.toBe("");
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
