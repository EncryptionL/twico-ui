import React from "react";

const CAROUSEL_CSS = `
.twc-carousel { position: relative; font-family: var(--font-sans); }
.twc-carousel__viewport { overflow: hidden; border-radius: var(--radius-xl); }
.twc-carousel__track { display: flex; transition: transform var(--duration-slow) var(--ease-emphasis); }
.twc-carousel__slide { flex: 0 0 100%; min-width: 0; }
.twc-carousel__arrow { position: absolute; top: 50%; transform: translateY(-50%); z-index: 2;
  display: grid; place-items: center; width: 38px; height: 38px; border-radius: var(--radius-full);
  background: color-mix(in srgb, var(--color-surface) 88%, transparent); color: var(--color-text);
  border: var(--border-thin) solid var(--color-border); box-shadow: var(--shadow-md); cursor: pointer; backdrop-filter: blur(6px);
  transition: background-color var(--duration-fast) var(--ease-standard), transform var(--duration-fast) var(--ease-spring); }
.twc-carousel__arrow:hover { background: var(--color-surface); }
.twc-carousel__arrow:active { transform: translateY(-50%) scale(0.9); }
.twc-carousel__arrow:disabled { opacity: 0; pointer-events: none; }
.twc-carousel__arrow[data-dir="prev"] { inset-inline-start: 12px; }
.twc-carousel__arrow[data-dir="next"] { inset-inline-end: 12px; }
.twc-carousel__arrow svg { width: 18px; height: 18px; }
[dir="rtl"] .twc-carousel__arrow svg { transform: scaleX(-1); }
.twc-carousel__dots { display: flex; justify-content: center; gap: 7px; margin-top: var(--space-3); }
.twc-carousel__dot { width: 8px; height: 8px; border-radius: var(--radius-full); border: none; padding: 0; cursor: pointer;
  background: var(--color-border-strong); transition: width var(--duration-base) var(--ease-spring), background-color var(--duration-fast); }
.twc-carousel__dot[data-active="true"] { width: 22px; background: var(--color-primary); }
`;

export function Carousel({
  children,
  index: indexProp,
  defaultIndex = 0,
  onIndexChange,
  showArrows = true,
  showDots = true,
  loop = true,
  autoPlay = false,
  interval = 4000,
  className = "",
  ...rest
}) {
  React.useInsertionEffect(() => {
    if (document.getElementById("twc-carousel-styles")) return;
    const el = document.createElement("style");
    el.id = "twc-carousel-styles";
    el.textContent = CAROUSEL_CSS;
    document.head.appendChild(el);
  }, []);

  const slides = React.Children.toArray(children);
  const count = slides.length;
  const [internal, setInternal] = React.useState(defaultIndex);
  const index = indexProp !== undefined ? indexProp : internal;
  const [paused, setPaused] = React.useState(false);

  const setIndex = React.useCallback((i) => {
    if (indexProp === undefined) setInternal(i);
    onIndexChange?.(i);
  }, [indexProp, onIndexChange]);

  const go = React.useCallback((i) => {
    setIndex(loop ? (i + count) % count : Math.min(Math.max(i, 0), count - 1));
  }, [count, loop, setIndex]);

  React.useEffect(() => {
    if (!autoPlay || paused || count <= 1) return;
    const t = setInterval(() => {
      const next = loop ? (index + 1) % count : (index + 1 >= count ? index : index + 1);
      if (next !== index) setIndex(next);
    }, interval);
    return () => clearInterval(t);
  }, [autoPlay, paused, count, interval, loop, index, setIndex]);

  const atStart = !loop && index === 0;
  const atEnd = !loop && index === count - 1;

  return (
    <div className={`twc-carousel ${className}`}
      onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)} onBlurCapture={() => setPaused(false)}
      role="region" aria-roledescription="carousel" {...rest}>
      <div className="twc-carousel__viewport">
        <div className="twc-carousel__track" style={{ transform: `translateX(-${index * 100}%)` }}>
          {slides.map((s, i) => (
            <div className="twc-carousel__slide" key={i} role="group" aria-roledescription="slide" aria-label={`${i + 1} of ${count}`} aria-hidden={i !== index || undefined} inert={i !== index || undefined}>{s}</div>
          ))}
        </div>
      </div>
      {showArrows && count > 1 ? (
        <>
          <button className="twc-carousel__arrow" data-dir="prev" aria-label="Previous" disabled={atStart} onClick={() => go(index - 1)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <button className="twc-carousel__arrow" data-dir="next" aria-label="Next" disabled={atEnd} onClick={() => go(index + 1)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </button>
        </>
      ) : null}
      {showDots && count > 1 ? (
        <div className="twc-carousel__dots">
          {slides.map((_, i) => (
            <button key={i} className="twc-carousel__dot" data-active={i === index || undefined} aria-label={`Go to slide ${i + 1}`} onClick={() => go(i)} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
