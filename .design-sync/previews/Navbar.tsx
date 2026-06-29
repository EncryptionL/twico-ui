import { Navbar, Button } from 'twico-ui';

const HomeIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V21h14V9.5" /></svg>
);
const FolderIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" /></svg>
);
const UsersIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="8" r="3" /><path d="M3 20a6 6 0 0 1 12 0" /><path d="M16 5.5a3 3 0 0 1 0 5M21 20a6 6 0 0 0-4-5.6" /></svg>
);

export const BrandLinksActions = () => (
  <Navbar
    sticky={false}
    brand={<>Twico <span style={{ color: 'var(--color-primary)' }}>UI</span></>}
    links={[
      { label: 'Dashboard', active: true },
      { label: 'Projects' },
      { label: 'Team' },
    ]}
    actions={<Button size="sm">Sign in</Button>}
  />
);

export const WithIcons = () => (
  <Navbar
    sticky={false}
    brand="Acme"
    links={[
      { label: 'Home', icon: <HomeIcon />, active: true },
      { label: 'Files', icon: <FolderIcon /> },
      { label: 'Team', icon: <UsersIcon /> },
    ]}
    actions={<Button size="sm" variant="outline">GitHub</Button>}
  />
);
