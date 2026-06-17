Labeled text input with validation, hint text, and inline icons.

```jsx
import { Input } from "./Input";

<Input label="Email" type="email" placeholder="you@twico.dev" required />
<Input label="Search" leftIcon={<SearchIcon />} placeholder="Search…" />
<Input label="Amount" rightIcon={<span>USD</span>} placeholder="0.00" />
<Input label="Password" type="password" placeholder="••••••••" />  {/* built-in reveal/hide eye */}
```

Props: `label`, `hint`, `error`, `required`, `size` (sm/md/lg), `tone` (primary/success/warning/danger/info/neutral), `leftIcon` (prefix), `rightIcon` (suffix), plus all native input attrs.
`tone` recolors the focus/open accent (border + ring) to any of the 6 design-system intents; the default `"primary"` is visually identical to before.
`type="password"` automatically gets a reveal/hide eye toggle as the suffix; pass `rightIcon` to override it.
