import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Alert } from "../components/feedback/Alert.jsx";

describe("Alert live region (#157)", () => {
  it("maps tone to a live-region role (danger→alert, info→status, neutral→none)", () => {
    const { rerender } = render(<Alert tone="danger">x</Alert>);
    expect(screen.getByRole("alert")).toBeInTheDocument();
    rerender(<Alert tone="info">x</Alert>);
    expect(screen.queryByRole("alert")).toBeNull();
    expect(screen.getByRole("status")).toBeInTheDocument();
    rerender(<Alert tone="neutral">x</Alert>);
    expect(screen.queryByRole("alert")).toBeNull();
    expect(screen.queryByRole("status")).toBeNull();
  });

  it("the `live` prop overrides the tone default", () => {
    const { rerender } = render(<Alert tone="danger" live="off">x</Alert>);
    expect(screen.queryByRole("alert")).toBeNull();
    rerender(<Alert tone="neutral" live="polite">x</Alert>);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("a raw role passthrough wins over the inferred default", () => {
    render(<Alert tone="info" role="log">x</Alert>);
    expect(screen.getByRole("log")).toBeInTheDocument();
    expect(screen.queryByRole("status")).toBeNull();
  });
});

describe("Alert dismiss label (#158)", () => {
  it("defaults to Dismiss and accepts closeLabel", () => {
    const { rerender } = render(<Alert onClose={() => {}}>x</Alert>);
    expect(screen.getByRole("button", { name: "Dismiss" })).toBeInTheDocument();
    rerender(<Alert onClose={() => {}} closeLabel="Schließen">x</Alert>);
    expect(screen.getByRole("button", { name: "Schließen" })).toBeInTheDocument();
  });
});
