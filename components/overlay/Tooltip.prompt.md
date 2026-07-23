Hover/focus tooltip wrapping a single trigger.

```jsx
import { Tooltip } from "./Tooltip";

<Tooltip label="Copy to clipboard" placement="top">
  <IconButton aria-label="Copy" icon={<CopyIcon />} />
</Tooltip>
```

Props: `label`, `placement` (top/bottom/left/right), `delay`.

**Anchored mode** (advanced) — position one tooltip against an arbitrary element with `anchor` and
control visibility with `open`, instead of wrapping a trigger. The component then renders only the
portaled bubble (no wrapper), and the parent owns show/hide + Escape. Used by `Datatable` to drive a
single overflow tooltip for whichever truncated cell/header is hovered, rather than a Tooltip per cell:

```jsx
<Tooltip anchor={hoveredCellEl} open={!!hoveredCellEl} label={fullText} placement="top" />
```
