KPI / metric card with a trend delta.

```jsx
import { Stat } from "./Stat";

<Stat label="Revenue" value="$48,200" delta="+12.5%" helpText="vs last month"
  icon={<DollarIcon />} />
<Stat label="Churn" value="2.1%" delta="-0.4%" deltaDirection="up" helpText="improved" />
```

Props: `label`, `value`, `icon`, `delta`, `deltaDirection` (up/down/flat), `helpText`, `plain`.
Direction is inferred from a leading "-" unless `deltaDirection` is set.
