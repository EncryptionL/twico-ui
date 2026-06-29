import { List, Avatar, Badge } from 'twico-ui';

const FileIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /></svg>
);
const ChevronIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
);

export const TeamMembers = () => (
  <div style={{ width: 360, maxWidth: '100%' }}>
    <List
      items={[
        { leading: <Avatar name="Ada Park" size="sm" />, title: 'Ada Park', description: 'Owner', trailing: <Badge tone="success">Active</Badge> },
        { leading: <Avatar name="Liam Cho" size="sm" />, title: 'Liam Cho', description: 'Editor', trailing: <Badge tone="warning">Invited</Badge> },
        { leading: <Avatar name="Mira Sato" size="sm" />, title: 'Mira Sato', description: 'Viewer', trailing: <Badge tone="neutral">Pending</Badge> },
      ]}
    />
  </div>
);

export const FileList = () => (
  <div style={{ width: 360, maxWidth: '100%' }}>
    <List
      plain
      items={[
        { leading: <FileIcon />, title: 'Q2-revenue.pdf', description: '2.4 MB', trailing: 'Today' },
        { leading: <FileIcon />, title: 'release-notes.txt', description: '12 KB', trailing: 'Yesterday' },
        { leading: <FileIcon />, title: 'design-tokens.json', description: '48 KB', trailing: 'Mar 14' },
      ]}
    />
  </div>
);

export const SettingsLinks = () => (
  <div style={{ width: 360, maxWidth: '100%' }}>
    <List
      items={[
        { title: 'Account settings', description: 'Profile, security', href: '#account', trailing: <ChevronIcon /> },
        { title: 'Notifications', description: 'Email & push', href: '#notifications', trailing: <ChevronIcon /> },
        { title: 'Billing', description: 'Plan & invoices', href: '#billing', trailing: <ChevronIcon /> },
      ]}
    />
  </div>
);
