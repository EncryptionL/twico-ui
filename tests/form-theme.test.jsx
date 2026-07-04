import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Form } from "../components/inputs/Form.jsx";
import { ThemeProvider, createTheme } from "../components/layout/ThemeProvider.jsx";

describe("Form (#60)", () => {
  it("preventDefault + calls onSubmit", () => {
    const onSubmit = vi.fn((e) => e.preventDefault());
    const { container } = render(
      <Form onSubmit={onSubmit}><button type="submit">Go</button></Form>
    );
    fireEvent.submit(container.querySelector("form"));
    expect(onSubmit).toHaveBeenCalled();
  });

  it("loading disables all controls via a fieldset + aria-busy", () => {
    const { container } = render(
      <Form loading><input /><button type="submit">Go</button></Form>
    );
    const fs = container.querySelector("fieldset");
    expect(fs).toBeDisabled();
    expect(fs).toHaveAttribute("aria-busy", "true");
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("forwards ref to the <form>", async () => {
    const React = await import("react");
    const ref = React.createRef();
    render(<Form ref={ref}><span /></Form>);
    expect(ref.current.tagName).toBe("FORM");
  });
});

describe("createTheme + ThemeProvider (#61)", () => {
  it("createTheme maps friendly tokens to CSS variables", () => {
    const t = createTheme({ colors: { primary: "#123456" }, radius: { md: "10px" } });
    expect(t["--color-primary"]).toBe("#123456");
    expect(t["--radius-md"]).toBe("10px");
  });

  it("ThemeProvider applies the vars inline by default", () => {
    const { container } = render(
      <ThemeProvider theme={createTheme({ colors: { primary: "rgb(1, 2, 3)" } })}>x</ThemeProvider>
    );
    const el = container.querySelector(".twc-theme");
    expect(el.style.getPropertyValue("--color-primary")).toBe("rgb(1, 2, 3)");
  });

  it("accepts a raw partial token object too", () => {
    const { container } = render(<ThemeProvider theme={{ colors: { primary: "rgb(9, 9, 9)" } }}>x</ThemeProvider>);
    expect(container.querySelector(".twc-theme").style.getPropertyValue("--color-primary")).toBe("rgb(9, 9, 9)");
  });

  it("stylesheet mode injects a scoped rule instead of inline vars", () => {
    const { container } = render(
      <ThemeProvider mode="stylesheet" theme={{ colors: { primary: "#f00" } }}>x</ThemeProvider>
    );
    const el = container.querySelector(".twc-theme");
    expect(el).toHaveAttribute("data-twc-theme");
    expect(el.style.getPropertyValue("--color-primary")).toBe(""); // not inline in stylesheet mode
  });
});
