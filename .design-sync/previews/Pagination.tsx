import { Pagination } from 'twico-ui';

export const Variants = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
    <Pagination total={10} defaultPage={3} />
    <Pagination total={20} defaultPage={7} siblings={1} boundaries={1} />
    <Pagination total={8} defaultPage={1} size="sm" showPageJumper />
  </div>
);
