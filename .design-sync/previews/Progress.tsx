import { Progress } from 'twico-ui';

export const Default = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 320, maxWidth: '100%' }}>
    <Progress value={25} />
    <Progress value={64} />
    <Progress value={100} tone="success" />
  </div>
);

export const Tones = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 320, maxWidth: '100%' }}>
    <Progress value={64} tone="primary" />
    <Progress value={90} tone="success" />
    <Progress value={45} tone="warning" />
    <Progress value={25} tone="danger" />
    <Progress value={50} tone="info" />
  </div>
);

export const Sizes = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 320, maxWidth: '100%' }}>
    <Progress value={60} size="sm" />
    <Progress value={60} size="md" />
    <Progress value={60} size="lg" />
  </div>
);

export const WithLabel = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: 320, maxWidth: '100%' }}>
    <Progress value={72} showLabel />
    <Progress value={3} max={5} showLabel tone="success" />
  </div>
);

export const Indeterminate = () => (
  <div style={{ width: 320, maxWidth: '100%' }}>
    <Progress indeterminate tone="info" />
  </div>
);
