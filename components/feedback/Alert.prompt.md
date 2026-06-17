Inline banner for contextual messages. Six tones × three fills, dismissible.

```jsx
import { Alert } from "./Alert";

<Alert tone="success" title="Saved" onClose={dismiss}>Your changes are live.</Alert>
<Alert tone="warning">Your trial ends in 3 days.</Alert>
<Alert tone="danger" variant="solid" title="Payment failed">Update your card.</Alert>
```

`tone` = color (`info` · `success` · `warning` · `danger` · `primary` · `neutral`, default `info`);
`variant` = fill (`soft` · `solid` · `outline`, default `soft`). Props: `title`, `icon`, `onClose`.
