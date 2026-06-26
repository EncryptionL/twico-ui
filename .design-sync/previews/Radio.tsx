import { Radio } from 'twico-ui';

export const Variants = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 340 }}>
    <Radio name="plan" label="Starter" description="For individuals getting started." defaultChecked />
    <Radio name="plan" label="Pro" description="For growing teams." />
    <Radio name="plan" label="Enterprise" description="Advanced controls and SSO." />
    <Radio name="plan" label="Custom" disabled />
  </div>
);
