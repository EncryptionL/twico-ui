import { Heading } from 'twico-ui';

export const Variants = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
    <Heading level={1}>Dashboard</Heading>
    <Heading level={2}>Recent activity</Heading>
    <Heading level={3}>Team members</Heading>
    <Heading level={4}>Billing</Heading>
  </div>
);
