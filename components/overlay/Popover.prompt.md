Click-triggered floating panel for rich content, anchored to its trigger (portaled, auto-flipping).

```jsx
import { Popover } from "./Popover";

<Popover trigger={<Button variant="outline">Share</Button>} title="Share link" placement="bottom">
  <Input defaultValue="https://twico.dev/x" />
  <Button fullWidth>Copy link</Button>
</Popover>
```

Props: `trigger`, `title`, `placement` (top/bottom/left/right), `align` (start/center/end), `width`.
Closes on outside-click / Esc. For plain text hints use `Tooltip` instead.
