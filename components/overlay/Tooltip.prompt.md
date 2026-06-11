Hover/focus tooltip wrapping a single trigger.

```jsx
import { Tooltip } from "./Tooltip";

<Tooltip label="Copy to clipboard" placement="top">
  <IconButton aria-label="Copy" icon={<CopyIcon />} />
</Tooltip>
```

Props: `label`, `placement` (top/bottom/left/right), `delay`.
