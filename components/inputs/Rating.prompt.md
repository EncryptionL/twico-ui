Star rating — interactive or read-only.

```jsx
import { Rating } from "./Rating";

const [r, setR] = React.useState(0);
<Rating value={r} onChange={setR} />
<Rating value={4} readOnly showValue />     {/* display */}
<Rating defaultValue={3} size="lg" count={5} />
```

Props: `value`/`defaultValue`, `count`, `size` (sm/md/lg), `color`, `readOnly`, `showValue`, `onChange`.
Click the current star again to clear to 0.
