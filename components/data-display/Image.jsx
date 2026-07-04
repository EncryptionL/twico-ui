import React from "react";
import { useScopedStyles } from "../_styles.js";

const IMAGE_CSS = `
.twc-image { display: block; max-width: 100%; }
.twc-image[data-fit] { width: 100%; height: 100%; }
`;

/**
 * An `<img>` with typed `src`/`alt` (alt required), lazy loading by default, `fit`
 * (object-fit), `radius`, and an optional `fallback` swapped in on error.
 */
export const Image = React.forwardRef(function Image({
  src, alt, fit, radius, aspectRatio, fallback, loading = "lazy", className = "", style, onError, ...rest
}, ref) {
  const __twcStyles = useScopedStyles("twc-image-styles", IMAGE_CSS);
  const [failed, setFailed] = React.useState(false);
  const shownSrc = failed && fallback ? fallback : src;
  const s = {
    objectFit: fit,
    borderRadius: radius ? `var(--radius-${radius})` : undefined,
    aspectRatio: aspectRatio,
    ...style,
  };
  return (
    <>
      {__twcStyles}
      <img
        ref={ref}
        src={shownSrc}
        alt={alt}
        loading={loading}
        className={`twc-image ${className}`.trim()}
        data-fit={fit || undefined}
        style={s}
        onError={(e) => { onError?.(e); if (fallback && !failed) setFailed(true); }}
        {...rest}
      />
    </>
  );
});
Image.displayName = "Image";
