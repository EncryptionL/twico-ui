Radio button. Group several with a shared `name`.

```jsx
import { Radio } from "./Radio";

<Radio name="plan" value="free" label="Free" defaultChecked />
<Radio name="plan" value="pro" label="Pro" description="$12 / month" />
```

Props: `label`, `description`, `size` (sm/md), plus native radio attrs.
