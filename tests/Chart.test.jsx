import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Chart } from "../components/data-display/Chart.jsx";

describe("Chart hidden data table (#160)", () => {
  it("renders a data table with valueFormat-formatted cells", () => {
    render(<Chart data={[{ label: "Mon", value: 240 }, { label: "Tue", value: 310 }]} valueFormat={(v) => `$${v}`} />);
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getByRole("rowheader", { name: "Mon" })).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "$240" })).toBeInTheDocument();
  });

  it("multi-series produces per-series column headers", () => {
    render(<Chart series={["signups", "active"]} data={[{ label: "Jan", signups: 10, active: 4 }]} />);
    expect(screen.getByRole("columnheader", { name: "signups" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "active" })).toBeInTheDocument();
  });

  it("tableFallback={false} omits the table", () => {
    render(<Chart tableFallback={false} data={[{ label: "Mon", value: 1 }]} />);
    expect(screen.queryByRole("table")).toBeNull();
  });

  it("the svg keeps role=img and aria-describedby matching the table id", () => {
    const { container } = render(<Chart data={[{ label: "Mon", value: 1 }]} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("role", "img");
    const describedby = svg.getAttribute("aria-describedby");
    expect(describedby).toBeTruthy();
    expect(container.querySelector("table").id).toBe(describedby);
  });
});

describe("Chart cartesian family (bar/column/line/area, stacked, horizontal, curves)", () => {
  const two = [{ label: "Jan", a: 10, b: 4 }, { label: "Feb", a: 6, b: 8 }];

  it("column is an alias of bar (vertical bars)", () => {
    const { container } = render(<Chart type="column" data={[{ label: "Mon", value: 5 }, { label: "Tue", value: 9 }]} />);
    expect(container.querySelectorAll(".twc-chart__bar").length).toBe(2);
    expect(container.querySelector(".twc-chart--column")).toBeInTheDocument();
  });

  it("grouped bars render one rect per series per category", () => {
    const { container } = render(<Chart type="bar" series={["a", "b"]} data={two} />);
    expect(container.querySelectorAll(".twc-chart__bar").length).toBe(4);
  });

  it("stacked bars still render one rect per series per category", () => {
    const { container } = render(<Chart type="bar" stacked series={["a", "b"]} data={two} />);
    expect(container.querySelectorAll(".twc-chart__bar").length).toBe(4);
  });

  it("area type renders filled area + line paths", () => {
    const { container } = render(<Chart type="area" data={[{ label: "Mon", value: 5 }, { label: "Tue", value: 9 }]} />);
    expect(container.querySelector(".twc-chart__area")).toBeInTheDocument();
    expect(container.querySelector(".twc-chart__line")).toBeInTheDocument();
  });

  it("smooth line uses a bezier path (contains C)", () => {
    const { container } = render(<Chart type="line" smooth data={[{ label: "a", value: 1 }, { label: "b", value: 5 }, { label: "c", value: 3 }]} />);
    expect(container.querySelector(".twc-chart__line").getAttribute("d")).toContain("C");
  });

  it("horizontal bars keep the accessible data table", () => {
    render(<Chart type="bar" horizontal data={[{ label: "Mon", value: 5 }]} />);
    expect(screen.getByRole("rowheader", { name: "Mon" })).toBeInTheDocument();
  });
});

