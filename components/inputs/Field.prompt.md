# Field

The shared form-field wrapper — the label / required asterisk / helper hint / error message chrome
that `Input` and `Select` already use internally — so you can give the same treatment to any control.

```jsx
import { Field } from "twico-ui";

<Field label="Email" hint="We'll never share it." required htmlFor="email">
  <input id="email" type="email" aria-describedby="<field-id>-desc" />
</Field>

<Field label="API token" error="That token is invalid." htmlFor="token">
  <input id="token" aria-invalid aria-describedby="<field-id>-desc" />
</Field>
```

- `error` replaces `hint` and renders in the danger color.
- Field is **layout-only**: it renders the label + your control + the hint/error, and gives the
  hint/error element a stable id `${id}-desc`. Wire your control's `aria-describedby` to that id and
  set `aria-invalid` when an error is present.
- Use it when building a custom control that should match the built-in inputs' spacing and a11y.
