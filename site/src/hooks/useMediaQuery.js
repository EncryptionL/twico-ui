import React from "react";

// Responsive behavior without CSS media queries — drives layout from JS so the
// site can rely solely on Twico UI components + inline style props.
export function useMediaQuery(query) {
  const get = () => (typeof window !== "undefined" ? window.matchMedia(query).matches : false);
  const [matches, setMatches] = React.useState(get);
  React.useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);
  return matches;
}
