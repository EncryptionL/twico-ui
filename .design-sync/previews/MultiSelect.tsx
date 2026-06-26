import { MultiSelect } from 'twico-ui';

const skills = [
  { value: 'ts', label: 'TypeScript' },
  { value: 'react', label: 'React' },
  { value: 'css', label: 'CSS' },
  { value: 'node', label: 'Node.js' },
  { value: 'figma', label: 'Figma' },
];

export const Variants = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 360 }}>
    <MultiSelect label="Skills" placeholder="Add skills…" options={skills} defaultValue={['ts', 'react']} clearable />
    <MultiSelect label="Skills" placeholder="Select skills…" options={skills} />
  </div>
);
