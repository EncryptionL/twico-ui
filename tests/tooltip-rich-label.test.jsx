import React from "react";
import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { Tooltip } from "../components/overlay/Tooltip.jsx";
import { Text } from "../components/typography/Text.jsx";

const TIP_SRC = join(dirname(fileURLToPath(import.meta.url)), "..", "components", "overlay", "Tooltip.jsx");

// #385: a Text inside a rich Tooltip label rendered invisible — Text sets `color: var(--color-text)` inline,
// which is exactly the bubble's background. Tooltip now wraps the label in a content element that re-scopes
// --color-text (and muted/subtle) to the bubble's fg, so token-driven children read correctly.

afterEach(() => cleanup());

describe("Tooltip rich label ink (#385)", () => {
  it("wraps the label in a .twc-tooltip__content element (the ink re-scope host)", () => {
    render(<Tooltip label={<Text data-testid="rich">Delete records</Text>}><button>trigger</button></Tooltip>);
    const content = document.querySelector(".twc-tooltip__content"); // bubble is portaled to <body>
    expect(content).toBeTruthy();
    expect(content.querySelector('[data-testid="rich"]')).toBeTruthy(); // the label lives inside it
  });

  it("captures the bubble bg in a private var BEFORE re-scoping --color-text (no feedback into the bg)", () => {
    const css = readFileSync(TIP_SRC, "utf8");
    expect(css).toMatch(/--_tt-bg:\s*var\(--color-text\)/); // ink captured as the bubble bg
    expect(css).toMatch(/background:\s*var\(--_tt-bg\)/); // bubble paints from the private var, not --color-text
    expect(css).toMatch(/\.twc-tooltip__arrow\s*\{[^}]*background:\s*var\(--_tt-bg\)/); // arrow too
    // the content wrapper re-scopes the ink to the bubble fg so a token-driven child is visible
    expect(css).toMatch(/\.twc-tooltip__content\s*\{[^}]*--color-text:\s*var\(--_tt-fg\)/);
    expect(css).toMatch(/\.twc-tooltip__content\s*\{[^}]*--color-text-muted:/);
  });
});
