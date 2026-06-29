import { Textarea } from 'twico-ui';

export const Default = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 340, maxWidth: '100%' }}>
    <Textarea label="Bio" rows={4} placeholder="Tell us about yourself" hint="Max 280 characters" />
    <Textarea
      label="Release notes"
      required
      rows={3}
      defaultValue="Added dark mode, RTL support, and a density scale."
    />
  </div>
);

export const Sizes = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 340, maxWidth: '100%' }}>
    <Textarea label="Small" size="sm" rows={2} placeholder="Compact field" />
    <Textarea label="Medium" size="md" rows={2} placeholder="Default field" />
    <Textarea label="Large" size="lg" rows={2} placeholder="Roomy field" />
  </div>
);

export const States = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 340, maxWidth: '100%' }}>
    <Textarea label="Feedback" rows={3} placeholder="What went wrong?" error="This field is required" />
    <Textarea
      label="Internal notes"
      rows={3}
      disabled
      defaultValue="This content cannot be edited."
    />
  </div>
);

export const Tones = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 340, maxWidth: '100%' }}>
    <Textarea label="Comment" tone="info" rows={2} defaultValue="Looks great — ship it." />
    <Textarea label="Approval" tone="success" rows={2} defaultValue="Reviewed and approved." />
  </div>
);
