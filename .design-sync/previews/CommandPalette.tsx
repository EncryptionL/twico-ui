import { CommandPalette } from 'twico-ui';

const HomeIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V21h14V9.5" /></svg>
);
const SettingsIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" /></svg>
);
const PlusIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
);
const UsersIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="8" r="3" /><path d="M3 20a6 6 0 0 1 12 0" /><path d="M16 5.5a3 3 0 0 1 0 5M21 20a6 6 0 0 0-4-5.6" /></svg>
);
const SearchIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
);

const commands = [
  { group: 'Navigation', label: 'Go to Dashboard', description: 'Overview and stats', icon: <HomeIcon />, shortcut: 'G D', onSelect: () => {} },
  { group: 'Navigation', label: 'Go to Settings', icon: <SettingsIcon />, shortcut: 'G S', onSelect: () => {} },
  { group: 'Actions', label: 'New project', description: 'Create a fresh workspace', icon: <PlusIcon />, keywords: 'create add', shortcut: 'N', onSelect: () => {} },
  { group: 'Actions', label: 'Invite teammate', icon: <UsersIcon />, keywords: 'user member people', onSelect: () => {} },
  { group: 'Actions', label: 'Search docs', icon: <SearchIcon />, keywords: 'help reference', shortcut: '/', onSelect: () => {} },
];

export const Open = () => (
  <CommandPalette
    open
    onClose={() => {}}
    commands={commands}
    placeholder="Type a command or search…"
    emptyText="No results found"
  />
);
