import { Box } from 'twico-ui';

export const Variants = () => (
  <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
    <Box p={4} bg="surface" border radius="lg" shadow="sm">Padded, bordered surface.</Box>
    <Box p={4} radius="lg" style={{ background: 'var(--color-primary-soft, #eef)' }}>Tinted box.</Box>
  </div>
);
