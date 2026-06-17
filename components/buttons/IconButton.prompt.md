Icon-only button for toolbars, cards, and dense UI. Requires an `aria-label`.

```jsx
import { IconButton } from "./IconButton";

<IconButton aria-label="Settings" icon={<SettingsIcon />} />
<IconButton aria-label="Like" variant="soft" round icon={<HeartIcon />} />
<IconButton aria-label="Delete" tone="danger" icon={<TrashIcon />} />
```

Same two axes as Button: `variant` = fill (`solid` · `soft` · `outline` · `ghost`, default `ghost`);
`tone` = color (`primary` · `danger`, default `primary`). A destructive icon button is `tone="danger"`
with any variant. Sizes: `sm` · `md` · `lg`. `round` makes it circular.
