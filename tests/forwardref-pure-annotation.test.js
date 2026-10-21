import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";

// #489 — every module-scope `React.forwardRef(...)` must carry /*#__PURE__*/.
//
// `export function Foo(...)` is a function DECLARATION, which bundlers drop unconditionally when
// unused. `export const Foo = React.forwardRef(...)` is a module-scope CALL EXPRESSION, which no
// bundler may assume is side-effect-free — so an unannotated one is pinned into every tree-shaken
// consumer bundle, both of its CSS template strings included. Annotating all 15 that were missing it
// took Button-only from 11.01 to 9.55 kB and Card-only from 9.42 to 7.98 kB brotli.
//
// This needs a source-level guard rather than leaving it to size-limit, because size-limit does not
// fail on the commit that causes it: #488 converted Input to forwardRef, cost 1.16 kB, and stayed
// green at 12.17 against a 13 kB budget. The next unrelated feature would have taken the blame.

const ROOT = process.cwd();
const files = [];
(function walk(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith(".jsx")) files.push(p);
  }
})(join(ROOT, "components"));

const rel = (p) => relative(ROOT, p).replace(/\\/g, "/");

describe("forwardRef components stay tree-shakeable (#489)", () => {
  it("finds the component sources at all", () => {
    expect(files.length, "the walk found no .jsx — the layout changed").toBeGreaterThan(50);
  });

  it("every module-scope forwardRef call is /*#__PURE__*/ annotated", () => {
    const bare = [];
    for (const f of files) {
      const src = readFileSync(f, "utf8");
      for (const m of src.matchAll(/^export const (\w+)\s*=\s*([\s\S]{0,24}?)React\.forwardRef\(/gm)) {
        if (!m[2].includes("__PURE__")) bare.push(`${rel(f)} -> ${m[1]}`);
      }
    }
    expect(
      bare,
      "these forwardRef calls are not annotated, so each is pinned into every tree-shaken consumer bundle"
    ).toEqual([]);
  });

  it("the annotation survives into both built bundles", () => {
    // esbuild rewrites it to /* @__PURE__ */; if a build setting ever strips it the source guard
    // above would still pass while consumers paid the cost anyway.
    for (const dist of ["dist/index.mjs", "dist/index.cjs"]) {
      let built;
      try {
        built = readFileSync(join(ROOT, dist), "utf8");
      } catch {
        continue; // dist is not committed; skip when the tree has not been built
      }
      const bare = [...built.matchAll(/^var (\w+) = (.{0,20}?)React\d*__default\.forwardRef\(/gm)]
        .filter((m) => !m[2].includes("__PURE__"))
        .map((m) => `${dist} -> ${m[1]}`);
      expect(bare, "the PURE annotation was lost in the build").toEqual([]);
    }
  });

  it("no component assigns displayName at module scope", () => {
    // The sibling hazard, from the same #414 regression and called out in the NOTE at
    // ImageViewer.jsx:215: a top-level property assignment is itself a side effect and pins the
    // component just as effectively. The named inner render function already gives DevTools a name.
    const offenders = [];
    for (const f of files) {
      const src = readFileSync(f, "utf8");
      for (const m of src.matchAll(/^(\w+)\.displayName\s*=/gm)) offenders.push(`${rel(f)} -> ${m[1]}`);
    }
    expect(offenders, "a module-scope displayName assignment defeats tree-shaking (#414)").toEqual([]);
  });
});
