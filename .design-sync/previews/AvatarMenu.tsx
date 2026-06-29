import { AvatarMenu } from 'twico-ui';

const UserIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>
);
const SettingsIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" /></svg>
);
const LogOutIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="m16 17 5-5-5-5M21 12H9" /></svg>
);

const accountItems = [
  { label: 'Profile', icon: <UserIcon />, onClick: () => {} },
  { label: 'Settings', icon: <SettingsIcon />, shortcut: '⌘,', onClick: () => {} },
  { separator: true },
  { label: 'Sign out', icon: <LogOutIcon />, danger: true, onClick: () => {} },
];

export const WithNameAndEmail = () => (
  <AvatarMenu name="Ada Park" email="ada@twico.dev" status="online" showName items={accountItems} />
);

export const AvatarOnly = () => (
  <AvatarMenu name="Ada Park" status="online" items={accountItems} />
);

export const PresenceStatuses = () => (
  <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
    <AvatarMenu name="Ada Park" status="online" items={accountItems} />
    <AvatarMenu name="Bo Lin" status="busy" items={accountItems} />
    <AvatarMenu name="Cy Reed" status="away" items={accountItems} />
    <AvatarMenu name="Di Vale" status="offline" items={accountItems} />
  </div>
);

export const Sizes = () => (
  <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
    <AvatarMenu name="Ada Park" size="sm" items={accountItems} />
    <AvatarMenu name="Ada Park" size="md" items={accountItems} />
    <AvatarMenu name="Ada Park" size="lg" items={accountItems} />
    <AvatarMenu name="Ada Park" size="xl" items={accountItems} />
  </div>
);
