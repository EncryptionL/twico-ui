Surface container for grouped content with optional header and footer.

```jsx
import { Card } from "./Card";

<Card title="Monthly revenue" subtitle="June 2026" footer={<Button size="sm">View report</Button>}>
  Revenue grew 18% month over month.
</Card>

<Card variant="outline" interactive>Hover me — I lift.</Card>
```

Variants: `elevated` · `outline` · `soft`. Props: `title`, `subtitle`, `actions` (header slot rendered
top-right, opposite the title — e.g. a button or menu), `footer`, `padding` (none/md/lg), `interactive`.
`sx` — style escape hatch: flat CSS inline; nested keys like `"&:hover"` / `"@media …"` compile to a scoped stylesheet.
