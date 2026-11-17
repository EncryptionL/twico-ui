import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { resolve, join } from "node:path";
import { stripCssComments, collapseCssWhitespace } from "../scripts/strip-css-comments.mjs";

const strip = (s) => collapseCssWhitespace(stripCssComments(s));
const BT = String.fromCharCode(96); // a backtick, never written literally in this file

describe("strip-css-comments (#534)", () => {
  it("removes a block comment from inside a template literal", () => {
    const src = "const C = " + BT + "\n/* a note */\n.x { color: red; }\n" + BT + ";";
    const out = strip(src);
    expect(out).not.toContain("a note");
    expect(out).toContain(".x { color: red; }");
  });

  it("leaves a block comment in real CODE alone - esbuild removes those itself", () => {
    const src = "/* kept, it is code */\nconst a = 1;";
    expect(strip(src)).toContain("kept, it is code");
  });

  it("does NOT treat // as a comment inside a literal: url(//host) is protocol-relative", () => {
    const src = "const C = " + BT + "@import url(//fonts/x.css);\n.y { color: blue; }" + BT + ";";
    const out = strip(src);
    expect(out).toContain("url(//fonts/x.css)");
    expect(out).toContain(".y { color: blue; }");
  });

  it('preserves a CSS string that merely CONTAINS the comment delimiter', () => {
    const q = String.fromCharCode(34);
    const src = "const C = " + BT + ".z::after { content: " + q + "/*" + q + "; }" + BT + ";";
    const out = strip(src);
    expect(out).toContain("content: " + q + "/*" + q);
  });

  it("preserves an escaped sequence inside a CSS string", () => {
    const q = String.fromCharCode(34);
    const bs = String.fromCharCode(92);
    const src = "const C = " + BT + ".a::after { content: " + q + bs + bs + "00a0" + q + "; }" + BT + ";";
    expect(strip(src)).toContain(bs + bs + "00a0");
  });

  it("keeps ${...} interpolations, and a comment inside one", () => {
    const src = "const C = " + BT + ".a { }\n${ROOTS}\n/* gone */\n.b { }" + BT + ";";
    const out = strip(src);
    expect(out).toContain("${ROOTS}");
    expect(out).not.toContain("gone");
  });

  it("handles a template literal NESTED inside an interpolation", () => {
    const src = "const C = " + BT + ".a { }${x(" + BT + "/* inner */.c { }" + BT + ")}/* outer */.b { }" + BT + ";";
    const out = strip(src);
    expect(out).not.toContain("inner");
    expect(out).not.toContain("outer");
    expect(out).toContain(".c { }");
    expect(out).toContain(".b { }");
  });

  it("strips indentation but keeps the declarations intact", () => {
    const src = "const C = " + BT + "\n    .a {\n      color: red;\n    }\n" + BT + ";";
    const out = strip(src);
    expect(out).toContain(".a {");
    expect(out).toContain("color: red;");
    expect(out).not.toMatch(/\n {4}\./);
  });

  it("is idempotent", () => {
    const src = "const C = " + BT + "/* x */\n  .a { color: red; }\n" + BT + ";";
    expect(strip(strip(src))).toBe(strip(src));
  });

  it("leaves a module with no template literal untouched", () => {
    const src = "export const a = 1;\n/* keep */\n";
    expect(strip(src)).toBe(src);
  });

  // ---- the real corpus: every shipped component must survive, and the CSS must stay balanced ----
  const walk = (dir) => readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : p.endsWith(".jsx") ? [p] : [];
  });
  const FILES = walk(resolve(process.cwd(), "components"));

  it("every component source stays brace- and quote-balanced after stripping", () => {
    expect(FILES.length).toBeGreaterThan(80);
    for (const f of FILES) {
      const raw = readFileSync(f, "utf8");
      const out = strip(raw);
      const count = (s, ch) => (s.split(ch).length - 1);
      // Every interpolation must survive. A ${...} inside a CSS comment is still a real
      // interpolation - the literal knows nothing about CSS comments - so a comment holding one is
      // kept whole rather than removed with the expression inside it.
      expect(count(out, "${"), `${f}: an interpolation was removed`).toBe(count(raw, "${"));
      // The CSS braces must stay balanced, which is what a mis-stripped comment would break.
      expect(count(out, "{") - count(out, "}"), `${f}: braces unbalanced`).toBe(count(raw, "{") - count(raw, "}"));
      // Backtick count is deliberately NOT asserted: a removed comment may legitimately contain an
      // escaped one (Button.jsx:41 explains a rule using \`color\`), and it goes with the comment.
    }
  });

  it("removes a meaningful number of bytes from the real corpus", () => {
    let before = 0, after = 0;
    for (const f of FILES) {
      const raw = readFileSync(f, "utf8");
      before += raw.length;
      after += strip(raw).length;
    }
    // measured: 7.9% of the component sources is CSS commentary and indentation that today ships
    expect(after).toBeLessThan(before * 0.95);
  });
});

