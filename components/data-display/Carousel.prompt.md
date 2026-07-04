Sliding carousel with arrows, dots, looping, and optional autoplay.

```jsx
import { Carousel } from "./Carousel";

<Carousel label="Highlights" autoPlay interval={5000}>
  <img src="/a.jpg" alt="" />
  <img src="/b.jpg" alt="" />
  <div>Any slide content</div>
</Carousel>
```

Each child is a slide. Props: `label` (accessible name for the region), `showArrows`, `showDots`,
`showPauseButton`, `loop`, `autoPlay`, `interval`, `pauseLabel`/`playLabel`.

Accessibility: the region is focusable — ArrowLeft/ArrowRight step slides, Home/End jump to the
first/last; a polite live region announces the active slide. Autoplay pauses on hover/focus, via the
pause button, and when `prefers-reduced-motion` is set. Always give it an accessible name via `label`
(or `aria-label` / `aria-labelledby`).
