import React from "react";
import { Carousel } from "twico-ui";

export default function CarouselDemo() {
  const slides = [
    { bg: "#6366f1", label: "Slide 1" },
    { bg: "#10b981", label: "Slide 2" },
    { bg: "#f59e0b", label: "Slide 3" },
  ];
  return (
    <div style={{ width: 480, maxWidth: "100%" }}>
      <Carousel autoPlay interval={4000} loop showArrows showDots>
        {slides.map((s) => (
          <div
            key={s.label}
            style={{
              height: 220,
              background: s.bg,
              color: "#fff",
              display: "grid",
              placeItems: "center",
              fontSize: 24,
              fontWeight: 600,
            }}
          >
            {s.label}
          </div>
        ))}
      </Carousel>
    </div>
  );
}
