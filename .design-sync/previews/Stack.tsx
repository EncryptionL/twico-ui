import { Stack, Button } from 'twico-ui';

export const Variants = () => (
  <Stack direction="column" gap={4}>
    <Stack direction="row" gap={3} align="center">
      <Button>Save</Button>
      <Button variant="ghost">Cancel</Button>
    </Stack>
    <Stack direction="row" gap={2} wrap>
      <Button size="sm" variant="soft">One</Button>
      <Button size="sm" variant="soft">Two</Button>
      <Button size="sm" variant="soft">Three</Button>
    </Stack>
  </Stack>
);
