import React from "react";
import { describe, it, expect, afterEach, vi } from "vitest";
import { render, fireEvent, cleanup } from "@testing-library/react";
import { partitionFiles } from "../components/_upload.js";
import { useFilePicker } from "../hooks/index.js";
import { FileUpload } from "../components/inputs/FileUpload.jsx";

// #406: shared validation (_upload.partitionFiles) + useFilePicker hook + FileUpload trigger/headless + ref.
afterEach(() => cleanup());
const mkFile = (name, size = 10, type = "text/plain") => {
  const f = new File(["x".repeat(size)], name, { type });
  Object.defineProperty(f, "size", { value: size });
  return f;
};

describe("partitionFiles (#406)", () => {
  it("rejects by type, size and count and dedupes in multiple mode", () => {
    const png = mkFile("a.png", 10, "image/png");
    const txt = mkFile("b.txt", 10, "text/plain");
    const big = mkFile("c.png", 999, "image/png");
    const r1 = partitionFiles([png, txt, big], { accept: "image/*", maxSize: 100, multiple: true });
    expect(r1.accepted.map((f) => f.name)).toEqual(["a.png"]);
    expect(r1.rejections.map((x) => x.reason).sort()).toEqual(["size", "type"]);
    // count limit
    const r2 = partitionFiles([mkFile("1.png"), mkFile("2.png")], { multiple: true, maxFiles: 1 });
    expect(r2.accepted.length).toBe(1);
    expect(r2.rejections[0].reason).toBe("count");
    // dedupe against current
    const dup = mkFile("d.png");
    const r3 = partitionFiles([dup], { multiple: true, current: [dup] });
    expect(r3.accepted.length).toBe(0);
  });
});

function Picker(props) {
  const { open, getInputProps } = useFilePicker(props);
  return (<><button onClick={open}>Attach</button><input data-testid="inp" {...getInputProps()} /></>);
}

describe("useFilePicker (#406)", () => {
  it("open() clicks the hidden input; onChange fires onFiles/onReject and resets value", () => {
    const onFiles = vi.fn();
    const onReject = vi.fn();
    const clickSpy = vi.fn();
    const { getByText, getByTestId } = render(<Picker accept="image/*" onFiles={onFiles} onReject={onReject} />);
    const input = getByTestId("inp");
    input.click = clickSpy;
    fireEvent.click(getByText("Attach"));
    expect(clickSpy).toHaveBeenCalled();
    const good = mkFile("ok.png", 10, "image/png");
    const bad = mkFile("no.txt", 10, "text/plain");
    fireEvent.change(input, { target: { files: [good, bad] } });
    expect(onFiles).toHaveBeenCalledWith([good]);
    expect(onReject.mock.calls[0][0][0].reason).toBe("type");
    expect(input.value).toBe(""); // reset for re-pick
  });
});

describe("FileUpload headless trigger + ref (#406)", () => {
  it("trigger renders only the trigger (no zone/list) and a click opens the picker", () => {
    const { container, getByText } = render(
      <FileUpload trigger={<button>Change picture</button>} />,
    );
    expect(container.querySelector(".twc-upload__zone")).toBeNull();
    expect(container.querySelector(".twc-upload__list")).toBeNull();
    const input = container.querySelector('input[type="file"]');
    const spy = vi.fn();
    input.click = spy;
    fireEvent.click(getByText("Change picture").closest(".twc-upload__trigger"));
    expect(spy).toHaveBeenCalled();
  });

  it("ref.open() clicks the input", () => {
    const ref = React.createRef();
    const { container } = render(<FileUpload ref={ref} />);
    const input = container.querySelector('input[type="file"]');
    const spy = vi.fn();
    input.click = spy;
    ref.current.open();
    expect(spy).toHaveBeenCalled();
  });

  it("default zone still renders (no regression) and children don't leak to the root", () => {
    const { container } = render(<FileUpload><span data-leak>hi</span></FileUpload>);
    expect(container.querySelector(".twc-upload__zone")).toBeTruthy();
    expect(container.querySelector("[data-leak]")).toBeNull(); // children destructured, not spread on root
  });

  it("#415: the hidden input is out of the tab order + a11y tree; label names the zone via aria-labelledby", () => {
    const { container } = render(<FileUpload label="Attachments" />);
    const input = container.querySelector('input[type="file"]');
    expect(input.getAttribute("tabindex")).toBe("-1");
    expect(input.getAttribute("aria-hidden")).toBe("true");
    const zone = container.querySelector(".twc-upload__zone");
    expect(zone.getAttribute("aria-labelledby")).toMatch(/-label .*-title/); // named by the label + title, not htmlFor
    expect(container.querySelector("label").hasAttribute("for")).toBe(false); // no htmlFor at a non-labelable div
  });

  it("#415: trigger mode names the trigger from label without clobbering its own aria-label", () => {
    const { container } = render(<FileUpload label="Avatar" trigger={<button aria-label="Change picture">c</button>} />);
    const btn = container.querySelector(".twc-upload__trigger button");
    expect(btn.getAttribute("aria-label")).toBe("Change picture"); // own name preserved
    expect(btn.getAttribute("aria-labelledby")).toBeNull(); // not overridden
  });
});
