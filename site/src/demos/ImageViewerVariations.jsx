import React from "react";
import { ImageViewer } from "twico-ui";

const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='500' viewBox='0 0 800 500'>
  <rect width='800' height='500' fill='#f1f5f9'/>
  <g stroke='#cbd5e1' stroke-width='1'>
    ${Array.from({ length: 40 }, (_, i) => `<line x1='${i * 20}' y1='0' x2='${i * 20}' y2='500'/>`).join("")}
    ${Array.from({ length: 25 }, (_, i) => `<line x1='0' y1='${i * 20}' x2='800' y2='${i * 20}'/>`).join("")}
  </g>
  <circle cx='400' cy='250' r='150' fill='none' stroke='#2563eb' stroke-width='3'/>
  <rect x='320' y='170' width='160' height='160' fill='none' stroke='#dc2626' stroke-width='2'/>
  <text x='400' y='40' font-family='sans-serif' font-size='20' fill='#0f172a' text-anchor='middle'>Sample schematic — zoom in</text>
</svg>`;
const src = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

const variations = [
  {
    title: "Default",
    description: "Wheel / pinch to zoom about the pointer, drag to pan when zoomed, +/-/0 keys, double-click to toggle. Size the stage via style.",
    code: `<ImageViewer src={src} alt="Sample schematic drawing" style={{ height: 360 }} />`,
    render: () => <ImageViewer src={src} alt="Sample schematic drawing" style={{ height: 320, maxWidth: 560 }} />,
  },
  {
    title: "No built-in controls",
    description: "controls={false} hides the built-in zoom bar (keyboard + wheel + pinch still work).",
    code: `<ImageViewer src={src} alt="Map" controls={false} style={{ height: 300 }} />`,
    render: () => <ImageViewer src={src} alt="Sample drawing, no controls" controls={false} style={{ height: 260, maxWidth: 480 }} />,
  },
  {
    title: "Custom max zoom + controlled",
    description: "Drive zoom yourself with zoom / onZoomChange, and raise maxZoom for fine inspection.",
    code: `const [zoom, setZoom] = React.useState(1);
<ImageViewer src={src} alt="Photo" zoom={zoom} onZoomChange={setZoom} maxZoom={12} style={{ height: 320 }} />`,
    render: function Controlled() {
      const [zoom, setZoom] = React.useState(1);
      return <ImageViewer src={src} alt="Sample drawing, controlled zoom" zoom={zoom} onZoomChange={setZoom} maxZoom={12} style={{ height: 260, maxWidth: 480 }} />;
    },
  },
];

export default variations;
