import React from "react";
import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { Button, IconButton } from "../src/index.ts";

// #504 — Button/IconButton `tone` was ActionTone ("primary" | "danger"), so a standalone affirmative
// action could not be green. A row-level confirm sitting beside a danger sibling reads as "yes / no",
// and with ActionTone the yes came out the same blue as every neutral action on the page — exactly
// the distinction the colour was carrying. Widened to the full Tone scale; ActionTone stays exported
// as a convenience alias for the two intents most actions want.

const TONES = ["primary", "success", "warning", "danger", "info", "neutral"];

afterEach(cleanup);

const btnCss = readFileSync(resolve(process.cwd(), "components/buttons/Button.jsx"), "utf8");
const ibCss = readFileSync(resolve(process.cwd(), "components/buttons/IconButton.jsx"), "utf8");
const tokens = readFileSync(resolve(process.cwd(), "tokens/colors.css"), "utf8");

describe("Button accepts the full Tone scale (#504)", () => {
  for (const tone of TONES) {
    it(`renders tone="${tone}" as data-tone`, () => {
      const { container } = render(<Button tone={tone}>Go</Button>);
      expect(container.querySelector(".twc-btn").getAttribute("data-tone")).toBe(tone);
    });
  }

  it("IconButton takes the same scale", () => {
    for (const tone of TONES) {
      const { container } = render(<IconButton tone={tone} aria-label="x">i</IconButton>);
      expect(container.querySelector(".twc-iconbtn").getAttribute("data-tone")).toBe(tone);
      cleanup();
    }
  });

  it("still defaults to primary, so nothing changes for existing callers", () => {
    const { container } = render(<Button>Go</Button>);
    expect(container.querySelector(".twc-btn").getAttribute("data-tone")).toBe("primary");
  });
});

describe("every tone has a complete accent block", () => {
  // The whole mechanism is --_accent: a tone that sets only some of the six properties inherits the
  // rest from the primary default, which looks almost right and is the hardest kind of bug to see.
  const ACCENT = ["--_accent:", "--_accent-hover:", "--_accent-fg:", "--_accent-subtle:", "--_accent-subtle-fg:"];

  for (const tone of TONES.filter((t) => t !== "primary")) {
    it(`Button [data-tone="${tone}"] sets every accent property`, () => {
      const i = btnCss.indexOf(`.twc-btn[data-tone="${tone}"]`);
      expect(i, `no accent block for ${tone}`).toBeGreaterThan(-1);
      const block = btnCss.slice(i, btnCss.indexOf("}", i));
      for (const prop of [...ACCENT, "--_accent-active:"]) {
        expect(block, `${tone} is missing ${prop}`).toContain(prop);
      }
    });

    it(`IconButton [data-tone="${tone}"] sets every accent property`, () => {
      const i = ibCss.indexOf(`.twc-iconbtn[data-tone="${tone}"]`);
      expect(i, `no accent block for ${tone}`).toBeGreaterThan(-1);
      const block = ibCss.slice(i, ibCss.indexOf("}", i));
      for (const prop of ACCENT) expect(block, `${tone} is missing ${prop}`).toContain(prop);
    });
  }
});

