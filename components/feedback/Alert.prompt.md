Inline banner for contextual messages. Four tones, dismissible.

```jsx
import { Alert } from "./Alert";

<Alert tone="success" title="Saved" onClose={dismiss}>Your changes are live.</Alert>
<Alert tone="warning">Your trial ends in 3 days.</Alert>
```

Tones: info/success/warning/danger. Props: `title`, `icon`, `onClose`.
