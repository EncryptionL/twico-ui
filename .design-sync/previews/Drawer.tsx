import { Drawer, Button } from 'twico-ui';

export const Default = () => (
  <Drawer open title="Filters" footer={<Button variant="solid">Apply filters</Button>}>
    Refine the results by status, owner, and date range.
  </Drawer>
);
