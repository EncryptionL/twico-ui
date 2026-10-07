import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

// _ds_manifest.json is generated OUT OF BAND by the twico-ui-design skill and committed, and its
// `tokens` array is what design tooling reads to learn the design system's values. Nothing guarded
// it, so it rotted silently: by the time this test was written it was 15 values behind, including
//
//   --color-text-subtle   light slate-400 / dark slate-500   (the INVERSION #449 fixed - the manifest
//                                                             still carried the failing pair)
//   --color-ring          a translucent indigo alpha          (the ~1.8:1 value #178 replaced)
//   four *-subtle-fg      the -600 steps                      (#449 moved them to -700)
//   --color-warning-fg    #ffffff                             (#176 moved it to dark ink; white was 2.15:1)
//   --z-toast/--z-tooltip swapped
//
// plus two tokens it never listed at all (--duration-exit, --z-floating). i.e. every a11y token fix of
// the last several releases was invisible to the tooling that consumes this file. `check:ds-bundle`
// only checks the BUNDLE's freshness against git history; it says nothing about these values. This
// test closes that gap, and runs in `npm test`, so it is CI-blocking with no extra workflow wiring.

const ROOT = process.cwd();
const manifest = JSON.parse(readFileSync(resolve(ROOT, "_ds_manifest.json"), "utf8"));

const LINE_ENDINGS = /\r\n/g;

/** Raw declarations of a token file, keyed by `name|scope` (scope empty for :root). */
function parseTokenFile(relPath) {
  // Line endings are normalised before comparing: this repo has mixed CRLF/LF working-tree files, and
  // the one multi-line token value (the font stacks) would otherwise differ from the manifest by a
  // lone carriage return - drift that is not drift. Everything else is compared strictly.
  const css = readFileSync(resolve(ROOT, relPath), "utf8")
    .replace(LINE_ENDINGS, "\n")
    .replace(/\/\*[\s\S]*?\*\//g, "");
  const out = new Map();
  const grab = (block, scope) => {
    if (!block) return;
    const re = /(--[\w-]+)\s*:\s*([^;]+);/g;
    let m;
    while ((m = re.exec(block))) out.set(`${m[1]}|${scope ?? ""}`, m[2].trim());
  };
  grab(css.match(/:root\s*\{([\s\S]*?)\n\}/)?.[1], null);
  grab(css.match(/\.dark\s*,\s*\[data-theme="dark"\]\s*\{([\s\S]*?)\n\}/)?.[1], ".dark");
  return out;
}

const SOURCES = [...new Set(manifest.tokens.map((t) => t.definedIn).filter(Boolean))];
const parsed = new Map(SOURCES.map((f) => [f, parseTokenFile(f)]));
const key = (t) => `${t.name}|${t.scope ?? ""}`;
const norm = (v) => String(v).replace(LINE_ENDINGS, "\n");

describe("_ds_manifest.json token values match the token CSS", () => {
  it("covers every token file the manifest claims to read from", () => {
    expect(SOURCES.length).toBeGreaterThan(0);
    for (const f of SOURCES) expect(parsed.get(f).size, `${f} parsed no declarations`).toBeGreaterThan(0);
  });

  it("every manifest token still exists in its source file", () => {
    const gone = manifest.tokens
      .filter((t) => parsed.has(t.definedIn))
      .filter((t) => !parsed.get(t.definedIn).has(key(t)))
      .map((t) => `${t.name} (${t.scope ?? "light"}) in ${t.definedIn}`);
    expect(gone, "manifest lists tokens that no longer exist - regenerate it").toEqual([]);
  });

  it("every manifest token carries its CURRENT value", () => {
    const stale = manifest.tokens
      .filter((t) => parsed.has(t.definedIn))
      .map((t) => {
        const want = parsed.get(t.definedIn).get(key(t));
        return want !== undefined && norm(want) !== norm(t.value)
          ? `${t.name} (${t.scope ?? "light"}): manifest "${t.value}" vs source "${want}"`
          : null;
      })
      .filter(Boolean);
    expect(stale, "_ds_manifest.json is stale - refresh these values from the token CSS").toEqual([]);
  });

  it("declares every token the token CSS does, so a NEW token cannot stay invisible", () => {
    const have = new Set(manifest.tokens.map((t) => `${t.definedIn}|${key(t)}`));
    const absent = [];
    for (const [file, decls] of parsed) {
      for (const k of decls.keys()) {
        const [name, scope] = k.split("|");
        if (!have.has(`${file}|${name}|${scope}`)) absent.push(`${name} (${scope || "light"}) from ${file}`);
      }
    }
    expect(absent, "token CSS declares tokens the manifest never lists - add them").toEqual([]);
  });
});
