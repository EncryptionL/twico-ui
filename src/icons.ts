// twico-ui/icons — the full Lucide icon set, re-exported.
//
// Twico UI's visual language is built around Lucide (https://lucide.dev), so this
// subpath gives you every Lucide icon as a React component, from one place:
//
//   import { Home, Settings, Search } from "twico-ui/icons";
//   <Button leftIcon={<Home size={16} />}>Home</Button>
//
// `lucide-react` is an OPTIONAL PEER DEPENDENCY: the twico-ui core keeps its zero
// runtime dependencies, and you install lucide-react only if you use this subpath:
//
//   npm install lucide-react
//
// Tree-shakeable (only the icons you import are bundled), and the icons are plain
// SVG components with no hooks, so they render in React Server Components too.
export * from "lucide-react";
