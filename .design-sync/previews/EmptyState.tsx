import { EmptyState, Button } from 'twico-ui';

export const Default = () => (
  <div style={{ maxWidth: 420 }}>
    <EmptyState
      title="No projects yet"
      description="Create your first project to get started — it only takes a minute."
      actions={<Button variant="solid">New project</Button>}
      border
    />
  </div>
);
