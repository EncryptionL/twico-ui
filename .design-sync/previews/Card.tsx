import { Card, Button, Text } from 'twico-ui';

export const Variants = () => (
  <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-start' }}>
    <Card title="Monthly revenue" subtitle="June 2026" footer={<Button size="sm">View report</Button>} style={{ maxWidth: 260 }}>
      <Text>Revenue grew 18% month over month, led by new team plans.</Text>
    </Card>
    <Card variant="outline" interactive style={{ maxWidth: 220 }}>
      <Text>Hover me — I lift on interaction.</Text>
    </Card>
  </div>
);
