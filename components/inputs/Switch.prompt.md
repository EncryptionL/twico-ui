Toggle switch with a springy thumb, for instant on/off settings.

```jsx
import { Switch } from "./Switch";

<Switch label="Dark mode" defaultChecked />
<Switch label="Email notifications" description="Send me product updates" />
```

Props: `label`, `description`, `size` (sm/md), plus native checkbox attrs (role=switch).

`tone` sets the color intent (primary · success · warning · danger · info · neutral, default primary).
