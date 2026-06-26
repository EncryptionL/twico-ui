import { Alert } from 'twico-ui';

export const Variants = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 460 }}>
    <Alert tone="info" title="Heads up">A new version of the dashboard is available.</Alert>
    <Alert tone="success" variant="solid" title="Saved">Your changes have been published.</Alert>
    <Alert tone="warning" title="Storage almost full">You have used 92% of your quota.</Alert>
    <Alert tone="danger" variant="outline" title="Payment failed">Update your billing details to continue.</Alert>
  </div>
);
