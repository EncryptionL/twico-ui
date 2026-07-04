import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { Code } from "../components/typography/Code.jsx";

describe("Code inline/block (#163)", () => {
  it("default is inline <code> with no copy button", () => {
    const { container } = render(<Code>x</Code>);
    expect(container.querySelector(".twc-code").tagName).toBe("CODE");
    expect(container.querySelector("button")).toBeNull();
  });

  it("block renders a <pre data-block>", () => {
    const { container } = render(<Code block>x</Code>);
    const el = container.querySelector(".twc-code");
    expect(el.tagName).toBe("PRE");
    expect(el).toHaveAttribute("data-block", "true");
  });

  it("explicit `as` overrides the pre default", () => {
    const { container } = render(<Code block as="div">x</Code>);
    expect(container.querySelector(".twc-code").tagName).toBe("DIV");
  });
});

describe("Code copyable (#163)", () => {
  let writeText;
  beforeEach(() => {
    writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
  });
  afterEach(() => {
    delete navigator.clipboard;
  });

  it("copies the code text and toggles the button label", async () => {
    render(<Code block copyable>curl https://x</Code>);
    const btn = screen.getByRole("button", { name: "Copy code" });
    await act(async () => {
      btn.click();
    });
    expect(writeText).toHaveBeenCalledWith("curl https://x");
    expect(screen.getByRole("button", { name: "Copied" })).toBeInTheDocument();
  });

  it("copyLabel/copiedLabel overrides propagate", async () => {
    render(
      <Code block copyable copyLabel="Kopieren" copiedLabel="Kopiert!">
        x
      </Code>
    );
    expect(screen.getByRole("button", { name: "Kopieren" })).toBeInTheDocument();
    await act(async () => {
      screen.getByRole("button").click();
    });
    expect(screen.getByRole("button", { name: "Kopiert!" })).toBeInTheDocument();
  });
});
