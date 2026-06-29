import { DatePicker } from 'twico-ui';

export const Selected = () => (
  <div style={{ width: 340, maxWidth: '100%' }}>
    <DatePicker label="Appointment" defaultValue={new Date(2026, 6, 14)} clearable />
  </div>
);

export const Departure = () => (
  <div style={{ width: 340, maxWidth: '100%' }}>
    <DatePicker
      label="Departure"
      required
      hint="Pick a day within the next six months."
      defaultValue={new Date(2026, 6, 1)}
      weekStartsOn={1}
      tone="info"
      clearable
    />
  </div>
);

export const Empty = () => (
  <div style={{ width: 340, maxWidth: '100%' }}>
    <DatePicker label="Start date" placeholder="Pick a day" />
  </div>
);

export const Disabled = () => (
  <div style={{ width: 340, maxWidth: '100%' }}>
    <DatePicker label="Locked date" defaultValue={new Date(2025, 0, 1)} disabled />
  </div>
);
