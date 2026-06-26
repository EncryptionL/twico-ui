import { Combobox } from 'twico-ui';

const frameworks = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'svelte', label: 'Svelte' },
  { value: 'solid', label: 'Solid' },
  { value: 'angular', label: 'Angular' },
];

export const Variants = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 320 }}>
    <Combobox label="Framework" placeholder="Search frameworks…" options={frameworks} defaultValue="react" clearable />
    <Combobox label="Framework" placeholder="Pick one" options={frameworks} required />
  </div>
);
