import { IconButton } from 'twico-ui';

export const Variants = () => (
  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
    <IconButton aria-label="Add" variant="solid" icon={<span style={{ fontSize: 18, lineHeight: 1 }}>+</span>} />
    <IconButton aria-label="Settings" variant="soft" icon={<span style={{ fontSize: 16, lineHeight: 1 }}>⚙</span>} />
    <IconButton aria-label="Close" variant="outline" icon={<span style={{ fontSize: 15, lineHeight: 1 }}>✕</span>} />
    <IconButton aria-label="Delete" tone="danger" variant="ghost" icon={<span style={{ fontSize: 16, lineHeight: 1 }}>🗑</span>} />
  </div>
);
