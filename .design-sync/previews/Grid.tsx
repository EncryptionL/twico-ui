import { Grid, Card, Text } from 'twico-ui';

export const Variants = () => (
  <Grid minChildWidth={160} gap={4} style={{ maxWidth: 560 }}>
    <Card><Text>One</Text></Card>
    <Card><Text>Two</Text></Card>
    <Card><Text>Three</Text></Card>
    <Card><Text>Four</Text></Card>
  </Grid>
);
