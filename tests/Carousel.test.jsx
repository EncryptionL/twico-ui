import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act, cleanup } from "@testing-library/react";
import { Carousel } from "../components/data-display/Carousel.jsx";

function setup(props) {
  const onIndexChange = vi.fn();
  render(
    <Carousel onIndexChange={onIndexChange} {...props}>
      <div>A</div>
      <div>B</div>
      <div>C</div>
    </Carousel>
  );
  return { onIndexChange, region: screen.getByRole("region") };
}

describe("Carousel keyboard navigation (#153)", () => {
  it("Arrow keys, Home, and End move slides", () => {
    const { onIndexChange, region } = setup({ loop: false });
    fireEvent.keyDown(region, { key: "ArrowRight" });
    expect(onIndexChange).toHaveBeenLastCalledWith(1);
    fireEvent.keyDown(region, { key: "ArrowLeft" });
    expect(onIndexChange).toHaveBeenLastCalledWith(0);
    fireEvent.keyDown(region, { key: "End" });
    expect(onIndexChange).toHaveBeenLastCalledWith(2);
    fireEvent.keyDown(region, { key: "Home" });
    expect(onIndexChange).toHaveBeenLastCalledWith(0);
  });

  it("an unhandled key does nothing", () => {
    const { onIndexChange, region } = setup();
    fireEvent.keyDown(region, { key: "a" });
    expect(onIndexChange).not.toHaveBeenCalled();
  });

  it("does not hijack typing inside a form control in a slide", () => {
    const onIndexChange = vi.fn();
    render(
      <Carousel onIndexChange={onIndexChange} loop={false}>
        <input aria-label="q" />
        <div>B</div>
      </Carousel>
    );
    fireEvent.keyDown(screen.getByRole("textbox"), { key: "ArrowRight" });
    expect(onIndexChange).not.toHaveBeenCalled();
  });
});

describe("Carousel accessible name (#155)", () => {
  it("defaults to 'Carousel', accepts label, and defers to aria-labelledby", () => {
    const { rerender } = render(<Carousel><div>A</div></Carousel>);
    expect(screen.getByRole("region")).toHaveAttribute("aria-label", "Carousel");
    rerender(<Carousel label="Featured products"><div>A</div></Carousel>);
    expect(screen.getByRole("region")).toHaveAttribute("aria-label", "Featured products");
    rerender(<Carousel aria-labelledby="heading-1"><div>A</div></Carousel>);
    const r = screen.getByRole("region");
    expect(r).toHaveAttribute("aria-labelledby", "heading-1");
    expect(r).not.toHaveAttribute("aria-label");
  });
});

describe("Carousel live region (#156)", () => {
  it("announces the active slide politely", () => {
    const { container } = render(
      <Carousel><div>A</div><div>B</div></Carousel>
    );
    const live = container.querySelector(".twc-carousel__live");
    expect(live).toHaveAttribute("aria-live", "polite");
    expect(live).toHaveTextContent("Slide 1 of 2");
  });
});

describe("Carousel autoPlay, reduced-motion & pause (#154)", () => {
  let mm;
  beforeEach(() => {
    mm = { reduce: false };
    window.matchMedia = vi.fn((q) => ({
      matches: q.includes("reduce") ? mm.reduce : false,
      media: q,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
  });
  afterEach(() => {
    delete window.matchMedia;
    vi.useRealTimers();
  });

  it("advances after the interval", () => {
    vi.useFakeTimers();
    const onIndexChange = vi.fn();
    render(
      <Carousel autoPlay interval={1000} onIndexChange={onIndexChange}>
        <div>A</div><div>B</div>
      </Carousel>
    );
    act(() => vi.advanceTimersByTime(1000));
    expect(onIndexChange).toHaveBeenCalledWith(1);
  });

  it("does NOT advance under prefers-reduced-motion", () => {
    vi.useFakeTimers();
    mm.reduce = true;
    const onIndexChange = vi.fn();
    render(
      <Carousel autoPlay interval={1000} onIndexChange={onIndexChange}>
        <div>A</div><div>B</div>
      </Carousel>
    );
    act(() => vi.advanceTimersByTime(3000));
    expect(onIndexChange).not.toHaveBeenCalled();
  });

  it("the pause button stops autoplay and toggles its label", () => {
    vi.useFakeTimers();
    const onIndexChange = vi.fn();
    render(
      <Carousel autoPlay interval={1000} onIndexChange={onIndexChange}>
        <div>A</div><div>B</div>
      </Carousel>
    );
    act(() => screen.getByRole("button", { name: "Pause" }).click());
    expect(screen.getByRole("button", { name: "Play" })).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(3000));
    expect(onIndexChange).not.toHaveBeenCalled();
  });
});
