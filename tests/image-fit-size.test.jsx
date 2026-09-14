import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Image } from "../components/data-display/Image.jsx";

// #378 — `<Image width height fit>` used to size to the container/intrinsic dimensions: the width/height
// presentational ATTRIBUTES lose to `.twc-image[data-fit] { width/height: 100% }`. The fix emits explicit
// width/height as inline style too (which beats the stylesheet rule), so the props mean what they say while
// object-fit still crops within that box.

const q = () => document.querySelector("img.twc-image");

describe("Image width/height with fit (#378)", () => {
  it("emits explicit width/height as inline style so they beat the [data-fit] rule", () => {
    render(<Image src="/x.jpg" alt="x" width={56} height={56} fit="cover" />);
    const img = q();
    expect(img.getAttribute("data-fit")).toBe("cover"); // the rule that used to win is still applied…
    expect(img.style.width).toBe("56px"); // …but inline style now overrides its width/height:100%
    expect(img.style.height).toBe("56px");
    expect(img.style.objectFit).toBe("cover"); // cropping still works inside the 56×56 box
  });

  it("keeps width/height as HTML attributes too (intrinsic-size / CLS hint)", () => {
    render(<Image src="/x.jpg" alt="x" width={56} height={56} fit="cover" />);
    const img = q();
    expect(img.getAttribute("width")).toBe("56");
    expect(img.getAttribute("height")).toBe("56");
  });

  it("lets a caller's own style win over the width/height props", () => {
    render(<Image src="/x.jpg" alt="x" width={56} height={56} fit="cover" style={{ width: 200 }} />);
    expect(q().style.width).toBe("200px"); // consumer style is spread last
    expect(q().style.height).toBe("56px"); // height still from the prop
  });

  it("accepts a non-numeric width via inline style", () => {
    render(<Image src="/x.jpg" alt="x" width="50%" fit="cover" />);
    expect(q().style.width).toBe("50%");
  });

  it("does not add width/height style when they are not passed", () => {
    render(<Image src="/x.jpg" alt="x" fit="cover" />);
    const img = q();
    expect(img.style.width).toBe("");
    expect(img.style.height).toBe("");
    expect(img.getAttribute("data-fit")).toBe("cover"); // fit-fills-container behaviour unchanged
  });

  it("lets a caller's own style win over the height prop too", () => {
    render(<Image src="/x.jpg" alt="x" width={56} height={56} fit="cover" style={{ height: 200 }} />);
    expect(q().style.height).toBe("200px");
    expect(q().style.width).toBe("56px");
  });

  it("without fit, width/height stay plain attributes (no inline style) so consumer CSS can still override", () => {
    // the [data-fit] rule only exists under `fit`, so the inline-style override is gated on it — without fit,
    // width/height remain zero-specificity attributes a className/media-query can beat (pre-#378 behaviour).
    render(<Image src="/x.jpg" alt="x" width={56} height={56} />);
    const img = q();
    expect(img.getAttribute("data-fit")).toBeNull();
    expect(img.getAttribute("width")).toBe("56"); // attributes still present (intrinsic-size / CLS hint)
    expect(img.style.width).toBe(""); // but NOT inline style
    expect(img.style.height).toBe("");
  });
});
