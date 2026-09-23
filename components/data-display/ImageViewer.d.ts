import * as React from "react";

/** The zoom API passed to a `controls` render function. */
export interface ImageViewerControlsApi {
  /** Current zoom level. */
  zoom: number;
  /** Zoom in one `step`, centered. */
  zoomIn: () => void;
  /** Zoom out one `step`, centered. */
  zoomOut: () => void;
  /** Reset to `minZoom` and re-center. */
  reset: () => void;
  /** Whether zooming in further is possible. */
  canZoomIn: boolean;
  /** Whether zooming out further is possible. */
  canZoomOut: boolean;
}

/**
 * A zoomable / pannable image on a fixed stage: pointer-anchored wheel + pinch zoom, drag-to-pan when zoomed
 * (clamped to the stage), `+` / `-` / `0` keys, and double-click to toggle. Wheel uses a non-passive listener
 * so the page/dialog behind never scrolls. Set the stage size via `style`/`className` on the root.
 *
 * @startingPoint section="Data display" subtitle="Zoomable image viewer" viewport="700x460"
 */
export interface ImageViewerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** Image source. */
  src?: string;
  /** Accessible description (required). */
  alt: string;
  /** Minimum zoom (also the reset level). @default 1 */
  minZoom?: number;
  /** Maximum zoom. @default 8 */
  maxZoom?: number;
  /** Zoom increment for the wheel / keys / buttons. @default 0.25 */
  step?: number;
  /** Controlled zoom level. Pair with `onZoomChange` and echo it back into this prop — pan/anchor math runs
   *  against the rendered zoom, so a controlled value that never updates would drift. */
  zoom?: number;
  /** Initial zoom for the uncontrolled case. @default 1 */
  defaultZoom?: number;
  /** Fired with the new zoom level whenever it changes. */
  onZoomChange?: (zoom: number) => void;
  /** Zoom level a double-click toggles to (from `minZoom`). @default 2 */
  doubleClickZoom?: number;
  /** Built-in zoom in/out/reset controls, or your own. Pass a node, a render function receiving the zoom API,
   *  or `false` to hide them. @default the built-in controls */
  controls?: React.ReactNode | ((api: ImageViewerControlsApi) => React.ReactNode) | false;
  /** How the image fills the stage at 1×. #414: `"scale-down"`/`"none"` (like `Image`) avoid upscaling a small
   *  image; pan bounds follow the rendered image box. @default "contain" */
  fit?: "contain" | "cover" | "scale-down" | "none";
  /** #414: reactive zoom state — pair with `controls={false}` to drive your own toolbar's disabled states
   *  (the imperative `ref` gives the actions). Fires on mount and whenever the state changes. */
  onStateChange?: (state: ImageViewerState) => void;
  /** #414: border-radius token for the stage, e.g. `"md"`, `"lg"`, `"full"`. (Or set the `--twc-iv-radius` /
   *  `--twc-iv-bg` custom properties on the root.) @default "lg" */
  radius?: string;
}

/** #414: the reactive state reported by `onStateChange`. */
export interface ImageViewerState {
  zoom: number;
  canZoomIn: boolean;
  canZoomOut: boolean;
}

/** #414: `ref` exposes the zoom API ({@link ImageViewerControlsApi}) so a host toolbar can drive it. */
export declare const ImageViewer: React.ForwardRefExoticComponent<ImageViewerProps & React.RefAttributes<ImageViewerControlsApi>>;
