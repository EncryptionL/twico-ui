import { Input } from 'twico-ui';

export const Default = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 340, maxWidth: '100%' }}>
    <Input label="Email" type="email" placeholder="you@twico.dev" required hint="We'll never share your email." />
    <Input label="Password" type="password" placeholder="••••••••" defaultValue="hunter2" />
    <Input label="Amount" size="sm" rightIcon={<span>USD</span>} placeholder="0.00" />
  </div>
);

export const States = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 340, maxWidth: '100%' }}>
    <Input label="Workspace" defaultValue="acme-inc" hint="Lowercase letters and dashes only." />
    <Input label="Work email" defaultValue="not-an-email" error="Enter a valid email address." />
    <Input label="API key" defaultValue="sk_live_8f2a…" disabled />
  </div>
);

export const Sizes = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 340, maxWidth: '100%' }}>
    <Input size="sm" placeholder="Small" defaultValue="Small" />
    <Input size="md" placeholder="Medium" defaultValue="Medium" />
    <Input size="lg" placeholder="Large" defaultValue="Large" />
  </div>
);
