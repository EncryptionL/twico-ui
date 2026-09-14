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
  src, alt, fit, radius, aspectRatio, fallback, loading = "lazy", className = "", style, onError, width, height, ...rest
}, ref) {
  const __twcStyles = useScopedStyles("twc-image-styles", IMAGE_CSS);
  const [failed, setFailed] = React.useState(false);
  const shownSrc = failed && fallback ? fallback : src;
  const s = {
    objectFit: fit,
    borderRadius: radius ? `var(--radius-${radius})` : undefined,
    aspectRatio: aspectRatio,
    // #378: only when `fit` is set, also emit explicit width/height as inline style — that's the sole case
    // where the `[data-fit] { width/height: 100% }` rule overrides the width/height ATTRIBUTES (a
    // presentational attr loses to a real CSS rule), silently sizing `<Image width height fit>` to the
    // container/intrinsic size. Inline style beats that rule so the props mean what they say (object-fit
    // still crops within the box), placed before `...style` so a caller's own `style` still wins. Gated on
    // `fit` so the no-fit path stays attribute-only — a consumer's own CSS/className can still override it.
    ...(fit && width != null ? { width } : null),
    ...(fit && height != null ? { height } : null),
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
        width={width}
        height={height}
        style={s}
        onError={(e) => { onError?.(e); if (fallback && !failed) setFailed(true); }}
        {...rest}
      />
    </>
  );
});
Image.displayName = "Image";
