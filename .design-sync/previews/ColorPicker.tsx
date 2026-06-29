import { ColorPicker } from 'twico-ui';

const palette = ['#6366F1', '#14B8A6', '#F43F5E', '#F59E0B', '#0EA5E9', '#8B5CF6', '#22C55E'];

export const BrandColor = () => (
  <div style={{ width: 320, maxWidth: '100%' }}>
    <ColorPicker
      label="Brand color"
      defaultValue="#6366F1"
      presets={palette}
      hint="Pick from the palette or enter a hex."
    />
  </div>
);

export const Accent = () => (
  <div style={{ width: 320, maxWidth: '100%' }}>
    <ColorPicker
      label="Accent"
      defaultValue="#14B8A6"
      presets={['#6366F1', '#14B8A6', '#F43F5E', '#F59E0B', '#0EA5E9']}
    />
  </div>
);

export const ThemeColor = () => (
  <div style={{ width: 320, maxWidth: '100%' }}>
    <ColorPicker label="Theme color" required tone="info" defaultValue="#8B5CF6" presets={palette} />
  </div>
);

export const Disabled = () => (
  <div style={{ width: 320, maxWidth: '100%' }}>
    <ColorPicker label="Locked color" defaultValue="#F43F5E" disabled />
  </div>
);
