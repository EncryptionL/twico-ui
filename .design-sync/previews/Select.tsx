import { Select } from 'twico-ui';

const PEOPLE = [
  {
    group: 'Design',
    options: [
      { value: 'ada', label: 'Ada Park', description: 'Product designer' },
      { value: 'sam', label: 'Sam Lee', description: 'Brand designer' },
    ],
  },
  {
    group: 'Engineering',
    options: [
      { value: 'jo', label: 'Jo Kim', description: 'Frontend' },
      { value: 'ravi', label: 'Ravi Shah', description: 'Backend' },
    ],
  },
];

const COUNTRIES = ['Australia', 'Brazil', 'Canada', 'Denmark', 'Egypt', 'France', 'Germany', 'India', 'Japan'];

export const Assignee = () => (
  <div style={{ width: 340, maxWidth: '100%' }}>
    <Select
      label="Assignee"
      placeholder="Pick a teammate"
      hint="Choose who owns this task"
      defaultValue="jo"
      options={PEOPLE}
      clearable
    />
  </div>
);

export const Searchable = () => (
  <div style={{ width: 340, maxWidth: '100%' }}>
    <Select
      label="Country"
      required
      searchable
      searchPlaceholder="Search countries…"
      placeholder="Select a country"
      defaultValue="France"
      options={COUNTRIES}
    />
  </div>
);

export const Sizes = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 340, maxWidth: '100%' }}>
    <Select size="sm" defaultValue="Apple" options={['Apple', 'Banana', 'Cherry']} />
    <Select size="md" defaultValue="Banana" options={['Apple', 'Banana', 'Cherry']} />
    <Select size="lg" defaultValue="Cherry" options={['Apple', 'Banana', 'Cherry']} />
  </div>
);

export const ErrorState = () => (
  <div style={{ width: 340, maxWidth: '100%' }}>
    <Select label="Plan" required error="Please choose a plan" placeholder="Select a plan" options={['Free', 'Pro', 'Team', 'Enterprise']} />
  </div>
);

export const Disabled = () => (
  <div style={{ width: 340, maxWidth: '100%' }}>
    <Select label="Workspace" disabled defaultValue="Apple" options={['Apple', 'Banana', 'Cherry']} />
  </div>
);
