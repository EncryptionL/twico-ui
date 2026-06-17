Checkbox with an animated checkmark, optional description, and indeterminate state.

```jsx
import { Checkbox } from "./Checkbox";

<Checkbox label="Subscribe to updates" defaultChecked />
<Checkbox label="Select all" indeterminate />
<Checkbox label="Notifications" description="Get email alerts for new activity" />
```

`tone` sets the color intent (primary · success · warning · danger · info · neutral, default primary).

Props: `label`, `description`, `indeterminate`, `size` (sm/md), `tone`, plus native checkbox attrs.
