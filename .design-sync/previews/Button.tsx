import { Button } from 'twico-ui';

export const Variants = () => (
  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
    <Button variant="solid">Save changes</Button>
    <Button variant="soft">Add item</Button>
    <Button variant="outline">Cancel</Button>
    <Button variant="ghost">Skip</Button>
    <Button tone="danger" variant="solid">Delete</Button>
    <Button loading>Saving…</Button>
  </div>
);

export const Sizes = () => (
  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
    <Button size="sm">Small</Button>
    <Button size="md">Medium</Button>
    <Button size="lg">Large</Button>
  </div>
);
