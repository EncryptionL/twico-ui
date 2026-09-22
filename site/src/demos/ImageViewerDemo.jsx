import React from "react";
import { ImageViewer } from "twico-ui";

// Self-contained sample image (inline SVG data URI) — no CDN, no external asset. A schematic-style drawing
// with fine detail so the zoom/pan is meaningful.
const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='500' viewBox='0 0 800 500'>
  <rect width='800' height='500' fill='#f1f5f9'/>
  <g stroke='#cbd5e1' stroke-width='1'>
    ${Array.from({ length: 40 }, (_, i) => `<line x1='${i * 20}' y1='0' x2='${i * 20}' y2='500'/>`).join("")}
    ${Array.from({ length: 25 }, (_, i) => `<line x1='0' y1='${i * 20}' x2='800' y2='${i * 20}'/>`).join("")}
  </g>
  <circle cx='400' cy='250' r='150' fill='none' stroke='#2563eb' stroke-width='3'/>
  <circle cx='400' cy='250' r='90' fill='none' stroke='#2563eb' stroke-width='2'/>
  <rect x='320' y='170' width='160' height='160' fill='none' stroke='#dc2626' stroke-width='2'/>
  <text x='400' y='40' font-family='sans-serif' font-size='20' fill='#0f172a' text-anchor='middle'>Sample schematic — zoom in</text>
  <text x='400' y='470' font-family='monospace' font-size='11' fill='#475569' text-anchor='middle'>scale 1:100 · rev A · ⌀300 bore · tol ±0.05</text>
</svg>`;
const src = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

export default function ImageViewerDemo() {
  return <ImageViewer src={src} alt="Sample schematic drawing" style={{ height: 360, maxWidth: 640 }} />;
}
