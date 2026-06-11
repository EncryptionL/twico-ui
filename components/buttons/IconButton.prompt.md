Icon-only button for toolbars, cards, and dense UI. Requires an `aria-label`.

```jsx
import { IconButton } from "./IconButton";

<IconButton aria-label="Settings" icon={<SettingsIcon />} />
<IconButton aria-label="Like" variant="soft" round icon={<HeartIcon />} />
<IconButton aria-label="Delete" variant="outline" icon={<TrashIcon />} />
```

Variants: `solid` · `soft` · `outline` · `ghost`. Sizes: `sm` · `md` · `lg`. `round` makes it circular.
