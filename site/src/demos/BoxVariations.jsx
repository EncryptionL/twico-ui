import React from "react";
import { Box, Text } from "twico-ui";

const variations = [
  {
    title: "Backgrounds",
    description: "Surface tokens give layered, theme-aware fills.",
    code: `<Box p={4} bg="surface" border radius="lg">
  <Text>Surface</Text>
</Box>
<Box p={4} bg="surface-raised" radius="lg">
  <Text>Raised</Text>
</Box>
<Box p={4} bg="surface-sunken" radius="lg">
  <Text>Sunken</Text>
</Box>`,
    render: () => (
      <>
        <Box p={4} bg="surface" border radius="lg">
          <Text>Surface</Text>
        </Box>
        <Box p={4} bg="surface-raised" radius="lg">
          <Text>Raised</Text>
        </Box>
        <Box p={4} bg="surface-sunken" radius="lg">
          <Text>Sunken</Text>
        </Box>
      </>
    ),
  },
  {
    title: "Radius",
    description: "Round corners with any radius token suffix.",
    code: `<Box p={4} bg="surface" border radius="sm">
  <Text>sm</Text>
</Box>
<Box p={4} bg="surface" border radius="lg">
  <Text>lg</Text>
</Box>
<Box p={4} bg="surface" border radius="2xl">
  <Text>2xl</Text>
</Box>`,
    render: () => (
      <>
        <Box p={4} bg="surface" border radius="sm">
          <Text>sm</Text>
        </Box>
        <Box p={4} bg="surface" border radius="lg">
          <Text>lg</Text>
        </Box>
        <Box p={4} bg="surface" border radius="2xl">
          <Text>2xl</Text>
        </Box>
      </>
    ),
  },
  {
    title: "Shadow",
    description: "Lift a box off the page with a shadow token.",
    code: `<Box p={4} bg="surface" radius="lg" shadow="sm">
  <Text>sm</Text>
</Box>
<Box p={4} bg="surface" radius="lg" shadow="md">
  <Text>md</Text>
</Box>
<Box p={4} bg="surface" radius="lg" shadow="lg">
  <Text>lg</Text>
</Box>`,
    render: () => (
      <>
        <Box p={4} bg="surface" radius="lg" shadow="sm">
          <Text>sm</Text>
        </Box>
        <Box p={4} bg="surface" radius="lg" shadow="md">
          <Text>md</Text>
        </Box>
        <Box p={4} bg="surface" radius="lg" shadow="lg">
          <Text>lg</Text>
        </Box>
      </>
    ),
  },
  {
    title: "Padding & margin",
    description: "Per-side spacing props take a spacing step or any CSS length.",
    code: `<Box px={6} py={3} bg="surface" border radius="lg">
  <Text>px=6 py=3</Text>
</Box>
<Box p={2} mt={4} bg="surface-sunken" radius="lg">
  <Text>p=2 mt=4</Text>
</Box>`,
    render: () => (
      <>
        <Box px={6} py={3} bg="surface" border radius="lg">
          <Text>px=6 py=3</Text>
        </Box>
        <Box p={2} mt={4} bg="surface-sunken" radius="lg">
          <Text>p=2 mt=4</Text>
        </Box>
      </>
    ),
  },
  {
    title: "Custom tag",
    description: "Render any element with the `as` prop while keeping token styling.",
    code: `<Box as="section" p={5} bg="surface" border radius="xl" shadow="sm">
  <Text>I am a &lt;section&gt;</Text>
</Box>`,
    render: () => (
      <Box as="section" p={5} bg="surface" border radius="xl" shadow="sm">
        <Text>I am a &lt;section&gt;</Text>
      </Box>
    ),
  },
  {
    title: "All props",
    description:
      "Every Box-specific prop in one place. The polymorphic `as` tag plus the as=\"a\" link props (href/target/rel, scheme-sanitized); all padding (p/px/py/pt/pr/pb/pl) and margin (m/mx/my/mt/mr/mb/ml) spacing props; the bg surface token; and the border / radius / shadow styling flags. Per-side props win over their axis (px/py) and all-sides (p) shorthands, so each element below uses one tier at a time — never both halves of a shorthand pair on the same Box.",
    code: `// Per-side spacing (most specific tier) + all the styling flags:
<Box
  as="section"          // any intrinsic tag
  pt={2} pr={5} pb={2} pl={5}        // per-side padding
  mt={0} mr="auto" mb={4} ml="auto"  // per-side margin (number = spacing step, string = any CSS length)
  bg="surface"          // surface | surface-raised | surface-sunken | bg | "--token" | any CSS background
  border={true}         // 1px token border
  radius="xl"           // radius token suffix: sm | md | lg | xl | 2xl | full
  shadow="md"           // shadow token suffix: sm | md | lg | xl
>
  <Text>Per-side spacing</Text>
</Box>

// Axis + all-sides shorthands (use these instead of the per-side props above):
<Box px={6} py={3} mx="auto" my={4} bg="surface-sunken" border radius="lg">
  <Text>px / py / mx / my axis shorthands</Text>
</Box>
<Box p={4} m={0} bg="surface-raised" radius="md">
  <Text>p / m all-sides shorthands</Text>
</Box>

// Render as a link — href is scheme-sanitized (javascript:/data:/vbscript: are dropped):
<Box as="a" href="/docs" target="_blank" rel="noopener noreferrer" p={3} bg="surface" border radius="lg">
  <Text>Open docs</Text>
</Box>`,
    render: () => (
      <>
        <Box
          as="section"
          pt={2}
          pr={5}
          pb={2}
          pl={5}
          mt={0}
          mr="auto"
          mb={4}
          ml="auto"
          bg="surface"
          border={true}
          radius="xl"
          shadow="md"
        >
          <Text>Per-side spacing</Text>
        </Box>
        <Box px={6} py={3} mx="auto" my={4} bg="surface-sunken" border radius="lg">
          <Text>px / py / mx / my axis shorthands</Text>
        </Box>
        <Box p={4} m={0} bg="surface-raised" radius="md">
          <Text>p / m all-sides shorthands</Text>
        </Box>
        <Box as="a" href="/docs" target="_blank" rel="noopener noreferrer" p={3} bg="surface" border radius="lg">
          <Text>Open docs</Text>
        </Box>
      </>
    ),
  },
];

export default variations;
