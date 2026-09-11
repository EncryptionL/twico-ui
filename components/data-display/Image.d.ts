import * as React from "react";

export interface ImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, "alt"> {
  /** Image source URL. */
  src?: string;
  /** Alternative text (required for accessibility; pass "" for decorative images). */
  alt: string;
  /** object-fit value. When set, the image fills its container by default (`width`/`height: 100%`); pass an
   *  explicit `width`/`height` (or size the container / `style`) to give it a fixed box that `fit` crops within
   *  — an explicit `width`/`height` now wins over the fill (#378). */
  fit?: "cover" | "contain" | "fill" | "none" | "scale-down";
  /** Border radius token (e.g. "md", "lg", "full"). */
  radius?: string;
  /** CSS aspect-ratio (e.g. "16/9"). */
  aspectRatio?: string;
  /** Source swapped in if the image fails to load. */
  fallback?: string;
  /** @default "lazy" */
  loading?: "lazy" | "eager";
}

export declare const Image: React.ForwardRefExoticComponent<ImageProps & React.RefAttributes<HTMLImageElement>>;