describe("strip-css-comments: interpolation boundaries (#534)", () => {
  const strip = (s) => collapseCssWhitespace(stripCssComments(s));
  const BT2 = String.fromCharCode(96);

  it("keeps the space BETWEEN two interpolations - squeezing it splices the values", () => {
    const src = "const C = " + BT2 + ".a { margin: ${top} ${left}; }" + BT2 + ";";
    const out = strip(src);
    expect(out, "10px10px would be a broken declaration").toContain("${top} ${left}");
  });

  it("keeps the newline between two interpolations", () => {
    const src = "const C = " + BT2 + "${COLS}\n${CELL}" + BT2 + ";";
    expect(strip(src)).toContain("${COLS}\n${CELL}");
  });

  it("keeps one space where a run is nothing but whitespace", () => {
    const src = "const C = " + BT2 + "${A} ${B}" + BT2 + ";";
    expect(strip(src)).toContain("${A} ${B}");
  });

  it("still collapses indentation in the middle of a run", () => {
    const src = "const C = " + BT2 + "${A}\n    .x {\n      color: red;\n    }\n${B}" + BT2 + ";";
    const out = strip(src);
    expect(out).not.toMatch(/\n {4}\.x/);
    expect(out).toContain("color: red;");
    expect(out).toContain("${A}");
    expect(out).toContain("${B}");
  });
});

describe("strip-css-comments: line-ending determinism (#534)", () => {
  const strip = (x) => collapseCssWhitespace(stripCssComments(x));
  const BT3 = String.fromCharCode(96);
  const CR3 = String.fromCharCode(13);
  const NL3 = String.fromCharCode(10);

  // The bug CI caught and the local run could not. With core.autocrlf=true a token source line ends
  // in a carriage return, so once the comment is removed the line ends in a SPACE followed by that
  // CR - and a trailing-whitespace strip anchored at end-of-string cannot see the space, because the
  // CR is last. The generated artifact then differed between a CRLF working copy and the LF checkout
  // CI builds from, and build:css:check failed only on CI. Both strippers now drop CR first.
  it("produces identical output from CRLF and LF input", () => {
    const lf = "const C = " + BT3 + NL3 + "/* note */" + NL3 + "  .a { color: red; }" + NL3 + "  .b { color: blue; }" + NL3 + BT3 + ";";
    const crlf = lf.split(NL3).join(CR3 + NL3);
    expect(strip(crlf)).toBe(strip(lf));
  });

  it("leaves no carriage return behind", () => {
    const crlf = "const C = " + BT3 + CR3 + NL3 + "/* x */" + CR3 + NL3 + "  .a { color: red; }" + CR3 + NL3 + BT3 + ";";
    expect(strip(crlf)).not.toContain(CR3);
  });

  it("strips a trailing space that sat before a carriage return", () => {
    // the exact shape from tokens/colors.css that broke CI
    const crlf = "const C = " + BT3 + CR3 + NL3 + "  color-scheme: light; /* a note */" + CR3 + NL3 + BT3 + ";";
    const out = strip(crlf);
    expect(out).toContain("color-scheme: light;");
    expect(out, "a space before the CR survived an end-anchored strip").not.toContain("light; ");
  });

  it("the shipped stylesheet generator is line-ending agnostic too", () => {
    const src = readFileSync(resolve(process.cwd(), "scripts/build-css.mjs"), "utf8");
    expect(src, "build-css must drop CR before splitting lines").toContain("input.split(CR).join(");
  });
});
