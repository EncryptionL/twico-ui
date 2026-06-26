import { Popover, Button } from 'twico-ui';

export const Default = () => (
  <div style={{ padding: 24, minHeight: 220 }}>
    <Popover open title="Notifications" trigger={<Button variant="soft">Open popover</Button>}>
      You have 3 unread messages and 2 pending invites.
    </Popover>
  </div>
);
