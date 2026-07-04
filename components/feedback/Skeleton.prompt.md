Shimmering placeholder for loading states.

```jsx
import { Skeleton } from "./Skeleton";

<Skeleton variant="circle" width={40} height={40} />
<Skeleton variant="text" lines={3} />
<Skeleton variant="rect" height={120} />
```

Props: `variant` (text/circle/rect), `width`, `height`, `lines`, `label`. Placeholders are
`aria-hidden` (decorative) by default; pass `label` (e.g. "Loading…") to announce loading via a
`role="status"` live region instead.
