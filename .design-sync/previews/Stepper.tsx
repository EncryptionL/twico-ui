import { Stepper } from 'twico-ui';

const steps = [
  { title: 'Account', description: 'Your details' },
  { title: 'Payment', description: 'Billing info' },
  { title: 'Confirm', description: 'Review order' },
];

export const Horizontal = () => (
  <div style={{ width: 480, maxWidth: '100%' }}>
    <Stepper defaultActive={1} steps={steps} />
  </div>
);

export const Vertical = () => (
  <Stepper orientation="vertical" defaultActive={2} steps={steps} />
);

export const ErrorStep = () => (
  <div style={{ width: 480, maxWidth: '100%' }}>
    <Stepper
      defaultActive={2}
      steps={[
        { title: 'Account', description: 'Your details' },
        { title: 'Payment', description: 'Card declined', error: true },
        { title: 'Confirm', description: 'Review order' },
      ]}
    />
  </div>
);

export const Tone = () => (
  <div style={{ width: 480, maxWidth: '100%' }}>
    <Stepper tone="success" defaultActive={2} steps={steps} />
  </div>
);
