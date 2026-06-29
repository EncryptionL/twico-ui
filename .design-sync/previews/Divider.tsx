import { Divider } from 'twico-ui';

export const Default = () => (
  <div style={{ width: 320, maxWidth: '100%' }}>
    <p style={{ margin: '0 0 10px' }}>Account settings</p>
    <Divider />
    <p style={{ margin: '10px 0' }}>Billing & invoices</p>
    <Divider />
    <p style={{ margin: '10px 0 0' }}>Danger zone</p>
  </div>
);

export const Labeled = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 18, width: 320, maxWidth: '100%' }}>
    <Divider align="start">RECENT</Divider>
    <Divider align="center">OR</Divider>
    <Divider align="end">ARCHIVED</Divider>
  </div>
);

export const Inset = () => (
  <div style={{ width: 320, maxWidth: '100%' }}>
    <p style={{ margin: '0 0 10px' }}>Inbox</p>
    <Divider inset />
    <p style={{ margin: '10px 0 0' }}>Archived threads</p>
  </div>
);

export const Vertical = () => (
  <div style={{ display: 'flex', gap: 12, alignItems: 'center', height: 22 }}>
    <span>Edit</span>
    <Divider orientation="vertical" />
    <span>Duplicate</span>
    <Divider orientation="vertical" />
    <span>Delete</span>
  </div>
);
