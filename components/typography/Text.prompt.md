Body text with token sizes and semantic color tones — use it instead of bare `<p>`/`<span>`.

```jsx
import { Text } from "twico-ui";

<Text>Default paragraph text.</Text>
<Text size="sm" tone="muted">A muted caption.</Text>
<Text as="span" weight="semibold" tone="primary">Inline emphasis.</Text>
```

- `size` — `"xs" | "sm" | "base" | "lg" | "xl"` (or any token suffix).
- `tone` — text roles `"default" | "muted" | "subtle"`, the color intents (`primary`/`success`/…),
  or `"inherit"` to adopt the surrounding color (e.g. inside a solid Button/Alert).
- `truncate` — single-line ellipsis (shrinks in flex); `lineClamp={n}` — multi-line ellipsis.
- `weight` — token suffix (e.g. `"semibold"`); `align`; `as` (default `"p"`, accepts a component).
