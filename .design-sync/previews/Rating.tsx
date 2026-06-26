import { Rating } from 'twico-ui';

export const Variants = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
    <Rating defaultValue={4} />
    <Rating defaultValue={3} showValue />
    <Rating value={5} readOnly tone="warning" />
    <Rating defaultValue={2} size="lg" />
  </div>
);
