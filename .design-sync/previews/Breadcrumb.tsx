import { Breadcrumb } from 'twico-ui';

const HomeIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1Z" /></svg>
);
const SlashIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m16 4-8 16" /></svg>
);

export const ProjectTrail = () => (
  <Breadcrumb
    items={[
      { label: 'Home', href: '/', icon: <HomeIcon /> },
      { label: 'Projects', href: '/projects' },
      { label: 'Twico UI', href: '/projects/twico-ui' },
      { label: 'Components' },
    ]}
  />
);

export const Collapsed = () => (
  <Breadcrumb
    maxItems={3}
    items={[
      { label: 'Home', href: '/' },
      { label: 'Projects', href: '/projects' },
      { label: 'Twico UI', href: '/projects/twico-ui' },
      { label: 'Components', href: '/projects/twico-ui/components' },
      { label: 'Breadcrumb' },
    ]}
  />
);

export const CustomSeparator = () => (
  <Breadcrumb
    separator={<SlashIcon />}
    items={[
      { label: 'Home', href: '/' },
      { label: 'Docs', href: '/docs' },
      { label: 'Getting started' },
    ]}
  />
);