describe("the tokens the new tones depend on", () => {
  // success/warning/info had no -hover/-active before #504, and danger had no -active. A missing
  // token makes var() fall back to nothing and the hover silently stops changing.
  for (const tone of ["success", "warning", "info", "danger"]) {
    it(`--color-${tone}-hover and -active exist in both themes`, () => {
      for (const step of ["hover", "active"]) {
        const hits = tokens.match(new RegExp(`--color-${tone}-${step}:`, "g")) || [];
        expect(hits.length, `--color-${tone}-${step} should be defined in :root AND .dark`).toBe(2);
      }
    });
  }

  it("each tone's hover/active step moves AWAY from its own ink, not in a fixed direction", () => {
    // The rule is NOT "light darker, dark lighter" - that is what primary and danger happen to do
    // because they carry white ink. warning and info carry DARK ink (amber-950, sky-950), so for
    // them a darker background moves TOWARDS the ink. Getting this wrong put light info
    // solid:active at 2.34:1 while a step-direction assertion stayed green, so the direction is
    // derived from the ink here and the actual ratios are enforced in tone-accent-contrast.test.js.
    const darkAt = tokens.indexOf(".dark,");
    const prim = {};
    for (const m of tokens.matchAll(/--([a-z]+-\d+):\s*(#[0-9a-fA-F]{6})/g)) prim[m[1]] = m[2];
    const lightness = (hex) =>
      [0, 2, 4].map((i) => parseInt(hex.slice(1 + i, 3 + i), 16)).reduce((a, b) => a + b, 0) / 3;

    for (const theme of ["light", "dark"]) {
      const block = theme === "light" ? tokens.slice(0, darkAt) : tokens.slice(darkAt);
      for (const tone of ["success", "warning", "info", "danger"]) {
        const stepOf = (suffix) => {
          const m = block.match(new RegExp(`--color-${tone}${suffix}:\\s*var\\(--([a-z]+-\\d+)\\)`));
          return m ? prim[m[1]] : null;
        };
        const base = stepOf("");
        const hover = stepOf("-hover");
        const inkRaw = block.match(new RegExp(`--color-${tone}-fg:\\s*([^;]+);`))[1].trim();
        const ink = inkRaw.startsWith("#") ? inkRaw : prim[(inkRaw.match(/--([a-z]+-\d+)/) || [])[1]];
        expect(base, `${theme} ${tone} base`).toBeTruthy();
        expect(hover, `${theme} ${tone} hover`).toBeTruthy();
        expect(ink, `${theme} ${tone} ink`).toBeTruthy();

        const inkIsDark = lightness(ink) < 128;
        if (inkIsDark) {
          expect(lightness(hover), `${theme} ${tone}: dark ink, so hover must get LIGHTER`)
            .toBeGreaterThan(lightness(base));
        } else {
          expect(lightness(hover), `${theme} ${tone}: light ink, so hover must get DARKER`)
            .toBeLessThan(lightness(base));
        }
      }
    }
  });

  it("neutral uses Badge's mapping rather than an accent ramp that does not exist", () => {
    // There is no --color-neutral anywhere; inventing one would have been a design decision the
    // issue did not need. Badge already answers "what does a neutral fill look like".
    expect(tokens).not.toMatch(/--color-neutral:/);
    const i = btnCss.indexOf('.twc-btn[data-tone="neutral"]');
    const block = btnCss.slice(i, btnCss.indexOf("}", i));
    expect(block).toContain("var(--color-text)");
    expect(block).toContain("var(--color-surface)");
    expect(block).toContain("var(--color-surface-sunken)");
  });
});

describe("the type no longer caps actions at primary|danger", () => {
  it("Button.d.ts and IconButton.d.ts declare tone as Tone", () => {
    for (const f of ["components/buttons/Button.d.ts", "components/buttons/IconButton.d.ts"]) {
      const src = readFileSync(resolve(process.cwd(), f), "utf8");
      expect(src, `${f} still caps tone`).not.toMatch(/^\s*tone\?: ActionTone;/m);
      expect(src).toMatch(/^\s*tone\?: Tone;/m);
      // and the now-dead import is gone — an unused type import is what CodeQL flags
      expect(src, `${f} keeps an unused ActionTone import`).not.toContain("import type { ActionTone");
    }
  });

  it("ActionTone is still exported for consumers who want the narrow pair", () => {
    const barrel = readFileSync(resolve(process.cwd(), "src/index.ts"), "utf8");
    expect(barrel).toContain("ActionTone");
    const types = readFileSync(resolve(process.cwd(), "components/_types.d.ts"), "utf8");
    expect(types).toContain('export type ActionTone = "primary" | "danger";');
  });
});
