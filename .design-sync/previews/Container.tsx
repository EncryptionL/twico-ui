import { Container, Heading, Text } from 'twico-ui';

export const Default = () => (
  <Container size="sm" style={{ border: '1px dashed var(--color-border)', borderRadius: 12, paddingBlock: 16 }}>
    <Heading level={2}>Page title</Heading>
    <Text tone="muted">Body content stays readable and centered within a capped width.</Text>
  </Container>
);
