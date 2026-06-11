Zero-data / empty placeholder with an optional call to action.

```jsx
import { EmptyState } from "./EmptyState";

<EmptyState
  icon={<InboxIcon />}
  title="No messages yet"
  description="When someone sends you a message, it’ll show up here."
  actions={<Button>Compose</Button>}
/>
```

Props: `icon`, `title`, `description`, `actions`, `bordered`.
