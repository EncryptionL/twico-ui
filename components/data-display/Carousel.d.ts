import * as React from "react";

/**
 * Sliding carousel — one slide per view, prev/next arrows, dot indicators,
 * optional looping and autoplay (pauses on hover). Each child is a slide.
 *
 * @startingPoint section="Data display" subtitle="Sliding carousel" viewport="700x320"
 */
export interface CarouselProps extends React.HTMLAttributes<HTMLDivElement> {
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
