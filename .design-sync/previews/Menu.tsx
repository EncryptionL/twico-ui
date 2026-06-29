import { Menu, Button } from 'twico-ui';

const items = [
  { label: 'Account', heading: true },
  { label: 'Profile', shortcut: '⌘P', onClick: () => {} },
  { label: 'Settings', shortcut: '⌘,', onClick: () => {} },
  { label: 'Billing', disabled: true },
  { separator: true },
  { label: 'Sign out', danger: true, onClick: () => {} },
];

export const Default = () => (
  <Menu defaultOpen align="start" trigger={<Button variant="outline">Options</Button>} items={items} />
);
