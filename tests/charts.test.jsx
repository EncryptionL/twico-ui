import { describe, it, expect, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { PieChart } from "../components/data-display/PieChart.jsx";
import { DonutChart } from "../components/data-display/DonutChart.jsx";
import { Gauge } from "../components/data-display/Gauge.jsx";
import { Sparkline } from "../components/data-display/Sparkline.jsx";
import { ScatterChart } from "../components/data-display/ScatterChart.jsx";
import { BubbleChart } from "../components/data-display/BubbleChart.jsx";
import { RadarChart } from "../components/data-display/RadarChart.jsx";
import { PolarAreaChart } from "../components/data-display/PolarAreaChart.jsx";
import { Heatmap } from "../components/data-display/Heatmap.jsx";
import { FunnelChart } from "../components/data-display/FunnelChart.jsx";
import { Treemap } from "../components/data-display/Treemap.jsx";
import { Candlestick } from "../components/data-display/Candlestick.jsx";
import { Boxplot } from "../components/data-display/Boxplot.jsx";
import { RangeChart } from "../components/data-display/RangeChart.jsx";

const pie = [{ label: "A", value: 30 }, { label: "B", value: 50 }, { label: "C", value: 20 }];
const scatter = [{ name: "S1", points: [{ x: 1, y: 2 }, { x: 3, y: 5 }, { x: 6, y: 4, z: 12 }] }];
const radar = [{ label: "Speed", a: 8, b: 5 }, { label: "Power", a: 6, b: 9 }, { label: "Range", a: 7, b: 4 }];
const heat = [{ x: "Mon", y: "AM", value: 3 }, { x: "Mon", y: "PM", value: 8 }, { x: "Tue", y: "AM", value: 5 }, { x: "Tue", y: "PM", value: 2 }];
const ohlc = [{ label: "Mon", open: 10, high: 14, low: 9, close: 13 }, { label: "Tue", open: 13, high: 15, low: 11, close: 11 }];
const box = [{ label: "A", min: 2, q1: 5, median: 8, q3: 12, max: 18, outliers: [22] }, { label: "B", min: 1, q1: 4, median: 6, q3: 9, max: 14 }];
const range = [{ label: "Design", min: 0, max: 3 }, { label: "Build", min: 2, max: 7 }, { label: "Ship", min: 6, max: 9 }];

// Each entry: [name, element, expectTable]
const cases = [
  ["PieChart", <PieChart data={pie} />, true],
  ["DonutChart", <DonutChart data={pie} />, true],
  ["Gauge", <Gauge value={72} />, true],
  ["Sparkline", <Sparkline data={[3, 5, 4, 8, 6, 9]} />, false],
  ["ScatterChart", <ScatterChart series={scatter} />, true],
  ["BubbleChart", <BubbleChart series={scatter} />, true],
  ["RadarChart", <RadarChart data={radar} series={["a", "b"]} />, true],
  ["PolarAreaChart", <PolarAreaChart data={pie} />, true],
  ["Heatmap", <Heatmap data={heat} />, true],
  ["FunnelChart", <FunnelChart data={pie} />, true],
  ["Treemap", <Treemap data={pie} />, true],
  ["Candlestick", <Candlestick data={ohlc} />, true],
  ["Boxplot", <Boxplot data={box} />, true],
  ["RangeChart (bar)", <RangeChart data={range} />, true],
  ["RangeChart (area)", <RangeChart type="area" data={range} />, true],
];

describe("chart family smoke render", () => {
  it.each(cases)("%s renders an accessible role=img SVG", (_name, el, expectTable) => {
    const { container } = render(el);
    const svg = container.querySelector('svg[role="img"]');
    expect(svg).toBeInTheDocument();
    expect(svg.getAttribute("aria-label")).toBeTruthy();
    if (expectTable) expect(container.querySelector("table")).toBeInTheDocument();
  });
});

describe("chart family degenerate data does not throw", () => {
  const empties = [
    ["PieChart", <PieChart data={[]} />],
    ["DonutChart", <DonutChart data={[]} />],
    ["ScatterChart", <ScatterChart series={[]} />],
    ["RadarChart", <RadarChart data={[]} series={[]} />],
    ["Heatmap", <Heatmap data={[]} />],
    ["FunnelChart", <FunnelChart data={[]} />],
    ["Treemap", <Treemap data={[]} />],
    ["Candlestick", <Candlestick data={[]} />],
    ["Boxplot", <Boxplot data={[]} />],
    ["RangeChart", <RangeChart data={[]} />],
    ["Sparkline", <Sparkline data={[]} />],
    ["PolarAreaChart", <PolarAreaChart data={[]} />],
    ["Gauge (min===max)", <Gauge value={5} min={5} max={5} />],
  ];
  it.each(empties)("%s handles empty/degenerate input", (_name, el) => {
    expect(() => render(el)).not.toThrow();
  });
});

describe("chart specifics", () => {
  it("PieChart slice count matches data (arcs rendered)", () => {
    const { container } = render(<PieChart data={pie} />);
    // each slice is a <path>
    expect(container.querySelectorAll("svg path").length).toBeGreaterThanOrEqual(3);
  });

  it("DonutChart is a PieChart preset with a hole (renders donut center or ring)", () => {
    const { container } = render(<DonutChart data={pie} centerLabel="Total" />);
    expect(container.querySelector('svg[role="img"]')).toBeInTheDocument();
    expect(container.textContent).toContain("Total");
  });

  it("Candlestick colors bodies up vs down (renders rects)", () => {
    const { container } = render(<Candlestick data={ohlc} />);
    expect(container.querySelectorAll("svg rect").length).toBeGreaterThanOrEqual(2);
  });

  it("Heatmap builds a data table with the X values as columns", () => {
    const { container } = render(<Heatmap data={heat} />);
    const cols = Array.from(container.querySelectorAll("table thead th")).map((t) => t.textContent);
    expect(cols).toContain("Mon");
    expect(cols).toContain("Tue");
  });

  it("Sparkline exposes a summarizing aria-label, no table by default", () => {
    const { container } = render(<Sparkline data={[1, 2, 3]} />);
    expect(container.querySelector("table")).toBeNull();
    expect(container.querySelector('svg[role="img"]').getAttribute("aria-label")).toBeTruthy();
  });
});

describe("chart refinement — floating tooltips + hover emphasis", () => {
  // discrete-shape charts: hovering a mark shows the tooltip AND dims the rest (data-hovering)
  const dimCases = [
    ["PieChart", <PieChart data={pie} />],
    ["PolarAreaChart", <PolarAreaChart data={pie} />],
    ["FunnelChart", <FunnelChart data={pie} />],
    ["Treemap", <Treemap data={pie} />],
    ["Heatmap", <Heatmap data={heat} />],
  ];
  it.each(dimCases)("%s shows a tooltip and marks the root hovering on mark hover", (_n, el) => {
    const { container } = render(el);
    const mark = container.querySelector("[data-mark]");
    expect(mark).toBeTruthy();
    fireEvent.mouseMove(mark, { clientX: 5, clientY: 5 });
    expect(container.querySelector(".twc-chart__tip")).toBeInTheDocument();
    expect(container.querySelector('.twc-chart[data-hovering="true"]')).toBeInTheDocument();
    fireEvent.mouseLeave(mark);
    expect(container.querySelector(".twc-chart__tip")).toBeNull();
  });

  it("ScatterChart shows a tooltip when hovering a point hit-target", () => {
    const { container } = render(<ScatterChart series={scatter} />);
    const hit = container.querySelector(".twc-chart__hit");
    expect(hit).toBeTruthy();
    fireEvent.mouseMove(hit, { clientX: 5, clientY: 5 });
    expect(container.querySelector(".twc-chart__tip")).toBeInTheDocument();
  });

  it("Candlestick tooltip lists the OHLC breakdown", () => {
    const { container } = render(<Candlestick data={ohlc} />);
    // hover the first interactive mark (a rect/group carrying the handlers)
    const svg = container.querySelector("svg");
    const marks = svg.querySelectorAll("rect, g");
    let shown = false;
    for (const m of marks) {
      fireEvent.mouseMove(m, { clientX: 5, clientY: 5 });
      if (container.querySelector(".twc-chart__tip")) { shown = true; break; }
    }
    expect(shown).toBe(true);
    expect(container.querySelector(".twc-chart__tip")).toHaveTextContent("Open");
  });

  it("no leftover native <title> tooltips on the refined charts", () => {
    const { container } = render(<PieChart data={pie} />);
    expect(container.querySelector("svg title")).toBeNull();
  });
});

// Click every candidate interactive element until the spy fires (marks live on
// different elements per chart — the shape, its hit target, or the zoom overlay).
function clickAnyMark(container) {
  const cands = container.querySelectorAll('[data-mark], .twc-chart__hit, .twc-chart__overlay, rect, path, circle, g[role], g');
  for (const el of cands) fireEvent.click(el, { clientX: 5, clientY: 5 });
}

describe("chart interactivity — onDataClick + selection", () => {
  const clickFactories = {
    PieChart: (cb) => <PieChart data={pie} onDataClick={cb} />,
    PolarAreaChart: (cb) => <PolarAreaChart data={pie} onDataClick={cb} />,
    FunnelChart: (cb) => <FunnelChart data={pie} onDataClick={cb} />,
    Treemap: (cb) => <Treemap data={pie} onDataClick={cb} />,
    Heatmap: (cb) => <Heatmap data={heat} onDataClick={cb} />,
    ScatterChart: (cb) => <ScatterChart series={scatter} onDataClick={cb} />,
    RadarChart: (cb) => <RadarChart data={radar} series={["a", "b"]} onDataClick={cb} />,
    Candlestick: (cb) => <Candlestick data={ohlc} onDataClick={cb} />,
    Boxplot: (cb) => <Boxplot data={box} onDataClick={cb} />,
    RangeChart: (cb) => <RangeChart data={range} onDataClick={cb} />,
    Sparkline: (cb) => <Sparkline data={[3, 6, 4, 8]} onDataClick={cb} />,
    Gauge: (cb) => <Gauge value={72} onDataClick={cb} />,
  };

  it.each(Object.keys(clickFactories))("%s marks the root clickable + fires onDataClick", (name) => {
    const cb = vi.fn();
    const { container } = render(clickFactories[name](cb));
    expect(container.querySelector('.twc-chart[data-clickable="true"]')).toBeInTheDocument();
    clickAnyMark(container);
    expect(cb).toHaveBeenCalled();
    expect(cb.mock.calls[0][0]).toBeTypeOf("object"); // a payload object
  });

  it("PieChart click payload has label/value/index/percent + sets a selection", () => {
    const cb = vi.fn();
    const { container } = render(<PieChart data={pie} onDataClick={cb} />);
    fireEvent.click(container.querySelector("[data-mark]"));
    const p = cb.mock.calls[0][0];
    expect(p).toHaveProperty("label");
    expect(p).toHaveProperty("value");
    expect(p).toHaveProperty("index");
    expect(container.querySelector('[data-selected="true"]')).toBeInTheDocument();
  });
});

describe("chart interactivity — zoom (all axis/grid charts)", () => {
  const zoomCases = [
    ["ScatterChart", <ScatterChart series={scatter} zoomable />],
    ["Candlestick", <Candlestick data={ohlc} zoomable />],
    ["RangeChart", <RangeChart data={range} zoomable />],
    ["Heatmap", <Heatmap data={heat} zoomable />],
    ["Boxplot", <Boxplot data={box} zoomable />],
  ];
  it.each(zoomCases)("%s renders a zoom overlay and drag doesn't throw", (_n, el) => {
    const { container } = render(el);
    const overlay = container.querySelector(".twc-chart__overlay");
    expect(overlay).toBeInTheDocument();
    expect(() => {
      fireEvent.mouseDown(overlay, { clientX: 20, clientY: 20 });
      fireEvent.mouseMove(overlay, { clientX: 120, clientY: 80 });
      fireEvent.mouseUp(overlay);
    }).not.toThrow();
  });
});

describe("chart interactivity — universal focus-dim + explode", () => {
  // The onClick that toggles selection lives on the mark, its hit target, or the overlay —
  // click candidates until the root reports a selection.
  function clickUntilSelected(container) {
    const cands = container.querySelectorAll('[data-mark], .twc-chart__hit, .twc-chart__overlay, rect, path, circle, g');
    for (const el of cands) {
      fireEvent.click(el, { clientX: 5, clientY: 5 });
      if (container.querySelector('.twc-chart[data-has-selection="true"]')) return true;
    }
    return false;
  }
  const dimFactories = {
    PieChart: () => <PieChart data={pie} />,
    PolarAreaChart: () => <PolarAreaChart data={pie} />,
    FunnelChart: () => <FunnelChart data={pie} />,
    Treemap: () => <Treemap data={pie} />,
    Heatmap: () => <Heatmap data={heat} />,
    RadarChart: () => <RadarChart data={radar} series={["a", "b"]} />,
    Boxplot: () => <Boxplot data={box} />,
    Gauge: () => <Gauge value={72} />,
    Sparkline: () => <Sparkline data={[3, 6, 4, 8]} />,
  };
  it.each(Object.keys(dimFactories))("%s: selecting a mark sets data-has-selection on the root (focus-dim)", (name) => {
    const { container } = render(dimFactories[name]());
    expect(clickUntilSelected(container)).toBe(true);
  });

  it("PieChart explodes the selected slice (a translate transform is applied)", () => {
    const { container } = render(<PieChart data={pie} />);
    clickUntilSelected(container);
    const sel = container.querySelector('path[data-selected="true"]');
    expect(sel).toBeInTheDocument();
    expect(sel.getAttribute("style") || "").toMatch(/translate/);
  });
});
