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
