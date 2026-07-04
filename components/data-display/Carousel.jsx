import React from "react";
import { useScopedStyles } from "../_styles.js";

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
.twc-carousel__pause { position: absolute; top: 12px; inset-inline-end: 12px; z-index: 2;
  display: grid; place-items: center; width: 34px; height: 34px; border-radius: var(--radius-full);
  background: color-mix(in srgb, var(--color-surface) 88%, transparent); color: var(--color-text);
  border: var(--border-thin) solid var(--color-border); box-shadow: var(--shadow-sm); cursor: pointer;
  backdrop-filter: blur(6px); transition: background-color var(--duration-fast) var(--ease-standard); }
.twc-carousel__pause:hover { background: var(--color-surface); }
.twc-carousel__pause svg { width: 15px; height: 15px; display: block; }
.twc-carousel__live { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
  overflow: hidden; clip: rect(0 0 0 0); clip-path: inset(50%); white-space: nowrap; border: 0; }
`;

export function Carousel({
  children,
  index: indexProp,
  defaultIndex = 0,
  onIndexChange,
  showArrows = true,
  showDots = true,
  showPauseButton = true,
  loop = true,
  autoPlay = false,
  interval = 4000,
  label,
  pauseLabel = "Pause",
  playLabel = "Play",
  className = "",
  onKeyDown: onKeyDownProp,
  "aria-label": ariaLabelProp,
  "aria-labelledby": ariaLabelledbyProp,
  ...rest
}) {
  const __twcStyles = useScopedStyles("twc-carousel-styles", CAROUSEL_CSS);

  const slides = React.Children.toArray(children);
  const count = slides.length;
  const [internal, setInternal] = React.useState(defaultIndex);
  const index = indexProp !== undefined ? indexProp : internal;
  const [paused, setPaused] = React.useState(false);
  const [userPaused, setUserPaused] = React.useState(false);

  // SSR-safe prefers-reduced-motion signal (inlined — components don't import hooks/).
  const [prefersReduced, setPrefersReduced] = React.useState(false);
  React.useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return undefined;
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setPrefersReduced(mql.matches);
    on();
    mql.addEventListener("change", on);
    return () => mql.removeEventListener("change", on);
  }, []);

  const setIndex = React.useCallback((i) => {
    if (indexProp === undefined) setInternal(i);
    onIndexChange?.(i);
  }, [indexProp, onIndexChange]);

  const go = React.useCallback((i) => {
    setIndex(loop ? (i + count) % count : Math.min(Math.max(i, 0), count - 1));
  }, [count, loop, setIndex]);

  // Autoplay is suppressed on hover/focus, when the user pauses, and under
  // prefers-reduced-motion (WCAG 2.2.2). While actively rotating, the live region
  // switches to "off" so it doesn't announce every automatic slide change.
  const autoRotating = autoPlay && !paused && !userPaused && !prefersReduced && count > 1;

  React.useEffect(() => {
    if (!autoRotating) return undefined;
    const t = setInterval(() => {
      const next = loop ? (index + 1) % count : (index + 1 >= count ? index : index + 1);
      if (next !== index) setIndex(next);
    }, interval);
    return () => clearInterval(t);
  }, [autoRotating, count, interval, loop, index, setIndex]);

  const atStart = !loop && index === 0;
  const atEnd = !loop && index === count - 1;

  const handleKeyDown = (e) => {
    onKeyDownProp?.(e);
    if (e.defaultPrevented) return;
    // Don't hijack typing inside a form control that lives in a slide.
    if (e.target.closest && e.target.closest('input, textarea, select, [contenteditable="true"]')) return;
    switch (e.key) {
      case "ArrowLeft": go(index - 1); break;
      case "ArrowRight": go(index + 1); break;
      case "Home": go(0); break;
      case "End": go(count - 1); break;
      default: return;
    }
    e.preventDefault();
  };

  // Guarantee the region (which carries aria-roledescription="carousel") has an
  // accessible name; a consumer aria-labelledby suppresses the redundant aria-label.
  const ariaLabel = ariaLabelledbyProp ? undefined : (ariaLabelProp ?? label ?? "Carousel");

  return (
    <div className={`twc-carousel ${className}`}
      onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)} onBlurCapture={() => setPaused(false)}
      onKeyDown={handleKeyDown}
      role="region" aria-roledescription="carousel"
      aria-label={ariaLabel} aria-labelledby={ariaLabelledbyProp} {...rest}>
      {__twcStyles}
      <div className="twc-carousel__viewport" tabIndex={0}>
        <div className="twc-carousel__track" style={{ transform: `translateX(-${index * 100}%)` }}>
          {slides.map((s, i) => (
            <div className="twc-carousel__slide" key={i} role="group" aria-roledescription="slide" aria-label={`${i + 1} of ${count}`} aria-hidden={i !== index || undefined} inert={i !== index || undefined}>{s}</div>
          ))}
        </div>
      </div>
      <div className="twc-carousel__live" aria-live={autoRotating ? "off" : "polite"} aria-atomic="true">
        {count > 1 ? `Slide ${index + 1} of ${count}` : null}
      </div>
      {autoPlay && showPauseButton && count > 1 ? (
        <button type="button" className="twc-carousel__pause" aria-label={userPaused ? playLabel : pauseLabel} onClick={() => setUserPaused((v) => !v)}>
          {userPaused
            ? <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>
            : <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>}
        </button>
      ) : null}
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
