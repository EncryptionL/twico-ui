import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { minifyCss } from "../scripts/css-minify.mjs";

const DQ = String.fromCharCode(34);
const LF = String.fromCharCode(10);
const CR = String.fromCharCode(13);
const NUL = String.fromCharCode(0);
const root = (p) => resolve(import.meta.dirname ?? ".", "..", p);

describe("css-minify (#539)", () => {
  it("drops a comment and the whitespace around it", () => {
    expect(minifyCss("/* a note */\n.x { color: red; }\n").trim()).toBe(".x{color:red}");
  });

  it("keeps a comment delimiter that is inside a STRING", () => {
    const src = ".z::after { content: " + DQ + "/*" + DQ + "; }";
    expect(minifyCss(src)).toContain("content:" + DQ + "/*" + DQ);
  });

  it("does not treat // as a comment: url(//host/path) is protocol-relative", () => {
    expect(minifyCss("@import url(//fonts/x.css);").trim()).toBe("@import url(//fonts/x.css);");
  });

  it("leaves an unquoted data: url() opaque - its : ; and , are not punctuation here", () => {
    const uri = "url(data:image/svg+xml;charset=utf8,<svg/>)";
    expect(minifyCss(".a { background: " + uri + "; }")).toContain(uri);
  });

  it("does NOT tighten a : at depth 0, where it is a pseudo-class", () => {
    // `a :hover` (descendant) and `a:hover` (same element) are different selectors.
    expect(minifyCss("a :hover { color: red; }").trim()).toBe("a :hover{color:red}");
  });

  it("drops the last ; of a block", () => {
    expect(minifyCss(".a { color: red; margin: 0; }").trim()).toBe(".a{color:red;margin:0}");
  });

  it("keeps the spaces a combinator or calc() operator needs", () => {
    // A combinator space is NOT dropped, though ".a>.b" would be legal and shorter. At depth 0 the
    // same three characters are selector combinators and inside calc() they are operators, and
    // telling those apart needs a grammar this file deliberately does not have. The whole saving
    // forgone is 4 bytes on the shipped stylesheet.
    expect(minifyCss(".a > .b + .c ~ .d { width: calc(1px + 2px); }").trim())
      .toBe(".a > .b + .c ~ .d{width:calc(1px + 2px)}");
  });

  it("keeps !important", () => {
    expect(minifyCss(".a { color: red !important; }").trim()).toBe(".a{color:red !important}");
  });

  it("tightens inside :is() but not the colon that introduces it", () => {
    expect(minifyCss(":is( .a, .b ) .c { color: red; }").trim()).toBe(":is(.a,.b) .c{color:red}");
  });

  // ---- the custom-property carve-out. Chrome's CSSOM hands back a custom property's ORIGINAL
  // text, so a stylesheet whose values were collapsed renders the same and compares different.
  it("leaves a custom property's value verbatim, including an internal newline", () => {
    const src = ":root {" + LF + "  --font-sans: " + DQ + "A B" + DQ + "," + LF + "      ui-sans-serif, system-ui;" + LF + "}";
    const out = minifyCss(src);
    expect(out).toContain(DQ + "A B" + DQ + "," + LF + "      ui-sans-serif, system-ui");
  });

  it("still trims the whitespace AROUND a custom property's value - the CSSOM trims exactly that", () => {
    expect(minifyCss(":root { --x:   1px   ; }").trim()).toBe(":root{--x:1px}");
  });

  it("does not tighten a comma or paren inside a custom property's value", () => {
    expect(minifyCss(":root { --e: cubic-bezier(0.4, 0, 0.2, 1); }").trim())
      .toBe(":root{--e:cubic-bezier(0.4, 0, 0.2, 1)}");
  });

  it("tightens a NORMAL declaration's commas and parens", () => {
    expect(minifyCss(".a { transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); }").trim())
      .toBe(".a{transition-timing-function:cubic-bezier(0.4,0,0.2,1)}");
  });

  it("is idempotent", () => {
    const once = minifyCss(readFileSync(root("styles/twico-ui.css"), "utf8"));
    expect(minifyCss(once)).toBe(once);
  });

  it("is line-ending agnostic - a CRLF checkout and an LF one minify to the same bytes", () => {
    const lf = ":root {" + LF + "  --a: 1px;" + LF + "}" + LF + ".b { color: red; }" + LF;
    const crlf = lf.split(LF).join(CR + LF);
    expect(minifyCss(crlf)).toBe(minifyCss(lf));
  });

  it("refuses an input carrying the sentinel byte rather than corrupting it", () => {
    expect(() => minifyCss(".a { color: red" + NUL + "; }")).toThrow(/NUL/);
  });

  // ---- the real stylesheet. The authoritative check is the CSSOM comparison in
  // .work/css/cssom.mjs (a real browser, rule by rule); this is the part that can run in jsdom.
  describe("the shipped stylesheet", () => {
    const src = readFileSync(root("styles/twico-ui.css"), "utf8");
    const min = readFileSync(root("styles/twico-ui.min.css"), "utf8");

    it("styles/twico-ui.min.css is what the minifier produces from the authoring copy", () => {
      // This is the drift guard `npm run build:css -- --check` runs in CI, asserted here too so a
      // change to the minifier cannot land without the regenerated file. The min file keeps one
      // comment - its own header - and minifyCss() emits none, so compare past it.
      const body = min.slice(min.indexOf("*/") + 2).trim();
      expect(body).toBe(minifyCss(src).trim());
    });

    it("keeps the authoring copy's comments - it is the re-skinning surface", () => {
      expect(src).toContain("remap these to re-skin the whole library");
      expect((src.match(/\/\*/g) || []).length).toBeGreaterThan(100);
      expect(src).toMatch(/4\.5|:1/); // the contrast-ratio notes
    });

    it("balances braces and keeps every declaration", () => {
      const open = (s) => (s.match(/\{/g) || []).length;
      const close = (s) => (s.match(/\}/g) || []).length;
      expect(open(min)).toBe(close(min));
      expect(open(min)).toBe(open(src));
      // Every design token survives. Counted as `--name:`, which - unlike a bare `prop:` - no
      // comment in the authoring copy matches, so the two sides stay comparable despite one of
      // them carrying 153 comments.
      const tokens = (s) => (s.match(/--[A-Za-z0-9-]+\s*:/g) || []).length;
      expect(tokens(min)).toBe(tokens(src));
      expect(tokens(min)).toBeGreaterThan(300);
    });

    it("keeps all three @font-face blocks and their self-hosted url()s", () => {
      expect((min.match(/@font-face/g) || []).length).toBe(3);
      expect((min.match(/url\(/g) || []).length).toBe(3);
      expect(min).not.toContain("http");
    });

    it("is smaller than the authoring copy by more than half", () => {
      expect(min.length).toBeLessThan(src.length * 0.5);
    });
  });
});
