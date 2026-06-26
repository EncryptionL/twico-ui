import { Badge } from 'twico-ui';

export const Variants = () => (
  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
    <Badge tone="success" dot>Active</Badge>
    <Badge tone="warning" variant="solid">Pending</Badge>
    <Badge tone="danger" variant="solid">Error</Badge>
    <Badge tone="primary" variant="soft">New</Badge>
    <Badge tone="neutral" variant="outline">Draft</Badge>
  </div>
);
