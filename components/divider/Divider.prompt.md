Thin separator rule — horizontal or vertical, optionally labeled.

```jsx
import { Divider } from "./Divider";

<Divider />
<Divider>OR</Divider>                     {/* labeled */}
<span>A</span><Divider orientation="vertical" /><span>B</span>
```

Props: `orientation` (horizontal/vertical), `inset`, `align` (left/center/right), `children` (label).