describe("Chart interactivity (tooltip + legend toggle)", () => {
  it("hovering a bar shows a floating tooltip with the category + value; leaving hides it", () => {
    const { container } = render(<Chart data={[{ label: "Mon", value: 240 }, { label: "Tue", value: 310 }]} valueFormat={(v) => `$${v}`} />);
    expect(container.querySelector(".twc-chart__tip")).toBeNull();
    const bar = container.querySelector(".twc-chart__bar");
    fireEvent.mouseMove(bar, { clientX: 10, clientY: 10 });
    const tip = container.querySelector(".twc-chart__tip");
    expect(tip).toBeInTheDocument();
    expect(tip).toHaveTextContent("Mon");
    expect(tip).toHaveTextContent("$240");
    fireEvent.mouseLeave(bar);
    expect(container.querySelector(".twc-chart__tip")).toBeNull();
  });

  it("clicking a legend item toggles that series off (fewer marks render)", () => {
    const two = [{ label: "Jan", a: 10, b: 4 }, { label: "Feb", a: 6, b: 8 }];
    const { container, getByRole } = render(<Chart series={["a", "b"]} showLegend data={two} />);
    expect(container.querySelectorAll(".twc-chart__bar").length).toBe(4); // 2 cats x 2 series
    fireEvent.click(getByRole("button", { name: "b" })); // the legend chip (role=button)
    expect(container.querySelectorAll(".twc-chart__bar").length).toBe(2); // series b hidden
  });

  it("line charts render an entrance-animated draw path + hit targets for point tooltips", () => {
    const { container } = render(<Chart type="line" data={[{ label: "a", value: 1 }, { label: "b", value: 5 }]} />);
    expect(container.querySelector(".twc-chart__anim-line")).toBeInTheDocument();
    expect(container.querySelectorAll(".twc-chart__hit").length).toBe(2);
  });

  it("area charts fill with a gradient", () => {
    const { container } = render(<Chart type="area" data={[{ label: "a", value: 1 }, { label: "b", value: 5 }]} />);
    expect(container.querySelector("linearGradient")).toBeInTheDocument();
    expect(container.querySelector(".twc-chart__area").getAttribute("style")).toMatch(/url\(["']?#twc-grad/);
  });

  it("showValues renders data labels", () => {
    const { container } = render(<Chart showValues data={[{ label: "Mon", value: 240 }]} />);
    expect(container.querySelector(".twc-chart__label")).toBeInTheDocument();
  });
});

describe("Chart interactivity — click, select, legend focus, crosshair, zoom", () => {
  const two = [{ label: "Jan", a: 10, b: 4 }, { label: "Feb", a: 6, b: 8 }];

  it("onDataClick fires with the clicked datum + metadata", () => {
    const onDataClick = vi.fn();
    const { container } = render(<Chart data={[{ label: "Mon", value: 240 }, { label: "Tue", value: 310 }]} onDataClick={onDataClick} />);
    fireEvent.click(container.querySelector(".twc-chart__bar"));
    expect(onDataClick).toHaveBeenCalledTimes(1);
    const p = onDataClick.mock.calls[0][0];
    expect(p.label).toBe("Mon");
    expect(p.series).toBe("value");
    expect(p.value).toBe(240);
    expect(p.index).toBe(0);
    expect(p.row).toEqual({ label: "Mon", value: 240 });
  });

  it("clicking a bar selects it (data-selected outline); clicking again clears", () => {
    const { container } = render(<Chart data={[{ label: "Mon", value: 5 }, { label: "Tue", value: 9 }]} onDataClick={() => {}} />);
    const bar = container.querySelector(".twc-chart__bar");
    fireEvent.click(bar);
    expect(container.querySelector('.twc-chart__bar[data-selected="true"]')).toBeInTheDocument();
    fireEvent.click(bar);
    expect(container.querySelector('.twc-chart__bar[data-selected="true"]')).toBeNull();
  });

  it("the root is marked clickable when onDataClick is set", () => {
    const { container } = render(<Chart data={[{ label: "Mon", value: 1 }]} onDataClick={() => {}} />);
    expect(container.querySelector('.twc-chart[data-clickable="true"]')).toBeInTheDocument();
  });

  it("hovering a legend item focuses that series (root hovering + that series active)", () => {
    const { container, getByRole } = render(<Chart series={["a", "b"]} showLegend data={two} />);
    expect(container.querySelector('.twc-chart[data-hovering="true"]')).toBeNull();
    fireEvent.mouseEnter(getByRole("button", { name: "b" }));
    const root = container.querySelector(".twc-chart");
    expect(root).toHaveAttribute("data-hovering", "true");
    // bars of series b are active, series a bars are not
    const active = Array.from(container.querySelectorAll('.twc-chart__bar[data-active="true"]'));
    expect(active.length).toBe(2); // both categories, series b
    fireEvent.mouseLeave(getByRole("button", { name: "b" }));
    expect(container.querySelector('.twc-chart[data-hovering="true"]')).toBeNull();
  });

  it("a crosshair line appears while hovering (vertical chart)", () => {
    const { container } = render(<Chart type="line" data={[{ label: "a", value: 1 }, { label: "b", value: 5 }]} />);
    expect(container.querySelector(".twc-chart__crosshair")).toBeNull();
    fireEvent.mouseMove(container.querySelector(".twc-chart__hit"), { clientX: 5, clientY: 5 });
    expect(container.querySelector(".twc-chart__crosshair")).toBeInTheDocument();
  });

  it("hover-anywhere zones: hovering a plot zone (between points) shows the tooltip + crosshair", () => {
    const { container } = render(<Chart type="line" data={[{ label: "a", value: 1 }, { label: "b", value: 5 }, { label: "c", value: 3 }]} />);
    const zones = container.querySelectorAll(".twc-chart__zone");
    expect(zones.length).toBe(3); // one per category, covering the whole plot
    fireEvent.mouseMove(zones[1], { clientX: 5, clientY: 5 });
    expect(container.querySelector(".twc-chart__tip")).toHaveTextContent("b");
    expect(container.querySelector(".twc-chart__crosshair")).toBeInTheDocument();
  });

  it("clicking a plot zone fires a category-level onDataClick (series null)", () => {
    const onDataClick = vi.fn();
    const { container } = render(<Chart type="line" data={[{ label: "a", value: 1 }, { label: "b", value: 5 }]} onDataClick={onDataClick} />);
    fireEvent.click(container.querySelector(".twc-chart__zone"));
    expect(onDataClick).toHaveBeenCalled();
    expect(onDataClick.mock.calls[0][0].series).toBeNull();
  });

  it("zoomable renders the event overlay and drag interactions do not throw", () => {
    const { container } = render(<Chart type="line" zoomable data={[{ label: "a", value: 1 }, { label: "b", value: 5 }, { label: "c", value: 3 }]} />);
    const overlay = container.querySelector(".twc-chart__overlay");
    expect(overlay).toBeInTheDocument();
    expect(() => {
      fireEvent.mouseDown(overlay, { clientX: 10, clientY: 10 });
      fireEvent.mouseMove(overlay, { clientX: 200, clientY: 10 });
      fireEvent.mouseUp(overlay);
    }).not.toThrow();
  });
});
