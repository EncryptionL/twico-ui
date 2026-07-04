import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
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
