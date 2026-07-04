User avatar with image, initials fallback, and presence dot.

```jsx
import { Avatar } from "./Avatar";

<Avatar src="/u/jane.jpg" name="Jane Doe" />
<Avatar name="Sam Lee" status="online" />
<Avatar name="Twico" size="lg" square ring />
```

Props: `src`, `name`, `size` (xs–xl), `square`, `ring`, `status` (online/busy/away/offline),
`statusLabel`/`statusLabels`. The presence dot is folded into the accessible name (e.g.
"Jane Doe, Online") since `role="img"` hides descendants — so it's not color-only.
