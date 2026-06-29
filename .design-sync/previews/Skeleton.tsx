import { Skeleton } from 'twico-ui';

export const Variants = () => (
  <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
    <Skeleton variant="text" width={160} />
    <Skeleton variant="circle" width={48} height={48} />
    <Skeleton variant="rect" width={120} height={64} />
  </div>
);

export const TextLines = () => (
  <div style={{ width: 320, maxWidth: '100%' }}>
    <Skeleton variant="text" lines={4} />
  </div>
);

export const CustomSizing = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: 320, maxWidth: '100%' }}>
    <Skeleton variant="text" width="70%" />
    <Skeleton variant="text" width="45%" />
    <Skeleton variant="rect" width="100%" height={140} />
  </div>
);

export const CardPlaceholder = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 320, maxWidth: '100%' }}>
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Skeleton variant="circle" width={40} height={40} />
      <div style={{ flex: 1 }}>
        <Skeleton variant="text" width="60%" />
        <Skeleton variant="text" width="40%" />
      </div>
    </div>
    <Skeleton variant="rect" height={120} />
  </div>
);
