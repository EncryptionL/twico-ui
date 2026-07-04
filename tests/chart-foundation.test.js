import { describe, it, expect } from "vitest";
import {
  paletteAt, CHART_PALETTE, niceCeil, niceScale, shortNum, fmtNumber,
  polarDeg, arcPath, linePath, areaPath, polygonPath, sum, r,
} from "../components/data-display/_chart.js";

describe("_chart number helpers", () => {
  it("niceScale returns rounded bounds + tick values", () => {
    const s = niceScale(0, 95, 4);
    expect(s.min).toBe(0);
    expect(s.max).toBeGreaterThanOrEqual(95);
    expect(s.ticks[0]).toBe(0);
    expect(s.ticks[s.ticks.length - 1]).toBe(s.max);
    // ticks are evenly spaced by step
    for (let i = 1; i < s.ticks.length; i++) expect(r(s.ticks[i] - s.ticks[i - 1])).toBe(r(s.step));
  });
  it("niceScale handles a flat series without dividing by zero", () => {
    const s = niceScale(5, 5, 4);
    expect(isFinite(s.max)).toBe(true);
    expect(s.max).toBeGreaterThan(s.min);
  });
  it("niceCeil rounds up to 1/2/5 x 10^n", () => {
    expect(niceCeil(95)).toBe(100);
    expect(niceCeil(1)).toBe(1);
    expect(niceCeil(0)).toBe(1);
  });
  it("shortNum abbreviates thousands/millions/billions", () => {
    expect(shortNum(1500)).toBe("1.5k");
    expect(shortNum(2_000_000)).toBe("2M");
    expect(shortNum(3_000_000_000)).toBe("3B");
    expect(shortNum(-1200)).toBe("-1.2k");
  });
  it("sum + fmtNumber", () => {
    expect(sum([1, 2, 3])).toBe(6);
    expect(fmtNumber(1234)).toBe((1234).toLocaleString());
  });
});

describe("_chart geometry", () => {
  it("polarDeg: 0deg is top, 90 right, 180 bottom, 270 left", () => {
    const near = (a, b) => expect(Math.abs(a - b)).toBeLessThan(0.001);
    let p = polarDeg(50, 50, 50, 0); near(p[0], 50); near(p[1], 0);
    p = polarDeg(50, 50, 50, 90); near(p[0], 100); near(p[1], 50);
    p = polarDeg(50, 50, 50, 180); near(p[0], 50); near(p[1], 100);
    p = polarDeg(50, 50, 50, 270); near(p[0], 0); near(p[1], 50);
  });
  it("arcPath produces a pie wedge (M..A..Z) and a donut ring (two arcs)", () => {
    const wedge = arcPath(50, 50, 40, 0, 0, 90);
    expect(wedge).toMatch(/^M/);
    expect(wedge).toContain("A");
    expect(wedge.trim().endsWith("Z")).toBe(true);
    const ring = arcPath(50, 50, 40, 20, 0, 120);
    expect((ring.match(/A/g) || []).length).toBe(2);
  });
  it("arcPath clamps a full circle so a single arc still renders", () => {
    const full = arcPath(50, 50, 40, 0, 0, 360);
    expect(full).toContain("A");
  });
  it("linePath: straight uses L, smooth uses C, stepped stays orthogonal", () => {
    const pts = [[0, 0], [10, 5], [20, 2], [30, 8]];
    expect(linePath(pts)).toContain("L");
    expect(linePath(pts, { smooth: true })).toContain("C");
    expect(linePath(pts, { step: "after" })).toContain("L");
  });
  it("areaPath + polygonPath close the shape", () => {
    const pts = [[0, 10], [10, 5], [20, 8]];
    expect(areaPath(pts, 20).trim().endsWith("Z")).toBe(true);
    expect(polygonPath(pts).trim().endsWith("Z")).toBe(true);
  });
  it("paletteAt cycles and falls back to CHART_PALETTE", () => {
    expect(paletteAt(null, 0)).toBe(CHART_PALETTE[0]);
    expect(paletteAt(null, CHART_PALETTE.length)).toBe(CHART_PALETTE[0]);
    expect(paletteAt(["#111", "#222"], 3)).toBe("#222");
  });
});
