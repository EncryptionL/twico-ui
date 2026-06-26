import { Stat } from 'twico-ui';

export const Variants = () => (
  <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
    <Stat label="Revenue" value="$48.2k" delta="+12.5%" helpText="vs last month" />
    <Stat label="Active users" value="2,318" delta="-3.1%" helpText="vs last week" />
    <Stat label="Churn" value="1.2%" delta="0%" deltaDirection="flat" />
  </div>
);
