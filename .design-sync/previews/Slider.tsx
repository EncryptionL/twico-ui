import { Slider } from 'twico-ui';

export const Default = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 28, width: 340, maxWidth: '100%' }}>
    <Slider label="Volume" defaultValue={40} showValue />
    <Slider
      label="Price"
      min={0}
      max={1000}
      step={50}
      defaultValue={250}
      showTicks
      formatValue={(v) => `$${v}`}
    />
  </div>
);

export const Tones = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: 340, maxWidth: '100%' }}>
    <Slider label="Primary" tone="primary" defaultValue={60} />
    <Slider label="Success" tone="success" defaultValue={75} />
    <Slider label="Warning" tone="warning" defaultValue={45} />
    <Slider label="Danger" tone="danger" defaultValue={30} />
  </div>
);

export const Ticks = () => (
  <div style={{ width: 340, maxWidth: '100%' }}>
    <Slider
      label="Zoom"
      min={50}
      max={300}
      step={25}
      defaultValue={150}
      showTicks
      formatValue={(v) => `${v}%`}
    />
  </div>
);

export const States = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 28, width: 340, maxWidth: '100%' }}>
    <Slider label="Locked" defaultValue={60} disabled />
    <Slider label="Bitrate" defaultValue={20} tone="danger" error="Too low for streaming" />
  </div>
);
