Action button with a click ripple, used for primary and secondary actions throughout the UI.

```jsx
import { Button } from "./Button";

<Button variant="solid" size="md" onClick={save}>Save changes</Button>
<Button variant="soft" leftIcon={<PlusIcon />}>Add item</Button>
<Button variant="outline">Cancel</Button>
<Button variant="ghost">Skip</Button>
<Button tone="danger" loading>Deleting…</Button>
```

Two orthogonal axes: `variant` = fill style — `solid` (primary CTA), `soft` (tinted), `outline`,
`ghost`; `tone` = color — `primary` (default) or `danger`. A destructive button is `tone="danger"`
with any variant. Sizes: `sm` · `md` · `lg`. Props: `leftIcon`, `rightIcon`, `loading`, `fullWidth`,
`as="a"`.
