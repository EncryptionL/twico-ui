import { Avatar } from 'twico-ui';

const PHOTO = 'https://i.pravatar.cc/96?img=12';

export const Default = () => (
  <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
    <Avatar src={PHOTO} name="Jane Doe" size="lg" />
    <Avatar name="Sam Lee" size="lg" />
    <Avatar name="Ava Park" size="lg" status="online" />
  </div>
);

export const Sizes = () => (
  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
    <Avatar name="Jane Doe" size="xs" />
    <Avatar name="Jane Doe" size="sm" />
    <Avatar name="Jane Doe" size="md" />
    <Avatar name="Jane Doe" size="lg" />
    <Avatar name="Jane Doe" size="xl" />
  </div>
);

export const Presence = () => (
  <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
    <Avatar name="Ava Park" status="online" />
    <Avatar name="Ben Cole" status="busy" />
    <Avatar name="Mia Ito" status="away" />
    <Avatar name="Leo Kim" status="offline" />
  </div>
);

export const ShapeAndRing = () => (
  <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
    <Avatar name="Twico Labs" size="lg" square />
    <Avatar src={PHOTO} name="Jane Doe" size="lg" ring />
    <Avatar name="Acme Co" size="lg" square ring />
  </div>
);

export const Group = () => {
  const team = [
    { src: 'https://i.pravatar.cc/96?img=5', name: 'Jane Doe' },
    { src: 'https://i.pravatar.cc/96?img=15', name: 'Sam Lee' },
    { src: 'https://i.pravatar.cc/96?img=33', name: 'Ava Park' },
    { src: 'https://i.pravatar.cc/96?img=47', name: 'Mia Ito' },
  ];
  return (
    <div style={{ display: 'flex' }}>
      {team.map((m, i) => (
        <div key={m.name} style={{ marginInlineStart: i === 0 ? 0 : -10 }}>
          <Avatar src={m.src} name={m.name} size="md" ring />
        </div>
      ))}
    </div>
  );
};
