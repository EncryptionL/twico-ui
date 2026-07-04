Bubble chart — a `ScatterChart` preset that sizes each dot by a third value (`z`). Same API as ScatterChart; `bubble` is on by default.

```jsx
import { BubbleChart } from "./BubbleChart";

<BubbleChart
  series={[
    { name: "Plans", points: [
      { x: 12, y: 40, z: 800, label: "Starter" },
      { x: 26, y: 65, z: 2400, label: "Team" },
      { x: 48, y: 82, z: 5200, label: "Business" },
    ]},
  ]}
  xLabel="Seats"
  yLabel="Satisfaction"
/>
```

Takes every `ScatterChart` prop — `series` ({name?, color?, points:[{x,y,z?,label?}]}), `maxBubble` (largest
radius px), `dotRadius`, `xLabel`/`yLabel`, `showGrid`, `showLegend`, `xFormat`/`yFormat`, `height`,
`tableFallback`/`caption`. Each point's `z` sets its bubble area. A visually-hidden data table (default on)
exposes the point values behind the `role="img"` SVG.
