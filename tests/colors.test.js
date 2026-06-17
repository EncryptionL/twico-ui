import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { indigo, slate, emerald, amber, rose, sky, brand, colors } from "../src/colors.ts";

// Guards against drift between the JS palette (src/colors.ts, shipped as twico-ui/colors)
// and the CSS primitives (tokens/colors.css). They MUST stay identical — same role as
// build:css:check guards the concatenated stylesheet.

const css = readFileSync(resolve(process.cwd(), "tokens/colors.css"), "utf8");

// Pull every `--<hue>-<shade>: #hex;` primitive declaration into a flat map.
function cssPrimitives() {
  const map = {};
  const re = /--(indigo|slate|emerald|amber|rose|sky)-(\d+):\s*(#[0-9a-fA-F]{3,8})\s*;/g;
  let m;
  while ((m = re.exec(css))) map[`${m[1]}-${m[2]}`] = m[3].toLowerCase();
  return map;
}

const SCALES = { indigo, slate, emerald, amber, rose, sky };

describe("twico-ui/colors ↔ tokens/colors.css", () => {
  const prims = cssPrimitives();

  it("CSS declares the primitives the test expects to find", () => {
    // Sanity: indigo/slate are full 11-step scales; the four semantic hues are 4-step.
    expect(Object.keys(prims).length).toBe(11 + 11 + 4 + 4 + 4 + 4);
  });

  for (const [hue, scale] of Object.entries(SCALES)) {
    describe(hue, () => {
      for (const [shade, hex] of Object.entries(scale)) {
        it(`${hue}[${shade}] = ${hex} matches --${hue}-${shade}`, () => {
          expect(hex.toLowerCase()).toBe(prims[`${hue}-${shade}`]);
        });
      }

      it("has no shade the CSS lacks, and lacks no shade the CSS has", () => {
        const jsShades = Object.keys(scale).sort();
        const cssShades = Object.keys(prims)
          .filter((k) => k.startsWith(`${hue}-`))
          .map((k) => k.slice(hue.length + 1))
          .sort();
        expect(jsShades).toEqual(cssShades);
      });
    });
  }

  it("brand is an alias of indigo, and `colors` aggregates every scale", () => {
    expect(brand).toBe(indigo);
    expect(colors).toEqual({ indigo, slate, emerald, amber, rose, sky });
  });
});
