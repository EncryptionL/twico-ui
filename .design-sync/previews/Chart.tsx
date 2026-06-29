import { Chart } from 'twico-ui';

const revenue = [
  { label: 'Jan', value: 18 },
  { label: 'Feb', value: 22 },
  { label: 'Mar', value: 20 },
  { label: 'Apr', value: 28 },
  { label: 'May', value: 31 },
  { label: 'Jun', value: 37 },
];

const traffic = [
  { label: 'Jan', signups: 120, active: 80 },
  { label: 'Feb', signups: 180, active: 140 },
  { label: 'Mar', signups: 150, active: 120 },
  { label: 'Apr', signups: 220, active: 170 },
];

export const RevenueBars = () => (
  <div style={{ width: 460, maxWidth: '100%' }}>
    <Chart type="bar" data={revenue} valueFormat={(v) => `$${v}k`} ariaLabel="Monthly revenue" />
  </div>
);

export const RevenueLine = () => (
  <div style={{ width: 460, maxWidth: '100%' }}>
    <Chart type="line" data={revenue} valueFormat={(v) => `$${v}k`} ariaLabel="Monthly revenue trend" />
  </div>
);

export const SignupsVsActive = () => (
  <div style={{ width: 460, maxWidth: '100%' }}>
    <Chart
      type="line"
      data={traffic}
      series={['signups', 'active']}
      showLegend
      colors={['#6366f1', '#10b981']}
      ariaLabel="Signups vs active users by month"
    />
  </div>
);

export const GroupedBars = () => (
  <div style={{ width: 460, maxWidth: '100%' }}>
    <Chart
      type="bar"
      data={traffic}
      series={['signups', 'active']}
      showLegend
      ariaLabel="Signups vs active users (grouped bars)"
    />
  </div>
);
