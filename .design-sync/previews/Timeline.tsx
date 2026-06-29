import { Timeline } from 'twico-ui';

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
);
const DotIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor"><circle cx="12" cy="12" r="5" /></svg>
);
const TruckIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 17h4V5H2v12h2m12 0h2.5a1.5 1.5 0 0 0 1.5-1.5V11l-3-3h-4v9h1m-9 0a2 2 0 1 0 4 0 2 2 0 0 0-4 0Zm12 0a2 2 0 1 0 4 0 2 2 0 0 0-4 0Z" /></svg>
);

export const OrderTracking = () => (
  <div style={{ width: 420, maxWidth: '100%' }}>
    <Timeline
      items={[
        { title: 'Order placed', time: '9:41 AM', description: 'We received your order and sent a confirmation email.', tone: 'primary' },
        { title: 'Shipped', time: '2:10 PM', description: 'Your package left the warehouse via express.', tone: 'success' },
        { title: 'Out for delivery', time: 'Today', description: 'Arriving by 5:00 PM.', tone: 'warning' },
        { title: 'Delivered', time: 'Tomorrow' },
      ]}
    />
  </div>
);

export const DeployFeed = () => (
  <div style={{ width: 440, maxWidth: '100%' }}>
    <Timeline
      items={[
        { title: 'Jane merged a pull request', time: '10:02 AM', description: 'feat: add Timeline component', icon: <CheckIcon />, tone: 'success' },
        { title: 'CI build started', time: '10:03 AM', description: 'Running 248 tests on main.', icon: <DotIcon />, tone: 'primary' },
        { title: 'Release v1.3.0 published', time: '10:09 AM', description: 'Deployed to production.', icon: <TruckIcon />, tone: 'info' },
        { title: 'Rollback triggered', time: '10:14 AM', description: 'Error rate spiked — reverting.', icon: <DotIcon />, tone: 'danger' },
      ]}
    />
  </div>
);
