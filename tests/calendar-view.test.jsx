import React from "react";
import { describe, it, expect } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { DatePicker } from "../components/inputs/DatePicker.jsx";
import { DateRangePicker } from "../components/inputs/DateRangePicker.jsx";

// #207 / #206 — the calendar header is a 3-tier switch: days -> months -> years (decade),
// mirrored across DatePicker and DateRangePicker. The title button cycles the view; picking a
// month drills back to days, picking a year drills back to months.
const specs = [
  { name: "DatePicker", node: <DatePicker defaultValue={new Date(2024, 5, 15)} />, p: "dp", open: ".twc-dp__control" },
  { name: "DateRangePicker", node: <DateRangePicker value={{ start: new Date(2024, 5, 3), end: new Date(2024, 5, 9) }} />, p: "drp", open: ".twc-drp__control" },
];

describe.each(specs)("$name calendar view tiers (#207/#206)", ({ node, p, open }) => {
  const q = (s) => Array.from(document.querySelectorAll(s));
  const title = () => document.querySelector(`.twc-${p}__title`);

  it("cycles days -> months -> years on the title, then drills back down", () => {
    const { container } = render(node);
    fireEvent.click(container.querySelector(open)); // open in days view

    expect(q(`.twc-${p}__day`).length).toBeGreaterThan(0);
    expect(title()).toHaveTextContent("June 2024");

    // days -> months
    fireEvent.click(title());
    const months = q(`.twc-${p}__mo`);
    expect(months.length).toBe(12);
    expect(title()).toHaveTextContent("2024");
    // the selected month is highlighted
    expect(months.find((b) => b.textContent === "Jun")).toHaveAttribute("data-selected", "true");

    // months -> years (decade window 2020–2029, padded by one on each side = 12 cells)
    fireEvent.click(title());
    const years = q(`.twc-${p}__yr`);
    expect(years.length).toBe(12);
    expect(title()).toHaveTextContent("2020–2029");
    expect(years.find((b) => b.textContent === "2024")).toHaveAttribute("data-selected", "true");
    // padding cells fall outside the decade
    expect(years.find((b) => b.textContent === "2019")).toHaveAttribute("data-outside", "true");

    // pick a year -> back to months
    fireEvent.click(years.find((b) => b.textContent === "2026"));
    expect(q(`.twc-${p}__mo`).length).toBe(12);
    expect(title()).toHaveTextContent("2026");

    // pick a month -> back to days, view now March 2026
    fireEvent.click(q(`.twc-${p}__mo`).find((b) => b.textContent === "Mar"));
    expect(q(`.twc-${p}__day`).length).toBeGreaterThan(0);
    expect(title()).toHaveTextContent("March 2026");
  });

  it("the years/months header nav steps by decade then by year", () => {
    const { container } = render(node);
    fireEvent.click(container.querySelector(open));
    fireEvent.click(title()); // months
    fireEvent.click(title()); // years, 2020–2029
    fireEvent.click(document.querySelector(`.twc-${p}__nav[aria-label="Previous decade"]`));
    expect(title()).toHaveTextContent("2010–2019");
    // back to months view keeps its own year nav
    fireEvent.click(q(`.twc-${p}__yr`).find((b) => b.textContent === "2015"));
    expect(title()).toHaveTextContent("2015");
    fireEvent.click(document.querySelector(`.twc-${p}__nav[aria-label="Next year"]`));
    expect(title()).toHaveTextContent("2016");
  });
});
