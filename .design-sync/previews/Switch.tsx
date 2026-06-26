import { Switch } from 'twico-ui';

export const Variants = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 340 }}>
    <Switch label="Wi-Fi" defaultChecked />
    <Switch label="Bluetooth" description="Discoverable as Studio." />
    <Switch label="Airplane mode" tone="success" defaultChecked />
    <Switch label="Do not disturb" disabled />
  </div>
);
