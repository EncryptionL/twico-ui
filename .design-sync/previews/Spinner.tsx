import { Spinner } from 'twico-ui';

export const Sizes = () => (
  <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
    <Spinner size="sm" />
    <Spinner size="md" />
    <Spinner size="lg" />
    <Spinner size="xl" />
  </div>
);

export const Colors = () => (
  <div style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
    <Spinner size="lg" color="primary" />
    <Spinner size="lg" color="success" />
    <Spinner size="lg" color="warning" />
    <Spinner size="lg" color="danger" />
    <Spinner size="lg" color="info" />
    <Spinner size="lg" color="neutral" />
  </div>
);

export const OnColor = () => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 88,
      height: 88,
      borderRadius: 'var(--radius-lg, 12px)',
      background: 'var(--color-primary, #6366f1)',
    }}
  >
    <Spinner size="lg" color="white" label="Loading results" />
  </div>
);
