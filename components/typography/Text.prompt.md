Body text with token sizes and semantic color tones — use it instead of bare `<p>`/`<span>`.

```jsx
import { Text } from "twico-ui";

<Text>Default paragraph text.</Text>
<Text size="sm" tone="muted">A muted caption.</Text>
<Text as="span" weight="semibold" tone="primary">Inline emphasis.</Text>
```

- `size` — `"xs" | "sm" | "base" | "lg" | "xl"` (or any token suffix).
- `tone` — text roles `"default" | "muted" | "subtle"` plus color intents `"primary" | "success" | "warning" | "danger" | "info" | "neutral"`.
- `weight` — token suffix (e.g. `"semibold"`); `align`; `as` (default `"p"`).
