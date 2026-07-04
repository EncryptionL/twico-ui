import { describe, it, expect, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { FileUpload } from "../components/inputs/FileUpload.jsx";

const mkFile = (name, size = 100, type = "", lastModified = 1) => {
  const f = new File(["x".repeat(size)], name, { type, lastModified });
  Object.defineProperty(f, "size", { value: size });
  return f;
};
const drop = (zone, files) => fireEvent.drop(zone, { dataTransfer: { files } });

describe("FileUpload validation (#102/#103/#104)", () => {
  it("filters dropped files by accept (#102)", () => {
    const onChange = vi.fn();
    const { container } = render(<FileUpload accept=".png,image/*" multiple onChange={onChange} />);
    drop(container.querySelector(".twc-upload__zone"), [mkFile("a.png", 10, "image/png"), mkFile("b.txt", 10, "text/plain")]);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][0].map((f) => f.name)).toEqual(["a.png"]);
  });

  it("rejects oversize / over-count files and reports via onReject (#103)", () => {
    const onReject = vi.fn();
    const onChange = vi.fn();
    const { container } = render(<FileUpload multiple maxSize={50} maxFiles={1} onReject={onReject} onChange={onChange} />);
    drop(container.querySelector(".twc-upload__zone"), [mkFile("ok.txt", 10), mkFile("big.txt", 999), mkFile("extra.txt", 10, "", 2)]);
    // ok.txt accepted; big.txt rejected (size); extra.txt rejected (count)
    expect(onChange.mock.calls[0][0].map((f) => f.name)).toEqual(["ok.txt"]);
    const reasons = onReject.mock.calls[0][0].map((r) => r.reason);
    expect(reasons).toContain("size");
    expect(reasons).toContain("count");
  });

  it("dedupes re-added identical files (#104)", () => {
    const onChange = vi.fn();
    const file = mkFile("dup.txt", 10, "", 7);
    const { container } = render(<FileUpload multiple defaultValue={[file]} onChange={onChange} />);
    drop(container.querySelector(".twc-upload__zone"), [mkFile("dup.txt", 10, "", 7)]);
    // identical key → silent no-op, no onChange
    expect(onChange).not.toHaveBeenCalled();
  });
});
