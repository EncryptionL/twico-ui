import { Tag } from 'twico-ui';

export const Variants = () => (
  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
    <Tag>React</Tag>
    <Tag tone="primary" variant="soft">design-system</Tag>
    <Tag tone="success" variant="solid">passed</Tag>
    <Tag tone="neutral" variant="outline" onRemove={() => {}}>removable</Tag>
  </div>
);
