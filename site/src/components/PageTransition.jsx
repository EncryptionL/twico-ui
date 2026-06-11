import React from "react";
import { useLocation } from "react-router-dom";
import { Box, usePrefersReducedMotion } from "twico-ui";

// Smooth page loads: re-mount the route content (via key) and play a subtle
// fade + rise. `backwards` fill-mode applies the start state up front (no flash)
// and leaves NO lingering transform — important so fixed children (e.g. a demo's
// ToastViewport) aren't re-anchored to this wrapper. Honors reduced-motion.
export default function PageTransition({ children }) {
  const { pathname } = useLocation();
  const reduced = usePrefersReducedMotion();
  return (
    <Box
      key={pathname}
      style={reduced ? undefined : { animation: "twico-slide-up var(--duration-slow) var(--ease-out) backwards" }}
    >
      {children}
    </Box>
  );
}
