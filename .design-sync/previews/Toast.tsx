import { Toast } from 'twico-ui';

export const Variants = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 380 }}>
    <Toast tone="info" title="Update available">Refresh to get the latest.</Toast>
    <Toast tone="success" title="Saved">Your profile was updated.</Toast>
    <Toast tone="warning" title="Heads up">Your trial ends in 3 days.</Toast>
    <Toast tone="danger" title="Upload failed">The file was too large.</Toast>
  </div>
);
