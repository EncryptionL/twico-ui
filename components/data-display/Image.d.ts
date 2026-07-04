import * as React from "react";

export interface ImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, "alt"> {
  /** Image source URL. */
  src?: string;
  /** Alternative text (required for accessibility; pass "" for decorative images). */
  alt: string;
  /** object-fit value. */
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
