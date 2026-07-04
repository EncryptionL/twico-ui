Inline banner for contextual messages. Six tones × three fills, dismissible.

```jsx
import { Alert } from "./Alert";

<Alert tone="success" title="Saved" onClose={dismiss}>Your changes are live.</Alert>
<Alert tone="warning">Your trial ends in 3 days.</Alert>
<Alert tone="danger" variant="solid" title="Payment failed">Update your card.</Alert>
```

`tone` = color (`info` · `success` · `warning` · `danger` · `primary` · `neutral`, default `info`);
`variant` = fill (`soft` · `solid` · `outline`, default `soft`). Props: `title`, `icon`, `onClose`,
`closeLabel` (dismiss-button label, default "Dismiss"), `live`. The live-region role is tone-aware by
default — danger/warning use `role="alert"` (assertive), success/info `role="status"` (polite), and
primary/neutral are silent static banners; set `live="assertive" | "polite" | "off"` to override.
