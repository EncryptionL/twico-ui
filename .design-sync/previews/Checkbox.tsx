import { Checkbox } from 'twico-ui';

export const Variants = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 340 }}>
    <Checkbox label="Subscribe to the newsletter" defaultChecked />
    <Checkbox label="Enable notifications" description="We'll email you about account activity." />
    <Checkbox label="Select all items" indeterminate />
    <Checkbox label="Accept the terms" tone="danger" error="You must accept to continue" />
    <Checkbox label="Unavailable option" disabled />
  </div>
);
