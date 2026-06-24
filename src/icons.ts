// twico-ui/icons — the full Lucide icon set, re-exported.
//
// Twico UI's visual language is built around Lucide (https://lucide.dev), so this
// subpath gives you every Lucide icon as a React component, from one place:
//
//   import { Home, Settings, Search } from "twico-ui/icons";
//   <Button leftIcon={<Home size={16} />}>Home</Button>
//
// `lucide-react` is an OPTIONAL PEER DEPENDENCY: the twico-ui core keeps its zero
// runtime dependencies, and you install lucide-react only if you use the Lucide
// icons below (the brand icons further down need NO peer dependency):
//
//   npm install lucide-react
//
// Tree-shakeable (only the icons you import are bundled), and the icons are plain
// SVG components with no hooks, so they render in React Server Components too.
export * from "lucide-react";

// Lucide intentionally ships no brand/logo marks, so twico-ui adds a curated set of
// popular brand icons (GithubIcon, VercelIcon, FigmaIcon, …) as zero-dependency
// inline SVG — built into twico-ui itself, no peer dependency required. Every name
// is verified to never collide with a Lucide export. See ./brand-icons.tsx.
export * from "./brand-icons";
