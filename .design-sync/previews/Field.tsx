import { Field } from 'twico-ui';

const inputStyle = {
  width: '100%',
  padding: '8px 10px',
  borderRadius: 8,
  border: '1px solid var(--color-border)',
  font: 'inherit',
  boxSizing: 'border-box' as const,
};

export const Variants = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 340 }}>
    <Field label="Email" hint="We'll never share it." required htmlFor="email">
      <input id="email" type="email" placeholder="you@example.com" style={inputStyle} />
    </Field>
    <Field label="API token" error="That token is invalid." htmlFor="token">
      <input id="token" placeholder="sk-…" aria-invalid style={inputStyle} />
    </Field>
  </div>
);
