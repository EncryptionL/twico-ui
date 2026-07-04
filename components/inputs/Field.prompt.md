# Field

The shared form-field wrapper — the label / required asterisk / helper hint / error message chrome
that `Input` and `Select` already use internally — so you can give the same treatment to any control.

```jsx
import { Field } from "twico-ui";

<Field label="Email" hint="We'll never share it." required htmlFor="email">
  <input id="email" type="email" />
</Field>

<Field label="API token" error="That token is invalid." htmlFor="token">
  <input id="token" />
</Field>
```

- `error` replaces `hint` and renders in the danger color.
- Field gives the hint/error element a stable id `${id}-desc`. When `children` is a **single element**,
  Field auto-wires it — `aria-describedby` (merged with any the child already sets) points at that id and
  `aria-invalid` is set under `error` — so you no longer hand-write those. Multiple/fragment children keep
  manual wiring.
- Use it when building a custom control that should match the built-in inputs' spacing and a11y.
