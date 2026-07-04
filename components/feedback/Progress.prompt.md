Linear progress bar — determinate or indeterminate.

```jsx
import { Progress } from "./Progress";

<Progress value={64} showLabel />
<Progress value={90} tone="success" />
<Progress indeterminate />
```

Props: `value`, `max`, `tone`, `size`, `indeterminate`, `showLabel`, `label` (visible + names the
progressbar). Give the bar an accessible name via `label` or a forwarded `aria-label`/`aria-labelledby`
(forwarded onto the inner `role="progressbar"` track).
