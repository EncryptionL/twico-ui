import { Dialog, Button } from 'twico-ui';

export const Default = () => (
  <Dialog
    open
    title="Delete project"
    footer={
      <>
        <Button variant="ghost">Cancel</Button>
        <Button tone="danger" variant="solid">Delete</Button>
      </>
    }
  >
    This action cannot be undone. This will permanently delete the project and all of its data.
  </Dialog>
);
