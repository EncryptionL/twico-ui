Multi-step progress indicator (wizard/checkout), horizontal or vertical.

```jsx
import { Stepper } from "./Stepper";

<Stepper active={1} steps={[
  { title: "Account", description: "Your details" },
  { title: "Payment", description: "Billing info" },
  { title: "Confirm" },
]} />

<Stepper orientation="vertical" active={2} clickable onStepClick={setActive} steps={steps} />
```

Steps: `{ title, description?, icon?, error? }`. Props: `active`, `orientation`, `clickable`, `onStepClick`.
The stepper is a `role="group"` labeled "Progress"; each step announces "Step N of M" + its status
(completed/current/upcoming/error) to screen readers, and errored steps are `aria-invalid`.

`tone` sets the color intent (primary · success · warning · danger · info · neutral, default primary).
