import { Text } from 'twico-ui';

export const Variants = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 440 }}>
    <Text>Default body paragraph text set in Plus Jakarta Sans.</Text>
    <Text size="sm" tone="muted">A muted caption sitting beneath the body copy.</Text>
    <Text weight="semibold" tone="primary">Inline emphasis in the primary tone.</Text>
  </div>
);
