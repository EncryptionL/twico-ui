Centers content and caps its width with responsive horizontal padding — the outer wrapper for a page or section.

```jsx
import { Container } from "twico-ui";

<Container size="lg">
  <Heading level={1}>Page title</Heading>
  <Text tone="muted">Body content stays readable and centered.</Text>
</Container>
```

- `size` — `"sm" | "md" | "lg" | "xl" | "full"` or any CSS length.
- `padded` — toggle the horizontal padding; `as` to change the tag.
