import { DateRangePicker } from 'twico-ui';

export const TripDates = () => (
  <div style={{ width: 340, maxWidth: '100%' }}>
    <DateRangePicker
      label="Trip dates"
      defaultValue={{ start: new Date(2026, 5, 10), end: new Date(2026, 5, 17) }}
    />
  </div>
);

export const ReportingPeriod = () => (
  <div style={{ width: 340, maxWidth: '100%' }}>
    <DateRangePicker
      label="Reporting period"
      required
      hint="Pick a start day, then an end day."
      defaultValue={{ start: new Date(2026, 5, 1), end: new Date(2026, 5, 14) }}
      weekStartsOn={1}
      tone="info"
      presets
    />
  </div>
);

export const Empty = () => (
  <div style={{ width: 340, maxWidth: '100%' }}>
    <DateRangePicker label="Custom window" placeholder="Pick a range" presets={false} />
  </div>
);
