import { CurrencyField } from 'twico-ui';

export const Variants = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 340 }}>
    <CurrencyField label="Price" defaultCurrency="USD" defaultValue={1299.5} />
    <CurrencyField label="Budget" defaultCurrency="EUR" defaultValue={5000} hint="Pick a currency, then enter an amount." />
  </div>
);
