import * as React from "react";

/**
 * Sliding carousel — one slide per view, prev/next arrows, dot indicators,
 * optional looping and autoplay (pauses on hover). Each child is a slide.
 * Controlled via `index` + `onIndexChange`, or uncontrolled via `defaultIndex`.
 *
 * @startingPoint section="Data display" subtitle="Sliding carousel" viewport="700x320"
 */
export interface CarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Controlled active slide index — pair with `onIndexChange`. */
  index?: number;
  /** Initial slide index when uncontrolled. @default 0 */
  defaultIndex?: number;
  /** Fired when the active slide changes (arrows, dots, or autoplay): (index). */
  onIndexChange?: (index: number) => void;
  /** Show prev/next arrows. @default true */
  showArrows?: boolean;
  /** Show dot indicators. @default true */
  showDots?: boolean;
  /** Wrap around at the ends. @default true */
  loop?: boolean;
  /** Auto-advance slides. @default false */
  autoPlay?: boolean;
  /** Autoplay interval in ms. @default 4000 */
  interval?: number;
  /** Slides (each child is one slide). */
  children?: React.ReactNode;
}

export function Carousel(props: CarouselProps): React.JSX.Element;
