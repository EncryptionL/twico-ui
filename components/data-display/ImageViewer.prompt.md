A zoomable, pannable image viewer on a fixed stage — for inspecting a product photo, a scanned document, or a technical drawing.

```jsx
import { ImageViewer } from "./ImageViewer";

<ImageViewer src="/plans/drawing.png" alt="Assembly drawing" style={{ height: 420 }} />

// controlled zoom + custom max
<ImageViewer src={src} alt="Photo" zoom={zoom} onZoomChange={setZoom} maxZoom={12} style={{ height: 360 }} />

// hide the built-in controls, or render your own
<ImageViewer src={src} alt="Map" controls={false} style={{ height: 300 }} />
```

Wheel and pinch zoom about the pointer; drag pans when zoomed (clamped to the stage); `+` / `-` / `0`
keys and double-click toggle zoom. The wheel listener is non-passive, so the page/dialog behind never
scrolls. Size the stage via `style`/`className` on the root. `controls` accepts a node, a render function
`({ zoom, zoomIn, zoomOut, reset, canZoomIn, canZoomOut }) => …`, or `false`. Respects `prefers-reduced-motion`.
For a plain, non-interactive image use `Image`.
