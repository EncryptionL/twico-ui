import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { useScopedStyles, NonceContext } from "../components/_styles.js";

// #189: under React 19, twico renders scoped styles as hoistable
// `<style href precedence="twc-ui">` tags. React strips a `nonce` from precedence-managed
// styles unless the same value is passed as a render option (impossible for third-party
// styles in the App Router), so stamping one there only produces a console warning per
// tag. We must NOT put the nonce on those tags — even when a NonceContext supplies one.
describe("CSP nonce on precedence-managed <style> (#189)", () => {
  function Probe() {
    return useScopedStyles("twc-nonce-probe", ".twc-nonce-probe { color: rgb(1, 2, 3); }");
  }

  it("does not stamp the nonce on the twc-ui precedence style, even under a NonceContext", () => {
    render(
      <NonceContext.Provider value="test-nonce-123">
        <Probe />
      </NonceContext.Provider>,
    );
    const styles = Array.from(document.querySelectorAll("style")).filter((s) =>
      (s.textContent || "").includes("twc-nonce-probe"),
    );
    expect(styles.length).toBeGreaterThan(0);
    for (const s of styles) expect(s.getAttribute("nonce")).toBeNull();
  });
});
