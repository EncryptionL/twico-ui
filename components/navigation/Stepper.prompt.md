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

`tone` sets the color intent (primary · success · warning · danger · info · neutral, default primary).
