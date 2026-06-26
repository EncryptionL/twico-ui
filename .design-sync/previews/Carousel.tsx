import { Carousel } from 'twico-ui';

const slide = (bg: string, label: string) => (
  <div style={{ height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', background: bg, color: '#fff', fontSize: 20, fontWeight: 600, borderRadius: 12 }}>
    {label}
  </div>
);

export const Default = () => (
  <div style={{ maxWidth: 420 }}>
    <Carousel showArrows showDots loop>
      {slide('#6366F1', 'Slide one')}
      {slide('#0EA5E9', 'Slide two')}
      {slide('#10B981', 'Slide three')}
    </Carousel>
  </div>
);
