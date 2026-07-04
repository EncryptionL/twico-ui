import * as React from "react";

/**
 * Sliding carousel — one slide per view, prev/next arrows, dot indicators,
 * optional looping and autoplay. Each child is a slide. Controlled via `index` +
 * `onIndexChange`, or uncontrolled via `defaultIndex`.
 *
 * Accessibility: the region is focusable and keyboard-navigable — ArrowLeft/ArrowRight
 * step slides and Home/End jump to first/last. Autoplay pauses on hover/focus, via the
 * pause button, and when `prefers-reduced-motion` is set (WCAG 2.2.2); a polite live
 * region announces the active slide (silenced while auto-rotating). Give the region an
 * accessible name with `label` (or `aria-label`/`aria-labelledby`).
 *
 * @startingPoint section="Data display" subtitle="Sliding carousel" viewport="700x320"
 */
export interface CarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Controlled active slide index — pair with `onIndexChange`. */
  index?: number;
  /** Initial slide index when uncontrolled. @default 0 */
  defaultIndex?: number;
  /** Fired when the active slide changes (arrows, dots, keyboard, or autoplay): (index). */
  onIndexChange?: (index: number) => void;
  /** Show prev/next arrows. @default true */
  showArrows?: boolean;
  /** Show dot indicators. @default true */
  showDots?: boolean;
  /** Show the pause/play toggle when `autoPlay` is on. @default true */
  showPauseButton?: boolean;
  /** Wrap around at the ends. @default true */
  loop?: boolean;
  /** Auto-advance slides. Suppressed under `prefers-reduced-motion`. @default false */
  autoPlay?: boolean;
  /** Autoplay interval in ms. @default 4000 */
  interval?: number;
  /** Accessible name for the carousel region. Falls back to `aria-label`, then `"Carousel"`. */
  label?: string;
  /** Accessible label for the pause button (paused → shows the play label). @default "Pause" */
  pauseLabel?: string;
  /** Accessible label for the play button. @default "Play" */
  playLabel?: string;
  /** Slides (each child is one slide). */
  children?: React.ReactNode;
}

export function Carousel(props: CarouselProps): React.JSX.Element;
