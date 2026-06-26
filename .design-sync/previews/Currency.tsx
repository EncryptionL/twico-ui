import { Currency } from 'twico-ui';

export const Variants = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 280 }}>
    <Currency label="Amount (USD)" currency="USD" defaultValue={1299.5} />
    <Currency label="Amount (EUR)" currency="EUR" defaultValue={2450} />
    <Currency label="Amount (IDR)" currency="IDR" defaultValue={1500000} />
  </div>
);
