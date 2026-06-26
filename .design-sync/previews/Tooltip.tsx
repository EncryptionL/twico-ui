import { Tooltip, Button } from 'twico-ui';

export const Default = () => (
  <div style={{ padding: 48 }}>
    <Tooltip label="Copy to clipboard" placement="bottom">
      <Button variant="soft">Hover me</Button>
    </Tooltip>
  </div>
);
