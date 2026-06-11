import React from "react";
import { Carousel } from "twico-ui";

const Slide = ({ bg, label }) => (
  <div
    style={{
      height: 200,
      background: bg,
      color: "#fff",
      display: "grid",
      placeItems: "center",
      fontSize: 22,
      fontWeight: 600,
    }}
  >
    {label}
  </div>
);

const variations = [
  {
    title: "Default",
    description: "Arrows, dots, and looping are on by default. Each child is one slide.",
    code: `<Carousel>
  <div>Slide 1</div>
  <div>Slide 2</div>
  <div>Slide 3</div>
</Carousel>`,
    render: () => (
      <div style={{ width: 480, maxWidth: "100%" }}>
        <Carousel>
          <Slide bg="#6366f1" label="Slide 1" />
          <Slide bg="#10b981" label="Slide 2" />
          <Slide bg="#f59e0b" label="Slide 3" />
        </Carousel>
      </div>
    ),
  },
  {
    title: "Autoplay",
    description: "Auto-advances on a timer and pauses while hovered.",
    code: `<Carousel autoPlay interval={3000}>
  <div>Slide 1</div>
  <div>Slide 2</div>
  <div>Slide 3</div>
</Carousel>`,
    render: () => (
      <div style={{ width: 480, maxWidth: "100%" }}>
        <Carousel autoPlay interval={3000}>
          <Slide bg="#0ea5e9" label="Slide 1" />
          <Slide bg="#8b5cf6" label="Slide 2" />
          <Slide bg="#ec4899" label="Slide 3" />
        </Carousel>
      </div>
    ),
  },
  {
    title: "Dots only",
    description: "Hide the arrows and navigate with the dot indicators alone.",
    code: `<Carousel showArrows={false}>
  <div>Slide 1</div>
  <div>Slide 2</div>
  <div>Slide 3</div>
</Carousel>`,
    render: () => (
      <div style={{ width: 480, maxWidth: "100%" }}>
        <Carousel showArrows={false}>
          <Slide bg="#14b8a6" label="Slide 1" />
          <Slide bg="#f43f5e" label="Slide 2" />
          <Slide bg="#a855f7" label="Slide 3" />
        </Carousel>
      </div>
    ),
  },
  {
    title: "Arrows only, no loop",
    description: "Hide the dots and stop wrapping at the first and last slide.",
    code: `<Carousel showDots={false} loop={false}>
  <div>Slide 1</div>
  <div>Slide 2</div>
  <div>Slide 3</div>
</Carousel>`,
    render: () => (
      <div style={{ width: 480, maxWidth: "100%" }}>
        <Carousel showDots={false} loop={false}>
          <Slide bg="#22c55e" label="Slide 1" />
          <Slide bg="#eab308" label="Slide 2" />
          <Slide bg="#ef4444" label="Slide 3" />
        </Carousel>
      </div>
    ),
  },
];

export default variations;
