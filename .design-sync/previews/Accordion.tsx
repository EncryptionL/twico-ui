import { Accordion } from 'twico-ui';

const HelpIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3" /><path d="M12 17h.01" /></svg>
);
const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
);
const BoltIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2 3 14h9l-1 8 10-12h-9z" /></svg>
);

const faq = [
  { value: 'free', label: 'Is Twico UI free to use?', content: 'Yes — Twico UI is MIT licensed and free forever, including for commercial products.' },
  { value: 'dark', label: 'Does it support dark mode?', content: 'Out of the box. Add the .dark class to <html> and only the semantic color tokens flip.' },
  { value: 'deps', label: 'What runtime dependencies are there?', content: 'Zero. The only peers are react and react-dom (>=18); lucide-react is an optional extra.' },
  { value: 'ssr', label: 'Is it server-rendering safe?', content: 'Every component is SSR-safe and ships a "use client" banner for the Next.js App Router.' },
];

export const Faq = () => (
  <div style={{ width: 480, maxWidth: '100%' }}>
    <Accordion items={faq} defaultOpen={['free']} />
  </div>
);

export const MultipleOpen = () => (
  <div style={{ width: 480, maxWidth: '100%' }}>
    <Accordion multiple defaultOpen={['dark', 'ssr']} items={faq} />
  </div>
);

export const WithIcons = () => (
  <div style={{ width: 480, maxWidth: '100%' }}>
    <Accordion
      defaultOpen={['start']}
      items={[
        { value: 'start', label: 'Getting started', content: 'Install with npm install twico-ui and import the components you need.', icon: <HelpIcon /> },
        { value: 'security', label: 'Security', content: 'No CDNs, SSR-safe, and zero runtime dependencies by design.', icon: <ShieldIcon /> },
        { value: 'motion', label: 'Motion & polish', content: 'Smooth token-driven height animation that respects prefers-reduced-motion.', icon: <BoltIcon /> },
      ]}
    />
  </div>
);
