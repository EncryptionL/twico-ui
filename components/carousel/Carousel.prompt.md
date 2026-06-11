Sliding carousel with arrows, dots, looping, and optional autoplay (pauses on hover).

```jsx
import { Carousel } from "./Carousel";

<Carousel autoPlay interval={5000}>
  <img src="/a.jpg" alt="" />
  <img src="/b.jpg" alt="" />
  <div>Any slide content</div>
</Carousel>
```

Each child is a slide. Props: `showArrows`, `showDots`, `loop`, `autoPlay`, `interval`.
